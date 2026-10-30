import { Buffer } from 'node:buffer';
const token = value => Buffer.from(value,'utf8').toString('hex');
const safe = (value,max) => String(value).normalize('NFKC').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,max) || 'move';
/** v1 is immutable. Persist aliases instead of renaming a registered key on a future slug change.
 * The lossless source-key suffix disambiguates strength/OD/air/follow-up rows without guessing.
 * No UUID, frame, command, legacy URL or publication status is changed.
 */
export function createMoveMediaKey({characterSlug,moveSlug,sourceRecordKey}) {
  if(typeof characterSlug!=='string'||!characterSlug||typeof moveSlug!=='string'||!moveSlug||
     typeof sourceRecordKey!=='string'||!sourceRecordKey.startsWith(characterSlug+':')) throw new TypeError('Exact character/slug/source binding required');
  return `${safe(characterSlug,32)}__${safe(moveSlug,80)}__variant-${token(sourceRecordKey)}`;
}
export function createInputRouteMediaKey(mediaKey,command) {
  const identity=[command.scheme,command.conditionText??null,command.commandText??null,command.numericNotation??null,command.buttonNotation??null];
  return `${mediaKey}__route-${token(JSON.stringify(identity))}`;
}
/** Additive metadata only. Existing renderer may continue to select media by move.id. */
export function attachMoveMediaKeys(bundle,registry,characterSlug) {
  const byId=new Map(registry.filter(r=>r.characterSlug===characterSlug).map(r=>[r.currentMoveId,r]));
  const holds=[];
  const moves=(bundle?.moves??[]).map(move=>{
    const row=byId.get(move.id);
    if(!row||row.moveSlug!==move.slug){holds.push({moveId:move.id,reason:'MEDIA_KEY_BINDING_NOT_CONFIRMED'});return move;}
    return {...move,mediaKey:row.mediaKey};
  });
  return {bundle:bundle?{...bundle,moves}:null,holds,publicationGrant:false};
}
/** Reuse a persisted key after a later slug/ID adoption; that adoption needs its own review.
 * Source identity is immutable here. Conflicting stored keys are never chosen silently.
 */
export function resolveStableMoveMediaKey(binding,previousRegistry=[]) {
  const matches=previousRegistry.filter(r=>r.characterSlug===binding.characterSlug&&r.sourceRecordKey===binding.sourceRecordKey);
  const keys=[...new Set(matches.map(r=>r.mediaKey))];
  if(keys.length>1)throw new Error('Persisted Media Key identity conflict');
  return keys.length===1?keys[0]:createMoveMediaKey(binding);
}
