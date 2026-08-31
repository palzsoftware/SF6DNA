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
import type { CharacterGuideSection } from "@/types/character";

const quickActions = [
  ["技・フレーム", "コマンドと重要数値を見る", "/moves"],
  ["対策", "対戦前に要点を確認する", "/matchups"],
  ["トレーニング", "トレモ項目へ移動する", "/training"],
  ["プレイヤー", "参考プレイヤーを探す", "/players"],
] as const;

const guideGroups = [
  {
    key: "matchup",
    title: "対戦前に見る",
    description: "短時間で確認したい対戦要点。",
    sectionKeys: ["matchup_card"],
  },
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

  const remaining = sections.filter((section) => !used.has(section.id));
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);

  if (!character) return { title: "キャラクター情報" };

  return {
    title: `${character.name} | キャラクター情報`,
    description:
      character.shortDescription ?? `${character.name}の攻略・技・コンボ・対策情報をまとめています。`,
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
  const groups = groupedGuideSections(character.guideSections);
  const hasStrengthProfile = Boolean(character.strengthsSummary || character.weaknessesSummary);

  return (
    <div className="site-shell page-stack">
      <section className="character-hero">
        <div>
          <p className="eyebrow">CHARACTER</p>
          <h1>{character.name}</h1>
          {character.nameEn ? <p className="character-subtitle">{character.nameEn}</p> : null}
          <p>{character.shortDescription ?? "技・対策・練習データをキャラクター単位で確認できます。"}</p>
          <div className="chip-row">
            {character.archetypeLabel ? <span className="chip">{character.archetypeLabel}</span> : null}
            {character.rangeLabel ? <span className="chip">{character.rangeLabel}</span> : null}
            {character.difficulty ? <span className="chip">難易度 {character.difficulty}/5</span> : null}
            {character.releaseDate ? <span className="chip">参戦日 {character.releaseDate}</span> : null}
          </div>
          <CharacterPreferenceActions slug={character.slug} />
        </div>
        {character.imageUrl ? (
          <Image
            className="character-hero__image"
            src={character.imageUrl}
            alt={character.name}
            width={760}
            height={760}
            sizes="(max-width: 720px) 100vw, 42vw"
            priority
          />
        ) : null}
      </section>

      {previewActive ? (
        <section className="data-notice">
          <strong>実機確認プレビュー</strong>
          <p>未公開の draft / reviewed データを確認用に表示しています。DBの公開ステータスは変更していません。</p>
        </section>
      ) : null}

      <section className="character-home-actions" aria-label={`${character.name}のよく使う情報`}>
        {quickActions.map(([label, description, path]) => (
          <Link
            className="character-home-action"
            href={appendDevicePreviewToken(`/characters/${character.slug}${path}`, previewToken)}
            key={path}
          >
            <strong>{label}</strong>
            <span>{description}</span>
          </Link>
        ))}
      </section>

      <CharacterTabs slug={character.slug} active="overview" previewToken={previewToken} />

      {hasStrengthProfile ? (
        <section className="character-columns">
          {character.strengthsSummary ? (
            <article className="info-panel">
              <h2>強み</h2>
              <p className="preline">{character.strengthsSummary}</p>
            </article>
          ) : null}
          {character.weaknessesSummary ? (
            <article className="info-panel">
              <h2>弱み</h2>
              <p className="preline">{character.weaknessesSummary}</p>
            </article>
          ) : null}
        </section>
      ) : null}

      <section>
        <div className="section-heading">
          <h2>立ち回り・考え方</h2>
          <p>{previewActive ? "未公開候補を用途別に整理して確認できます。" : "攻略本文は対象パッチと出典を確認した上で公開します。"}</p>
        </div>
        {groups.length ? (
          <div className="guide-groups">
            {groups.map((group) => (
              <section className="guide-group" key={group.key}>
                <div className="guide-group__heading">
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
                <div className="guide-group__grid">
                  {group.items.map((section) => (
                    <article className="info-panel" key={section.id}>
                      <h3>{section.title}</h3>
                      <p className="preline">{section.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>現在公開できる攻略セクションはありません。</p></div>
        )}
      </section>

      <section>
        <div className="section-heading">
          <h2>出典</h2>
          <p>基本情報や客観データの確認に使用した情報源を表示します。</p>
        </div>
        {character.sources.length ? (
          <div className="search-result-list">
            {character.sources.map((source) => (
              <a className="search-result" href={source.url} target="_blank" rel="noopener noreferrer" key={source.id}>
                <span className="search-result__type">{source.publisher ?? "情報源"}</span>
                <strong>{source.title}</strong>
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
