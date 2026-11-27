-- 復旧(rollback): 適用前の状態へ戻す（開発DBの適用前権限を再付与）。
BEGIN;
GRANT DELETE, INSERT, REFERENCES, TRIGGER, TRUNCATE, UPDATE ON TABLE public.sources, public.entity_sources TO anon;
GRANT REFERENCES, TRIGGER, TRUNCATE ON TABLE public.sources, public.entity_sources TO authenticated;
COMMIT;
