import type { ReactNode } from "react";
import styles from "./character-unified-page.module.css";
export function CharacterStrategySlot({ kind, previewContent }: { kind: "combo" | "setplay" | "sequence" | "counter"; previewContent?: ReactNode }) {
  const labels = { combo: ["pilot-combos", "コンボ"], setplay: ["pilot-setplay", "セットプレイ"], sequence: ["pilot-sequences", "連携"], counter: ["pilot-counters", "対策"] } as const;
  const [id, label] = labels[kind];
  const showPreview = kind === "combo" && ["development", "preview"].includes(process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "");
  return <section id={id} className={styles.section} data-strategy-publication="CLOSED"><h2>{label}</h2>{showPreview && previewContent ? previewContent : <p>今後のアップデートで追加予定です。</p>}</section>;
}
