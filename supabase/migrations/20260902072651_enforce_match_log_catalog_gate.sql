
alter table public.user_match_logs
  add constraint user_match_logs_rank_before_length_check
    check (rank_before is null or char_length(btrim(rank_before)) between 1 and 80),
  add constraint user_match_logs_rank_after_length_check
    check (rank_after is null or char_length(btrim(rank_after)) between 1 and 80);

create or replace function private.validate_user_match_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is null then
    return new;
  end if;

  if new.user_id <> v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A match log can only be written for the authenticated user.';
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = new.player_character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected player character is not available.';
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = new.opponent_character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected opponent character is not available.';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_user_match_log() from public;
revoke all on function private.validate_user_match_log() from anon;
revoke all on function private.validate_user_match_log() from authenticated;

create trigger validate_user_match_log
before insert or update on public.user_match_logs
for each row execute function private.validate_user_match_log();
