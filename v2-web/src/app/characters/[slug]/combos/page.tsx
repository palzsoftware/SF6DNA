import { notFound } from "next/navigation";
import { ComboExplorer } from "@/components/combo-explorer";
import { CharacterTabs } from "@/components/character-tabs";
import { listCharacterSectionItems } from "@/lib/character-sections";
import { isDevicePreviewRequest, normalizeDevicePreviewToken } from "@/lib/device-preview";
import { getCharacterBySlug } from "@/lib/characters";
import styles from "../[section]/page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);
  if (!character) return {};
  return {
    title: `${character.name} コンボ | SF6DNA`,
    description: `${character.name}のコンボを始動・用途・難易度・ゲージ条件から確認できます。`,
  };
}

export default async function CharacterCombosPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    preview?: string | string[];
    q?: string | string[];
    difficulty?: string | string[];
    resource?: string | string[];
  }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);
  if (!character) notFound();

  const previewActive = isDevicePreviewRequest(previewToken);
  const items = await listCharacterSectionItems(character.id, "combos", previewToken);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{character.name}</p>
        <h1>コンボ</h1>
        <p>「どの場面で使うか」から探せるよう、始動・用途・難易度・ゲージ条件を優先して整理しています。</p>
      </section>

      {previewActive ? (
        <aside className={styles.previewNotice}>
          <strong>実機確認プレビュー</strong>
          <span>未公開データを確認用に表示しています。DBの公開状態は変更していません。</span>
        </aside>
      ) : null}

      <CharacterTabs slug={character.slug} active="combos" previewToken={previewToken} />

      {items.length ? (
        <ComboExplorer
          characterSlug={character.slug}
          items={items}
          previewToken={previewToken}
          q={query.q}
          difficulty={query.difficulty}
          resource={query.resource}
        />
      ) : (
        <section className="empty-state">
          <h2>公開済みのコンボデータはまだありません</h2>
          <p>対象パッチ・出典・検証状態を確認できたデータから公開します。</p>
        </section>
      )}
    </div>
  );
}
