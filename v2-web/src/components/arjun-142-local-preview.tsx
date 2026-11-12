import { StrategyCardExplorer, type StrategyCardView } from "@/components/strategy-card-explorer";
import { getArjun142LocalStrategyCards } from "@/lib/arjun-142-local-strategy";

const kinds = [
  ["combo", "コンボ"], ["setplay", "セットプレイ"],
  ["sequence", "連携"], ["counter", "対策"],
] as const;
export function Arjun142LocalPreview() {
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL_ENV ||
      process.env.SF6DNA_ARJUN_LOCAL_PREVIEW !== "1") return null;
  const cards = getArjun142LocalStrategyCards();
  return <section aria-label="アルジュン攻略研究142件" data-arjun-strategy-cards={cards.length}>
    <h2>攻略研究カード142件（ローカル限定・非公開）</h2>
    <p>コンボ27・セットプレイ46・連携26・対策43。出典照合・実機成立・現行Patchは未承認です。</p>
    {kinds.map(([kind, label]) => <section key={kind} aria-label={label} style={{marginBlock: 28}}>
      <h3>{label}（{cards.filter(c => c.kind === kind).length}件）</h3>
      <StrategyCardExplorer kind={kind as StrategyCardView["kind"]} items={cards} />
    </section>)}
  </section>;
}
