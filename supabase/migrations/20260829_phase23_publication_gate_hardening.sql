-- Phase23 final non-human publication gate hardening.
-- Keep public reads aligned with application-level readiness rules.

create or replace function private.is_diagnosis_public_ready(target_diagnosis_id uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.diagnoses d
    where d.id = target_diagnosis_id
      and d.status = 'published'
      and exists (
        select 1
        from public.diagnosis_questions q
        where q.diagnosis_id = d.id
          and q.status = 'published'
      )
      and not exists (
        select 1
        from public.diagnosis_questions q
        where q.diagnosis_id = d.id
          and q.status = 'published'
          and not exists (
            select 1
            from public.diagnosis_options o
            where o.question_id = q.id
          )
      )
  );
$$;

drop policy if exists "public read published diagnoses" on public.diagnoses;
create policy "public read release-ready diagnoses"
on public.diagnoses
for select
using (private.is_diagnosis_public_ready(id));

drop policy if exists "public read published diagnosis questions" on public.diagnosis_questions;
create policy "public read release-ready diagnosis questions"
on public.diagnosis_questions
for select
using (
  status = 'published'
  and private.is_diagnosis_public_ready(diagnosis_id)
);

drop policy if exists "public read diagnosis options" on public.diagnosis_options;
create policy "public read release-ready diagnosis options"
on public.diagnosis_options
for select
using (
  exists (
    select 1
    from public.diagnosis_questions q
    where q.id = diagnosis_options.question_id
      and q.status = 'published'
      and private.is_diagnosis_public_ready(q.diagnosis_id)
  )
);

create or replace function private.is_character_trait_score_public_ready(target_score_id uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.character_trait_scores cts
    join public.characters c on c.id = cts.character_id
    join public.character_traits t on t.id = cts.trait_id
    where cts.id = target_score_id
      and cts.status = 'published'
      and cts.verification_status = 'verified'
      and c.status = 'published'
      and c.is_playable = true
      and t.status = 'published'
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'character_trait_score'
          and es.entity_id = cts.id
      )
  );
$$;

drop policy if exists "public read published character trait scores" on public.character_trait_scores;
create policy "public read release-ready character trait scores"
on public.character_trait_scores
for select
using (private.is_character_trait_score_public_ready(id));
