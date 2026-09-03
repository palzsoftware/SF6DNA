
alter policy "users update own profile"
on public.profiles
to authenticated
using (
  id = (select auth.uid())
)
with check (
  id = (select auth.uid())
);
