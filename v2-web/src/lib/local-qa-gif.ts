import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";
import { isWs5LocalCardRequest } from "./official-txt-character-page-connection.mjs";

// ローカルQA専用のGIF表示ルール(全キャラ共通)。
// ここを通ったGIFは「確認用に画面で見られる」だけで、公開承認ではない。
//   1. 開発環境(NODE_ENV=development)・localhost・環境変数SF6DNA_WS5_TXT_PREVIEW=1 のときだけ動く(既存の隔離ルートと同じ条件)
//   2. データが localQaOnly=true かつ approval=NOT_APPROVED のものだけ受け付ける
//   3. 技ID・slugが公開用データと一致しない/他キャラの技は表示しない
//   4. 既存MP4(承認済み)や既存mediaを持つ技にはGIFを上乗せしない(MP4優先)
//   5. 1技につきGIFは1件

export const LOCAL_QA_MEDIA_STATUS = "local_qa_not_approved" as const;

export type LocalQaGifEntry = {
  moveId: string;
  moveSlug: string;
  fileName: string;
  sha256: string;
  bytes: number;
  width: number;
  height: number;
  durationMs: number;
  sourceFile: string;
  visualQa: string;
  observation: string;
  unconfirmed: string[];
  /** 根拠の強さ。未記載=入力表示等で確定。COMPOSITE_WEAK_STRENGTH=強度が複合根拠のみ(公開候補から分離) */
  evidenceTier?: "COMPOSITE_WEAK_STRENGTH";
  /** false の素材は公開候補に含めない(ローカルQA表示のみ) */
  publicCandidate?: boolean;
};
export type LocalQaGifDoc = {
  schemaVersion: number;
  characterSlug: string;
  localQaOnly: boolean;
  approval: string;
  entries: LocalQaGifEntry[];
};
export type LocalQaSkipReason =
  | "DOC_NOT_LOCAL_QA_ONLY" | "DOC_APPROVAL_NOT_NOT_APPROVED" | "UNSAFE_FILE_NAME"
  | "MOVE_NOT_FOUND" | "SLUG_MISMATCH" | "MP4_PRIORITY_KEPT" | "DUPLICATE_MOVE_ID";
export type LocalQaGifPlan = {
  accepted: LocalQaGifEntry[];
  skipped: Array<{ moveSlug: string; reason: LocalQaSkipReason }>;
};

/** 開発用ローカル要求かどうか(既存の隔離ルートと同じ判定を再利用)。 */
export function isLocalQaGifRequest(env: { nodeEnv?: string; vercelEnv?: string; vercel?: string; enabled?: string; host?: string | null }): boolean {
  return isWs5LocalCardRequest(env) === true;
}

/** 環境変数とHostヘッダから入口判定する(ページ・配信ルート共通)。 */
export function isLocalQaGifRequestFromEnv(host: string | null): boolean {
  return isLocalQaGifRequest({
    nodeEnv: process.env.NODE_ENV, vercelEnv: process.env.VERCEL_ENV, vercel: process.env.VERCEL,
    enabled: process.env.SF6DNA_WS5_TXT_PREVIEW, host,
  });
}

/** ファイル名は英小文字・数字・ハイフンの .gif のみ(パス操作を防ぐ)。 */
export function isSafeQaGifFileName(name: string): boolean {
  return /^[a-z0-9][a-z0-9-]*\.gif$/.test(name);
}

/** 表示してよいGIFだけを選ぶ。入力は変更しない。 */
export function planLocalQaGifs(input: {
  doc: LocalQaGifDoc;
  moves: ReadonlyArray<{ id: string; slug: string }>;
  movesWithMedia: ReadonlySet<string>; // 既存MP4・既存mediaを持つ技ID
}): LocalQaGifPlan {
  const { doc, moves, movesWithMedia } = input;
  const accepted: LocalQaGifEntry[] = [];
  const skipped: LocalQaGifPlan["skipped"] = [];
  const all = (reason: LocalQaSkipReason) => ({ accepted: [], skipped: doc.entries.map((e) => ({ moveSlug: e.moveSlug, reason })) });
  if (doc.localQaOnly !== true) return all("DOC_NOT_LOCAL_QA_ONLY");
  if (doc.approval !== "NOT_APPROVED") return all("DOC_APPROVAL_NOT_NOT_APPROVED");
  const byId = new Map(moves.map((m) => [m.id, m.slug]));
  const seen = new Set<string>();
  for (const e of doc.entries) {
    const skip = (reason: LocalQaSkipReason) => skipped.push({ moveSlug: e.moveSlug, reason });
    if (!isSafeQaGifFileName(e.fileName)) skip("UNSAFE_FILE_NAME");
    else if (!byId.has(e.moveId)) skip("MOVE_NOT_FOUND");
    else if (byId.get(e.moveId) !== e.moveSlug) skip("SLUG_MISMATCH");
    else if (movesWithMedia.has(e.moveId)) skip("MP4_PRIORITY_KEPT");
    else if (seen.has(e.moveId)) skip("DUPLICATE_MOVE_ID");
    else { seen.add(e.moveId); accepted.push(e); }
  }
  return { accepted, skipped };
}

/** 既存の技カードUIに渡すメディア記録。status が承認済みに見えないことを保証する。 */
export function toLocalQaMotionMedia(entry: LocalQaGifEntry, characterSlug: string, displayOrder: number): DevicePreviewMoveMotionMedia {
  return {
    id: `local-qa-gif-${characterSlug}-${entry.moveSlug}`,
    moveId: entry.moveId,
    mediaType: "gif",
    mediaUrl: `/internal/gif-qa/${characterSlug}/media/${entry.fileName}`,
    posterUrl: null,
    sourceUrl: null,
    sourceLabel: null,
    status: LOCAL_QA_MEDIA_STATUS,
    displayOrder,
  };
}

/**
 * 技一覧にローカルQA用GIFを接続する(正式な技カード接続で呼ぶ想定の共通関数)。
 *  - 既に media がある技(MP4など)は一切変更しない = MP4優先
 *  - 受理されたGIFだけを media に入れる。入力の配列・技オブジェクトは変更せず新しい配列を返す
 */
export function connectLocalQaGifToMoves<M extends { id: string; slug: string; media?: DevicePreviewMoveMotionMedia | null }>(input: {
  doc: LocalQaGifDoc;
  characterSlug: string;
  moves: ReadonlyArray<M>;
  extraMovesWithMedia?: ReadonlySet<string>; // 別経路(MP4マニフェスト等)でメディアを持つ技ID
}): { moves: M[]; plan: LocalQaGifPlan } {
  const { doc, characterSlug, moves } = input;
  const movesWithMedia = new Set<string>(input.extraMovesWithMedia ?? []);
  for (const m of moves) if (m.media) movesWithMedia.add(m.id);
  const plan = planLocalQaGifs({ doc, moves, movesWithMedia });
  const byMove = new Map(plan.accepted.map((entry, index) => [entry.moveId, toLocalQaMotionMedia(entry, characterSlug, index)]));
  return { moves: moves.map((m) => (byMove.has(m.id) ? { ...m, media: byMove.get(m.id)! } : m)), plan };
}
