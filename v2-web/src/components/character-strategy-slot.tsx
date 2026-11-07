import type { ReactNode } from "react";
import { StrategyCardExplorer, type StrategyCardView } from "./strategy-card-explorer";
import styles from "./character-unified-page.module.css";

export function CharacterStrategySlot({ kind, previewContent, items = [] }: {
  kind: "combo" | "setplay" | "sequence" | "counter";
  previewContent?: ReactNode;
  /** Server-side publication filtering is mandatory before passing this array. */
  items?: StrategyCardView[];
}) {
  const labels = { combo: ["pilot-combos", "コンボ"], setplay: ["pilot-setplay", "セットプレイ"],
    sequence: ["pilot-sequences", "連携"], counter: ["pilot-counters", "対策"] } as const;
  const [id, label] = labels[kind];
  // A presentation component must not make unpublished research publicly visible.
  // Preview cards can be supplied only by an existing server authorization gate.
  const showPreview = kind === "combo" && ["development", "preview"].includes(process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "");
  return <section id={id} className={styles.section} data-strategy-publication="CLOSED">
    <h2>{label}</h2>
    <StrategyCardExplorer kind={kind} items={items} />
    {showPreview && previewContent ? previewContent : null}
  </section>;
}
