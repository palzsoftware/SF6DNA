
alter table public.user_training_logs
  add column training_name_snapshot text,
  add column training_type_snapshot text,
  add column player_character_id_snapshot uuid,
  add column player_character_name_snapshot text,
  add column dummy_character_id_snapshot uuid,
  add column dummy_character_name_snapshot text,
  add constraint user_training_logs_training_name_snapshot_check
    check (
      training_name_snapshot is null
      or char_length(btrim(training_name_snapshot)) between 1 and 200
    ),
  add constraint user_training_logs_training_type_snapshot_check
    check (
      training_type_snapshot is null
      or char_length(btrim(training_type_snapshot)) between 1 and 80
    ),
  add constraint user_training_logs_player_character_name_snapshot_check
    check (
      player_character_name_snapshot is null
      or char_length(btrim(player_character_name_snapshot)) between 1 and 80
    ),
  add constraint user_training_logs_dummy_character_name_snapshot_check
    check (
      dummy_character_name_snapshot is null
      or char_length(btrim(dummy_character_name_snapshot)) between 1 and 80
    );

create index user_training_logs_user_player_snapshot_practiced_idx
  on public.user_training_logs (
    user_id,
    player_character_id_snapshot,
    practiced_at desc
  )
  where player_character_id_snapshot is not null;

create or replace function private.snapshot_user_training_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_training_name text;
  v_training_type text;
  v_player_character_id uuid;
  v_player_character_name text;
  v_dummy_character_id uuid;
  v_dummy_character_name text;
begin
  if new.training_id is null then
    new.training_name_snapshot := null;
    new.training_type_snapshot := null;
    new.player_character_id_snapshot := null;
    new.player_character_name_snapshot := null;
    new.dummy_character_id_snapshot := null;
    new.dummy_character_name_snapshot := null;
    return new;
  end if;

  if tg_op = 'UPDATE' and new.training_id is not distinct from old.training_id then
    new.training_name_snapshot := old.training_name_snapshot;
    new.training_type_snapshot := old.training_type_snapshot;
    new.player_character_id_snapshot := old.player_character_id_snapshot;
    new.player_character_name_snapshot := old.player_character_name_snapshot;
    new.dummy_character_id_snapshot := old.dummy_character_id_snapshot;
    new.dummy_character_name_snapshot := old.dummy_character_name_snapshot;
    return new;
  end if;

  select
    t.name,
    t.training_type,
    t.player_character_id,
    pc.name_ja,
    t.dummy_character_id,
    dc.name_ja
  into
    v_training_name,
    v_training_type,
    v_player_character_id,
    v_player_character_name,
    v_dummy_character_id,
    v_dummy_character_name
  from public.trainings t
  left join public.characters pc on pc.id = t.player_character_id
  left join public.characters dc on dc.id = t.dummy_character_id
  where t.id = new.training_id
    and private.is_training_public_ready(t.id);

  if not found then
    raise exception using
      errcode = '22023',
      message = 'The selected training is not publicly available.';
  end if;

  new.training_name_snapshot := v_training_name;
  new.training_type_snapshot := v_training_type;
  new.player_character_id_snapshot := v_player_character_id;
  new.player_character_name_snapshot := v_player_character_name;
  new.dummy_character_id_snapshot := v_dummy_character_id;
  new.dummy_character_name_snapshot := v_dummy_character_name;

  return new;
end;
$$;

revoke all on function private.snapshot_user_training_log() from public;
revoke all on function private.snapshot_user_training_log() from anon;
revoke all on function private.snapshot_user_training_log() from authenticated;

create trigger snapshot_user_training_log
before insert or update on public.user_training_logs
for each row execute function private.snapshot_user_training_log();

do $migration$
declare
  v_def text;
  v_changed text;
begin
  select pg_get_functiondef(
    'public.get_training_progress(integer,uuid)'::regprocedure
  ) into v_def;

  if position('t.name as catalog_training_name' in v_def) = 0
     or position('t.player_character_id' in v_def) = 0 then
    raise exception 'Expected catalog fields were not found in get_training_progress';
  end if;

  v_changed := replace(
    v_def,
    't.name as catalog_training_name',
    'coalesce(l.training_name_snapshot, t.name) as catalog_training_name'
  );
  v_changed := replace(
    v_changed,
    't.player_character_id,',
    'coalesce(l.player_character_id_snapshot, t.player_character_id) as player_character_id,'
  );
  v_changed := replace(
    v_changed,
    'or t.player_character_id = p_player_character_id',
    'or coalesce(l.player_character_id_snapshot, t.player_character_id) = p_player_character_id'
  );
  execute v_changed;

  select pg_get_functiondef(
    'public.get_weekly_progress_review(date,uuid)'::regprocedure
  ) into v_def;

  if position('select l.*, t.name as training_name, t.player_character_id' in v_def) = 0
     or position('select l.*, t.player_character_id' in v_def) = 0 then
    raise exception 'Expected catalog fields were not found in get_weekly_progress_review';
  end if;

  v_changed := replace(
    v_def,
    'select l.*, t.name as training_name, t.player_character_id',
    'select l.*, coalesce(l.training_name_snapshot, t.name) as training_name, coalesce(l.player_character_id_snapshot, t.player_character_id) as player_character_id'
  );
  v_changed := replace(
    v_changed,
    'select l.*, t.player_character_id',
    'select l.*, coalesce(l.player_character_id_snapshot, t.player_character_id) as player_character_id'
  );
  v_changed := replace(
    v_changed,
    'or t.player_character_id = p_player_character_id',
    'or coalesce(l.player_character_id_snapshot, t.player_character_id) = p_player_character_id'
  );
  execute v_changed;
end
$migration$;
