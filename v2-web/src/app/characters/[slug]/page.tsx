import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterPreferenceActions } from "@/components/character-preference-actions";
import { CharacterTabs } from "@/components/character-tabs";
import {
  appendDevicePreviewToken,
  isDevicePreviewRequest,
  normalizeDevicePreviewToken,
} from "@/lib/device-preview";
import { getCharacterBySlug } from "@/lib/characters";
import { releaseFeatures } from "@/lib/release-features";
import type { CharacterGuideSection } from "@/types/character";

const quickActions = [
  ["プレイヤー", "参考プレイヤーを探す", "/players", "PRO"],
  ["動画", "関連動画を確認する", "/videos", "VIDEO"],
] as const;

const guideGroups = [
  {
    key: "core",
    title: "基本方針",
    description: "キャラクターの勝ち筋と軸になる考え方。",
    sectionKeys: ["overview"],
  },
  {
    key: "level",
    title: "レベル別の優先事項",
    description: "習熟度に応じて覚える内容を絞り込みます。",
    sectionKeys: ["beginner", "intermediate", "advanced", "mr1700"],
  },
  {
    key: "decision",
    title: "実戦判断",
    description: "防御とゲージ管理など、試合中の判断基準。",
    sectionKeys: ["defense", "meter"],
  },
  {
    key: "practice",
    title: "練習",
    description: "実戦へつなげるための反復項目。",
    sectionKeys: ["training"],
  },
] as const;

type GuideGroupResult = {
  key: string;
  title: string;
  description: string;
  items: CharacterGuideSection[];
};

function groupedGuideSections(sections: CharacterGuideSection[]): GuideGroupResult[] {
  const used = new Set<string>();
  const groups: GuideGroupResult[] = guideGroups.flatMap((group) => {
    const items = group.sectionKeys.flatMap((key) =>
      sections.filter((section) => section.sectionKey === key)
    );
    items.forEach((item) => used.add(item.id));
    return items.length
      ? [{ key: group.key, title: group.title, description: group.description, items }]
      : [];
  });

  const remaining = sections.filter(
    (section) => section.sectionKey !== "matchup_card" && !used.has(section.id)
  );
  if (remaining.length) {
    groups.push({
      key: "other",
      title: "その他",
      description: "追加の確認項目。",
      items: remaining,
    });
  }
  return groups;
}

function sectionHref(slug: string, path: string, previewToken: string | null) {
  return appendDevicePreviewToken(`/characters/${slug}${path}`, previewToken);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);

  if (!character) return { title: "キャラクター情報" };

  return {
    title: `${character.name} | キャラクター情報`,
    description:
      character.shortDescription ?? `${character.name}の基本情報・関連プレイヤー・動画を確認できます。`,
  };
}

export default async function CharacterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const previewToken = normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);

  if (!character) notFound();

  const previewActive = isDevicePreviewRequest(previewToken);
  const matchupCard = releaseFeatures.publicStrategyContent
    ? character.guideSections.find((section) => section.sectionKey === "matchup_card") ?? null
    : null;
  const groups = releaseFeatures.publicStrategyContent
    ? groupedGuideSections(character.guideSections)
    : [];
  const hasStrengthProfile = Boolean(character.strengthsSummary || character.weaknessesSummary);

  return (
    <div className="site-shell page-stack character-overview-page">
      <section className="character-hero character-hero--overview">
        <div className="character-hero__copy">
          <p className="eyebrow">CHARACTER</p>
          <div className="character-hero__title-row">
            <div>
              <h1>{character.name}</h1>
              {character.nameEn ? <p className="character-subtitle">{character.nameEn}</p> : null}
            </div>
            <span className="character-ready-badge">攻略ハブ</span>
          </div>
          <p className="character-hero__lead">
            {character.shortDescription ?? "基本情報・関連プレイヤー・動画をキャラクター単位で確認できます。"}
          </p>
          <div className="chip-row character-hero__chips">
            {character.archetypeLabel ? <span className="chip">{character.archetypeLabel}</span> : null}
            {character.rangeLabel ? <span className="chip">{character.rangeLabel}</span> : null}
            {character.difficulty ? <span className="chip">難易度 {character.difficulty}/5</span> : null}
            {character.releaseDate ? <span className="chip">参戦日 {character.releaseDate}</span> : null}
          </div>
          <CharacterPreferenceActions slug={character.slug} />
        </div>
        {character.imageUrl ? (
          <div className="character-hero__visual-wrap">
            <Image
              className="character-hero__image"
              src={character.imageUrl}
              alt={character.name}
              width={760}
              height={760}
              sizes="(max-width: 720px) 100vw, 42vw"
              priority
            />
          </div>
        ) : null}
      </section>

      {previewActive ? (
        <section className="data-notice character-preview-notice">
          <strong>実機確認プレビュー</strong>
          <p>未公開の draft / reviewed データを確認用に表示しています。DBの公開ステータスは変更していません。</p>
        </section>
      ) : null}

      <section className="character-home-actions character-home-actions--primary" aria-label={`${character.name}のよく使う情報`}>
        {quickActions.map(([label, description, path, code]) => (
          <Link
            className="character-home-action"
            href={sectionHref(character.slug, path, previewToken)}
            key={path}
          >
            <span className="character-home-action__code">{code}</span>
            <strong>{label}</strong>
            <span>{description}</span>
            <span className="character-home-action__arrow">開く →</span>
          </Link>
        ))}
      </section>

      <CharacterTabs slug={character.slug} active="overview" previewToken={previewToken} />

      <nav className="character-overview-index" aria-label="概要ページ内ナビゲーション">
        {matchupCard ? <a href="#before-match">対戦前30秒</a> : null}
        {hasStrengthProfile ? <a href="#profile">強み・弱み</a> : null}
        {groups.map((group) => <a href={`#guide-${group.key}`} key={group.key}>{group.title}</a>)}
        <a href="#sources">出典</a>
      </nav>

      {matchupCard ? (
        <section className="matchup-spotlight" id="before-match">
          <div className="matchup-spotlight__head">
            <div>
              <p className="eyebrow">BEFORE MATCH</p>
              <h2>対戦前30秒</h2>
            </div>
            <Link className="section-action-link" href={sectionHref(character.slug, "/matchups", previewToken)}>
              対策をすべて見る →
            </Link>
          </div>
          <article className="matchup-spotlight__card">
            <h3>{matchupCard.title}</h3>
            <p className="preline">{matchupCard.body}</p>
          </article>
        </section>
      ) : null}

      {hasStrengthProfile ? (
        <section className="character-profile-section" id="profile">
          <div className="section-heading">
            <h2>キャラクターの特徴</h2>
            <p>キャラクターの強みと注意点を確認できます。</p>
          </div>
          <div className="character-columns character-profile-grid">
            {character.strengthsSummary ? (
              <article className="info-panel character-profile-card character-profile-card--strength">
                <span className="character-profile-card__label">STRENGTH</span>
                <h3>強み</h3>
                <p className="preline">{character.strengthsSummary}</p>
              </article>
            ) : null}
            {character.weaknessesSummary ? (
              <article className="info-panel character-profile-card character-profile-card--weakness">
                <span className="character-profile-card__label">CAUTION</span>
                <h3>弱み</h3>
                <p className="preline">{character.weaknessesSummary}</p>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {releaseFeatures.publicStrategyContent ? (
        <section>
          <div className="section-heading">
            <h2>立ち回り・考え方</h2>
            <p>{previewActive ? "未公開候補を用途別に整理して確認できます。" : "攻略本文は対象パッチと出典を確認した上で公開します。"}</p>
          </div>
          {groups.length ? (
            <div className="guide-groups character-guide-groups">
              {groups.map((group) => (
                <section className="guide-group" id={`guide-${group.key}`} key={group.key}>
                  <div className="guide-group__heading">
                    <h2>{group.title}</h2>
                    <p>{group.description}</p>
                  </div>
                  <div className="guide-accordion-list">
                    {group.items.map((section, index) => (
                      <details className="guide-accordion" key={section.id} open={group.key === "core" && index === 0}>
                        <summary>
                          <span>{section.title}</span>
                          <span className="guide-accordion__hint">開く</span>
                        </summary>
                        <div className="guide-accordion__body">
                          <p className="preline">{section.body}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section id="sources">
        <div className="section-heading">
          <h2>出典</h2>
          <p>基本情報や客観データの確認に使用した情報源です。</p>
        </div>
        {character.sources.length ? (
          <div className="source-compact-grid">
            {character.sources.map((source) => (
              <a className="source-compact-card" href={source.url} target="_blank" rel="noopener noreferrer" key={source.id}>
                <span>{source.publisher ?? "情報源"}</span>
                <strong>{source.title}</strong>
                <small>出典を開く ↗</small>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>公開済みの出典情報はまだありません。</p></div>
        )}
      </section>
    </div>
  );
}
