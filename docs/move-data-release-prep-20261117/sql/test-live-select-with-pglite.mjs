import { PGlite } from '@electric-sql/pglite'; import { readFileSync } from 'node:fs';
const R='/home/user/palzsoftware/sf6dna/'; const f=JSON.parse(readFileSync(R+'v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json','utf8')).characters;
const q=s=>"'"+String(s).replaceAll("'","''")+"'";
const db=new PGlite();
await db.exec(`create table public.characters(id uuid primary key, slug text unique); create table public.moves(id uuid primary key, character_id uuid, slug text unique, status text default 'draft');
create table public.move_frame_data(id uuid primary key, move_id uuid, active text, valid_to_patch_id uuid, verification_status text default 'verified', updated_at timestamptz default now());
create table public.sources(id uuid primary key, reliability_level text); create table public.entity_sources(id uuid primary key default gen_random_uuid(), entity_type text, entity_id uuid, source_id uuid);
insert into public.sources values ('00000000-0000-4000-8000-000000000001','official');`);
for (const s of ['blanka','e-honda']) { await db.exec(`insert into public.characters values (${q(f[s].characterId)},${q(s)})`);
  for (const m of f[s].moves){const a=f[s].audit.find(x=>x.id===m.id); await db.exec(`insert into public.moves values (${q(m.id)},${q(f[s].characterId)},${q(m.slug)},'published'); insert into public.move_frame_data(id,move_id,active) values (${q(a.frameId)},${q(m.id)},${m.frame.active==null?'null':q(m.frame.active)}); insert into public.entity_sources(entity_type,entity_id,source_id) values ('move_frame_data',${q(a.frameId)},'00000000-0000-4000-8000-000000000001');`);} }
const sql=readFileSync(R+'docs/move-data-release-prep-20261117/sql/frame_concat_live_readonly_select.sql','utf8');
const before=JSON.stringify((await db.query('select * from public.move_frame_data order by id')).rows);
const res=await db.exec(sql);
const detail=res.find(r=>r.rows.length===31), summary=res.find(r=>r.rows.length===1&&'ready_rows' in r.rows[0]);
const cnt={}; detail.rows.forEach(r=>cnt[r.status]=(cnt[r.status]??0)+1);
console.log(JSON.stringify({statuses:cnt, summary:summary.rows[0], officialSources:detail.rows.every(r=>Number(r.official_sources)===1), unchanged: before===JSON.stringify((await db.query('select * from public.move_frame_data order by id')).rows)}));
// read-only guard: an UPDATE inside a read-only transaction must fail
try{await db.exec("begin; set transaction read only; update public.move_frame_data set active='x'; rollback;");console.log('readonly NOT enforced')}catch(e){console.log('readonly enforced:',e.message);await db.exec('rollback').catch(()=>{})}
