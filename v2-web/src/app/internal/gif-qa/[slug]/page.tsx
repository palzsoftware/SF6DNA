import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { UnifiedMoveCard } from "@/components/character-unified-page";
import type { UnifiedMove } from "@/lib/character-unified-contract";
import { isLocalQaGifRequestFromEnv, planLocalQaGifs, toLocalQaMotionMedia, LOCAL_QA_MEDIA_STATUS } from "@/lib/local-qa-gif";
import { loadLocalQaGifDoc, loadMp4MoveIdsFor } from "@/lib/local-qa-gif-sources";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "技カードGIF・ローカルQA確認", robots: { index: false, follow: false } };

/**
 * ローカルQA専用の隔離ルート。公開ページ・既存の表示経路からは参照されない。
 * 開発環境(NODE_ENV=development)・localhost・SF6DNA_WS5_TXT_PREVIEW=1 以外は404。
 * 表示するのは「目視QAで確認済みだが未承認」のGIFのみ。既存の技カードUIをそのまま再利用する。
 */
export default async function LocalQaGifCards({ params }: { params: Promise<{ slug: string }> }) {
  const h = await headers();
  if (!isLocalQaGifRequestFromEnv(h.get("host"))) notFound();
  const { slug } = await params;
  const doc = await loadLocalQaGifDoc(slug);
  if (!doc) notFound();
  const { default: fixture } = await import("@/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
  const character = (fixture.characters as unknown as Record<string, { moves: UnifiedMove[] }>)[slug];
  if (!character) notFound();
  const mp4Ids = await loadMp4MoveIdsFor(slug);
  // 公開用データ側に既にmediaがある技も「既存メディアあり」として扱う(上乗せしない)
  const movesWithMedia = new Set([...mp4Ids, ...character.moves.filter((m) => m.media).map((m) => m.id)]);
  const plan = planLocalQaGifs({ doc, moves: character.moves, movesWithMedia });
  const byId = new Map(character.moves.map((m) => [m.id, m]));
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1>技カードGIF・ローカルQA確認（{slug}）</h1>
      <p role="note" data-local-qa-banner style={{ border: "2px solid #c60", padding: 12 }}>
        ローカルQA専用・<strong>未承認</strong>。公開承認済みではありません。開発環境のlocalhostでのみ表示されます。
        表示 {plan.accepted.length} 本 / 除外 {plan.skipped.length} 本。
      </p>
      {plan.skipped.length ? <ul data-local-qa-skipped>{plan.skipped.map((s) => <li key={s.moveSlug}>{s.moveSlug}: {s.reason}</li>)}</ul> : null}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {plan.accepted.map((entry, index) => {
          const move = byId.get(entry.moveId)!;
          const media = toLocalQaMotionMedia(entry, slug, index);
          return (
            <div key={entry.moveId} data-local-qa-card data-media-status={LOCAL_QA_MEDIA_STATUS}>
              <span style={{ background: "#c60", color: "#fff", padding: "2px 8px", fontSize: 12 }}>ローカルQA専用・未承認</span>
              <UnifiedMoveCard move={{ ...move, media }} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
