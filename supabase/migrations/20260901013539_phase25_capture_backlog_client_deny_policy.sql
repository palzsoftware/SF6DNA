drop policy if exists "client deny capture backlog" on public.capture_backlog;
create policy "client deny capture backlog"
on public.capture_backlog
for all
to anon, authenticated
using (false)
with check (false);
