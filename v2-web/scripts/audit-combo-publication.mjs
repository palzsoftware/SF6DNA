import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import ts from 'typescript';
import { classifyCombo, duplicateCandidateMap, comboPublicationClasses } from './lib/combo-publication-readiness.mjs';

const [snapshotPath, outputDir] = process.argv.slice(2);
if (!snapshotPath || !outputDir) throw Error('Usage: node scripts/audit-combo-publication.mjs <complete read-only snapshot JSON> <report directory>');
const snapshot = JSON.parse(readFileSync(resolve(snapshotPath),'utf8'));
const rows = snapshot.combos;
if (!Array.isArray(rows)) throw Error('combos array missing');
const source = readFileSync(new URL('../src/lib/combo-input-tokens.ts',import.meta.url),'utf8');
const tokenizerModule = { exports:{} };
new Function('module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(tokenizerModule,tokenizerModule.exports);
const characters = new Map((snapshot.characters ?? []).map(row=>[row.id,row]));
const patches = new Map((snapshot.patches ?? []).map(row=>[row.id,row]));
const sources = new Map((snapshot.sources ?? []).map(row=>[row.id,row]));
const sourcesByCombo = new Map();
for (const relation of snapshot.entity_sources ?? snapshot.combo_sources ?? []) {
  if (relation.entity_type && relation.entity_type !== 'combo') continue;
  const id = relation.entity_id ?? relation.combo_id;
  if (!sourcesByCombo.has(id)) sourcesByCombo.set(id,[]);
  sourcesByCombo.get(id).push({...relation,source:relation.source ?? sources.get(relation.source_id)});
}
const stepsByCombo = new Map();
for (const step of snapshot.combo_steps ?? []) {
  if (!stepsByCombo.has(step.combo_id)) stepsByCombo.set(step.combo_id,[]);
  stepsByCombo.get(step.combo_id).push(step);
}
const context = { characters, patches, sourcesByCombo, stepsByCombo, ids:new Set(rows.map(row=>row.id)), duplicateCandidates:duplicateCandidateMap(rows), tokenize:tokenizerModule.exports.tokenizeComboRecipe };
const classified = rows.map(row=>classifyCombo(row,context));
const counts = Object.fromEntries(comboPublicationClasses.map(key=>[key,classified.filter(row=>row.classification===key).length]));
const reasonCounts = {};
for (const row of classified) for (const reason of [row.primary_reason,...row.secondary_reasons]) reasonCounts[reason.code]=(reasonCounts[reason.code]??0)+1;
const cohort = classified.filter(row=>row.classification==='PUBLISHABLE');
const sourceVerifiedReview = classified.filter(row=>row.verification_status==='verified' && row.checks.ready_source_count>0 && row.checks.parser_ready && !row.evidence.notes_conflict && row.evidence.patch_current===true && row.evidence.valid_to_patch_id==null && !['HOLD','DATA_ERROR','DUPLICATE'].includes(row.classification));
const summary = {
  fetched_at:snapshot.fetched_at,
  classification_kind:'OFFLINE_READINESS_ONLY_NO_PUBLICATION',
  source_status:'READ_ONLY_NOT_APPLIED',
  TOTAL:rows.length,
  CURRENT_PUBLISHED:rows.filter(row=>row.status==='published').length,
  ...counts,
  FIRST_SAFE_COHORT:cohort.map(row=>({id:row.id,slug:row.slug,character:row.character})),
  VERIFIED_SOURCE_PARSER_REVIEW_COHORT:sourceVerifiedReview.map(row=>({id:row.id,slug:row.slug,character:row.character,classification:row.classification,remaining:row.secondary_reasons.concat(row.primary_reason).filter(reason=>reason.category==='GAME_VERIFICATION_REQUIRED').map(reason=>reason.code)})),
  RAW_MISMATCH:classified.filter(row=>!row.checks.parser_ready).length,
  DUPLICATE_CANDIDATE_ROWS:classified.filter(row=>row.duplicate_candidates.length).length,
  CONFIRMED_DUPLICATES:counts.DUPLICATE,
  REASON_COUNTS:reasonCounts,
  source_snapshot:{characters:characters.size,patches:patches.size,sources:sources.size,combo_source_relations:[...sourcesByCombo.values()].reduce((sum,rows)=>sum+rows.length,0)},
  primary_precedence:['DATA_ERROR','DUPLICATE','HOLD','SOURCE_REQUIRED','GAME_VERIFICATION_REQUIRED','PUBLISHABLE'],
  caveats:['Primary categories are disjoint; secondary blocker counts overlap.','verified alone, frame verification, source relations and lossless renderer PASS do not prove current gameplay reproduction.','No status, DB, feature flag, source adoption or publication change.','Structured positive reproduction evidence is required for automatic safe cohort; notes conflicts always block.','NULL optional numerics are unknown, not fabricated or treated as zero.','Duplicate candidates are not confirmed duplicates.'],
};
mkdirSync(resolve(outputDir),{recursive:true});
const reasonRegistry = {};
const noteRegistry = {};
const noteIds = new Map();
const usedSources = new Set();
const compactRows = classified.map(row=>{
  for (const reason of [row.primary_reason,...row.secondary_reasons]) if (!reasonRegistry[reason.code]) reasonRegistry[reason.code] = {category:reason.category,detail:reason.detail};
  const note = row.evidence.notes_excerpt;
  if (note && !noteIds.has(note)) { const id='note_'+(noteIds.size+1); noteIds.set(note,id); noteRegistry[id]=note; }
  for (const relation of row.evidence.sources) if (relation.source_id) usedSources.add(relation.source_id);
  const evidence={...row.evidence}; delete evidence.notes_excerpt;
  return {...row,primary_reason:row.primary_reason.code,secondary_reasons:row.secondary_reasons.map(reason=>reason.code),evidence:{...evidence,note_evidence:noteIds.get(note)??null}};
});
const sourceRegistry = Object.fromEntries([...usedSources].map(id=>{const source=sources.get(id);return [id,source ? {title:source.title,url:source.url,publisher:source.publisher,source_type:source.source_type,reliability:source.reliability_level ?? source.reliability} : {snapshot_missing:true}];}));
const rowColumns=['id','slug','character','status','verification_status','classification','primary_reason','secondary_reasons','checks','evidence','duplicate_candidates'];
const checkColumns=['parser_ready','source_count','ready_source_count','explicit_game_evidence','ambiguous_tokens','unknown_tokens'];
const factColumns=['notation','damage','drive_cost','sa_cost','position','conditions','starter','valid_from_patch_id','valid_to_patch_id','patch_current','notes_conflict','step_count','sources','note_evidence'];
const sourceRelationColumns=['source_id','relationship','metadata_ready'];
const tableRows=compactRows.map(row=>rowColumns.map(key=> key==='checks' ? checkColumns.map(column=>row.checks[column]) : key==='evidence' ? factColumns.map(column=>column==='sources' ? row.evidence.sources.map(relation=>sourceRelationColumns.map(field=>relation[field])) : row.evidence[column]) : row[key]));
writeFileSync(join(outputDir,'COMBO_PUBLICATION_CLASSIFICATION.json'),JSON.stringify({summary,row_columns:rowColumns,check_columns:checkColumns,fact_columns:factColumns,source_relation_columns:sourceRelationColumns,reason_evidence:reasonRegistry,note_evidence:noteRegistry,source_evidence:sourceRegistry,rows:tableRows})+'\n');
const quote = value => '"'+String(value??'').replaceAll('"','""')+'"';
const fields=['id','slug','character','status','verification_status','classification'];
writeFileSync(join(outputDir,'COMBO_PUBLICATION_CLASSIFICATION.csv'),[fields.concat(['primary_reason','secondary_reasons','duplicate_candidate_count']).map(quote).join(','),...classified.map(row=>[...fields.map(key=>row[key]),row.primary_reason.code,row.secondary_reasons.map(reason=>reason.code).join('|'),row.duplicate_candidates.length].map(quote).join(','))].join('\n')+'\n');
writeFileSync(join(outputDir,'COMBO_PUBLICATION_SUMMARY.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary));
