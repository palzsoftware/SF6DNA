import type { Sf6CommandToken } from "./sf6-command-tokens";
export type ControlScheme = "classic" | "modern" | "unknown";
export type CommandIconPart = { type: "icon" | "text"; value: string; label: string; asset?: string };
export type CommandIconPresentation = { raw: string; kind: Sf6CommandToken["kind"]; parts: CommandIconPart[]; label: string; schemeMismatch: boolean };
const directionLabels: Record<string,string> = {"1":"左下","2":"下","3":"右下","4":"左","5":"ニュートラル","6":"右","7":"左上","8":"上","9":"右上"};
const arrows: Record<string,string> = {"1":"↙","2":"↓","3":"↘","4":"←","5":"N","6":"→","7":"↖","8":"↑","9":"↗"};
const alias: Record<string,string> = {"N":"5","↙":"1","↓":"2","↘":"3","←":"4","→":"6","↖":"7","↑":"8","↗":"9","弱P":"LP","中P":"MP","強P":"HP","弱K":"LK","中K":"MK","強K":"HK","弱":"L","中":"M","強":"H","弱攻撃":"L","中攻撃":"M","強攻撃":"H","A":"ASSIST","アシスト":"ASSIST","必殺技":"SP","LPLK":"THROW","LM":"THROW","投げ":"THROW","DRIVE_PARRY":"PARRY"};
const motionDirections: Record<string,string> = {
  "236":"236", "214":"214", "623":"623", "421":"421", "22":"22",
  "28":"28", "44":"44", "66":"66", "41236":"41236", "63214":"63214",
  "632146":"632146", "236236":"236236", "214214":"214214",
  "[4]":"4", "[4]646":"4646", "4236236":"4236236",
};
const heldMotions = new Set(["[4]", "[4]646"]);
const classics = new Set(["LP","MP","HP","LK","MK","HK","P","K","PP","KK"]);
const modern = new Set(["L","M","H","ASSIST","SP","AL","AM","AH","SPH"]);
const modernSequences: Record<string,string[]> = { AL:["ASSIST","L"], AM:["ASSIST","M"], AH:["ASSIST","H"], SPH:["SP","H"] };
const system = new Set(["ASSIST","SP","DI","DR","PARRY","THROW"]);
const systemAssets: Record<string,string> = {
  ASSIST: "control-assist",
  SP: "control-sp",
  DI: "control-di",
  DR: "control-dr",
  PARRY: "control-parry",
  THROW: "control-throw",
};
const modernAssets: Record<string,string> = { L:"strength-l", M:"strength-m", H:"strength-h", ASSIST:"control-assist", SP:"control-sp" };
const modernLabels: Record<string,string> = { L:"弱攻撃", M:"中攻撃", H:"強攻撃", ASSIST:"アシストボタン", SP:"必殺技ボタン" };
const classicStrengthParts: Record<string, { strength: string; strengthLabel: string; button: string; buttonLabel: string; label: string }> = {
  LP: { strength: "strength-l", strengthLabel: "弱", button: "button-p", buttonLabel: "P", label: "弱 P" },
  MP: { strength: "strength-m", strengthLabel: "中", button: "button-p", buttonLabel: "P", label: "中 P" },
  HP: { strength: "strength-h", strengthLabel: "強", button: "button-p", buttonLabel: "P", label: "強 P" },
  LK: { strength: "strength-l", strengthLabel: "弱", button: "button-k", buttonLabel: "K", label: "弱 K" },
  MK: { strength: "strength-m", strengthLabel: "中", button: "button-k", buttonLabel: "K", label: "中 K" },
  HK: { strength: "strength-h", strengthLabel: "強", button: "button-k", buttonLabel: "K", label: "強 K" },
};
// Consumes semantic tokens from the existing tokenizer. It never parses raw prose itself.
export function commandIconPresentation(token: Sf6CommandToken, scheme: ControlScheme = "unknown"): CommandIconPresentation {
  const canonical = alias[token.raw] ?? token.raw.toUpperCase();
  const mismatch = (scheme === "classic" && modern.has(canonical)) || (scheme === "modern" && classics.has(canonical));
  let parts: CommandIconPart[] = [{ type:"text",value:token.display,label:token.label }];
  if (token.kind === "motion" && motionDirections[canonical]) {
    parts = Array.from(motionDirections[canonical], n => ({type:"icon",value:arrows[n],label:directionLabels[n],asset:`direction-${n}`}));
    if (heldMotions.has(canonical)) parts.splice(1, 0, {type:"text",value:"溜め",label:"溜め"});
  } else if (token.kind === "direction" && directionLabels[canonical]) {
    parts = [{type:"icon",value:arrows[canonical],label:directionLabels[canonical],asset:`direction-${canonical}`}];
  } else if (!mismatch && modernSequences[canonical]) {
        const nextParts: CommandIconPart[] = [];
    const strengthLabels: Record<string, string> = { L:"弱", M:"中", H:"強" };
    for (const value of modernSequences[canonical]) {
      const strengthLabel = strengthLabels[value];
      if (strengthLabel) nextParts.push({ type:"text", value:strengthLabel, label:strengthLabel });
      else nextParts.push({ type:"icon", value, label:modernLabels[value], asset:modernAssets[value] });
    }
    parts = nextParts;
  } else if (!mismatch && token.kind === "button" && classicStrengthParts[canonical]) {
    const item = classicStrengthParts[canonical];
    parts = [
      { type:"text", value:item.strengthLabel, label:item.strengthLabel },
      { type:"icon", value:item.buttonLabel, label:item.buttonLabel === "P" ? "パンチ" : "キック", asset:item.button },
    ];
  } else if (!mismatch && token.kind === "button" && (canonical === "L" || canonical === "M" || canonical === "H")) {
    const strengthLabels: Record<string, string> = { L:"弱", M:"中", H:"強" };
    const strengthLabel = strengthLabels[canonical] ?? canonical;
    parts = [{ type:"text", value:strengthLabel, label:strengthLabel }];
  } else if (!mismatch && token.kind === "button" && (classics.has(canonical) || modern.has(canonical))) {
    parts = [{type:"icon",value:token.display,label:token.label,asset:`${modern.has(canonical) ? "strength" : "button"}-${canonical.toLowerCase()}`}];
  } else if (!mismatch && token.kind === "system" && canonical === "THROW") {
    parts = [{type:"icon",value:"投げ",label:"投げボタン",asset:systemAssets.THROW}];
} else if (!mismatch && token.kind === "system" && system.has(canonical)) {
    parts = [{type:"icon",value:token.display,label:token.label,asset:systemAssets[canonical]}];
  }
  return { raw:token.raw,kind:token.kind,parts,label:token.kind === "motion" && motionDirections[canonical] ? parts.map(p=>p.label).join("、") : canonical === "THROW" ? "投げボタン" : token.label,schemeMismatch:mismatch };
}
export function commandIconAccessibleName(tokens: Sf6CommandToken[]): string {
  const visible = tokens.filter(t=>!/^\s+$/.test(t.raw));
  const spoken: string[] = [];
  const spokenText = (value: string) => value.replace(/\bStock\b/gi,"ストック").trim();
  for (let index=0; index<visible.length; index++) {
    const token = visible[index];
    const held = visible[index+1];
    const suffix = visible[index+2];
    if (token.kind === "text" && token.raw.endsWith("[") && held?.kind === "button" && suffix?.kind === "text" && suffix.raw.startsWith("]")) {
      const prefix = spokenText(token.label.slice(0,-1));
      if (prefix) spoken.push(prefix);
      spoken.push(`${commandIconPresentation(held).label}を長押し`);
      const remainder = spokenText(suffix.label.slice(1));
      if (remainder) spoken.push(remainder);
      index += 2;
      continue;
    }
    if (token.kind === "separator") {
      spoken.push((token.raw === "+" || token.raw === "＋") ? "同時押し" : token.raw === "~" ? "続けて入力" : "次の入力");
      continue;
    }
    const label = spokenText(commandIconPresentation(token).label);
    if (label) spoken.push(label);
  }
  return spoken.join("、");
}
