import { PGlite } from '@electric-sql/pglite'; import { readFileSync } from 'node:fs';
const SQL='/home/user/palzsoftware/sf6dna/docs/move-data-release-prep-20261117/sql/';
const db=new PGlite();
await db.exec(`create table public.moves(id uuid primary key, slug text, status text default 'published'); create table public.move_frame_data(id uuid primary key, move_id uuid, active text, valid_to_patch_id uuid);
insert into public.moves(id,slug) values ('3e2fd952-26b8-4942-85fb-651512e650ba','elena-jumping-heavy-kick-j-hk');
insert into public.move_frame_data values ('7dad606b-62bb-4597-99c4-c3b618ad6389','3e2fd952-26b8-4942-85fb-651512e650ba','10-20 / 10-11,13-20',null);`);
const st=async n=>(await db.exec(readFileSync(SQL+n,'utf8'))).find(r=>r.rows.length&&'status' in r.rows[0]).rows.map(r=>r.status);
const snap=async()=>JSON.stringify((await db.query('select * from public.move_frame_data')).rows); const s0=await snap();
const out={pre:await st('elena_jhk_active_01_precheck.sql')};
await db.exec(readFileSync(SQL+'elena_jhk_active_02_apply.sql','utf8')); out.verify=await st('elena_jhk_active_03_verify.sql');
try{await db.exec(readFileSync(SQL+'elena_jhk_active_02_apply.sql','utf8'));out.reapply='NOT_ABORTED'}catch(e){out.reapply='ABORTED: '+e.message;await db.exec('rollback').catch(()=>{})}
await db.exec(readFileSync(SQL+'elena_jhk_active_04_rollback.sql','utf8')); out.rollback_exact=(await snap())===s0;
console.log(JSON.stringify(out));
