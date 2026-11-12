/** Presentation only: research source records are unchanged and unpublished. */
export type ArjunPreviewCardInput = {
  category: string;
  card_title: string;
  command_text: string;
  conditions: string;
  details: string;
};
export function formatArjunPreviewCard(row: ArjunPreviewCardInput) {
  const isCombo = row.category === "combo";
  const isCounter = row.category === "counter";
  const title = isCounter
    ? `【${row.card_title.replace(/^対アルジュン[・：:]\s*/u, "")}】`
    : row.card_title;
  // Extract a damage figure only when the original description explicitly starts with
  // a numeric value or labels it as an estimate. Never treat arbitrary frame numbers as damage.
  const numeric = isCombo ? row.details.match(/^\s*(?:(掲載目安)\s*)?(\d{3,5})[。．\s]/u) : null;
  const damage = numeric ? numeric[2] : null;
  const damageApproximate = !!numeric?.[1];
  const remainder = numeric ? row.details.slice(numeric[0].length).trim() : row.details.trim();
  const counterTarget = isCounter ? row.command_text.match(/(?:弱|中|強|OD)\s*大義の巨腕/u)?.[0] ?? null : null;
  const counterCondition = isCounter ? row.conditions.replace(/^相手が/u, "") : null;
  const counterAction = isCounter ? row.command_text : null;
  const situation = isCombo && /^カウンター\+7F→立ち中K発生7F$/u.test(remainder)
    ? "しゃがみ弱Pがカウンターヒットした後、立ち中Kにつなぐ狙いです。資料では有利+7F・立ち中Kの発生7Fと記載されています（実機未検証）。"
    : remainder;
  return { title, damage, damageApproximate, situation, counterTarget, counterCondition, counterAction };
}
