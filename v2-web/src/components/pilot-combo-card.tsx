"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { appendDevicePreviewToken } from "@/lib/device-preview";
import { releaseFeatures } from "@/lib/release-features";
import { localizeComboText, localizeSourceType } from "@/lib/detail-localization";
import { isComboIconPilot } from "@/lib/combo-input-tokens";
import styles from "./pilot-combo-card.module.css";
import { ComboInputRecipe } from "./combo-input-recipe";

const FAVORITE_KEY = "sf6dna:favorite-combos:v1";
const TRAINING_KEY = "sf6dna:training-combos:v1";

export type PilotComboCardData = {
  id: string;
  href: string;
  name: string;
  purpose: string | null;
  damage: number | null;
  drive: number | null;
  sa: number | null;
  difficulty: number | null;
  verificationStatus: string | null;
  preview: boolean;
  category?: string | null;
  starter?: string | null;
  command?: string | null;
  rawRecipe?: string | null;
  startCondition?: string | null;
  endCondition?: string | null;
  position?: string | null;
  patch?: string | null;
  sourceLabel?: string | null;
  sourceType?: string | null;
  sourceUrl?: string | null;
  media?: {
    type: "gif" | "webp" | "video";
    url: string;
    posterUrl?: string | null;
    loop?: boolean;
    caption?: string | null;
  } | null;
};

function displayValue(value: string | number | null | undefined, fallback = "未確認") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function safeExternalUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

const categoryLabels: Record<string, string> = {
  basic: "基本",
  confirm: "ヒット確認",
  neutral: "立ち回り始動",
  sa: "SA使用",
  drive_rush: "ドライブラッシュ使用",
};

function readIds(key: string) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function toggleStoredId(key: string, id: string) {
  const ids = new Set(readIds(key));
  if (ids.has(id)) ids.delete(id);
  else ids.add(id);
  window.localStorage.setItem(key, JSON.stringify([...ids]));
  return ids.has(id);
}

export function PilotComboCard({
  combo,
  previewToken,
  sample = false,
}: {
  combo: PilotComboCardData;
  previewToken?: string | null;
  sample?: boolean;
}) {
  const [favorite, setFavorite] = useState(false);
  const [training, setTraining] = useState(false);
  const verified = combo.verificationStatus === "verified";
  const sourceUrl = safeExternalUrl(combo.sourceUrl);

  useEffect(() => {
    if (sample) return;
    const frame = window.requestAnimationFrame(() => {
      setFavorite(readIds(FAVORITE_KEY).includes(combo.id));
      setTraining(readIds(TRAINING_KEY).includes(combo.id));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [combo.id, sample]);

  const expandedFacts = [
    ["コマンド", displayValue(combo.command, "コマンド未確認")],
    ["ダメージ", displayValue(combo.damage)],
    ["ドライブゲージ使用量", displayValue(combo.drive)],
    ["SAゲージ使用量", displayValue(combo.sa)],
    ["開始条件", displayValue(combo.startCondition)],
    ["終了状況", displayValue(combo.endCondition)],
    ["位置", displayValue(combo.position)],
    ["用途", displayValue(combo.purpose)],
    ["運び", "未確認"],
    ["使用頻度", "未確認"],
    ["対応バージョン", displayValue(combo.patch)],
  ];

  return (
    <article className={styles.card}>
      {combo.media ? (
        <div className={styles.media}>
          {combo.media.type === "video" ? (
            <video controls playsInline loop={combo.media.loop} muted={combo.media.loop} preload="none" poster={combo.media.posterUrl ?? undefined}>
              <source src={combo.media.url} />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- Preview media can be GIF/WebP and is not a stable optimized asset.
            <img src={combo.media.url} alt={`${combo.name}の動作確認`} width="960" height="540" loading="lazy" />
          )}
        </div>
      ) : <div className={styles.mediaPlaceholder}><span>動作メディア</span><small>動作メディア未登録</small></div>}

      {combo.media?.caption ? <p role="note">{combo.media.caption}</p> : null}

      <div className={styles.summaryRow}>
        <div className={styles.main}>
          <div className={styles.badges}>
            <span>{combo.category ? categoryLabels[combo.category] ?? localizeComboText(combo.category) : "カテゴリ未確認"}</span>
            <span className={styles.difficulty}>{verified && combo.difficulty !== null ? `難易度 ${combo.difficulty}/5` : "難易度 未確認"}</span>
            <span>ドライブ {displayValue(combo.drive)}</span>
            <span>SA {displayValue(combo.sa)}</span>
            {combo.preview ? <span className={styles.preview}>確認用</span> : null}
          </div>
          <h2>{combo.name}</h2>
          {combo.starter ? <p>始動: {combo.starter}</p> : null}
          {combo.purpose ? <p>{combo.purpose}</p> : null}
        </div>

        <div className={styles.damage}>
          <small>ダメージ</small>
          <strong>{displayValue(combo.damage)}</strong>
        </div>
      </div>

      {!sample ? <div className={styles.actions}>
        <button
          type="button"
          aria-label={`${combo.name}をお気に入り${favorite ? "から外す" : "に追加"}`}
          aria-pressed={favorite}
          onClick={() => setFavorite(toggleStoredId(FAVORITE_KEY, combo.id))}
        >
          {favorite ? "★ お気に入り済み" : "☆ お気に入り"}
        </button>
        <button
          type="button"
          aria-label={`${combo.name}を${training ? "練習対象から外す" : "練習対象にする"}`}
          aria-pressed={training}
          onClick={() => setTraining(toggleStoredId(TRAINING_KEY, combo.id))}
        >
          {training ? "● 練習中" : "● 練習する"}
        </button>
      </div> : null}

      <details className={styles.details}>
        <summary>詳細を開く</summary>
        <div className={styles.detailBody}>
          <dl>
            {expandedFacts.map(([label, value]) => (
              <div key={String(label)}>
                <dt>{label}</dt>
                <dd>{label === "コマンド" && (combo.rawRecipe ?? combo.command) ? <ComboInputRecipe recipe={combo.rawRecipe ?? combo.command ?? ""} iconPilot={isComboIconPilot(combo.id)} /> : String(value)}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.source}>
            <span>情報源</span>
            {sourceUrl && combo.sourceLabel ? (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                {combo.sourceLabel}{combo.sourceType ? ` / ${localizeSourceType(combo.sourceType)}` : ""}（{new URL(sourceUrl).hostname}）↗
              </a>
            ) : <span>参考リンクなし</span>}
          </div>
          {!sample && releaseFeatures.publicStrategyContent ? <Link href={appendDevicePreviewToken(combo.href, previewToken)}>個別ページを見る →</Link> : null}
        </div>
      </details>
    </article>
  );
}
