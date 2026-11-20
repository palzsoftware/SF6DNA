"use client";

import Link from "next/link";
import { PilotComboCard } from "@/components/pilot-combo-card";
import type { CharacterSectionItem } from "@/lib/character-sections";
import { matchesResource } from "@/lib/combo-resource";
import {
  comboFacets,
  comboSearchQuery,
  matchesComboSearch,
  parseComboSearchParams,
  sortComboResults,
  starterLabel,
  starterOptions,
  type ComboSearchParams,
} from "@/lib/combo-search";
import styles from "./combo-explorer.module.css";

type ComboExplorerProps = {
  characterSlug: string;
  items: CharacterSectionItem[];
  previewToken?: string | null;
  q?: string | string[];
  difficulty?: string | string[];
  resource?: string | string[];
  // 追加の絞り込み（始動技・画面位置・CH/PC・操作タイプ・ドライブ・SA・並び順）。未指定なら従来どおり
  search?: Record<string, string | string[] | undefined>;
};

type ComboMeta = {
  preview: boolean;
  damage: number | null;
  drive: number | null;
  sa: number | null;
  difficulty: number | null;
  verificationStatus: string | null;
};

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function parseMeta(meta: string | null): ComboMeta {
  const result: ComboMeta = { preview: false, damage: null, drive: null, sa: null, difficulty: null, verificationStatus: null };
  for (const part of (meta ?? "").split(" / ").map((value) => value.trim()).filter(Boolean)) {
    if (part === "未公開プレビュー") result.preview = true;
    if (["verified", "unverified", "reviewed", "pending"].includes(part)) result.verificationStatus = part;
    const damage = part.match(/^(\d+)\s*dmg$/i);
    if (damage) result.damage = Number(damage[1]);
    const drive = part.match(/^D\s+(-?\d+(?:\.\d+)?)$/i);
    if (drive) result.drive = Number(drive[1]);
    const sa = part.match(/^SA\s+(-?\d+(?:\.\d+)?)$/i);
    if (sa) result.sa = Number(sa[1]);
    const difficulty = part.match(/^難易度\s+(\d+)$/);
    if (difficulty) result.difficulty = Number(difficulty[1]);
  }
  return result;
}

function difficultyBand(value: number | null) {
  if (value === null) return "unknown";
  if (value <= 2) return "easy";
  if (value === 3) return "standard";
  return "advanced";
}

function href(
  characterSlug: string,
  previewToken: string | null | undefined,
  params: { q?: string; difficulty?: string; resource?: string; extra?: ComboSearchParams }
) {
  const search = new URLSearchParams();
  if (previewToken) search.set("preview", previewToken);
  if (params.q) search.set("q", params.q);
  if (params.difficulty && params.difficulty !== "all") search.set("difficulty", params.difficulty);
  if (params.resource && params.resource !== "all") search.set("resource", params.resource);
  if (params.extra) for (const [key, value] of comboSearchQuery(params.extra)) search.set(key, value);
  const suffix = search.toString();
  return `/characters/${characterSlug}/combos${suffix ? `?${suffix}` : ""}`;
}

export function ComboExplorer({
  characterSlug,
  items,
  previewToken,
  q,
  difficulty,
  resource,
  search,
}: ComboExplorerProps) {
  const query = one(q).slice(0, 80);
  const selectedDifficulty = one(difficulty) || "all";
  const selectedResource = one(resource) || "all";
  const normalizedQuery = query.toLocaleLowerCase("ja");

  const extra = parseComboSearchParams(search ?? {});
  const prepared = items.map((item) => {
    const meta = item.combo ?? parseMeta(item.meta);
    const facets = comboFacets({ ...item.combo, name: item.title, purpose: item.combo?.purpose ?? item.subtitle, damage: meta.damage, drive: meta.drive, sa: meta.sa });
    return { item, meta, facets };
  });
  const filtered = sortComboResults(prepared.filter(({ item, meta, facets }) => {
    if (selectedDifficulty !== "all" && difficultyBand(meta.difficulty) !== selectedDifficulty) return false;
    if (!matchesResource(meta, selectedResource)) return false;
    if (!matchesComboSearch(facets, extra)) return false;
    if (!normalizedQuery) return true;
    return [item.title, item.subtitle, item.meta]
      .filter((value): value is string => Boolean(value))
      .join(" ")
      .toLocaleLowerCase("ja")
      .includes(normalizedQuery);
  }), (row) => row.facets, extra.sort);
  const starters = starterOptions(prepared.map((row) => row.facets));
  const base = { q: query, difficulty: selectedDifficulty, resource: selectedResource };
  const withExtra = (patch: Partial<ComboSearchParams>) => href(characterSlug, previewToken, { ...base, extra: { ...extra, ...patch } });
  const extraRows: Array<{ label: string; key: keyof ComboSearchParams; options: Array<[string, string]> }> = [
    { label: "始動技", key: "starter", options: [["all", "すべて"], ...starters.map(({ value, count }): [string, string] => [value, `${starterLabel(value)} (${count})`])] },
    { label: "画面位置", key: "position", options: [["all", "すべて"], ["center", "画面中央"], ["corner", "画面端"], ["unknown", "記載なし"]] },
    { label: "ヒット状況", key: "hit", options: [["all", "すべて"], ["pc", "PC始動"], ["ch", "CH始動"], ["none", "PC/CH記載なし"]] },
    { label: "操作タイプ", key: "control", options: [["all", "すべて"], ["classic", "クラシック"], ["modern", "モダン"], ["unknown", "記載なし"]] },
    { label: "ドライブ", key: "drive", options: [["all", "すべて"], ["0", "0本"], ["1", "1本"], ["2", "2本"], ["3+", "3本以上"]] },
    { label: "SA", key: "sa", options: [["all", "すべて"], ["0", "0本"], ["1", "1本"], ["2", "2本"], ["3", "3本"]] },
    { label: "並び順", key: "sort", options: [["default", "標準"], ["damage-desc", "ダメージが高い順"], ["damage-asc", "ダメージが低い順"]] },
  ];

  return (
    <div className={styles.explorer}>
      <section className={styles.toolbar} aria-label="コンボの検索と絞り込み">
        <form className={styles.search} action={`/characters/${characterSlug}/combos`}>
          {previewToken ? <input type="hidden" name="preview" value={previewToken} /> : null}
          {selectedDifficulty !== "all" ? <input type="hidden" name="difficulty" value={selectedDifficulty} /> : null}
          {selectedResource !== "all" ? <input type="hidden" name="resource" value={selectedResource} /> : null}
          {comboSearchQuery(extra).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
          <input
            aria-label="コンボを検索"
            defaultValue={query}
            name="q"
            placeholder="始動・用途で検索 例: 小技 / 確反 / 端 / リーサル"
          />
          <button type="submit">検索</button>
        </form>

        <div className={styles.filterRow}>
          <span>難易度</span>
          <div>
            {[["all", "すべて"], ["easy", "覚えやすい"], ["standard", "標準"], ["advanced", "高難度"]].map(([key, label]) => (
              <Link
                className={selectedDifficulty === key ? styles.active : styles.filter}
                href={href(characterSlug, previewToken, { q: query, difficulty: key, resource: selectedResource, extra })}
                key={key}
              >{label}</Link>
            ))}
          </div>
        </div>

        <div className={styles.filterRow}>
          <span>ゲージ</span>
          <div>
            {[["all", "すべて"], ["meterless", "完全ノーゲージ"], ["no-sa", "SAなし"], ["drive", "Drive使用"], ["sa", "SA使用"]].map(([key, label]) => (
              <Link
                className={selectedResource === key ? styles.active : styles.filter}
                href={href(characterSlug, previewToken, { q: query, difficulty: selectedDifficulty, resource: key, extra })}
                key={key}
              >{label}</Link>
            ))}
          </div>
        </div>

        {extraRows.map((row) => (
          <div className={styles.filterRow} key={row.key}>
            <span>{row.label}</span>
            <div>
              {row.options.map(([value, label]) => (
                <Link
                  className={extra[row.key] === value ? styles.active : styles.filter}
                  href={withExtra({ [row.key]: value } as Partial<ComboSearchParams>)}
                  key={value}
                >{label}</Link>
              ))}
            </div>
          </div>
        ))}

        <p className={styles.count}>{filtered.length} / {items.length}件</p>
        {extra.sort !== "default" ? <p className={styles.count}>ダメージが記載されていないコンボは末尾に表示しています。</p> : null}
      </section>

      {filtered.length ? (
        <section className={styles.list}>
          {filtered.map(({ item, meta }) => (
            <PilotComboCard
              key={item.id}
              previewToken={previewToken}
              combo={{
                ...item.combo,
                id: item.id,
                href: item.href,
                name: item.title,
                purpose: item.combo?.purpose ?? item.subtitle,
                damage: meta.damage,
                drive: meta.drive,
                sa: meta.sa,
                difficulty: meta.difficulty,
                verificationStatus: meta.verificationStatus,
                preview: meta.preview,
              }}
            />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>条件に合うコンボがありません</h2>
          <p>検索語または絞り込み条件を変更してください。値が記載されていないコンボは、その条件では表示されません。</p>
          <Link className="inline-button button-secondary" href={href(characterSlug, previewToken, {})}>絞り込みを解除</Link>
        </section>
      )}
    </div>
  );
}
