import { notFound } from "next/navigation";
import { CharacterSectionExplorer } from "@/components/character-section-explorer";
import { CharacterTabs } from "@/components/character-tabs";
import { listCharacterSectionItems } from "@/lib/character-sections";
import {
  isDevicePreviewRequest,
  normalizeDevicePreviewToken,
} from "@/lib/device-preview";
import { getCharacterBySlug } from "@/lib/characters";
import styles from "../[section]/page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);
  if (!character) return {};
  return {
    title: `${character.name} トレーニング | SF6DNA`,
    description: `${character.name}のトレモ設定、練習手順、成功条件を目的とレベル別に確認できます。`,
  };
}

export default async function CharacterTrainingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    preview?: string | string[];
    q?: string | string[];
    type?: string | string[];
    level?: string | string[];
  }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);
  if (!character) notFound();

  const previewActive = isDevicePreviewRequest(previewToken);
  const items = await listCharacterSectionItems(character.id, "training", previewToken);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{character.name}</p>
        <h1>トレーニング</h1>
        <p>「今日は何を練習するか」を決めやすいよう、目的・レベル・所要時間からトレモ項目を絞り込めます。</p>
      </section>

      {previewActive ? (
        <aside className={styles.previewNotice}>
          <strong>実機確認プレビュー</strong>
          <span>未公開データを確認用に表示しています。DBの公開状態は変更していません。</span>
        </aside>
      ) : null}

      <CharacterTabs slug={character.slug} active="training" previewToken={previewToken} />

      {items.length ? (
        <CharacterSectionExplorer
          section="training"
          characterSlug={character.slug}
          items={items}
          previewToken={previewToken}
          q={query.q}
          type={query.type}
          level={query.level}
        />
      ) : (
        <section className="empty-state">
          <h2>公開済みのトレーニングデータはまだありません</h2>
          <p>対象パッチ・出典・検証状態を確認できたデータから公開します。</p>
        </section>
      )}
    </div>
  );
}
