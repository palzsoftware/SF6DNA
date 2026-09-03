create schema if not exists private;
create schema if not exists extensions;

alter function public.set_updated_at() set search_path = public;

alter function public.is_admin() set schema private;
revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

alter extension pg_trgm set schema extensions;
