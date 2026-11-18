import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CharacterUnifiedPage } from "@/components/character-unified-page";
import { getPreReleaseCharacter, getPreReleaseLocalCardCharacter, preReleaseUnifiedProps } from "@/lib/pre-release-character";

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
  const character = getPreReleaseCharacter(slug) ?? await getPreReleaseLocalCardCharacter(slug, {
    nodeEnv: process.env.NODE_ENV, vercelEnv: process.env.VERCEL_ENV, vercel: process.env.VERCEL,
    enabled: process.env.SF6DNA_WS5_TXT_PREVIEW, host: (await headers()).get("host") });
  if (!character) notFound();

  return <CharacterUnifiedPage {...preReleaseUnifiedProps(character)} />;
}
