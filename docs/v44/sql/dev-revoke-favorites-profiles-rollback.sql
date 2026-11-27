-- 復旧（開発DBを適用前の権限へ戻す）。
grant delete, insert, references, select, trigger, truncate, update on table public.profiles, public.favorites to anon;
grant references, trigger, truncate on table public.profiles, public.favorites to authenticated;
