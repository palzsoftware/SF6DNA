/** Describe already-rendered tokens only; never parse recipes or change control schemes. */
const names: Record<string, string> = {
  "↓": "下", "↘": "右下", "→": "右", "↗": "右上", "↑": "上", "↖": "左上", "←": "左", "↙": "左下",
  "弱P": "弱パンチ", "中P": "中パンチ", "強P": "強パンチ",
  "弱K": "弱キック", "中K": "中キック", "強K": "強キック",
  LP: "弱パンチ", MP: "中パンチ", HP: "強パンチ", LK: "弱キック", MK: "中キック", HK: "強キック",
  DI: "ドライブインパクト", DR: "ドライブラッシュ", ASSIST: "アシスト", SP: "必殺技ボタン",
  SA: "スーパーアーツ", SA1: "スーパーアーツ1", SA2: "スーパーアーツ2", SA3: "スーパーアーツ3",
  CA: "クリティカルアーツ", OD: "オーバードライブ",
};
export function commandAccessibleName(display: string): string {
  return display.replace(/[↓↘→↗↑↖←↙]|[弱中強][PK]|\b(?:LP|MP|HP|LK|MK|HK|DI|DR|ASSIST|SP|SA[123]?|CA|OD)\b|[+＋]/gi,
    token => token === "+" || token === "＋" ? "、プラス、" : `、${names[token.toUpperCase()] ?? token}、`)
    .replace(/[、\s]+/g, "、").replace(/^、|、$/g, "");
}
