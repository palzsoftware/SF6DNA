import { notFound } from "next/navigation";
import { CharacterSectionExplorer } from "@/components/character-section-explorer";
import { CharacterTabs } from "@/components/character-tabs";
import { listCharacterSectionItems } from "@/lib/character-sections";
import {
  isDevicePreviewRequest,
  normalizeDevicePreviewToken,
} from "@/lib/device-preview";
import { getCharacterBySlug } from "@/lib/characters";
import { releaseFeatures } from "@/lib/release-features";
import styles from "../[section]/page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  if (!releaseFeatures.publicStrategyContent) return {};
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);
  if (!character) return {};
  return {
    title: `${character.name} 対策 | SF6DNA`,
    description: `${character.name}のキャラ対策、技対策、連携対策と回答を確認できます。`,
  };
}

export default async function CharacterMatchupsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    preview?: string | string[];
    q?: string | string[];
    type?: string | string[];
    side?: string | string[];
  }>;
}) {
  if (!releaseFeatures.publicStrategyContent) notFound();
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);
  if (!character) notFound();

  const previewActive = isDevicePreviewRequest(previewToken);
  const items = await listCharacterSectionItems(character.id, "matchups", previewToken);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{character.name}</p>
        <h1>対策</h1>
        <p>対戦前に必要な情報だけを検索・絞り込みし、技・状況・読み合いごとの回答を素早く確認できます。</p>
      </section>

      {previewActive ? (
        <aside className={styles.previewNotice}>
          <strong>実機確認プレビュー</strong>
          <span>未公開データを確認用に表示しています。DBの公開状態は変更していません。</span>
        </aside>
      ) : null}

      <CharacterTabs slug={character.slug} active="matchups" previewToken={previewToken} />

      {items.length ? (
        <CharacterSectionExplorer
          section="matchups"
          characterSlug={character.slug}
          items={items}
          previewToken={previewToken}
          q={query.q}
          type={query.type}
          side={query.side}
        />
      ) : (
        <section className="empty-state">
          <h2>公開済みの対策データはまだありません</h2>
          <p>対象パッチ・出典・検証状態を確認できたデータから公開します。</p>
        </section>
      )}
    </div>
  );
}
