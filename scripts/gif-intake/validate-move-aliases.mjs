// 複数キャラクター用の別名対応表(move-aliases-batch2.ts など MoveAlias 形式)の静的検証。読み取り専用。
// JP22本の検証(validate-jp-aliases.mjs)は変更せず、同じ考え方(区分+名称の一意性・強度の維持・重複禁止)を一般化する。

const TAG_TO_STRENGTH = { OD: "od", 弱: "light", 中: "medium", 強: "heavy", SA1: "sa1", SA2: "sa2", SA3: "sa3" };

/** 技名 → 区分タグ集合と基本名。括弧の注記・英語名は除くが、弱/中/強/OD/SA は残す。 */
export function parseName(name) {
  const tags = new Set([...name.matchAll(/（(SA[123]|CA)）/g)].map((m) => m[1]));
  const rest = name.replace(/（(SA[123]|CA)）/g, "").replace(/（メダルLvに応じて動作が変化）/g, "").replace(/\s*\/\s*[A-Za-z].*$/, "");
  const toks = rest.replace(/　/g, " ").split(/\s+/).filter(Boolean);
  while (toks.length && ["OD", "弱", "中", "強", "CA", "SA1", "SA2", "SA3"].includes(toks[0])) tags.add(toks.shift());
  return { tags, base: toks.join("") };
}

const classicOf = (m) => m.commands.find((c) => c.scheme === "classic")?.commandText ?? "";
const keyOf = (n) => { const p = parseName(n); return `${[...p.tags].sort().join("+")}|${p.base}`; };

/**
 * @param aliases MoveAlias[]  @param fixture 公開用データ全体 @param mp4Ids 任意: 既存MP4を持つ技IDの集合
 * 戻り値: [{sourceFile, status, ok, errors[]}]
 */
export function validateMoveAliases({ aliases, fixture, mp4Ids = null }) {
  const chars = fixture.characters;
  const results = [];
  const seenFile = new Map(), seenMove = new Map(), seenSha = new Map();
  for (const a of aliases) {
    const errors = [];
    const own = chars[a.character];
    if (!own) errors.push("UNKNOWN_CHARACTER");
    const owner = Object.entries(chars).find(([, v]) => v.moves.some((m) => m.id === a.moveId))?.[0];
    if (owner && owner !== a.character) errors.push(`OTHER_CHARACTER_MOVE_ID(${owner})`); // 他キャラの技IDは不可
    const m = own?.moves.find((x) => x.id === a.moveId);
    if (!m) errors.push("MOVE_ID_NOT_FOUND");
    else {
      if (m.slug !== a.moveSlug) errors.push("SLUG_MISMATCH");
      if (m.name !== a.fixtureName) errors.push("NAME_MISMATCH");
      const p = parseName(m.name);
      // 強度/OD/SA の区分は技名のタグから決まる。取り違えを検出する
      const expected = ["OD", "SA1", "SA2", "SA3", "弱", "中", "強"].filter((t) => p.tags.has(t)).map((t) => TAG_TO_STRENGTH[t]);
      if (expected.length ? !expected.includes(a.strength) : a.strength !== "none") errors.push(`STRENGTH_FIELD_MISMATCH(expected ${expected.join("/") || "none"})`);
      if (a.status === "MATCHED_STATIC") {
        // 区分+名称が公開用データで一意でなければ曖昧一致
        if (own.moves.filter((x) => keyOf(x.name) === keyOf(m.name)).length !== 1) errors.push("AMBIGUOUS_NAME_MATCH");
        const o = parseName(a.officialName);
        const tagsEqual = [...o.tags].sort().join() === [...p.tags].sort().join();
        if (!tagsEqual) errors.push("TAG_MISMATCH_OFFICIAL_VS_FIXTURE"); // 強度/OD/SAの違うものを同一技にしない
        if (o.base !== p.base && !a.evidence.some((e) => e.includes("ファイル名ローマ字"))) errors.push("NAME_NOT_EQUAL_WITHOUT_EXTRA_EVIDENCE");
      }
      if (a.status === "NEEDS_VISUAL_QA") {
        // 候補と同じClassicコマンドを持つ別技があれば、コマンド一致だけでは一意と言えない
        const c = classicOf(m);
        if (c && own.moves.some((x) => x.id !== m.id && classicOf(x) === c)) errors.push("AMBIGUOUS_COMMAND_MATCH");
        if (!a.mismatches.length && !a.visualQaNotes.length) errors.push("MISSING_REASON");
      }
      if (a.status === "HOLD" && !a.holdReasons.length) errors.push("MISSING_HOLD_REASON");
    }
    if (mp4Ids && Boolean(a.existingMp4) !== mp4Ids.has(a.moveId)) errors.push("EXISTING_MP4_FLAG_MISMATCH");
    if (seenFile.has(a.sourceFile)) errors.push("DUPLICATE_SOURCE_FILE");
    if (seenMove.has(a.moveId)) errors.push(`DUPLICATE_MOVE_ID with ${seenMove.get(a.moveId)}`);
    if (seenSha.has(a.sha256)) errors.push(`DUPLICATE_CONTENT with ${seenSha.get(a.sha256)}`);
    seenFile.set(a.sourceFile, a.sourceFile); seenMove.set(a.moveId, a.sourceFile); seenSha.set(a.sha256, a.sourceFile);
    if (a.status === "APPROVED") errors.push("AUTO_APPROVED_NOT_ALLOWED");
    results.push({ sourceFile: a.sourceFile, status: a.status, ok: errors.length === 0, errors });
  }
  return results;
}
