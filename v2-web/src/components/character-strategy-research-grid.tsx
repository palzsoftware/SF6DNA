import { StrategyCardScroll } from "./strategy-card-scroll";
import { StrategyCard } from "./strategy-card";
import { ComboInputRecipe } from "./combo-input-recipe";
import { strategyResearchDisplay } from "@/lib/strategy-research-display";
import { listStrategyResearchCards, safeStrategyResearchSource, type StrategySlotKind } from "@/lib/strategy-research-contract";

/**
 * Review-only (Dev/Preview) research cards rendered through the shared StrategyCard.
 * Research IDs are not DB IDs: no favorite/training records or detail routes are created.
 * All numbers are source-reported reference values ("参考") or "未確認"; nothing is marked verified.
 */
export function CharacterStrategyResearchGrid({ characterSlug, kind }: { characterSlug: string; kind: StrategySlotKind }) {
  const cards = listStrategyResearchCards(characterSlug, kind);
  if (!cards.length) return null;
  return <div data-strategy-research-reference="true">
    <p>参考攻略（実機未検証）。数値は参考資料の記載値です。現行バージョンの成立や操作方式は確認中です。</p>
    <StrategyCardScroll label={cards[0].categoryLabel} count={cards.length}>
      {cards.map(card => {
        const display = strategyResearchDisplay(card);
        const sourceUrl = safeStrategyResearchSource(card.sourceUrl);
        return <div key={card.id} data-reference-card-id={card.id}>
          <StrategyCard
            kind={kind}
            title={display.title}
            category={card.categoryLabel}
            control={display.controlLabel}
            media={null}
            facts={display.metrics.map(metric => [metric.label, metric.value] as const)}
            commandIcons={display.iconInput ? <ComboInputRecipe recipe={display.iconInput} iconPilot={false} /> : null}
            commandJa={display.commandJapanese || null}
            body={display.description ? `${display.referenceNotice}。${display.description}` : null}
            details={[
              ["成立条件", display.condition || "未確認"],
              ["位置", card.position || "未確認"],
              ["手順の扱い", display.commandRole],
              ["対応バージョン", `参考資料: ${card.referenceVersion}`],
              ["検証状態", "参考値・実機未検証"],
              ...(card.caution ? [["注意", card.caution] as const] : []),
              ["情報源", sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer">参考資料（本文未照合の場合あり）</a> : "未確認"],
            ]}
          />
        </div>;
      })}
    </StrategyCardScroll>
  </div>;
}
