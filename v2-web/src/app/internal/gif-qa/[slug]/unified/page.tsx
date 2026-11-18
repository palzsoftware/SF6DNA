import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CharacterUnifiedPage } from "@/components/character-unified-page";
import type { UnifiedMove } from "@/lib/character-unified-contract";
import type { DevicePreviewBundle } from "@/lib/device-preview";
import { getPreviewPilotMotionMedia } from "@/lib/preview-motion-media-pilot";
import { isLocalQaGifRequestFromEnv, planLocalQaGifs } from "@/lib/local-qa-gif";
import { connectLocalQaGifToBundle } from "@/lib/local-qa-gif-page";
import { loadLocalQaGifDoc, loadMp4MoveIdsFor } from "@/lib/local-qa-gif-sources";
import type { CharacterDetail } from "@/types/character";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "技カード統合・ローカルQA確認", robots: { index: false, follow: false } };

/**
 * 通常のキャラクター詳細ページと同じ CharacterUnifiedPage に、ローカルQA用GIFを接続して表示する隔離ルート。
 * 正式な接続(/characters/[slug]への組み込み)の前に、「通常ページの部品でGIFが出るか・MP4が優先されるか」を確かめるためのもの。
 *  - 公開用データ(fixture)の技一覧をそのまま使い、既存MP4(承認済みclip)を先に付ける(通常のPreviewと同じ)
 *  - その後、media が無い技にだけ未承認のQA用GIFを付ける
 *  - /characters/[slug] や既存の表示経路は変更しない。Supabase無しでも動く(通常ページはSupabaseが必要)
 * 開発環境のlocalhost以外は404。
 */
export default async function LocalQaUnified({ params }: { params: Promise<{ slug: string }> }) {
  const h = await headers();
  if (!isLocalQaGifRequestFromEnv(h.get("host"))) notFound();
  const { slug } = await params;
  const doc = await loadLocalQaGifDoc(slug);
  if (!doc) notFound();
  const { default: fixture } = await import("@/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
  const fx = (fixture.characters as unknown as Record<string, { characterId: string; moves: UnifiedMove[] }>)[slug];
  if (!fx) notFound();

  // 1) 既存のPreview用MP4(承認済み)を、通常ページと同じ関数で付ける
  const mp4ByMove = new Map(getPreviewPilotMotionMedia(fx.characterId).map((m) => [m.moveId, m]));
  const withMp4 = fx.moves.map((m) => (mp4ByMove.has(m.id) ? { ...m, media: mp4ByMove.get(m.id)! } : m));
  // 2) 正式なキャラクター詳細ページへ入れる予定の関数(connectLocalQaGifToBundle)と同じものを、ここでも使う。
  //    media が無い技にだけ、未承認のQA用GIFが付く
  const baseBundle: DevicePreviewBundle = { guideSections: [], moves: withMp4, combos: [], setups: [], sequences: [], matchups: [], training: [] };
  const bundle = (await connectLocalQaGifToBundle({ characterSlug: slug, bundle: baseBundle, host: h.get("host") })) ?? baseBundle;
  const moves = bundle.moves;
  // バナー表示用の件数(接続結果と同じ規則で数える)
  const plan = planLocalQaGifs({ doc, moves: withMp4, movesWithMedia: new Set([...withMp4.filter((m) => m.media).map((m) => m.id), ...(await loadMp4MoveIdsFor(slug))]) });

  const character: CharacterDetail = {
    id: `local-qa-character:${slug}`, slug, name: `${slug}（ローカルQA）`, nameEn: null, shortDescription: null, imageUrl: null,
    difficulty: null, rangeLabel: null, archetypeLabel: null, releaseDate: null, updatedAt: null,
    strengthsSummary: null, weaknessesSummary: null, guideSections: [], sources: [],
  };
  return (
    <>
      <p role="note" data-local-qa-banner style={{ border: "2px solid #c60", padding: 12, margin: 16 }}>
        ローカルQA専用・<strong>未承認</strong>。通常ページの部品に接続した確認用です。QA用GIF {plan.accepted.length} 本 /
        MP4優先で除外 {plan.skipped.filter((s) => s.reason === "MP4_PRIORITY_KEPT").length} 本 / その他の除外 {plan.skipped.filter((s) => s.reason !== "MP4_PRIORITY_KEPT").length} 本。
      </p>
      <CharacterUnifiedPage character={character} bundle={bundle} players={[]} videos={[]} showPreferences={false} />
    </>
  );
}
