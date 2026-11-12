import { UnifiedMoveCard } from "@/components/character-unified-page";
import { getArjun77LocalMoveCards, getArjun77SourceRows } from "@/lib/arjun-77-local-move-cards";
import styles from "@/components/character-unified-page.module.css";

const order = ["NORMAL", "AIR", "SPECIAL", "SUPER", "PARRY", "DRIVE_STEP", "F_DASH", "B_DASH"] as const;
const labels: Record<string, string> = { NORMAL: "通常技", AIR: "空中技", SPECIAL: "必殺技・派生", SUPER: "SA", PARRY: "パリィ", DRIVE_STEP: "ドライブラッシュ", F_DASH: "前ステップ", B_DASH: "後ろステップ" };

/** Local-only proof of card rendering; never pass to a public CharacterUnifiedPage. */
export function Arjun77LocalPreview() {
  if (process.env.NODE_ENV !== "development" || process.env.SF6DNA_ARJUN_LOCAL_PREVIEW !== "1" || process.env.VERCEL_ENV) {
    return null;
  }
  const moves = getArjun77LocalMoveCards();
  const sources = getArjun77SourceRows();
  return <main className={`site-shell ${styles.page}`} data-arjun-preview="local-research-only">
    <header><p>ローカル専用・研究候補（公開不可）</p><h1>アルジュン｜技カード77件</h1>
      <p>技名・入力を日本語表記で表示します。現行Patch・公式画面・実機・DB技IDとの照合は未完了です。</p>
      <p>フレーム・ダメージは提供資料の原文値を技カード内に参考表示します。数値は未検証であり公開データへの採用・現行Patch保証ではありません。</p>
    </header>
    {order.map(type => {
      const subset = sources.map((row, i) => ({row, move:moves[i]})).filter(item => item.row.sourceType === type);
      return subset.length ? <section className={styles.section} key={type} aria-label={labels[type]}>
        <h2>{labels[type]}（{subset.length}件）</h2>
        <div className={styles.moveGrid}>
          {subset.map(({row,move}) => <div key={row.id}>
            <p role="note">未検証の参考値（提供資料から転記）／公開不可</p>
            <UnifiedMoveCard move={move}/>
            <details><summary>未検証の元データ（webId {row.sourceWebId}）</summary>
              <p>正式技ID：未照合／Patch：未照合／媒体：未接続</p>
              <dl>
                {Object.entries(row.sourceFrames).map(([k,value]) => <div key={k}><dt>{k}</dt><dd>{value === null ? "原文空欄" : String(value)}</dd></div>)}
              </dl>
            </details>
          </div>)}
        </div>
      </section> : null;
    })}
  </main>;
}
