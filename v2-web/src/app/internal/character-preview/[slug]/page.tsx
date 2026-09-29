import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterDetailPilot } from "@/components/character-detail-pilot";
import { getPreReleaseCharacter } from "@/lib/pre-release-character";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "キャラクター事前確認",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function PreReleaseCharacterPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getPreReleaseCharacter(slug);
  if (!character) notFound();

  return <div className="site-shell page-stack character-overview-page">
    <section className="character-hero character-hero--overview">
      <div className="character-hero__copy">
        <p className="eyebrow">キャラクター・内部確認</p>
        <div className="character-hero__title-row"><div><h1>{character.name}</h1><p className="character-subtitle">{character.nameEn}</p></div></div>
        <p className="character-hero__lead">{character.summary}</p>
        <div className="chip-row character-hero__chips"><span className="chip">参戦予定 {character.releaseDate}</span></div>
      </div>
    </section>
    <section className="data-notice character-preview-notice">
      <strong>掲載前の内部確認</strong>
      <p>実機の技データ・入力・攻略情報は未検証です。</p>
    </section>
    <CharacterDetailPilot
      characterName={character.name}
      characterSlug={character.slug}
      previewToken={null}
      bundle={character.bundle}
      players={[]}
      videos={[]}
      archetypeLabel={null}
      rangeLabel={null}
      difficulty={null}
      sources={[]}
      profile={character.profile}
      preRelease
    />
    <section id="sources"><div className="section-heading"><h2>情報源</h2></div>
      <p><Link href={character.source.url} target="_blank" rel="noopener noreferrer">{character.source.title} ↗</Link></p>
    </section>
  </div>;
}
