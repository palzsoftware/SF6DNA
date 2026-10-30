import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CharacterUnifiedPage } from "@/components/character-unified-page";
import { getPreReleaseCharacter, preReleaseUnifiedProps } from "@/lib/pre-release-character";

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

  return <CharacterUnifiedPage {...preReleaseUnifiedProps(character)} />;
}
