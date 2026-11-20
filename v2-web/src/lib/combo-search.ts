// コンボ検索の絞り込み・並び替え（純関数）。
// 方針: データに書かれている値だけで判定し、書かれていない値は "unknown"（記載なし）として扱う。
// 未確認の数値・成立条件を推測で補わない。既存の q / difficulty / resource の意味は変えない。

export type ComboSearchSource = {
  name?: string | null;
  purpose?: string | null;
  command?: string | null;
  starter?: string | null;
  startCondition?: string | null;
  position?: string | null;
  damage?: number | null;
  drive?: number | null;
  sa?: number | null;
  controlLabel?: string | null; // 攻略カードの操作タイプ欄（例: "クラシック（資料表記）"）
};

export type ComboPosition = "center" | "corner" | "unknown";
export type ComboHit = "pc" | "ch" | "unknown";
export type ComboControl = "classic" | "modern" | "unknown";

export type ComboSearchFacets = {
  starter: string | null; // 正規化した始動技（例: "2中K"）。読み取れなければ null
  position: ComboPosition;
  hit: ComboHit;
  control: ComboControl;
  drive: number | null;
  sa: number | null;
  damage: number | null;
};

export type ComboSearchParams = {
  starter: string; // "all" または正規化済み始動技
  position: "all" | ComboPosition;
  hit: "all" | "pc" | "ch" | "none"; // none = PC/CHの記載がないもの
  control: "all" | ComboControl;
  drive: "all" | "0" | "1" | "2" | "3+";
  sa: "all" | "0" | "1" | "2" | "3";
  sort: "default" | "damage-desc" | "damage-asc";
};

export const DEFAULT_COMBO_SEARCH: ComboSearchParams = {
  starter: "all", position: "all", hit: "all", control: "all", drive: "all", sa: "all", sort: "default",
};

function nfkc(value: string | null | undefined): string {
  return (value ?? "").normalize("NFKC").trim();
}

const POSTURE: Array<[RegExp, string]> = [
  [/^(?:立ち|立)/, "5"], [/^(?:しゃがみ|屈)/, "2"], [/^(?:ジャンプ|J|j)/, "J"],
];

/** 始動技の表記をそろえる（「屈中K」「しゃがみ中K」→「2中K」）。それ以外の表記はそのまま返す。 */
export function normalizeStarter(raw: string | null | undefined): string | null {
  let s = nfkc(raw).replace(/\s+/g, "");
  if (!s) return null;
  s = s.replace(/(?:PC|CH|パニカン|パニッシュカウンター|カウンター)$/u, "");
  for (const [pattern, digit] of POSTURE) {
    if (pattern.test(s)) {
      const rest = s.replace(pattern, "");
      if (/^[弱中強][PK]$/u.test(rest)) return `${digit}${rest}`;
    }
  }
  return s || null;
}

export function starterLabel(value: string): string {
  const posture = { "2": "しゃがみ", "5": "立ち", J: "ジャンプ" };
  const match = /^([25J])([弱中強][PK])$/u.exec(value);
  return match ? posture[match[1] as keyof typeof posture] + match[2] : value;
}

/** カードから始動技を読む: starter 欄 → なければコマンドの最初の手順。 */
export function readStarter(source: ComboSearchSource): string | null {
  const first = nfkc(source.starter) || nfkc(source.command).split(/\s*(?:→|>|＞|⇒|,)\s*/u)[0];
  return normalizeStarter(first);
}

export function readPosition(source: ComboSearchSource): ComboPosition {
  const pos = nfkc(source.position).toLowerCase();
  if (/corner|画面端|^端/.test(pos)) return "corner";
  if (/center|midscreen|中央/.test(pos)) return "center";
  const text = [source.startCondition, source.name, source.purpose].map(nfkc).join(" ");
  if (/画面端/.test(text)) return "corner";
  if (/画面中央/.test(text)) return "center";
  return "unknown";
}

export function readHit(source: ComboSearchSource): ComboHit {
  const text = [source.startCondition, source.command, source.name, source.starter].map(nfkc).join(" ");
  if (/(?<![A-Za-z])PC(?![A-Za-z])|パニッシュカウンター|パニカン/u.test(text)) return "pc";
  if (/(?<![A-Za-z])CH(?![A-Za-z])|カウンターヒット|(?<!パニッシュ)カウンター/u.test(text)) return "ch";
  return "unknown";
}

export function readControl(source: ComboSearchSource): ComboControl {
  const text = [source.controlLabel, source.name, source.purpose, source.startCondition, source.command].map(nfkc).join(" ");
  const classic = /クラシック|classic/i.test(text);
  const modern = /モダン|modern/i.test(text);
  if (classic && !modern) return "classic";
  if (modern && !classic) return "modern";
  return "unknown";
}

function finite(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function comboFacets(source: ComboSearchSource): ComboSearchFacets {
  return {
    starter: readStarter(source),
    position: readPosition(source),
    hit: readHit(source),
    control: readControl(source),
    drive: finite(source.drive),
    sa: finite(source.sa),
    damage: finite(source.damage),
  };
}

function one(value: string | string[] | undefined): string {
  return ((Array.isArray(value) ? value[0] : value) ?? "").trim();
}

function pick<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** URL パラメータを検証してそろえる。知らない値は "all"/"default" に戻す。 */
export function parseComboSearchParams(input: Record<string, string | string[] | undefined>): ComboSearchParams {
  const starter = normalizeStarter(one(input.starter).slice(0, 40));
  return {
    starter: starter && starter !== "all" ? starter : "all",
    position: pick(one(input.position), ["all", "center", "corner", "unknown"] as const, "all"),
    hit: pick(one(input.hit), ["all", "pc", "ch", "none"] as const, "all"),
    control: pick(one(input.control), ["all", "classic", "modern", "unknown"] as const, "all"),
    drive: pick(one(input.drive), ["all", "0", "1", "2", "3+"] as const, "all"),
    sa: pick(one(input.sa), ["all", "0", "1", "2", "3"] as const, "all"),
    sort: pick(one(input.sort), ["default", "damage-desc", "damage-asc"] as const, "default"),
  };
}

/** 絞り込み判定。数値が未記載（null）のカードは、その数値で絞り込んだときだけ除外する。 */
export function matchesComboSearch(f: ComboSearchFacets, p: ComboSearchParams): boolean {
  if (p.starter !== "all" && f.starter !== p.starter) return false;
  if (p.position !== "all" && f.position !== p.position) return false;
  if (p.hit === "none" && f.hit !== "unknown") return false;
  if ((p.hit === "pc" || p.hit === "ch") && f.hit !== p.hit) return false;
  if (p.control !== "all" && f.control !== p.control) return false;
  if (p.drive !== "all") {
    if (f.drive === null) return false;
    if (p.drive === "3+" ? f.drive < 3 : f.drive !== Number(p.drive)) return false;
  }
  if (p.sa !== "all" && (f.sa === null || f.sa !== Number(p.sa))) return false;
  return true;
}

/** 並び替え（安定ソート）。ダメージ未記載は常に末尾。default は元の順序のまま。 */
export function sortComboResults<T>(rows: readonly T[], facetsOf: (row: T) => ComboSearchFacets, sort: ComboSearchParams["sort"]): T[] {
  if (sort === "default") return [...rows];
  const dir = sort === "damage-desc" ? -1 : 1;
  return rows
    .map((row, index) => ({ row, index, damage: facetsOf(row).damage }))
    .sort((a, b) => {
      if (a.damage === null && b.damage === null) return a.index - b.index;
      if (a.damage === null) return 1;
      if (b.damage === null) return -1;
      return a.damage === b.damage ? a.index - b.index : (a.damage - b.damage) * dir;
    })
    .map(({ row }) => row);
}

/** 画面に出す始動技の候補（出現数の多い順、同数は表記順）。 */
export function starterOptions(facets: readonly ComboSearchFacets[], limit = 12): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>();
  for (const f of facets) if (f.starter) counts.set(f.starter, (counts.get(f.starter) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

/** 既定値と違うパラメータだけを URL に載せる。 */
export function comboSearchQuery(p: ComboSearchParams): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const key of Object.keys(DEFAULT_COMBO_SEARCH) as Array<keyof ComboSearchParams>) {
    if (p[key] !== DEFAULT_COMBO_SEARCH[key]) out.push([key, p[key]]);
  }
  return out;
}
