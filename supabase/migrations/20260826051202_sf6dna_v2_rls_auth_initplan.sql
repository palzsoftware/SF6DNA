drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select using (id = (select auth.uid()) or private.is_admin());

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles for update using (id = (select auth.uid())) with check (id = (select auth.uid()) and role = (select p.role from public.profiles p where p.id = (select auth.uid())));

drop policy if exists "users read own diagnosis results" on public.diagnosis_results;
create policy "users read own diagnosis results" on public.diagnosis_results for select using (user_id = (select auth.uid()) or private.is_admin());

drop policy if exists "users insert own diagnosis results" on public.diagnosis_results;
create policy "users insert own diagnosis results" on public.diagnosis_results for insert with check (user_id = (select auth.uid()));

drop policy if exists "users delete own diagnosis results" on public.diagnosis_results;
create policy "users delete own diagnosis results" on public.diagnosis_results for delete using (user_id = (select auth.uid()));

drop policy if exists "users manage own favorites" on public.favorites;
create policy "users manage own favorites" on public.favorites for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
