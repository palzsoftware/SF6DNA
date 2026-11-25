-- Rollback of the frame-history option: restore the Prod-live policy body.
begin;
drop policy "public read move frames" on public.move_frame_data;
create policy "public read move frames" on public.move_frame_data for select to public
  using (verification_status = 'verified' and exists (select 1 from public.moves m where m.id = move_frame_data.move_id and m.status = 'published'));
commit;
