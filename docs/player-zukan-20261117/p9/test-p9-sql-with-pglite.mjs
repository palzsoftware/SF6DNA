import { PGlite } from '@electric-sql/pglite'; import { readFileSync } from 'node:fs';
const P='/home/user/palzsoftware/sf6dna/docs/player-zukan-20261117/p9/';
const body=f=>readFileSync(P+f,'utf8').split('\n').filter(l=>!/^\\|^select \(:'HOST'/.test(l)).join('\n');
const db=new PGlite();
await db.exec(`create table public.players(id uuid primary key, slug text unique, display_name text, status text default 'draft');
create table public.player_aliases(id uuid primary key default gen_random_uuid(), player_id uuid, alias text, normalized_alias text);
create table public.tournaments(id uuid primary key, slug text unique, status text);
create table public.tournament_results(tournament_id uuid, player_id uuid, placement integer, primary key(tournament_id,player_id));
insert into public.players values ('b3f67376-cb75-4b44-8b2d-ef50058a1b98','ryukichi','りゅうきち','draft'),
 ('00000000-0000-4000-8000-0000000000a1','xiaohai','Xiaohai','published'),
 ('00000000-0000-4000-8000-0000000000a2','someone','Someone','draft'),
 ('99addbae-9429-4128-9242-b8f2b89365c2','micky','Micky','published'),('830621f4-38aa-49e3-a320-31621e983fb5','blaz','Blaz','published'),
 ('626062e4-4300-43ee-a20d-10d4c7672364','kilzyou','Kilzyou','published'),('e3cb3bf2-9ec9-4b40-a89a-e33361211cf4','craime','Craime','published'),
 ('b873fd7a-8989-4012-af27-5048b973f880','wabiichi','Wabiichi','draft');
insert into public.player_aliases(player_id,alias,normalized_alias) values ('00000000-0000-4000-8000-0000000000a2','sf5NL','sf5nl');
insert into public.tournaments values ('9a42e7bd-25c8-5f27-86fc-60361f33cc54','ceo-2026','draft');
insert into public.tournament_results values ('9a42e7bd-25c8-5f27-86fc-60361f33cc54','830621f4-38aa-49e3-a320-31621e983fb5',4),('9a42e7bd-25c8-5f27-86fc-60361f33cc54','99addbae-9429-4128-9242-b8f2b89365c2',2);`);
const before=JSON.stringify((await db.query('select count(*) from public.players')).rows);
const r1=(await db.exec(body('P9_DEV_DUPLICATE_CHECK_READONLY.sql'))).find(r=>r.rows.length===11);
console.log('dup check:'); r1.rows.forEach(r=>console.log(' ',r.proposed_slug,r.p9_state,r.result,r.existing_matches));
const r2=(await db.exec(body('P9_TOURNAMENT_RESULTS_CHECK_READONLY.sql'))).find(r=>r.rows.length===5);
console.log('results check:'); r2.rows.forEach(r=>console.log(' ',r.player_slug,r.placement_text,r.result));
console.log('unchanged', before===JSON.stringify((await db.query('select count(*) from public.players')).rows));
