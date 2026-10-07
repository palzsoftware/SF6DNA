import { tokenizeSf6Command } from "@/lib/sf6-command-tokens";
import styles from "./sf6-command-input.module.css";

/** Display-only renderer. Source/DB notation is never rewritten by this component. */
export function Sf6CommandInput({ value }: { value: string }) {
  const tokens = tokenizeSf6Command(value);
  if (!tokens.length) return <span className={styles.pending}>コマンドを確認中</span>;
  return <span className={styles.tokens} role="img" aria-label={tokens.map(token => token.label).filter(Boolean).join(" ")}>
    {tokens.map((token, index) => {
      if (/^\s+$/.test(token.raw)) return null;
      if (token.kind === "text") return <span key={index} className={styles.text} aria-hidden="true">{token.display}</span>;
      if (token.kind === "separator") return <span key={index} className={styles.separator} aria-hidden="true">{token.display}</span>;
      if (token.kind === "pending") return <span key={index} className={styles.pending} aria-hidden="true">{token.display}</span>;
      return <span key={index} className={styles.token} data-token-kind={token.kind} aria-hidden="true">
        <span aria-hidden="true">{token.display}</span>
      </span>;
    })}
  </span>;
}
