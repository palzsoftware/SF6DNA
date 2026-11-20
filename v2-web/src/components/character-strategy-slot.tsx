import type { ReactNode } from "react";
import styles from "./character-unified-page.module.css";
import { CharacterStrategyResearchGrid, type StrategyMoveLinks } from "./character-strategy-research-grid";
import { isStrategyReferenceVisible, listStrategyResearchCards, type StrategyResearchCard, type StrategySlotKind } from "@/lib/strategy-research-contract";
export function CharacterStrategySlot({ kind, previewContent, characterSlug, moveLinks, reviewDescriptions, reviewedCards }: { kind: StrategySlotKind; previewContent?: ReactNode; characterSlug?: string; moveLinks?: StrategyMoveLinks; reviewDescriptions?: Readonly<Record<string, string>>; reviewedCards?: readonly StrategyResearchCard[] }) {
  const labels = { combo: ["pilot-combos", "コンボ"], setplay: ["pilot-setplay", "セットプレイ"], sequence: ["pilot-sequences", "連携"], counter: ["pilot-counters", "対策"] } as const;
  const [id, label] = labels[kind];
  const showPreview = kind === "combo" && ["development", "preview"].includes(process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "");
  const matchingReviewedCards = reviewedCards?.filter(card => card.characterSlug === characterSlug && card.category === (kind === "sequence" ? "pressure" : kind));
  const showResearch = Boolean(characterSlug && isStrategyReferenceVisible(process.env, characterSlug) && (listStrategyResearchCards(characterSlug, kind).length || matchingReviewedCards?.length));
  return <section id={id} className={styles.section} data-strategy-publication="CLOSED" data-strategy-reference={showResearch ? "VISIBLE" : "HIDDEN"}><h2>{label}</h2>{showPreview && previewContent ? previewContent : null}{showResearch && characterSlug ? <CharacterStrategyResearchGrid characterSlug={characterSlug} kind={kind} moveLinks={moveLinks} reviewDescriptions={reviewDescriptions} reviewedCards={matchingReviewedCards} /> : !(showPreview && previewContent) ? <p>今後のアップデートで追加予定です。</p> : null}</section>;
}
