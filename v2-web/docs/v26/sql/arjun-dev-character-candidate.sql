-- V29 Arjun 開発DB用キャラクター行 CANDIDATE（未実行・開発DB(vvsknbmlfvvnrmgtyhbf)専用・本番へは流用しない）
-- 前提: 開発DBには slug='arjun' 行が無い（2026-11-26 読み取り確認、characters 31件 display_order 1-31）。
-- 値は本番(SF6DNAPro)の既存行と同一（name_ja=アルジュン, name_en=Arjun, status=draft, is_playable=false, display_order=32）。UUIDは新規採番（本番UUIDを流用しない）。
-- 再実行安全: slug 既存なら何もしない。draft・非公開のまま。arjun-intake-candidate.sql（moves 62 / commands 120 / frames 62）より先に実行する。
begin;
insert into public.characters(slug,name_ja,name_en,status,is_playable,display_order)
select 'arjun','アルジュン','Arjun','draft',false,32
where not exists (select 1 from public.characters where slug='arjun');
do $post$ begin
  if (select count(*) from public.characters where slug='arjun')<>1 then raise exception 'arjun_character_count_unexpected'; end if;
  if exists (select 1 from public.characters where slug='arjun' and (status<>'draft' or is_playable)) then raise exception 'arjun_must_stay_draft_unplayable'; end if;
end $post$;
commit;
-- ROLLBACK（moves未投入の場合のみ）:
--   delete from public.characters where slug='arjun' and not exists (select 1 from public.moves m where m.character_id=characters.id);
