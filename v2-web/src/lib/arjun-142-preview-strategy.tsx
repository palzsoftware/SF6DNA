import { arjunPreviewQaEnabled } from "@/lib/arjun-preview-qa-auth";
import research from "@/data/arjun-142-local-research.json";
import type { StrategyCardView } from "@/components/strategy-card-explorer";

const kinds = { combo: "combo", setplay: "setplay", pressure: "sequence", counter: "counter" } as const;
const labels = { combo: "コンボ", setplay: "セットプレイ", pressure: "連携", counter: "対策" } as const;
const sourceLink = (value: string | null | undefined): string | null => {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : null; } catch { return null; }
};
/** Only used under authenticated Arjun Preview QA page. Never import into public characters route. */
export function getArjun142PreviewStrategyCards(): StrategyCardView[] {
  if (!arjunPreviewQaEnabled()) return [];
  if (research.count !== 142 || research.status !== "RESEARCH_ONLY_NOT_PUBLIC" || research.records.length !== 142) {
    throw new Error("Arjun research guard: 142 records expected");
  }
  const seen = new Set<string>();
  return research.records.map(row => {
    if (seen.has(row.id) || row.publication_status !== "not_imported" || row.in_game_verified !== false ||
        row.media_url !== null || !(row.category in kinds)) throw new Error(`Unsafe Arjun strategy: ${row.id}`);
    seen.add(row.id);
    const kind = kinds[row.category as keyof typeof kinds];
    const source = sourceLink(row.source_url);
    return {
      id: row.id, kind, title: row.card_title, category: row.record_kind,
      categoryLabel: row.record_kind === "source_reported" ? "資料由来・未検証" : "派生研究候補・未検証",
      searchTerms: [row.card_title, row.command_text, row.conditions].filter(Boolean) as string[],
      content: <article data-arjun-research-id={row.id} data-publication="NOT_IMPORTED" style={{padding: 12, border: "1px solid var(--border, #444)", borderRadius: 8, height: "100%"}}>
        <p style={{fontSize: 12, color: "var(--text-muted, #aaa)"}}>研究候補・実機未検証・非公開</p>
        <h3 style={{fontSize: "1rem", margin: "8px 0"}}>{row.card_title}</h3>
        {row.command_text ? <p><strong>入力・手順：</strong>{row.command_text}</p> : <p>手順：未確認</p>}
        {row.conditions ? <p><strong>成立条件：</strong>{row.conditions}</p> : null}
        {row.details ? <p><strong>説明：</strong>{row.details}</p> : null}
        {row.frame_note ? <p><strong>フレーム注記：</strong>{row.frame_note}</p> : null}
        <p style={{fontSize: 12}}>Classic資料に基づく候補。Modern・現行Patch・成立条件は未検証。</p>
        {source ? <p><a href={source} target="_blank" rel="noopener noreferrer">参照元（未検証）</a></p> : <p>参照元：確認中</p>}
      </article>,
    } satisfies StrategyCardView;
  });
}
