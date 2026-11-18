// 舞SQL候補のローカル検証ハーネス（実DBには接続しない）。使い方は test-sql-with-pglite.mjs と同じ。
import { PGlite } from '@electric-sql/pglite'; import { readFileSync } from 'node:fs';
const SQL='/home/user/palzsoftware/sf6dna/docs/move-data-fix-20261117/sql/';
const db=new PGlite();
await db.exec(`create table public.moves(id uuid primary key, slug text); create table public.move_frame_data(id uuid primary key, move_id uuid, startup text, active text, recovery text, on_hit text, on_block text, damage integer, valid_to_patch_id uuid);
insert into public.moves values ('f3fc4f71-7de2-4f23-9a7c-5b98c41124b7','mai-hien-ren-kyaku-2-5lk-lk-lk'),('11111111-1111-4111-8111-111111111111','mai-hien-ren-kyaku-1-5lk-lk');
insert into public.move_frame_data values ('bcbebcaf-6499-4dfb-bc55-62d4e621399d','f3fc4f71-7de2-4f23-9a7c-5b98c41124b7','7','7-8','20','-2','-10',400,null),('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','7','7-8','20','-2','-10',400,null);`);
const run=n=>db.exec(readFileSync(SQL+n,'utf8')); const st=async n=>(await run(n)).at(-1).rows.map(r=>r.status);
const snap=async()=>JSON.stringify((await db.query('select * from public.move_frame_data order by id')).rows);
const s0=await snap(); const out={pre:await st('mai_hien_step3_01_precheck.sql')};
try{await run('mai_hien_step3_02_apply.sql');out.noflag='NOT_ABORTED'}catch(e){out.noflag='ABORTED: '+e.message}
await db.exec('rollback').catch(()=>{}); out.unchanged=(await snap())===s0;
await db.exec(readFileSync(SQL+'mai_hien_step3_02_apply.sql','utf8').replace("official_confirmed', 'no'","official_confirmed', 'yes'"));
out.verify=await st('mai_hien_step3_03_verify.sql');
out.sibling_untouched=(await db.query(`select startup from public.move_frame_data where id='22222222-2222-4222-8222-222222222222'`)).rows[0].startup;
await run('mai_hien_step3_04_rollback.sql'); out.rollback_exact=(await snap())===s0;
console.log(JSON.stringify(out));
