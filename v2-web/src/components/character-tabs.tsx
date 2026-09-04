import Link from "next/link";
import { appendDevicePreviewToken } from "@/lib/device-preview";
import type { CharacterSectionKey } from "@/types/character";

const tabs: Array<{ key: CharacterSectionKey; label: string; path: string }> = [
  { key: "overview", label: "概要", path: "" },
  { key: "players", label: "プレイヤー", path: "/players" },
  { key: "videos", label: "動画", path: "/videos" },
];

export function CharacterTabs({
  slug,
  active,
  previewToken,
}: {
  slug: string;
  active: CharacterSectionKey;
  previewToken?: string | null;
}) {
  return (
    <nav className="character-tabs" aria-label="キャラクター情報">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={appendDevicePreviewToken(`/characters/${slug}${tab.path}`, previewToken)}
          className={tab.key === active ? "is-active" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
