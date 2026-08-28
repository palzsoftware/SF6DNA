"use client";

import { useEffect, useState } from "react";
import {
  getCharacterStatuses,
  isFavoriteCharacter,
  setCharacterStatus,
  setFavoriteCharacter,
  type CharacterUseStatus,
} from "@/lib/local-user-tools";

const STATUS_LABELS: Record<CharacterUseStatus, string> = {
  main: "メイン",
  sub: "サブ",
  learning: "練習中",
};

export function CharacterPreferenceActions({ slug }: { slug: string }) {
  const [favorite, setFavorite] = useState(false);
  const [status, setStatus] = useState<CharacterUseStatus | "">("");

  useEffect(() => {
    setFavorite(isFavoriteCharacter(slug));
    setStatus(getCharacterStatuses()[slug] ?? "");
  }, [slug]);

  function toggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    setFavoriteCharacter(slug, next);
  }

  function changeStatus(next: string) {
    const normalized = (next || null) as CharacterUseStatus | null;
    setCharacterStatus(slug, normalized);
    setStatus(normalized ?? "");
  }

  return (
    <div className="user-tool-actions" aria-label="キャラクター個人設定">
      <button className="secondary-button" type="button" onClick={toggleFavorite} aria-pressed={favorite}>
        {favorite ? "★ お気に入り済み" : "☆ お気に入り"}
      </button>
      <label className="compact-field">
        <span>使用状況</span>
        <select value={status} onChange={(event) => changeStatus(event.target.value)}>
          <option value="">未設定</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
