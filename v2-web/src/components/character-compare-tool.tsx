"use client";

import { useMemo, useState } from "react";
import type { CharacterSummary } from "@/types/character";

function value(value: string | number | null) {
  return value === null || value === "" ? "未設定" : String(value);
}

export function CharacterCompareTool({ characters }: { characters: CharacterSummary[] }) {
  const [leftSlug, setLeftSlug] = useState(characters[0]?.slug ?? "");
  const [rightSlug, setRightSlug] = useState(characters[1]?.slug ?? characters[0]?.slug ?? "");

  const left = useMemo(() => characters.find((character) => character.slug === leftSlug) ?? null, [characters, leftSlug]);
  const right = useMemo(() => characters.find((character) => character.slug === rightSlug) ?? null, [characters, rightSlug]);

  if (!characters.length) {
    return <div className="empty-state"><p>比較できる公開キャラクターがありません。</p></div>;
  }

  return (
    <div className="page-stack">
      <div className="compare-selectors">
        <label className="compact-field">
          <span>キャラクターA</span>
          <select value={leftSlug} onChange={(event) => setLeftSlug(event.target.value)}>
            {characters.map((character) => <option key={character.id} value={character.slug}>{character.name}</option>)}
          </select>
        </label>
        <label className="compact-field">
          <span>キャラクターB</span>
          <select value={rightSlug} onChange={(event) => setRightSlug(event.target.value)}>
            {characters.map((character) => <option key={character.id} value={character.slug}>{character.name}</option>)}
          </select>
        </label>
      </div>

      {left && right ? (
        <div className="table-wrap">
          <table className="compare-table">
            <thead><tr><th>項目</th><th>{left.name}</th><th>{right.name}</th></tr></thead>
            <tbody>
              <tr><th>英語名</th><td>{value(left.nameEn)}</td><td>{value(right.nameEn)}</td></tr>
              <tr><th>アーキタイプ</th><td>{value(left.archetypeLabel)}</td><td>{value(right.archetypeLabel)}</td></tr>
              <tr><th>得意距離</th><td>{value(left.rangeLabel)}</td><td>{value(right.rangeLabel)}</td></tr>
              <tr><th>難易度</th><td>{left.difficulty ? `${left.difficulty}/5` : "未設定"}</td><td>{right.difficulty ? `${right.difficulty}/5` : "未設定"}</td></tr>
              <tr><th>参戦日</th><td>{value(left.releaseDate)}</td><td>{value(right.releaseDate)}</td></tr>
              <tr><th>概要</th><td>{value(left.shortDescription)}</td><td>{value(right.shortDescription)}</td></tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
