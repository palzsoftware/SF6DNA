import { connectLocalQaGifToMoves, isLocalQaGifRequestFromEnv } from "@/lib/local-qa-gif";
import { loadLocalQaGifDoc, loadMp4MoveIdsFor } from "@/lib/local-qa-gif-sources";
import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

/**
 * キャラクター詳細ページの「技バンドル」へ、ローカルQA用GIFを接続する(ページから1行で呼ぶ想定)。
 *  - 開発環境のlocalhost以外(本番・Preview・外部ホスト)では、入力のバンドルをそのまま返す(何もしない)
 *  - 既に media がある技、または既存MP4マニフェストで承認済みclipがある技には触れない(MP4優先)
 *  - 他の技・バンドルの他の項目は変更しない(新しいオブジェクトを返す)
 */
export async function connectLocalQaGifToBundle<M extends { id: string; slug: string; media?: DevicePreviewMoveMotionMedia | null }, B extends { moves: M[] }>(
  input: { characterSlug: string; bundle: B | null; host: string | null },
): Promise<B | null> {
  const { characterSlug, bundle, host } = input;
  if (!bundle || !isLocalQaGifRequestFromEnv(host)) return bundle;
  const doc = await loadLocalQaGifDoc(characterSlug);
  if (!doc) return bundle;
  const { moves } = connectLocalQaGifToMoves({
    doc, characterSlug, moves: bundle.moves, extraMovesWithMedia: await loadMp4MoveIdsFor(characterSlug),
  });
  return { ...bundle, moves };
}
