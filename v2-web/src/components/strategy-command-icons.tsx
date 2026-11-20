import { Sf6CommandInput } from "./sf6-command-input";
import type { StrategyIconStep } from "@/lib/strategy-research-display";
import styles from "./strategy-command-icons.module.css";

/**
 * Command icons for a strategy card, in route order. Own moves are drawn from the official classic command;
 * walking, guarding, hit-confirm etc. are supporting text; the opponent's moves are labelled and never drawn
 * as the player's input. Display only.
 */
export function StrategyCommandIcons({ steps, names }: { steps: readonly StrategyIconStep[]; names?: string }) {
  return <span className={styles.route} data-strategy-command-icons="true" role="list" aria-label={names ? `入力手順：${names}` : "入力手順"}>
    {steps.map((step, index) => <span key={index} className={styles.step} role="listitem" data-step-kind={step.kind}>
      {index > 0 ? <span className={styles.arrow} aria-hidden="true">›</span> : null}
      {step.kind === "command" ? <Sf6CommandInput value={step.value} scheme="classic" iconSize={24} />
        : step.kind === "opponent" ? <span className={styles.opponent}><span className={styles.opponentLabel}>相手</span>{step.value}</span>
        : <span className={styles.aux}>{step.value}</span>}
    </span>)}
  </span>;
}
