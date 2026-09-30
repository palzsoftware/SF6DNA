import { tokenizeComboRecipe } from "@/lib/combo-input-tokens";
import styles from "./combo-input-recipe.module.css";

/** Original text remains available alongside SF6DNA's own text-backed input symbols. */
export function ComboInputRecipe({ recipe }: { recipe: string }) {
  const tokens = tokenizeComboRecipe(recipe);
  return (
    <div className={styles.recipe}>
      <div className={styles.tokens} aria-label="入力の見方">
        {tokens.map((token, index) => token.type === "TEXT" || token.type === "AMBIGUOUS" ? (
          <span key={index} className={styles.text} data-token-type={token.type}>{token.raw}</span>
        ) : (
          <span key={index} className={styles.icon} data-token-type={token.type} data-token-value={token.value} role="img" aria-label={token.label} title={`${token.label} (${token.raw})`}>
            <span aria-hidden="true">{token.display}</span>
          </span>
        ))}
      </div>
      <div className={styles.original}><span>原表記: </span>{recipe}</div>
    </div>
  );
}
