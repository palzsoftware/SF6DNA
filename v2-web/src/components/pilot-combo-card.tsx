"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { appendDevicePreviewToken } from "@/lib/device-preview";
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
    ["コマンド", combo.command],
    ["ダメージ", combo.damage],
    ["Drive Gauge", combo.drive],
    ["SA Gauge", combo.sa],
    ["開始条件", combo.startCondition],
    ["終了状況", combo.endCondition],
    ["位置", combo.position],
    ["用途", combo.purpose],
    ["Patch", combo.patch],
  ].filter((entry) => entry[1] !== null && entry[1] !== undefined && entry[1] !== "");

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
      ) : null}

      <div className={styles.summaryRow}>
        <div className={styles.main}>
          <div className={styles.badges}>
            {verified && combo.difficulty !== null ? (
              <span className={styles.difficulty}>難易度 {combo.difficulty}/5</span>
            ) : null}
            {(combo.drive ?? 0) === 0 && (combo.sa ?? 0) === 0 ? <span>ノーゲージ</span> : null}
            {(combo.drive ?? 0) > 0 ? <span>D {combo.drive}</span> : null}
            {(combo.sa ?? 0) > 0 ? <span>SA {combo.sa}</span> : null}
            {combo.preview ? <span className={styles.preview}>確認用</span> : null}
          </div>
          <h2>{combo.name}</h2>
          {combo.purpose ? <p>{combo.purpose}</p> : null}
        </div>

        {combo.damage !== null ? (
          <div className={styles.damage}>
            <small>ダメージ</small>
            <strong>{combo.damage}</strong>
          </div>
        ) : null}
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
          {expandedFacts.length ? (
            <dl>
              {expandedFacts.map(([label, value]) => (
                <div key={String(label)}>
                  <dt>{label}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {combo.sourceUrl && combo.sourceLabel ? (
            <a href={combo.sourceUrl} target="_blank" rel="noopener noreferrer">
              {combo.sourceLabel} ↗
            </a>
          ) : null}
          <Link href={appendDevicePreviewToken(combo.href, previewToken)}>個別ページを見る →</Link>
        </div>
      </details>
    </article>
  );
}
