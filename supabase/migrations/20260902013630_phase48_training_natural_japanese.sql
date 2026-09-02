-- Naturalize repetitive purpose copy in user-facing Training drafts.
-- This migration changes copy only; publication and verification states are preserved.

do $migration$
declare
  fixed_rows integer;
  organized_rows integer;
begin
  select
    count(*) filter (where purpose ~ '固定する。?$'),
    count(*) filter (where purpose ~ '整理する。?$')
  into fixed_rows, organized_rows
  from public.trainings
  where status = 'draft'
    and valid_to_patch_id is null
    and content_kind in ('training', 'editorial', 'verified_strategy');

  if fixed_rows <> 45 or organized_rows <> 4 then
    raise exception 'training Japanese audit precondition failed: fixed %, organized %',
      fixed_rows, organized_rows;
  end if;

  update public.trainings
  set purpose = regexp_replace(purpose, '固定する。?$', '安定させる。'),
      updated_at = now()
  where status = 'draft'
    and valid_to_patch_id is null
    and content_kind in ('training', 'editorial', 'verified_strategy')
    and purpose ~ '固定する。?$';

  get diagnostics fixed_rows = row_count;
  if fixed_rows <> 45 then
    raise exception 'training Japanese audit fixed update mismatch: %', fixed_rows;
  end if;

  update public.trainings
  set purpose = regexp_replace(purpose, 'を整理する。?$', 'の違いを覚える。'),
      updated_at = now()
  where status = 'draft'
    and valid_to_patch_id is null
    and content_kind in ('training', 'editorial', 'verified_strategy')
    and purpose ~ '整理する。?$';

  get diagnostics organized_rows = row_count;
  if organized_rows <> 4 then
    raise exception 'training Japanese audit organized update mismatch: %', organized_rows;
  end if;
end
$migration$;
