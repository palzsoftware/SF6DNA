import { arjunPreviewQaEnabled } from "@/lib/arjun-preview-qa-auth";
import { formatArjunPreviewCard } from "@/lib/arjun-preview-card-format";
import research from "@/data/arjun-142-local-research.json";
import type { StrategyCardView } from "@/components/strategy-card-explorer";
import styles from "@/components/arjun-research-card.module.css";

const kinds = { combo: "combo", setplay: "setplay", pressure: "sequence", counter: "counter" } as const;
const sourceLink = (value: string | null | undefined): string | null => {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : null; } catch { return null; }
};
/** Only under authenticated Preview QA. Public character routes must not import this. */
export function getArjun142PreviewStrategyCards(): StrategyCardView[] {
  if (!arjunPreviewQaEnabled()) return [];
  if (research.count !== 142 || research.status !== "RESEARCH_ONLY_NOT_PUBLIC" || research.records.length !== 142)
    throw new Error("Arjun research guard: 142 records expected");
  const seen = new Set<string>();
  return research.records.map(row => {
    if (seen.has(row.id) || row.publication_status !== "not_imported" || row.in_game_verified !== false ||
        row.media_url !== null || !(row.category in kinds)) throw new Error(`Unsafe Arjun strategy: ${row.id}`);
    seen.add(row.id);
    const kind = kinds[row.category as keyof typeof kinds];
    const source = sourceLink(row.source_url);
    const info = formatArjunPreviewCard(row);
    return {
      id: row.id, kind, title: info.title, category: row.record_kind,
      categoryLabel: row.record_kind === "source_reported" ? "資料由来・未検証" : "派生研究候補・未検証",
      searchTerms: [row.card_title, row.command_text, row.conditions, row.details].filter(Boolean) as string[],
      content: <article data-arjun-research-id={row.id} data-publication="NOT_IMPORTED" className={styles.card}>
        <p className={styles.status}>研究候補・実機未検証・非公開</p>
        <h3 className={styles.title}>{info.title}</h3>
        {kind === "counter" ? <>
          <dl className={styles.fields}>
            <div><dt>対策する技</dt><dd>{info.counterTarget ?? info.counterCondition ?? "対象技は要確認"}</dd></div>
            <div><dt>対策</dt><dd>{info.counterAction || "対策手順は未確認"}</dd></div>
            {row.conditions ? <div><dt>条件</dt><dd>{row.conditions}</dd></div> : null}
          </dl>
          {row.details ? <p className={styles.explanation}>{row.details}</p> : null}
        </> : <>
          <dl className={styles.fields}>
            <div><dt>{kind === "combo" ? "コンボ手順" : "入力・手順"}</dt><dd>{row.command_text || "手順：未確認"}</dd></div>
            {info.damage ? <div><dt>ダメージ（資料記載の目安・未検証）</dt><dd>{info.damage}{info.damageApproximate ? "（概算）" : ""}</dd></div> : null}
            {row.conditions ? <div><dt>成立条件</dt><dd>{row.conditions}</dd></div> : null}
            {info.situation ? <div><dt>{kind === "combo" ? "状況・ポイント" : "ポイント"}</dt><dd>{info.situation}</dd></div> : null}
          </dl>
        </>}
        {row.frame_note ? <p className={styles.explanation}>フレーム注記（未検証）：{row.frame_note}</p> : null}
        <p className={styles.caution}>Classic資料に基づく候補。Modern・現行Patch・成立条件は未検証です。</p>
        <div className={styles.source}>{source ? <a href={source} target="_blank" rel="noopener noreferrer">情報源を確認（内容未検証）</a> : <span>情報源：確認中</span>}</div>
      </article>,
    } satisfies StrategyCardView;
  });
}
