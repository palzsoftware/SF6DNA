-- OPTION (separate decision, NOT part of the move-card change set): stop the public API from returning
-- superseded frame rows (valid_to_patch_id set). Current rows are unchanged. Admin / preview policies untouched.
begin;
do $p$ begin if (select pg_get_expr(polqual, polrelid) from pg_policy where polrelid='public.move_frame_data'::regclass and polname='public read move frames')
  not like '%verification_status = ''verified''%' then raise exception 'public read move frames differs from the known body: abort'; end if; end $p$;
drop policy "public read move frames" on public.move_frame_data;
create policy "public read move frames" on public.move_frame_data for select to public
  using (verification_status = 'verified' and valid_to_patch_id is null
         and exists (select 1 from public.moves m where m.id = move_frame_data.move_id and m.status = 'published'));
commit;
