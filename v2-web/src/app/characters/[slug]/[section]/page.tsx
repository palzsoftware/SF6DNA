import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterTabs } from "@/components/character-tabs";
import { listCharacterSectionItems } from "@/lib/character-sections";
import {
  appendDevicePreviewToken,
  isDevicePreviewRequest,
  normalizeDevicePreviewToken,
} from "@/lib/device-preview";
import { getCharacterBySlug } from "@/lib/characters";
import {
  CHARACTER_SECTION_KEYS,
  type CharacterSectionKey,
} from "@/types/character";

const sectionMeta: Record<Exclude<CharacterSectionKey, "overview">, { title: string; description: string }> = {
  moves: {
    title: "技・フレーム",
    description: "通常技・特殊技・必殺技・SAとフレーム、Classic / Modernコマンドを扱います。",
  },
  combos: {
    title: "コンボ",
    description: "基本・中央・画面端・確反・SA・リーサルなど目的別のコンボを扱います。",
  },
  setups: {
    title: "セットプレイ",
    description: "起き攻め、セットプレイと条件・対処方法を扱います。",
  },
  sequences: {
    title: "連携",
    description: "攻め継続、連携手順、割り込み・投げ・シミーなどの対応関係を扱います。",
  },
  matchups: {
    title: "対策",
    description: "キャラ対策、技対策、連携対策と自キャラ別の回答を扱います。",
  },
  training: {
    title: "トレーニング",
    description: "トレモのレコード設定、練習手順、成功条件まで扱います。",
  },
  players: {
    title: "参考プレイヤー",
    description: "このキャラクターを使用するプロ、強豪、専門プレイヤーを扱います。",
  },
  videos: {
    title: "関連動画",
    description: "攻略、コンボ、対策、大会試合などキャラクターに紐づく動画を扱います。",
  },
};

function isSection(value: string): value is Exclude<CharacterSectionKey, "overview"> {
  return value !== "overview" && CHARACTER_SECTION_KEYS.includes(value as CharacterSectionKey);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; section: string }> }) {
  const { slug, section } = await params;
  if (!isSection(section)) return {};
  const character = await getCharacterBySlug(slug);
  if (!character) return {};
  return {
    title: `${character.name} ${sectionMeta[section].title} | SF6DNA`,
    description: `${character.name}の${sectionMeta[section].description}`,
  };
}

export default async function CharacterSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; section: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
}) {
  const [{ slug, section }, query] = await Promise.all([params, searchParams]);
  if (!isSection(section)) notFound();

  const previewToken = normalizeDevicePreviewToken(query.preview);
  const character = await getCharacterBySlug(slug, previewToken);
  if (!character) notFound();

  const meta = sectionMeta[section];
  const items = await listCharacterSectionItems(character.id, section, previewToken);
  const previewActive = isDevicePreviewRequest(previewToken);

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{character.name}</p>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </section>

      {previewActive ? (
        <section className="empty-state">
          <h2>Phase23 実機確認プレビュー</h2>
          <p>「未公開プレビュー」と表示される項目は draft / reviewed を含む確認用データです。DBの公開ステータスは変更していません。</p>
        </section>
      ) : null}

      <CharacterTabs slug={character.slug} active={section} previewToken={previewToken} />

      {items.length ? (
        <section className="search-result-list">
          {items.map((item) => (
            <Link
              className="search-result"
              href={appendDevicePreviewToken(item.href, previewToken)}
              key={item.id}
            >
              {item.meta ? <span className="search-result__type">{item.meta}</span> : null}
              <strong>{item.title}</strong>
              {item.subtitle ? <span>{item.subtitle}</span> : null}
            </Link>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>公開済みデータはまだありません</h2>
          <p>旧版の未検証情報は自動移植せず、出典・パッチ・検証状態を確認したデータから公開します。</p>
        </section>
      )}
    </div>
  );
}
