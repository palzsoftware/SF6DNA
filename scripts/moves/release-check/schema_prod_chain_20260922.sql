--
-- PostgreSQL database dump
--

\restrict IAKZCPrIh1QPuhjecRHSiaSzgocUzTWj1pqcFoYNgnDF55H8UL3aUB0Vl16QW1v

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: cron; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA cron;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA private;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$ select coalesce(nullif(current_setting('request.jwt.claims', true),''),'{}')::jsonb $$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$ select nullif(current_setting('request.jwt.claim.role', true),'') $$;


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;


--
-- Name: schedule(text, text, text); Type: FUNCTION; Schema: cron; Owner: -
--

CREATE FUNCTION cron.schedule(a text, b text, c text) RETURNS bigint
    LANGUAGE sql
    AS $$ select 1::bigint $$;


--
-- Name: unschedule(text); Type: FUNCTION; Schema: cron; Owner: -
--

CREATE FUNCTION cron.unschedule(a text) RETURNS boolean
    LANGUAGE sql
    AS $$ select true $$;


--
-- Name: capture_user_activity(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.capture_user_activity() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid;
  v_activity_type text;
  v_source_type text := tg_table_name;
  v_source_id uuid;
  v_label text;
  v_metadata jsonb := '{}'::jsonb;
  v_occurred_at timestamptz := now();
begin
  if tg_table_name = 'diagnosis_results' then
    if tg_op <> 'INSERT' then return new; end if;
    v_user_id := new.user_id;
    if v_user_id is null then return new; end if;
    v_activity_type := 'diagnosis.completed';
    v_source_id := new.id;
    v_label := '診断を完了しました';
    v_occurred_at := new.created_at;
    v_metadata := jsonb_build_object('diagnosis_id', new.diagnosis_id);

  elsif tg_table_name = 'user_match_logs' then
    if tg_op not in ('INSERT', 'UPDATE') then return new; end if;
    v_user_id := new.user_id;
    v_activity_type := 'match.logged';
    v_source_id := new.id;
    v_label := '対戦結果を記録しました';
    v_occurred_at := new.played_at;
    v_metadata := jsonb_strip_nulls(jsonb_build_object(
      'result', new.result,
      'mode', new.mode,
      'primary_issue', new.primary_issue,
      'player_character_id', new.player_character_id,
      'opponent_character_id', new.opponent_character_id
    ));

  elsif tg_table_name = 'user_training_logs' then
    if tg_op not in ('INSERT', 'UPDATE') then return new; end if;
    v_user_id := new.user_id;
    v_activity_type := 'training.completed';
    v_source_id := new.id;
    v_label := '練習を完了しました';
    v_occurred_at := new.practiced_at;
    v_metadata := jsonb_strip_nulls(jsonb_build_object(
      'duration_minutes', new.duration_minutes,
      'training_id', new.training_id,
      'training_plan_id', new.training_plan_id,
      'attempts', new.attempts,
      'successes', new.successes,
      'self_rating', new.self_rating
    ));

  elsif tg_table_name = 'coach_quick_help_intakes' then
    if tg_op = 'INSERT' then
      v_user_id := new.user_id;
      v_activity_type := 'quick_help.started';
      v_source_id := new.id;
      v_label := 'クイック相談を開始しました';
      v_occurred_at := new.started_at;
      v_metadata := jsonb_build_object('flow_id', new.flow_id);

    elsif tg_op = 'UPDATE' then
      if old.status is distinct from new.status
         and new.status = 'ready' then
        insert into public.user_activity_logs (
          user_id, activity_type, source_type, source_id,
          label, metadata, occurred_at, retention_until
        )
        values (
          new.user_id,
          'quick_help.completed',
          tg_table_name,
          new.id,
          'クイック相談の質問に回答しました',
          jsonb_strip_nulls(jsonb_build_object(
            'flow_id', new.flow_id,
            'topic_key', new.topic_key
          )),
          coalesce(new.completed_at, new.updated_at, now()),
          coalesce(new.completed_at, new.updated_at, now()) + interval '180 days'
        )
        on conflict (user_id, activity_type, source_type, source_id)
          where source_id is not null
        do nothing;
      end if;

      if old.ai_coach_session_id is distinct from new.ai_coach_session_id
         and new.ai_coach_session_id is not null then
        insert into public.user_activity_logs (
          user_id, activity_type, source_type, source_id,
          label, metadata, occurred_at, retention_until
        )
        values (
          new.user_id,
          'quick_help.coach_linked',
          tg_table_name,
          new.id,
          '相談内容をAIコーチへ引き継ぎました',
          jsonb_strip_nulls(jsonb_build_object(
            'flow_id', new.flow_id,
            'topic_key', new.topic_key,
            'ai_coach_session_id', new.ai_coach_session_id
          )),
          coalesce(new.updated_at, now()),
          coalesce(new.updated_at, now()) + interval '180 days'
        )
        on conflict (user_id, activity_type, source_type, source_id)
          where source_id is not null
        do nothing;
      end if;

      return new;
    else
      return new;
    end if;

  elsif tg_table_name = 'ai_coach_sessions' then
    if tg_op = 'INSERT' then
      v_user_id := new.user_id;
      v_activity_type := 'ai_coach.session_started';
      v_source_id := new.id;
      v_label := 'AIコーチへの相談を開始しました';
      v_occurred_at := new.created_at;
      v_metadata := jsonb_strip_nulls(jsonb_build_object(
        'coach_tone', new.coach_tone,
        'character_id', new.character_id,
        'diagnosis_result_id', new.diagnosis_result_id
      ));
    elsif tg_op = 'UPDATE' then
      if old.status is distinct from new.status and new.status = 'archived' then
        v_user_id := new.user_id;
        v_activity_type := 'ai_coach.session_archived';
        v_source_id := new.id;
        v_label := 'AIコーチへの相談を終了しました';
        v_occurred_at := coalesce(new.updated_at, now());
        v_metadata := jsonb_strip_nulls(jsonb_build_object(
          'coach_tone', new.coach_tone,
          'character_id', new.character_id
        ));
      else
        return new;
      end if;
    else
      return new;
    end if;
  else
    return new;
  end if;

  insert into public.user_activity_logs (
    user_id, activity_type, source_type, source_id,
    label, metadata, occurred_at, retention_until
  )
  values (
    v_user_id, v_activity_type, v_source_type, v_source_id,
    v_label, v_metadata, v_occurred_at,
    v_occurred_at + interval '180 days'
  )
  on conflict (user_id, activity_type, source_type, source_id)
    where source_id is not null
  do update set
    label = excluded.label,
    metadata = excluded.metadata,
    occurred_at = excluded.occurred_at,
    retention_until = excluded.retention_until;

  return new;
end;
$$;


--
-- Name: enforce_combo_publication_ready(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.enforce_combo_publication_ready() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  if new.status <> 'published' then
    return new;
  end if;

  if new.verification_status <> 'verified' then
    raise exception 'published combo requires verification_status=verified';
  end if;

  if new.notation is null or btrim(new.notation) = '' then
    raise exception 'published combo requires exact notation';
  end if;

  if new.notation = 'Training verification required'
     or new.notation = '現行技表を基準にTrainingで正確な入力順を確定する。'
     or new.notation like '%（候補。正確な入力順・強度はトレモで確定）%'
     or new.notation ilike '%要トレモ確認%'
     or new.notation ilike '%正確な入力順%確定%' then
    raise exception 'placeholder combo notation cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1
       from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published combo must target the current patch';
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = new.character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    raise exception 'published combo requires a published playable character';
  end if;

  if not exists (
    select 1
    from public.entity_sources es
    where es.entity_type = 'combo'
      and es.entity_id = new.id
  ) then
    raise exception 'published combo requires Source evidence';
  end if;

  return new;
end;
$$;


--
-- Name: enforce_counter_publication_ready(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.enforce_counter_publication_ready() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  if new.status <> 'published' then
    return new;
  end if;

  if new.verification_status <> 'verified' then
    raise exception 'published counter requires verification_status=verified';
  end if;

  if new.title is null or btrim(new.title) = ''
     or new.method is null or btrim(new.method) = '' then
    raise exception 'published counter requires title and method';
  end if;

  if new.counter_type in ('matchup_plan', 'matchup_overview', 'matchup_baseline')
     or new.title ilike '%候補%'
     or new.method ilike '%実機検証して昇格%'
     or new.method ilike '%再現後に%昇格%' then
    raise exception 'generic matchup candidate cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published counter must target the current patch';
  end if;

  if new.defender_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.defender_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published counter defender must be a published playable character';
  end if;

  if new.opponent_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.opponent_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published counter opponent must be a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'counter'
      and es.entity_id = new.id
  ) then
    raise exception 'published counter requires Source evidence';
  end if;

  return new;
end;
$$;


--
-- Name: enforce_sequence_publication_ready(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.enforce_sequence_publication_ready() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  if new.status <> 'published' then
    return new;
  end if;

  if new.verification_status <> 'verified' then
    raise exception 'published sequence requires verification_status=verified';
  end if;

  if new.name is null or btrim(new.name) = ''
     or new.sequence_text is null or btrim(new.sequence_text) = '' then
    raise exception 'published sequence requires name and exact sequence';
  end if;

  if new.sequence_text = '現行技表を基準にTrainingで連携順・割り込み点を確定する。'
     or coalesce(new.notes, '') = '候補判断表。確定連携と読み合いを実機検証後に分離する。'
     or (
       new.mash_point = '未検証'
       and new.throw_point = '未検証'
       and new.shimmy_point = '未検証'
       and new.notes = 'Gap/確定性はTraining再現後に記録。'
     ) then
    raise exception 'generic Sequence verification placeholder cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published sequence must target the current patch';
  end if;

  if not exists (
    select 1 from public.characters c
    where c.id = new.character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    raise exception 'published sequence requires a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'sequence'
      and es.entity_id = new.id
  ) then
    raise exception 'published sequence requires Source evidence';
  end if;

  return new;
end;
$$;


--
-- Name: enforce_setup_publication_ready(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.enforce_setup_publication_ready() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  if new.status <> 'published' then
    return new;
  end if;

  if new.verification_status <> 'verified' then
    raise exception 'published setup requires verification_status=verified';
  end if;

  if new.name is null or btrim(new.name) = ''
     or new.sequence_text is null or btrim(new.sequence_text) = '' then
    raise exception 'published setup requires name and exact sequence';
  end if;

  if coalesce(new.starter_condition, '') = 'Training verification required'
     or new.sequence_text = 'Training verification required'
     or (
       new.starter_condition = '代表ダウン/端/ゲージ条件'
       and new.sequence_text = 'Trainingで打撃・投げ・シミー・遅らせを再現'
       and new.description = '現行技性能から起き攻め候補を検証する枠。'
     )
     or private.is_generic_setup_template(new.starter_condition, new.sequence_text, new.description) then
    raise exception 'generic Setup template cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published setup must target the current patch';
  end if;

  if not exists (
    select 1 from public.characters c
    where c.id = new.character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    raise exception 'published setup requires a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'setup'
      and es.entity_id = new.id
  ) then
    raise exception 'published setup requires Source evidence';
  end if;

  return new;
end;
$$;


--
-- Name: enforce_training_publication_ready(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.enforce_training_publication_ready() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  if new.status <> 'published' then
    return new;
  end if;

  if new.verification_status <> 'verified' then
    raise exception 'published training requires verification_status=verified';
  end if;

  if new.name is null or btrim(new.name) = ''
     or new.training_type is null or btrim(new.training_type) = ''
     or new.purpose is null or btrim(new.purpose) = ''
     or new.method is null or btrim(new.method) = ''
     or new.success_criteria is null or btrim(new.success_criteria) = '' then
    raise exception 'published training requires type, purpose, method and success criteria';
  end if;

  if new.duration_minutes is null or new.duration_minutes <= 0
     or new.recommended_reps is null or new.recommended_reps <= 0 then
    raise exception 'published training requires positive duration and repetitions';
  end if;

  if coalesce(btrim(new.recording_instructions), '') = ''
     and coalesce(btrim(new.playback_settings), '') = ''
     and coalesce(btrim(new.cpu_settings), '') = '' then
    raise exception 'published training requires reproducible Training Mode settings';
  end if;

  if coalesce(new.next_step, '') ilike '%Counter%昇格%'
     or coalesce(new.success_criteria, '') ilike '%training_verified候補%'
     or coalesce(new.method, '') ilike '%training_verified候補%' then
    raise exception 'internal verification work queue cannot be published as Training';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published training must target the current patch';
  end if;

  if new.player_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.player_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published training player must be a published playable character';
  end if;

  if new.dummy_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.dummy_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published training dummy must be a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'training'
      and es.entity_id = new.id
  ) then
    raise exception 'published training requires Source evidence';
  end if;

  return new;
end;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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


--
-- Name: is_admin(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;


--
-- Name: is_character_trait_score_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_character_trait_score_public_ready(target_score_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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


--
-- Name: is_combo_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_combo_public_ready(target_combo_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.combos co
    join public.characters c on c.id = co.character_id
    join public.patches p on p.id = co.valid_from_patch_id
    where co.id = target_combo_id
      and co.status = 'published'
      and co.verification_status = 'verified'
      and c.status = 'published'
      and c.is_playable = true
      and p.is_current = true
      and co.valid_to_patch_id is null
      and co.notation is not null
      and btrim(co.notation) <> ''
      and co.notation <> 'Training verification required'
      and co.notation <> '現行技表を基準にTrainingで正確な入力順を確定する。'
      and co.notation not like '%（候補。正確な入力順・強度はトレモで確定）%'
      and co.notation not ilike '%要トレモ確認%'
      and co.notation not ilike '%正確な入力順%確定%'
      and co.notes is distinct from 'candidate slot'
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'combo'
          and es.entity_id = co.id
      )
  );
$$;


--
-- Name: is_counter_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_counter_public_ready(target_counter_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.counters co
    join public.patches p on p.id = co.valid_from_patch_id
    where co.id = target_counter_id
      and co.status = 'published'
      and co.verification_status = 'verified'
      and p.is_current = true
      and co.valid_to_patch_id is null
      and co.title is not null
      and btrim(co.title) <> ''
      and co.method is not null
      and btrim(co.method) <> ''
      and co.counter_type not in ('matchup_plan', 'matchup_overview', 'matchup_baseline')
      and co.title not ilike '%候補%'
      and co.method not ilike '%実機検証して昇格%'
      and co.method not ilike '%再現後に%昇格%'
      and (
        co.defender_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = co.defender_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and (
        co.opponent_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = co.opponent_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'counter'
          and es.entity_id = co.id
      )
  );
$$;


--
-- Name: is_diagnosis_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_diagnosis_public_ready(target_diagnosis_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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


--
-- Name: is_generic_setup_template(text, text, text); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_generic_setup_template(p_starter_condition text, p_sequence_text text, p_description text) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    SET search_path TO 'pg_catalog'
    AS $$
  select
    (
      p_starter_condition = '端ダウン'
      and p_sequence_text = '打撃 / 投げ / シミー / DI'
      and p_description = '端での代表択。無敵/Dリバ/パリィへの分岐を記録。'
    )
    or (
      p_starter_condition = 'ダウン後'
      and p_sequence_text = '生DR → 後ろ歩き / 打撃 / 投げ'
      and p_description = '投げ抜けと4F暴れへの相互作用を確認。'
    )
    or (
      p_starter_condition = '相手バーンアウト'
      and p_sequence_text = '有利技 → 打撃 / 投げ / DI'
      and p_description = 'ガード硬直増加を考慮するが、真連携は実機確認前に断定しない。'
    )
    or (
      p_starter_condition = '基本必殺技締め'
      and p_sequence_text = '前進/DR → 打撃 / 投げ / シミー'
      and p_description = '締め技ごとの有利Fと受け身差を実機確認する。'
    )
    or (
      p_starter_condition = '固有リソースあり'
      and p_sequence_text = '固有リソース → 重ね / 接近 / 投げ'
      and p_description = '設置・ストック・メダル・風等のキャラ固有条件を分離。'
    )
    or (
      p_starter_condition = '大きなダウン有利'
      and p_sequence_text = 'フレーム消費 → 前ジャンプ攻撃'
      and p_description = '+42F等の具体値は再現できた場合のみ確定する。'
    );
$$;


--
-- Name: is_move_motion_media_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_move_motion_media_public_ready(target_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'private', 'pg_temp'
    AS $$
  select exists (
    select 1
    from public.move_motion_media mm
    where mm.id = target_id
      and mm.status = 'published'
      and nullif(btrim(mm.media_url), '') is not null
      and nullif(btrim(mm.source_url), '') is not null
      and nullif(btrim(mm.source_label), '') is not null
      and private.is_move_public_ready(mm.move_id)
  );
$$;


--
-- Name: is_move_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_move_public_ready(target_move_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select
    exists (
      select 1
      from public.move_commands mc
      join public.entity_sources es
        on es.entity_type = 'move_command'
       and es.entity_id = mc.id
      join public.sources s on s.id = es.source_id
      where mc.move_id = target_move_id
        and mc.control_scheme = 'classic'
        and s.reliability_level = 'official'
    )
    and exists (
      select 1
      from public.entity_sources es
      join public.sources s on s.id = es.source_id
      where es.entity_type = 'move'
        and es.entity_id = target_move_id
        and s.reliability_level = 'official'
    )
    and exists (
      select 1
      from public.move_frame_data f
      join public.patches p on p.id = f.valid_from_patch_id
      where f.move_id = target_move_id
        and f.verification_status = 'verified'
        and f.valid_to_patch_id is null
        and p.is_current = true
        and exists (
          select 1
          from public.entity_sources es
          join public.sources s on s.id = es.source_id
          where es.entity_id = f.id
            and es.entity_type in ('frame', 'move_frame_data')
            and s.reliability_level = 'official'
        )
    );
$$;


--
-- Name: is_phase23_device_preview(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_phase23_device_preview() RETURNS boolean
    LANGUAGE sql STABLE
    SET search_path TO 'pg_catalog', 'public'
    AS $$
  select
    current_timestamp <= timestamptz '2026-09-06 23:59:59+09'
    and md5(coalesce(current_setting('sf6dna.preview_token', true), '')) in (
      '48c9102d99b9dc573446cfd6ac847aec',
      '9f2e065005e5a1ebc6957b27a1f54285'
    );
$$;


--
-- Name: is_public_source_target(text, uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_public_source_target(target_entity_type text, target_entity_id uuid) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'private'
    AS $$
begin
  case target_entity_type

    when 'character' then
      return exists (
        select 1
        from public.characters c
        where c.id = target_entity_id
          and c.status = 'published'
          and c.is_playable = true
      );

    when 'character_trait_score' then
      return private.is_character_trait_score_public_ready(target_entity_id);

    when 'move' then
      return exists (
        select 1
        from public.moves m
        where m.id = target_entity_id
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      );

    when 'move_command' then
      return exists (
        select 1
        from public.move_commands mc
        join public.moves m on m.id = mc.move_id
        where mc.id = target_entity_id
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      );

    when 'frame' then
      return exists (
        select 1
        from public.move_frame_data mfd
        join public.moves m on m.id = mfd.move_id
        where mfd.id = target_entity_id
          and mfd.verification_status = 'verified'
          and mfd.valid_to_patch_id is null
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      );

    when 'move_frame_data' then
      return exists (
        select 1
        from public.move_frame_data mfd
        join public.moves m on m.id = mfd.move_id
        where mfd.id = target_entity_id
          and mfd.verification_status = 'verified'
          and mfd.valid_to_patch_id is null
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      );

    when 'combo' then
      return private.is_combo_public_ready(target_entity_id);

    when 'setup' then
      return private.is_setup_public_ready(target_entity_id);

    when 'sequence' then
      return private.is_sequence_public_ready(target_entity_id);

    when 'counter' then
      return private.is_counter_public_ready(target_entity_id);

    when 'training' then
      return private.is_training_public_ready(target_entity_id);

    when 'player' then
      return exists (
        select 1
        from public.players p
        where p.id = target_entity_id
          and p.status = 'published'
      );

    when 'video' then
      return exists (
        select 1
        from public.videos v
        where v.id = target_entity_id
          and v.status = 'published'
      );

    else
      -- Unknown polymorphic entity types are private by default.
      return false;
  end case;
end;
$$;


--
-- Name: is_sequence_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_sequence_public_ready(target_sequence_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.sequences sq
    join public.characters c on c.id = sq.character_id
    join public.patches p on p.id = sq.valid_from_patch_id
    where sq.id = target_sequence_id
      and sq.status = 'published'
      and sq.verification_status = 'verified'
      and c.status = 'published'
      and c.is_playable = true
      and p.is_current = true
      and sq.valid_to_patch_id is null
      and sq.name is not null
      and btrim(sq.name) <> ''
      and sq.sequence_text is not null
      and btrim(sq.sequence_text) <> ''
      and sq.sequence_text <> '現行技表を基準にTrainingで連携順・割り込み点を確定する。'
      and coalesce(sq.notes, '') <> '候補判断表。確定連携と読み合いを実機検証後に分離する。'
      and not (
        sq.mash_point = '未検証'
        and sq.throw_point = '未検証'
        and sq.shimmy_point = '未検証'
        and sq.notes = 'Gap/確定性はTraining再現後に記録。'
      )
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'sequence'
          and es.entity_id = sq.id
      )
  );
$$;


--
-- Name: is_setup_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_setup_public_ready(target_setup_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.setups se
    join public.characters c on c.id = se.character_id
    join public.patches p on p.id = se.valid_from_patch_id
    where se.id = target_setup_id
      and se.status = 'published'
      and se.verification_status = 'verified'
      and c.status = 'published'
      and c.is_playable = true
      and p.is_current = true
      and se.valid_to_patch_id is null
      and se.name is not null
      and btrim(se.name) <> ''
      and se.sequence_text is not null
      and btrim(se.sequence_text) <> ''
      and coalesce(se.starter_condition, '') <> 'Training verification required'
      and se.sequence_text <> 'Training verification required'
      and not (
        se.starter_condition = '代表ダウン/端/ゲージ条件'
        and se.sequence_text = 'Trainingで打撃・投げ・シミー・遅らせを再現'
        and se.description = '現行技性能から起き攻め候補を検証する枠。'
      )
      and not private.is_generic_setup_template(se.starter_condition, se.sequence_text, se.description)
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'setup'
          and es.entity_id = se.id
      )
  );
$$;


--
-- Name: is_training_public_ready(uuid); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_training_public_ready(target_training_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.trainings tr
    join public.patches p on p.id = tr.valid_from_patch_id
    where tr.id = target_training_id
      and tr.status = 'published'
      and tr.verification_status = 'verified'
      and p.is_current = true
      and tr.valid_to_patch_id is null
      and tr.name is not null and btrim(tr.name) <> ''
      and tr.training_type is not null and btrim(tr.training_type) <> ''
      and tr.purpose is not null and btrim(tr.purpose) <> ''
      and tr.method is not null and btrim(tr.method) <> ''
      and tr.success_criteria is not null and btrim(tr.success_criteria) <> ''
      and tr.duration_minutes is not null and tr.duration_minutes > 0
      and tr.recommended_reps is not null and tr.recommended_reps > 0
      and (
        coalesce(btrim(tr.recording_instructions), '') <> ''
        or coalesce(btrim(tr.playback_settings), '') <> ''
        or coalesce(btrim(tr.cpu_settings), '') <> ''
      )
      and coalesce(tr.next_step, '') not ilike '%Counter%昇格%'
      and coalesce(tr.success_criteria, '') not ilike '%training_verified候補%'
      and coalesce(tr.method, '') not ilike '%training_verified候補%'
      and (
        tr.player_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = tr.player_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and (
        tr.dummy_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = tr.dummy_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'training'
          and es.entity_id = tr.id
      )
  );
$$;


--
-- Name: purge_expired_contact_inbox(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.purge_expired_contact_inbox() RETURNS bigint
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_deleted bigint;
begin
  delete from public.contact_inbox
   where created_at < now() - interval '180 days';
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;


--
-- Name: snapshot_user_training_log(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.snapshot_user_training_log() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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


--
-- Name: validate_ai_coach_session_write(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_ai_coach_session_write() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is null then
    return new;
  end if;

  if new.user_id <> v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'An AI coach session can only be written for the authenticated user.';
  end if;

  if new.character_id is not null and not exists (
    select 1
    from public.characters c
    where c.id = new.character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected character is not available.';
  end if;

  if new.diagnosis_result_id is not null and not exists (
    select 1
    from public.diagnosis_results r
    where r.id = new.diagnosis_result_id
      and r.user_id = v_auth_user_id
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected diagnosis result is not available.';
  end if;

  if tg_op = 'INSERT' then
    if new.status <> 'active' then
      raise exception using
        errcode = '22023',
        message = 'A new AI coach session must be active.';
    end if;

    if new.summary is not null then
      raise exception using
        errcode = '42501',
        message = 'A summary can only be saved when a session is archived.';
    end if;
  else
    if new.user_id is distinct from old.user_id
       or new.created_at is distinct from old.created_at then
      raise exception using
        errcode = '42501',
        message = 'AI coach session ownership and creation time are immutable.';
    end if;

    if new.summary is distinct from old.summary
       and not (old.status = 'active' and new.status = 'archived') then
      raise exception using
        errcode = '42501',
        message = 'A summary can only be saved when a session is archived.';
    end if;

    if old.status = 'archived' and new.status <> 'archived' then
      raise exception using
        errcode = '22023',
        message = 'An archived AI coach session cannot be reactivated.';
    end if;
  end if;

  return new;
end;
$$;


--
-- Name: validate_ai_coach_user_message_write(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_ai_coach_user_message_write() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is null then
    return new;
  end if;

  if new.user_id <> v_auth_user_id or new.role <> 'user' then
    raise exception using
      errcode = '42501',
      message = 'Only the authenticated user message can be written.';
  end if;

  if not exists (
    select 1
    from public.ai_coach_sessions s
    where s.id = new.session_id
      and s.user_id = v_auth_user_id
      and s.status = 'active'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected AI coach session is not active.';
  end if;

  if new.grounding_refs <> '[]'::jsonb then
    raise exception using
      errcode = '42501',
      message = 'Grounding references can only be written by the server.';
  end if;

  if tg_op = 'UPDATE' then
    if new.user_id is distinct from old.user_id
       or new.session_id is distinct from old.session_id
       or new.role is distinct from old.role
       or new.created_at is distinct from old.created_at then
      raise exception using
        errcode = '42501',
        message = 'AI coach message ownership and identity fields are immutable.';
    end if;

    if new.content is distinct from old.content and exists (
      select 1
      from public.ai_coach_generations g
      where g.user_message_id = old.id
    ) then
      raise exception using
        errcode = '55000',
        message = 'A message cannot be edited after generation has started.';
    end if;
  end if;

  return new;
end;
$$;


--
-- Name: validate_diagnosis_result_completeness(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_diagnosis_result_completeness() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_result_id uuid;
  v_diagnosis_id uuid;
  v_expected_count integer;
  v_actual_count integer;
begin
  if tg_table_name = 'diagnosis_results' then
    v_result_id := case when tg_op = 'DELETE' then old.id else new.id end;
  else
    v_result_id := case
      when tg_op = 'DELETE' then old.diagnosis_result_id
      else new.diagnosis_result_id
    end;
  end if;

  select r.diagnosis_id
  into v_diagnosis_id
  from public.diagnosis_results r
  where r.id = v_result_id;

  if not found then
    return coalesce(new, old);
  end if;

  select count(*)
  into v_expected_count
  from public.diagnosis_questions q
  where q.diagnosis_id = v_diagnosis_id
    and q.status = 'published';

  select count(*)
  into v_actual_count
  from public.diagnosis_answers a
  where a.diagnosis_result_id = v_result_id
    and a.diagnosis_id = v_diagnosis_id;

  if v_expected_count = 0 or v_actual_count <> v_expected_count then
    raise exception using
      errcode = '23514',
      message = format(
        'Diagnosis result %s must contain exactly %s answers; found %s.',
        v_result_id,
        v_expected_count,
        v_actual_count
      );
  end if;

  return coalesce(new, old);
end;
$$;


--
-- Name: validate_diagnosis_result_write(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_diagnosis_result_write() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is null then
    return new;
  end if;

  if new.user_id <> v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A diagnosis result can only be written for the authenticated user.';
  end if;

  if not exists (
    select 1
    from public.diagnoses d
    where d.id = new.diagnosis_id
      and d.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected diagnosis is not available.';
  end if;

  if tg_op = 'UPDATE' and (
    new.user_id is distinct from old.user_id
    or new.diagnosis_id is distinct from old.diagnosis_id
    or new.result_payload is distinct from old.result_payload
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using
      errcode = '55000',
      message = 'A completed diagnosis result is immutable.';
  end if;

  return new;
end;
$$;


--
-- Name: validate_favorite_write(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_favorite_write() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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


--
-- Name: validate_profile_write(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_profile_write() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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


--
-- Name: validate_quick_help_answer_write(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_quick_help_answer_write() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_auth_user_id uuid := (select auth.uid());
  v_intake_user_id uuid;
  v_flow_id uuid;
  v_current_node_id uuid;
  v_intake_status text;
  v_context jsonb;
  v_input_type text;
  v_answer_key text;
  v_next_node_id uuid;
  v_payload jsonb;
  v_reference_id uuid;
begin
  if tg_op <> 'INSERT' then
    raise exception using
      errcode = '42501',
      message = 'Quick-help answers are immutable.';
  end if;

  select
    i.user_id,
    i.flow_id,
    i.current_node_id,
    i.status,
    i.context,
    n.input_type,
    n.answer_key
  into
    v_intake_user_id,
    v_flow_id,
    v_current_node_id,
    v_intake_status,
    v_context,
    v_input_type,
    v_answer_key
  from public.coach_quick_help_intakes i
  join public.coach_quick_help_nodes n
    on n.id = i.current_node_id
   and n.flow_id = i.flow_id
   and n.node_type = 'question'
  where i.id = new.intake_id
  for update of i;

  if not found
     or v_intake_status <> 'active'
     or new.node_id is distinct from v_current_node_id then
    raise exception using
      errcode = '22023',
      message = 'The answer must belong to the active current quick-help question.';
  end if;

  if new.user_id is distinct from v_intake_user_id then
    raise exception using
      errcode = '42501',
      message = 'The answer user does not match the quick-help intake owner.';
  end if;

  if v_auth_user_id is not null and new.user_id is distinct from v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A quick-help answer can only be written for the authenticated user.';
  end if;

  if v_answer_key is null then
    raise exception using
      errcode = '22023',
      message = 'The current quick-help step does not accept an answer.';
  end if;

  if v_input_type = 'static' then
    if new.option_id is null
       or new.selected_character_id is not null
       or new.selected_move_id is not null
       or new.free_text is not null then
      raise exception using
        errcode = '22023',
        message = 'Select exactly one option for this quick-help question.';
    end if;

    select
      o.id,
      o.next_node_id,
      jsonb_build_object(
        'value', o.option_value,
        'label', o.label,
        'metadata', o.metadata
      )
    into
      v_reference_id,
      v_next_node_id,
      v_payload
    from public.coach_quick_help_options o
    where o.id = new.option_id
      and o.node_id = v_current_node_id;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The selected option does not belong to the current quick-help question.';
    end if;

  elsif v_input_type = 'character' then
    if new.selected_character_id is null
       or new.option_id is not null
       or new.selected_move_id is not null
       or new.free_text is not null then
      raise exception using
        errcode = '22023',
        message = 'Select exactly one character for this quick-help question.';
    end if;

    select
      c.id,
      jsonb_build_object(
        'value', c.id,
        'label', c.name_ja,
        'slug', c.slug
      )
    into
      v_reference_id,
      v_payload
    from public.characters c
    where c.id = new.selected_character_id
      and c.status = 'published'
      and c.is_playable = true;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The selected character is not available.';
    end if;

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_current_node_id;

  elsif v_input_type = 'move' then
    if new.selected_move_id is null
       or new.option_id is not null
       or new.selected_character_id is not null
       or new.free_text is not null then
      raise exception using
        errcode = '22023',
        message = 'Select exactly one move for this quick-help question.';
    end if;

    select
      m.id,
      jsonb_build_object(
        'value', m.id,
        'label', m.name_ja,
        'slug', m.slug,
        'move_type', m.move_type,
        'strength_variant', m.strength_variant
      )
    into
      v_reference_id,
      v_payload
    from public.moves m
    where m.id = new.selected_move_id
      and m.status = 'published'
      and m.character_id::text = v_context #>> '{opponent_character_id,value}';

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The selected move does not belong to the selected character.';
    end if;

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_current_node_id;

  elsif v_input_type = 'free_text' then
    new.free_text := nullif(btrim(new.free_text), '');

    if new.free_text is null
       or char_length(new.free_text) > 2000
       or new.option_id is not null
       or new.selected_character_id is not null
       or new.selected_move_id is not null then
      raise exception using
        errcode = '22023',
        message = 'Enter one quick-help question in 1 to 2000 characters.';
    end if;

    v_payload := jsonb_build_object(
      'value', new.free_text,
      'label', new.free_text
    );

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_current_node_id;

  else
    raise exception using
      errcode = '22023',
      message = 'The current quick-help step cannot be answered.';
  end if;

  if v_next_node_id is null
     or not exists (
       select 1
       from public.coach_quick_help_nodes next_node
       where next_node.id = v_next_node_id
         and next_node.flow_id = v_flow_id
     ) then
    raise exception using
      errcode = '22023',
      message = 'The next quick-help step is not valid for this flow.';
  end if;

  new.answer_payload := v_payload;

  if v_auth_user_id is not null then
    new.created_at := now();
  end if;

  return new;
end;
$$;


--
-- Name: validate_quick_help_intake_write(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_quick_help_intake_write() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_auth_user_id uuid := (select auth.uid());
  v_flow_status text;
  v_root_node_id uuid;
  v_node_type text;
  v_input_type text;
  v_answer_key text;
  v_answer_payload jsonb;
  v_option_id uuid;
  v_next_node_id uuid;
  v_next_node_type text;
  v_expected_context jsonb;
  v_expected_topic_key text;
  v_expected_status text;
  v_ai_session_status text;
begin
  if v_auth_user_id is not null and new.user_id is distinct from v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A quick-help intake can only be written for the authenticated user.';
  end if;

  if tg_op = 'INSERT' then
    select f.status, f.root_node_id, n.node_type
    into v_flow_status, v_root_node_id, v_node_type
    from public.coach_quick_help_flows f
    join public.coach_quick_help_nodes n
      on n.id = f.root_node_id
     and n.flow_id = f.id
    where f.id = new.flow_id;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The selected quick-help flow has no valid root step.';
    end if;

    if v_auth_user_id is not null
       and not private.is_admin()
       and v_flow_status <> 'published' then
      raise exception using
        errcode = '22023',
        message = 'The selected quick-help flow is not available.';
    end if;

    if new.current_node_id is distinct from v_root_node_id
       or v_node_type <> 'question'
       or new.status <> 'active'
       or new.context <> '{}'::jsonb
       or new.topic_key is not null
       or new.ai_coach_session_id is not null
       or new.completed_at is not null then
      raise exception using
        errcode = '22023',
        message = 'A quick-help intake must start at the root question with empty context.';
    end if;

    if v_auth_user_id is not null then
      new.started_at := now();
    end if;

    return new;
  end if;

  if new.user_id is distinct from old.user_id
     or new.flow_id is distinct from old.flow_id
     or new.started_at is distinct from old.started_at then
    raise exception using
      errcode = '42501',
      message = 'Quick-help intake ownership, flow, and start time are immutable.';
  end if;

  select n.node_type
  into v_node_type
  from public.coach_quick_help_nodes n
  where n.id = new.current_node_id
    and n.flow_id = new.flow_id;

  if not found then
    raise exception using
      errcode = '22023',
      message = 'The current quick-help step does not belong to the selected flow.';
  end if;

  if new.ai_coach_session_id is not null then
    select s.status
    into v_ai_session_status
    from public.ai_coach_sessions s
    where s.id = new.ai_coach_session_id
      and s.user_id = new.user_id;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The linked AI coach session does not belong to this user.';
    end if;
  end if;

  if old.status = 'linked'
     and old.ai_coach_session_id is not null
     and new.ai_coach_session_id is null then
    if new.current_node_id is distinct from old.current_node_id
       or new.context is distinct from old.context
       or new.topic_key is distinct from old.topic_key
       or new.completed_at is distinct from old.completed_at
       or new.status not in ('linked', 'ready') then
      raise exception using
        errcode = '22023',
        message = 'Removing an AI coach link cannot rewrite the quick-help result.';
    end if;

    new.status := 'ready';
    return new;
  end if;

  if new.status = 'abandoned' then
    if old.status not in ('active', 'ready', 'linked')
       or new.current_node_id is distinct from old.current_node_id
       or new.context is distinct from old.context
       or new.topic_key is distinct from old.topic_key
       or new.ai_coach_session_id is distinct from old.ai_coach_session_id then
      raise exception using
        errcode = '22023',
        message = 'Abandoning quick help cannot rewrite its answers or links.';
    end if;

    new.completed_at := coalesce(old.completed_at, now());
    return new;
  end if;

  if old.status = 'active' then
    if new.ai_coach_session_id is distinct from old.ai_coach_session_id then
      raise exception using
        errcode = '22023',
        message = 'An active quick-help intake cannot link an AI coach session.';
    end if;

    select
      n.input_type,
      n.answer_key,
      a.answer_payload,
      a.option_id,
      case
        when n.input_type = 'static' then o.next_node_id
        else n.default_next_node_id
      end
    into
      v_input_type,
      v_answer_key,
      v_answer_payload,
      v_option_id,
      v_next_node_id
    from public.coach_quick_help_nodes n
    join public.coach_quick_help_answers a
      on a.intake_id = new.id
     and a.node_id = n.id
     and a.user_id = new.user_id
    left join public.coach_quick_help_options o
      on o.id = a.option_id
     and o.node_id = n.id
    where n.id = old.current_node_id
      and n.flow_id = old.flow_id;

    if not found
       or v_answer_key is null
       or v_next_node_id is null then
      raise exception using
        errcode = '22023',
        message = 'Answer the current quick-help question before advancing.';
    end if;

    select n.node_type
    into v_next_node_type
    from public.coach_quick_help_nodes n
    where n.id = v_next_node_id
      and n.flow_id = old.flow_id;

    if not found then
      raise exception using
        errcode = '22023',
        message = 'The next quick-help step does not belong to the selected flow.';
    end if;

    v_expected_context := jsonb_set(
      coalesce(old.context, '{}'::jsonb),
      array[v_answer_key],
      v_answer_payload,
      true
    );

    v_expected_topic_key := case
      when v_answer_key = 'topic_key'
        then v_answer_payload ->> 'value'
      else old.topic_key
    end;

    v_expected_status := case
      when v_next_node_type = 'handoff' then 'ready'
      else 'active'
    end;

    if new.current_node_id is distinct from v_next_node_id
       or new.context is distinct from v_expected_context
       or new.topic_key is distinct from v_expected_topic_key
       or new.status is distinct from v_expected_status then
      raise exception using
        errcode = '22023',
        message = 'The quick-help intake can only follow the configured answer branch.';
    end if;

    new.completed_at := case
      when v_expected_status = 'ready' then now()
      else null
    end;

    return new;
  end if;

  if old.status = 'ready' then
    if new.status <> 'linked'
       or old.ai_coach_session_id is not null
       or new.ai_coach_session_id is null
       or v_ai_session_status <> 'active'
       or new.current_node_id is distinct from old.current_node_id
       or new.context is distinct from old.context
       or new.topic_key is distinct from old.topic_key
       or new.completed_at is distinct from old.completed_at
       or v_node_type <> 'handoff' then
      raise exception using
        errcode = '22023',
        message = 'A ready quick-help intake may only link an active owned AI coach session.';
    end if;

    return new;
  end if;

  raise exception using
    errcode = '22023',
    message = 'The requested quick-help state transition is not allowed.';
end;
$$;


--
-- Name: validate_user_game_profile_write(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_user_game_profile_write() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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


--
-- Name: validate_user_match_log(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_user_match_log() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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


--
-- Name: validate_user_training_log_plan(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_user_training_log_plan() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_auth_user_id uuid := (select auth.uid());
  v_plan_training_id uuid;
begin
  if v_auth_user_id is not null and new.user_id <> v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A training log can only be written for the authenticated user.';
  end if;

  if tg_op = 'UPDATE' and (
    new.user_id is distinct from old.user_id
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using
      errcode = '42501',
      message = 'Training log ownership and creation time are immutable.';
  end if;

  if new.training_plan_id is null then
    return new;
  end if;

  select p.training_id
  into v_plan_training_id
  from public.user_training_plans p
  where p.id = new.training_plan_id
    and p.user_id = new.user_id;

  if not found then
    raise exception using
      errcode = '22023',
      message = 'The selected training plan does not belong to this user.';
  end if;

  if new.training_id is distinct from v_plan_training_id then
    raise exception using
      errcode = '22023',
      message = 'The training does not match the selected plan.';
  end if;

  return new;
end;
$$;


--
-- Name: validate_user_training_plan(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.validate_user_training_plan() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_auth_user_id uuid := (select auth.uid());
begin
  if v_auth_user_id is not null and new.user_id <> v_auth_user_id then
    raise exception using
      errcode = '42501',
      message = 'A training plan can only be written for the authenticated user.';
  end if;

  if tg_op = 'UPDATE' and (
    new.user_id is distinct from old.user_id
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using
      errcode = '42501',
      message = 'Training plan ownership and creation time are immutable.';
  end if;

  if tg_op = 'INSERT'
     or new.training_id is distinct from old.training_id then
    if not private.is_training_public_ready(new.training_id) then
      raise exception using
        errcode = '22023',
        message = 'The selected training is not publicly available.';
    end if;
  end if;

  case new.source_type
    when 'diagnosis' then
      if not exists (
        select 1
        from public.diagnosis_results r
        where r.id = new.source_diagnosis_result_id
          and r.user_id = new.user_id
      ) then
        raise exception using
          errcode = '22023',
          message = 'The diagnosis result does not belong to this user.';
      end if;

    when 'match_log' then
      if not exists (
        select 1
        from public.user_match_logs m
        where m.id = new.source_match_log_id
          and m.user_id = new.user_id
      ) then
        raise exception using
          errcode = '22023',
          message = 'The match log does not belong to this user.';
      end if;

    when 'ai_coach' then
      if not exists (
        select 1
        from public.ai_coach_sessions s
        where s.id = new.source_coach_session_id
          and s.user_id = new.user_id
      ) then
        raise exception using
          errcode = '22023',
          message = 'The AI coach session does not belong to this user.';
      end if;

    when 'manual' then
      null;

    else
      raise exception using
        errcode = '22023',
        message = 'The training-plan source is invalid.';
  end case;

  return new;
end;
$$;


--
-- Name: answer_quick_help_intake(uuid, uuid, uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.answer_quick_help_intake(p_intake_id uuid, p_option_id uuid DEFAULT NULL::uuid, p_character_id uuid DEFAULT NULL::uuid, p_move_id uuid DEFAULT NULL::uuid, p_free_text text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := (select auth.uid());
  v_flow_id uuid;
  v_flow_slug text;
  v_node_id uuid;
  v_node_key text;
  v_input_type text;
  v_answer_key text;
  v_context jsonb;
  v_topic_key text;
  v_next_node_id uuid;
  v_next_node_key text;
  v_next_node_type text;
  v_answer_payload jsonb;
  v_selected_option_id uuid;
  v_selected_character_id uuid;
  v_selected_move_id uuid;
  v_free_text text;
  v_nonnull_count integer;
  v_new_status text;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  v_nonnull_count :=
    (p_option_id is not null)::integer
    + (p_character_id is not null)::integer
    + (p_move_id is not null)::integer
    + (nullif(btrim(p_free_text), '') is not null)::integer;

  if v_nonnull_count <> 1 then
    raise exception using
      errcode = '22023',
      message = 'Provide exactly one answer.';
  end if;

  select
    i.flow_id,
    f.slug,
    i.current_node_id,
    n.node_key,
    n.input_type,
    n.answer_key,
    i.context,
    i.topic_key
  into
    v_flow_id,
    v_flow_slug,
    v_node_id,
    v_node_key,
    v_input_type,
    v_answer_key,
    v_context,
    v_topic_key
  from public.coach_quick_help_intakes i
  join public.coach_quick_help_flows f on f.id = i.flow_id
  join public.coach_quick_help_nodes n on n.id = i.current_node_id
  where i.id = p_intake_id
    and i.user_id = v_user_id
    and i.status = 'active'
  for update of i;

  if v_node_id is null then
    raise exception using
      errcode = '22023',
      message = 'The selected quick-help intake is not active.';
  end if;

  if v_answer_key is null then
    raise exception using
      errcode = '22023',
      message = 'The current step does not accept an answer.';
  end if;

  if v_input_type = 'static' then
    if p_option_id is null then
      raise exception using
        errcode = '22023',
        message = 'Select one of the available options.';
    end if;

    select
      o.id,
      o.next_node_id,
      jsonb_build_object(
        'value', o.option_value,
        'label', o.label,
        'metadata', o.metadata
      )
    into
      v_selected_option_id,
      v_next_node_id,
      v_answer_payload
    from public.coach_quick_help_options o
    where o.id = p_option_id
      and o.node_id = v_node_id;

    if v_selected_option_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected option does not belong to the current question.';
    end if;

  elsif v_input_type = 'character' then
    if p_character_id is null then
      raise exception using
        errcode = '22023',
        message = 'Select a character.';
    end if;

    select
      c.id,
      jsonb_build_object(
        'value', c.id,
        'label', c.name_ja,
        'slug', c.slug
      )
    into
      v_selected_character_id,
      v_answer_payload
    from public.characters c
    where c.id = p_character_id
      and c.status = 'published'
      and c.is_playable = true;

    if v_selected_character_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected character is not available.';
    end if;

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_node_id;

  elsif v_input_type = 'move' then
    if p_move_id is null then
      raise exception using
        errcode = '22023',
        message = 'Select a move.';
    end if;

    select
      m.id,
      jsonb_build_object(
        'value', m.id,
        'label', m.name_ja,
        'slug', m.slug,
        'move_type', m.move_type,
        'strength_variant', m.strength_variant
      )
    into
      v_selected_move_id,
      v_answer_payload
    from public.moves m
    where m.id = p_move_id
      and m.status = 'published'
      and m.character_id::text = v_context #>> '{opponent_character_id,value}';

    if v_selected_move_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected move does not belong to the selected character.';
    end if;

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_node_id;

  elsif v_input_type = 'free_text' then
    v_free_text := nullif(btrim(p_free_text), '');

    if v_free_text is null or char_length(v_free_text) > 2000 then
      raise exception using
        errcode = '22023',
        message = 'Enter the problem in 1 to 2000 characters.';
    end if;

    v_answer_payload := jsonb_build_object(
      'value', v_free_text,
      'label', v_free_text
    );

    select n.default_next_node_id
    into v_next_node_id
    from public.coach_quick_help_nodes n
    where n.id = v_node_id;

  else
    raise exception using
      errcode = '22023',
      message = 'The current step cannot be answered.';
  end if;

  if v_next_node_id is null then
    raise exception using
      errcode = '22023',
      message = 'The next quick-help step is not configured.';
  end if;

  v_context := jsonb_set(
    coalesce(v_context, '{}'::jsonb),
    array[v_answer_key],
    v_answer_payload,
    true
  );

  if v_answer_key = 'topic_key' then
    v_topic_key := v_answer_payload ->> 'value';
  end if;

  insert into public.coach_quick_help_answers (
    intake_id,
    user_id,
    node_id,
    option_id,
    selected_character_id,
    selected_move_id,
    free_text,
    answer_payload
  )
  values (
    p_intake_id,
    v_user_id,
    v_node_id,
    v_selected_option_id,
    v_selected_character_id,
    v_selected_move_id,
    v_free_text,
    v_answer_payload
  );

  select n.node_key, n.node_type
  into v_next_node_key, v_next_node_type
  from public.coach_quick_help_nodes n
  where n.id = v_next_node_id
    and n.flow_id = v_flow_id;

  if v_next_node_key is null then
    raise exception using
      errcode = '22023',
      message = 'The next quick-help step is invalid.';
  end if;

  v_new_status := case
    when v_next_node_type = 'handoff' then 'ready'
    else 'active'
  end;

  update public.coach_quick_help_intakes
  set
    current_node_id = v_next_node_id,
    topic_key = v_topic_key,
    context = v_context,
    status = v_new_status,
    completed_at = case
      when v_new_status = 'ready' then now()
      else null
    end
  where id = p_intake_id
    and user_id = v_user_id;

  return jsonb_build_object(
    'intake_id', p_intake_id,
    'status', v_new_status,
    'topic_key', v_topic_key,
    'context', v_context,
    'step', public.get_quick_help_node(v_flow_slug, v_next_node_key, v_context)
  );
end;
$$;


--
-- Name: FUNCTION answer_quick_help_intake(p_intake_id uuid, p_option_id uuid, p_character_id uuid, p_move_id uuid, p_free_text text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.answer_quick_help_intake(p_intake_id uuid, p_option_id uuid, p_character_id uuid, p_move_id uuid, p_free_text text) IS 'Validates one answer, stores it, updates structured context, and resolves the next branch atomically.';


--
-- Name: append_ai_coach_user_message(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.append_ai_coach_user_message(p_session_id uuid, p_content text) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := (select auth.uid());
  v_content text := nullif(btrim(p_content), '');
  v_message_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if v_content is null then
    raise exception using
      errcode = '22023',
      message = 'A message is required.';
  end if;

  if char_length(v_content) > 20000 then
    raise exception using
      errcode = '22023',
      message = 'The message is too long.';
  end if;

  if not exists (
    select 1
    from public.ai_coach_sessions s
    where s.id = p_session_id
      and s.user_id = v_user_id
      and s.status = 'active'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected AI coach session is not active.';
  end if;

  insert into public.ai_coach_messages (
    session_id,
    user_id,
    role,
    content,
    grounding_refs
  )
  values (
    p_session_id,
    v_user_id,
    'user',
    v_content,
    '[]'::jsonb
  )
  returning id into v_message_id;

  update public.ai_coach_sessions
  set updated_at = now()
  where id = p_session_id
    and user_id = v_user_id;

  return v_message_id;
end;
$$;


--
-- Name: FUNCTION append_ai_coach_user_message(p_session_id uuid, p_content text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.append_ai_coach_user_message(p_session_id uuid, p_content text) IS 'Appends a user-authored message to an owned active AI coach session. Assistant messages remain server-only.';


--
-- Name: archive_ai_coach_session(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.archive_ai_coach_session(p_session_id uuid, p_summary text DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := (select auth.uid());
  v_updated integer;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if p_summary is not null and char_length(btrim(p_summary)) > 4000 then
    raise exception using
      errcode = '22023',
      message = 'The summary is too long.';
  end if;

  update public.ai_coach_sessions
  set
    status = 'archived',
    summary = coalesce(nullif(btrim(p_summary), ''), summary),
    updated_at = now()
  where id = p_session_id
    and user_id = v_user_id
    and status = 'active';

  get diagnostics v_updated = row_count;
  return v_updated = 1;
end;
$$;


--
-- Name: FUNCTION archive_ai_coach_session(p_session_id uuid, p_summary text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.archive_ai_coach_session(p_session_id uuid, p_summary text) IS 'Archives an owned AI coach session and optionally stores a summary.';


--
-- Name: begin_ai_coach_generation(uuid, uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.begin_ai_coach_generation(p_session_id uuid, p_user_message_id uuid, p_model text, p_prompt_hash text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid;
  v_generation_id uuid;
begin
  if nullif(btrim(p_model), '') is null then
    raise exception using
      errcode = '22023',
      message = 'A model name is required.';
  end if;

  select s.user_id
  into v_user_id
  from public.ai_coach_sessions s
  where s.id = p_session_id
    and s.status = 'active';

  if v_user_id is null then
    raise exception using
      errcode = '22023',
      message = 'The selected AI coach session is not active.';
  end if;

  if not exists (
    select 1
    from public.ai_coach_messages m
    where m.id = p_user_message_id
      and m.session_id = p_session_id
      and m.user_id = v_user_id
      and m.role = 'user'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected user message is not available.';
  end if;

  insert into public.ai_coach_generations (
    session_id,
    user_id,
    user_message_id,
    model,
    status,
    prompt_hash,
    started_at
  )
  values (
    p_session_id,
    v_user_id,
    p_user_message_id,
    btrim(p_model),
    'pending',
    nullif(btrim(p_prompt_hash), ''),
    now()
  )
  returning id into v_generation_id;

  return v_generation_id;
end;
$$;


--
-- Name: FUNCTION begin_ai_coach_generation(p_session_id uuid, p_user_message_id uuid, p_model text, p_prompt_hash text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.begin_ai_coach_generation(p_session_id uuid, p_user_message_id uuid, p_model text, p_prompt_hash text) IS 'Service-only start of an AI coach generation linked to an owned user message.';


--
-- Name: complete_ai_coach_generation(uuid, text, jsonb, integer, integer, numeric, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.complete_ai_coach_generation(p_generation_id uuid, p_content text, p_grounding_refs jsonb DEFAULT '[]'::jsonb, p_input_tokens integer DEFAULT NULL::integer, p_output_tokens integer DEFAULT NULL::integer, p_estimated_cost_usd numeric DEFAULT NULL::numeric, p_latency_ms integer DEFAULT NULL::integer) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_session_id uuid;
  v_user_id uuid;
  v_status text;
  v_existing_assistant_message_id uuid;
  v_content text := nullif(btrim(p_content), '');
  v_assistant_message_id uuid;
  v_total_tokens integer;
  v_updated integer;
begin
  if v_content is null then
    raise exception using
      errcode = '22023',
      message = 'An assistant response is required.';
  end if;

  if char_length(v_content) > 20000 then
    raise exception using
      errcode = '22023',
      message = 'The assistant response is too long.';
  end if;

  if coalesce(jsonb_typeof(p_grounding_refs), 'null') <> 'array' then
    raise exception using
      errcode = '22023',
      message = 'Grounding references must be a JSON array.';
  end if;

  select
    g.session_id,
    g.user_id,
    g.status,
    g.assistant_message_id
  into
    v_session_id,
    v_user_id,
    v_status,
    v_existing_assistant_message_id
  from public.ai_coach_generations g
  where g.id = p_generation_id
  for update;

  if not found then
    raise exception using
      errcode = '22023',
      message = 'The selected generation is not available.';
  end if;

  if v_status = 'complete' then
    if v_existing_assistant_message_id is null then
      raise exception using
        errcode = '55000',
        message = 'The completed generation has no assistant message.';
    end if;
    return v_existing_assistant_message_id;
  end if;

  if v_status = 'error' then
    raise exception using
      errcode = '22023',
      message = 'The selected generation has already failed.';
  end if;

  if v_status not in ('pending', 'streaming') then
    raise exception using
      errcode = '22023',
      message = 'The selected generation is not pending.';
  end if;

  insert into public.ai_coach_messages (
    session_id,
    user_id,
    role,
    content,
    grounding_refs
  )
  values (
    v_session_id,
    v_user_id,
    'assistant',
    v_content,
    coalesce(p_grounding_refs, '[]'::jsonb)
  )
  returning id into v_assistant_message_id;

  v_total_tokens := case
    when p_input_tokens is null and p_output_tokens is null then null
    else coalesce(p_input_tokens, 0) + coalesce(p_output_tokens, 0)
  end;

  update public.ai_coach_generations
  set
    assistant_message_id = v_assistant_message_id,
    status = 'complete',
    input_tokens = p_input_tokens,
    output_tokens = p_output_tokens,
    total_tokens = v_total_tokens,
    estimated_cost_usd = p_estimated_cost_usd,
    latency_ms = p_latency_ms,
    error_code = null,
    error_message = null,
    completed_at = now()
  where id = p_generation_id
    and status in ('pending', 'streaming');

  get diagnostics v_updated = row_count;

  if v_updated <> 1 then
    raise exception using
      errcode = '40001',
      message = 'The generation state changed before completion.';
  end if;

  update public.ai_coach_sessions
  set updated_at = now()
  where id = v_session_id;

  return v_assistant_message_id;
end;
$$;


--
-- Name: FUNCTION complete_ai_coach_generation(p_generation_id uuid, p_content text, p_grounding_refs jsonb, p_input_tokens integer, p_output_tokens integer, p_estimated_cost_usd numeric, p_latency_ms integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.complete_ai_coach_generation(p_generation_id uuid, p_content text, p_grounding_refs jsonb, p_input_tokens integer, p_output_tokens integer, p_estimated_cost_usd numeric, p_latency_ms integer) IS 'Service-only atomic save of an AI coach answer and generation metrics.';


--
-- Name: fail_ai_coach_generation(uuid, text, text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fail_ai_coach_generation(p_generation_id uuid, p_error_code text, p_error_message text DEFAULT NULL::text, p_latency_ms integer DEFAULT NULL::integer) RETURNS boolean
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_status text;
  v_updated integer;
begin
  select g.status
  into v_status
  from public.ai_coach_generations g
  where g.id = p_generation_id
  for update;

  if not found then
    return false;
  end if;

  if v_status = 'error' then
    return true;
  end if;

  if v_status = 'complete' then
    return false;
  end if;

  if v_status not in ('pending', 'streaming') then
    return false;
  end if;

  update public.ai_coach_generations
  set
    status = 'error',
    error_code = left(coalesce(nullif(btrim(p_error_code), ''), 'generation_error'), 120),
    error_message = left(nullif(btrim(p_error_message), ''), 2000),
    latency_ms = p_latency_ms,
    completed_at = now()
  where id = p_generation_id
    and status in ('pending', 'streaming');

  get diagnostics v_updated = row_count;
  return v_updated = 1;
end;
$$;


--
-- Name: FUNCTION fail_ai_coach_generation(p_generation_id uuid, p_error_code text, p_error_message text, p_latency_ms integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.fail_ai_coach_generation(p_generation_id uuid, p_error_code text, p_error_message text, p_latency_ms integer) IS 'Service-only terminal error record for a pending AI coach generation.';


--
-- Name: get_activity_summary(text, integer, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_activity_summary(p_period text DEFAULT 'week'::text, p_periods integer DEFAULT 8, p_timezone text DEFAULT 'Asia/Tokyo'::text) RETURNS TABLE(period_start date, period_end date, activity_total bigint, matches_logged bigint, match_wins bigint, trainings_completed bigint, training_minutes bigint, quick_help_completed bigint, ai_coach_sessions bigint, diagnoses_completed bigint)
    LANGUAGE plpgsql STABLE
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := auth.uid();
  v_period text := lower(coalesce(p_period, 'week'));
  v_periods integer := greatest(1, least(coalesce(p_periods, 8), 24));
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if v_period not in ('week', 'month') then
    raise exception 'period must be week or month' using errcode = '22023';
  end if;

  if p_timezone is null or not exists (
    select 1 from pg_catalog.pg_timezone_names where name = p_timezone
  ) then
    raise exception 'invalid timezone' using errcode = '22023';
  end if;

  return query
  with period_offsets as (
    select generate_series(0, v_periods - 1) as offset_no
  ),
  period_bounds as (
    select
      case
        when v_period = 'week' then
          date_trunc('week', pg_catalog.timezone(p_timezone, now()))
            - (offset_no * interval '1 week')
        else
          date_trunc('month', pg_catalog.timezone(p_timezone, now()))
            - (offset_no * interval '1 month')
      end as start_local,
      case
        when v_period = 'week' then
          date_trunc('week', pg_catalog.timezone(p_timezone, now()))
            - (offset_no * interval '1 week') + interval '1 week'
        else
          date_trunc('month', pg_catalog.timezone(p_timezone, now()))
            - (offset_no * interval '1 month') + interval '1 month'
      end as end_local
    from period_offsets
  )
  select
    b.start_local::date,
    (b.end_local - interval '1 day')::date,
    count(l.id)::bigint,
    count(l.id) filter (where l.activity_type = 'match.logged')::bigint,
    count(l.id) filter (
      where l.activity_type = 'match.logged'
        and l.metadata->>'result' = 'win'
    )::bigint,
    count(l.id) filter (where l.activity_type = 'training.completed')::bigint,
    coalesce(sum(
      case
        when l.activity_type = 'training.completed'
          and jsonb_typeof(l.metadata->'duration_minutes') = 'number'
        then (l.metadata->>'duration_minutes')::bigint
        else 0
      end
    ), 0)::bigint,
    count(l.id) filter (where l.activity_type = 'quick_help.completed')::bigint,
    count(l.id) filter (where l.activity_type = 'ai_coach.session_started')::bigint,
    count(l.id) filter (where l.activity_type = 'diagnosis.completed')::bigint
  from period_bounds b
  left join public.user_activity_logs l
    on l.user_id = v_user_id
   and l.occurred_at >= (b.start_local at time zone p_timezone)
   and l.occurred_at < (b.end_local at time zone p_timezone)
   and l.retention_until > now()
  group by b.start_local, b.end_local
  order by b.start_local;
end;
$$;


--
-- Name: FUNCTION get_activity_summary(p_period text, p_periods integer, p_timezone text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_activity_summary(p_period text, p_periods integer, p_timezone text) IS 'Returns weekly or monthly cross-feature progress totals in the requested IANA timezone.';


--
-- Name: get_activity_timeline(integer, timestamp with time zone, text[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_activity_timeline(p_limit integer DEFAULT 50, p_before timestamp with time zone DEFAULT NULL::timestamp with time zone, p_activity_types text[] DEFAULT NULL::text[]) RETURNS TABLE(activity_id uuid, activity_type text, source_type text, source_id uuid, label text, metadata jsonb, occurred_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := auth.uid();
  v_limit integer := greatest(1, least(coalesce(p_limit, 50), 100));
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  return query
  select
    l.id,
    l.activity_type,
    l.source_type,
    l.source_id,
    l.label,
    l.metadata,
    l.occurred_at
  from public.user_activity_logs l
  where l.user_id = v_user_id
    and l.retention_until > now()
    and (p_before is null or l.occurred_at < p_before)
    and (p_activity_types is null or l.activity_type = any(p_activity_types))
  order by l.occurred_at desc, l.id desc
  limit v_limit;
end;
$$;


--
-- Name: FUNCTION get_activity_timeline(p_limit integer, p_before timestamp with time zone, p_activity_types text[]); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_activity_timeline(p_limit integer, p_before timestamp with time zone, p_activity_types text[]) IS 'Returns the signed-in user activity timeline with cursor-style timestamp pagination. Expired entries are hidden.';


--
-- Name: get_adaptive_today_training_recommendations(uuid, uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_adaptive_today_training_recommendations(p_player_character_id uuid DEFAULT NULL::uuid, p_opponent_character_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 3) RETURNS TABLE(recommendation_order bigint, adaptive_priority_score integer, priority_reasons jsonb, source_type text, training_plan_id uuid, focus_key text, focus_label text, training_id uuid, training_name text, training_type text, purpose text, duration_minutes integer, method text, success_criteria text, recommended_reps integer, rationale text, recent_sessions integer, last_practiced_at timestamp with time zone, recent_success_rate numeric, latest_self_rating smallint)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with base as (
    select *
    from public.get_today_training_recommendations(
      p_player_character_id,
      p_opponent_character_id,
      12
    )
  ),
  history as (
    select
      b.training_id,
      count(l.id)::integer as recent_sessions,
      max(l.practiced_at) as last_practiced_at,
      round(
        100.0 * sum(coalesce(l.successes, 0))
        / nullif(sum(l.attempts), 0),
        1
      ) as recent_success_rate,
      (
        array_agg(l.self_rating order by l.practiced_at desc, l.created_at desc, l.id desc)
          filter (where l.self_rating is not null)
      )[1]::smallint as latest_self_rating
    from base b
    left join lateral (
      select
        x.id,
        x.practiced_at,
        x.created_at,
        x.attempts,
        x.successes,
        x.self_rating
      from public.user_training_logs x
      where x.user_id = (select auth.uid())
        and x.training_id = b.training_id
      order by x.practiced_at desc, x.created_at desc, x.id desc
      limit 10
    ) l on true
    group by b.training_id
  ),
  scored as (
    select
      b.*,
      coalesce(h.recent_sessions, 0) as recent_sessions,
      h.last_practiced_at,
      h.recent_success_rate,
      h.latest_self_rating,
      case
        when h.last_practiced_at is null then null
        else greatest(
          0,
          pg_catalog.timezone('Asia/Tokyo', now())::date
          - pg_catalog.timezone('Asia/Tokyo', h.last_practiced_at)::date
        )
      end as days_since_last_practice,
      (
        1000
        - (b.recommendation_order::integer * 100)
        + case
            when h.last_practiced_at is null then 30
            else least(
              greatest(
                0,
                pg_catalog.timezone('Asia/Tokyo', now())::date
                - pg_catalog.timezone('Asia/Tokyo', h.last_practiced_at)::date
              ),
              30
            )
          end
        + case when h.latest_self_rating between 1 and 2 then 20 else 0 end
        + case when h.recent_success_rate is not null and h.recent_success_rate < 60 then 10 else 0 end
        - case
            when pg_catalog.timezone('Asia/Tokyo', h.last_practiced_at)::date
               = pg_catalog.timezone('Asia/Tokyo', now())::date
            then 40
            else 0
          end
      )::integer as adaptive_priority_score
    from base b
    left join history h on h.training_id = b.training_id
  ),
  explained as (
    select
      s.*,
      coalesce((
        select jsonb_agg(reason order by display_order)
        from (
          values
            (
              1,
              case
                when s.last_practiced_at is null
                then 'まだ練習記録がありません'
              end
            ),
            (
              2,
              case
                when s.last_practiced_at is not null
                 and s.days_since_last_practice >= 3
                then s.days_since_last_practice::text || '日間取り組んでいません'
              end
            ),
            (
              3,
              case
                when s.latest_self_rating between 1 and 2
                then '自己評価が低いため、定着確認を優先します'
              end
            ),
            (
              4,
              case
                when s.recent_success_rate is not null
                 and s.recent_success_rate < 60
                then '直近の成功率が60%未満です'
              end
            ),
            (
              5,
              case
                when pg_catalog.timezone('Asia/Tokyo', s.last_practiced_at)::date
                   = pg_catalog.timezone('Asia/Tokyo', now())::date
                then '今日はすでに練習済みのため優先度を下げています'
              end
            ),
            (6, s.rationale)
        ) as reasons(display_order, reason)
        where reason is not null
      ), '[]'::jsonb) as priority_reasons
    from scored s
  ),
  ranked as (
    select
      row_number() over (
        order by e.adaptive_priority_score desc, e.recommendation_order, e.training_id
      ) as new_recommendation_order,
      e.*
    from explained e
  )
  select
    r.new_recommendation_order as recommendation_order,
    r.adaptive_priority_score,
    r.priority_reasons,
    r.source_type,
    r.training_plan_id,
    r.focus_key,
    r.focus_label,
    r.training_id,
    r.training_name,
    r.training_type,
    r.purpose,
    r.duration_minutes,
    r.method,
    r.success_criteria,
    r.recommended_reps,
    r.rationale,
    r.recent_sessions,
    r.last_practiced_at,
    r.recent_success_rate,
    r.latest_self_rating
  from ranked r
  where r.new_recommendation_order <= least(greatest(coalesce(p_limit, 3), 1), 12)
  order by r.new_recommendation_order;
$$;


--
-- Name: FUNCTION get_adaptive_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_adaptive_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer) IS 'Adds transparent practice-history signals to the existing today-training candidates without changing their publication gates or source recommendation logic.';


--
-- Name: get_ai_coach_context(integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_ai_coach_context(p_recent_match_limit integer DEFAULT 20, p_recent_training_limit integer DEFAULT 20) RETURNS jsonb
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with profile as (
    select gp.*
    from public.user_game_profiles gp
    where gp.user_id = (select auth.uid())
  )
  select jsonb_build_object(
    'game_profile', (
      select to_jsonb(gp)
      from profile gp
    ),
    'latest_diagnosis', (
      select jsonb_build_object(
        'id', r.id,
        'diagnosis_id', r.diagnosis_id,
        'diagnosis_title', d.title,
        'diagnosis_type', d.diagnosis_type,
        'created_at', r.created_at
      )
      from public.diagnosis_results r
      join public.diagnoses d on d.id = r.diagnosis_id
      where r.user_id = (select auth.uid())
      order by r.created_at desc
      limit 1
    ),
    'recent_matches', coalesce((
      select jsonb_agg(to_jsonb(m) order by m.played_at desc)
      from (
        select *
        from public.user_match_logs
        where user_id = (select auth.uid())
        order by played_at desc
        limit least(greatest(coalesce(p_recent_match_limit, 20), 1), 50)
      ) m
    ), '[]'::jsonb),
    'recent_training', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.practiced_at desc)
      from (
        select *
        from public.user_training_logs
        where user_id = (select auth.uid())
        order by practiced_at desc
        limit least(greatest(coalesce(p_recent_training_limit, 20), 1), 50)
      ) t
    ), '[]'::jsonb),
    'recent_activity', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.occurred_at desc)
      from public.get_activity_timeline(20, null, null) a
    ), '[]'::jsonb),
    'activity_summary', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.period_start)
      from public.get_activity_summary('week', 4, 'Asia/Tokyo') s
    ), '[]'::jsonb),
    'active_training_plans', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.priority, p.created_at desc)
      from (
        select *
        from public.user_training_plans
        where user_id = (select auth.uid())
          and status in ('planned', 'in_progress')
        order by priority, created_at desc
        limit 20
      ) p
    ), '[]'::jsonb),
    'latest_10_matchups', coalesce((
      select jsonb_agg(
        to_jsonb(m)
        order by m.win_rate asc nulls last, m.matches desc, m.opponent_character_name
      )
      from public.get_matchup_performance(
        10,
        (select gp.main_character_id from profile gp)
      ) m
    ), '[]'::jsonb),
    'issue_trends', coalesce((
      select jsonb_agg(to_jsonb(i) order by i.recent_issue_count desc, i.issue_key)
      from public.get_issue_trends(
        10,
        (select gp.main_character_id from profile gp),
        10
      ) i
    ), '[]'::jsonb),
    'training_progress', coalesce((
      select jsonb_agg(to_jsonb(tp) order by tp.last_practiced_at desc, tp.training_name)
      from public.get_training_progress(
        10,
        (select gp.main_character_id from profile gp)
      ) tp
    ), '[]'::jsonb),
    'today_training', coalesce((
      select jsonb_agg(to_jsonb(tt) order by tt.recommendation_order)
      from public.get_adaptive_today_training_recommendations(
        (select gp.main_character_id from profile gp),
        null,
        3
      ) tt
    ), '[]'::jsonb),
    'weekly_review', public.get_weekly_progress_review(
      null,
      (select gp.main_character_id from profile gp)
    )
  );
$$;


--
-- Name: FUNCTION get_ai_coach_context(p_recent_match_limit integer, p_recent_training_limit integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_ai_coach_context(p_recent_match_limit integer, p_recent_training_limit integer) IS 'Authenticated user context for AI coaching, including raw recent activity, latest-10 matchup and issue summaries, today''s training, and weekly review.';


--
-- Name: get_ai_coach_session_context(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_ai_coach_session_context(p_session_id uuid, p_message_limit integer DEFAULT 20) RETURNS jsonb
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with session_row as (
    select
      s.id,
      s.title,
      s.coach_tone,
      s.character_id,
      c.name_ja as character_name,
      s.diagnosis_result_id,
      s.status,
      s.summary,
      s.created_at,
      s.updated_at
    from public.ai_coach_sessions s
    left join public.characters c on c.id = s.character_id
    where s.id = p_session_id
      and s.user_id = (select auth.uid())
  ),
  recent_messages as (
    select m.*
    from public.ai_coach_messages m
    join session_row s on s.id = m.session_id
    order by m.created_at desc, m.id desc
    limit least(greatest(coalesce(p_message_limit, 20), 1), 50)
  ),
  quick_help as (
    select i.id, i.topic_key, i.context, i.started_at, i.completed_at
    from public.coach_quick_help_intakes i
    join session_row s on s.id = i.ai_coach_session_id
    where i.user_id = (select auth.uid())
  )
  select jsonb_build_object(
    'session', to_jsonb(s),
    'messages', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'role', m.role,
          'content', m.content,
          'grounding_refs', m.grounding_refs,
          'created_at', m.created_at
        )
        order by m.created_at, m.id
      )
      from recent_messages m
    ), '[]'::jsonb),
    'quick_help', (
      select jsonb_build_object(
        'intake_id', q.id,
        'topic_key', q.topic_key,
        'context', q.context,
        'started_at', q.started_at,
        'completed_at', q.completed_at,
        'grounding', public.get_quick_help_grounding(q.id, 5)
      )
      from quick_help q
      limit 1
    ),
    'recent_activity', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.occurred_at desc)
      from public.get_activity_timeline(12, null, null) a
    ), '[]'::jsonb),
    'activity_summary', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.period_start)
      from public.get_activity_summary('week', 4, 'Asia/Tokyo') a
    ), '[]'::jsonb),
    'diagnosis_priorities', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.priority_order)
      from public.get_improvement_priorities(s.diagnosis_result_id, 3) p
    ), '[]'::jsonb),
    'latest_10_matchups', coalesce((
      select jsonb_agg(
        to_jsonb(m)
        order by m.win_rate asc nulls last, m.matches desc, m.opponent_character_name
      )
      from public.get_matchup_performance(10, s.character_id) m
    ), '[]'::jsonb),
    'issue_trends', coalesce((
      select jsonb_agg(to_jsonb(i) order by i.recent_issue_count desc, i.issue_key)
      from public.get_issue_trends(10, s.character_id, 10) i
    ), '[]'::jsonb),
    'training_progress', coalesce((
      select jsonb_agg(to_jsonb(tp) order by tp.last_practiced_at desc, tp.training_name)
      from public.get_training_progress(10, s.character_id) tp
    ), '[]'::jsonb),
    'today_training', coalesce((
      select jsonb_agg(to_jsonb(tt) order by tt.recommendation_order)
      from public.get_adaptive_today_training_recommendations(s.character_id, null, 3) tt
    ), '[]'::jsonb),
    'weekly_review', public.get_weekly_progress_review(null, s.character_id)
  )
  from session_row s;
$$;


--
-- Name: FUNCTION get_ai_coach_session_context(p_session_id uuid, p_message_limit integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_ai_coach_session_context(p_session_id uuid, p_message_limit integer) IS 'Returns an owned AI coach session with conversation, quick-help branch, grounded SF6DNA records, diagnosis, match, training, and weekly-review context.';


--
-- Name: get_improvement_priorities(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_improvement_priorities(p_diagnosis_result_id uuid, p_limit integer DEFAULT 3) RETURNS TABLE(priority_order bigint, focus_key text, focus_label text, score integer)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with scores as (
    select
      e.key as focus_key,
      sum((e.value #>> '{}')::integer)::integer as score
    from public.diagnosis_results r
    join public.diagnoses d
      on d.id = r.diagnosis_id
     and d.diagnosis_type = 'improvement'
    join public.diagnosis_answers a
      on a.diagnosis_result_id = r.id
    join public.diagnosis_options o
      on o.id = a.option_id
    cross join lateral jsonb_each(o.score_payload) e
    where r.id = p_diagnosis_result_id
    group by e.key
  ),
  ranked as (
    select
      row_number() over(order by score desc, focus_key) as priority_order,
      focus_key,
      case focus_key
        when 'anti_air' then '対空'
        when 'drive_rush_defense' then 'ドライブラッシュへの対応'
        when 'impact_response' then 'ドライブインパクトへの対応'
        when 'punish' then '確定反撃'
        when 'defense' then '防御の使い分け'
        when 'offense' then '攻めの組み立て'
        when 'meter' then 'ゲージ管理'
        when 'matchup' then 'キャラクター対策'
        when 'execution' then 'コンボと操作の安定'
        when 'neutral' then '中距離と差し合い'
        when 'corner_defense' then '画面端からの脱出'
        when 'decision' then '観察と判断'
        else focus_key
      end as focus_label,
      score
    from scores
  )
  select priority_order, focus_key, focus_label, score
  from ranked
  order by priority_order
  limit least(greatest(coalesce(p_limit, 3), 1), 12)
$$;


--
-- Name: get_issue_trends(integer, uuid, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_issue_trends(p_recent_match_count integer DEFAULT 10, p_player_character_id uuid DEFAULT NULL::uuid, p_change_threshold_points numeric DEFAULT 10) RETURNS TABLE(issue_key text, issue_label text, recent_matches integer, recent_issue_count integer, recent_issue_rate numeric, previous_matches integer, previous_issue_count integer, previous_issue_rate numeric, change_points numeric, trend text)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with params as (
    select
      least(greatest(coalesce(p_recent_match_count, 10), 1), 100) as sample_size,
      least(greatest(coalesce(p_change_threshold_points, 10), 0), 100) as threshold_points
  ),
  issue_types(issue_key, issue_label, display_order) as (
    values
      ('knowledge'::text, '知識不足'::text, 1),
      ('execution'::text, '操作・コンボのミス'::text, 2),
      ('decision'::text, '判断ミス'::text, 3),
      ('habit'::text, '行動の癖'::text, 4),
      ('matchup'::text, 'キャラクター対策不足'::text, 5),
      ('unknown'::text, '未分類'::text, 6)
  ),
  ordered as (
    select
      m.primary_issue,
      row_number() over (
        order by m.played_at desc, m.created_at desc, m.id desc
      ) as recent_order
    from public.user_match_logs m
    where m.user_id = (select auth.uid())
      and (
        p_player_character_id is null
        or m.player_character_id = p_player_character_id
      )
  ),
  totals as (
    select
      count(*) filter (where o.recent_order <= p.sample_size)::integer as recent_matches,
      count(*) filter (
        where o.recent_order > p.sample_size
          and o.recent_order <= p.sample_size * 2
      )::integer as previous_matches
    from ordered o
    cross join params p
  ),
  counts as (
    select
      i.issue_key,
      i.issue_label,
      i.display_order,
      count(*) filter (
        where o.primary_issue = i.issue_key
          and o.recent_order <= p.sample_size
      )::integer as recent_issue_count,
      count(*) filter (
        where o.primary_issue = i.issue_key
          and o.recent_order > p.sample_size
          and o.recent_order <= p.sample_size * 2
      )::integer as previous_issue_count
    from issue_types i
    cross join params p
    left join ordered o on true
    group by i.issue_key, i.issue_label, i.display_order, p.sample_size
  ),
  rates as (
    select
      c.*,
      t.recent_matches,
      t.previous_matches,
      round(100.0 * c.recent_issue_count / nullif(t.recent_matches, 0), 1) as recent_issue_rate,
      round(100.0 * c.previous_issue_count / nullif(t.previous_matches, 0), 1) as previous_issue_rate
    from counts c
    cross join totals t
  )
  select
    r.issue_key,
    r.issue_label,
    r.recent_matches,
    r.recent_issue_count,
    r.recent_issue_rate,
    r.previous_matches,
    r.previous_issue_count,
    r.previous_issue_rate,
    round(r.recent_issue_rate - r.previous_issue_rate, 1) as change_points,
    case
      when r.recent_matches < p.sample_size or r.previous_matches < p.sample_size
        then 'insufficient'
      when r.recent_issue_rate - r.previous_issue_rate >= p.threshold_points
        then 'increasing'
      when r.recent_issue_rate - r.previous_issue_rate <= -p.threshold_points
        then 'decreasing'
      else 'stable'
    end as trend
  from rates r
  cross join params p
  order by r.display_order;
$$;


--
-- Name: FUNCTION get_issue_trends(p_recent_match_count integer, p_player_character_id uuid, p_change_threshold_points numeric); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_issue_trends(p_recent_match_count integer, p_player_character_id uuid, p_change_threshold_points numeric) IS 'Compares issue rates in the latest N matches with the preceding N matches. Default N=10 and trend threshold=10 percentage points.';


--
-- Name: get_matchup_performance(integer, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_matchup_performance(p_recent_match_count integer DEFAULT 10, p_player_character_id uuid DEFAULT NULL::uuid) RETURNS TABLE(player_character_id uuid, player_character_name text, opponent_character_id uuid, opponent_character_name text, matches integer, wins integer, losses integer, draws integer, win_rate numeric, rounds_won integer, rounds_lost integer, round_win_rate numeric, mr_change integer, window_start timestamp with time zone, window_end timestamp with time zone)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with recent as (
    select
      m.*,
      row_number() over (
        order by m.played_at desc, m.created_at desc, m.id desc
      ) as recent_order
    from public.user_match_logs m
    where m.user_id = (select auth.uid())
      and (
        p_player_character_id is null
        or m.player_character_id = p_player_character_id
      )
  ),
  sample as (
    select *
    from recent
    where recent_order <= least(greatest(coalesce(p_recent_match_count, 10), 1), 100)
  )
  select
    s.player_character_id,
    pc.name_ja as player_character_name,
    s.opponent_character_id,
    oc.name_ja as opponent_character_name,
    count(*)::integer as matches,
    count(*) filter (where s.result = 'win')::integer as wins,
    count(*) filter (where s.result = 'loss')::integer as losses,
    count(*) filter (where s.result = 'draw')::integer as draws,
    round(
      100.0 * count(*) filter (where s.result = 'win') / nullif(count(*), 0),
      1
    ) as win_rate,
    coalesce(sum(s.rounds_won), 0)::integer as rounds_won,
    coalesce(sum(s.rounds_lost), 0)::integer as rounds_lost,
    round(
      100.0 * coalesce(sum(s.rounds_won), 0)
      / nullif(coalesce(sum(s.rounds_won), 0) + coalesce(sum(s.rounds_lost), 0), 0),
      1
    ) as round_win_rate,
    coalesce(
      (
        array_agg(s.mr_after order by s.played_at desc, s.created_at desc)
        filter (where s.mr_after is not null)
      )[1]
      -
      (
        array_agg(s.mr_before order by s.played_at asc, s.created_at asc)
        filter (where s.mr_before is not null)
      )[1],
      0
    )::integer as mr_change,
    min(s.played_at) as window_start,
    max(s.played_at) as window_end
  from sample s
  join public.characters pc on pc.id = s.player_character_id
  join public.characters oc on oc.id = s.opponent_character_id
  group by
    s.player_character_id,
    pc.name_ja,
    s.opponent_character_id,
    oc.name_ja
  order by win_rate asc, matches desc, opponent_character_name;
$$;


--
-- Name: FUNCTION get_matchup_performance(p_recent_match_count integer, p_player_character_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_matchup_performance(p_recent_match_count integer, p_player_character_id uuid) IS 'Authenticated user''s latest N matches, grouped by player and opponent character. Default N is 10.';


--
-- Name: get_phase23_character_preview(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase23_character_preview(target_character_id uuid, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = target_character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    return null;
  end if;

  select jsonb_build_object(
    'guideSections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'sectionType', s.section_type,
          'title', s.title,
          'body', s.body,
          'summary', s.summary,
          'displayOrder', s.display_order,
          'status', s.status,
          'verificationStatus', s.verification_status
        ) order by s.display_order, s.created_at
      )
      from public.character_guide_sections s
      where s.character_id = target_character_id
        and s.status <> 'archived'
    ), '[]'::jsonb),
    'moves', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'slug', m.slug,
          'name', m.name_ja,
          'moveType', m.move_type,
          'usageSummary', m.usage_summary,
          'status', m.status,
          'frame', (
            select jsonb_build_object(
              'startup', f.startup,
              'onBlock', f.on_block,
              'damage', f.damage,
              'verificationStatus', f.verification_status
            )
            from public.move_frame_data f
            where f.move_id = m.id
              and f.valid_to_patch_id is null
            order by case f.verification_status
              when 'verified' then 1
              when 'reviewed' then 2
              else 3
            end, f.updated_at desc
            limit 1
          )
        ) order by m.display_order, m.name_ja
      )
      from public.moves m
      where m.character_id = target_character_id
        and m.status <> 'archived'
    ), '[]'::jsonb),
    'combos', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'name', x.name,
          'purpose', x.purpose,
          'damage', x.damage,
          'driveCost', x.drive_cost,
          'saCost', x.sa_cost,
          'difficulty', x.difficulty,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.combos x
      where x.character_id = target_character_id
        and x.status <> 'archived'
    ), '[]'::jsonb),
    'setups', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'name', x.name,
          'setupType', x.setup_type,
          'description', x.description,
          'frameAdvantage', x.frame_advantage,
          'position', x.position,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.setups x
      where x.character_id = target_character_id
        and x.status <> 'archived'
    ), '[]'::jsonb),
    'sequences', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'name', x.name,
          'sequenceType', x.sequence_type,
          'sequenceText', x.sequence_text,
          'notes', x.notes,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.sequences x
      where x.character_id = target_character_id
        and x.status <> 'archived'
    ), '[]'::jsonb),
    'matchups', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'title', x.title,
          'summary', x.summary,
          'counterType', x.counter_type,
          'difficulty', x.difficulty,
          'defenderCharacterId', x.defender_character_id,
          'opponentCharacterId', x.opponent_character_id,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.counters x
      where (x.defender_character_id = target_character_id or x.opponent_character_id = target_character_id)
        and x.status <> 'archived'
    ), '[]'::jsonb),
    'training', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'name', x.name,
          'purpose', x.purpose,
          'trainingType', x.training_type,
          'level', x.level,
          'durationMinutes', x.duration_minutes,
          'playerCharacterId', x.player_character_id,
          'dummyCharacterId', x.dummy_character_id,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.trainings x
      where (x.player_character_id = target_character_id or x.dummy_character_id = target_character_id)
        and x.status <> 'archived'
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;


--
-- Name: get_phase23_move_commands_preview(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase23_move_commands_preview(target_character_id uuid, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = target_character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'moveId', mc.move_id,
        'scheme', mc.control_scheme,
        'commandText', mc.command_text,
        'numericNotation', mc.numeric_notation,
        'buttonNotation', mc.button_notation,
        'conditionText', mc.condition_text,
        'sortOrder', mc.sort_order
      )
      order by m.display_order, mc.control_scheme, mc.sort_order
    ),
    '[]'::jsonb
  )
  into result
  from public.move_commands mc
  join public.moves m on m.id = mc.move_id
  where m.character_id = target_character_id
    and m.status <> 'archived';

  return result;
end;
$$;


--
-- Name: get_phase23_move_motion_media_preview(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase23_move_motion_media_preview(target_character_id uuid, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return '[]'::jsonb;
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = target_character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    return '[]'::jsonb;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', mm.id,
        'moveId', mm.move_id,
        'mediaType', mm.media_type,
        'mediaUrl', mm.media_url,
        'posterUrl', mm.poster_url,
        'sourceUrl', mm.source_url,
        'sourceLabel', mm.source_label,
        'status', mm.status,
        'displayOrder', mm.display_order
      ) order by mm.display_order, mm.created_at
    ),
    '[]'::jsonb
  )
  into result
  from public.move_motion_media mm
  join public.moves m on m.id = mm.move_id
  where m.character_id = target_character_id
    and mm.status <> 'archived';

  return result;
end;
$$;


--
-- Name: get_phase39_content_detail_preview(text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase39_content_detail_preview(target_entity_type text, target_entity_slug text, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  if target_entity_type not in ('combo', 'setup', 'sequence', 'training') then
    return null;
  end if;

  if target_entity_type = 'combo' then
    select jsonb_build_object(
      'entityType', 'combo',
      'record', to_jsonb(x),
      'characterName', c.name_ja,
      'patchLabel', (
        select concat_ws(' / ', p.version_label, nullif(p.name, ''))
        from public.patches p
        where p.id = x.valid_from_patch_id
      ),
      'sources', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', s.id,
          'title', s.title,
          'url', s.url,
          'publisher', s.publisher,
          'sourceType', s.source_type,
          'relationship', es.relationship
        ) order by s.title, s.id)
        from public.entity_sources es
        join public.sources s on s.id = es.source_id
        where es.entity_type = 'combo'
          and es.entity_id = x.id
      ), '[]'::jsonb)
    )
    into result
    from public.combos x
    join public.characters c on c.id = x.character_id
    where x.slug = target_entity_slug
      and x.status <> 'archived'
      and c.status = 'published'
      and c.is_playable = true
    limit 1;
  elsif target_entity_type = 'setup' then
    select jsonb_build_object(
      'entityType', 'setup',
      'record', to_jsonb(x),
      'characterName', c.name_ja,
      'patchLabel', (
        select concat_ws(' / ', p.version_label, nullif(p.name, ''))
        from public.patches p
        where p.id = x.valid_from_patch_id
      ),
      'sources', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', s.id,
          'title', s.title,
          'url', s.url,
          'publisher', s.publisher,
          'sourceType', s.source_type,
          'relationship', es.relationship
        ) order by s.title, s.id)
        from public.entity_sources es
        join public.sources s on s.id = es.source_id
        where es.entity_type = 'setup'
          and es.entity_id = x.id
      ), '[]'::jsonb)
    )
    into result
    from public.setups x
    join public.characters c on c.id = x.character_id
    where x.slug = target_entity_slug
      and x.status <> 'archived'
      and c.status = 'published'
      and c.is_playable = true
    limit 1;
  elsif target_entity_type = 'sequence' then
    select jsonb_build_object(
      'entityType', 'sequence',
      'record', to_jsonb(x),
      'characterName', c.name_ja,
      'patchLabel', (
        select concat_ws(' / ', p.version_label, nullif(p.name, ''))
        from public.patches p
        where p.id = x.valid_from_patch_id
      ),
      'sources', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', s.id,
          'title', s.title,
          'url', s.url,
          'publisher', s.publisher,
          'sourceType', s.source_type,
          'relationship', es.relationship
        ) order by s.title, s.id)
        from public.entity_sources es
        join public.sources s on s.id = es.source_id
        where es.entity_type = 'sequence'
          and es.entity_id = x.id
      ), '[]'::jsonb)
    )
    into result
    from public.sequences x
    join public.characters c on c.id = x.character_id
    where x.slug = target_entity_slug
      and x.status <> 'archived'
      and c.status = 'published'
      and c.is_playable = true
    limit 1;
  else
    select jsonb_build_object(
      'entityType', 'training',
      'record', to_jsonb(x),
      'characterName', pc.name_ja,
      'dummyCharacterName', dc.name_ja,
      'patchLabel', (
        select concat_ws(' / ', p.version_label, nullif(p.name, ''))
        from public.patches p
        where p.id = x.valid_from_patch_id
      ),
      'sources', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', s.id,
          'title', s.title,
          'url', s.url,
          'publisher', s.publisher,
          'sourceType', s.source_type,
          'relationship', es.relationship
        ) order by s.title, s.id)
        from public.entity_sources es
        join public.sources s on s.id = es.source_id
        where es.entity_type = 'training'
          and es.entity_id = x.id
      ), '[]'::jsonb)
    )
    into result
    from public.trainings x
    left join public.characters pc on pc.id = x.player_character_id
    left join public.characters dc on dc.id = x.dummy_character_id
    where x.slug = target_entity_slug
      and x.status <> 'archived'
      and (
        (pc.status = 'published' and pc.is_playable = true)
        or (dc.status = 'published' and dc.is_playable = true)
      )
    limit 1;
  end if;

  return result;
end;
$$;


--
-- Name: get_phase40_combo_move_glossary_preview(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase40_combo_move_glossary_preview(target_combo_slug text, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $_$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  if not exists (
    select 1
    from public.combos x
    join public.characters c on c.id = x.character_id
    where x.slug = target_combo_slug
      and x.status <> 'archived'
      and c.status = 'published'
      and c.is_playable = true
  ) then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('english', terms.english, 'japanese', terms.japanese)
      order by length(terms.english) desc, terms.english, terms.japanese
    ),
    '[]'::jsonb
  )
  into result
  from (
    select distinct
      regexp_replace(m.name_en, '<br.*$', '', 'i') as english,
      m.name_ja as japanese
    from public.combos x
    join public.moves m on m.character_id = x.character_id
    where x.slug = target_combo_slug
      and x.status <> 'archived'
      and m.status <> 'archived'
      and nullif(m.name_en, '') is not null
      and nullif(m.name_ja, '') is not null

    union

    select distinct
      a.alias as english,
      m.name_ja as japanese
    from public.combos x
    join public.moves m on m.character_id = x.character_id
    join public.move_aliases a on a.move_id = m.id
    where x.slug = target_combo_slug
      and x.status <> 'archived'
      and m.status <> 'archived'
      and nullif(a.alias, '') is not null
      and nullif(m.name_ja, '') is not null
      and a.alias ~ '[A-Za-z]'
  ) terms
  where nullif(terms.english, '') is not null
    and nullif(terms.japanese, '') is not null;

  return result;
end;
$_$;


--
-- Name: get_phase41_strategy_move_glossary_preview(text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase41_strategy_move_glossary_preview(target_entity_type text, target_entity_slug text, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $_$
declare
  target_character_id uuid;
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  if target_entity_type not in ('combo', 'setup', 'sequence') then
    return null;
  end if;

  if target_entity_type = 'combo' then
    select x.character_id
    into target_character_id
    from public.combos x
    where x.slug = target_entity_slug
      and x.status <> 'archived'
    limit 1;
  elsif target_entity_type = 'setup' then
    select x.character_id
    into target_character_id
    from public.setups x
    where x.slug = target_entity_slug
      and x.status <> 'archived'
    limit 1;
  else
    select x.character_id
    into target_character_id
    from public.sequences x
    where x.slug = target_entity_slug
      and x.status <> 'archived'
    limit 1;
  end if;

  if target_character_id is null or not exists (
    select 1
    from public.characters c
    where c.id = target_character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('english', terms.english, 'japanese', terms.japanese)
      order by length(terms.english) desc, terms.english, terms.japanese
    ),
    '[]'::jsonb
  )
  into result
  from (
    select distinct
      regexp_replace(m.name_en, '<br.*$', '', 'i') as english,
      m.name_ja as japanese
    from public.moves m
    where m.character_id = target_character_id
      and m.status <> 'archived'
      and nullif(m.name_en, '') is not null
      and nullif(m.name_ja, '') is not null

    union

    select distinct
      a.alias as english,
      m.name_ja as japanese
    from public.moves m
    join public.move_aliases a on a.move_id = m.id
    where m.character_id = target_character_id
      and m.status <> 'archived'
      and nullif(a.alias, '') is not null
      and nullif(m.name_ja, '') is not null
      and a.alias ~ '[A-Za-z]'
  ) terms
  where nullif(terms.english, '') is not null
    and nullif(terms.japanese, '') is not null;

  return result;
end;
$_$;


--
-- Name: get_phase42_counter_detail_preview(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase42_counter_detail_preview(target_counter_slug text, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $_$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  select jsonb_build_object(
    'entityType', 'counter',
    'record', to_jsonb(x),
    'characterName', dc.name_ja,
    'opponentCharacterName', oc.name_ja,
    'patchLabel', (
      select concat_ws(' / ', p.version_label, nullif(p.name, ''))
      from public.patches p
      where p.id = x.valid_from_patch_id
    ),
    'moveGlossary', coalesce((
      with raw_terms as (
        select
          regexp_replace(m.name_en, '<br.*$', '', 'i') as english,
          m.name_ja as japanese
        from public.moves m
        where m.character_id in (x.defender_character_id, x.opponent_character_id)
          and m.status <> 'archived'
          and nullif(m.name_en, '') is not null
          and nullif(m.name_ja, '') is not null

        union

        select
          a.alias as english,
          m.name_ja as japanese
        from public.moves m
        join public.move_aliases a on a.move_id = m.id
        where m.character_id in (x.defender_character_id, x.opponent_character_id)
          and m.status <> 'archived'
          and nullif(a.alias, '') is not null
          and nullif(m.name_ja, '') is not null
          and a.alias ~ '[A-Za-z]'
      ), unique_terms as (
        select english, min(japanese) as japanese
        from raw_terms
        where nullif(english, '') is not null
          and nullif(japanese, '') is not null
        group by english
        having count(distinct japanese) = 1
      )
      select jsonb_agg(
        jsonb_build_object('english', english, 'japanese', japanese)
        order by length(english) desc, english, japanese
      )
      from unique_terms
    ), '[]'::jsonb),
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id,
        'title', s.title,
        'url', s.url,
        'publisher', s.publisher,
        'sourceType', s.source_type,
        'relationship', es.relationship
      ) order by s.title, s.id)
      from public.entity_sources es
      join public.sources s on s.id = es.source_id
      where es.entity_type = 'counter'
        and es.entity_id = x.id
    ), '[]'::jsonb)
  )
  into result
  from public.counters x
  left join public.characters dc on dc.id = x.defender_character_id
  left join public.characters oc on oc.id = x.opponent_character_id
  where x.slug = target_counter_slug
    and x.status <> 'archived'
    and (dc.id is not null or oc.id is not null)
    and (dc.id is null or (dc.status = 'published' and dc.is_playable = true))
    and (oc.id is null or (oc.status = 'published' and oc.is_playable = true))
  limit 1;

  return result;
end;
$_$;


--
-- Name: get_phase43_character_move_glossary_preview(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase43_character_move_glossary_preview(target_character_id uuid, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $_$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = target_character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('english', terms.english, 'japanese', terms.japanese)
      order by length(terms.english) desc, terms.english, terms.japanese
    ),
    '[]'::jsonb
  )
  into result
  from (
    select distinct
      regexp_replace(m.name_en, '<br.*$', '', 'i') as english,
      m.name_ja as japanese
    from public.moves m
    where m.character_id = target_character_id
      and m.status <> 'archived'
      and nullif(m.name_en, '') is not null
      and nullif(m.name_ja, '') is not null

    union

    select distinct
      a.alias as english,
      m.name_ja as japanese
    from public.moves m
    join public.move_aliases a on a.move_id = m.id
    where m.character_id = target_character_id
      and m.status <> 'archived'
      and nullif(a.alias, '') is not null
      and nullif(m.name_ja, '') is not null
      and a.alias ~ '[A-Za-z]'
  ) terms
  where nullif(terms.english, '') is not null
    and nullif(terms.japanese, '') is not null;

  return result;
end;
$_$;


--
-- Name: get_phase44_move_detail_preview(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase44_move_detail_preview(target_move_slug text, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  select jsonb_build_object(
    'entityType', 'move',
    'record', to_jsonb(m),
    'characterName', c.name_ja,
    'patchLabel', (
      select concat_ws(' / ', p.version_label, nullif(p.name, ''))
      from public.patches p
      where p.id = f.valid_from_patch_id
    ),
    'commands', coalesce((
      select jsonb_agg(jsonb_build_object(
        'scheme', mc.control_scheme,
        'commandText', mc.command_text,
        'numericNotation', mc.numeric_notation,
        'buttonNotation', mc.button_notation,
        'conditionText', mc.condition_text,
        'sortOrder', mc.sort_order
      ) order by mc.sort_order, mc.id)
      from public.move_commands mc
      where mc.move_id = m.id
    ), '[]'::jsonb),
    'frame', case when f.id is null then null else to_jsonb(f) end,
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id,
        'title', s.title,
        'url', s.url,
        'publisher', s.publisher,
        'sourceType', s.source_type,
        'relationship', es.relationship
      ) order by s.title, s.id)
      from public.entity_sources es
      join public.sources s on s.id = es.source_id
      where (es.entity_type = 'move' and es.entity_id = m.id)
         or (f.id is not null and es.entity_type in ('frame', 'move_frame_data') and es.entity_id = f.id)
    ), '[]'::jsonb)
  )
  into result
  from public.moves m
  join public.characters c on c.id = m.character_id
  left join lateral (
    select mf.*
    from public.move_frame_data mf
    where mf.move_id = m.id
      and mf.valid_to_patch_id is null
    order by case mf.verification_status
      when 'verified' then 1
      when 'reviewed' then 2
      else 3
    end, mf.updated_at desc
    limit 1
  ) f on true
  where m.slug = target_move_slug
    and m.status <> 'archived'
    and c.status = 'published'
    and c.is_playable = true
  limit 1;

  return result;
end;
$$;


--
-- Name: get_phase47_move_japanese_preview(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_phase47_move_japanese_preview(target_character_id uuid, preview_token text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return '[]'::jsonb;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id,
    'descriptionJa', m.description_ja,
    'usageSummaryJa', m.usage_summary_ja
  ) order by m.display_order, m.name_ja), '[]'::jsonb)
  into result
  from public.moves m
  join public.characters c on c.id = m.character_id
  where m.character_id = target_character_id
    and m.status <> 'archived'
    and c.status = 'published'
    and c.is_playable = true;

  return result;
end;
$$;


--
-- Name: get_public_entity_sources(text[], uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_public_entity_sources(target_entity_types text[] DEFAULT NULL::text[], target_entity_ids uuid[] DEFAULT NULL::uuid[]) RETURNS TABLE(entity_type text, entity_id uuid, source_id uuid, relationship text, title text, url text, source_type text, publisher text, published_at timestamp with time zone, accessed_at timestamp with time zone, reliability_level text)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'private'
    AS $$
  select
    es.entity_type,
    es.entity_id,
    es.source_id,
    es.relationship,
    s.title,
    s.url,
    s.source_type,
    s.publisher,
    s.published_at,
    s.accessed_at,
    s.reliability_level
  from public.entity_sources es
  join public.sources s
    on s.id = es.source_id
  where
    (
      target_entity_types is null
      or es.entity_type = any(target_entity_types)
    )
    and (
      target_entity_ids is null
      or es.entity_id = any(target_entity_ids)
    )
    and s.reliability_level in ('official', 'primary', 'secondary', 'community')
    and s.source_type in (
      'article', 'character_guide', 'community',
      'community_aggregator', 'community_article', 'community_combo_database',
      'community_discussion', 'community_frame_database', 'community_guide',
      'community_structured_data', 'community_video', 'community_wiki',
      'frame_data', 'frame_database', 'guide',
      'official', 'official_esports_release', 'official_frame_data',
      'official_movelist', 'official_patch', 'official_patch_notes',
      'official_store', 'official_store_news', 'official_video',
      'player_database', 'player_reference', 'social_post',
      'strategy', 'strategy_guide', 'structured_dataset',
      'tournament_report', 'video', 'video_guide',
      'video_playlist'
    )
    and private.is_public_source_target(es.entity_type, es.entity_id);
$$;


--
-- Name: get_quick_help_grounding(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_quick_help_grounding(p_intake_id uuid, p_limit integer DEFAULT 5) RETURNS jsonb
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $_$
  with intake as (
    select
      i.*,
      case
        when i.context #>> '{player_character_id,value}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then (i.context #>> '{player_character_id,value}')::uuid
        else gp.main_character_id
      end as player_character_id,
      case
        when i.context #>> '{opponent_character_id,value}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then (i.context #>> '{opponent_character_id,value}')::uuid
        else null::uuid
      end as opponent_character_id,
      case
        when i.context #>> '{opponent_move_id,value}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then (i.context #>> '{opponent_move_id,value}')::uuid
        else null::uuid
      end as opponent_move_id,
      case
        when jsonb_array_length(coalesce(i.context #> '{situation_key,metadata,counter_types}', '[]'::jsonb)) > 0
          then array(
            select jsonb_array_elements_text(
              i.context #> '{situation_key,metadata,counter_types}'
            )
          )
        else array(
          select jsonb_array_elements_text(
            coalesce(i.context #> '{topic_key,metadata,counter_types}', '[]'::jsonb)
          )
        )
      end as counter_types,
      case
        when jsonb_array_length(coalesce(i.context #> '{situation_key,metadata,training_types}', '[]'::jsonb)) > 0
          then array(
            select jsonb_array_elements_text(
              i.context #> '{situation_key,metadata,training_types}'
            )
          )
        else array(
          select jsonb_array_elements_text(
            coalesce(i.context #> '{topic_key,metadata,training_types}', '[]'::jsonb)
          )
        )
      end as training_types
    from public.coach_quick_help_intakes i
    left join public.user_game_profiles gp on gp.user_id = i.user_id
    where i.id = p_intake_id
      and i.user_id = (select auth.uid())
      and i.status in ('ready', 'linked')
  ),
  selected_move as (
    select jsonb_build_object(
      'entity_type', 'move',
      'entity_id', m.id,
      'slug', m.slug,
      'title', m.name_ja,
      'description', coalesce(m.description_ja, m.description),
      'usage_summary', coalesce(m.usage_summary_ja, m.usage_summary),
      'character_id', m.character_id
    ) as item
    from intake i
    join public.moves m
      on m.id = i.opponent_move_id
     and m.status = 'published'
  ),
  counter_rows as (
    select jsonb_build_object(
      'entity_type', 'counter',
      'entity_id', c.id,
      'slug', c.slug,
      'title', c.title,
      'summary', c.summary,
      'method', c.method,
      'conditions', c.conditions,
      'opponent_character_id', c.opponent_character_id,
      'counter_type', c.counter_type
    ) as item,
    c.created_at,
    c.id
    from intake i
    join public.counters c
      on c.status = 'published'
     and c.verification_status = 'verified'
     and cardinality(i.counter_types) > 0
     and c.counter_type = any(i.counter_types)
     and (
       i.player_character_id is null
       or c.defender_character_id is null
       or c.defender_character_id = i.player_character_id
     )
     and (
       i.opponent_character_id is null
       or c.opponent_character_id = i.opponent_character_id
     )
     and (
       i.opponent_move_id is null
       or c.target_id is null
       or c.target_id = i.opponent_move_id
     )
    order by
      case when c.target_id = i.opponent_move_id then 0 else 1 end,
      case when c.defender_character_id = i.player_character_id then 0 else 1 end,
      c.created_at desc,
      c.id
    limit least(greatest(coalesce(p_limit, 5), 1), 12)
  ),
  training_rows as (
    select jsonb_build_object(
      'entity_type', 'training',
      'entity_id', t.id,
      'slug', t.slug,
      'title', t.name,
      'purpose', t.purpose,
      'duration_minutes', t.duration_minutes,
      'method', t.method,
      'success_criteria', t.success_criteria,
      'recommended_reps', t.recommended_reps,
      'training_type', t.training_type
    ) as item,
    t.created_at,
    t.id
    from intake i
    join public.trainings t
      on t.status = 'published'
     and t.verification_status = 'verified'
     and cardinality(i.training_types) > 0
     and t.training_type = any(i.training_types)
     and (
       i.player_character_id is null
       or t.player_character_id is null
       or t.player_character_id = i.player_character_id
     )
     and (
       i.opponent_character_id is null
       or t.dummy_character_id is null
       or t.dummy_character_id = i.opponent_character_id
     )
    order by
      case when t.player_character_id = i.player_character_id then 0 else 1 end,
      case when t.dummy_character_id = i.opponent_character_id then 0 else 1 end,
      t.created_at desc,
      t.id
    limit least(greatest(coalesce(p_limit, 5), 1), 12)
  ),
  free_text_search as (
    select jsonb_build_object(
      'entity_type', s.entity_type,
      'entity_id', s.entity_id,
      'slug', s.slug,
      'title', s.title,
      'subtitle', s.subtitle,
      'matched_by', s.matched_by,
      'score', s.score
    ) as item,
    s.score,
    s.entity_type,
    s.entity_id
    from intake i
    cross join lateral public.search_sf6dna(
      i.context #>> '{question_detail,value}',
      least(greatest(coalesce(p_limit, 5), 1), 12)
    ) s
    where nullif(i.context #>> '{question_detail,value}', '') is not null
  )
  select jsonb_build_object(
    'intake_id', i.id,
    'topic_key', i.topic_key,
    'context', i.context,
    'selected_move', (
      select sm.item from selected_move sm limit 1
    ),
    'counters', coalesce((
      select jsonb_agg(c.item order by c.created_at desc, c.id)
      from counter_rows c
    ), '[]'::jsonb),
    'trainings', coalesce((
      select jsonb_agg(t.item order by t.created_at desc, t.id)
      from training_rows t
    ), '[]'::jsonb),
    'search_results', coalesce((
      select jsonb_agg(s.item order by s.score desc, s.entity_type, s.entity_id)
      from free_text_search s
    ), '[]'::jsonb)
  )
  from intake i;
$_$;


--
-- Name: FUNCTION get_quick_help_grounding(p_intake_id uuid, p_limit integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_quick_help_grounding(p_intake_id uuid, p_limit integer) IS 'Returns only currently visible move, counter, training, and search results relevant to an owned completed quick-help intake.';


--
-- Name: get_quick_help_intake_step(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_quick_help_intake_step(p_intake_id uuid) RETURNS jsonb
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  select jsonb_build_object(
    'intake_id', i.id,
    'status', i.status,
    'topic_key', i.topic_key,
    'context', i.context,
    'step', public.get_quick_help_node(f.slug, n.node_key, i.context)
  )
  from public.coach_quick_help_intakes i
  join public.coach_quick_help_flows f on f.id = i.flow_id
  left join public.coach_quick_help_nodes n on n.id = i.current_node_id
  where i.id = p_intake_id
    and i.user_id = (select auth.uid());
$$;


--
-- Name: FUNCTION get_quick_help_intake_step(p_intake_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_quick_help_intake_step(p_intake_id uuid) IS 'Returns the current step and accumulated context for an owned quick-help intake.';


--
-- Name: get_quick_help_node(text, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_quick_help_node(p_flow_slug text, p_node_key text, p_context jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $_$
  with flow as (
    select f.id, f.slug, f.title, f.description, f.version, f.status
    from public.coach_quick_help_flows f
    where f.slug = p_flow_slug
      and (f.status = 'published' or (select private.is_admin()))
  ),
  node as (
    select n.*
    from public.coach_quick_help_nodes n
    join flow f on f.id = n.flow_id
    where n.node_key = p_node_key
  ),
  context_value as (
    select p_context #>> '{opponent_character_id,value}' as opponent_character_text
  ),
  parsed_context as (
    select case
      when opponent_character_text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then opponent_character_text::uuid
      else null::uuid
    end as opponent_character_id
    from context_value
  ),
  static_options as (
    select jsonb_build_object(
      'selection_kind', 'option',
      'id', o.id,
      'key', o.option_key,
      'label', o.label,
      'value', o.option_value,
      'metadata', o.metadata,
      'next_node_key', next_node.node_key,
      'sort_order', o.sort_order
    ) as item,
    o.sort_order,
    o.option_key as stable_key
    from node n
    join public.coach_quick_help_options o on o.node_id = n.id
    join public.coach_quick_help_nodes next_node on next_node.id = o.next_node_id
    where n.input_type = 'static'
  ),
  character_options as (
    select jsonb_build_object(
      'selection_kind', 'character',
      'id', c.id,
      'key', c.slug,
      'label', c.name_ja,
      'value', c.id,
      'image_url', c.image_url,
      'next_node_key', next_node.node_key,
      'sort_order', coalesce(c.display_order, 9999)
    ) as item,
    coalesce(c.display_order, 9999) as sort_order,
    c.slug as stable_key
    from node n
    join public.characters c
      on n.input_type = 'character'
     and c.status = 'published'
     and c.is_playable = true
    left join public.coach_quick_help_nodes next_node
      on next_node.id = n.default_next_node_id
  ),
  move_options as (
    select jsonb_build_object(
      'selection_kind', 'move',
      'id', m.id,
      'key', m.slug,
      'label', m.name_ja,
      'value', m.id,
      'move_type', m.move_type,
      'strength_variant', m.strength_variant,
      'next_node_key', next_node.node_key,
      'sort_order', m.display_order
    ) as item,
    m.display_order as sort_order,
    m.slug as stable_key
    from node n
    cross join parsed_context ctx
    join public.moves m
      on n.input_type = 'move'
     and m.character_id = ctx.opponent_character_id
     and m.status = 'published'
    left join public.coach_quick_help_nodes next_node
      on next_node.id = n.default_next_node_id
  ),
  available_options as (
    select * from static_options
    union all
    select * from character_options
    union all
    select * from move_options
  )
  select jsonb_build_object(
    'flow', jsonb_build_object(
      'slug', f.slug,
      'title', f.title,
      'description', f.description,
      'version', f.version,
      'status', f.status
    ),
    'node', jsonb_build_object(
      'id', n.id,
      'key', n.node_key,
      'type', n.node_type,
      'prompt', n.prompt,
      'input_type', n.input_type,
      'answer_key', n.answer_key,
      'topic_key', n.topic_key,
      'help_text', n.help_text,
      'default_next_node_key', next_node.node_key
    ),
    'options', coalesce((
      select jsonb_agg(a.item order by a.sort_order, a.stable_key)
      from available_options a
    ), '[]'::jsonb)
  )
  from flow f
  join node n on true
  left join public.coach_quick_help_nodes next_node
    on next_node.id = n.default_next_node_id;
$_$;


--
-- Name: FUNCTION get_quick_help_node(p_flow_slug text, p_node_key text, p_context jsonb); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_quick_help_node(p_flow_slug text, p_node_key text, p_context jsonb) IS 'Returns one published quick-help step. Character and move choices are loaded dynamically from current visible SF6DNA data.';


--
-- Name: get_today_training_recommendations(uuid, uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_today_training_recommendations(p_player_character_id uuid DEFAULT NULL::uuid, p_opponent_character_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 3) RETURNS TABLE(recommendation_order bigint, source_type text, training_plan_id uuid, focus_key text, focus_label text, training_id uuid, training_name text, training_type text, purpose text, duration_minutes integer, method text, success_criteria text, recommended_reps integer, rationale text)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with active_plans as (
    select
      0 as source_rank,
      p.priority::integer as sort_priority,
      p.created_at as source_created_at,
      'active_plan'::text as source_type,
      p.id as training_plan_id,
      p.focus_key,
      case p.focus_key
        when 'anti_air' then '対空'
        when 'drive_rush_defense' then 'ドライブラッシュへの対応'
        when 'impact_response' then 'ドライブインパクトへの対応'
        when 'punish' then '確定反撃'
        when 'defense' then '防御の使い分け'
        when 'offense' then '攻めの組み立て'
        when 'meter' then 'ゲージ管理'
        when 'matchup' then 'キャラクター対策'
        when 'execution' then 'コンボと操作の安定'
        when 'neutral' then '中距離と差し合い'
        when 'corner_defense' then '画面端からの脱出'
        when 'decision' then '観察と判断'
        else p.focus_key
      end as focus_label,
      t.id as training_id,
      t.name as training_name,
      t.training_type,
      t.purpose,
      t.duration_minutes,
      t.method,
      t.success_criteria,
      t.recommended_reps,
      p.rationale
    from public.user_training_plans p
    join public.trainings t on t.id = p.training_id
    where p.user_id = (select auth.uid())
      and p.status in ('planned', 'in_progress')
      and (p.scheduled_for is null or p.scheduled_for <= (pg_catalog.timezone('Asia/Tokyo', now()))::date)
      and (
        p_player_character_id is null
        or t.player_character_id is null
        or t.player_character_id = p_player_character_id
      )
      and (
        p_opponent_character_id is null
        or t.dummy_character_id is null
        or t.dummy_character_id = p_opponent_character_id
      )
  ),
  latest_improvement_result as (
    select r.id, r.created_at
    from public.diagnosis_results r
    join public.diagnoses d
      on d.id = r.diagnosis_id
     and d.diagnosis_type = 'improvement'
    where r.user_id = (select auth.uid())
    order by r.created_at desc, r.id desc
    limit 1
  ),
  diagnosis_recommendations as (
    select
      1 as source_rank,
      priority.priority_order::integer as sort_priority,
      latest.created_at as source_created_at,
      'diagnosis'::text as source_type,
      null::uuid as training_plan_id,
      rec.focus_key,
      rec.focus_label,
      rec.training_id,
      rec.training_name,
      rec.training_type,
      rec.purpose,
      rec.duration_minutes,
      rec.method,
      rec.success_criteria,
      rec.recommended_reps,
      ('診断結果の優先課題「' || rec.focus_label || '」に対応')::text as rationale
    from latest_improvement_result latest
    cross join lateral public.get_training_recommendations_for_result(
      latest.id,
      p_player_character_id,
      p_opponent_character_id,
      least(greatest(coalesce(p_limit, 3), 1), 12)
    ) rec
    join lateral public.get_improvement_priorities(latest.id, 3) priority
      on priority.focus_key = rec.focus_key
  ),
  candidates as (
    select * from active_plans
    union all
    select * from diagnosis_recommendations
  ),
  deduplicated as (
    select
      c.*,
      row_number() over (
        partition by c.training_id
        order by c.source_rank, c.sort_priority, c.source_created_at desc, c.training_id
      ) as duplicate_order
    from candidates c
  ),
  selected as (
    select *
    from deduplicated
    where duplicate_order = 1
    order by source_rank, sort_priority, source_created_at desc, training_id
    limit least(greatest(coalesce(p_limit, 3), 1), 12)
  )
  select
    row_number() over (
      order by s.source_rank, s.sort_priority, s.source_created_at desc, s.training_id
    ) as recommendation_order,
    s.source_type,
    s.training_plan_id,
    s.focus_key,
    s.focus_label,
    s.training_id,
    s.training_name,
    s.training_type,
    s.purpose,
    s.duration_minutes,
    s.method,
    s.success_criteria,
    s.recommended_reps,
    s.rationale
  from selected s
  order by recommendation_order;
$$;


--
-- Name: FUNCTION get_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer) IS 'Returns up to three due active plans, then fills remaining slots from the authenticated user''s latest improvement diagnosis. Read only.';


--
-- Name: get_training_progress(integer, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_training_progress(p_recent_session_count integer DEFAULT 10, p_player_character_id uuid DEFAULT NULL::uuid) RETURNS TABLE(training_id uuid, training_name text, sessions integer, total_minutes integer, total_attempts integer, total_successes integer, success_rate numeric, initial_self_rating smallint, latest_self_rating smallint, self_rating_change integer, first_practiced_at timestamp with time zone, last_practiced_at timestamp with time zone)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with ordered as (
    select
      l.*,
      coalesce(l.training_name_snapshot, t.name) as catalog_training_name,
      coalesce(l.player_character_id_snapshot, t.player_character_id) as player_character_id,
      row_number() over (
        order by l.practiced_at desc, l.created_at desc, l.id desc
      ) as recent_order
    from public.user_training_logs l
    left join public.trainings t on t.id = l.training_id
    where l.user_id = (select auth.uid())
      and (
        p_player_character_id is null
        or coalesce(l.player_character_id_snapshot, t.player_character_id) = p_player_character_id
      )
  ),
  sample as (
    select *
    from ordered
    where recent_order <= least(greatest(coalesce(p_recent_session_count, 10), 1), 100)
  ),
  grouped as (
    select
      s.training_id,
      coalesce(s.catalog_training_name, s.custom_title, '自由練習') as training_name,
      count(*)::integer as sessions,
      coalesce(sum(s.duration_minutes), 0)::integer as total_minutes,
      coalesce(sum(s.attempts), 0)::integer as total_attempts,
      coalesce(sum(s.successes), 0)::integer as total_successes,
      round(
        100.0 * coalesce(sum(s.successes), 0)
        / nullif(coalesce(sum(s.attempts), 0), 0),
        1
      ) as success_rate,
      (
        array_agg(s.self_rating order by s.practiced_at asc, s.created_at asc)
        filter (where s.self_rating is not null)
      )[1]::smallint as initial_self_rating,
      (
        array_agg(s.self_rating order by s.practiced_at desc, s.created_at desc)
        filter (where s.self_rating is not null)
      )[1]::smallint as latest_self_rating,
      min(s.practiced_at) as first_practiced_at,
      max(s.practiced_at) as last_practiced_at
    from sample s
    group by
      s.training_id,
      coalesce(s.catalog_training_name, s.custom_title, '自由練習')
  )
  select
    g.training_id,
    g.training_name,
    g.sessions,
    g.total_minutes,
    g.total_attempts,
    g.total_successes,
    g.success_rate,
    g.initial_self_rating,
    g.latest_self_rating,
    case
      when g.initial_self_rating is null or g.latest_self_rating is null then null
      else g.latest_self_rating::integer - g.initial_self_rating::integer
    end as self_rating_change,
    g.first_practiced_at,
    g.last_practiced_at
  from grouped g
  order by g.last_practiced_at desc, g.training_name;
$$;


--
-- Name: FUNCTION get_training_progress(p_recent_session_count integer, p_player_character_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_training_progress(p_recent_session_count integer, p_player_character_id uuid) IS 'Summarizes the authenticated user''s latest N training sessions and shows measured success rate and self-rating change without inferring causality.';


--
-- Name: get_training_recommendations(text[], uuid, uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_training_recommendations(p_focus_keys text[], p_character_id uuid DEFAULT NULL::uuid, p_opponent_character_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 3) RETURNS TABLE(focus_key text, focus_label text, training_id uuid, training_name text, training_type text, purpose text, level text, duration_minutes integer, player_character_id uuid, dummy_character_id uuid, method text, success_criteria text, recommended_reps integer, next_step text)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  select
    r.focus_key,
    r.label,
    t.id,
    t.name,
    t.training_type,
    t.purpose,
    t.level,
    t.duration_minutes,
    t.player_character_id,
    t.dummy_character_id,
    t.method,
    t.success_criteria,
    t.recommended_reps,
    t.next_step
  from public.diagnosis_focus_rules r
  join public.trainings t
    on t.training_type = any(r.training_types)
  where r.status = 'published'
    and coalesce(cardinality(p_focus_keys), 0) between 1 and 3
    and r.focus_key = any(p_focus_keys)
    and (
      t.player_character_id is null
      or t.player_character_id = p_character_id
    )
    and (
      t.dummy_character_id is null
      or t.dummy_character_id = p_opponent_character_id
    )
  order by
    array_position(p_focus_keys, r.focus_key),
    case when t.player_character_id = p_character_id then 0 else 1 end,
    case when t.dummy_character_id = p_opponent_character_id then 0 else 1 end,
    array_position(r.training_types, t.training_type),
    t.created_at,
    t.id
  limit least(greatest(coalesce(p_limit, 3), 1), 12)
$$;


--
-- Name: get_training_recommendations_for_result(uuid, uuid, uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_training_recommendations_for_result(p_diagnosis_result_id uuid, p_character_id uuid DEFAULT NULL::uuid, p_opponent_character_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 3) RETURNS TABLE(focus_key text, focus_label text, training_id uuid, training_name text, training_type text, purpose text, level text, duration_minutes integer, player_character_id uuid, dummy_character_id uuid, method text, success_criteria text, recommended_reps integer, next_step text)
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  select rec.*
  from public.get_training_recommendations(
    array(
      select p.focus_key
      from public.get_improvement_priorities(p_diagnosis_result_id, 3) p
      order by p.priority_order
    ),
    p_character_id,
    p_opponent_character_id,
    p_limit
  ) rec
$$;


--
-- Name: get_weekly_progress_review(date, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_weekly_progress_review(p_week_start date DEFAULT NULL::date, p_player_character_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE sql STABLE
    SET search_path TO ''
    AS $$
  with bounds as (
    select
      coalesce(p_week_start, pg_catalog.date_trunc('week', pg_catalog.timezone('Asia/Tokyo', now()))::date) as week_start
  ),
  periods as (
    select
      b.week_start,
      (b.week_start + 7) as week_end,
      (b.week_start - 7) as previous_week_start
    from bounds b
  ),
  current_matches as (
    select m.*
    from public.user_match_logs m
    cross join periods p
    where m.user_id = (select auth.uid())
      and m.played_at >= (p.week_start::timestamp at time zone 'Asia/Tokyo')
      and m.played_at < (p.week_end::timestamp at time zone 'Asia/Tokyo')
      and (
        p_player_character_id is null
        or m.player_character_id = p_player_character_id
      )
  ),
  previous_matches as (
    select m.*
    from public.user_match_logs m
    cross join periods p
    where m.user_id = (select auth.uid())
      and m.played_at >= (p.previous_week_start::timestamp at time zone 'Asia/Tokyo')
      and m.played_at < (p.week_start::timestamp at time zone 'Asia/Tokyo')
      and (
        p_player_character_id is null
        or m.player_character_id = p_player_character_id
      )
  ),
  current_match_summary as (
    select
      count(*)::integer as matches,
      count(*) filter (where result = 'win')::integer as wins,
      count(*) filter (where result = 'loss')::integer as losses,
      count(*) filter (where result = 'draw')::integer as draws,
      round(100.0 * count(*) filter (where result = 'win') / nullif(count(*), 0), 1) as win_rate,
      coalesce(
        (
          array_agg(mr_after order by played_at desc, created_at desc)
          filter (where mr_after is not null)
        )[1]
        -
        (
          array_agg(mr_before order by played_at asc, created_at asc)
          filter (where mr_before is not null)
        )[1],
        0
      )::integer as mr_change
    from current_matches
  ),
  previous_match_summary as (
    select
      count(*)::integer as matches,
      count(*) filter (where result = 'win')::integer as wins,
      count(*) filter (where result = 'loss')::integer as losses,
      count(*) filter (where result = 'draw')::integer as draws,
      round(100.0 * count(*) filter (where result = 'win') / nullif(count(*), 0), 1) as win_rate,
      coalesce(
        (
          array_agg(mr_after order by played_at desc, created_at desc)
          filter (where mr_after is not null)
        )[1]
        -
        (
          array_agg(mr_before order by played_at asc, created_at asc)
          filter (where mr_before is not null)
        )[1],
        0
      )::integer as mr_change
    from previous_matches
  ),
  matchup_rows as (
    select
      m.player_character_id,
      pc.name_ja as player_character_name,
      m.opponent_character_id,
      oc.name_ja as opponent_character_name,
      count(*)::integer as matches,
      count(*) filter (where m.result = 'win')::integer as wins,
      count(*) filter (where m.result = 'loss')::integer as losses,
      round(100.0 * count(*) filter (where m.result = 'win') / nullif(count(*), 0), 1) as win_rate
    from current_matches m
    join public.characters pc on pc.id = m.player_character_id
    join public.characters oc on oc.id = m.opponent_character_id
    group by m.player_character_id, pc.name_ja, m.opponent_character_id, oc.name_ja
  ),
  issue_rows as (
    select
      m.primary_issue as issue_key,
      case m.primary_issue
        when 'knowledge' then '知識不足'
        when 'execution' then '操作・コンボのミス'
        when 'decision' then '判断ミス'
        when 'habit' then '行動の癖'
        when 'matchup' then 'キャラクター対策不足'
        else '未分類'
      end as issue_label,
      count(*)::integer as issue_count,
      round(
        100.0 * count(*) / nullif((select count(*) from current_matches), 0),
        1
      ) as issue_rate
    from current_matches m
    group by m.primary_issue
  ),
  current_training as (
    select l.*, coalesce(l.training_name_snapshot, t.name) as training_name, coalesce(l.player_character_id_snapshot, t.player_character_id) as player_character_id
    from public.user_training_logs l
    left join public.trainings t on t.id = l.training_id
    cross join periods p
    where l.user_id = (select auth.uid())
      and l.practiced_at >= (p.week_start::timestamp at time zone 'Asia/Tokyo')
      and l.practiced_at < (p.week_end::timestamp at time zone 'Asia/Tokyo')
      and (
        p_player_character_id is null
        or coalesce(l.player_character_id_snapshot, t.player_character_id) = p_player_character_id
      )
  ),
  previous_training as (
    select l.*, coalesce(l.player_character_id_snapshot, t.player_character_id) as player_character_id
    from public.user_training_logs l
    left join public.trainings t on t.id = l.training_id
    cross join periods p
    where l.user_id = (select auth.uid())
      and l.practiced_at >= (p.previous_week_start::timestamp at time zone 'Asia/Tokyo')
      and l.practiced_at < (p.week_start::timestamp at time zone 'Asia/Tokyo')
      and (
        p_player_character_id is null
        or coalesce(l.player_character_id_snapshot, t.player_character_id) = p_player_character_id
      )
  ),
  current_training_summary as (
    select
      count(*)::integer as sessions,
      coalesce(sum(duration_minutes), 0)::integer as minutes,
      coalesce(sum(attempts), 0)::integer as attempts,
      coalesce(sum(successes), 0)::integer as successes,
      round(
        100.0 * coalesce(sum(successes), 0)
        / nullif(coalesce(sum(attempts), 0), 0),
        1
      ) as success_rate,
      round(avg(self_rating), 1) as average_self_rating
    from current_training
  ),
  previous_training_summary as (
    select
      count(*)::integer as sessions,
      coalesce(sum(duration_minutes), 0)::integer as minutes,
      coalesce(sum(attempts), 0)::integer as attempts,
      coalesce(sum(successes), 0)::integer as successes,
      round(
        100.0 * coalesce(sum(successes), 0)
        / nullif(coalesce(sum(attempts), 0), 0),
        1
      ) as success_rate,
      round(avg(self_rating), 1) as average_self_rating
    from previous_training
  ),
  training_rows as (
    select
      l.training_id,
      coalesce(l.training_name, l.custom_title, '自由練習') as training_name,
      count(*)::integer as sessions,
      coalesce(sum(l.duration_minutes), 0)::integer as minutes,
      round(
        100.0 * coalesce(sum(l.successes), 0)
        / nullif(coalesce(sum(l.attempts), 0), 0),
        1
      ) as success_rate,
      round(avg(l.self_rating), 1) as average_self_rating
    from current_training l
    group by l.training_id, coalesce(l.training_name, l.custom_title, '自由練習')
  ),
  completed_plans as (
    select count(*)::integer as completed
    from public.user_training_plans plan
    cross join periods p
    where plan.user_id = (select auth.uid())
      and plan.status = 'completed'
      and plan.completed_at >= (p.week_start::timestamp at time zone 'Asia/Tokyo')
      and plan.completed_at < (p.week_end::timestamp at time zone 'Asia/Tokyo')
  )
  select jsonb_build_object(
    'week_start', p.week_start,
    'week_end', p.week_end - 1,
    'player_character_id', p_player_character_id,
    'matches', to_jsonb(cms),
    'previous_week_matches', to_jsonb(pms),
    'matchups', coalesce((
      select jsonb_agg(to_jsonb(mr) order by mr.win_rate asc, mr.matches desc, mr.opponent_character_name)
      from matchup_rows mr
    ), '[]'::jsonb),
    'issues', coalesce((
      select jsonb_agg(to_jsonb(ir) order by ir.issue_count desc, ir.issue_key)
      from issue_rows ir
    ), '[]'::jsonb),
    'training', to_jsonb(cts) || jsonb_build_object('completed_plans', cp.completed),
    'previous_week_training', to_jsonb(pts),
    'training_items', coalesce((
      select jsonb_agg(to_jsonb(tr) order by tr.minutes desc, tr.training_name)
      from training_rows tr
    ), '[]'::jsonb)
  )
  from periods p
  cross join current_match_summary cms
  cross join previous_match_summary pms
  cross join current_training_summary cts
  cross join previous_training_summary pts
  cross join completed_plans cp;
$$;


--
-- Name: FUNCTION get_weekly_progress_review(p_week_start date, p_player_character_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_weekly_progress_review(p_week_start date, p_player_character_id uuid) IS 'Returns a read-only weekly review context for the authenticated user, including prior-week comparison, matchups, issues, training, and completed plans.';


--
-- Name: list_public_sources(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.list_public_sources() RETURNS TABLE(id uuid, title text, url text, source_type text, publisher text, published_at timestamp with time zone, accessed_at timestamp with time zone, reliability_level text)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public', 'private'
    AS $$
  select
    s.id,
    s.title,
    s.url,
    s.source_type,
    s.publisher,
    s.published_at,
    s.accessed_at,
    s.reliability_level
  from public.sources s;
$$;


--
-- Name: purge_expired_user_activity_logs(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.purge_expired_user_activity_logs(p_limit integer DEFAULT 5000) RETURNS integer
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_deleted integer;
  v_limit integer := greatest(1, least(coalesce(p_limit, 5000), 20000));
begin
  with expired as (
    select l.id
    from public.user_activity_logs l
    where l.retention_until <= now()
    order by l.retention_until, l.id
    limit v_limit
    for update skip locked
  )
  delete from public.user_activity_logs l
  using expired e
  where l.id = e.id;

  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;


--
-- Name: FUNCTION purge_expired_user_activity_logs(p_limit integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.purge_expired_user_activity_logs(p_limit integer) IS 'Server-only bounded cleanup for entries past their 180-day retention date. No schedule is created by this migration.';


--
-- Name: save_diagnosis_result_with_answers(uuid, jsonb, jsonb, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.save_diagnosis_result_with_answers(p_diagnosis_id uuid, p_result_payload jsonb, p_answers jsonb, p_request_id uuid DEFAULT NULL::uuid) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := (select auth.uid());
  v_expected_count integer;
  v_answer_count integer;
  v_valid_count integer;
  v_result_id uuid;
  v_existing_payload jsonb;
  v_existing_answers_match boolean;
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  if jsonb_typeof(p_answers) <> 'array' then
    raise exception 'answers_must_be_array';
  end if;

  select count(*)
    into v_expected_count
  from public.diagnosis_questions q
  where q.diagnosis_id = p_diagnosis_id
    and q.status = 'published';

  if v_expected_count = 0 then
    raise exception 'diagnosis_not_available';
  end if;

  select count(*)
    into v_answer_count
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid);

  if v_answer_count <> v_expected_count then
    raise exception 'answer_count_mismatch';
  end if;

  select count(*)
    into v_valid_count
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
  join public.diagnosis_questions q
    on q.id = a.question_id
   and q.diagnosis_id = p_diagnosis_id
   and q.status = 'published'
  join public.diagnosis_options o
    on o.id = a.option_id
   and o.question_id = a.question_id;

  if v_valid_count <> v_expected_count then
    raise exception 'invalid_question_or_option';
  end if;

  if (
    select count(distinct a.question_id)
    from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
  ) <> v_expected_count then
    raise exception 'duplicate_question_answer';
  end if;

  insert into public.diagnosis_results(
    user_id,
    diagnosis_id,
    result_payload,
    request_id
  )
  values (
    v_user_id,
    p_diagnosis_id,
    coalesce(p_result_payload, '{}'::jsonb),
    p_request_id
  )
  on conflict (user_id, diagnosis_id, request_id)
    where request_id is not null
  do nothing
  returning id into v_result_id;

  if v_result_id is null then
    select r.id, r.result_payload
      into v_result_id, v_existing_payload
    from public.diagnosis_results r
    where r.user_id = v_user_id
      and r.diagnosis_id = p_diagnosis_id
      and r.request_id = p_request_id
    ;

    if v_result_id is null then
      raise exception 'idempotency_conflict_without_result';
    end if;

    select
      count(*) = v_expected_count
      and not exists (
        select a.question_id, a.option_id
        from public.diagnosis_answers a
        where a.diagnosis_result_id = v_result_id
        except
        select j.question_id, j.option_id
        from jsonb_to_recordset(p_answers) as j(question_id uuid, option_id uuid)
      )
      and not exists (
        select j.question_id, j.option_id
        from jsonb_to_recordset(p_answers) as j(question_id uuid, option_id uuid)
        except
        select a.question_id, a.option_id
        from public.diagnosis_answers a
        where a.diagnosis_result_id = v_result_id
      )
      into v_existing_answers_match
    from public.diagnosis_answers a
    where a.diagnosis_result_id = v_result_id;

    if v_existing_payload is distinct from coalesce(p_result_payload, '{}'::jsonb)
       or not coalesce(v_existing_answers_match, false) then
      raise exception 'idempotency_key_reused_with_different_payload';
    end if;

    return v_result_id;
  end if;

  insert into public.diagnosis_answers(
    diagnosis_result_id,
    diagnosis_id,
    question_id,
    option_id
  )
  select
    v_result_id,
    p_diagnosis_id,
    a.question_id,
    a.option_id
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid);

  return v_result_id;
end;
$$;


--
-- Name: save_match_log(uuid, uuid, text, text, timestamp with time zone, text, text, text, integer, integer, smallint, smallint, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.save_match_log(p_player_character_id uuid, p_opponent_character_id uuid, p_result text, p_primary_issue text DEFAULT 'unknown'::text, p_played_at timestamp with time zone DEFAULT now(), p_mode text DEFAULT 'ranked'::text, p_rank_before text DEFAULT NULL::text, p_rank_after text DEFAULT NULL::text, p_mr_before integer DEFAULT NULL::integer, p_mr_after integer DEFAULT NULL::integer, p_rounds_won smallint DEFAULT NULL::smallint, p_rounds_lost smallint DEFAULT NULL::smallint, p_issue_detail text DEFAULT NULL::text, p_notes text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := (select auth.uid());
  v_match_log_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = p_player_character_id
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
    where c.id = p_opponent_character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected opponent character is not available.';
  end if;

  insert into public.user_match_logs (
    user_id,
    played_at,
    player_character_id,
    opponent_character_id,
    result,
    mode,
    rank_before,
    rank_after,
    mr_before,
    mr_after,
    rounds_won,
    rounds_lost,
    primary_issue,
    issue_detail,
    notes
  )
  values (
    v_user_id,
    coalesce(p_played_at, now()),
    p_player_character_id,
    p_opponent_character_id,
    p_result,
    coalesce(p_mode, 'ranked'),
    nullif(btrim(p_rank_before), ''),
    nullif(btrim(p_rank_after), ''),
    p_mr_before,
    p_mr_after,
    p_rounds_won,
    p_rounds_lost,
    coalesce(p_primary_issue, 'unknown'),
    nullif(btrim(p_issue_detail), ''),
    nullif(btrim(p_notes), '')
  )
  returning id into v_match_log_id;

  return v_match_log_id;
end;
$$;


--
-- Name: FUNCTION save_match_log(p_player_character_id uuid, p_opponent_character_id uuid, p_result text, p_primary_issue text, p_played_at timestamp with time zone, p_mode text, p_rank_before text, p_rank_after text, p_mr_before integer, p_mr_after integer, p_rounds_won smallint, p_rounds_lost smallint, p_issue_detail text, p_notes text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.save_match_log(p_player_character_id uuid, p_opponent_character_id uuid, p_result text, p_primary_issue text, p_played_at timestamp with time zone, p_mode text, p_rank_before text, p_rank_after text, p_mr_before integer, p_mr_after integer, p_rounds_won smallint, p_rounds_lost smallint, p_issue_detail text, p_notes text) IS 'Saves one authenticated user match log with a minimal 30-second input path.';


--
-- Name: save_training_completion(integer, uuid, uuid, text, timestamp with time zone, integer, integer, smallint, text, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.save_training_completion(p_duration_minutes integer, p_training_plan_id uuid DEFAULT NULL::uuid, p_training_id uuid DEFAULT NULL::uuid, p_custom_title text DEFAULT NULL::text, p_practiced_at timestamp with time zone DEFAULT now(), p_attempts integer DEFAULT NULL::integer, p_successes integer DEFAULT NULL::integer, p_self_rating smallint DEFAULT NULL::smallint, p_notes text DEFAULT NULL::text, p_mark_plan_completed boolean DEFAULT true) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := (select auth.uid());
  v_plan_training_id uuid;
  v_training_id uuid := p_training_id;
  v_training_log_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if p_training_plan_id is not null then
    select p.training_id
      into v_plan_training_id
    from public.user_training_plans p
    where p.id = p_training_plan_id
      and p.user_id = v_user_id;

    if v_plan_training_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected training plan is not available.';
    end if;

    if v_training_id is not null and v_training_id <> v_plan_training_id then
      raise exception using
        errcode = '22023',
        message = 'The training does not match the selected plan.';
    end if;

    v_training_id := v_plan_training_id;
  end if;

  if v_training_id is null and nullif(btrim(p_custom_title), '') is null then
    raise exception using
      errcode = '22023',
      message = 'A training or custom title is required.';
  end if;

  if v_training_id is not null and not exists (
    select 1
    from public.trainings t
    where t.id = v_training_id
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected training is not available.';
  end if;

  insert into public.user_training_logs (
    user_id,
    training_plan_id,
    training_id,
    custom_title,
    practiced_at,
    duration_minutes,
    attempts,
    successes,
    self_rating,
    notes
  )
  values (
    v_user_id,
    p_training_plan_id,
    v_training_id,
    case
      when v_training_id is null then nullif(btrim(p_custom_title), '')
      else null
    end,
    coalesce(p_practiced_at, now()),
    p_duration_minutes,
    p_attempts,
    p_successes,
    p_self_rating,
    nullif(btrim(p_notes), '')
  )
  returning id into v_training_log_id;

  if p_training_plan_id is not null and coalesce(p_mark_plan_completed, true) then
    update public.user_training_plans
    set
      status = 'completed',
      completed_at = coalesce(p_practiced_at, now())
    where id = p_training_plan_id
      and user_id = v_user_id;
  end if;

  return v_training_log_id;
end;
$$;


--
-- Name: FUNCTION save_training_completion(p_duration_minutes integer, p_training_plan_id uuid, p_training_id uuid, p_custom_title text, p_practiced_at timestamp with time zone, p_attempts integer, p_successes integer, p_self_rating smallint, p_notes text, p_mark_plan_completed boolean); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.save_training_completion(p_duration_minutes integer, p_training_plan_id uuid, p_training_id uuid, p_custom_title text, p_practiced_at timestamp with time zone, p_attempts integer, p_successes integer, p_self_rating smallint, p_notes text, p_mark_plan_completed boolean) IS 'Atomically saves an authenticated user training log and optionally completes its linked plan.';


--
-- Name: search_sf6dna(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_sf6dna(search_query text, result_limit integer DEFAULT 30) RETURNS TABLE(entity_type text, entity_id uuid, slug text, title text, subtitle text, matched_by text, score real)
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'extensions'
    AS $$
with q as (
  select lower(trim(search_query)) as term
), candidates(entity_type, entity_id, slug, title, subtitle, matched_by, score) as (
  select 'character'::text, c.id, c.slug, c.name_ja, c.summary, 'name'::text,
    greatest(similarity(lower(c.name_ja), q.term), case when lower(c.name_ja)=q.term then 1 else 0 end)::real
  from public.characters c cross join q
  where c.status='published' and (lower(c.name_ja) like '%'||q.term||'%' or lower(coalesce(c.name_en,'')) like '%'||q.term||'%' or similarity(lower(c.name_ja), q.term) > 0.2)
  union all
  select 'character', c.id, c.slug, c.name_ja, '別名: '||a.alias, 'alias', greatest(similarity(a.normalized_alias,q.term),case when a.normalized_alias=q.term then 1 else 0 end)::real
  from public.character_aliases a join public.characters c on c.id=a.character_id cross join q
  where c.status='published' and (a.normalized_alias like '%'||q.term||'%' or similarity(a.normalized_alias,q.term)>0.2)
  union all
  select 'move',m.id,m.slug,m.name_ja,c.name_ja,'name',greatest(similarity(lower(m.name_ja),q.term),case when lower(m.name_ja)=q.term then 1 else 0 end)::real
  from public.moves m join public.characters c on c.id=m.character_id cross join q
  where m.status='published' and c.status='published' and (lower(m.name_ja) like '%'||q.term||'%' or lower(coalesce(m.name_en,'')) like '%'||q.term||'%' or similarity(lower(m.name_ja),q.term)>0.2)
  union all
  select 'move',m.id,m.slug,m.name_ja,'別名: '||a.alias||' / '||c.name_ja,'alias',greatest(similarity(a.normalized_alias,q.term),case when a.normalized_alias=q.term then 1 else 0 end)::real
  from public.move_aliases a join public.moves m on m.id=a.move_id join public.characters c on c.id=m.character_id cross join q
  where m.status='published' and c.status='published' and (a.normalized_alias like '%'||q.term||'%' or similarity(a.normalized_alias,q.term)>0.2)
  union all
  select 'combo',x.id,x.slug,x.name,c.name_ja,'content',similarity(lower(x.name),q.term)::real
  from public.combos x join public.characters c on c.id=x.character_id cross join q
  where x.status='published' and x.verification_status='verified' and (lower(x.name) like '%'||q.term||'%' or lower(coalesce(x.purpose,'')) like '%'||q.term||'%' or lower(coalesce(x.notation,'')) like '%'||q.term||'%')
  union all
  select 'setup',x.id,x.slug,x.name,c.name_ja,'content',similarity(lower(x.name),q.term)::real
  from public.setups x join public.characters c on c.id=x.character_id cross join q
  where x.status='published' and x.verification_status='verified' and (lower(x.name) like '%'||q.term||'%' or lower(coalesce(x.description,'')) like '%'||q.term||'%' or lower(coalesce(x.sequence_text,'')) like '%'||q.term||'%')
  union all
  select 'sequence',x.id,x.slug,x.name,c.name_ja,'content',similarity(lower(x.name),q.term)::real
  from public.sequences x join public.characters c on c.id=x.character_id cross join q
  where x.status='published' and x.verification_status='verified' and (lower(x.name) like '%'||q.term||'%' or lower(coalesce(x.sequence_text,'')) like '%'||q.term||'%' or lower(coalesce(x.notes,'')) like '%'||q.term||'%')
  union all
  select 'counter',x.id,x.slug,x.title,x.summary,'content',similarity(lower(x.title),q.term)::real
  from public.counters x cross join q
  where x.status='published' and x.verification_status='verified' and (lower(x.title) like '%'||q.term||'%' or lower(coalesce(x.summary,'')) like '%'||q.term||'%' or lower(coalesce(x.situation,'')) like '%'||q.term||'%')
  union all
  select 'training',x.id,x.slug,x.name,x.purpose,'content',similarity(lower(x.name),q.term)::real
  from public.trainings x cross join q
  where x.status='published' and x.verification_status='verified' and (lower(x.name) like '%'||q.term||'%' or lower(coalesce(x.purpose,'')) like '%'||q.term||'%' or lower(coalesce(x.method,'')) like '%'||q.term||'%')
  union all
  select 'player',p.id,p.slug,p.display_name,coalesce(p.team_name,p.player_type),'name',greatest(similarity(lower(p.display_name),q.term),case when lower(p.display_name)=q.term then 1 else 0 end)::real
  from public.players p cross join q
  where p.status='published' and (lower(p.display_name) like '%'||q.term||'%' or similarity(lower(p.display_name),q.term)>0.2)
  union all
  select 'player',p.id,p.slug,p.display_name,'別名: '||a.alias,'alias',greatest(similarity(a.normalized_alias,q.term),case when a.normalized_alias=q.term then 1 else 0 end)::real
  from public.player_aliases a join public.players p on p.id=a.player_id cross join q
  where p.status='published' and (a.normalized_alias like '%'||q.term||'%' or similarity(a.normalized_alias,q.term)>0.2)
  union all
  select 'tournament',t.id,t.slug,t.name,t.series_name,'name',similarity(lower(t.name),q.term)::real
  from public.tournaments t cross join q
  where t.status='published' and (lower(t.name) like '%'||q.term||'%' or lower(coalesce(t.series_name,'')) like '%'||q.term||'%')
  union all
  select 'video',v.id,v.slug,v.title,v.video_type,'content',similarity(lower(v.title),q.term)::real
  from public.videos v cross join q
  where v.status='published' and (lower(v.title) like '%'||q.term||'%' or lower(coalesce(v.description,'')) like '%'||q.term||'%')
  union all
  select 'glossary',g.id,g.slug,g.term,g.short_definition,'name',greatest(similarity(lower(g.term),q.term),case when lower(g.term)=q.term then 1 else 0 end)::real
  from public.glossary g cross join q
  where g.status='published' and (lower(g.term) like '%'||q.term||'%' or lower(coalesce(g.definition,'')) like '%'||q.term||'%' or similarity(lower(g.term),q.term)>0.2)
  union all
  select 'glossary',g.id,g.slug,g.term,'別名: '||a.alias,'alias',greatest(similarity(a.normalized_alias,q.term),case when a.normalized_alias=q.term then 1 else 0 end)::real
  from public.glossary_aliases a join public.glossary g on g.id=a.glossary_id cross join q
  where g.status='published' and (a.normalized_alias like '%'||q.term||'%' or similarity(a.normalized_alias,q.term)>0.2)
), ranked as (
  select *, row_number() over (partition by entity_type,entity_id order by score desc,matched_by) rn from candidates
)
select entity_type,entity_id,slug,title,subtitle,matched_by,score
from ranked where rn=1
order by score desc,title
limit greatest(1,least(result_limit,100));
$$;


--
-- Name: set_current_patch(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_current_patch(target_patch_id uuid) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
begin
  if not private.is_admin() then
    raise exception 'admin required' using errcode = '42501';
  end if;

  if not exists (select 1 from public.patches where id = target_patch_id) then
    raise exception 'patch not found' using errcode = 'P0002';
  end if;

  update public.patches
  set is_current = false
  where is_current = true
    and id <> target_patch_id;

  update public.patches
  set is_current = true
  where id = target_patch_id;
end;
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


--
-- Name: start_ai_coach_session(text, text, uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.start_ai_coach_session(p_title text DEFAULT NULL::text, p_coach_tone text DEFAULT NULL::text, p_character_id uuid DEFAULT NULL::uuid, p_diagnosis_result_id uuid DEFAULT NULL::uuid) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := (select auth.uid());
  v_coach_tone text;
  v_character_id uuid;
  v_diagnosis_result_id uuid;
  v_session_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  select
    coalesce(p_coach_tone, gp.coach_tone, 'analytical'),
    coalesce(p_character_id, gp.main_character_id)
  into v_coach_tone, v_character_id
  from (select 1) seed
  left join public.user_game_profiles gp
    on gp.user_id = v_user_id;

  if v_coach_tone not in ('gentle', 'strict', 'analytical') then
    raise exception using
      errcode = '22023',
      message = 'The selected coach tone is not available.';
  end if;

  if v_character_id is not null and not exists (
    select 1
    from public.characters c
    where c.id = v_character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected character is not available.';
  end if;

  if p_diagnosis_result_id is not null then
    select r.id
    into v_diagnosis_result_id
    from public.diagnosis_results r
    where r.id = p_diagnosis_result_id
      and r.user_id = v_user_id;

    if v_diagnosis_result_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected diagnosis result is not available.';
    end if;
  else
    select r.id
    into v_diagnosis_result_id
    from public.diagnosis_results r
    join public.diagnoses d
      on d.id = r.diagnosis_id
     and d.diagnosis_type = 'improvement'
    where r.user_id = v_user_id
    order by r.created_at desc, r.id desc
    limit 1;
  end if;

  insert into public.ai_coach_sessions (
    user_id,
    title,
    coach_tone,
    character_id,
    diagnosis_result_id,
    status
  )
  values (
    v_user_id,
    coalesce(
      nullif(btrim(p_title), ''),
      '振り返り ' || pg_catalog.to_char(pg_catalog.timezone('Asia/Tokyo', now()), 'YYYY/MM/DD')
    ),
    v_coach_tone,
    v_character_id,
    v_diagnosis_result_id,
    'active'
  )
  returning id into v_session_id;

  return v_session_id;
end;
$$;


--
-- Name: FUNCTION start_ai_coach_session(p_title text, p_coach_tone text, p_character_id uuid, p_diagnosis_result_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.start_ai_coach_session(p_title text, p_coach_tone text, p_character_id uuid, p_diagnosis_result_id uuid) IS 'Starts an authenticated user AI coach session. Tone and character default to the game profile; diagnosis defaults to the latest improvement result.';


--
-- Name: start_ai_coach_session_from_quick_help(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.start_ai_coach_session_from_quick_help(p_intake_id uuid, p_coach_tone text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $_$
declare
  v_user_id uuid := (select auth.uid());
  v_context jsonb;
  v_topic_key text;
  v_player_character_id uuid;
  v_title text;
  v_problem_summary text;
  v_user_message text;
  v_session_id uuid;
  v_message_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  select i.context, i.topic_key
  into v_context, v_topic_key
  from public.coach_quick_help_intakes i
  where i.id = p_intake_id
    and i.user_id = v_user_id
    and i.status = 'ready'
    and i.ai_coach_session_id is null
  for update;

  if v_context is null then
    raise exception using
      errcode = '22023',
      message = 'The selected quick-help intake is not ready.';
  end if;

  v_player_character_id := case
    when v_context #>> '{player_character_id,value}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then (v_context #>> '{player_character_id,value}')::uuid
    else null::uuid
  end;

  v_problem_summary := concat_ws(
    ' / ',
    nullif(v_context #>> '{topic_key,label}', ''),
    case
      when nullif(v_context #>> '{opponent_character_id,label}', '') is not null
        then '相手：' || (v_context #>> '{opponent_character_id,label}')
      else null
    end,
    case
      when nullif(v_context #>> '{opponent_move_id,label}', '') is not null
        then '技：' || (v_context #>> '{opponent_move_id,label}')
      else null
    end,
    nullif(v_context #>> '{situation_key,label}', '')
  );

  v_title := left(
    'クイック相談：' ||
    coalesce(
      nullif(v_context #>> '{opponent_move_id,label}', ''),
      nullif(v_context #>> '{opponent_character_id,label}', ''),
      nullif(v_context #>> '{topic_key,label}', ''),
      '困りごと'
    ),
    120
  );

  if nullif(v_context #>> '{question_detail,value}', '') is not null then
    v_user_message :=
      'クイック相談です。' ||
      (v_context #>> '{question_detail,value}') ||
      '。対策と、今すぐ確認できるポイントを教えてください。';
  else
    v_user_message :=
      'クイック相談です。' ||
      coalesce(nullif(v_problem_summary, ''), '対戦中の困りごと') ||
      'について困っています。対策と、今すぐ確認できるポイントを教えてください。';
  end if;

  v_session_id := public.start_ai_coach_session(
    v_title,
    p_coach_tone,
    v_player_character_id,
    null
  );

  v_message_id := public.append_ai_coach_user_message(
    v_session_id,
    v_user_message
  );

  update public.coach_quick_help_intakes
  set
    ai_coach_session_id = v_session_id,
    status = 'linked'
  where id = p_intake_id
    and user_id = v_user_id;

  return jsonb_build_object(
    'intake_id', p_intake_id,
    'session_id', v_session_id,
    'user_message_id', v_message_id,
    'topic_key', v_topic_key,
    'context', v_context,
    'grounding', public.get_quick_help_grounding(p_intake_id, 5)
  );
end;
$_$;


--
-- Name: FUNCTION start_ai_coach_session_from_quick_help(p_intake_id uuid, p_coach_tone text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.start_ai_coach_session_from_quick_help(p_intake_id uuid, p_coach_tone text) IS 'Creates an AI coach session and initial user message from a completed quick-help branch, then links the two atomically.';


--
-- Name: start_quick_help_intake(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.start_quick_help_intake(p_flow_slug text DEFAULT 'quick-help'::text) RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_user_id uuid := (select auth.uid());
  v_flow_id uuid;
  v_root_node_id uuid;
  v_root_node_key text;
  v_intake_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required to save quick-help history.';
  end if;

  select f.id, f.root_node_id, n.node_key
  into v_flow_id, v_root_node_id, v_root_node_key
  from public.coach_quick_help_flows f
  join public.coach_quick_help_nodes n on n.id = f.root_node_id
  where f.slug = p_flow_slug
    and (f.status = 'published' or (select private.is_admin()));

  if v_flow_id is null or v_root_node_id is null then
    raise exception using
      errcode = '22023',
      message = 'The selected quick-help flow is not available.';
  end if;

  insert into public.coach_quick_help_intakes (
    user_id,
    flow_id,
    current_node_id,
    status,
    context
  )
  values (
    v_user_id,
    v_flow_id,
    v_root_node_id,
    'active',
    '{}'::jsonb
  )
  returning id into v_intake_id;

  return jsonb_build_object(
    'intake_id', v_intake_id,
    'status', 'active',
    'context', '{}'::jsonb,
    'step', public.get_quick_help_node(p_flow_slug, v_root_node_key, '{}'::jsonb)
  );
end;
$$;


--
-- Name: FUNCTION start_quick_help_intake(p_flow_slug text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.start_quick_help_intake(p_flow_slug text) IS 'Starts a saved quick-help intake for an authenticated user. Guest flows remain browser-local.';


--
-- Name: submit_contact(text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.submit_contact(p_category text, p_message text, p_reply_email text, p_target_url text DEFAULT NULL::text, p_requester_key text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
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
$_$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE sql IMMUTABLE
    AS $$ select string_to_array(name,'/') $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    id uuid DEFAULT extensions.gen_random_uuid() NOT NULL,
    email text,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
    raw_app_meta_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: contact_inbox_config; Type: TABLE; Schema: private; Owner: -
--

CREATE TABLE private.contact_inbox_config (
    singleton boolean DEFAULT true NOT NULL,
    rate_secret bytea NOT NULL,
    CONSTRAINT contact_inbox_config_rate_secret_check CHECK ((octet_length(rate_secret) = 32)),
    CONSTRAINT contact_inbox_config_singleton_check CHECK (singleton)
);


--
-- Name: ai_coach_generations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_coach_generations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    user_id uuid NOT NULL,
    user_message_id uuid,
    assistant_message_id uuid,
    model text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    prompt_hash text,
    input_tokens integer,
    output_tokens integer,
    total_tokens integer,
    estimated_cost_usd numeric(12,6),
    latency_ms integer,
    error_code text,
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    CONSTRAINT ai_coach_generations_cost_check CHECK (((estimated_cost_usd IS NULL) OR (estimated_cost_usd >= (0)::numeric))),
    CONSTRAINT ai_coach_generations_error_code_length_check CHECK (((error_code IS NULL) OR (char_length(error_code) <= 120))),
    CONSTRAINT ai_coach_generations_error_message_length_check CHECK (((error_message IS NULL) OR (char_length(error_message) <= 2000))),
    CONSTRAINT ai_coach_generations_latency_check CHECK (((latency_ms IS NULL) OR (latency_ms >= 0))),
    CONSTRAINT ai_coach_generations_prompt_hash_length_check CHECK (((prompt_hash IS NULL) OR (char_length(prompt_hash) <= 128))),
    CONSTRAINT ai_coach_generations_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'streaming'::text, 'complete'::text, 'error'::text]))),
    CONSTRAINT ai_coach_generations_token_counts_check CHECK ((((input_tokens IS NULL) OR (input_tokens >= 0)) AND ((output_tokens IS NULL) OR (output_tokens >= 0)) AND ((total_tokens IS NULL) OR (total_tokens >= 0))))
);


--
-- Name: ai_coach_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_coach_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    grounding_refs jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ai_coach_messages_content_length_check CHECK (((char_length(content) >= 1) AND (char_length(content) <= 20000))),
    CONSTRAINT ai_coach_messages_grounding_refs_check CHECK ((jsonb_typeof(grounding_refs) = 'array'::text)),
    CONSTRAINT ai_coach_messages_nonblank_content_check CHECK ((btrim(content) <> ''::text)),
    CONSTRAINT ai_coach_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text]))),
    CONSTRAINT ai_coach_user_messages_no_grounding_check CHECK (((role <> 'user'::text) OR (grounding_refs = '[]'::jsonb)))
);


--
-- Name: ai_coach_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_coach_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text,
    coach_tone text DEFAULT 'analytical'::text NOT NULL,
    character_id uuid,
    diagnosis_result_id uuid,
    status text DEFAULT 'active'::text NOT NULL,
    summary text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ai_coach_sessions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'archived'::text]))),
    CONSTRAINT ai_coach_sessions_summary_length_check CHECK (((summary IS NULL) OR (char_length(summary) <= 4000))),
    CONSTRAINT ai_coach_sessions_title_length_check CHECK (((title IS NULL) OR (char_length(title) <= 120))),
    CONSTRAINT ai_coach_sessions_tone_check CHECK ((coach_tone = ANY (ARRAY['gentle'::text, 'strict'::text, 'analytical'::text])))
);


--
-- Name: capture_backlog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.capture_backlog (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    training_id uuid NOT NULL,
    capture_status text DEFAULT 'pending'::text NOT NULL,
    priority smallint DEFAULT 100 NOT NULL,
    request_notes text,
    result_notes text,
    requested_at timestamp with time zone,
    provided_at timestamp with time zone,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT capture_backlog_capture_status_check CHECK ((capture_status = ANY (ARRAY['pending'::text, 'provided'::text, 'confirmed'::text, 'rejected'::text, 'not_needed'::text]))),
    CONSTRAINT capture_backlog_priority_check CHECK (((priority >= 1) AND (priority <= 999)))
);


--
-- Name: character_aliases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_aliases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    alias text NOT NULL,
    normalized_alias text NOT NULL,
    locale text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: character_content_packages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_content_packages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    rollout_status text DEFAULT 'not_started'::text NOT NULL,
    move_status text DEFAULT 'not_started'::text NOT NULL,
    frame_status text DEFAULT 'not_started'::text NOT NULL,
    command_status text DEFAULT 'not_started'::text NOT NULL,
    alias_status text DEFAULT 'not_started'::text NOT NULL,
    combo_status text DEFAULT 'not_started'::text NOT NULL,
    setup_status text DEFAULT 'not_started'::text NOT NULL,
    sequence_status text DEFAULT 'not_started'::text NOT NULL,
    counter_status text DEFAULT 'not_started'::text NOT NULL,
    training_status text DEFAULT 'not_started'::text NOT NULL,
    player_status text DEFAULT 'not_started'::text NOT NULL,
    video_status text DEFAULT 'not_started'::text NOT NULL,
    trait_status text DEFAULT 'not_started'::text NOT NULL,
    source_status text DEFAULT 'not_started'::text NOT NULL,
    patch_status text DEFAULT 'not_started'::text NOT NULL,
    verification_status text DEFAULT 'not_started'::text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT character_content_packages_rollout_status_check CHECK ((rollout_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text]))),
    CONSTRAINT character_content_packages_stage_check CHECK (((move_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (frame_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (command_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (alias_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (combo_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (setup_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (sequence_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (counter_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (training_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (player_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (video_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (trait_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (source_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (patch_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text])) AND (verification_status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'review'::text, 'complete'::text, 'blocked'::text]))))
);


--
-- Name: character_guide_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_guide_sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    section_type text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    summary text,
    difficulty_level text,
    display_order integer DEFAULT 0 NOT NULL,
    valid_from_patch_id uuid,
    valid_to_patch_id uuid,
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    content_kind text DEFAULT 'editorial'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT character_guide_sections_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: character_trait_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_trait_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    trait_id uuid NOT NULL,
    score smallint NOT NULL,
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    source_id uuid,
    note text,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT character_trait_scores_score_check CHECK (((score >= 0) AND (score <= 5))),
    CONSTRAINT character_trait_scores_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text]))),
    CONSTRAINT character_trait_scores_verification_status_check CHECK ((verification_status = ANY (ARRAY['unverified'::text, 'reviewed'::text, 'verified'::text])))
);


--
-- Name: character_traits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_traits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trait_key text NOT NULL,
    label text NOT NULL,
    description text,
    display_order integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT character_traits_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: characters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.characters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name_ja text NOT NULL,
    name_en text,
    short_name text,
    image_url text,
    release_date date,
    archetype text,
    difficulty smallint,
    preferred_range text,
    summary text,
    strengths_summary text,
    weaknesses_summary text,
    is_playable boolean DEFAULT true NOT NULL,
    display_order integer,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT characters_difficulty_check CHECK (((difficulty >= 1) AND (difficulty <= 5))),
    CONSTRAINT characters_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: coach_quick_help_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach_quick_help_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    intake_id uuid NOT NULL,
    user_id uuid NOT NULL,
    node_id uuid NOT NULL,
    option_id uuid,
    selected_character_id uuid,
    selected_move_id uuid,
    free_text text,
    answer_payload jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT coach_quick_help_answers_answer_payload_check CHECK ((jsonb_typeof(answer_payload) = 'object'::text)),
    CONSTRAINT coach_quick_help_answers_check CHECK ((num_nonnulls(option_id, selected_character_id, selected_move_id, free_text) = 1)),
    CONSTRAINT coach_quick_help_answers_free_text_check CHECK (((free_text IS NULL) OR ((char_length(free_text) >= 1) AND (char_length(free_text) <= 2000))))
);


--
-- Name: coach_quick_help_flows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach_quick_help_flows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    root_node_id uuid,
    version integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT coach_quick_help_flows_description_check CHECK (((description IS NULL) OR (char_length(description) <= 1000))),
    CONSTRAINT coach_quick_help_flows_slug_check CHECK (((char_length(slug) >= 1) AND (char_length(slug) <= 100))),
    CONSTRAINT coach_quick_help_flows_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text]))),
    CONSTRAINT coach_quick_help_flows_title_check CHECK (((char_length(title) >= 1) AND (char_length(title) <= 160))),
    CONSTRAINT coach_quick_help_flows_version_check CHECK ((version >= 1))
);


--
-- Name: coach_quick_help_intakes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach_quick_help_intakes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    flow_id uuid NOT NULL,
    current_node_id uuid,
    ai_coach_session_id uuid,
    status text DEFAULT 'active'::text NOT NULL,
    topic_key text,
    context jsonb DEFAULT '{}'::jsonb NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT coach_quick_help_intakes_context_check CHECK ((jsonb_typeof(context) = 'object'::text)),
    CONSTRAINT coach_quick_help_intakes_status_check CHECK ((status = ANY (ARRAY['active'::text, 'ready'::text, 'linked'::text, 'abandoned'::text]))),
    CONSTRAINT coach_quick_help_intakes_topic_key_check CHECK (((topic_key IS NULL) OR (char_length(topic_key) <= 100)))
);


--
-- Name: coach_quick_help_nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach_quick_help_nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    flow_id uuid NOT NULL,
    node_key text NOT NULL,
    node_type text NOT NULL,
    prompt text NOT NULL,
    input_type text NOT NULL,
    answer_key text,
    topic_key text,
    default_next_node_id uuid,
    help_text text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT coach_quick_help_nodes_answer_key_check CHECK (((answer_key IS NULL) OR (char_length(answer_key) <= 100))),
    CONSTRAINT coach_quick_help_nodes_check CHECK ((((node_type = 'handoff'::text) AND (input_type = 'none'::text)) OR ((node_type = 'question'::text) AND (input_type <> 'none'::text)))),
    CONSTRAINT coach_quick_help_nodes_help_text_check CHECK (((help_text IS NULL) OR (char_length(help_text) <= 500))),
    CONSTRAINT coach_quick_help_nodes_input_type_check CHECK ((input_type = ANY (ARRAY['static'::text, 'character'::text, 'move'::text, 'free_text'::text, 'none'::text]))),
    CONSTRAINT coach_quick_help_nodes_node_key_check CHECK (((char_length(node_key) >= 1) AND (char_length(node_key) <= 100))),
    CONSTRAINT coach_quick_help_nodes_node_type_check CHECK ((node_type = ANY (ARRAY['question'::text, 'handoff'::text]))),
    CONSTRAINT coach_quick_help_nodes_prompt_check CHECK (((char_length(prompt) >= 1) AND (char_length(prompt) <= 500))),
    CONSTRAINT coach_quick_help_nodes_topic_key_check CHECK (((topic_key IS NULL) OR (char_length(topic_key) <= 100)))
);


--
-- Name: coach_quick_help_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach_quick_help_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    node_id uuid NOT NULL,
    option_key text NOT NULL,
    label text NOT NULL,
    option_value text NOT NULL,
    next_node_id uuid NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT coach_quick_help_options_label_check CHECK (((char_length(label) >= 1) AND (char_length(label) <= 200))),
    CONSTRAINT coach_quick_help_options_metadata_check CHECK ((jsonb_typeof(metadata) = 'object'::text)),
    CONSTRAINT coach_quick_help_options_option_key_check CHECK (((char_length(option_key) >= 1) AND (char_length(option_key) <= 100))),
    CONSTRAINT coach_quick_help_options_option_value_check CHECK (((char_length(option_value) >= 1) AND (char_length(option_value) <= 200)))
);


--
-- Name: combo_moves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.combo_moves (
    combo_id uuid NOT NULL,
    move_id uuid NOT NULL,
    step_order integer NOT NULL,
    note text
);


--
-- Name: combos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.combos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    combo_type text NOT NULL,
    notation text NOT NULL,
    starter_text text,
    damage integer,
    drive_cost numeric(5,2),
    drive_gain numeric(5,2),
    sa_cost smallint,
    "position" text,
    side_requirement text,
    difficulty smallint,
    purpose text,
    conditions text,
    notes text,
    video_url text,
    valid_from_patch_id uuid,
    valid_to_patch_id uuid,
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    content_kind text DEFAULT 'verified_strategy'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT combos_difficulty_check CHECK (((difficulty >= 1) AND (difficulty <= 5))),
    CONSTRAINT combos_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: contact_inbox; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_inbox (
    id uuid DEFAULT extensions.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    category text NOT NULL,
    message text NOT NULL,
    reply_email text NOT NULL,
    target_url text,
    user_id uuid,
    requester_hash text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    CONSTRAINT contact_inbox_category_check CHECK ((category = ANY (ARRAY['不具合報告'::text, 'データ修正依頼'::text, '機能要望'::text, 'プレイヤー・動画情報の修正'::text, '権利・プライバシー'::text, 'その他'::text]))),
    CONSTRAINT contact_inbox_message_check CHECK (((char_length(message) >= 10) AND (char_length(message) <= 4000))),
    CONSTRAINT contact_inbox_reply_email_check CHECK ((((char_length(reply_email) >= 3) AND (char_length(reply_email) <= 254)) AND (reply_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'::text))),
    CONSTRAINT contact_inbox_requester_hash_check CHECK ((requester_hash ~ '^[0-9a-f]{64}$'::text)),
    CONSTRAINT contact_inbox_status_check CHECK ((status = ANY (ARRAY['new'::text, 'triaged'::text, 'closed'::text]))),
    CONSTRAINT contact_inbox_target_url_check CHECK (((target_url IS NULL) OR ((char_length(target_url) <= 2048) AND (target_url ~ '^https?://'::text))))
);


--
-- Name: TABLE contact_inbox; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.contact_inbox IS 'Private contact inbox. No public row access; submissions are accepted only through the validated submit_contact RPC and retained for at most 180 days.';


--
-- Name: COLUMN contact_inbox.requester_hash; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contact_inbox.requester_hash IS 'HMAC-SHA256 pseudonymous abuse-control key. Raw requester IP is never stored.';


--
-- Name: counters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.counters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    defender_character_id uuid,
    opponent_character_id uuid,
    target_type text NOT NULL,
    target_id uuid,
    situation text,
    counter_type text,
    title text NOT NULL,
    summary text,
    method text,
    benefit text,
    risk text,
    difficulty smallint,
    conditions text,
    valid_from_patch_id uuid,
    valid_to_patch_id uuid,
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    content_kind text DEFAULT 'verified_strategy'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT counters_difficulty_check CHECK (((difficulty >= 1) AND (difficulty <= 5))),
    CONSTRAINT counters_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: diagnoses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diagnoses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    diagnosis_type text NOT NULL,
    question_count integer DEFAULT 0 NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT diagnoses_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: diagnosis_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diagnosis_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    diagnosis_result_id uuid NOT NULL,
    diagnosis_id uuid NOT NULL,
    question_id uuid NOT NULL,
    option_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: diagnosis_focus_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diagnosis_focus_rules (
    focus_key text NOT NULL,
    label text NOT NULL,
    training_types text[] NOT NULL,
    default_duration_minutes smallint DEFAULT 10 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT diagnosis_focus_rules_duration_check CHECK (((default_duration_minutes >= 1) AND (default_duration_minutes <= 180))),
    CONSTRAINT diagnosis_focus_rules_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text]))),
    CONSTRAINT diagnosis_focus_rules_training_types_not_empty CHECK ((cardinality(training_types) > 0))
);


--
-- Name: diagnosis_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diagnosis_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question_id uuid NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    score_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: diagnosis_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diagnosis_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    diagnosis_id uuid NOT NULL,
    prompt text NOT NULL,
    help_text text,
    display_order integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT diagnosis_questions_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: diagnosis_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diagnosis_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    diagnosis_id uuid NOT NULL,
    result_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id uuid,
    CONSTRAINT diagnosis_results_payload_object_check CHECK ((jsonb_typeof(result_payload) = 'object'::text))
);


--
-- Name: COLUMN diagnosis_results.request_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.diagnosis_results.request_id IS 'Client-generated idempotency key. Reusing the same key for the same user and diagnosis returns the existing result.';


--
-- Name: entity_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entity_sources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    source_id uuid NOT NULL,
    relationship text DEFAULT 'supporting'::text NOT NULL,
    note text
);


--
-- Name: entity_videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entity_videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    video_id uuid NOT NULL,
    relationship text DEFAULT 'related'::text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: glossary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glossary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    term text NOT NULL,
    short_definition text,
    definition text,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT glossary_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: glossary_aliases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.glossary_aliases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    glossary_id uuid NOT NULL,
    alias text NOT NULL,
    normalized_alias text NOT NULL
);


--
-- Name: match_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.match_participants (
    match_id uuid NOT NULL,
    player_id uuid NOT NULL,
    side smallint NOT NULL,
    character_id uuid,
    is_winner boolean
);


--
-- Name: matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.matches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tournament_id uuid,
    round_name text,
    played_at timestamp with time zone,
    best_of integer,
    winner_player_id uuid,
    score_text text,
    video_id uuid,
    notes text,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT matches_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: move_aliases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.move_aliases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    move_id uuid NOT NULL,
    alias text NOT NULL,
    normalized_alias text NOT NULL,
    alias_type text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: move_commands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.move_commands (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    move_id uuid NOT NULL,
    control_scheme text NOT NULL,
    command_text text NOT NULL,
    numeric_notation text,
    button_notation text,
    condition_text text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT move_commands_control_scheme_check CHECK ((control_scheme = ANY (ARRAY['classic'::text, 'modern'::text])))
);


--
-- Name: move_frame_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.move_frame_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    move_id uuid NOT NULL,
    startup text,
    active text,
    recovery text,
    on_hit text,
    on_block text,
    damage integer,
    drive_damage integer,
    super_gain integer,
    cancel_type text,
    hit_level text,
    invincibility text,
    notes text,
    valid_from_patch_id uuid,
    valid_to_patch_id uuid,
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: move_motion_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.move_motion_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    move_id uuid NOT NULL,
    media_type text NOT NULL,
    media_url text NOT NULL,
    poster_url text,
    source_url text,
    source_label text,
    status text DEFAULT 'draft'::text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    storage_path text,
    CONSTRAINT move_motion_media_media_type_check CHECK ((media_type = ANY (ARRAY['gif'::text, 'video'::text]))),
    CONSTRAINT move_motion_media_published_source_check CHECK (((status <> 'published'::text) OR ((NULLIF(btrim(media_url), ''::text) IS NOT NULL) AND (NULLIF(btrim(source_url), ''::text) IS NOT NULL) AND (NULLIF(btrim(source_label), ''::text) IS NOT NULL)))),
    CONSTRAINT move_motion_media_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'reviewed'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: COLUMN move_motion_media.storage_path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.move_motion_media.storage_path IS 'Object path in the move-motion-media bucket. NULL for externally hosted legacy media.';


--
-- Name: moves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moves (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    slug text NOT NULL,
    name_ja text NOT NULL,
    name_en text,
    move_type text NOT NULL,
    strength_variant text,
    description text,
    usage_summary text,
    display_order integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    description_ja text,
    usage_summary_ja text,
    CONSTRAINT moves_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: COLUMN moves.description_ja; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.moves.description_ja IS 'Reader-facing Japanese move explanation. Original imported notes remain in description.';


--
-- Name: COLUMN moves.usage_summary_ja; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.moves.usage_summary_ja IS 'Reader-facing Japanese usage guidance. Original imported notes remain in usage_summary.';


--
-- Name: patches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    version_label text NOT NULL,
    name text,
    released_at timestamp with time zone,
    official_url text,
    notes text,
    is_current boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: player_aliases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_aliases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id uuid NOT NULL,
    alias text NOT NULL,
    normalized_alias text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: player_characters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_characters (
    player_id uuid NOT NULL,
    character_id uuid NOT NULL,
    role text DEFAULT 'main'::text NOT NULL,
    valid_from_patch_id uuid,
    valid_to_patch_id uuid,
    note text
);


--
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.players (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    display_name text NOT NULL,
    real_name text,
    country_code text,
    region text,
    player_type text,
    team_name text,
    bio text,
    image_url text,
    youtube_url text,
    twitch_url text,
    x_url text,
    website_url text,
    is_active boolean DEFAULT true NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT players_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    display_name text,
    role text DEFAULT 'user'::text NOT NULL,
    sf6_id text,
    sf6_id_public boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text])))
);


--
-- Name: sequences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sequences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    sequence_type text,
    sequence_text text,
    is_true_blockstring boolean,
    mash_point text,
    throw_point text,
    shimmy_point text,
    jump_option text,
    parry_option text,
    drive_reversal_option text,
    invincible_option text,
    notes text,
    valid_from_patch_id uuid,
    valid_to_patch_id uuid,
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    content_kind text DEFAULT 'verified_strategy'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sequences_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: setup_moves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setup_moves (
    setup_id uuid NOT NULL,
    move_id uuid NOT NULL,
    step_order integer NOT NULL,
    note text
);


--
-- Name: setups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    character_id uuid NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    setup_type text,
    starter_condition text,
    sequence_text text,
    frame_advantage text,
    "position" text,
    meter_condition text,
    description text,
    counter_notes text,
    valid_from_patch_id uuid,
    valid_to_patch_id uuid,
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    content_kind text DEFAULT 'verified_strategy'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT setups_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    source_type text NOT NULL,
    publisher text,
    published_at timestamp with time zone,
    accessed_at timestamp with time zone,
    reliability_level text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tournament_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournament_results (
    tournament_id uuid NOT NULL,
    player_id uuid NOT NULL,
    placement integer,
    note text
);


--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournaments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    series_name text,
    start_date date,
    end_date date,
    region text,
    venue text,
    event_type text,
    scale text,
    official_url text,
    notes text,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT tournaments_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: training_relations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training_relations (
    training_id uuid NOT NULL,
    related_type text NOT NULL,
    related_id uuid NOT NULL,
    relationship text
);


--
-- Name: trainings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trainings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    training_type text,
    purpose text,
    level text,
    duration_minutes integer,
    player_character_id uuid,
    dummy_character_id uuid,
    recording_instructions text,
    playback_settings text,
    cpu_settings text,
    method text,
    success_criteria text,
    recommended_reps integer,
    next_step text,
    valid_from_patch_id uuid,
    valid_to_patch_id uuid,
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    content_kind text DEFAULT 'verified_strategy'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT trainings_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: user_activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activity_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_type text NOT NULL,
    source_type text NOT NULL,
    source_id uuid,
    label text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    retention_until timestamp with time zone DEFAULT (now() + '180 days'::interval) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_activity_logs_activity_type_check CHECK ((activity_type ~ '^[a-z][a-z0-9_.-]{1,63}$'::text)),
    CONSTRAINT user_activity_logs_label_check CHECK (((char_length(btrim(label)) >= 1) AND (char_length(btrim(label)) <= 120))),
    CONSTRAINT user_activity_logs_metadata_check CHECK ((jsonb_typeof(metadata) = 'object'::text)),
    CONSTRAINT user_activity_logs_retention_after_event CHECK ((retention_until >= occurred_at)),
    CONSTRAINT user_activity_logs_source_type_check CHECK ((source_type ~ '^[a-z][a-z0-9_]{1,63}$'::text))
);


--
-- Name: TABLE user_activity_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_activity_logs IS 'User-facing cross-feature activity timeline. Entries are retained for 180 days and are written from authoritative source-table triggers.';


--
-- Name: COLUMN user_activity_logs.activity_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_activity_logs.activity_type IS 'Stable machine key such as diagnosis.completed or training.completed.';


--
-- Name: COLUMN user_activity_logs.source_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_activity_logs.source_type IS 'Originating entity type, normally the source table name without the public schema.';


--
-- Name: COLUMN user_activity_logs.label; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_activity_logs.label IS 'Short reader-facing Japanese summary captured at event time.';


--
-- Name: COLUMN user_activity_logs.metadata; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_activity_logs.metadata IS 'Small structured facts needed for summaries; free-form private notes are intentionally excluded.';


--
-- Name: COLUMN user_activity_logs.retention_until; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_activity_logs.retention_until IS 'Entry becomes invisible to user-facing RPCs after this timestamp and can then be purged by a server-only cleanup job.';


--
-- Name: user_game_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_game_profiles (
    user_id uuid NOT NULL,
    main_character_id uuid,
    control_scheme text,
    current_rank text,
    current_mr integer,
    coach_tone text DEFAULT 'analytical'::text NOT NULL,
    weekly_goal_minutes integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_game_profiles_coach_tone_check CHECK ((coach_tone = ANY (ARRAY['gentle'::text, 'strict'::text, 'analytical'::text]))),
    CONSTRAINT user_game_profiles_control_scheme_check CHECK (((control_scheme IS NULL) OR (control_scheme = ANY (ARRAY['classic'::text, 'modern'::text, 'both'::text])))),
    CONSTRAINT user_game_profiles_current_mr_check CHECK (((current_mr IS NULL) OR ((current_mr >= 0) AND (current_mr <= 9999)))),
    CONSTRAINT user_game_profiles_current_rank_length_check CHECK (((current_rank IS NULL) OR ((char_length(btrim(current_rank)) >= 1) AND (char_length(btrim(current_rank)) <= 80)))),
    CONSTRAINT user_game_profiles_weekly_goal_check CHECK (((weekly_goal_minutes IS NULL) OR ((weekly_goal_minutes >= 0) AND (weekly_goal_minutes <= 10080))))
);


--
-- Name: user_match_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_match_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    played_at timestamp with time zone DEFAULT now() NOT NULL,
    player_character_id uuid NOT NULL,
    opponent_character_id uuid NOT NULL,
    result text NOT NULL,
    mode text DEFAULT 'ranked'::text NOT NULL,
    rank_before text,
    rank_after text,
    mr_before integer,
    mr_after integer,
    rounds_won smallint,
    rounds_lost smallint,
    primary_issue text DEFAULT 'unknown'::text NOT NULL,
    issue_detail text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_match_logs_issue_detail_length_check CHECK (((issue_detail IS NULL) OR (char_length(issue_detail) <= 500))),
    CONSTRAINT user_match_logs_mode_check CHECK ((mode = ANY (ARRAY['ranked'::text, 'casual'::text, 'custom_room'::text, 'battle_hub'::text, 'offline'::text, 'training'::text, 'other'::text]))),
    CONSTRAINT user_match_logs_mr_after_check CHECK (((mr_after IS NULL) OR ((mr_after >= 0) AND (mr_after <= 9999)))),
    CONSTRAINT user_match_logs_mr_before_check CHECK (((mr_before IS NULL) OR ((mr_before >= 0) AND (mr_before <= 9999)))),
    CONSTRAINT user_match_logs_notes_length_check CHECK (((notes IS NULL) OR (char_length(notes) <= 2000))),
    CONSTRAINT user_match_logs_primary_issue_check CHECK ((primary_issue = ANY (ARRAY['knowledge'::text, 'execution'::text, 'decision'::text, 'habit'::text, 'matchup'::text, 'unknown'::text]))),
    CONSTRAINT user_match_logs_rank_after_length_check CHECK (((rank_after IS NULL) OR ((char_length(btrim(rank_after)) >= 1) AND (char_length(btrim(rank_after)) <= 80)))),
    CONSTRAINT user_match_logs_rank_before_length_check CHECK (((rank_before IS NULL) OR ((char_length(btrim(rank_before)) >= 1) AND (char_length(btrim(rank_before)) <= 80)))),
    CONSTRAINT user_match_logs_result_check CHECK ((result = ANY (ARRAY['win'::text, 'loss'::text, 'draw'::text]))),
    CONSTRAINT user_match_logs_rounds_lost_check CHECK (((rounds_lost IS NULL) OR ((rounds_lost >= 0) AND (rounds_lost <= 99)))),
    CONSTRAINT user_match_logs_rounds_won_check CHECK (((rounds_won IS NULL) OR ((rounds_won >= 0) AND (rounds_won <= 99))))
);


--
-- Name: user_training_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_training_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    training_plan_id uuid,
    training_id uuid,
    custom_title text,
    practiced_at timestamp with time zone DEFAULT now() NOT NULL,
    duration_minutes integer NOT NULL,
    attempts integer,
    successes integer,
    self_rating smallint,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    training_name_snapshot text,
    training_type_snapshot text,
    player_character_id_snapshot uuid,
    player_character_name_snapshot text,
    dummy_character_id_snapshot uuid,
    dummy_character_name_snapshot text,
    CONSTRAINT user_training_logs_attempts_check CHECK (((attempts IS NULL) OR (attempts >= 0))),
    CONSTRAINT user_training_logs_custom_title_length_check CHECK (((custom_title IS NULL) OR (char_length(custom_title) <= 160))),
    CONSTRAINT user_training_logs_dummy_character_name_snapshot_check CHECK (((dummy_character_name_snapshot IS NULL) OR ((char_length(btrim(dummy_character_name_snapshot)) >= 1) AND (char_length(btrim(dummy_character_name_snapshot)) <= 80)))),
    CONSTRAINT user_training_logs_duration_check CHECK (((duration_minutes >= 1) AND (duration_minutes <= 1440))),
    CONSTRAINT user_training_logs_notes_length_check CHECK (((notes IS NULL) OR (char_length(notes) <= 2000))),
    CONSTRAINT user_training_logs_player_character_name_snapshot_check CHECK (((player_character_name_snapshot IS NULL) OR ((char_length(btrim(player_character_name_snapshot)) >= 1) AND (char_length(btrim(player_character_name_snapshot)) <= 80)))),
    CONSTRAINT user_training_logs_self_rating_check CHECK (((self_rating IS NULL) OR ((self_rating >= 1) AND (self_rating <= 5)))),
    CONSTRAINT user_training_logs_successes_attempts_check CHECK (((attempts IS NULL) OR (successes IS NULL) OR (successes <= attempts))),
    CONSTRAINT user_training_logs_successes_check CHECK (((successes IS NULL) OR (successes >= 0))),
    CONSTRAINT user_training_logs_target_check CHECK (((training_id IS NOT NULL) OR (NULLIF(btrim(custom_title), ''::text) IS NOT NULL))),
    CONSTRAINT user_training_logs_training_name_snapshot_check CHECK (((training_name_snapshot IS NULL) OR ((char_length(btrim(training_name_snapshot)) >= 1) AND (char_length(btrim(training_name_snapshot)) <= 200)))),
    CONSTRAINT user_training_logs_training_type_snapshot_check CHECK (((training_type_snapshot IS NULL) OR ((char_length(btrim(training_type_snapshot)) >= 1) AND (char_length(btrim(training_type_snapshot)) <= 80))))
);


--
-- Name: user_training_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_training_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    training_id uuid NOT NULL,
    focus_key text NOT NULL,
    source_type text NOT NULL,
    source_diagnosis_result_id uuid,
    source_match_log_id uuid,
    source_coach_session_id uuid,
    priority smallint DEFAULT 3 NOT NULL,
    status text DEFAULT 'planned'::text NOT NULL,
    scheduled_for date,
    rationale text,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_training_plans_priority_check CHECK (((priority >= 1) AND (priority <= 5))),
    CONSTRAINT user_training_plans_rationale_length_check CHECK (((rationale IS NULL) OR (char_length(rationale) <= 1000))),
    CONSTRAINT user_training_plans_source_consistency_check CHECK ((((source_type = 'diagnosis'::text) AND (source_diagnosis_result_id IS NOT NULL) AND (source_match_log_id IS NULL) AND (source_coach_session_id IS NULL)) OR ((source_type = 'match_log'::text) AND (source_diagnosis_result_id IS NULL) AND (source_match_log_id IS NOT NULL) AND (source_coach_session_id IS NULL)) OR ((source_type = 'ai_coach'::text) AND (source_diagnosis_result_id IS NULL) AND (source_match_log_id IS NULL) AND (source_coach_session_id IS NOT NULL)) OR ((source_type = 'manual'::text) AND (source_diagnosis_result_id IS NULL) AND (source_match_log_id IS NULL) AND (source_coach_session_id IS NULL)))),
    CONSTRAINT user_training_plans_source_type_check CHECK ((source_type = ANY (ARRAY['diagnosis'::text, 'match_log'::text, 'ai_coach'::text, 'manual'::text]))),
    CONSTRAINT user_training_plans_status_check CHECK ((status = ANY (ARRAY['planned'::text, 'in_progress'::text, 'completed'::text, 'skipped'::text])))
);


--
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    platform text DEFAULT 'youtube'::text NOT NULL,
    external_id text,
    title text NOT NULL,
    url text NOT NULL,
    thumbnail_url text,
    published_at timestamp with time zone,
    description text,
    video_type text,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT videos_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    public boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT extensions.gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: contact_inbox_config contact_inbox_config_pkey; Type: CONSTRAINT; Schema: private; Owner: -
--

ALTER TABLE ONLY private.contact_inbox_config
    ADD CONSTRAINT contact_inbox_config_pkey PRIMARY KEY (singleton);


--
-- Name: ai_coach_generations ai_coach_generations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_generations
    ADD CONSTRAINT ai_coach_generations_pkey PRIMARY KEY (id);


--
-- Name: ai_coach_messages ai_coach_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_messages
    ADD CONSTRAINT ai_coach_messages_pkey PRIMARY KEY (id);


--
-- Name: ai_coach_sessions ai_coach_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_sessions
    ADD CONSTRAINT ai_coach_sessions_pkey PRIMARY KEY (id);


--
-- Name: capture_backlog capture_backlog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capture_backlog
    ADD CONSTRAINT capture_backlog_pkey PRIMARY KEY (id);


--
-- Name: capture_backlog capture_backlog_training_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capture_backlog
    ADD CONSTRAINT capture_backlog_training_id_key UNIQUE (training_id);


--
-- Name: character_aliases character_aliases_character_id_normalized_alias_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_aliases
    ADD CONSTRAINT character_aliases_character_id_normalized_alias_key UNIQUE (character_id, normalized_alias);


--
-- Name: character_aliases character_aliases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_aliases
    ADD CONSTRAINT character_aliases_pkey PRIMARY KEY (id);


--
-- Name: character_content_packages character_content_packages_character_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_content_packages
    ADD CONSTRAINT character_content_packages_character_id_key UNIQUE (character_id);


--
-- Name: character_content_packages character_content_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_content_packages
    ADD CONSTRAINT character_content_packages_pkey PRIMARY KEY (id);


--
-- Name: character_guide_sections character_guide_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_guide_sections
    ADD CONSTRAINT character_guide_sections_pkey PRIMARY KEY (id);


--
-- Name: character_trait_scores character_trait_scores_character_id_trait_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_trait_scores
    ADD CONSTRAINT character_trait_scores_character_id_trait_id_key UNIQUE (character_id, trait_id);


--
-- Name: character_trait_scores character_trait_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_trait_scores
    ADD CONSTRAINT character_trait_scores_pkey PRIMARY KEY (id);


--
-- Name: character_traits character_traits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_traits
    ADD CONSTRAINT character_traits_pkey PRIMARY KEY (id);


--
-- Name: character_traits character_traits_trait_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_traits
    ADD CONSTRAINT character_traits_trait_key_key UNIQUE (trait_key);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: characters characters_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_slug_key UNIQUE (slug);


--
-- Name: coach_quick_help_answers coach_quick_help_answers_intake_id_node_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_answers
    ADD CONSTRAINT coach_quick_help_answers_intake_id_node_id_key UNIQUE (intake_id, node_id);


--
-- Name: coach_quick_help_answers coach_quick_help_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_answers
    ADD CONSTRAINT coach_quick_help_answers_pkey PRIMARY KEY (id);


--
-- Name: coach_quick_help_flows coach_quick_help_flows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_flows
    ADD CONSTRAINT coach_quick_help_flows_pkey PRIMARY KEY (id);


--
-- Name: coach_quick_help_flows coach_quick_help_flows_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_flows
    ADD CONSTRAINT coach_quick_help_flows_slug_key UNIQUE (slug);


--
-- Name: coach_quick_help_intakes coach_quick_help_intakes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_intakes
    ADD CONSTRAINT coach_quick_help_intakes_pkey PRIMARY KEY (id);


--
-- Name: coach_quick_help_nodes coach_quick_help_nodes_flow_id_node_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_nodes
    ADD CONSTRAINT coach_quick_help_nodes_flow_id_node_key_key UNIQUE (flow_id, node_key);


--
-- Name: coach_quick_help_nodes coach_quick_help_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_nodes
    ADD CONSTRAINT coach_quick_help_nodes_pkey PRIMARY KEY (id);


--
-- Name: coach_quick_help_options coach_quick_help_options_node_id_option_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_options
    ADD CONSTRAINT coach_quick_help_options_node_id_option_key_key UNIQUE (node_id, option_key);


--
-- Name: coach_quick_help_options coach_quick_help_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_options
    ADD CONSTRAINT coach_quick_help_options_pkey PRIMARY KEY (id);


--
-- Name: combo_moves combo_moves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combo_moves
    ADD CONSTRAINT combo_moves_pkey PRIMARY KEY (combo_id, step_order);


--
-- Name: combos combos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combos
    ADD CONSTRAINT combos_pkey PRIMARY KEY (id);


--
-- Name: combos combos_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combos
    ADD CONSTRAINT combos_slug_key UNIQUE (slug);


--
-- Name: contact_inbox contact_inbox_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_inbox
    ADD CONSTRAINT contact_inbox_pkey PRIMARY KEY (id);


--
-- Name: counters counters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_pkey PRIMARY KEY (id);


--
-- Name: counters counters_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_slug_key UNIQUE (slug);


--
-- Name: diagnoses diagnoses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT diagnoses_pkey PRIMARY KEY (id);


--
-- Name: diagnoses diagnoses_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT diagnoses_slug_key UNIQUE (slug);


--
-- Name: diagnosis_answers diagnosis_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_answers
    ADD CONSTRAINT diagnosis_answers_pkey PRIMARY KEY (id);


--
-- Name: diagnosis_answers diagnosis_answers_result_question_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_answers
    ADD CONSTRAINT diagnosis_answers_result_question_key UNIQUE (diagnosis_result_id, question_id);


--
-- Name: diagnosis_focus_rules diagnosis_focus_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_focus_rules
    ADD CONSTRAINT diagnosis_focus_rules_pkey PRIMARY KEY (focus_key);


--
-- Name: diagnosis_options diagnosis_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_options
    ADD CONSTRAINT diagnosis_options_pkey PRIMARY KEY (id);


--
-- Name: diagnosis_options diagnosis_options_question_id_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_options
    ADD CONSTRAINT diagnosis_options_question_id_id_key UNIQUE (question_id, id);


--
-- Name: diagnosis_questions diagnosis_questions_diagnosis_id_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_questions
    ADD CONSTRAINT diagnosis_questions_diagnosis_id_id_key UNIQUE (diagnosis_id, id);


--
-- Name: diagnosis_questions diagnosis_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_questions
    ADD CONSTRAINT diagnosis_questions_pkey PRIMARY KEY (id);


--
-- Name: diagnosis_results diagnosis_results_id_diagnosis_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_results
    ADD CONSTRAINT diagnosis_results_id_diagnosis_id_key UNIQUE (id, diagnosis_id);


--
-- Name: diagnosis_results diagnosis_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_results
    ADD CONSTRAINT diagnosis_results_pkey PRIMARY KEY (id);


--
-- Name: entity_sources entity_sources_entity_type_entity_id_source_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_sources
    ADD CONSTRAINT entity_sources_entity_type_entity_id_source_id_key UNIQUE (entity_type, entity_id, source_id);


--
-- Name: entity_sources entity_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_sources
    ADD CONSTRAINT entity_sources_pkey PRIMARY KEY (id);


--
-- Name: entity_videos entity_videos_entity_type_entity_id_video_id_relationship_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_videos
    ADD CONSTRAINT entity_videos_entity_type_entity_id_video_id_relationship_key UNIQUE (entity_type, entity_id, video_id, relationship);


--
-- Name: entity_videos entity_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_videos
    ADD CONSTRAINT entity_videos_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_entity_type_entity_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_entity_type_entity_id_key UNIQUE (user_id, entity_type, entity_id);


--
-- Name: glossary_aliases glossary_aliases_glossary_id_normalized_alias_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glossary_aliases
    ADD CONSTRAINT glossary_aliases_glossary_id_normalized_alias_key UNIQUE (glossary_id, normalized_alias);


--
-- Name: glossary_aliases glossary_aliases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glossary_aliases
    ADD CONSTRAINT glossary_aliases_pkey PRIMARY KEY (id);


--
-- Name: glossary glossary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glossary
    ADD CONSTRAINT glossary_pkey PRIMARY KEY (id);


--
-- Name: glossary glossary_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glossary
    ADD CONSTRAINT glossary_slug_key UNIQUE (slug);


--
-- Name: match_participants match_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_participants
    ADD CONSTRAINT match_participants_pkey PRIMARY KEY (match_id, side);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: move_aliases move_aliases_move_id_normalized_alias_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_aliases
    ADD CONSTRAINT move_aliases_move_id_normalized_alias_key UNIQUE (move_id, normalized_alias);


--
-- Name: move_aliases move_aliases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_aliases
    ADD CONSTRAINT move_aliases_pkey PRIMARY KEY (id);


--
-- Name: move_commands move_commands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_commands
    ADD CONSTRAINT move_commands_pkey PRIMARY KEY (id);


--
-- Name: move_frame_data move_frame_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_frame_data
    ADD CONSTRAINT move_frame_data_pkey PRIMARY KEY (id);


--
-- Name: move_motion_media move_motion_media_move_id_media_type_media_url_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_motion_media
    ADD CONSTRAINT move_motion_media_move_id_media_type_media_url_key UNIQUE (move_id, media_type, media_url);


--
-- Name: move_motion_media move_motion_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_motion_media
    ADD CONSTRAINT move_motion_media_pkey PRIMARY KEY (id);


--
-- Name: moves moves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_pkey PRIMARY KEY (id);


--
-- Name: moves moves_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_slug_key UNIQUE (slug);


--
-- Name: patches patches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patches
    ADD CONSTRAINT patches_pkey PRIMARY KEY (id);


--
-- Name: patches patches_version_label_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patches
    ADD CONSTRAINT patches_version_label_key UNIQUE (version_label);


--
-- Name: player_aliases player_aliases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_aliases
    ADD CONSTRAINT player_aliases_pkey PRIMARY KEY (id);


--
-- Name: player_aliases player_aliases_player_id_normalized_alias_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_aliases
    ADD CONSTRAINT player_aliases_player_id_normalized_alias_key UNIQUE (player_id, normalized_alias);


--
-- Name: player_characters player_characters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_characters
    ADD CONSTRAINT player_characters_pkey PRIMARY KEY (player_id, character_id, role);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: players players_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_slug_key UNIQUE (slug);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: sequences sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sequences
    ADD CONSTRAINT sequences_pkey PRIMARY KEY (id);


--
-- Name: sequences sequences_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sequences
    ADD CONSTRAINT sequences_slug_key UNIQUE (slug);


--
-- Name: setup_moves setup_moves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setup_moves
    ADD CONSTRAINT setup_moves_pkey PRIMARY KEY (setup_id, step_order);


--
-- Name: setups setups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setups
    ADD CONSTRAINT setups_pkey PRIMARY KEY (id);


--
-- Name: setups setups_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setups
    ADD CONSTRAINT setups_slug_key UNIQUE (slug);


--
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);


--
-- Name: tournament_results tournament_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_results
    ADD CONSTRAINT tournament_results_pkey PRIMARY KEY (tournament_id, player_id);


--
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);


--
-- Name: tournaments tournaments_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_slug_key UNIQUE (slug);


--
-- Name: training_relations training_relations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_relations
    ADD CONSTRAINT training_relations_pkey PRIMARY KEY (training_id, related_type, related_id);


--
-- Name: trainings trainings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_pkey PRIMARY KEY (id);


--
-- Name: trainings trainings_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_slug_key UNIQUE (slug);


--
-- Name: user_activity_logs user_activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity_logs
    ADD CONSTRAINT user_activity_logs_pkey PRIMARY KEY (id);


--
-- Name: user_game_profiles user_game_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_game_profiles
    ADD CONSTRAINT user_game_profiles_pkey PRIMARY KEY (user_id);


--
-- Name: user_match_logs user_match_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_match_logs
    ADD CONSTRAINT user_match_logs_pkey PRIMARY KEY (id);


--
-- Name: user_training_logs user_training_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_logs
    ADD CONSTRAINT user_training_logs_pkey PRIMARY KEY (id);


--
-- Name: user_training_plans user_training_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_plans
    ADD CONSTRAINT user_training_plans_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: videos videos_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_slug_key UNIQUE (slug);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: ai_coach_generations_assistant_message_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ai_coach_generations_assistant_message_idx ON public.ai_coach_generations USING btree (assistant_message_id) WHERE (assistant_message_id IS NOT NULL);


--
-- Name: ai_coach_generations_one_active_per_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ai_coach_generations_one_active_per_user_idx ON public.ai_coach_generations USING btree (user_id) WHERE (status = ANY (ARRAY['pending'::text, 'streaming'::text]));


--
-- Name: ai_coach_generations_session_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_coach_generations_session_created_at_idx ON public.ai_coach_generations USING btree (session_id, created_at DESC);


--
-- Name: ai_coach_generations_user_message_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ai_coach_generations_user_message_idx ON public.ai_coach_generations USING btree (user_message_id) WHERE (user_message_id IS NOT NULL);


--
-- Name: ai_coach_generations_user_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_coach_generations_user_status_idx ON public.ai_coach_generations USING btree (user_id, status, created_at DESC);


--
-- Name: ai_coach_messages_session_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_coach_messages_session_created_at_idx ON public.ai_coach_messages USING btree (session_id, created_at);


--
-- Name: ai_coach_messages_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_coach_messages_user_idx ON public.ai_coach_messages USING btree (user_id);


--
-- Name: ai_coach_sessions_character_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_coach_sessions_character_idx ON public.ai_coach_sessions USING btree (character_id);


--
-- Name: ai_coach_sessions_diagnosis_result_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_coach_sessions_diagnosis_result_idx ON public.ai_coach_sessions USING btree (diagnosis_result_id);


--
-- Name: ai_coach_sessions_user_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ai_coach_sessions_user_updated_at_idx ON public.ai_coach_sessions USING btree (user_id, updated_at DESC);


--
-- Name: capture_backlog_character_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX capture_backlog_character_status_idx ON public.capture_backlog USING btree (character_id, capture_status, priority);


--
-- Name: character_aliases_normalized_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX character_aliases_normalized_trgm_idx ON public.character_aliases USING gin (normalized_alias extensions.gin_trgm_ops);


--
-- Name: character_content_packages_rollout_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX character_content_packages_rollout_status_idx ON public.character_content_packages USING btree (rollout_status);


--
-- Name: character_guide_sections_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX character_guide_sections_character_id_idx ON public.character_guide_sections USING btree (character_id);


--
-- Name: character_guide_sections_valid_from_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX character_guide_sections_valid_from_patch_id_idx ON public.character_guide_sections USING btree (valid_from_patch_id);


--
-- Name: character_guide_sections_valid_to_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX character_guide_sections_valid_to_patch_id_idx ON public.character_guide_sections USING btree (valid_to_patch_id);


--
-- Name: characters_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX characters_status_order_idx ON public.characters USING btree (status, display_order);


--
-- Name: coach_quick_help_answers_node_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_answers_node_idx ON public.coach_quick_help_answers USING btree (node_id);


--
-- Name: coach_quick_help_answers_option_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_answers_option_idx ON public.coach_quick_help_answers USING btree (option_id) WHERE (option_id IS NOT NULL);


--
-- Name: coach_quick_help_answers_selected_character_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_answers_selected_character_idx ON public.coach_quick_help_answers USING btree (selected_character_id) WHERE (selected_character_id IS NOT NULL);


--
-- Name: coach_quick_help_answers_selected_move_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_answers_selected_move_idx ON public.coach_quick_help_answers USING btree (selected_move_id) WHERE (selected_move_id IS NOT NULL);


--
-- Name: coach_quick_help_answers_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_answers_user_idx ON public.coach_quick_help_answers USING btree (user_id);


--
-- Name: coach_quick_help_flows_root_node_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_flows_root_node_idx ON public.coach_quick_help_flows USING btree (root_node_id) WHERE (root_node_id IS NOT NULL);


--
-- Name: coach_quick_help_flows_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_flows_status_idx ON public.coach_quick_help_flows USING btree (status, slug);


--
-- Name: coach_quick_help_intakes_current_node_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_intakes_current_node_idx ON public.coach_quick_help_intakes USING btree (current_node_id) WHERE (current_node_id IS NOT NULL);


--
-- Name: coach_quick_help_intakes_flow_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_intakes_flow_idx ON public.coach_quick_help_intakes USING btree (flow_id);


--
-- Name: coach_quick_help_intakes_session_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX coach_quick_help_intakes_session_key ON public.coach_quick_help_intakes USING btree (ai_coach_session_id) WHERE (ai_coach_session_id IS NOT NULL);


--
-- Name: coach_quick_help_intakes_user_updated_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_intakes_user_updated_idx ON public.coach_quick_help_intakes USING btree (user_id, updated_at DESC);


--
-- Name: coach_quick_help_nodes_default_next_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_nodes_default_next_idx ON public.coach_quick_help_nodes USING btree (default_next_node_id) WHERE (default_next_node_id IS NOT NULL);


--
-- Name: coach_quick_help_nodes_flow_sort_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_nodes_flow_sort_idx ON public.coach_quick_help_nodes USING btree (flow_id, sort_order, node_key);


--
-- Name: coach_quick_help_options_next_node_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_options_next_node_idx ON public.coach_quick_help_options USING btree (next_node_id);


--
-- Name: coach_quick_help_options_node_sort_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coach_quick_help_options_node_sort_idx ON public.coach_quick_help_options USING btree (node_id, sort_order, option_key);


--
-- Name: combo_moves_move_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX combo_moves_move_id_idx ON public.combo_moves USING btree (move_id);


--
-- Name: combos_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX combos_character_id_idx ON public.combos USING btree (character_id);


--
-- Name: combos_status_character_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX combos_status_character_idx ON public.combos USING btree (status, character_id);


--
-- Name: combos_valid_from_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX combos_valid_from_patch_id_idx ON public.combos USING btree (valid_from_patch_id);


--
-- Name: combos_valid_to_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX combos_valid_to_patch_id_idx ON public.combos USING btree (valid_to_patch_id);


--
-- Name: contact_inbox_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_inbox_created_at_idx ON public.contact_inbox USING btree (created_at DESC);


--
-- Name: contact_inbox_email_rate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_inbox_email_rate_idx ON public.contact_inbox USING btree (lower(reply_email), created_at DESC);


--
-- Name: contact_inbox_requester_rate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_inbox_requester_rate_idx ON public.contact_inbox USING btree (requester_hash, created_at DESC);


--
-- Name: contact_inbox_user_rate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_inbox_user_rate_idx ON public.contact_inbox USING btree (user_id, created_at DESC) WHERE (user_id IS NOT NULL);


--
-- Name: counters_defender_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX counters_defender_character_id_idx ON public.counters USING btree (defender_character_id);


--
-- Name: counters_opponent_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX counters_opponent_character_id_idx ON public.counters USING btree (opponent_character_id);


--
-- Name: counters_valid_from_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX counters_valid_from_patch_id_idx ON public.counters USING btree (valid_from_patch_id);


--
-- Name: counters_valid_to_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX counters_valid_to_patch_id_idx ON public.counters USING btree (valid_to_patch_id);


--
-- Name: diagnoses_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnoses_status_order_idx ON public.diagnoses USING btree (status, display_order);


--
-- Name: diagnosis_answers_diagnosis_question_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnosis_answers_diagnosis_question_idx ON public.diagnosis_answers USING btree (diagnosis_id, question_id);


--
-- Name: diagnosis_answers_question_option_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnosis_answers_question_option_idx ON public.diagnosis_answers USING btree (question_id, option_id);


--
-- Name: diagnosis_answers_result_diagnosis_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnosis_answers_result_diagnosis_idx ON public.diagnosis_answers USING btree (diagnosis_result_id, diagnosis_id);


--
-- Name: diagnosis_answers_result_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnosis_answers_result_idx ON public.diagnosis_answers USING btree (diagnosis_result_id);


--
-- Name: diagnosis_options_question_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnosis_options_question_id_idx ON public.diagnosis_options USING btree (question_id);


--
-- Name: diagnosis_questions_diagnosis_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnosis_questions_diagnosis_id_idx ON public.diagnosis_questions USING btree (diagnosis_id);


--
-- Name: diagnosis_results_diagnosis_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnosis_results_diagnosis_id_idx ON public.diagnosis_results USING btree (diagnosis_id);


--
-- Name: diagnosis_results_user_diagnosis_request_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX diagnosis_results_user_diagnosis_request_key ON public.diagnosis_results USING btree (user_id, diagnosis_id, request_id) WHERE (request_id IS NOT NULL);


--
-- Name: diagnosis_results_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX diagnosis_results_user_id_idx ON public.diagnosis_results USING btree (user_id);


--
-- Name: entity_sources_source_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX entity_sources_source_id_idx ON public.entity_sources USING btree (source_id);


--
-- Name: entity_videos_entity_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX entity_videos_entity_idx ON public.entity_videos USING btree (entity_type, entity_id, display_order);


--
-- Name: entity_videos_video_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX entity_videos_video_id_idx ON public.entity_videos USING btree (video_id);


--
-- Name: favorites_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX favorites_user_id_idx ON public.favorites USING btree (user_id);


--
-- Name: idx_character_trait_scores_character; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_character_trait_scores_character ON public.character_trait_scores USING btree (character_id);


--
-- Name: idx_character_trait_scores_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_character_trait_scores_source ON public.character_trait_scores USING btree (source_id);


--
-- Name: idx_character_trait_scores_trait; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_character_trait_scores_trait ON public.character_trait_scores USING btree (trait_id);


--
-- Name: match_participants_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX match_participants_character_id_idx ON public.match_participants USING btree (character_id);


--
-- Name: match_participants_player_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX match_participants_player_id_idx ON public.match_participants USING btree (player_id);


--
-- Name: matches_tournament_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX matches_tournament_id_idx ON public.matches USING btree (tournament_id);


--
-- Name: matches_video_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX matches_video_id_idx ON public.matches USING btree (video_id);


--
-- Name: matches_winner_player_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX matches_winner_player_id_idx ON public.matches USING btree (winner_player_id);


--
-- Name: move_aliases_normalized_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX move_aliases_normalized_trgm_idx ON public.move_aliases USING gin (normalized_alias extensions.gin_trgm_ops);


--
-- Name: move_commands_move_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX move_commands_move_id_idx ON public.move_commands USING btree (move_id);


--
-- Name: move_frame_data_move_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX move_frame_data_move_id_idx ON public.move_frame_data USING btree (move_id);


--
-- Name: move_frame_data_valid_from_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX move_frame_data_valid_from_patch_id_idx ON public.move_frame_data USING btree (valid_from_patch_id);


--
-- Name: move_frame_data_valid_to_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX move_frame_data_valid_to_patch_id_idx ON public.move_frame_data USING btree (valid_to_patch_id);


--
-- Name: move_motion_media_move_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX move_motion_media_move_id_idx ON public.move_motion_media USING btree (move_id, display_order);


--
-- Name: moves_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX moves_character_id_idx ON public.moves USING btree (character_id);


--
-- Name: moves_status_character_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX moves_status_character_idx ON public.moves USING btree (status, character_id, display_order);


--
-- Name: patches_one_current_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX patches_one_current_idx ON public.patches USING btree (is_current) WHERE (is_current = true);


--
-- Name: player_aliases_normalized_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX player_aliases_normalized_trgm_idx ON public.player_aliases USING gin (normalized_alias extensions.gin_trgm_ops);


--
-- Name: player_characters_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX player_characters_character_id_idx ON public.player_characters USING btree (character_id);


--
-- Name: player_characters_valid_from_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX player_characters_valid_from_patch_id_idx ON public.player_characters USING btree (valid_from_patch_id);


--
-- Name: player_characters_valid_to_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX player_characters_valid_to_patch_id_idx ON public.player_characters USING btree (valid_to_patch_id);


--
-- Name: players_status_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX players_status_name_idx ON public.players USING btree (status, display_name);


--
-- Name: sequences_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sequences_character_id_idx ON public.sequences USING btree (character_id);


--
-- Name: sequences_valid_from_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sequences_valid_from_patch_id_idx ON public.sequences USING btree (valid_from_patch_id);


--
-- Name: sequences_valid_to_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sequences_valid_to_patch_id_idx ON public.sequences USING btree (valid_to_patch_id);


--
-- Name: setup_moves_move_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX setup_moves_move_id_idx ON public.setup_moves USING btree (move_id);


--
-- Name: setups_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX setups_character_id_idx ON public.setups USING btree (character_id);


--
-- Name: setups_valid_from_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX setups_valid_from_patch_id_idx ON public.setups USING btree (valid_from_patch_id);


--
-- Name: setups_valid_to_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX setups_valid_to_patch_id_idx ON public.setups USING btree (valid_to_patch_id);


--
-- Name: tournament_results_player_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournament_results_player_id_idx ON public.tournament_results USING btree (player_id);


--
-- Name: trainings_dummy_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trainings_dummy_character_id_idx ON public.trainings USING btree (dummy_character_id);


--
-- Name: trainings_player_character_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trainings_player_character_id_idx ON public.trainings USING btree (player_character_id);


--
-- Name: trainings_valid_from_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trainings_valid_from_patch_id_idx ON public.trainings USING btree (valid_from_patch_id);


--
-- Name: trainings_valid_to_patch_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trainings_valid_to_patch_id_idx ON public.trainings USING btree (valid_to_patch_id);


--
-- Name: user_activity_logs_retention_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_activity_logs_retention_idx ON public.user_activity_logs USING btree (retention_until);


--
-- Name: user_activity_logs_source_event_uidx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_activity_logs_source_event_uidx ON public.user_activity_logs USING btree (user_id, activity_type, source_type, source_id) WHERE (source_id IS NOT NULL);


--
-- Name: user_activity_logs_user_occurred_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_activity_logs_user_occurred_idx ON public.user_activity_logs USING btree (user_id, occurred_at DESC);


--
-- Name: user_activity_logs_user_type_occurred_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_activity_logs_user_type_occurred_idx ON public.user_activity_logs USING btree (user_id, activity_type, occurred_at DESC);


--
-- Name: user_game_profiles_main_character_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_game_profiles_main_character_idx ON public.user_game_profiles USING btree (main_character_id);


--
-- Name: user_match_logs_matchup_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_match_logs_matchup_idx ON public.user_match_logs USING btree (user_id, player_character_id, opponent_character_id);


--
-- Name: user_match_logs_opponent_character_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_match_logs_opponent_character_idx ON public.user_match_logs USING btree (opponent_character_id);


--
-- Name: user_match_logs_player_character_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_match_logs_player_character_idx ON public.user_match_logs USING btree (player_character_id);


--
-- Name: user_match_logs_user_played_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_match_logs_user_played_at_idx ON public.user_match_logs USING btree (user_id, played_at DESC);


--
-- Name: user_training_logs_plan_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_logs_plan_idx ON public.user_training_logs USING btree (training_plan_id);


--
-- Name: user_training_logs_training_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_logs_training_idx ON public.user_training_logs USING btree (training_id);


--
-- Name: user_training_logs_user_player_snapshot_practiced_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_logs_user_player_snapshot_practiced_idx ON public.user_training_logs USING btree (user_id, player_character_id_snapshot, practiced_at DESC) WHERE (player_character_id_snapshot IS NOT NULL);


--
-- Name: user_training_logs_user_practiced_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_logs_user_practiced_at_idx ON public.user_training_logs USING btree (user_id, practiced_at DESC);


--
-- Name: user_training_logs_user_training_recent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_logs_user_training_recent_idx ON public.user_training_logs USING btree (user_id, training_id, practiced_at DESC, created_at DESC, id DESC) WHERE (training_id IS NOT NULL);


--
-- Name: user_training_plans_focus_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_plans_focus_key_idx ON public.user_training_plans USING btree (focus_key);


--
-- Name: user_training_plans_source_coach_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_plans_source_coach_idx ON public.user_training_plans USING btree (source_coach_session_id);


--
-- Name: user_training_plans_source_diagnosis_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_plans_source_diagnosis_idx ON public.user_training_plans USING btree (source_diagnosis_result_id);


--
-- Name: user_training_plans_source_match_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_plans_source_match_idx ON public.user_training_plans USING btree (source_match_log_id);


--
-- Name: user_training_plans_training_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_plans_training_idx ON public.user_training_plans USING btree (training_id);


--
-- Name: user_training_plans_user_status_priority_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_training_plans_user_status_priority_idx ON public.user_training_plans USING btree (user_id, status, priority, created_at DESC);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();


--
-- Name: ai_coach_sessions capture_ai_coach_activity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER capture_ai_coach_activity AFTER INSERT OR UPDATE OF status ON public.ai_coach_sessions FOR EACH ROW EXECUTE FUNCTION private.capture_user_activity();


--
-- Name: diagnosis_results capture_diagnosis_activity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER capture_diagnosis_activity AFTER INSERT ON public.diagnosis_results FOR EACH ROW EXECUTE FUNCTION private.capture_user_activity();


--
-- Name: user_match_logs capture_match_activity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER capture_match_activity AFTER INSERT OR UPDATE ON public.user_match_logs FOR EACH ROW EXECUTE FUNCTION private.capture_user_activity();


--
-- Name: coach_quick_help_intakes capture_quick_help_activity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER capture_quick_help_activity AFTER INSERT OR UPDATE OF status, ai_coach_session_id ON public.coach_quick_help_intakes FOR EACH ROW EXECUTE FUNCTION private.capture_user_activity();


--
-- Name: user_training_logs capture_training_activity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER capture_training_activity AFTER INSERT OR UPDATE ON public.user_training_logs FOR EACH ROW EXECUTE FUNCTION private.capture_user_activity();


--
-- Name: diagnosis_answers diagnosis_answers_keep_result_complete; Type: TRIGGER; Schema: public; Owner: -
--

CREATE CONSTRAINT TRIGGER diagnosis_answers_keep_result_complete AFTER INSERT OR DELETE OR UPDATE ON public.diagnosis_answers DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION private.validate_diagnosis_result_completeness();


--
-- Name: diagnosis_results diagnosis_result_must_be_complete; Type: TRIGGER; Schema: public; Owner: -
--

CREATE CONSTRAINT TRIGGER diagnosis_result_must_be_complete AFTER INSERT OR UPDATE ON public.diagnosis_results DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION private.validate_diagnosis_result_completeness();


--
-- Name: combos enforce_combo_publication_ready; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_combo_publication_ready BEFORE INSERT OR UPDATE OF status, verification_status, notation, valid_from_patch_id, valid_to_patch_id, character_id ON public.combos FOR EACH ROW EXECUTE FUNCTION private.enforce_combo_publication_ready();


--
-- Name: counters enforce_counter_publication_ready; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_counter_publication_ready BEFORE INSERT OR UPDATE OF status, verification_status, title, method, counter_type, valid_from_patch_id, valid_to_patch_id, defender_character_id, opponent_character_id ON public.counters FOR EACH ROW EXECUTE FUNCTION private.enforce_counter_publication_ready();


--
-- Name: sequences enforce_sequence_publication_ready; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_sequence_publication_ready BEFORE INSERT OR UPDATE OF status, verification_status, name, sequence_text, mash_point, throw_point, shimmy_point, notes, valid_from_patch_id, valid_to_patch_id, character_id ON public.sequences FOR EACH ROW EXECUTE FUNCTION private.enforce_sequence_publication_ready();


--
-- Name: setups enforce_setup_publication_ready; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_setup_publication_ready BEFORE INSERT OR UPDATE OF status, verification_status, name, starter_condition, sequence_text, description, valid_from_patch_id, valid_to_patch_id, character_id ON public.setups FOR EACH ROW EXECUTE FUNCTION private.enforce_setup_publication_ready();


--
-- Name: trainings enforce_training_publication_ready; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_training_publication_ready BEFORE INSERT OR UPDATE OF status, verification_status, name, training_type, purpose, method, success_criteria, duration_minutes, recommended_reps, recording_instructions, playback_settings, cpu_settings, next_step, valid_from_patch_id, valid_to_patch_id, player_character_id, dummy_character_id ON public.trainings FOR EACH ROW EXECUTE FUNCTION private.enforce_training_publication_ready();


--
-- Name: user_training_logs guard_user_training_log_plan; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER guard_user_training_log_plan BEFORE INSERT OR UPDATE ON public.user_training_logs FOR EACH ROW EXECUTE FUNCTION private.validate_user_training_log_plan();


--
-- Name: ai_coach_sessions set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ai_coach_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: character_guide_sections set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.character_guide_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: characters set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: coach_quick_help_flows set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.coach_quick_help_flows FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: coach_quick_help_intakes set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.coach_quick_help_intakes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: coach_quick_help_nodes set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.coach_quick_help_nodes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: coach_quick_help_options set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.coach_quick_help_options FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: combos set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.combos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: counters set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.counters FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: diagnoses set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.diagnoses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: diagnosis_focus_rules set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.diagnosis_focus_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: diagnosis_questions set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.diagnosis_questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: glossary set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.glossary FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: matches set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: move_frame_data set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.move_frame_data FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: moves set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.moves FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: patches set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.patches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: players set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: profiles set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: sequences set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.sequences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: setups set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.setups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: sources set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.sources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: tournaments set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: trainings set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.trainings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_game_profiles set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_game_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_match_logs set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_match_logs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_training_logs set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_training_logs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_training_plans set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_training_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: videos set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_training_logs snapshot_user_training_log; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER snapshot_user_training_log BEFORE INSERT OR UPDATE ON public.user_training_logs FOR EACH ROW EXECUTE FUNCTION private.snapshot_user_training_log();


--
-- Name: ai_coach_sessions validate_ai_coach_session_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_ai_coach_session_write BEFORE INSERT OR UPDATE ON public.ai_coach_sessions FOR EACH ROW EXECUTE FUNCTION private.validate_ai_coach_session_write();


--
-- Name: ai_coach_messages validate_ai_coach_user_message_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_ai_coach_user_message_write BEFORE INSERT OR UPDATE ON public.ai_coach_messages FOR EACH ROW EXECUTE FUNCTION private.validate_ai_coach_user_message_write();


--
-- Name: diagnosis_results validate_diagnosis_result_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_diagnosis_result_write BEFORE INSERT OR UPDATE ON public.diagnosis_results FOR EACH ROW EXECUTE FUNCTION private.validate_diagnosis_result_write();


--
-- Name: favorites validate_favorite_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_favorite_write BEFORE INSERT OR UPDATE ON public.favorites FOR EACH ROW EXECUTE FUNCTION private.validate_favorite_write();


--
-- Name: profiles validate_profile_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_profile_write BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION private.validate_profile_write();


--
-- Name: coach_quick_help_answers validate_quick_help_answer_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_quick_help_answer_write BEFORE INSERT OR UPDATE ON public.coach_quick_help_answers FOR EACH ROW EXECUTE FUNCTION private.validate_quick_help_answer_write();


--
-- Name: coach_quick_help_intakes validate_quick_help_intake_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_quick_help_intake_write BEFORE INSERT OR UPDATE ON public.coach_quick_help_intakes FOR EACH ROW EXECUTE FUNCTION private.validate_quick_help_intake_write();


--
-- Name: user_game_profiles validate_user_game_profile_write; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_user_game_profile_write BEFORE INSERT OR UPDATE ON public.user_game_profiles FOR EACH ROW EXECUTE FUNCTION private.validate_user_game_profile_write();


--
-- Name: user_match_logs validate_user_match_log; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_user_match_log BEFORE INSERT OR UPDATE ON public.user_match_logs FOR EACH ROW EXECUTE FUNCTION private.validate_user_match_log();


--
-- Name: user_training_plans validate_user_training_plan; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER validate_user_training_plan BEFORE INSERT OR UPDATE ON public.user_training_plans FOR EACH ROW EXECUTE FUNCTION private.validate_user_training_plan();


--
-- Name: ai_coach_generations ai_coach_generations_assistant_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_generations
    ADD CONSTRAINT ai_coach_generations_assistant_message_id_fkey FOREIGN KEY (assistant_message_id) REFERENCES public.ai_coach_messages(id) ON DELETE SET NULL;


--
-- Name: ai_coach_generations ai_coach_generations_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_generations
    ADD CONSTRAINT ai_coach_generations_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.ai_coach_sessions(id) ON DELETE CASCADE;


--
-- Name: ai_coach_generations ai_coach_generations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_generations
    ADD CONSTRAINT ai_coach_generations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: ai_coach_generations ai_coach_generations_user_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_generations
    ADD CONSTRAINT ai_coach_generations_user_message_id_fkey FOREIGN KEY (user_message_id) REFERENCES public.ai_coach_messages(id) ON DELETE SET NULL;


--
-- Name: ai_coach_messages ai_coach_messages_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_messages
    ADD CONSTRAINT ai_coach_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.ai_coach_sessions(id) ON DELETE CASCADE;


--
-- Name: ai_coach_messages ai_coach_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_messages
    ADD CONSTRAINT ai_coach_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: ai_coach_sessions ai_coach_sessions_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_sessions
    ADD CONSTRAINT ai_coach_sessions_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE SET NULL;


--
-- Name: ai_coach_sessions ai_coach_sessions_diagnosis_result_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_sessions
    ADD CONSTRAINT ai_coach_sessions_diagnosis_result_id_fkey FOREIGN KEY (diagnosis_result_id) REFERENCES public.diagnosis_results(id) ON DELETE SET NULL;


--
-- Name: ai_coach_sessions ai_coach_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_coach_sessions
    ADD CONSTRAINT ai_coach_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: capture_backlog capture_backlog_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capture_backlog
    ADD CONSTRAINT capture_backlog_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: capture_backlog capture_backlog_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capture_backlog
    ADD CONSTRAINT capture_backlog_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id) ON DELETE CASCADE;


--
-- Name: character_aliases character_aliases_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_aliases
    ADD CONSTRAINT character_aliases_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: character_content_packages character_content_packages_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_content_packages
    ADD CONSTRAINT character_content_packages_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: character_guide_sections character_guide_sections_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_guide_sections
    ADD CONSTRAINT character_guide_sections_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: character_guide_sections character_guide_sections_valid_from_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_guide_sections
    ADD CONSTRAINT character_guide_sections_valid_from_patch_id_fkey FOREIGN KEY (valid_from_patch_id) REFERENCES public.patches(id);


--
-- Name: character_guide_sections character_guide_sections_valid_to_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_guide_sections
    ADD CONSTRAINT character_guide_sections_valid_to_patch_id_fkey FOREIGN KEY (valid_to_patch_id) REFERENCES public.patches(id);


--
-- Name: character_trait_scores character_trait_scores_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_trait_scores
    ADD CONSTRAINT character_trait_scores_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: character_trait_scores character_trait_scores_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_trait_scores
    ADD CONSTRAINT character_trait_scores_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(id) ON DELETE SET NULL;


--
-- Name: character_trait_scores character_trait_scores_trait_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_trait_scores
    ADD CONSTRAINT character_trait_scores_trait_id_fkey FOREIGN KEY (trait_id) REFERENCES public.character_traits(id) ON DELETE CASCADE;


--
-- Name: coach_quick_help_answers coach_quick_help_answers_intake_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_answers
    ADD CONSTRAINT coach_quick_help_answers_intake_id_fkey FOREIGN KEY (intake_id) REFERENCES public.coach_quick_help_intakes(id) ON DELETE CASCADE;


--
-- Name: coach_quick_help_answers coach_quick_help_answers_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_answers
    ADD CONSTRAINT coach_quick_help_answers_node_id_fkey FOREIGN KEY (node_id) REFERENCES public.coach_quick_help_nodes(id);


--
-- Name: coach_quick_help_answers coach_quick_help_answers_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_answers
    ADD CONSTRAINT coach_quick_help_answers_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.coach_quick_help_options(id);


--
-- Name: coach_quick_help_answers coach_quick_help_answers_selected_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_answers
    ADD CONSTRAINT coach_quick_help_answers_selected_character_id_fkey FOREIGN KEY (selected_character_id) REFERENCES public.characters(id);


--
-- Name: coach_quick_help_answers coach_quick_help_answers_selected_move_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_answers
    ADD CONSTRAINT coach_quick_help_answers_selected_move_id_fkey FOREIGN KEY (selected_move_id) REFERENCES public.moves(id);


--
-- Name: coach_quick_help_answers coach_quick_help_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_answers
    ADD CONSTRAINT coach_quick_help_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: coach_quick_help_flows coach_quick_help_flows_root_node_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_flows
    ADD CONSTRAINT coach_quick_help_flows_root_node_fkey FOREIGN KEY (root_node_id) REFERENCES public.coach_quick_help_nodes(id) ON DELETE SET NULL;


--
-- Name: coach_quick_help_intakes coach_quick_help_intakes_ai_coach_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_intakes
    ADD CONSTRAINT coach_quick_help_intakes_ai_coach_session_id_fkey FOREIGN KEY (ai_coach_session_id) REFERENCES public.ai_coach_sessions(id) ON DELETE SET NULL;


--
-- Name: coach_quick_help_intakes coach_quick_help_intakes_current_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_intakes
    ADD CONSTRAINT coach_quick_help_intakes_current_node_id_fkey FOREIGN KEY (current_node_id) REFERENCES public.coach_quick_help_nodes(id) ON DELETE SET NULL;


--
-- Name: coach_quick_help_intakes coach_quick_help_intakes_flow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_intakes
    ADD CONSTRAINT coach_quick_help_intakes_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES public.coach_quick_help_flows(id);


--
-- Name: coach_quick_help_intakes coach_quick_help_intakes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_intakes
    ADD CONSTRAINT coach_quick_help_intakes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: coach_quick_help_nodes coach_quick_help_nodes_default_next_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_nodes
    ADD CONSTRAINT coach_quick_help_nodes_default_next_node_id_fkey FOREIGN KEY (default_next_node_id) REFERENCES public.coach_quick_help_nodes(id) ON DELETE SET NULL;


--
-- Name: coach_quick_help_nodes coach_quick_help_nodes_flow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_nodes
    ADD CONSTRAINT coach_quick_help_nodes_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES public.coach_quick_help_flows(id) ON DELETE CASCADE;


--
-- Name: coach_quick_help_options coach_quick_help_options_next_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_options
    ADD CONSTRAINT coach_quick_help_options_next_node_id_fkey FOREIGN KEY (next_node_id) REFERENCES public.coach_quick_help_nodes(id) ON DELETE RESTRICT;


--
-- Name: coach_quick_help_options coach_quick_help_options_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_quick_help_options
    ADD CONSTRAINT coach_quick_help_options_node_id_fkey FOREIGN KEY (node_id) REFERENCES public.coach_quick_help_nodes(id) ON DELETE CASCADE;


--
-- Name: combo_moves combo_moves_combo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combo_moves
    ADD CONSTRAINT combo_moves_combo_id_fkey FOREIGN KEY (combo_id) REFERENCES public.combos(id) ON DELETE CASCADE;


--
-- Name: combo_moves combo_moves_move_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combo_moves
    ADD CONSTRAINT combo_moves_move_id_fkey FOREIGN KEY (move_id) REFERENCES public.moves(id) ON DELETE CASCADE;


--
-- Name: combos combos_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combos
    ADD CONSTRAINT combos_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: combos combos_valid_from_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combos
    ADD CONSTRAINT combos_valid_from_patch_id_fkey FOREIGN KEY (valid_from_patch_id) REFERENCES public.patches(id);


--
-- Name: combos combos_valid_to_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.combos
    ADD CONSTRAINT combos_valid_to_patch_id_fkey FOREIGN KEY (valid_to_patch_id) REFERENCES public.patches(id);


--
-- Name: contact_inbox contact_inbox_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_inbox
    ADD CONSTRAINT contact_inbox_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: counters counters_defender_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_defender_character_id_fkey FOREIGN KEY (defender_character_id) REFERENCES public.characters(id);


--
-- Name: counters counters_opponent_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_opponent_character_id_fkey FOREIGN KEY (opponent_character_id) REFERENCES public.characters(id);


--
-- Name: counters counters_valid_from_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_valid_from_patch_id_fkey FOREIGN KEY (valid_from_patch_id) REFERENCES public.patches(id);


--
-- Name: counters counters_valid_to_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_valid_to_patch_id_fkey FOREIGN KEY (valid_to_patch_id) REFERENCES public.patches(id);


--
-- Name: diagnosis_answers diagnosis_answers_diagnosis_question_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_answers
    ADD CONSTRAINT diagnosis_answers_diagnosis_question_fkey FOREIGN KEY (diagnosis_id, question_id) REFERENCES public.diagnosis_questions(diagnosis_id, id);


--
-- Name: diagnosis_answers diagnosis_answers_question_option_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_answers
    ADD CONSTRAINT diagnosis_answers_question_option_fkey FOREIGN KEY (question_id, option_id) REFERENCES public.diagnosis_options(question_id, id);


--
-- Name: diagnosis_answers diagnosis_answers_result_diagnosis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_answers
    ADD CONSTRAINT diagnosis_answers_result_diagnosis_fkey FOREIGN KEY (diagnosis_result_id, diagnosis_id) REFERENCES public.diagnosis_results(id, diagnosis_id) ON DELETE CASCADE;


--
-- Name: diagnosis_options diagnosis_options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_options
    ADD CONSTRAINT diagnosis_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.diagnosis_questions(id) ON DELETE CASCADE;


--
-- Name: diagnosis_questions diagnosis_questions_diagnosis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_questions
    ADD CONSTRAINT diagnosis_questions_diagnosis_id_fkey FOREIGN KEY (diagnosis_id) REFERENCES public.diagnoses(id) ON DELETE CASCADE;


--
-- Name: diagnosis_results diagnosis_results_diagnosis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_results
    ADD CONSTRAINT diagnosis_results_diagnosis_id_fkey FOREIGN KEY (diagnosis_id) REFERENCES public.diagnoses(id) ON DELETE CASCADE;


--
-- Name: diagnosis_results diagnosis_results_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis_results
    ADD CONSTRAINT diagnosis_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: entity_sources entity_sources_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_sources
    ADD CONSTRAINT entity_sources_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(id) ON DELETE CASCADE;


--
-- Name: entity_videos entity_videos_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_videos
    ADD CONSTRAINT entity_videos_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: glossary_aliases glossary_aliases_glossary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.glossary_aliases
    ADD CONSTRAINT glossary_aliases_glossary_id_fkey FOREIGN KEY (glossary_id) REFERENCES public.glossary(id) ON DELETE CASCADE;


--
-- Name: match_participants match_participants_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_participants
    ADD CONSTRAINT match_participants_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: match_participants match_participants_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_participants
    ADD CONSTRAINT match_participants_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: match_participants match_participants_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_participants
    ADD CONSTRAINT match_participants_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: matches matches_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE SET NULL;


--
-- Name: matches matches_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE SET NULL;


--
-- Name: matches matches_winner_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_winner_player_id_fkey FOREIGN KEY (winner_player_id) REFERENCES public.players(id);


--
-- Name: move_aliases move_aliases_move_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_aliases
    ADD CONSTRAINT move_aliases_move_id_fkey FOREIGN KEY (move_id) REFERENCES public.moves(id) ON DELETE CASCADE;


--
-- Name: move_commands move_commands_move_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_commands
    ADD CONSTRAINT move_commands_move_id_fkey FOREIGN KEY (move_id) REFERENCES public.moves(id) ON DELETE CASCADE;


--
-- Name: move_frame_data move_frame_data_move_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_frame_data
    ADD CONSTRAINT move_frame_data_move_id_fkey FOREIGN KEY (move_id) REFERENCES public.moves(id) ON DELETE CASCADE;


--
-- Name: move_frame_data move_frame_data_valid_from_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_frame_data
    ADD CONSTRAINT move_frame_data_valid_from_patch_id_fkey FOREIGN KEY (valid_from_patch_id) REFERENCES public.patches(id);


--
-- Name: move_frame_data move_frame_data_valid_to_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_frame_data
    ADD CONSTRAINT move_frame_data_valid_to_patch_id_fkey FOREIGN KEY (valid_to_patch_id) REFERENCES public.patches(id);


--
-- Name: move_motion_media move_motion_media_move_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.move_motion_media
    ADD CONSTRAINT move_motion_media_move_id_fkey FOREIGN KEY (move_id) REFERENCES public.moves(id) ON DELETE CASCADE;


--
-- Name: moves moves_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: player_aliases player_aliases_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_aliases
    ADD CONSTRAINT player_aliases_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_characters player_characters_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_characters
    ADD CONSTRAINT player_characters_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: player_characters player_characters_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_characters
    ADD CONSTRAINT player_characters_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_characters player_characters_valid_from_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_characters
    ADD CONSTRAINT player_characters_valid_from_patch_id_fkey FOREIGN KEY (valid_from_patch_id) REFERENCES public.patches(id);


--
-- Name: player_characters player_characters_valid_to_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_characters
    ADD CONSTRAINT player_characters_valid_to_patch_id_fkey FOREIGN KEY (valid_to_patch_id) REFERENCES public.patches(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sequences sequences_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sequences
    ADD CONSTRAINT sequences_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: sequences sequences_valid_from_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sequences
    ADD CONSTRAINT sequences_valid_from_patch_id_fkey FOREIGN KEY (valid_from_patch_id) REFERENCES public.patches(id);


--
-- Name: sequences sequences_valid_to_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sequences
    ADD CONSTRAINT sequences_valid_to_patch_id_fkey FOREIGN KEY (valid_to_patch_id) REFERENCES public.patches(id);


--
-- Name: setup_moves setup_moves_move_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setup_moves
    ADD CONSTRAINT setup_moves_move_id_fkey FOREIGN KEY (move_id) REFERENCES public.moves(id) ON DELETE CASCADE;


--
-- Name: setup_moves setup_moves_setup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setup_moves
    ADD CONSTRAINT setup_moves_setup_id_fkey FOREIGN KEY (setup_id) REFERENCES public.setups(id) ON DELETE CASCADE;


--
-- Name: setups setups_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setups
    ADD CONSTRAINT setups_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- Name: setups setups_valid_from_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setups
    ADD CONSTRAINT setups_valid_from_patch_id_fkey FOREIGN KEY (valid_from_patch_id) REFERENCES public.patches(id);


--
-- Name: setups setups_valid_to_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setups
    ADD CONSTRAINT setups_valid_to_patch_id_fkey FOREIGN KEY (valid_to_patch_id) REFERENCES public.patches(id);


--
-- Name: tournament_results tournament_results_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_results
    ADD CONSTRAINT tournament_results_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: tournament_results tournament_results_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_results
    ADD CONSTRAINT tournament_results_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: training_relations training_relations_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_relations
    ADD CONSTRAINT training_relations_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id) ON DELETE CASCADE;


--
-- Name: trainings trainings_dummy_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_dummy_character_id_fkey FOREIGN KEY (dummy_character_id) REFERENCES public.characters(id);


--
-- Name: trainings trainings_player_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_player_character_id_fkey FOREIGN KEY (player_character_id) REFERENCES public.characters(id);


--
-- Name: trainings trainings_valid_from_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_valid_from_patch_id_fkey FOREIGN KEY (valid_from_patch_id) REFERENCES public.patches(id);


--
-- Name: trainings trainings_valid_to_patch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_valid_to_patch_id_fkey FOREIGN KEY (valid_to_patch_id) REFERENCES public.patches(id);


--
-- Name: user_activity_logs user_activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity_logs
    ADD CONSTRAINT user_activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_game_profiles user_game_profiles_main_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_game_profiles
    ADD CONSTRAINT user_game_profiles_main_character_id_fkey FOREIGN KEY (main_character_id) REFERENCES public.characters(id) ON DELETE SET NULL;


--
-- Name: user_game_profiles user_game_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_game_profiles
    ADD CONSTRAINT user_game_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_match_logs user_match_logs_opponent_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_match_logs
    ADD CONSTRAINT user_match_logs_opponent_character_id_fkey FOREIGN KEY (opponent_character_id) REFERENCES public.characters(id);


--
-- Name: user_match_logs user_match_logs_player_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_match_logs
    ADD CONSTRAINT user_match_logs_player_character_id_fkey FOREIGN KEY (player_character_id) REFERENCES public.characters(id);


--
-- Name: user_match_logs user_match_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_match_logs
    ADD CONSTRAINT user_match_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_training_logs user_training_logs_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_logs
    ADD CONSTRAINT user_training_logs_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id);


--
-- Name: user_training_logs user_training_logs_training_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_logs
    ADD CONSTRAINT user_training_logs_training_plan_id_fkey FOREIGN KEY (training_plan_id) REFERENCES public.user_training_plans(id) ON DELETE SET NULL;


--
-- Name: user_training_logs user_training_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_logs
    ADD CONSTRAINT user_training_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_training_plans user_training_plans_focus_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_plans
    ADD CONSTRAINT user_training_plans_focus_key_fkey FOREIGN KEY (focus_key) REFERENCES public.diagnosis_focus_rules(focus_key);


--
-- Name: user_training_plans user_training_plans_source_coach_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_plans
    ADD CONSTRAINT user_training_plans_source_coach_session_id_fkey FOREIGN KEY (source_coach_session_id) REFERENCES public.ai_coach_sessions(id) ON DELETE CASCADE;


--
-- Name: user_training_plans user_training_plans_source_diagnosis_result_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_plans
    ADD CONSTRAINT user_training_plans_source_diagnosis_result_id_fkey FOREIGN KEY (source_diagnosis_result_id) REFERENCES public.diagnosis_results(id) ON DELETE CASCADE;


--
-- Name: user_training_plans user_training_plans_source_match_log_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_plans
    ADD CONSTRAINT user_training_plans_source_match_log_id_fkey FOREIGN KEY (source_match_log_id) REFERENCES public.user_match_logs(id) ON DELETE CASCADE;


--
-- Name: user_training_plans user_training_plans_training_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_plans
    ADD CONSTRAINT user_training_plans_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id);


--
-- Name: user_training_plans user_training_plans_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_plans
    ADD CONSTRAINT user_training_plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: diagnosis_focus_rules admin delete diagnosis focus rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin delete diagnosis focus rules" ON public.diagnosis_focus_rules FOR DELETE TO authenticated USING (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_flows admin delete quick help flows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin delete quick help flows" ON public.coach_quick_help_flows FOR DELETE TO authenticated USING (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_nodes admin delete quick help nodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin delete quick help nodes" ON public.coach_quick_help_nodes FOR DELETE TO authenticated USING (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_options admin delete quick help options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin delete quick help options" ON public.coach_quick_help_options FOR DELETE TO authenticated USING (( SELECT private.is_admin() AS is_admin));


--
-- Name: diagnosis_focus_rules admin insert diagnosis focus rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin insert diagnosis focus rules" ON public.diagnosis_focus_rules FOR INSERT TO authenticated WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_flows admin insert quick help flows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin insert quick help flows" ON public.coach_quick_help_flows FOR INSERT TO authenticated WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_nodes admin insert quick help nodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin insert quick help nodes" ON public.coach_quick_help_nodes FOR INSERT TO authenticated WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_options admin insert quick help options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin insert quick help options" ON public.coach_quick_help_options FOR INSERT TO authenticated WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: character_aliases admin manage character aliases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage character aliases" ON public.character_aliases TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: character_content_packages admin manage character content packages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage character content packages" ON public.character_content_packages TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: character_guide_sections admin manage character guides; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage character guides" ON public.character_guide_sections TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: character_trait_scores admin manage character trait scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage character trait scores" ON public.character_trait_scores TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: character_traits admin manage character traits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage character traits" ON public.character_traits TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: characters admin manage characters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage characters" ON public.characters TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: combo_moves admin manage combo moves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage combo moves" ON public.combo_moves TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: combos admin manage combos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage combos" ON public.combos TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: counters admin manage counters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage counters" ON public.counters TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: diagnoses admin manage diagnoses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage diagnoses" ON public.diagnoses TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: diagnosis_options admin manage diagnosis options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage diagnosis options" ON public.diagnosis_options TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: diagnosis_questions admin manage diagnosis questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage diagnosis questions" ON public.diagnosis_questions TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: diagnosis_results admin manage diagnosis results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage diagnosis results" ON public.diagnosis_results TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: entity_sources admin manage entity sources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage entity sources" ON public.entity_sources TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: entity_videos admin manage entity videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage entity videos" ON public.entity_videos TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: glossary admin manage glossary; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage glossary" ON public.glossary TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: glossary_aliases admin manage glossary aliases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage glossary aliases" ON public.glossary_aliases TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: match_participants admin manage match participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage match participants" ON public.match_participants TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: matches admin manage matches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage matches" ON public.matches TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: move_aliases admin manage move aliases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage move aliases" ON public.move_aliases TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: move_commands admin manage move commands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage move commands" ON public.move_commands TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: move_frame_data admin manage move frames; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage move frames" ON public.move_frame_data TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: moves admin manage moves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage moves" ON public.moves TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: patches admin manage patches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage patches" ON public.patches TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: player_aliases admin manage player aliases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage player aliases" ON public.player_aliases TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: player_characters admin manage player characters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage player characters" ON public.player_characters TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: players admin manage players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage players" ON public.players TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: profiles admin manage profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage profiles" ON public.profiles TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: sequences admin manage sequences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage sequences" ON public.sequences TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: setup_moves admin manage setup moves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage setup moves" ON public.setup_moves TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: setups admin manage setups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage setups" ON public.setups TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: sources admin manage sources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage sources" ON public.sources TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: tournament_results admin manage tournament results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage tournament results" ON public.tournament_results TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: tournaments admin manage tournaments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage tournaments" ON public.tournaments TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: training_relations admin manage training relations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage training relations" ON public.training_relations TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: trainings admin manage trainings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage trainings" ON public.trainings TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: videos admin manage videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin manage videos" ON public.videos TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: diagnosis_focus_rules admin update diagnosis focus rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin update diagnosis focus rules" ON public.diagnosis_focus_rules FOR UPDATE TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_flows admin update quick help flows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin update quick help flows" ON public.coach_quick_help_flows FOR UPDATE TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_nodes admin update quick help nodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin update quick help nodes" ON public.coach_quick_help_nodes FOR UPDATE TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: coach_quick_help_options admin update quick help options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "admin update quick help options" ON public.coach_quick_help_options FOR UPDATE TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: ai_coach_generations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_coach_generations ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_coach_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_coach_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_coach_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_coach_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: capture_backlog; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.capture_backlog ENABLE ROW LEVEL SECURITY;

--
-- Name: character_aliases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.character_aliases ENABLE ROW LEVEL SECURITY;

--
-- Name: character_content_packages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.character_content_packages ENABLE ROW LEVEL SECURITY;

--
-- Name: character_guide_sections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.character_guide_sections ENABLE ROW LEVEL SECURITY;

--
-- Name: character_trait_scores; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.character_trait_scores ENABLE ROW LEVEL SECURITY;

--
-- Name: character_traits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.character_traits ENABLE ROW LEVEL SECURITY;

--
-- Name: characters; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

--
-- Name: capture_backlog client deny capture backlog; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "client deny capture backlog" ON public.capture_backlog TO anon, authenticated USING (false) WITH CHECK (false);


--
-- Name: coach_quick_help_answers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coach_quick_help_answers ENABLE ROW LEVEL SECURITY;

--
-- Name: coach_quick_help_flows; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coach_quick_help_flows ENABLE ROW LEVEL SECURITY;

--
-- Name: coach_quick_help_intakes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coach_quick_help_intakes ENABLE ROW LEVEL SECURITY;

--
-- Name: coach_quick_help_nodes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coach_quick_help_nodes ENABLE ROW LEVEL SECURITY;

--
-- Name: coach_quick_help_options; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coach_quick_help_options ENABLE ROW LEVEL SECURITY;

--
-- Name: combo_moves; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.combo_moves ENABLE ROW LEVEL SECURITY;

--
-- Name: combos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.combos ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_inbox; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_inbox ENABLE ROW LEVEL SECURITY;

--
-- Name: counters; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;

--
-- Name: diagnoses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;

--
-- Name: diagnosis_answers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.diagnosis_answers ENABLE ROW LEVEL SECURITY;

--
-- Name: diagnosis_focus_rules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.diagnosis_focus_rules ENABLE ROW LEVEL SECURITY;

--
-- Name: diagnosis_options; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.diagnosis_options ENABLE ROW LEVEL SECURITY;

--
-- Name: diagnosis_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.diagnosis_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: diagnosis_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.diagnosis_results ENABLE ROW LEVEL SECURITY;

--
-- Name: entity_sources; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.entity_sources ENABLE ROW LEVEL SECURITY;

--
-- Name: entity_videos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.entity_videos ENABLE ROW LEVEL SECURITY;

--
-- Name: favorites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: glossary; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

--
-- Name: glossary_aliases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.glossary_aliases ENABLE ROW LEVEL SECURITY;

--
-- Name: match_participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;

--
-- Name: matches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

--
-- Name: move_aliases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.move_aliases ENABLE ROW LEVEL SECURITY;

--
-- Name: move_commands; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.move_commands ENABLE ROW LEVEL SECURITY;

--
-- Name: move_frame_data; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.move_frame_data ENABLE ROW LEVEL SECURITY;

--
-- Name: move_motion_media; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.move_motion_media ENABLE ROW LEVEL SECURITY;

--
-- Name: move_motion_media move_motion_media_admin_manage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY move_motion_media_admin_manage ON public.move_motion_media TO authenticated USING (( SELECT private.is_admin() AS is_admin)) WITH CHECK (( SELECT private.is_admin() AS is_admin));


--
-- Name: move_motion_media move_motion_media_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY move_motion_media_public_read ON public.move_motion_media FOR SELECT TO anon, authenticated USING (private.is_move_motion_media_public_ready(id));


--
-- Name: moves; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.moves ENABLE ROW LEVEL SECURITY;

--
-- Name: patches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.patches ENABLE ROW LEVEL SECURITY;

--
-- Name: character_guide_sections phase23_device_preview_character_guide_sections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_character_guide_sections ON public.character_guide_sections FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND (EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = character_guide_sections.character_id) AND (c.status = 'published'::text) AND (c.is_playable = true))))));


--
-- Name: combos phase23_device_preview_combos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_combos ON public.combos FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND (EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = combos.character_id) AND (c.status = 'published'::text) AND (c.is_playable = true))))));


--
-- Name: counters phase23_device_preview_counters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_counters ON public.counters FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND ((EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = counters.defender_character_id) AND (c.status = 'published'::text) AND (c.is_playable = true)))) OR (EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = counters.opponent_character_id) AND (c.status = 'published'::text) AND (c.is_playable = true)))))));


--
-- Name: move_commands phase23_device_preview_move_commands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_move_commands ON public.move_commands FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND (EXISTS ( SELECT 1
   FROM (public.moves m
     JOIN public.characters c ON ((c.id = m.character_id)))
  WHERE ((m.id = move_commands.move_id) AND (c.status = 'published'::text) AND (c.is_playable = true))))));


--
-- Name: move_frame_data phase23_device_preview_move_frame_data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_move_frame_data ON public.move_frame_data FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND (EXISTS ( SELECT 1
   FROM (public.moves m
     JOIN public.characters c ON ((c.id = m.character_id)))
  WHERE ((m.id = move_frame_data.move_id) AND (c.status = 'published'::text) AND (c.is_playable = true))))));


--
-- Name: move_motion_media phase23_device_preview_move_motion_media; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_move_motion_media ON public.move_motion_media FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND (EXISTS ( SELECT 1
   FROM (public.moves m
     JOIN public.characters c ON ((c.id = m.character_id)))
  WHERE ((m.id = move_motion_media.move_id) AND (c.status = 'published'::text) AND (c.is_playable = true))))));


--
-- Name: moves phase23_device_preview_moves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_moves ON public.moves FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND (EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = moves.character_id) AND (c.status = 'published'::text) AND (c.is_playable = true))))));


--
-- Name: sequences phase23_device_preview_sequences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_sequences ON public.sequences FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND (EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = sequences.character_id) AND (c.status = 'published'::text) AND (c.is_playable = true))))));


--
-- Name: setups phase23_device_preview_setups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_setups ON public.setups FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND (EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = setups.character_id) AND (c.status = 'published'::text) AND (c.is_playable = true))))));


--
-- Name: trainings phase23_device_preview_trainings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY phase23_device_preview_trainings ON public.trainings FOR SELECT TO anon USING ((( SELECT private.is_phase23_device_preview() AS is_phase23_device_preview) AND ((EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = trainings.player_character_id) AND (c.status = 'published'::text) AND (c.is_playable = true)))) OR (EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = trainings.dummy_character_id) AND (c.status = 'published'::text) AND (c.is_playable = true)))))));


--
-- Name: player_aliases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_aliases ENABLE ROW LEVEL SECURITY;

--
-- Name: player_characters; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.player_characters ENABLE ROW LEVEL SECURITY;

--
-- Name: players; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: character_aliases public read character aliases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read character aliases" ON public.character_aliases FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.characters c
  WHERE ((c.id = character_aliases.character_id) AND (c.status = 'published'::text)))));


--
-- Name: combo_moves public read combo moves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read combo moves" ON public.combo_moves FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.combos c
  WHERE ((c.id = combo_moves.combo_id) AND (c.status = 'published'::text)))));


--
-- Name: glossary_aliases public read glossary aliases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read glossary aliases" ON public.glossary_aliases FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.glossary g
  WHERE ((g.id = glossary_aliases.glossary_id) AND (g.status = 'published'::text)))));


--
-- Name: match_participants public read match participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read match participants" ON public.match_participants FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.matches m
  WHERE ((m.id = match_participants.match_id) AND (m.status = 'published'::text)))));


--
-- Name: move_aliases public read move aliases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read move aliases" ON public.move_aliases FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.moves m
  WHERE ((m.id = move_aliases.move_id) AND (m.status = 'published'::text)))));


--
-- Name: move_commands public read move commands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read move commands" ON public.move_commands FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.moves m
  WHERE ((m.id = move_commands.move_id) AND (m.status = 'published'::text)))) AND (EXISTS ( SELECT 1
   FROM (public.entity_sources es
     JOIN public.sources s ON ((s.id = es.source_id)))
  WHERE ((es.entity_type = 'move_command'::text) AND (es.entity_id = move_commands.id) AND (s.reliability_level = 'official'::text))))));


--
-- Name: move_frame_data public read move frames; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read move frames" ON public.move_frame_data FOR SELECT USING (((verification_status = 'verified'::text) AND (EXISTS ( SELECT 1
   FROM public.moves m
  WHERE ((m.id = move_frame_data.move_id) AND (m.status = 'published'::text))))));


--
-- Name: patches public read patches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read patches" ON public.patches FOR SELECT USING (true);


--
-- Name: player_aliases public read player aliases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read player aliases" ON public.player_aliases FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.players p
  WHERE ((p.id = player_aliases.player_id) AND (p.status = 'published'::text)))));


--
-- Name: player_characters public read player characters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read player characters" ON public.player_characters FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.players p
  WHERE ((p.id = player_characters.player_id) AND (p.status = 'published'::text)))));


--
-- Name: character_traits public read published character traits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published character traits" ON public.character_traits FOR SELECT USING ((status = 'published'::text));


--
-- Name: characters public read published characters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published characters" ON public.characters FOR SELECT USING ((status = 'published'::text));


--
-- Name: entity_videos public read published entity videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published entity videos" ON public.entity_videos FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.videos v
  WHERE ((v.id = entity_videos.video_id) AND (v.status = 'published'::text)))));


--
-- Name: glossary public read published glossary; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published glossary" ON public.glossary FOR SELECT USING ((status = 'published'::text));


--
-- Name: matches public read published matches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published matches" ON public.matches FOR SELECT USING ((status = 'published'::text));


--
-- Name: players public read published players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published players" ON public.players FOR SELECT USING ((status = 'published'::text));


--
-- Name: tournaments public read published tournaments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published tournaments" ON public.tournaments FOR SELECT USING ((status = 'published'::text));


--
-- Name: videos public read published videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published videos" ON public.videos FOR SELECT USING ((status = 'published'::text));


--
-- Name: character_trait_scores public read release-ready character trait scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready character trait scores" ON public.character_trait_scores FOR SELECT USING (
CASE
    WHEN ((status = 'published'::text) AND (verification_status = 'verified'::text)) THEN private.is_character_trait_score_public_ready(id)
    ELSE false
END);


--
-- Name: combos public read release-ready combos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready combos" ON public.combos FOR SELECT TO anon, authenticated USING (
CASE
    WHEN ((status = 'published'::text) AND (verification_status = 'verified'::text) AND (valid_to_patch_id IS NULL)) THEN private.is_combo_public_ready(id)
    ELSE false
END);


--
-- Name: counters public read release-ready counters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready counters" ON public.counters FOR SELECT TO anon, authenticated USING (
CASE
    WHEN ((status = 'published'::text) AND (verification_status = 'verified'::text) AND (valid_to_patch_id IS NULL)) THEN private.is_counter_public_ready(id)
    ELSE false
END);


--
-- Name: diagnoses public read release-ready diagnoses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready diagnoses" ON public.diagnoses FOR SELECT USING (private.is_diagnosis_public_ready(id));


--
-- Name: diagnosis_options public read release-ready diagnosis options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready diagnosis options" ON public.diagnosis_options FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.diagnosis_questions q
  WHERE ((q.id = diagnosis_options.question_id) AND (q.status = 'published'::text) AND private.is_diagnosis_public_ready(q.diagnosis_id)))));


--
-- Name: diagnosis_questions public read release-ready diagnosis questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready diagnosis questions" ON public.diagnosis_questions FOR SELECT USING (((status = 'published'::text) AND private.is_diagnosis_public_ready(diagnosis_id)));


--
-- Name: moves public read release-ready moves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready moves" ON public.moves FOR SELECT USING (
CASE
    WHEN (status = 'published'::text) THEN private.is_move_public_ready(id)
    ELSE false
END);


--
-- Name: sequences public read release-ready sequences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready sequences" ON public.sequences FOR SELECT TO anon, authenticated USING (
CASE
    WHEN ((status = 'published'::text) AND (verification_status = 'verified'::text) AND (valid_to_patch_id IS NULL)) THEN private.is_sequence_public_ready(id)
    ELSE false
END);


--
-- Name: setups public read release-ready setups; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready setups" ON public.setups FOR SELECT TO anon, authenticated USING (
CASE
    WHEN ((status = 'published'::text) AND (verification_status = 'verified'::text) AND (valid_to_patch_id IS NULL)) THEN private.is_setup_public_ready(id)
    ELSE false
END);


--
-- Name: trainings public read release-ready trainings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read release-ready trainings" ON public.trainings FOR SELECT TO anon, authenticated USING (
CASE
    WHEN ((status = 'published'::text) AND (verification_status = 'verified'::text) AND (valid_to_patch_id IS NULL)) THEN private.is_training_public_ready(id)
    ELSE false
END);


--
-- Name: setup_moves public read setup moves; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read setup moves" ON public.setup_moves FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.setups s
  WHERE ((s.id = setup_moves.setup_id) AND (s.status = 'published'::text)))));


--
-- Name: tournament_results public read tournament results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read tournament results" ON public.tournament_results FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.tournaments t
  WHERE ((t.id = tournament_results.tournament_id) AND (t.status = 'published'::text)))));


--
-- Name: training_relations public read training relations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read training relations" ON public.training_relations FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.trainings t
  WHERE ((t.id = training_relations.training_id) AND (t.status = 'published'::text)))));


--
-- Name: character_guide_sections public read verified published character guides; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read verified published character guides" ON public.character_guide_sections FOR SELECT USING (((status = 'published'::text) AND (verification_status = 'verified'::text)));


--
-- Name: diagnosis_focus_rules read published or admin diagnosis focus rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "read published or admin diagnosis focus rules" ON public.diagnosis_focus_rules FOR SELECT TO anon, authenticated USING (((status = 'published'::text) OR ( SELECT private.is_admin() AS is_admin)));


--
-- Name: coach_quick_help_flows read published or admin quick help flows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "read published or admin quick help flows" ON public.coach_quick_help_flows FOR SELECT TO anon, authenticated USING (((status = 'published'::text) OR ( SELECT private.is_admin() AS is_admin)));


--
-- Name: coach_quick_help_nodes read published or admin quick help nodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "read published or admin quick help nodes" ON public.coach_quick_help_nodes FOR SELECT TO anon, authenticated USING ((EXISTS ( SELECT 1
   FROM public.coach_quick_help_flows f
  WHERE ((f.id = coach_quick_help_nodes.flow_id) AND ((f.status = 'published'::text) OR ( SELECT private.is_admin() AS is_admin))))));


--
-- Name: coach_quick_help_options read published or admin quick help options; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "read published or admin quick help options" ON public.coach_quick_help_options FOR SELECT TO anon, authenticated USING ((EXISTS ( SELECT 1
   FROM (public.coach_quick_help_nodes n
     JOIN public.coach_quick_help_flows f ON ((f.id = n.flow_id)))
  WHERE ((n.id = coach_quick_help_options.node_id) AND ((f.status = 'published'::text) OR ( SELECT private.is_admin() AS is_admin))))));


--
-- Name: sequences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;

--
-- Name: setup_moves; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.setup_moves ENABLE ROW LEVEL SECURITY;

--
-- Name: setups; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.setups ENABLE ROW LEVEL SECURITY;

--
-- Name: sources; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

--
-- Name: tournament_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tournament_results ENABLE ROW LEVEL SECURITY;

--
-- Name: tournaments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

--
-- Name: training_relations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.training_relations ENABLE ROW LEVEL SECURITY;

--
-- Name: trainings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_activity_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: user_game_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_game_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_match_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_match_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: user_training_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_training_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: user_training_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_training_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: user_activity_logs users delete own activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own activity logs" ON public.user_activity_logs FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: ai_coach_messages users delete own coach messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own coach messages" ON public.ai_coach_messages FOR DELETE TO authenticated USING (((( SELECT auth.uid() AS uid) = user_id) AND (role = 'user'::text)));


--
-- Name: ai_coach_sessions users delete own coach sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own coach sessions" ON public.ai_coach_sessions FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: diagnosis_answers users delete own diagnosis answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own diagnosis answers" ON public.diagnosis_answers FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.diagnosis_results r
  WHERE ((r.id = diagnosis_answers.diagnosis_result_id) AND (r.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: diagnosis_results users delete own diagnosis results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own diagnosis results" ON public.diagnosis_results FOR DELETE USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: user_game_profiles users delete own game profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own game profile" ON public.user_game_profiles FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_match_logs users delete own match logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own match logs" ON public.user_match_logs FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: coach_quick_help_answers users delete own quick help answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own quick help answers" ON public.coach_quick_help_answers FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: coach_quick_help_intakes users delete own quick help intakes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own quick help intakes" ON public.coach_quick_help_intakes FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_training_logs users delete own training logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own training logs" ON public.user_training_logs FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_training_plans users delete own training plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users delete own training plans" ON public.user_training_plans FOR DELETE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: ai_coach_messages users insert own coach messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own coach messages" ON public.ai_coach_messages FOR INSERT TO authenticated WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND (role = 'user'::text) AND (EXISTS ( SELECT 1
   FROM public.ai_coach_sessions s
  WHERE ((s.id = ai_coach_messages.session_id) AND (s.user_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: ai_coach_sessions users insert own coach sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own coach sessions" ON public.ai_coach_sessions FOR INSERT TO authenticated WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND ((diagnosis_result_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.diagnosis_results r
  WHERE ((r.id = ai_coach_sessions.diagnosis_result_id) AND (r.user_id = ( SELECT auth.uid() AS uid))))))));


--
-- Name: diagnosis_answers users insert own diagnosis answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own diagnosis answers" ON public.diagnosis_answers FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.diagnosis_results r
  WHERE ((r.id = diagnosis_answers.diagnosis_result_id) AND (r.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: diagnosis_results users insert own diagnosis results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own diagnosis results" ON public.diagnosis_results FOR INSERT WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: user_game_profiles users insert own game profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own game profile" ON public.user_game_profiles FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_match_logs users insert own match logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own match logs" ON public.user_match_logs FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: coach_quick_help_answers users insert own quick help answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own quick help answers" ON public.coach_quick_help_answers FOR INSERT TO authenticated WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND (EXISTS ( SELECT 1
   FROM public.coach_quick_help_intakes i
  WHERE ((i.id = coach_quick_help_answers.intake_id) AND (i.user_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: coach_quick_help_intakes users insert own quick help intakes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own quick help intakes" ON public.coach_quick_help_intakes FOR INSERT TO authenticated WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_training_logs users insert own training logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own training logs" ON public.user_training_logs FOR INSERT TO authenticated WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND ((training_plan_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.user_training_plans p
  WHERE ((p.id = user_training_logs.training_plan_id) AND (p.user_id = ( SELECT auth.uid() AS uid))))))));


--
-- Name: user_training_plans users insert own training plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users insert own training plans" ON public.user_training_plans FOR INSERT TO authenticated WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND ((source_diagnosis_result_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.diagnosis_results r
  WHERE ((r.id = user_training_plans.source_diagnosis_result_id) AND (r.user_id = ( SELECT auth.uid() AS uid)))))) AND ((source_match_log_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.user_match_logs m
  WHERE ((m.id = user_training_plans.source_match_log_id) AND (m.user_id = ( SELECT auth.uid() AS uid)))))) AND ((source_coach_session_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.ai_coach_sessions s
  WHERE ((s.id = user_training_plans.source_coach_session_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))))));


--
-- Name: favorites users manage own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users manage own favorites" ON public.favorites TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: user_activity_logs users read own activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own activity logs" ON public.user_activity_logs FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: ai_coach_generations users read own coach generations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own coach generations" ON public.ai_coach_generations FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: ai_coach_messages users read own coach messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own coach messages" ON public.ai_coach_messages FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: ai_coach_sessions users read own coach sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own coach sessions" ON public.ai_coach_sessions FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: diagnosis_answers users read own diagnosis answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own diagnosis answers" ON public.diagnosis_answers FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.diagnosis_results r
  WHERE ((r.id = diagnosis_answers.diagnosis_result_id) AND (r.user_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: diagnosis_results users read own diagnosis results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own diagnosis results" ON public.diagnosis_results FOR SELECT TO authenticated USING (((user_id = ( SELECT auth.uid() AS uid)) OR ( SELECT private.is_admin() AS is_admin)));


--
-- Name: user_game_profiles users read own game profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own game profile" ON public.user_game_profiles FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_match_logs users read own match logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own match logs" ON public.user_match_logs FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: profiles users read own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated USING (((id = ( SELECT auth.uid() AS uid)) OR ( SELECT private.is_admin() AS is_admin)));


--
-- Name: coach_quick_help_answers users read own quick help answers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own quick help answers" ON public.coach_quick_help_answers FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: coach_quick_help_intakes users read own quick help intakes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own quick help intakes" ON public.coach_quick_help_intakes FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_training_logs users read own training logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own training logs" ON public.user_training_logs FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_training_plans users read own training plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own training plans" ON public.user_training_plans FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: ai_coach_messages users update own coach messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own coach messages" ON public.ai_coach_messages FOR UPDATE TO authenticated USING (((( SELECT auth.uid() AS uid) = user_id) AND (role = 'user'::text))) WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND (role = 'user'::text) AND (EXISTS ( SELECT 1
   FROM public.ai_coach_sessions s
  WHERE ((s.id = ai_coach_messages.session_id) AND (s.user_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: ai_coach_sessions users update own coach sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own coach sessions" ON public.ai_coach_sessions FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND ((diagnosis_result_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.diagnosis_results r
  WHERE ((r.id = ai_coach_sessions.diagnosis_result_id) AND (r.user_id = ( SELECT auth.uid() AS uid))))))));


--
-- Name: user_game_profiles users update own game profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own game profile" ON public.user_game_profiles FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: user_match_logs users update own match logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own match logs" ON public.user_match_logs FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));


--
-- Name: profiles users update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((id = ( SELECT auth.uid() AS uid))) WITH CHECK ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: coach_quick_help_intakes users update own quick help intakes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own quick help intakes" ON public.coach_quick_help_intakes FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND ((ai_coach_session_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.ai_coach_sessions s
  WHERE ((s.id = coach_quick_help_intakes.ai_coach_session_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))))));


--
-- Name: user_training_logs users update own training logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own training logs" ON public.user_training_logs FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND ((training_plan_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.user_training_plans p
  WHERE ((p.id = user_training_logs.training_plan_id) AND (p.user_id = ( SELECT auth.uid() AS uid))))))));


--
-- Name: user_training_plans users update own training plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users update own training plans" ON public.user_training_plans FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK (((( SELECT auth.uid() AS uid) = user_id) AND ((source_diagnosis_result_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.diagnosis_results r
  WHERE ((r.id = user_training_plans.source_diagnosis_result_id) AND (r.user_id = ( SELECT auth.uid() AS uid)))))) AND ((source_match_log_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.user_match_logs m
  WHERE ((m.id = user_training_plans.source_match_log_id) AND (m.user_id = ( SELECT auth.uid() AS uid)))))) AND ((source_coach_session_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.ai_coach_sessions s
  WHERE ((s.id = user_training_plans.source_coach_session_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))))));


--
-- Name: videos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Admin deletes Move motion media; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admin deletes Move motion media" ON storage.objects FOR DELETE TO authenticated USING (((bucket_id = 'move-motion-media'::text) AND ( SELECT private.is_admin() AS is_admin)));


--
-- Name: objects Admin lists Move motion media; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admin lists Move motion media" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'move-motion-media'::text) AND ( SELECT private.is_admin() AS is_admin)));


--
-- Name: objects Admin updates Move motion media; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admin updates Move motion media" ON storage.objects FOR UPDATE TO authenticated USING (((bucket_id = 'move-motion-media'::text) AND ( SELECT private.is_admin() AS is_admin))) WITH CHECK (((bucket_id = 'move-motion-media'::text) AND ( SELECT private.is_admin() AS is_admin)));


--
-- Name: objects Admin uploads Move motion media; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Admin uploads Move motion media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'move-motion-media'::text) AND ( SELECT private.is_admin() AS is_admin)));


--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;


--
-- Name: SCHEMA private; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA private TO anon;
GRANT USAGE ON SCHEMA private TO authenticated;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION capture_user_activity(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.capture_user_activity() FROM PUBLIC;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC;


--
-- Name: FUNCTION is_admin(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_admin() TO anon;
GRANT ALL ON FUNCTION private.is_admin() TO authenticated;
GRANT ALL ON FUNCTION private.is_admin() TO service_role;


--
-- Name: FUNCTION is_combo_public_ready(target_combo_id uuid); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_combo_public_ready(target_combo_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_combo_public_ready(target_combo_id uuid) TO anon;
GRANT ALL ON FUNCTION private.is_combo_public_ready(target_combo_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_combo_public_ready(target_combo_id uuid) TO service_role;


--
-- Name: FUNCTION is_counter_public_ready(target_counter_id uuid); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_counter_public_ready(target_counter_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_counter_public_ready(target_counter_id uuid) TO anon;
GRANT ALL ON FUNCTION private.is_counter_public_ready(target_counter_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_counter_public_ready(target_counter_id uuid) TO service_role;


--
-- Name: FUNCTION is_generic_setup_template(p_starter_condition text, p_sequence_text text, p_description text); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_generic_setup_template(p_starter_condition text, p_sequence_text text, p_description text) FROM PUBLIC;


--
-- Name: FUNCTION is_move_motion_media_public_ready(target_id uuid); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_move_motion_media_public_ready(target_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_move_motion_media_public_ready(target_id uuid) TO anon;
GRANT ALL ON FUNCTION private.is_move_motion_media_public_ready(target_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_move_motion_media_public_ready(target_id uuid) TO service_role;


--
-- Name: FUNCTION is_move_public_ready(target_move_id uuid); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_move_public_ready(target_move_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_move_public_ready(target_move_id uuid) TO anon;
GRANT ALL ON FUNCTION private.is_move_public_ready(target_move_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_move_public_ready(target_move_id uuid) TO service_role;


--
-- Name: FUNCTION is_phase23_device_preview(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_phase23_device_preview() FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_phase23_device_preview() TO anon;
GRANT ALL ON FUNCTION private.is_phase23_device_preview() TO authenticated;


--
-- Name: FUNCTION is_public_source_target(target_entity_type text, target_entity_id uuid); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_public_source_target(target_entity_type text, target_entity_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_public_source_target(target_entity_type text, target_entity_id uuid) TO anon;
GRANT ALL ON FUNCTION private.is_public_source_target(target_entity_type text, target_entity_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_public_source_target(target_entity_type text, target_entity_id uuid) TO service_role;


--
-- Name: FUNCTION is_sequence_public_ready(target_sequence_id uuid); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_sequence_public_ready(target_sequence_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_sequence_public_ready(target_sequence_id uuid) TO anon;
GRANT ALL ON FUNCTION private.is_sequence_public_ready(target_sequence_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_sequence_public_ready(target_sequence_id uuid) TO service_role;


--
-- Name: FUNCTION is_setup_public_ready(target_setup_id uuid); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_setup_public_ready(target_setup_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_setup_public_ready(target_setup_id uuid) TO anon;
GRANT ALL ON FUNCTION private.is_setup_public_ready(target_setup_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_setup_public_ready(target_setup_id uuid) TO service_role;


--
-- Name: FUNCTION is_training_public_ready(target_training_id uuid); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_training_public_ready(target_training_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_training_public_ready(target_training_id uuid) TO anon;
GRANT ALL ON FUNCTION private.is_training_public_ready(target_training_id uuid) TO authenticated;
GRANT ALL ON FUNCTION private.is_training_public_ready(target_training_id uuid) TO service_role;


--
-- Name: FUNCTION purge_expired_contact_inbox(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.purge_expired_contact_inbox() FROM PUBLIC;


--
-- Name: FUNCTION snapshot_user_training_log(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.snapshot_user_training_log() FROM PUBLIC;


--
-- Name: FUNCTION validate_ai_coach_session_write(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_ai_coach_session_write() FROM PUBLIC;


--
-- Name: FUNCTION validate_ai_coach_user_message_write(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_ai_coach_user_message_write() FROM PUBLIC;


--
-- Name: FUNCTION validate_diagnosis_result_completeness(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_diagnosis_result_completeness() FROM PUBLIC;


--
-- Name: FUNCTION validate_diagnosis_result_write(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_diagnosis_result_write() FROM PUBLIC;


--
-- Name: FUNCTION validate_favorite_write(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_favorite_write() FROM PUBLIC;


--
-- Name: FUNCTION validate_profile_write(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_profile_write() FROM PUBLIC;


--
-- Name: FUNCTION validate_quick_help_answer_write(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_quick_help_answer_write() FROM PUBLIC;


--
-- Name: FUNCTION validate_quick_help_intake_write(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_quick_help_intake_write() FROM PUBLIC;


--
-- Name: FUNCTION validate_user_game_profile_write(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_user_game_profile_write() FROM PUBLIC;


--
-- Name: FUNCTION validate_user_match_log(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_user_match_log() FROM PUBLIC;


--
-- Name: FUNCTION validate_user_training_log_plan(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_user_training_log_plan() FROM PUBLIC;


--
-- Name: FUNCTION validate_user_training_plan(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.validate_user_training_plan() FROM PUBLIC;


--
-- Name: FUNCTION answer_quick_help_intake(p_intake_id uuid, p_option_id uuid, p_character_id uuid, p_move_id uuid, p_free_text text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.answer_quick_help_intake(p_intake_id uuid, p_option_id uuid, p_character_id uuid, p_move_id uuid, p_free_text text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.answer_quick_help_intake(p_intake_id uuid, p_option_id uuid, p_character_id uuid, p_move_id uuid, p_free_text text) TO authenticated;
GRANT ALL ON FUNCTION public.answer_quick_help_intake(p_intake_id uuid, p_option_id uuid, p_character_id uuid, p_move_id uuid, p_free_text text) TO service_role;


--
-- Name: FUNCTION append_ai_coach_user_message(p_session_id uuid, p_content text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.append_ai_coach_user_message(p_session_id uuid, p_content text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.append_ai_coach_user_message(p_session_id uuid, p_content text) TO authenticated;
GRANT ALL ON FUNCTION public.append_ai_coach_user_message(p_session_id uuid, p_content text) TO service_role;


--
-- Name: FUNCTION archive_ai_coach_session(p_session_id uuid, p_summary text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.archive_ai_coach_session(p_session_id uuid, p_summary text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.archive_ai_coach_session(p_session_id uuid, p_summary text) TO authenticated;
GRANT ALL ON FUNCTION public.archive_ai_coach_session(p_session_id uuid, p_summary text) TO service_role;


--
-- Name: FUNCTION begin_ai_coach_generation(p_session_id uuid, p_user_message_id uuid, p_model text, p_prompt_hash text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.begin_ai_coach_generation(p_session_id uuid, p_user_message_id uuid, p_model text, p_prompt_hash text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.begin_ai_coach_generation(p_session_id uuid, p_user_message_id uuid, p_model text, p_prompt_hash text) TO service_role;


--
-- Name: FUNCTION complete_ai_coach_generation(p_generation_id uuid, p_content text, p_grounding_refs jsonb, p_input_tokens integer, p_output_tokens integer, p_estimated_cost_usd numeric, p_latency_ms integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.complete_ai_coach_generation(p_generation_id uuid, p_content text, p_grounding_refs jsonb, p_input_tokens integer, p_output_tokens integer, p_estimated_cost_usd numeric, p_latency_ms integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.complete_ai_coach_generation(p_generation_id uuid, p_content text, p_grounding_refs jsonb, p_input_tokens integer, p_output_tokens integer, p_estimated_cost_usd numeric, p_latency_ms integer) TO service_role;


--
-- Name: FUNCTION fail_ai_coach_generation(p_generation_id uuid, p_error_code text, p_error_message text, p_latency_ms integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.fail_ai_coach_generation(p_generation_id uuid, p_error_code text, p_error_message text, p_latency_ms integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.fail_ai_coach_generation(p_generation_id uuid, p_error_code text, p_error_message text, p_latency_ms integer) TO service_role;


--
-- Name: FUNCTION get_activity_summary(p_period text, p_periods integer, p_timezone text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_activity_summary(p_period text, p_periods integer, p_timezone text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_activity_summary(p_period text, p_periods integer, p_timezone text) TO service_role;
GRANT ALL ON FUNCTION public.get_activity_summary(p_period text, p_periods integer, p_timezone text) TO authenticated;


--
-- Name: FUNCTION get_activity_timeline(p_limit integer, p_before timestamp with time zone, p_activity_types text[]); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_activity_timeline(p_limit integer, p_before timestamp with time zone, p_activity_types text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_activity_timeline(p_limit integer, p_before timestamp with time zone, p_activity_types text[]) TO service_role;
GRANT ALL ON FUNCTION public.get_activity_timeline(p_limit integer, p_before timestamp with time zone, p_activity_types text[]) TO authenticated;


--
-- Name: FUNCTION get_adaptive_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_adaptive_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_adaptive_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO service_role;
GRANT ALL ON FUNCTION public.get_adaptive_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO authenticated;


--
-- Name: FUNCTION get_ai_coach_context(p_recent_match_limit integer, p_recent_training_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_ai_coach_context(p_recent_match_limit integer, p_recent_training_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_ai_coach_context(p_recent_match_limit integer, p_recent_training_limit integer) TO service_role;
GRANT ALL ON FUNCTION public.get_ai_coach_context(p_recent_match_limit integer, p_recent_training_limit integer) TO authenticated;


--
-- Name: FUNCTION get_ai_coach_session_context(p_session_id uuid, p_message_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_ai_coach_session_context(p_session_id uuid, p_message_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_ai_coach_session_context(p_session_id uuid, p_message_limit integer) TO service_role;
GRANT ALL ON FUNCTION public.get_ai_coach_session_context(p_session_id uuid, p_message_limit integer) TO authenticated;


--
-- Name: FUNCTION get_improvement_priorities(p_diagnosis_result_id uuid, p_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_improvement_priorities(p_diagnosis_result_id uuid, p_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_improvement_priorities(p_diagnosis_result_id uuid, p_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_improvement_priorities(p_diagnosis_result_id uuid, p_limit integer) TO service_role;


--
-- Name: FUNCTION get_issue_trends(p_recent_match_count integer, p_player_character_id uuid, p_change_threshold_points numeric); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_issue_trends(p_recent_match_count integer, p_player_character_id uuid, p_change_threshold_points numeric) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_issue_trends(p_recent_match_count integer, p_player_character_id uuid, p_change_threshold_points numeric) TO authenticated;
GRANT ALL ON FUNCTION public.get_issue_trends(p_recent_match_count integer, p_player_character_id uuid, p_change_threshold_points numeric) TO service_role;


--
-- Name: FUNCTION get_matchup_performance(p_recent_match_count integer, p_player_character_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_matchup_performance(p_recent_match_count integer, p_player_character_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_matchup_performance(p_recent_match_count integer, p_player_character_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_matchup_performance(p_recent_match_count integer, p_player_character_id uuid) TO service_role;


--
-- Name: FUNCTION get_phase23_character_preview(target_character_id uuid, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase23_character_preview(target_character_id uuid, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase23_character_preview(target_character_id uuid, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase23_character_preview(target_character_id uuid, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase23_move_commands_preview(target_character_id uuid, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase23_move_commands_preview(target_character_id uuid, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase23_move_commands_preview(target_character_id uuid, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase23_move_commands_preview(target_character_id uuid, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase23_move_motion_media_preview(target_character_id uuid, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase23_move_motion_media_preview(target_character_id uuid, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase23_move_motion_media_preview(target_character_id uuid, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase23_move_motion_media_preview(target_character_id uuid, preview_token text) TO authenticated;
GRANT ALL ON FUNCTION public.get_phase23_move_motion_media_preview(target_character_id uuid, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase39_content_detail_preview(target_entity_type text, target_entity_slug text, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase39_content_detail_preview(target_entity_type text, target_entity_slug text, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase39_content_detail_preview(target_entity_type text, target_entity_slug text, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase39_content_detail_preview(target_entity_type text, target_entity_slug text, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase40_combo_move_glossary_preview(target_combo_slug text, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase40_combo_move_glossary_preview(target_combo_slug text, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase40_combo_move_glossary_preview(target_combo_slug text, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase40_combo_move_glossary_preview(target_combo_slug text, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase41_strategy_move_glossary_preview(target_entity_type text, target_entity_slug text, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase41_strategy_move_glossary_preview(target_entity_type text, target_entity_slug text, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase41_strategy_move_glossary_preview(target_entity_type text, target_entity_slug text, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase41_strategy_move_glossary_preview(target_entity_type text, target_entity_slug text, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase42_counter_detail_preview(target_counter_slug text, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase42_counter_detail_preview(target_counter_slug text, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase42_counter_detail_preview(target_counter_slug text, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase42_counter_detail_preview(target_counter_slug text, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase43_character_move_glossary_preview(target_character_id uuid, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase43_character_move_glossary_preview(target_character_id uuid, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase43_character_move_glossary_preview(target_character_id uuid, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase43_character_move_glossary_preview(target_character_id uuid, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase44_move_detail_preview(target_move_slug text, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase44_move_detail_preview(target_move_slug text, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase44_move_detail_preview(target_move_slug text, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase44_move_detail_preview(target_move_slug text, preview_token text) TO service_role;


--
-- Name: FUNCTION get_phase47_move_japanese_preview(target_character_id uuid, preview_token text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_phase47_move_japanese_preview(target_character_id uuid, preview_token text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_phase47_move_japanese_preview(target_character_id uuid, preview_token text) TO anon;
GRANT ALL ON FUNCTION public.get_phase47_move_japanese_preview(target_character_id uuid, preview_token text) TO service_role;


--
-- Name: FUNCTION get_public_entity_sources(target_entity_types text[], target_entity_ids uuid[]); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_public_entity_sources(target_entity_types text[], target_entity_ids uuid[]) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_public_entity_sources(target_entity_types text[], target_entity_ids uuid[]) TO anon;
GRANT ALL ON FUNCTION public.get_public_entity_sources(target_entity_types text[], target_entity_ids uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.get_public_entity_sources(target_entity_types text[], target_entity_ids uuid[]) TO service_role;


--
-- Name: FUNCTION get_quick_help_grounding(p_intake_id uuid, p_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_quick_help_grounding(p_intake_id uuid, p_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_quick_help_grounding(p_intake_id uuid, p_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_quick_help_grounding(p_intake_id uuid, p_limit integer) TO service_role;


--
-- Name: FUNCTION get_quick_help_intake_step(p_intake_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_quick_help_intake_step(p_intake_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_quick_help_intake_step(p_intake_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_quick_help_intake_step(p_intake_id uuid) TO service_role;


--
-- Name: FUNCTION get_quick_help_node(p_flow_slug text, p_node_key text, p_context jsonb); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_quick_help_node(p_flow_slug text, p_node_key text, p_context jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_quick_help_node(p_flow_slug text, p_node_key text, p_context jsonb) TO anon;
GRANT ALL ON FUNCTION public.get_quick_help_node(p_flow_slug text, p_node_key text, p_context jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.get_quick_help_node(p_flow_slug text, p_node_key text, p_context jsonb) TO service_role;


--
-- Name: FUNCTION get_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_today_training_recommendations(p_player_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO service_role;


--
-- Name: FUNCTION get_training_progress(p_recent_session_count integer, p_player_character_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_training_progress(p_recent_session_count integer, p_player_character_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_training_progress(p_recent_session_count integer, p_player_character_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_training_progress(p_recent_session_count integer, p_player_character_id uuid) TO service_role;


--
-- Name: FUNCTION get_training_recommendations(p_focus_keys text[], p_character_id uuid, p_opponent_character_id uuid, p_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_training_recommendations(p_focus_keys text[], p_character_id uuid, p_opponent_character_id uuid, p_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_training_recommendations(p_focus_keys text[], p_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO anon;
GRANT ALL ON FUNCTION public.get_training_recommendations(p_focus_keys text[], p_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_training_recommendations(p_focus_keys text[], p_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO service_role;


--
-- Name: FUNCTION get_training_recommendations_for_result(p_diagnosis_result_id uuid, p_character_id uuid, p_opponent_character_id uuid, p_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_training_recommendations_for_result(p_diagnosis_result_id uuid, p_character_id uuid, p_opponent_character_id uuid, p_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_training_recommendations_for_result(p_diagnosis_result_id uuid, p_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_training_recommendations_for_result(p_diagnosis_result_id uuid, p_character_id uuid, p_opponent_character_id uuid, p_limit integer) TO service_role;


--
-- Name: FUNCTION get_weekly_progress_review(p_week_start date, p_player_character_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_weekly_progress_review(p_week_start date, p_player_character_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_weekly_progress_review(p_week_start date, p_player_character_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_weekly_progress_review(p_week_start date, p_player_character_id uuid) TO service_role;


--
-- Name: FUNCTION list_public_sources(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.list_public_sources() FROM PUBLIC;
GRANT ALL ON FUNCTION public.list_public_sources() TO anon;
GRANT ALL ON FUNCTION public.list_public_sources() TO authenticated;
GRANT ALL ON FUNCTION public.list_public_sources() TO service_role;


--
-- Name: FUNCTION purge_expired_user_activity_logs(p_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.purge_expired_user_activity_logs(p_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.purge_expired_user_activity_logs(p_limit integer) TO service_role;


--
-- Name: FUNCTION save_diagnosis_result_with_answers(p_diagnosis_id uuid, p_result_payload jsonb, p_answers jsonb, p_request_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.save_diagnosis_result_with_answers(p_diagnosis_id uuid, p_result_payload jsonb, p_answers jsonb, p_request_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.save_diagnosis_result_with_answers(p_diagnosis_id uuid, p_result_payload jsonb, p_answers jsonb, p_request_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.save_diagnosis_result_with_answers(p_diagnosis_id uuid, p_result_payload jsonb, p_answers jsonb, p_request_id uuid) TO service_role;


--
-- Name: FUNCTION save_match_log(p_player_character_id uuid, p_opponent_character_id uuid, p_result text, p_primary_issue text, p_played_at timestamp with time zone, p_mode text, p_rank_before text, p_rank_after text, p_mr_before integer, p_mr_after integer, p_rounds_won smallint, p_rounds_lost smallint, p_issue_detail text, p_notes text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.save_match_log(p_player_character_id uuid, p_opponent_character_id uuid, p_result text, p_primary_issue text, p_played_at timestamp with time zone, p_mode text, p_rank_before text, p_rank_after text, p_mr_before integer, p_mr_after integer, p_rounds_won smallint, p_rounds_lost smallint, p_issue_detail text, p_notes text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.save_match_log(p_player_character_id uuid, p_opponent_character_id uuid, p_result text, p_primary_issue text, p_played_at timestamp with time zone, p_mode text, p_rank_before text, p_rank_after text, p_mr_before integer, p_mr_after integer, p_rounds_won smallint, p_rounds_lost smallint, p_issue_detail text, p_notes text) TO authenticated;
GRANT ALL ON FUNCTION public.save_match_log(p_player_character_id uuid, p_opponent_character_id uuid, p_result text, p_primary_issue text, p_played_at timestamp with time zone, p_mode text, p_rank_before text, p_rank_after text, p_mr_before integer, p_mr_after integer, p_rounds_won smallint, p_rounds_lost smallint, p_issue_detail text, p_notes text) TO service_role;


--
-- Name: FUNCTION save_training_completion(p_duration_minutes integer, p_training_plan_id uuid, p_training_id uuid, p_custom_title text, p_practiced_at timestamp with time zone, p_attempts integer, p_successes integer, p_self_rating smallint, p_notes text, p_mark_plan_completed boolean); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.save_training_completion(p_duration_minutes integer, p_training_plan_id uuid, p_training_id uuid, p_custom_title text, p_practiced_at timestamp with time zone, p_attempts integer, p_successes integer, p_self_rating smallint, p_notes text, p_mark_plan_completed boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION public.save_training_completion(p_duration_minutes integer, p_training_plan_id uuid, p_training_id uuid, p_custom_title text, p_practiced_at timestamp with time zone, p_attempts integer, p_successes integer, p_self_rating smallint, p_notes text, p_mark_plan_completed boolean) TO authenticated;
GRANT ALL ON FUNCTION public.save_training_completion(p_duration_minutes integer, p_training_plan_id uuid, p_training_id uuid, p_custom_title text, p_practiced_at timestamp with time zone, p_attempts integer, p_successes integer, p_self_rating smallint, p_notes text, p_mark_plan_completed boolean) TO service_role;


--
-- Name: FUNCTION search_sf6dna(search_query text, result_limit integer); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.search_sf6dna(search_query text, result_limit integer) TO anon;
GRANT ALL ON FUNCTION public.search_sf6dna(search_query text, result_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.search_sf6dna(search_query text, result_limit integer) TO service_role;


--
-- Name: FUNCTION set_current_patch(target_patch_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.set_current_patch(target_patch_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.set_current_patch(target_patch_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.set_current_patch(target_patch_id uuid) TO service_role;


--
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.set_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_updated_at() TO service_role;


--
-- Name: FUNCTION start_ai_coach_session(p_title text, p_coach_tone text, p_character_id uuid, p_diagnosis_result_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.start_ai_coach_session(p_title text, p_coach_tone text, p_character_id uuid, p_diagnosis_result_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.start_ai_coach_session(p_title text, p_coach_tone text, p_character_id uuid, p_diagnosis_result_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.start_ai_coach_session(p_title text, p_coach_tone text, p_character_id uuid, p_diagnosis_result_id uuid) TO service_role;


--
-- Name: FUNCTION start_ai_coach_session_from_quick_help(p_intake_id uuid, p_coach_tone text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.start_ai_coach_session_from_quick_help(p_intake_id uuid, p_coach_tone text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.start_ai_coach_session_from_quick_help(p_intake_id uuid, p_coach_tone text) TO authenticated;
GRANT ALL ON FUNCTION public.start_ai_coach_session_from_quick_help(p_intake_id uuid, p_coach_tone text) TO service_role;


--
-- Name: FUNCTION start_quick_help_intake(p_flow_slug text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.start_quick_help_intake(p_flow_slug text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.start_quick_help_intake(p_flow_slug text) TO authenticated;
GRANT ALL ON FUNCTION public.start_quick_help_intake(p_flow_slug text) TO service_role;


--
-- Name: FUNCTION submit_contact(p_category text, p_message text, p_reply_email text, p_target_url text, p_requester_key text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.submit_contact(p_category text, p_message text, p_reply_email text, p_target_url text, p_requester_key text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.submit_contact(p_category text, p_message text, p_reply_email text, p_target_url text, p_requester_key text) TO anon;
GRANT ALL ON FUNCTION public.submit_contact(p_category text, p_message text, p_reply_email text, p_target_url text, p_requester_key text) TO authenticated;
GRANT ALL ON FUNCTION public.submit_contact(p_category text, p_message text, p_reply_email text, p_target_url text, p_requester_key text) TO service_role;


--
-- Name: TABLE ai_coach_generations; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.ai_coach_generations TO service_role;
GRANT SELECT ON TABLE public.ai_coach_generations TO authenticated;


--
-- Name: TABLE ai_coach_messages; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.ai_coach_messages TO service_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.ai_coach_messages TO authenticated;


--
-- Name: TABLE ai_coach_sessions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.ai_coach_sessions TO service_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.ai_coach_sessions TO authenticated;


--
-- Name: TABLE capture_backlog; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.capture_backlog TO service_role;


--
-- Name: TABLE character_aliases; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.character_aliases TO anon;
GRANT ALL ON TABLE public.character_aliases TO authenticated;
GRANT ALL ON TABLE public.character_aliases TO service_role;


--
-- Name: TABLE character_content_packages; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.character_content_packages TO anon;
GRANT ALL ON TABLE public.character_content_packages TO authenticated;
GRANT ALL ON TABLE public.character_content_packages TO service_role;


--
-- Name: TABLE character_guide_sections; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.character_guide_sections TO anon;
GRANT ALL ON TABLE public.character_guide_sections TO authenticated;
GRANT ALL ON TABLE public.character_guide_sections TO service_role;


--
-- Name: TABLE character_trait_scores; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.character_trait_scores TO anon;
GRANT ALL ON TABLE public.character_trait_scores TO authenticated;
GRANT ALL ON TABLE public.character_trait_scores TO service_role;


--
-- Name: TABLE character_traits; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.character_traits TO anon;
GRANT ALL ON TABLE public.character_traits TO authenticated;
GRANT ALL ON TABLE public.character_traits TO service_role;


--
-- Name: TABLE characters; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.characters TO anon;
GRANT ALL ON TABLE public.characters TO authenticated;
GRANT ALL ON TABLE public.characters TO service_role;


--
-- Name: TABLE coach_quick_help_answers; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.coach_quick_help_answers TO service_role;
GRANT SELECT,INSERT,DELETE ON TABLE public.coach_quick_help_answers TO authenticated;


--
-- Name: TABLE coach_quick_help_flows; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.coach_quick_help_flows TO service_role;
GRANT SELECT ON TABLE public.coach_quick_help_flows TO anon;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.coach_quick_help_flows TO authenticated;


--
-- Name: TABLE coach_quick_help_intakes; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.coach_quick_help_intakes TO service_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.coach_quick_help_intakes TO authenticated;


--
-- Name: TABLE coach_quick_help_nodes; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.coach_quick_help_nodes TO service_role;
GRANT SELECT ON TABLE public.coach_quick_help_nodes TO anon;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.coach_quick_help_nodes TO authenticated;


--
-- Name: TABLE coach_quick_help_options; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.coach_quick_help_options TO service_role;
GRANT SELECT ON TABLE public.coach_quick_help_options TO anon;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.coach_quick_help_options TO authenticated;


--
-- Name: TABLE combo_moves; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.combo_moves TO anon;
GRANT ALL ON TABLE public.combo_moves TO authenticated;
GRANT ALL ON TABLE public.combo_moves TO service_role;


--
-- Name: TABLE combos; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.combos TO anon;
GRANT ALL ON TABLE public.combos TO authenticated;
GRANT ALL ON TABLE public.combos TO service_role;


--
-- Name: TABLE contact_inbox; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.contact_inbox TO service_role;


--
-- Name: TABLE counters; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.counters TO anon;
GRANT ALL ON TABLE public.counters TO authenticated;
GRANT ALL ON TABLE public.counters TO service_role;


--
-- Name: TABLE diagnoses; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.diagnoses TO anon;
GRANT ALL ON TABLE public.diagnoses TO authenticated;
GRANT ALL ON TABLE public.diagnoses TO service_role;


--
-- Name: TABLE diagnosis_answers; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.diagnosis_answers TO service_role;
GRANT SELECT,INSERT,DELETE ON TABLE public.diagnosis_answers TO authenticated;


--
-- Name: TABLE diagnosis_focus_rules; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.diagnosis_focus_rules TO service_role;
GRANT SELECT ON TABLE public.diagnosis_focus_rules TO anon;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.diagnosis_focus_rules TO authenticated;


--
-- Name: TABLE diagnosis_options; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.diagnosis_options TO anon;
GRANT ALL ON TABLE public.diagnosis_options TO authenticated;
GRANT ALL ON TABLE public.diagnosis_options TO service_role;


--
-- Name: TABLE diagnosis_questions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.diagnosis_questions TO anon;
GRANT ALL ON TABLE public.diagnosis_questions TO authenticated;
GRANT ALL ON TABLE public.diagnosis_questions TO service_role;


--
-- Name: TABLE diagnosis_results; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE public.diagnosis_results TO authenticated;
GRANT ALL ON TABLE public.diagnosis_results TO service_role;


--
-- Name: TABLE entity_sources; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.entity_sources TO anon;
GRANT ALL ON TABLE public.entity_sources TO authenticated;
GRANT ALL ON TABLE public.entity_sources TO service_role;


--
-- Name: TABLE entity_videos; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.entity_videos TO anon;
GRANT ALL ON TABLE public.entity_videos TO authenticated;
GRANT ALL ON TABLE public.entity_videos TO service_role;


--
-- Name: TABLE favorites; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.favorites TO authenticated;
GRANT ALL ON TABLE public.favorites TO service_role;


--
-- Name: TABLE glossary; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.glossary TO anon;
GRANT ALL ON TABLE public.glossary TO authenticated;
GRANT ALL ON TABLE public.glossary TO service_role;


--
-- Name: TABLE glossary_aliases; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.glossary_aliases TO anon;
GRANT ALL ON TABLE public.glossary_aliases TO authenticated;
GRANT ALL ON TABLE public.glossary_aliases TO service_role;


--
-- Name: TABLE match_participants; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.match_participants TO anon;
GRANT ALL ON TABLE public.match_participants TO authenticated;
GRANT ALL ON TABLE public.match_participants TO service_role;


--
-- Name: TABLE matches; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.matches TO anon;
GRANT ALL ON TABLE public.matches TO authenticated;
GRANT ALL ON TABLE public.matches TO service_role;


--
-- Name: TABLE move_aliases; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.move_aliases TO anon;
GRANT ALL ON TABLE public.move_aliases TO authenticated;
GRANT ALL ON TABLE public.move_aliases TO service_role;


--
-- Name: TABLE move_commands; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.move_commands TO anon;
GRANT ALL ON TABLE public.move_commands TO authenticated;
GRANT ALL ON TABLE public.move_commands TO service_role;


--
-- Name: TABLE move_frame_data; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.move_frame_data TO anon;
GRANT ALL ON TABLE public.move_frame_data TO authenticated;
GRANT ALL ON TABLE public.move_frame_data TO service_role;


--
-- Name: TABLE move_motion_media; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.move_motion_media TO anon;
GRANT ALL ON TABLE public.move_motion_media TO authenticated;
GRANT ALL ON TABLE public.move_motion_media TO service_role;


--
-- Name: TABLE moves; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.moves TO anon;
GRANT ALL ON TABLE public.moves TO authenticated;
GRANT ALL ON TABLE public.moves TO service_role;


--
-- Name: TABLE patches; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.patches TO anon;
GRANT ALL ON TABLE public.patches TO authenticated;
GRANT ALL ON TABLE public.patches TO service_role;


--
-- Name: TABLE player_aliases; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.player_aliases TO anon;
GRANT ALL ON TABLE public.player_aliases TO authenticated;
GRANT ALL ON TABLE public.player_aliases TO service_role;


--
-- Name: TABLE player_characters; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.player_characters TO anon;
GRANT ALL ON TABLE public.player_characters TO authenticated;
GRANT ALL ON TABLE public.player_characters TO service_role;


--
-- Name: TABLE players; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.players TO anon;
GRANT ALL ON TABLE public.players TO authenticated;
GRANT ALL ON TABLE public.players TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE sequences; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.sequences TO anon;
GRANT ALL ON TABLE public.sequences TO authenticated;
GRANT ALL ON TABLE public.sequences TO service_role;


--
-- Name: TABLE setup_moves; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.setup_moves TO anon;
GRANT ALL ON TABLE public.setup_moves TO authenticated;
GRANT ALL ON TABLE public.setup_moves TO service_role;


--
-- Name: TABLE setups; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.setups TO anon;
GRANT ALL ON TABLE public.setups TO authenticated;
GRANT ALL ON TABLE public.setups TO service_role;


--
-- Name: TABLE sources; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.sources TO anon;
GRANT ALL ON TABLE public.sources TO authenticated;
GRANT ALL ON TABLE public.sources TO service_role;


--
-- Name: TABLE tournament_results; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.tournament_results TO anon;
GRANT ALL ON TABLE public.tournament_results TO authenticated;
GRANT ALL ON TABLE public.tournament_results TO service_role;


--
-- Name: TABLE tournaments; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.tournaments TO anon;
GRANT ALL ON TABLE public.tournaments TO authenticated;
GRANT ALL ON TABLE public.tournaments TO service_role;


--
-- Name: TABLE training_relations; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.training_relations TO anon;
GRANT ALL ON TABLE public.training_relations TO authenticated;
GRANT ALL ON TABLE public.training_relations TO service_role;


--
-- Name: TABLE trainings; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.trainings TO anon;
GRANT ALL ON TABLE public.trainings TO authenticated;
GRANT ALL ON TABLE public.trainings TO service_role;


--
-- Name: TABLE user_activity_logs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_activity_logs TO service_role;
GRANT SELECT,DELETE ON TABLE public.user_activity_logs TO authenticated;


--
-- Name: TABLE user_game_profiles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_game_profiles TO service_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_game_profiles TO authenticated;


--
-- Name: TABLE user_match_logs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_match_logs TO service_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_match_logs TO authenticated;


--
-- Name: TABLE user_training_logs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_training_logs TO service_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_training_logs TO authenticated;


--
-- Name: TABLE user_training_plans; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_training_plans TO service_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_training_plans TO authenticated;


--
-- Name: TABLE videos; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.videos TO anon;
GRANT ALL ON TABLE public.videos TO authenticated;
GRANT ALL ON TABLE public.videos TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict IAKZCPrIh1QPuhjecRHSiaSzgocUzTWj1pqcFoYNgnDF55H8UL3aUB0Vl16QW1v

