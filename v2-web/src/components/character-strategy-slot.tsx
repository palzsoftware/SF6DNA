import type { ReactNode } from "react";
import styles from "./character-unified-page.module.css";
import { CharacterStrategyResearchGrid } from "./character-strategy-research-grid";
import { isStrategyReferenceVisible, listStrategyResearchCards, type StrategySlotKind } from "@/lib/strategy-research-contract";
export function CharacterStrategySlot({ kind, previewContent, characterSlug }: { kind: StrategySlotKind; previewContent?: ReactNode; characterSlug?: string }) {
  const labels = { combo: ["pilot-combos", "コンボ"], setplay: ["pilot-setplay", "セットプレイ"], sequence: ["pilot-sequences", "連携"], counter: ["pilot-counters", "対策"] } as const;
  const [id, label] = labels[kind];
  const showPreview = kind === "combo" && ["development", "preview"].includes(process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "");
  const showResearch = Boolean(characterSlug && isStrategyReferenceVisible(process.env, characterSlug) && listStrategyResearchCards(characterSlug, kind).length);
  return <section id={id} className={styles.section} data-strategy-publication="CLOSED" data-strategy-reference={showResearch ? "VISIBLE" : "HIDDEN"}><h2>{label}</h2>{showPreview && previewContent ? previewContent : null}{showResearch && characterSlug ? <CharacterStrategyResearchGrid characterSlug={characterSlug} kind={kind} /> : !(showPreview && previewContent) ? <p>今後のアップデートで追加予定です。</p> : null}</section>;
}
