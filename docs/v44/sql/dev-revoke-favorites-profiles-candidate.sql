-- V44 候補（未適用・承認待ち）。対象: 開発DB vvsknbmlfvvnrmgtyhbf のみ。
-- 内容は既存 Migration 20260902081802_harden_user_profiles_and_favorites.sql の先頭2文と同じ（本番は適用済み・同じ権限状態）。
-- 目的: favorites / profiles の anon 権限（全権限）と、authenticated の TRUNCATE/REFERENCES/TRIGGER を外す。
-- 維持: authenticated の SELECT/INSERT/UPDATE/DELETE（RLS: user_id = auth.uid()）。
begin;
do $pre$ begin
  if not exists (select 1 from pg_policy where polrelid='public.favorites'::regclass and polname='users manage own favorites') then raise exception 'favorites_policy_missing'; end if;
  if not (select relrowsecurity from pg_class where oid='public.favorites'::regclass) then raise exception 'favorites_rls_off'; end if;
  if not (select relrowsecurity from pg_class where oid='public.profiles'::regclass) then raise exception 'profiles_rls_off'; end if;
end $pre$;
revoke all on table public.profiles, public.favorites from anon;
revoke truncate, references, trigger on table public.profiles, public.favorites from authenticated;
do $post$ begin
  if has_table_privilege('anon','public.favorites','select') or has_table_privilege('anon','public.profiles','select') then raise exception 'anon_still_has_select'; end if;
  if has_table_privilege('authenticated','public.favorites','truncate') then raise exception 'authenticated_truncate_remains'; end if;
  if not (has_table_privilege('authenticated','public.favorites','select') and has_table_privilege('authenticated','public.favorites','insert') and has_table_privilege('authenticated','public.favorites','update') and has_table_privilege('authenticated','public.favorites','delete')) then raise exception 'authenticated_crud_lost'; end if;
end $post$;
commit;
