-- SF6DNA V38 CANDIDATE (開発DB vvsknbmlfvvnrmgtyhbf 専用 / 未適用 / 要個別承認)
-- 目的: sources / entity_sources に残る不要なテーブル権限だけを外す。本番Migration(120000)の関数・policy変更は含まない。
--  - anon: 全権限を外す（元々SELECTは無く、RLS adminポリシーのみ。実害は低いが最小権限へ）
--  - authenticated: TRUNCATE/REFERENCES/TRIGGER のみ外す。SELECT/INSERT/UPDATE/DELETE は維持
--    （admin管理機能は authenticated + private.is_admin() の RLS policy で動くため）
-- 影響調査(読み取り済み): sources/entity_sources を参照する関数は全て SECURITY DEFINER（呼び出しロールの権限不要）。
--   FKは entity_sources→sources, character_trait_scores→sources（実行時にREFERENCES権限は不要）。
--   trigger set_updated_at はテーブル所有者権限で動作。公開RPC(get_public_entity_sources, list_public_sources)は不変。
BEGIN;
SET LOCAL lock_timeout = '5s';

DO $pre$ BEGIN
  IF current_database() IS NULL THEN RAISE EXCEPTION 'no db'; END IF;
  -- 開発DB固有の前提: 公開ポリシーがsourceテーブルをinline参照していないこと
  IF EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid=p.polrelid JOIN pg_namespace n ON n.oid=c.relnamespace
             WHERE n.nspname='public' AND c.relname NOT IN ('sources','entity_sources')
               AND pg_get_expr(p.polqual,p.polrelid) ~ '(^|[^_a-z])(entity_sources|sources)([^_a-z]|$)') THEN
    RAISE EXCEPTION 'a public policy still reads the source tables inline: abort';
  END IF;
  IF to_regprocedure('private.content_has_source(text,uuid)') IS NULL
     OR to_regprocedure('private.move_command_has_official_source(uuid)') IS NULL THEN
    RAISE EXCEPTION 'definer helper functions missing: abort';
  END IF;
END $pre$;

REVOKE ALL ON TABLE public.sources, public.entity_sources FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLE public.sources, public.entity_sources FROM authenticated;

DO $post$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE table_schema='public'
             AND table_name IN ('sources','entity_sources') AND grantee='anon') THEN
    RAISE EXCEPTION 'anon still holds grants'; END IF;
  IF EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE table_schema='public'
             AND table_name IN ('sources','entity_sources') AND grantee='authenticated'
             AND privilege_type IN ('TRUNCATE','REFERENCES','TRIGGER')) THEN
    RAISE EXCEPTION 'authenticated still holds TRUNCATE/REFERENCES/TRIGGER'; END IF;
  IF NOT has_table_privilege('authenticated','public.sources','SELECT,INSERT,UPDATE,DELETE')
     OR NOT has_table_privilege('authenticated','public.entity_sources','SELECT,INSERT,UPDATE,DELETE') THEN
    RAISE EXCEPTION 'authenticated DML must be kept for admin management'; END IF;
END $post$;
COMMIT;
