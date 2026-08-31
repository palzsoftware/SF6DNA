import Link from "next/link";
import { appendDevicePreviewToken } from "@/lib/device-preview";
import type { CharacterSectionItem } from "@/lib/character-sections";
import styles from "./combo-explorer.module.css";

type ComboExplorerProps = {
  characterSlug: string;
  items: CharacterSectionItem[];
  previewToken?: string | null;
  q?: string | string[];
  difficulty?: string | string[];
  resource?: string | string[];
};

type ComboMeta = {
  preview: boolean;
  damage: number | null;
  drive: number | null;
  sa: number | null;
  difficulty: number | null;
};

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function parseMeta(meta: string | null): ComboMeta {
  const result: ComboMeta = { preview: false, damage: null, drive: null, sa: null, difficulty: null };
  for (const part of (meta ?? "").split(" / ").map((value) => value.trim()).filter(Boolean)) {
    if (part === "未公開プレビュー") result.preview = true;
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

function matchesResource(meta: ComboMeta, resource: string) {
  if (resource === "all") return true;
  const drive = meta.drive ?? 0;
  const sa = meta.sa ?? 0;
  if (resource === "meterless") return drive === 0 && sa === 0;
  if (resource === "no-sa") return sa === 0;
  if (resource === "drive") return drive > 0;
  if (resource === "sa") return sa > 0;
  return true;
}

function href(
  characterSlug: string,
  previewToken: string | null | undefined,
  params: { q?: string; difficulty?: string; resource?: string }
) {
  const search = new URLSearchParams();
  if (previewToken) search.set("preview", previewToken);
  if (params.q) search.set("q", params.q);
  if (params.difficulty && params.difficulty !== "all") search.set("difficulty", params.difficulty);
  if (params.resource && params.resource !== "all") search.set("resource", params.resource);
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
}: ComboExplorerProps) {
  const query = one(q).slice(0, 80);
  const selectedDifficulty = one(difficulty) || "all";
  const selectedResource = one(resource) || "all";
  const normalizedQuery = query.toLocaleLowerCase("ja");

  const prepared = items.map((item) => ({ item, meta: parseMeta(item.meta) }));
  const filtered = prepared.filter(({ item, meta }) => {
    if (selectedDifficulty !== "all" && difficultyBand(meta.difficulty) !== selectedDifficulty) return false;
    if (!matchesResource(meta, selectedResource)) return false;
    if (!normalizedQuery) return true;
    return [item.title, item.subtitle, item.meta]
      .filter((value): value is string => Boolean(value))
      .join(" ")
      .toLocaleLowerCase("ja")
      .includes(normalizedQuery);
  });

  return (
    <div className={styles.explorer}>
      <section className={styles.toolbar} aria-label="コンボの検索と絞り込み">
        <form className={styles.search} action={`/characters/${characterSlug}/combos`}>
          {previewToken ? <input type="hidden" name="preview" value={previewToken} /> : null}
          {selectedDifficulty !== "all" ? <input type="hidden" name="difficulty" value={selectedDifficulty} /> : null}
          {selectedResource !== "all" ? <input type="hidden" name="resource" value={selectedResource} /> : null}
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
                href={href(characterSlug, previewToken, { q: query, difficulty: key, resource: selectedResource })}
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
                href={href(characterSlug, previewToken, { q: query, difficulty: selectedDifficulty, resource: key })}
                key={key}
              >{label}</Link>
            ))}
          </div>
        </div>

        <p className={styles.count}>{filtered.length} / {items.length}件</p>
      </section>

      {filtered.length ? (
        <section className={styles.list}>
          {filtered.map(({ item, meta }) => (
            <article className={styles.card} key={item.id}>
              <div className={styles.main}>
                <div className={styles.badges}>
                  {meta.difficulty !== null ? <span className={styles.difficulty}>難易度 {meta.difficulty}/5</span> : null}
                  {(meta.drive ?? 0) === 0 && (meta.sa ?? 0) === 0 ? <span>ノーゲージ</span> : null}
                  {(meta.drive ?? 0) > 0 ? <span>D {meta.drive}</span> : null}
                  {(meta.sa ?? 0) > 0 ? <span>SA {meta.sa}</span> : null}
                  {meta.preview ? <span className={styles.preview}>確認用</span> : null}
                </div>
                <h2>{item.title}</h2>
                {item.subtitle ? <p>{item.subtitle}</p> : null}
              </div>

              <div className={styles.damage}>
                <small>ダメージ</small>
                <strong>{meta.damage ?? "—"}</strong>
              </div>

              <Link className={styles.more} href={appendDevicePreviewToken(item.href, previewToken)}>
                詳細を見る →
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>条件に合うコンボがありません</h2>
          <p>検索語または難易度・ゲージ条件を変更してください。</p>
          <Link className="inline-button button-secondary" href={href(characterSlug, previewToken, {})}>絞り込みを解除</Link>
        </section>
      )}
    </div>
  );
}
