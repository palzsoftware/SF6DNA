import { Sf6CommandIcon, hasCommandIcon } from "@/components/sf6-command-icon";
import { commandIconAccessibleName, commandIconPresentation, type ControlScheme } from "@/lib/sf6-command-icon-contract";
import { tokenizeSf6Command } from "@/lib/sf6-command-tokens";
import { commandDirectionDisplay } from "@/lib/command-direction-display";
import styles from "./sf6-command-input.module.css";

type IconSize = 16 | 20 | 24 | 32 | 48;

/** Display-only renderer. Source/DB notation is never rewritten by this component. */
export function Sf6CommandInput({
  value,
  scheme = "unknown",
  iconSize = 24,
  accessibleName,
}: {
  value: string;
  scheme?: ControlScheme;
  iconSize?: IconSize;
  accessibleName?: string;
}) {
  const tokens = tokenizeSf6Command(commandDirectionDisplay(value));
  if (!tokens.length) return <span className={styles.pending}>コマンドを確認中</span>;

  return <span className={styles.tokens} role="img" aria-label={accessibleName ?? commandIconAccessibleName(tokens)} data-control-scheme={scheme}>
    {tokens.map((token, index) => {
      if (/^\s+$/.test(token.raw)) return null;
      if (token.kind === "text") return <span key={index} className={styles.text} aria-hidden="true">{token.display}</span>;
      if (token.kind === "separator") return <span key={index} className={styles.separator} aria-hidden="true">{token.display}</span>;
      if (token.kind === "pending") return <span key={index} className={styles.pending} aria-hidden="true">{token.display}</span>;

      const presentation = commandIconPresentation(token, scheme);
      const hasIconPart = presentation.parts.some(part => part.type === "icon" && part.asset && hasCommandIcon(part.asset));
      if (!hasIconPart) {
        return <span
          key={index}
          className={styles.token}
          style={token.kind === "button" ? { fontSize: "1em", fontFamily: "inherit" } : undefined}
          data-token-kind={token.kind}
          data-scheme-mismatch={presentation.schemeMismatch || undefined}
          aria-hidden="true"
        >{presentation.parts.map(part => part.value).join("")}</span>;
      }

      return <span key={index} className={styles.iconToken} data-token-kind={token.kind} aria-hidden="true">
        {presentation.parts.map((part, partIndex) => part.type === "icon" && part.asset && hasCommandIcon(part.asset)
          ? <Sf6CommandIcon key={`${part.asset}-${partIndex}`} asset={part.asset} size={iconSize} className={styles.icon} />
          : <span key={`${part.value}-${partIndex}`} className={styles.partFallback}>{part.value}</span>)}
      </span>;
    })}
  </span>;
}
