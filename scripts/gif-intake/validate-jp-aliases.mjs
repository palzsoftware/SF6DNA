// JP別名対応表(jp-move-aliases.ts)の静的検証。読み取り専用。
// 対応表の各行を、公開用データ(ALL_CHARACTER_RELEASE_FIXTURE)と突き合わせて、問題を理由つきで返す。
const TAG_BY_NAME = [["OD", "od"], ["弱", "light"], ["中", "medium"], ["強", "heavy"], ["SA1", "sa1"], ["SA2", "sa2"], ["SA3", "sa3"]];

/** 技名から 強度/OD/SA の区分集合と基本名を取り出す(括弧の英語名・(SA1)表記を除く)。 */
export function parseMoveName(name) {
  const tags = new Set([...name.matchAll(/（(SA[123]|CA)）/g)].map((m) => m[1]));
  let rest = name.replace(/（(SA[123]|CA)）/g, "").replace(/\s*\/\s*[A-Za-z].*$/, "");
  const toks = rest.replace(/　/g, " ").split(/\s+/).filter(Boolean);
  while (toks.length && ["OD", "弱", "中", "強", "CA", "SA1", "SA2", "SA3"].includes(toks[0])) tags.add(toks.shift());
  return { tags, base: toks.join("") };
}

export function validateJpAliases({ aliases, fixture }) {
  const jp = fixture.characters.jp.moves;
  const byId = new Map(jp.map((m) => [m.id, m]));
  const otherIds = new Set(Object.entries(fixture.characters).filter(([c]) => c !== "jp").flatMap(([, v]) => v.moves.map((m) => m.id)));
  const results = [];
  const seenFile = new Map(), seenMove = new Map(), seenSha = new Map();
  for (const a of aliases) {
    const errors = [];
    const m = byId.get(a.moveId);
    if (otherIds.has(a.moveId)) errors.push("NON_JP_MOVE_ID");
    if (!m) errors.push("MOVE_ID_NOT_FOUND_IN_JP");
    else {
      if (m.slug !== a.moveSlug) errors.push("SLUG_MISMATCH");
      if (m.name !== a.fixtureName) errors.push("NAME_MISMATCH");
      const p = parseMoveName(m.name);
      const sameKey = jp.filter((x) => { const q = parseMoveName(x.name); return q.base === p.base && [...q.tags].sort().join() === [...p.tags].sort().join(); });
      if (sameKey.length !== 1) errors.push("AMBIGUOUS_NAME_MATCH"); // 区分+名称が複数の技に当てはまる → 曖昧一致は許可しない
      const fileTags = new Set(a.sourceFile.replace(/^9_\d+-jp-/, "").replace(/\.gif$/, "").split("-"));
      const want = TAG_BY_NAME.filter(([, t]) => fileTags.has(t)).map(([, t]) => t).sort().join();
      const have = TAG_BY_NAME.filter(([n]) => p.tags.has(n)).map(([, t]) => t).sort().join();
      if (want !== have) errors.push(`TAG_MISMATCH file=${want} fixture=${have}`); // 強度・OD・SA区分の取り違え
      const own = a.strength === "none" ? "" : a.strength;
      const exp = TAG_BY_NAME.filter(([n]) => p.tags.has(n)).map(([, t]) => t);
      if (exp.length ? !exp.includes(a.strength) && !(a.strength === "od" && exp.includes("od")) : own !== "") errors.push("STRENGTH_FIELD_MISMATCH");
    }
    if (seenFile.has(a.sourceFile)) errors.push("DUPLICATE_SOURCE_FILE");
    if (seenMove.has(a.moveId)) errors.push(`DUPLICATE_MOVE_ID with ${seenMove.get(a.moveId)}`);
    if (seenSha.has(a.sha256)) errors.push(`DUPLICATE_CONTENT with ${seenSha.get(a.sha256)}`);
    seenFile.set(a.sourceFile, a.sourceFile); seenMove.set(a.moveId, a.sourceFile); seenSha.set(a.sha256, a.sourceFile);
    if (a.status === "APPROVED") errors.push("AUTO_APPROVED_NOT_ALLOWED");
    results.push({ sourceFile: a.sourceFile, status: a.status, ok: errors.length === 0, errors });
  }
  return results;
}
