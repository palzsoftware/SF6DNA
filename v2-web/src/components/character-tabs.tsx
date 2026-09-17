import Link from "next/link";
import {
  appendDevicePreviewToken,
  isDevicePreviewRequest,
} from "@/lib/device-preview";
import type { CharacterSectionKey } from "@/types/character";

const publicTabs: Array<{ key: CharacterSectionKey; label: string; path: string }> = [
  { key: "overview", label: "概要", path: "" },
  { key: "players", label: "プレイヤー", path: "/players" },
  { key: "videos", label: "動画", path: "/videos" },
];

const previewTabs: Array<{ key: CharacterSectionKey; label: string; path: string }> = [
  { key: "overview", label: "概要", path: "" },
  { key: "moves", label: "技", path: "/moves" },
  { key: "combos", label: "コンボ", path: "/combos" },
  { key: "setups", label: "起き攻め", path: "/setups" },
  { key: "sequences", label: "連携", path: "/sequences" },
  { key: "matchups", label: "対策", path: "/matchups" },
  { key: "training", label: "練習", path: "/training" },
  { key: "players", label: "プレイヤー", path: "/players" },
  { key: "videos", label: "動画", path: "/videos" },
];

const pilotV21Tabs: Array<{ key: CharacterSectionKey; label: string; path: string }> = [
  { key: "overview", label: "概要", path: "" },
  { key: "moves", label: "技", path: "/moves" },
  { key: "combos", label: "コンボ", path: "/combos" },
  { key: "setups", label: "セットプレイ", path: "/setups" },
  { key: "sequences", label: "連携・対策", path: "/sequences" },
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
  const previewActive = isDevicePreviewRequest(previewToken);
  const pilotV21 = previewActive && (slug === "ryu" || slug === "jp");
  const tabs = pilotV21 ? pilotV21Tabs : previewActive ? previewTabs : publicTabs;

  return (
    <nav className="character-tabs" aria-label="キャラクター情報">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={appendDevicePreviewToken(`/characters/${slug}${tab.path}`, previewToken)}
          className={tab.key === active ? "is-active" : undefined}
          aria-current={tab.key === active ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
      {!pilotV21 ? <Link href={`/characters/${slug}#sources`}>情報源</Link> : null}
    </nav>
  );
}
