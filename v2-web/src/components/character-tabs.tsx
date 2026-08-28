import Link from "next/link";
import type { CharacterSectionKey } from "@/types/character";

const tabs: Array<{ key: CharacterSectionKey; label: string; path: string }> = [
  { key: "overview", label: "概要", path: "" },
  { key: "moves", label: "技・フレーム", path: "/moves" },
  { key: "combos", label: "コンボ", path: "/combos" },
  { key: "setups", label: "セットプレイ", path: "/setups" },
  { key: "sequences", label: "連携", path: "/sequences" },
  { key: "matchups", label: "対策", path: "/matchups" },
  { key: "training", label: "トレモ", path: "/training" },
  { key: "players", label: "プレイヤー", path: "/players" },
  { key: "videos", label: "動画", path: "/videos" },
];

export function CharacterTabs({
  slug,
  active,
}: {
  slug: string;
  active: CharacterSectionKey;
}) {
  return (
    <nav className="character-tabs" aria-label="キャラクター情報">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={`/characters/${slug}${tab.path}`}
          className={tab.key === active ? "is-active" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
