create table private.contact_inbox_config (
  singleton boolean primary key default true check (singleton),
  rate_secret bytea not null check (octet_length(rate_secret) = 32)
);

revoke all on table private.contact_inbox_config from public, anon, authenticated, service_role;

insert into private.contact_inbox_config (singleton, rate_secret)
values (true, extensions.gen_random_bytes(32));

create table public.contact_inbox (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null check (category = any (array[
    '不具合報告',
    'データ修正依頼',
    '機能要望',
    'プレイヤー・動画情報の修正',
    '権利・プライバシー',
    'その他'
  ]::text[])),
  message text not null check (char_length(message) between 10 and 4000),
  reply_email text not null check (
    char_length(reply_email) between 3 and 254
    and reply_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  target_url text check (
    target_url is null
    or (char_length(target_url) <= 2048 and target_url ~ '^https?://')
  ),
  user_id uuid references auth.users(id) on delete set null,
  requester_hash text not null check (requester_hash ~ '^[0-9a-f]{64}$'),
  status text not null default 'new' check (status in ('new', 'triaged', 'closed'))
);

comment on table public.contact_inbox is
  'Private contact inbox. No public row access; submissions are accepted only through the validated submit_contact RPC and retained for at most 180 days.';
comment on column public.contact_inbox.requester_hash is
  'HMAC-SHA256 pseudonymous abuse-control key. Raw requester IP is never stored.';

alter table public.contact_inbox enable row level security;

revoke all on table public.contact_inbox from public, anon, authenticated;
grant select, insert, update, delete on table public.contact_inbox to service_role;

create index contact_inbox_created_at_idx
  on public.contact_inbox (created_at desc);
create index contact_inbox_requester_rate_idx
  on public.contact_inbox (requester_hash, created_at desc);
create index contact_inbox_email_rate_idx
  on public.contact_inbox ((lower(reply_email)), created_at desc);
create index contact_inbox_user_rate_idx
  on public.contact_inbox (user_id, created_at desc)
  where user_id is not null;

create or replace function public.submit_contact(
  p_category text,
  p_message text,
  p_reply_email text,
  p_target_url text default null,
  p_requester_key text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_user_id uuid := auth.uid();
  v_category text := btrim(coalesce(p_category, ''));
  v_message text := btrim(coalesce(p_message, ''));
  v_reply_email text := lower(btrim(coalesce(p_reply_email, '')));
  v_target_url text := nullif(btrim(coalesce(p_target_url, '')), '');
  v_requester_key text := left(coalesce(nullif(btrim(p_requester_key), ''), 'unknown'), 128);
  v_requester_hash text;
  v_rate_secret bytea;
begin
  if v_category <> all (array[
    '不具合報告',
    'データ修正依頼',
    '機能要望',
    'プレイヤー・動画情報の修正',
    '権利・プライバシー',
    'その他'
  ]::text[]) then
    raise exception using errcode = '22023', message = 'contact_invalid_category';
  end if;

  if char_length(v_message) < 10 or char_length(v_message) > 4000 then
    raise exception using errcode = '22023', message = 'contact_invalid_message';
  end if;

  if char_length(v_reply_email) < 3
     or char_length(v_reply_email) > 254
     or v_reply_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception using errcode = '22023', message = 'contact_invalid_email';
  end if;

  if v_target_url is not null
     and (char_length(v_target_url) > 2048 or v_target_url !~ '^https?://') then
    raise exception using errcode = '22023', message = 'contact_invalid_target_url';
  end if;

  select rate_secret
    into v_rate_secret
    from private.contact_inbox_config
   where singleton = true;

  if v_rate_secret is null then
    raise exception using errcode = '55000', message = 'contact_not_configured';
  end if;

  v_requester_hash := encode(
    extensions.hmac(convert_to(v_requester_key, 'UTF8'), v_rate_secret, 'sha256'),
    'hex'
  );

  if (select count(*) from public.contact_inbox where created_at >= now() - interval '10 minutes') >= 100
     or (select count(*) from public.contact_inbox where requester_hash = v_requester_hash and created_at >= now() - interval '10 minutes') >= 3
     or (select count(*) from public.contact_inbox where requester_hash = v_requester_hash and created_at >= now() - interval '24 hours') >= 10
     or (select count(*) from public.contact_inbox where lower(reply_email) = v_reply_email and created_at >= now() - interval '10 minutes') >= 3
     or (select count(*) from public.contact_inbox where lower(reply_email) = v_reply_email and created_at >= now() - interval '24 hours') >= 10
     or (v_user_id is not null and (select count(*) from public.contact_inbox where user_id = v_user_id and created_at >= now() - interval '10 minutes') >= 3)
     or (v_user_id is not null and (select count(*) from public.contact_inbox where user_id = v_user_id and created_at >= now() - interval '24 hours') >= 10) then
    raise exception using errcode = 'P0001', message = 'contact_rate_limited';
  end if;

  insert into public.contact_inbox (
    category,
    message,
    reply_email,
    target_url,
    user_id,
    requester_hash
  ) values (
    v_category,
    v_message,
    v_reply_email,
    v_target_url,
    v_user_id,
    v_requester_hash
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_contact(text, text, text, text, text) from public;
grant execute on function public.submit_contact(text, text, text, text, text) to anon, authenticated, service_role;

create or replace function private.purge_expired_contact_inbox()
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_deleted bigint;
begin
  delete from public.contact_inbox
   where created_at < now() - interval '180 days';
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function private.purge_expired_contact_inbox() from public, anon, authenticated, service_role;
grant execute on function private.purge_expired_contact_inbox() to postgres;

select cron.schedule(
  'purge-expired-contact-inbox',
  '23 3 * * *',
  $cron$select private.purge_expired_contact_inbox();$cron$
);
