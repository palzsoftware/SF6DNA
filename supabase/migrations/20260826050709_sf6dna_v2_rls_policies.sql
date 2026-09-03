create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.patches enable row level security;
alter table public.sources enable row level security;
alter table public.characters enable row level security;
alter table public.character_aliases enable row level security;
alter table public.character_guide_sections enable row level security;
alter table public.moves enable row level security;
alter table public.move_aliases enable row level security;
alter table public.move_commands enable row level security;
alter table public.move_frame_data enable row level security;
alter table public.combos enable row level security;
alter table public.combo_moves enable row level security;
alter table public.setups enable row level security;
alter table public.setup_moves enable row level security;
alter table public.sequences enable row level security;
alter table public.counters enable row level security;
alter table public.trainings enable row level security;
alter table public.training_relations enable row level security;
alter table public.players enable row level security;
alter table public.player_aliases enable row level security;
alter table public.player_characters enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_results enable row level security;
alter table public.videos enable row level security;
alter table public.matches enable row level security;
alter table public.match_participants enable row level security;
alter table public.glossary enable row level security;
alter table public.glossary_aliases enable row level security;
alter table public.entity_sources enable row level security;
alter table public.diagnoses enable row level security;
alter table public.diagnosis_questions enable row level security;
alter table public.diagnosis_options enable row level security;
alter table public.profiles enable row level security;
alter table public.diagnosis_results enable row level security;
alter table public.favorites enable row level security;

create policy "public read patches" on public.patches for select using (true);
create policy "public read sources" on public.sources for select using (true);
create policy "public read published characters" on public.characters for select using (status = 'published');
create policy "public read character aliases" on public.character_aliases for select using (exists (select 1 from public.characters c where c.id = character_id and c.status = 'published'));
create policy "public read published character guides" on public.character_guide_sections for select using (status = 'published');
create policy "public read published moves" on public.moves for select using (status = 'published');
create policy "public read move aliases" on public.move_aliases for select using (exists (select 1 from public.moves m where m.id = move_id and m.status = 'published'));
create policy "public read move commands" on public.move_commands for select using (exists (select 1 from public.moves m where m.id = move_id and m.status = 'published'));
create policy "public read move frames" on public.move_frame_data for select using (exists (select 1 from public.moves m where m.id = move_id and m.status = 'published'));
create policy "public read published combos" on public.combos for select using (status = 'published');
create policy "public read combo moves" on public.combo_moves for select using (exists (select 1 from public.combos c where c.id = combo_id and c.status = 'published'));
create policy "public read published setups" on public.setups for select using (status = 'published');
create policy "public read setup moves" on public.setup_moves for select using (exists (select 1 from public.setups s where s.id = setup_id and s.status = 'published'));
create policy "public read published sequences" on public.sequences for select using (status = 'published');
create policy "public read published counters" on public.counters for select using (status = 'published');
create policy "public read published trainings" on public.trainings for select using (status = 'published');
create policy "public read training relations" on public.training_relations for select using (exists (select 1 from public.trainings t where t.id = training_id and t.status = 'published'));
create policy "public read published players" on public.players for select using (status = 'published');
create policy "public read player aliases" on public.player_aliases for select using (exists (select 1 from public.players p where p.id = player_id and p.status = 'published'));
create policy "public read player characters" on public.player_characters for select using (exists (select 1 from public.players p where p.id = player_id and p.status = 'published'));
create policy "public read published tournaments" on public.tournaments for select using (status = 'published');
create policy "public read tournament results" on public.tournament_results for select using (exists (select 1 from public.tournaments t where t.id = tournament_id and t.status = 'published'));
create policy "public read published videos" on public.videos for select using (status = 'published');
create policy "public read published matches" on public.matches for select using (status = 'published');
create policy "public read match participants" on public.match_participants for select using (exists (select 1 from public.matches m where m.id = match_id and m.status = 'published'));
create policy "public read published glossary" on public.glossary for select using (status = 'published');
create policy "public read glossary aliases" on public.glossary_aliases for select using (exists (select 1 from public.glossary g where g.id = glossary_id and g.status = 'published'));
create policy "public read entity sources" on public.entity_sources for select using (true);
create policy "public read published diagnoses" on public.diagnoses for select using (status = 'published');
create policy "public read published diagnosis questions" on public.diagnosis_questions for select using (status = 'published');
create policy "public read diagnosis options" on public.diagnosis_options for select using (exists (select 1 from public.diagnosis_questions q where q.id = question_id and q.status = 'published'));

create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "users read own diagnosis results" on public.diagnosis_results for select using (user_id = auth.uid() or public.is_admin());
create policy "users insert own diagnosis results" on public.diagnosis_results for insert with check (user_id = auth.uid());
create policy "users delete own diagnosis results" on public.diagnosis_results for delete using (user_id = auth.uid());
create policy "users manage own favorites" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "admin manage patches" on public.patches for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage sources" on public.sources for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage characters" on public.characters for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage character aliases" on public.character_aliases for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage character guides" on public.character_guide_sections for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage moves" on public.moves for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage move aliases" on public.move_aliases for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage move commands" on public.move_commands for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage move frames" on public.move_frame_data for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage combos" on public.combos for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage combo moves" on public.combo_moves for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage setups" on public.setups for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage setup moves" on public.setup_moves for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage sequences" on public.sequences for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage counters" on public.counters for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage trainings" on public.trainings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage training relations" on public.training_relations for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage players" on public.players for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage player aliases" on public.player_aliases for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage player characters" on public.player_characters for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage tournaments" on public.tournaments for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage tournament results" on public.tournament_results for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage videos" on public.videos for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage matches" on public.matches for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage match participants" on public.match_participants for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage glossary" on public.glossary for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage glossary aliases" on public.glossary_aliases for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage entity sources" on public.entity_sources for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage diagnoses" on public.diagnoses for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage diagnosis questions" on public.diagnosis_questions for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage diagnosis options" on public.diagnosis_options for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage diagnosis results" on public.diagnosis_results for all using (public.is_admin()) with check (public.is_admin());
