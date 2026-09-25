"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { appendDevicePreviewToken } from "@/lib/device-preview";
import { releaseFeatures } from "@/lib/release-features";
import styles from "./pilot-combo-card.module.css";

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
  command?: string | null;
  startCondition?: string | null;
  endCondition?: string | null;
  position?: string | null;
  patch?: string | null;
  sourceLabel?: string | null;
  sourceUrl?: string | null;
  media?: {
    type: "gif" | "webp" | "video";
    url: string;
    posterUrl?: string | null;
  } | null;
};

function displayValue(value: string | number | null | undefined, fallback = "未確認") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

const categoryLabels: Record<string, string> = {
  basic: "基本",
  confirm: "ヒット確認",
  neutral: "立ち回り始動",
  sa: "SA使用",
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
}: {
  combo: PilotComboCardData;
  previewToken?: string | null;
}) {
  const [favorite, setFavorite] = useState(false);
  const [training, setTraining] = useState(false);
  const verified = combo.verificationStatus === "verified";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setFavorite(readIds(FAVORITE_KEY).includes(combo.id));
      setTraining(readIds(TRAINING_KEY).includes(combo.id));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [combo.id]);

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
    ["情報源", combo.sourceLabel ?? "参考リンクなし"],
  ];

  return (
    <article className={styles.card}>
      {combo.media ? (
        <div className={styles.media}>
          {combo.media.type === "video" ? (
            <video controls preload="metadata" poster={combo.media.posterUrl ?? undefined}>
              <source src={combo.media.url} />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- Preview media can be GIF/WebP and is not a stable optimized asset.
            <img src={combo.media.url} alt={`${combo.name}の動作確認`} width="960" height="540" loading="lazy" />
          )}
        </div>
      ) : <div className={styles.mediaPlaceholder}><span>動作メディア</span><small>動作メディア未登録</small></div>}

      <div className={styles.summaryRow}>
        <div className={styles.main}>
          <div className={styles.badges}>
            <span>{combo.category ? categoryLabels[combo.category] ?? combo.category : "カテゴリ未確認"}</span>
            <span className={styles.difficulty}>{verified && combo.difficulty !== null ? `難易度 ${combo.difficulty}/5` : "難易度 未確認"}</span>
            <span>ドライブ {displayValue(combo.drive)}</span>
            <span>SA {displayValue(combo.sa)}</span>
            {combo.preview ? <span className={styles.preview}>確認用</span> : null}
          </div>
          <h2>{combo.name}</h2>
          {combo.purpose ? <p>{combo.purpose}</p> : null}
        </div>

        <div className={styles.damage}>
          <small>ダメージ</small>
          <strong>{displayValue(combo.damage)}</strong>
        </div>
      </div>

      <div className={styles.actions}>
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
      </div>

      <details className={styles.details}>
        <summary>詳細を開く</summary>
        <div className={styles.detailBody}>
          <dl>
            {expandedFacts.map(([label, value]) => (
              <div key={String(label)}>
                <dt>{label}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
          </dl>
          {combo.sourceUrl && combo.sourceLabel ? (
            <a href={combo.sourceUrl} target="_blank" rel="noopener noreferrer">
              {combo.sourceLabel} ↗
            </a>
          ) : null}
          {releaseFeatures.publicStrategyContent ? <Link href={appendDevicePreviewToken(combo.href, previewToken)}>個別ページを見る →</Link> : null}
        </div>
      </details>
    </article>
  );
}
