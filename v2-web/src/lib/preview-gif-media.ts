import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

// 全キャラ共通のGIF取り込み(Preview専用)。まだどこからも呼ばれていない独立モジュール。
// ルールは Luke GIF(preview-motion-media-pilot.ts) と同じ:
//   1. verification_status が "approved_for_preview" のクリップだけを表示対象にする(未承認は常に非表示)
//   2. その技に既にMP4(承認済み)がある場合はMP4を維持し、GIFは上乗せしない
//   3. 同じ技(move_id)のGIFは1件だけ(重複防止)
//   4. media_type が gif 以外は拾わない

/** 表示に必要な最小限のフィールド。マニフェスト(scripts/gif-intake の出力)の clips がこの形。 */
export type GifIntakeClip = {
  move_id: string;
  move_slug: string;
  variant: string;
  media_type: string;
  media_url: string;
  poster_url?: string | null;
  verification_status: string;
};

export type GifIntakeManifest = {
  character_slug: string;
  clips: ReadonlyArray<GifIntakeClip>;
};

/** 表示してよいクリップだけを返す。入力は変更しない。 */
export function selectDisplayableGifClips(
  clips: ReadonlyArray<GifIntakeClip>,
  movesWithMp4: ReadonlySet<string>,
): GifIntakeClip[] {
  const seen = new Set<string>();
  const result: GifIntakeClip[] = [];
  for (const clip of clips) {
    if (clip.verification_status !== "approved_for_preview") continue; // 未承認は出さない
    if (clip.media_type !== "gif") continue;
    if (movesWithMp4.has(clip.move_id)) continue; // MP4優先
    if (seen.has(clip.move_id)) continue; // 1技につきGIFは1件
    seen.add(clip.move_id);
    result.push(clip);
  }
  return result;
}

function toPreviewGifRecord(clip: GifIntakeClip, displayOrder: number, characterSlug: string): DevicePreviewMoveMotionMedia {
  return {
    id: `${characterSlug}-motion-gif-${clip.move_slug}-${clip.variant}`,
    moveId: clip.move_id,
    mediaType: "gif",
    mediaUrl: clip.media_url,
    posterUrl: clip.poster_url ?? null,
    sourceUrl: null,
    sourceLabel: "ユーザー録画（Preview GIF）",
    status: clip.verification_status,
    displayOrder,
  };
}

/** 1キャラ分のマニフェストをPreview用の記録に変換する。 */
export function getGifIntakeMotionMedia(
  manifest: GifIntakeManifest,
  movesWithMp4: ReadonlySet<string>,
  firstDisplayOrder = 0,
): DevicePreviewMoveMotionMedia[] {
  return selectDisplayableGifClips(manifest.clips, movesWithMp4).map((clip, index) =>
    toPreviewGifRecord(clip, firstDisplayOrder + index, manifest.character_slug),
  );
}
