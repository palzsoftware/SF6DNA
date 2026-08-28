drop policy if exists "public read published combos" on public.combos;
create policy "public read published combos" on public.combos for select using (
  status = 'published' and verification_status = 'verified'
  and exists (select 1 from public.entity_sources es where es.entity_type='combo' and es.entity_id=combos.id)
);

drop policy if exists "public read published setups" on public.setups;
create policy "public read published setups" on public.setups for select using (
  status = 'published' and verification_status = 'verified'
  and exists (select 1 from public.entity_sources es where es.entity_type='setup' and es.entity_id=setups.id)
);

drop policy if exists "public read published sequences" on public.sequences;
create policy "public read published sequences" on public.sequences for select using (
  status = 'published' and verification_status = 'verified'
  and exists (select 1 from public.entity_sources es where es.entity_type='sequence' and es.entity_id=sequences.id)
);

drop policy if exists "public read published counters" on public.counters;
create policy "public read published counters" on public.counters for select using (
  status = 'published' and verification_status = 'verified'
  and exists (select 1 from public.entity_sources es where es.entity_type='counter' and es.entity_id=counters.id)
);

drop policy if exists "public read published trainings" on public.trainings;
create policy "public read published trainings" on public.trainings for select using (
  status = 'published' and verification_status = 'verified'
  and exists (select 1 from public.entity_sources es where es.entity_type='training' and es.entity_id=trainings.id)
);
