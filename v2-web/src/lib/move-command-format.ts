const directions: Record<string, string> = { "1": "↙", "2": "↓", "3": "↘", "4": "←", "5": "", "6": "→", "7": "↖", "8": "↑", "9": "↗" };
const buttons: Record<string, string> = { LP: "弱P", MP: "中P", HP: "強P", LK: "弱K", MK: "中K", HK: "強K", P: "P", K: "K", PP: "パンチ2ボタン同時押し", KK: "キック2ボタン同時押し" };

/** Only complete compact input atoms are converted. Existing Japanese/arrows and unknown grammar stay intact. */
export function formatMoveCommand(value: string): string {
  const parts = value.trim().split(/(~|＞|>)/);
  const formatted: string[] = [];
  for (const part of parts) {
    if (part === "~" || part === "＞" || part === ">") { formatted.push(" ＞ "); continue; }
    const atom = part.trim();
    const match = /^(j\.)?([1-9]*)(LP|MP|HP|LK|MK|HK|PP|KK|P|K)((?:\+(?:LP|MP|HP|LK|MK|HK|PP|KK|P|K))*)$/i.exec(atom);
    if (!match) return value;
    const [, jump, numbers, button, simultaneous] = match;
    const direction = [...numbers].map(number => directions[number]).join("");
    const prefix = jump ? "ジャンプ中" : direction;
    formatted.push(`${prefix ? `${prefix} + ` : ""}${[button, ...simultaneous.split("+").filter(Boolean)].map(key => buttons[key.toUpperCase()]).join(" + ")}`);
  }
  return formatted.join("");
}

export function moveCommandSearchTerms(value: string): string[] {
  return [...new Set([value, formatMoveCommand(value)])];
}
