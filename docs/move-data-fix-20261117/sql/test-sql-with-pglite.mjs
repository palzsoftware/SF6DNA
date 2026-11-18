// SQL候補のローカル検証ハーネス（実DBには接続しない）。
// 使い方: 任意の空ディレクトリで npm i @electric-sql/pglite@0.2.17 → node <このファイル>（R はリポジトリルートの絶対パスに合わせる）
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
const R='/home/user/palzsoftware/sf6dna/', SQL=R+'docs/move-data-fix-20261117/sql/';
const f=JSON.parse(readFileSync(R+'v2-web/src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json','utf8')).characters;
const csv=readFileSync(R+'docs/move-data-quality-20261117/DB_FRAME_CORRECTION_CANDIDATES.csv','utf8');
const q=s=>"'"+String(s).replaceAll("'","''")+"'";
async function setup(){
  const db=new PGlite();
  await db.exec(`create table public.moves(id uuid primary key, slug text not null unique, status text default 'draft');
  create table public.move_frame_data(id uuid primary key, move_id uuid not null references public.moves(id), startup text, active text, valid_to_patch_id uuid, updated_at timestamptz default now());
  create table public.move_commands(id uuid primary key, move_id uuid not null references public.moves(id), control_scheme text not null check (control_scheme in ('classic','modern')), command_text text not null, numeric_notation text);`);
  for (const s of ['blanka','e-honda','cammy']) for (const m of f[s].moves) {
    const a=f[s].audit.find(x=>x.id===m.id);
    await db.exec(`insert into public.moves(id,slug) values (${q(m.id)},${q(m.slug)});
      insert into public.move_frame_data(id,move_id,startup,active) values (${q(a.frameId)},${q(m.id)},${q(m.frame.startup??'')},${m.frame.active==null?'null':q(m.frame.active)});`);
  }
  await db.exec(`insert into public.move_commands values ('b23ccfc9-f215-41f3-a3b4-f0587fcfd098','b71563a1-1e76-426e-846a-efe566eb419f','classic','214214K','214214K'),
    ('9701702b-6570-4d1d-8a67-4aec601006c3','13a0114b-6cb3-4079-ae51-d51fa15b20ee','classic','j.214214K','j.214214K');`);
  return db;
}
const run=(db,n)=>db.exec(readFileSync(SQL+n,'utf8'));
const statuses=async(db,n)=>{const r=await run(db,n);return r.at(-1).rows.map(x=>x.status);};
const count=(arr,v)=>arr.filter(x=>x===v).length;
const out={};
let db=await setup();
const snap=async()=>JSON.stringify((await db.query('select id,active from public.move_frame_data order by id')).rows);
const before=await snap();
out.frame_precheck_ready=count(await statuses(db,'frame_concat_01_precheck.sql'),'READY');
await run(db,'frame_concat_02_apply.sql');
out.frame_verify_applied=count(await statuses(db,'frame_concat_03_verify.sql'),'APPLIED');
out.frame_precheck_after=count(await statuses(db,'frame_concat_01_precheck.sql'),'ALREADY_APPLIED');
out.untouched_other_rows=(await db.query(`select count(*)::int n from public.move_frame_data`)).rows[0].n;
await run(db,'frame_concat_04_rollback.sql');
out.rollback_restores_exact_state=(await snap())===before;
// negative: one value drifted -> whole apply aborts, nothing changed
await db.exec(`update public.move_frame_data set active='X' where id=(select frame_id from (values ${'(1)'}) v(x), lateral (select id as frame_id from public.move_frame_data where active like '9-209%' limit 1) s)`);
const drifted=await snap();
try{await run(db,'frame_concat_02_apply.sql');out.drift_apply='NOT_ABORTED';}catch(e){out.drift_apply='ABORTED: '+e.message;}
await db.exec('rollback').catch(()=>{});
out.drift_no_partial_write=(await snap())===drifted;
// cammy
db=await setup();
out.cammy_precheck=await statuses(db,'cammy_sa2_01_precheck.sql');
try{await run(db,'cammy_sa2_02_apply.sql');out.cammy_without_confirmation='NOT_ABORTED';}catch(e){out.cammy_without_confirmation='ABORTED: '+e.message;}
await db.exec('rollback').catch(()=>{});
out.cammy_unchanged=(await db.query(`select command_text from public.move_commands order by id`)).rows.map(r=>r.command_text);
const confirmed=readFileSync(SQL+'cammy_sa2_02_apply.sql','utf8').replace("'sf6dna.cammy_sa2_official_confirmed', 'no'","'sf6dna.cammy_sa2_official_confirmed', 'yes'");
await db.exec(confirmed);
out.cammy_verify=await statuses(db,'cammy_sa2_03_verify.sql');
await run(db,'cammy_sa2_04_rollback.sql');
out.cammy_after_rollback=(await db.query(`select command_text,numeric_notation from public.move_commands order by id`)).rows;
console.log(JSON.stringify(out,null,1));
