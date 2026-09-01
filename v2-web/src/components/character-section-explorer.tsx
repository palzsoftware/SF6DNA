import Link from "next/link";
import { appendDevicePreviewToken } from "@/lib/device-preview";
import type { CharacterSectionItem } from "@/lib/character-sections";
import styles from "./character-section-explorer.module.css";

type ExplorerSection = "matchups" | "training";

type ExplorerProps = {
  section: ExplorerSection;
  characterSlug: string;
  items: CharacterSectionItem[];
  previewToken?: string | null;
  q?: string | string[];
  type?: string | string[];
  side?: string | string[];
  level?: string | string[];
};

const counterTypes = [
  ["all", "すべて"],
  ["matchup_overview", "対面概要"],
  ["matchup_plan", "対面プラン"],
  ["system", "システム"],
  ["punish", "確定反撃"],
  ["defense", "守り"],
  ["anti_air", "対空"],
  ["reaction", "反応"],
  ["approach", "接近への対応"],
  ["zoning", "遠距離戦"],
  ["drive_rush", "ドライブラッシュ対策"],
  ["projectile", "飛び道具"],
  ["drive_impact", "ドライブインパクト"],
  ["adaptation", "相手の動きへの対応"],
  ["counter", "対策"],
  ["neutral_check", "立ち回り確認"],
  ["patch_specific", "現行パッチ限定"],
  ["whiff_punish", "差し返し"],
  ["other", "その他"],
] as const;

const trainingTypes = [
  ["all", "すべて"],
  ["general", "基礎"],
  ["matchup", "キャラ対策"],
  ["defense", "守り"],
  ["punish", "確定反撃"],
  ["anti_air", "対空"],
  ["neutral", "立ち回り"],
  ["reaction", "反応"],
  ["resource", "ゲージ管理"],
  ["oki", "起き攻め"],
  ["other", "その他"],
] as const;

const knownCounterTypes = new Set(counterTypes.filter(([key]) => key !== "all" && key !== "other").map(([key]) => key));
const knownTrainingTypes = new Set(trainingTypes.filter(([key]) => key !== "all" && key !== "other").map(([key]) => key));
const internalTokens = new Set(["未公開プレビュー", "draft", "reviewed", "verified", "unverified", "published"]);

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function metaParts(item: CharacterSectionItem) {
  return (item.meta ?? "")
    .split(" / ")
    .map((part) => part.trim())
    .filter(Boolean);
}

function dataParts(item: CharacterSectionItem) {
  return metaParts(item).filter((part) => !internalTokens.has(part));
}

function itemType(item: CharacterSectionItem) {
  return dataParts(item)[0] ?? "other";
}

function itemSide(item: CharacterSectionItem) {
  const parts = dataParts(item);
  return parts.includes("自キャラ側") ? "self" : parts.includes("相手側") ? "opponent" : "all";
}

function itemLevel(item: CharacterSectionItem) {
  const parts = dataParts(item);
  return parts.find((part) => ["beginner", "intermediate", "advanced", "all"].includes(part)) ?? "all";
}

function itemDuration(item: CharacterSectionItem) {
  return dataParts(item).find((part) => /^\d+分$/.test(part)) ?? null;
}

function difficulty(item: CharacterSectionItem) {
  return dataParts(item).find((part) => part.startsWith("難易度 "))?.replace("難易度 ", "") ?? null;
}

function localizedType(section: ExplorerSection, type: string) {
  const source = section === "matchups" ? counterTypes : trainingTypes;
  return source.find(([key]) => key === type)?.[1] ?? type.replaceAll("_", " ");
}

function localizedLevel(level: string) {
  if (level === "beginner") return "初心者";
  if (level === "intermediate") return "中級者";
  if (level === "advanced") return "上級者";
  return "全レベル";
}

function filterHref(
  section: ExplorerSection,
  characterSlug: string,
  previewToken: string | null | undefined,
  params: { q?: string; type?: string; side?: string; level?: string }
) {
  const search = new URLSearchParams();
  if (previewToken) search.set("preview", previewToken);
  if (params.q) search.set("q", params.q);
  if (params.type && params.type !== "all") search.set("type", params.type);
  if (section === "matchups" && params.side && params.side !== "all") search.set("side", params.side);
  if (section === "training" && params.level && params.level !== "all") search.set("level", params.level);
  const suffix = search.toString();
  return `/characters/${characterSlug}/${section}${suffix ? `?${suffix}` : ""}`;
}

export function CharacterSectionExplorer({
  section,
  characterSlug,
  items,
  previewToken,
  q,
  type,
  side,
  level,
}: ExplorerProps) {
  const query = one(q).slice(0, 80);
  const selectedType = one(type) || "all";
  const selectedSide = one(side) || "all";
  const selectedLevel = one(level) || "all";
  const normalizedQuery = query.toLocaleLowerCase("ja");
  const knownTypes = section === "matchups" ? knownCounterTypes : knownTrainingTypes;

  const filtered = items.filter((item) => {
    const rawType = itemType(item);
    const typeMatches = selectedType === "all"
      || (selectedType === "other" ? !knownTypes.has(rawType as never) : rawType === selectedType);
    if (!typeMatches) return false;
    if (section === "matchups" && selectedSide !== "all" && itemSide(item) !== selectedSide) return false;
    if (section === "training" && selectedLevel !== "all" && itemLevel(item) !== selectedLevel) return false;
    if (!normalizedQuery) return true;
    return [item.title, item.subtitle, item.meta]
      .filter((value): value is string => Boolean(value))
      .join(" ")
      .toLocaleLowerCase("ja")
      .includes(normalizedQuery);
  });

  const typeOptions = section === "matchups" ? counterTypes : trainingTypes;

  return (
    <div className={styles.explorer}>
      <section className={styles.toolbar} aria-label={section === "matchups" ? "対策の検索と絞り込み" : "トレーニングの検索と絞り込み"}>
        <form className={styles.search} action={`/characters/${characterSlug}/${section}`}>
          {previewToken ? <input type="hidden" name="preview" value={previewToken} /> : null}
          {selectedType !== "all" ? <input type="hidden" name="type" value={selectedType} /> : null}
          {section === "matchups" && selectedSide !== "all" ? <input type="hidden" name="side" value={selectedSide} /> : null}
          {section === "training" && selectedLevel !== "all" ? <input type="hidden" name="level" value={selectedLevel} /> : null}
          <input
            aria-label={section === "matchups" ? "対策を検索" : "トレーニングを検索"}
            defaultValue={query}
            name="q"
            placeholder={section === "matchups" ? "技・状況・対策ワードで検索" : "練習内容・目的で検索"}
          />
          <button type="submit">検索</button>
        </form>

        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>内容</span>
          <div className={styles.filters}>
            {typeOptions.map(([key, label]) => (
              <Link
                className={selectedType === key ? styles.filterActive : styles.filter}
                href={filterHref(section, characterSlug, previewToken, {
                  q: query,
                  type: key,
                  side: selectedSide,
                  level: selectedLevel,
                })}
                key={key}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {section === "matchups" ? (
          <div className={styles.filterBlock}>
            <span className={styles.filterLabel}>視点</span>
            <div className={styles.filters}>
              {[["all", "すべて"], ["self", "自キャラ側"], ["opponent", "相手側"]].map(([key, label]) => (
                <Link
                  className={selectedSide === key ? styles.filterActive : styles.filter}
                  href={filterHref(section, characterSlug, previewToken, {
                    q: query,
                    type: selectedType,
                    side: key,
                  })}
                  key={key}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.filterBlock}>
            <span className={styles.filterLabel}>レベル</span>
            <div className={styles.filters}>
              {[["all", "すべて"], ["beginner", "初心者"], ["intermediate", "中級者"], ["advanced", "上級者"]].map(([key, label]) => (
                <Link
                  className={selectedLevel === key ? styles.filterActive : styles.filter}
                  href={filterHref(section, characterSlug, previewToken, {
                    q: query,
                    type: selectedType,
                    level: key,
                  })}
                  key={key}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className={styles.resultCount}>{filtered.length} / {items.length}件</p>
      </section>

      {filtered.length ? (
        <section className={styles.list} aria-live="polite">
          {filtered.map((item) => {
            const rawType = itemType(item);
            const currentSide = itemSide(item);
            const currentLevel = itemLevel(item);
            const duration = itemDuration(item);
            const diff = difficulty(item);
            const preview = metaParts(item).includes("未公開プレビュー");

            return (
              <article className={styles.card} key={item.id}>
                <div className={styles.cardMain}>
                  <div className={styles.badges}>
                    <span className={styles.typeBadge}>{localizedType(section, rawType)}</span>
                    {section === "matchups" && currentSide !== "all" ? (
                      <span className={currentSide === "self" ? styles.infoBadge : styles.warningBadge}>
                        {currentSide === "self" ? "自キャラ側" : "相手側"}
                      </span>
                    ) : null}
                    {section === "training" ? <span className={styles.infoBadge}>{localizedLevel(currentLevel)}</span> : null}
                    {duration ? <span className={styles.timeBadge}>{duration}</span> : null}
                    {diff ? <span className={styles.infoBadge}>難易度 {diff}</span> : null}
                    {preview ? <span className={styles.previewBadge}>確認用</span> : null}
                  </div>
                  <h2>{item.title}</h2>
                  {item.subtitle ? <p>{item.subtitle}</p> : null}
                </div>
                <Link className={styles.more} href={appendDevicePreviewToken(item.href, previewToken)}>
                  詳細を見る →
                </Link>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="empty-state">
          <h2>条件に合う項目がありません</h2>
          <p>検索語を短くするか、絞り込みを解除してください。</p>
          <Link className="inline-button button-secondary" href={filterHref(section, characterSlug, previewToken, {})}>
            絞り込みを解除
          </Link>
        </section>
      )}
    </div>
  );
}
