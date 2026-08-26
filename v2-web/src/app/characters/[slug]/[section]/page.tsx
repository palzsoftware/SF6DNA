import { notFound } from "next/navigation";
import { CharacterTabs } from "@/components/character-tabs";
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
    description: "起き攻め、連携、セットプレイと条件・対処方法を扱います。",
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; section: string }>;
}) {
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
}: {
  params: Promise<{ slug: string; section: string }>;
}) {
  const { slug, section } = await params;
  if (!isSection(section)) notFound();

  const character = await getCharacterBySlug(slug);
  if (!character) notFound();

  const meta = sectionMeta[section];

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">{character.name}</p>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </section>

      <CharacterTabs slug={character.slug} active={section} />

      <section className="empty-state">
        <h2>データ接続準備済み</h2>
        <p>
          この画面は正式DBの各エンティティへ接続するためのルートです。旧版の未検証情報は自動移植せず、出典・パッチ・検証状態を確認したデータから順次公開します。
        </p>
      </section>
    </div>
  );
}
