import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) throw Error('Usage: node scripts/audit-combo-inputs.mjs <read-only snapshot JSON> <report JSON>');
const source = readFileSync(new URL('../src/lib/combo-input-tokens.ts', import.meta.url), 'utf8');
const tokenizerModule = { exports: {} };
new Function('module', 'exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText)(tokenizerModule, tokenizerModule.exports);
const { tokenizeComboRecipe } = tokenizerModule.exports;
const snapshot = JSON.parse(readFileSync(resolve(inputPath), 'utf8'));
const rows = snapshot.combos;
if (!Array.isArray(rows)) throw Error('Expected snapshot.combos array');
const eligible = rows.filter(row => row.status === 'published' && row.verification_status === 'verified');
const featureSource = readFileSync(new URL('../src/lib/release-features.ts', import.meta.url), 'utf8');
const featureEnabled = /publicStrategyContent:\s*true/.test(featureSource);
function analyze(combos) {
  const counts = { TOTAL_COMBOS: combos.length, TOTAL_TOKENS: 0, KNOWN_TOKENS: 0, UNKNOWN_TOKENS: 0, AMBIGUOUS_TOKENS: 0, RAW_RECIPE_MISMATCHES: 0, MISSING_RECIPES: 0 };
  const unknown = new Map();
  const types = {};
  for (const combo of combos) {
    if (typeof combo.notation !== 'string' || !combo.notation) { counts.MISSING_RECIPES++; continue; }
    const tokens = tokenizeComboRecipe(combo.notation);
    if (tokens.map(token => token.raw).join('') !== combo.notation) counts.RAW_RECIPE_MISMATCHES++;
    for (const token of tokens) {
      counts.TOTAL_TOKENS++;
      types[token.type] = (types[token.type] ?? 0) + 1;
      if (token.type === 'AMBIGUOUS') counts.AMBIGUOUS_TOKENS++;
      else if (token.type === 'TEXT') counts.UNKNOWN_TOKENS++;
      else counts.KNOWN_TOKENS++;
      // Pure punctuation/whitespace are expected recipe separators, not actionable unknown input.
      if (['TEXT', 'AMBIGUOUS'].includes(token.type) && /[\p{L}\p{N}]/u.test(token.raw)) {
        const key = token.type + ':' + token.raw;
        if (!unknown.has(key)) unknown.set(key, { TOKEN: token.raw, COUNT: 0, EXAMPLE_RECIPE: combo.notation, CHARACTER: combo.character, COMBO_ID: combo.id, PARSER_RESULT: token.type, RECOMMENDED_ACTION: token.type === 'AMBIGUOUS' ? 'AMBIGUOUS' : 'TEXT_FALLBACK' });
        unknown.get(key).COUNT++;
      }
    }
  }
  return { ...counts, TYPES: types, UNKNOWN_REPORT: [...unknown.values()].sort((a,b) => b.COUNT-a.COUNT || a.TOKEN.localeCompare(b.TOKEN)) };
}
const report = {
  fetched_at: snapshot.fetched_at,
  criteria: "combos.status = 'published' AND verification_status = 'verified'; existing character section eligibility; feature remains unchanged",
  publicStrategyContent: featureEnabled,
  TOTAL_PUBLIC_COMBOS: eligible.length,
  TOTAL_RENDERED_PUBLIC_COMBOS: featureEnabled ? eligible.length : 0,
  PUBLIC_ELIGIBLE: analyze(eligible),
  INTERNAL_CORPUS: { ...analyze(rows), scope: 'All fresh rows including draft and archived; parser/display audit only, no publication or gameplay approval', STATUSES: rows.reduce((result,row) => ({ ...result, [row.status]: (result[row.status] ?? 0) + 1 }), {}), VERIFICATION_STATUSES: rows.reduce((result,row) => ({ ...result, [row.verification_status]: (result[row.verification_status] ?? 0) + 1 }), {}) },
  interpretation: 'TEXT counts include preserved punctuation, separators and non-input prose. Actionable unknown report excludes separator-only tokens. No ambiguous input is converted or published.',
};
writeFileSync(resolve(outputPath), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ TOTAL_PUBLIC_COMBOS:report.TOTAL_PUBLIC_COMBOS, TOTAL_RENDERED_PUBLIC_COMBOS:report.TOTAL_RENDERED_PUBLIC_COMBOS, INTERNAL_CORPUS: Object.fromEntries(Object.entries(report.INTERNAL_CORPUS).filter(([key]) => !['UNKNOWN_REPORT'].includes(key))), ACTIONABLE_UNKNOWN_DISTINCT: report.INTERNAL_CORPUS.UNKNOWN_REPORT.length }));
