import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { UnifiedMoveCard } from "@/components/character-unified-page";
import { LocalQaVariantSwitcher } from "@/components/local-qa-variant-switcher";
import type { UnifiedMove } from "@/lib/character-unified-contract";
import { isLocalQaGifRequestFromEnv, planLocalQaGifs, LOCAL_QA_MEDIA_STATUS } from "@/lib/local-qa-gif";
import { LOCAL_QA_VARIANT_LABELS, planLocalQaVariantGroups, toVariantMotionMedia } from "@/lib/local-qa-gif-variants";
import { loadLocalQaGifDoc, loadLocalQaVariantDoc, loadMp4MoveIdsFor } from "@/lib/local-qa-gif-sources";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "技カード派生パターン・ローカルQA確認", robots: { index: false, follow: false } };

/**
 * ローカルQA専用の隔離ルート(派生パターンの切り替え表示の試作)。公開ページ・既存の表示経路からは参照されない。
 * 入口条件は /internal/gif-qa/[slug] と同じ(開発環境・localhost・SF6DNA_WS5_TXT_PREVIEW=1 以外は404)。
 * 技IDは増やさない。技カード(UnifiedMoveCard)は変更せず、media だけを差し替えて1枚ずつ表示する。
 */
export default async function LocalQaVariantCards({ params }: { params: Promise<{ slug: string }> }) {
  const h = await headers();
  if (!isLocalQaGifRequestFromEnv(h.get("host"))) notFound();
  const { slug } = await params;
  const [doc, variantDoc] = await Promise.all([loadLocalQaGifDoc(slug), loadLocalQaVariantDoc(slug)]);
  if (!doc || !variantDoc) notFound();
  const { default: fixture } = await import("@/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
  const character = (fixture.characters as unknown as Record<string, { moves: UnifiedMove[] }>)[slug];
  if (!character) notFound();
  const mp4Ids = await loadMp4MoveIdsFor(slug);
  const movesWithMedia = new Set([...mp4Ids, ...character.moves.filter((m) => m.media).map((m) => m.id)]);
  const parentPlan = planLocalQaGifs({ doc, moves: character.moves, movesWithMedia });
  const plan = planLocalQaVariantGroups({ doc: variantDoc, moves: character.moves, movesWithMedia, connectedEntries: parentPlan.accepted });
  const byId = new Map(character.moves.map((m) => [m.id, m]));
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1>技カード派生パターン・ローカルQA確認（{slug}）</h1>
      <p role="note" data-local-qa-banner style={{ border: "2px solid #c60", padding: 12 }}>
        ローカルQA専用・<strong>未承認</strong>。技IDは増やしていません。表示 {plan.accepted.length} 技 / 除外 {plan.skipped.length} 技。
      </p>
      {plan.skipped.length ? <ul data-local-qa-skipped>{plan.skipped.map((s) => <li key={s.moveSlug}>{s.moveSlug}: {s.reason}</li>)}</ul> : null}
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}>
        {plan.accepted.map((group) => {
          const move = byId.get(group.moveId)!;
          const connected = group.connection === "CONNECTED";
          return (
            <section key={group.moveId} data-local-qa-variant-group data-move-slug={group.moveSlug} data-connection={group.connection}>
              <span style={{ background: connected ? "#c60" : "#555", color: "#fff", padding: "2px 8px", fontSize: 12 }}>
                {connected ? "ローカルQA専用・未承認(技カードに接続済みの技)" : "試作のみ・技カードには未接続"}
              </span>
              {group.pendingReason ? <p data-local-qa-pending-reason style={{ fontSize: 13 }}>{group.pendingReason}</p> : null}
              <LocalQaVariantSwitcher moveSlug={group.moveSlug}
                tabs={group.variants.map((v) => ({ key: v.variantKey, label: LOCAL_QA_VARIANT_LABELS[v.variantKey] }))}>
                {group.variants.map((v, i) => (
                  <div key={v.variantKey} data-local-qa-variant-card data-variant-key={v.variantKey} data-media-status={LOCAL_QA_MEDIA_STATUS}>
                    <UnifiedMoveCard move={{ ...move, media: toVariantMotionMedia(v, slug, group.moveSlug, group.moveId, i) }} />
                  </div>
                ))}
              </LocalQaVariantSwitcher>
            </section>
          );
        })}
      </div>
    </main>
  );
}
