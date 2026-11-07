/** Presentation-only matching. Callers MUST apply publication/authorization gates first. */
export const strategyKinds = ["combo", "setplay", "sequence", "counter"];
const fold = value => String(value ?? "").normalize("NFKC").toLowerCase().replace(/\s+/g, "");
const hasNumber = value => typeof value === "number" && Number.isFinite(value) && value >= 0;
export function searchStrategyCards(items, { query = "", category = "all" } = {}) {
  const q = fold(query);
  return items.filter(item => {
    if (category !== "all" && item.category !== category) return false;
    const terms = [item.title, item.categoryLabel, item.category, ...(item.searchTerms ?? [])];
    const combo = item.kind === "combo";
    // Unknown costs must never be treated as zero.
    const zero = combo && hasNumber(item.driveCost) && item.driveCost === 0 && hasNumber(item.saCost) && item.saCost === 0;
    const sa = combo && hasNumber(item.saCost) ? item.saCost : null;
    if (zero) terms.push("ゲージなし", "ノーゲージ");
    if (sa !== null && sa > 0) terms.push(`SA${sa}`, `SAゲージ${sa}`);
    if (combo && hasNumber(item.driveCost)) terms.push(`ドライブ${item.driveCost}`, `ドライブゲージ${item.driveCost}`);
    if (combo && hasNumber(item.saCost)) terms.push(`SA消費${item.saCost}`);
    if (!q) return true;
    if (combo && ["ゲージなし", "ノーゲージ"].includes(q)) return zero;
    if (combo && /^sa[123]$/.test(q)) return sa === Number(q.slice(2));
    return terms.some(term => fold(term).includes(q));
  });
}
export function strategyCategories(items) {
  const labels = new Map();
  for (const item of items) if (item.category) labels.set(item.category, item.categoryLabel || item.category);
  return [...labels].map(([value, label]) => ({ value, label }));
}
