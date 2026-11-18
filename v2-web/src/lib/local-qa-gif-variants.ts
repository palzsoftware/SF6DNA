import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";
import { LOCAL_QA_MEDIA_STATUS, isSafeQaGifFileName, type LocalQaGifEntry } from "@/lib/local-qa-gif";

// ローカルQA専用: 「同じ技IDに、通常/チャージ/パーフェクトの複数GIFを切り替えて見せる」ためのルール。
// 技IDは増やさない(既存の技IDにぶら下げるだけ)。公開承認ではない。
//   CONNECTED               : 親の技(通常版)が既にローカル接続済み。派生を足して切り替え表示できる
//   PENDING_PARENT_STRENGTH : 親の技の強度(弱/中/強)がまだ確認できていない。技カードには接続せず、表示の試作のみ

export const LOCAL_QA_VARIANT_KEYS = ["normal", "charged", "perfect"] as const;
export type LocalQaVariantKey = (typeof LOCAL_QA_VARIANT_KEYS)[number];
export const LOCAL_QA_VARIANT_LABELS: Record<LocalQaVariantKey, string> = { normal: "通常", charged: "チャージ", perfect: "パーフェクト" };

export type LocalQaVariant = {
  variantKey: LocalQaVariantKey;
  fileName: string;
  sha256: string;
  bytes: number;
  durationMs: number;
  sourceFile: string;
  observation: string;
};
export type LocalQaVariantGroup = {
  moveId: string;
  moveSlug: string;
  connection: "CONNECTED" | "PENDING_PARENT_STRENGTH";
  pendingReason?: string;
  variants: LocalQaVariant[];
};
export type LocalQaVariantDoc = {
  schemaVersion: number;
  characterSlug: string;
  localQaOnly: boolean;
  approval: string;
  groups: LocalQaVariantGroup[];
};
export type LocalQaVariantSkipReason =
  | "DOC_NOT_LOCAL_QA_ONLY" | "DOC_APPROVAL_NOT_NOT_APPROVED" | "MOVE_NOT_FOUND" | "SLUG_MISMATCH"
  | "MP4_PRIORITY_KEPT" | "UNSAFE_FILE_NAME" | "INVALID_VARIANT_KEY" | "DUPLICATE_VARIANT_KEY" | "TOO_FEW_VARIANTS"
  | "DUPLICATE_GROUP" | "PARENT_NOT_CONNECTED" | "PARENT_FILE_MISMATCH" | "DUPLICATE_CONTENT";
export type LocalQaVariantPlan = {
  accepted: LocalQaVariantGroup[];
  skipped: Array<{ moveSlug: string; reason: LocalQaVariantSkipReason }>;
};

/** 表示してよい派生グループだけを選ぶ。入力は変更しない。 */
export function planLocalQaVariantGroups(input: {
  doc: LocalQaVariantDoc;
  moves: ReadonlyArray<{ id: string; slug: string }>;
  movesWithMedia: ReadonlySet<string>; // 既存MP4・既存mediaを持つ技ID(MP4優先)
  connectedEntries: ReadonlyArray<LocalQaGifEntry>; // 既にローカル接続済みの通常版GIF
}): LocalQaVariantPlan {
  const { doc, moves, movesWithMedia, connectedEntries } = input;
  const skipAll = (reason: LocalQaVariantSkipReason): LocalQaVariantPlan => ({ accepted: [], skipped: doc.groups.map((g) => ({ moveSlug: g.moveSlug, reason })) });
  if (doc.localQaOnly !== true) return skipAll("DOC_NOT_LOCAL_QA_ONLY");
  if (doc.approval !== "NOT_APPROVED") return skipAll("DOC_APPROVAL_NOT_NOT_APPROVED");
  const slugById = new Map(moves.map((m) => [m.id, m.slug]));
  const parentById = new Map(connectedEntries.map((e) => [e.moveId, e]));
  const accepted: LocalQaVariantGroup[] = [];
  const skipped: LocalQaVariantPlan["skipped"] = [];
  const seenMoves = new Set<string>();
  for (const g of doc.groups) {
    const skip = (reason: LocalQaVariantSkipReason) => skipped.push({ moveSlug: g.moveSlug, reason });
    const keys = g.variants.map((v) => v.variantKey);
    const shas = g.variants.map((v) => v.sha256);
    if (!slugById.has(g.moveId)) skip("MOVE_NOT_FOUND");
    else if (slugById.get(g.moveId) !== g.moveSlug) skip("SLUG_MISMATCH");
    else if (movesWithMedia.has(g.moveId) && !parentById.has(g.moveId)) skip("MP4_PRIORITY_KEPT");
    else if (seenMoves.has(g.moveId)) skip("DUPLICATE_GROUP");
    else if (g.variants.length < 2) skip("TOO_FEW_VARIANTS");
    else if (g.variants.some((v) => !isSafeQaGifFileName(v.fileName))) skip("UNSAFE_FILE_NAME");
    else if (keys.some((k) => !LOCAL_QA_VARIANT_KEYS.includes(k))) skip("INVALID_VARIANT_KEY");
    else if (new Set(keys).size !== keys.length) skip("DUPLICATE_VARIANT_KEY");
    else if (new Set(shas).size !== shas.length) skip("DUPLICATE_CONTENT"); // 同じ映像を別パターンとして出さない
    else if (g.connection === "CONNECTED") {
      const parent = parentById.get(g.moveId);
      const normal = g.variants.find((v) => v.variantKey === "normal");
      if (!parent) skip("PARENT_NOT_CONNECTED");
      else if (!normal || normal.fileName !== parent.fileName || normal.sha256 !== parent.sha256) skip("PARENT_FILE_MISMATCH"); // 既存の通常版を差し替えない
      else { seenMoves.add(g.moveId); accepted.push(g); }
    } else { seenMoves.add(g.moveId); accepted.push(g); }
  }
  return { accepted, skipped };
}

/** 派生パターン1件ぶんのメディア記録。status が承認済みに見えないことを保証する。 */
export function toVariantMotionMedia(v: LocalQaVariant, characterSlug: string, moveSlug: string, moveId: string, displayOrder: number): DevicePreviewMoveMotionMedia {
  return {
    id: `local-qa-variant-${characterSlug}-${moveSlug}-${v.variantKey}`,
    moveId,
    mediaType: "gif",
    mediaUrl: `/internal/gif-qa/${characterSlug}/media/${v.fileName}`,
    posterUrl: null, sourceUrl: null, sourceLabel: null,
    status: LOCAL_QA_MEDIA_STATUS,
    displayOrder,
  };
}
