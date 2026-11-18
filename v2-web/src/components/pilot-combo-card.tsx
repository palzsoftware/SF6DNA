"use client";

import Link from "next/link";
import { Sf6CardRecipe } from "./sf6-card-command";
import type { CardRecipe } from "../lib/card-command-gauge-contract";
import { useEffect, useState } from "react";
import { appendDevicePreviewToken } from "@/lib/device-preview";
import { releaseFeatures } from "@/lib/release-features";
import { localizeComboText, localizeSourceType } from "@/lib/detail-localization";
import { isComboIconPilot } from "@/lib/combo-input-tokens";
import styles from "./pilot-combo-card.module.css";
import { ComboInputRecipe } from "./combo-input-recipe";
import { StrategyCard, japaneseRouteFromRecipe } from "./strategy-card";

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
  commandRecipe,
}: {
  combo: PilotComboCardData;
  previewToken?: string | null;
  sample?: boolean;
  commandRecipe?: CardRecipe;
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

  const recipeMatches = Boolean(commandRecipe && commandRecipe.recipe_id === combo.id && commandRecipe.raw_recipe === (combo.rawRecipe ?? combo.command));
  const rawRecipe = combo.rawRecipe ?? combo.command ?? null;
  const categoryLabel = combo.category ? categoryLabels[combo.category] ?? localizeComboText(combo.category) : "カテゴリ未確認";
  const facts = [
    ["ダメージ", displayValue(combo.damage)],
    ["Dゲージ消費", displayValue(combo.drive)],
    ["SA消費", displayValue(combo.sa)],
    ["終了状況", displayValue(combo.endCondition)],
    ["難易度", verified && combo.difficulty !== null ? `${combo.difficulty}/5` : "未確認"],
    ["画面位置", displayValue(combo.position)],
  ] as const;
  const details = [
    ["コマンド", displayValue(rawRecipe, "コマンド未確認")],
    ["ドライブゲージ使用量", displayValue(combo.drive)],
    ["SAゲージ使用量", displayValue(combo.sa)],
    ["開始条件", displayValue(combo.startCondition)],
    ["終了状況", displayValue(combo.endCondition)],
    ["位置", displayValue(combo.position)],
    ["用途", displayValue(combo.purpose)],
    ["運び", "未確認"],
    ["使用頻度", "未確認"],
    ["始動", displayValue(combo.starter)],
    ["対応バージョン", displayValue(combo.patch)],
    ["検証状態", verified ? "検証済み" : "未検証"],
    ["情報源", sourceUrl && combo.sourceLabel ? (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {combo.sourceLabel}{combo.sourceType ? ` / ${localizeSourceType(combo.sourceType)}` : ""}（{new URL(sourceUrl).hostname}）↗
      </a>
    ) : "参考リンクなし"],
  ] as const;
  const bookmark = !sample ? (
    <button type="button" className={styles.bookmark} aria-label={`${combo.name}をお気に入り${favorite ? "から外す" : "に追加"}`} aria-pressed={favorite}
      onClick={() => setFavorite(toggleStoredId(FAVORITE_KEY, combo.id))}>{favorite ? "★" : "☆"}</button>
  ) : null;

  return (
    <StrategyCard
      kind="combo"
      title={combo.name}
      category={combo.preview ? `${categoryLabel}・確認用` : categoryLabel}
      control={commandRecipe && recipeMatches && commandRecipe.control !== "unknown" ? commandRecipe.control.toUpperCase() : null}
      media={combo.media ? { type: combo.media.type, url: combo.media.url, posterUrl: combo.media.posterUrl, loop: combo.media.loop, credit: combo.media.caption } : null}
      mediaAction={bookmark}
      facts={facts}
      commandIcons={rawRecipe ? (recipeMatches && commandRecipe ? <Sf6CardRecipe recipe={commandRecipe} /> : <ComboInputRecipe recipe={combo.rawRecipe ?? combo.command ?? ""} iconPilot={isComboIconPilot(combo.id)} />) : null}
      commandJa={recipeMatches ? japaneseRouteFromRecipe(commandRecipe) : null}
      body={combo.purpose}
      details={details}
      detailsExtra={<>
        {!sample ? <button type="button" className={styles.trainingToggle} aria-label={`${combo.name}を${training ? "練習対象から外す" : "練習対象にする"}`} aria-pressed={training}
          onClick={() => setTraining(toggleStoredId(TRAINING_KEY, combo.id))}>{training ? "● 練習中" : "● 練習する"}</button> : null}
        {!sample && releaseFeatures.publicStrategyContent ? <Link href={appendDevicePreviewToken(combo.href, previewToken)}>個別ページを見る →</Link> : null}
      </>}
    />
  );
}
