-- V26 CANDIDATE (not executed). Development DB only: draft rows for the 6 approved players that have no Development draft.
-- Never run on Production as is. No fixed UUID (DB default); bindings are added only after the real IDs are read back.
-- Kusanagi = the French player only (do not merge with the same-name player from the Americas). Rollback: delete these slugs while status='draft'.
begin;
insert into public.players(slug,display_name,country_code,is_active,status) select 'problem-x','Problem X','GB',true,'draft' where not exists (select 1 from public.players where slug='problem-x');
insert into public.players(slug,display_name,country_code,is_active,status) select 'oil-king','Oil King','TW',true,'draft' where not exists (select 1 from public.players where slug='oil-king');
insert into public.players(slug,display_name,country_code,is_active,status) select 'kusanagi','Kusanagi','FR',true,'draft' where not exists (select 1 from public.players where slug='kusanagi');
insert into public.players(slug,display_name,country_code,is_active,status) select 'broski','Broski','GB',true,'draft' where not exists (select 1 from public.players where slug='broski');
insert into public.players(slug,display_name,country_code,is_active,status) select 'xian','Xian','SG',true,'draft' where not exists (select 1 from public.players where slug='xian');
insert into public.players(slug,display_name,country_code,is_active,status) select 'luffy','Luffy','FR',true,'draft' where not exists (select 1 from public.players where slug='luffy');
commit;
