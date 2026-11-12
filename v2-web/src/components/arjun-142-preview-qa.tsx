import { arjunPreviewQaEnabled } from "@/lib/arjun-preview-qa-auth";
import { StrategyCardExplorer, type StrategyCardView } from "@/components/strategy-card-explorer";
import { getArjun142PreviewStrategyCards } from "@/lib/arjun-142-preview-strategy";

const kinds = [
  ["combo", "コンボ"], ["setplay", "セットプレイ"],
  ["sequence", "連携"], ["counter", "対策"],
] as const;
export function Arjun142PreviewQa() {
  if (!arjunPreviewQaEnabled()) return null;
  const cards = getArjun142PreviewStrategyCards();
  return <section aria-label="アルジュン攻略研究142件" data-arjun-strategy-cards={cards.length}>
    <h2>攻略研究カード142件（認証付きPreview限定・非公開）</h2>
    <p>コンボ27・セットプレイ46・連携26・対策43。出典照合・実機成立・現行Patchは未承認です。</p>
    {kinds.map(([kind, label]) => <section key={kind} aria-label={label} style={{marginBlock: 28}}>
      <h3>{label}（{cards.filter(c => c.kind === kind).length}件）</h3>
      <StrategyCardExplorer kind={kind as StrategyCardView["kind"]} items={cards} />
    </section>)}
  </section>;
}
