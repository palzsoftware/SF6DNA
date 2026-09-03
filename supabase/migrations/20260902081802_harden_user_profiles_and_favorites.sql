
revoke all on table public.profiles, public.favorites from anon;

revoke truncate, references, trigger
on table public.profiles, public.favorites
from authenticated;

alter policy "users update own profile"
on public.profiles
to authenticated;

alter policy "users manage own favorites"
on public.favorites
to authenticated;

alter table public.user_game_profiles
  drop constraint user_game_profiles_current_rank_length_check,
  add constraint user_game_profiles_current_rank_length_check
    check (
      current_rank is null
      or char_length(btrim(current_rank)) between 1 and 80
    );

create or replace function private.validate_user_game_profile_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is not null
     and new.user_id is distinct from v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A game profile can only be written for the authenticated user.';
  end if;

  if tg_op = 'UPDATE'
     and (
       new.user_id is distinct from old.user_id
       or new.created_at is distinct from old.created_at
     ) then
    raise exception using
      errcode = '42501',
      message = 'Game profile ownership and creation time are immutable.';
  end if;

  if (
       tg_op = 'INSERT'
       or new.main_character_id is distinct from old.main_character_id
     )
     and new.main_character_id is not null
     and not exists (
       select 1
       from public.characters c
       where c.id = new.main_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception using
      errcode = '22023',
      message = 'The selected main character is not available.';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_user_game_profile_write()
from public, anon, authenticated, service_role;

drop trigger if exists validate_user_game_profile_write
on public.user_game_profiles;

create trigger validate_user_game_profile_write
before insert or update on public.user_game_profiles
for each row
execute function private.validate_user_game_profile_write();

create or replace function private.validate_favorite_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
  v_is_available boolean := false;
begin
  if v_auth_user_id is not null
     and new.user_id is distinct from v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A favorite can only be written for the authenticated user.';
  end if;

  if tg_op = 'UPDATE'
     and (
       new.id is distinct from old.id
       or new.user_id is distinct from old.user_id
       or new.created_at is distinct from old.created_at
     ) then
    raise exception using
      errcode = '42501',
      message = 'Favorite identity, ownership, and creation time are immutable.';
  end if;

  if tg_op = 'UPDATE'
     and new.entity_type is not distinct from old.entity_type
     and new.entity_id is not distinct from old.entity_id then
    return new;
  end if;

  case new.entity_type
    when 'character' then
      select exists (
        select 1
        from public.characters c
        where c.id = new.entity_id
          and c.status = 'published'
      ) into v_is_available;

    when 'move' then
      select exists (
        select 1
        from public.moves m
        where m.id = new.entity_id
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      ) into v_is_available;

    when 'combo' then
      v_is_available := private.is_combo_public_ready(new.entity_id);

    when 'setup' then
      v_is_available := private.is_setup_public_ready(new.entity_id);

    when 'sequence' then
      v_is_available := private.is_sequence_public_ready(new.entity_id);

    when 'counter' then
      v_is_available := private.is_counter_public_ready(new.entity_id);

    when 'training' then
      v_is_available := private.is_training_public_ready(new.entity_id);

    when 'player' then
      select exists (
        select 1
        from public.players p
        where p.id = new.entity_id
          and p.status = 'published'
      ) into v_is_available;

    when 'tournament' then
      select exists (
        select 1
        from public.tournaments t
        where t.id = new.entity_id
          and t.status = 'published'
      ) into v_is_available;

    when 'video' then
      select exists (
        select 1
        from public.videos v
        where v.id = new.entity_id
          and v.status = 'published'
      ) into v_is_available;

    when 'glossary' then
      select exists (
        select 1
        from public.glossary g
        where g.id = new.entity_id
          and g.status = 'published'
      ) into v_is_available;

    else
      raise exception using
        errcode = '22023',
        message = 'The favorite entity type is not supported.';
  end case;

  if not coalesce(v_is_available, false) then
    raise exception using
      errcode = '22023',
      message = 'The selected favorite is not publicly available.';
  end if;

  if v_auth_user_id is not null and tg_op = 'INSERT' then
    new.created_at := now();
  end if;

  return new;
end;
$$;

revoke all on function private.validate_favorite_write()
from public, anon, authenticated, service_role;

drop trigger if exists validate_favorite_write
on public.favorites;

create trigger validate_favorite_write
before insert or update on public.favorites
for each row
execute function private.validate_favorite_write();

create or replace function private.validate_profile_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if new.id is distinct from old.id
     or new.created_at is distinct from old.created_at then
    raise exception using
      errcode = '42501',
      message = 'Profile identity and creation time are immutable.';
  end if;

  if v_auth_user_id is not null
     and not private.is_admin()
     and new.role is distinct from old.role then
    raise exception using
      errcode = '42501',
      message = 'A user cannot change their own profile role.';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_profile_write()
from public, anon, authenticated, service_role;

drop trigger if exists validate_profile_write
on public.profiles;

create trigger validate_profile_write
before update on public.profiles
for each row
execute function private.validate_profile_write();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    nullif(
      coalesce(
        new.raw_user_meta_data ->> 'display_name',
        split_part(coalesce(new.email, ''), '@', 1)
      ),
      ''
    ),
    'user'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
