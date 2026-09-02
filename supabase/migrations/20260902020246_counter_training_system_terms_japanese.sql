
do $migration$
declare
  counter_count_before integer;
  training_count_before integer;
  counter_count_after integer;
  training_count_after integer;
  counter_verified_before integer;
  training_verified_before integer;
begin
  select count(*), count(*) filter (where verification_status='verified')
    into counter_count_before, counter_verified_before
  from public.counters
  where status='draft' and valid_to_patch_id is null;

  select count(*), count(*) filter (where verification_status='verified')
    into training_count_before, training_verified_before
  from public.trainings
  where status='draft' and valid_to_patch_id is null
    and content_kind in ('training','editorial','verified_strategy');

  if counter_count_before <> 282 then
    raise exception 'counter scope changed: expected 282, got %', counter_count_before;
  end if;
  if training_count_before <> 535 then
    raise exception 'training scope changed: expected 535, got %', training_count_before;
  end if;
  if counter_verified_before <> 0 or training_verified_before <> 0 then
    raise exception 'verified rows unexpectedly present in draft scope';
  end if;
end
$migration$;

create or replace function pg_temp.sf6_naturalize(input_value text)
returns text
language plpgsql
as $function$
declare
  value text := input_value;
begin
  if value is null then
    return null;
  end if;

  -- Internal workflow phrases are rewritten as reader-facing Japanese.
  value := regexp_replace(value, 'Exact distance/gap remains training dependent\.', '正確な距離や間隔は、トレーニングモードでの確認が必要です。', 'gi');
  value := replace(value, 'exact値は実機再現後に確定。', '正確な数値は実機で再現した後に確定します。');
  value := replace(value, '【候補・2026.08.03再監査】', '【2026.08.03時点・要確認】');
  value := replace(value, '保存済み初版攻略を移植。', '初版の攻略内容を反映しています。');
  value := replace(value, '保存済み30秒カードを移植。', '30秒カードの内容を反映しています。');
  value := replace(value, '最優先再監査', '優先して再確認');
  value := replace(value, '再監査', '再確認');
  value := regexp_replace(value, 'current[[:space:]]+frame', '現行フレーム', 'gi');
  value := regexp_replace(value, 'archived', '旧版', 'gi');
  value := regexp_replace(value, 'reviewed', '内容確認済み', 'gi');
  value := regexp_replace(value, 'verified', '検証済み', 'gi');
  value := regexp_replace(value, 'published', '公開済み', 'gi');
  value := regexp_replace(value, 'source', '資料', 'gi');
  value := regexp_replace(value, 'training', 'トレーニングモード', 'gi');
  value := regexp_replace(value, 'candidate', '候補', 'gi');
  value := regexp_replace(value, 're-audit', '再確認', 'gi');
  value := regexp_replace(value, 'import(ed)?', '反映済み', 'gi');
  value := regexp_replace(value, 'saved', '保存済み', 'gi');
  value := regexp_replace(value, 'exact', '正確な', 'gi');

  -- System names and prose abbreviations are expanded without touching numeric move notation.
  value := regexp_replace(value, 'Drive Reversal', 'ドライブリバーサル', 'gi');
  value := regexp_replace(value, 'Drive Rush', 'ドライブラッシュ', 'gi');
  value := regexp_replace(value, 'Drive Impact', 'ドライブインパクト', 'gi');
  value := regexp_replace(value, 'Punish Counter', 'パニッシュカウンター', 'gi');
  value := regexp_replace(value, 'Assist HP', 'アシスト強攻撃', 'gi');
  value := regexp_replace(value, 'Assist MP', 'アシスト中攻撃', 'gi');
  value := regexp_replace(value, 'Assist LP', 'アシスト弱攻撃', 'gi');
  value := regexp_replace(value, 'Assist H([^A-Za-z]|$)', 'アシスト強攻撃\1', 'gi');
  value := regexp_replace(value, 'Assist M([^A-Za-z]|$)', 'アシスト中攻撃\1', 'gi');
  value := regexp_replace(value, 'Assist L([^A-Za-z]|$)', 'アシスト弱攻撃\1', 'gi');
  value := regexp_replace(value, 'wall[[:space:]-]*splat', '壁やられ', 'gi');
  value := regexp_replace(value, 'air[[:space:]]+PC', '空中パニッシュカウンター', 'gi');
  value := regexp_replace(value, 'Modern', 'モダン', 'gi');
  value := regexp_replace(value, 'Classic', 'クラシック', 'gi');
  value := regexp_replace(value, 'Perfect', 'パーフェクト', 'gi');
  value := replace(value, 'Cラッシュ', 'キャンセルドライブラッシュ');
  value := replace(value, 'Dリバ', 'ドライブリバーサル');
  value := replace(value, 'パニカン', 'パニッシュカウンター');
  value := regexp_replace(value, '(^|[^A-Za-z])CDR([^A-Za-z]|$)', '\1キャンセルドライブラッシュ\2', 'g');
  value := regexp_replace(value, '(^|[^A-Za-z])DI([^A-Za-z]|$)', '\1ドライブインパクト\2', 'g');
  value := regexp_replace(value, '(^|[^A-Za-z])DR([^A-Za-z]|$)', '\1ドライブラッシュ\2', 'g');
  value := regexp_replace(value, '(^|[^A-Za-z])PC([^A-Za-z]|$)', '\1パニッシュカウンター\2', 'g');
  value := regexp_replace(value, '(^|[^A-Za-z])CH([^A-Za-z]|$)', '\1カウンターヒット\2', 'g');
  value := regexp_replace(value, '(^|[^A-Za-z])SA([^A-Za-z]|$)', '\1スーパーアーツ\2', 'g');
  value := regexp_replace(value, '(^|[^A-Za-z])Drive([^A-Za-z]|$)', '\1ドライブ\2', 'gi');
  value := regexp_replace(value, '(^|[^A-Za-z])Frame([^A-Za-z]|$)', '\1フレーム\2', 'gi');
  value := regexp_replace(value, '(^|[^A-Za-z])ON([^A-Za-z]|$)', '\1オン\2', 'g');
  value := regexp_replace(value, '(^|[^A-Za-z])OFF([^A-Za-z]|$)', '\1オフ\2', 'g');
  value := regexp_replace(value, '([0-9]+)F([^A-Za-z]|$)', '\1フレーム\2', 'g');

  value := replace(value, ' > ', ' → ');
  value := replace(value, '/', '／');
  return value;
end
$function$;

update public.counters
set
  title = pg_temp.sf6_naturalize(title),
  summary = pg_temp.sf6_naturalize(summary),
  method = pg_temp.sf6_naturalize(method),
  benefit = pg_temp.sf6_naturalize(benefit),
  risk = pg_temp.sf6_naturalize(risk),
  conditions = pg_temp.sf6_naturalize(conditions),
  situation = pg_temp.sf6_naturalize(situation),
  updated_at = now()
where status='draft' and valid_to_patch_id is null;

update public.trainings
set
  name = pg_temp.sf6_naturalize(name),
  purpose = pg_temp.sf6_naturalize(purpose),
  recording_instructions = pg_temp.sf6_naturalize(recording_instructions),
  playback_settings = pg_temp.sf6_naturalize(playback_settings),
  cpu_settings = pg_temp.sf6_naturalize(cpu_settings),
  method = pg_temp.sf6_naturalize(method),
  success_criteria = pg_temp.sf6_naturalize(success_criteria),
  next_step = pg_temp.sf6_naturalize(next_step),
  updated_at = now()
where status='draft' and valid_to_patch_id is null
  and content_kind in ('training','editorial','verified_strategy');

do $verify$
declare
  counter_count_after integer;
  training_count_after integer;
  counter_internal integer;
  training_internal integer;
  counter_abbrev integer;
  training_abbrev integer;
  published_count integer;
  verified_count integer;
begin
  select count(*) into counter_count_after
  from public.counters
  where status='draft' and valid_to_patch_id is null;

  select count(*) into training_count_after
  from public.trainings
  where status='draft' and valid_to_patch_id is null
    and content_kind in ('training','editorial','verified_strategy');

  with values_to_check as (
    select unnest(array[title,summary,method,benefit,risk,conditions,situation]) value
    from public.counters where status='draft' and valid_to_patch_id is null
  )
  select count(*) into counter_internal from values_to_check
  where value ~* '(archived|saved|import|candidate|re-audit|exact|training|reviewed|verified|published|source|current frame)';

  with values_to_check as (
    select unnest(array[name,purpose,recording_instructions,playback_settings,cpu_settings,method,success_criteria,next_step]) value
    from public.trainings
    where status='draft' and valid_to_patch_id is null
      and content_kind in ('training','editorial','verified_strategy')
  )
  select count(*) into training_internal from values_to_check
  where value ~* '(archived|saved|import|candidate|re-audit|exact|training|reviewed|verified|published|source|current frame)';

  with values_to_check as (
    select unnest(array[title,summary,method,benefit,risk,conditions,situation]) value
    from public.counters where status='draft' and valid_to_patch_id is null
  )
  select count(*) into counter_abbrev from values_to_check
  where value ~* '(^|[^A-Za-z])(DI|DR|CDR|PC|CH)([^A-Za-z]|$)|Dリバ|パニカン|Drive Reversal|Drive Rush|Drive Impact|Punish Counter|Assist (HP|MP|LP|H|M|L)';

  with values_to_check as (
    select unnest(array[name,purpose,recording_instructions,playback_settings,cpu_settings,method,success_criteria,next_step]) value
    from public.trainings
    where status='draft' and valid_to_patch_id is null
      and content_kind in ('training','editorial','verified_strategy')
  )
  select count(*) into training_abbrev from values_to_check
  where value ~* '(^|[^A-Za-z])(DI|DR|CDR|PC|CH)([^A-Za-z]|$)|Dリバ|パニカン|Drive Reversal|Drive Rush|Drive Impact|Punish Counter|Assist (HP|MP|LP|H|M|L)';

  select
    count(*) filter (where status='published'),
    count(*) filter (where verification_status='verified')
  into published_count, verified_count
  from (
    select status, verification_status
    from public.counters
    where valid_to_patch_id is null
    union all
    select status, verification_status
    from public.trainings
    where valid_to_patch_id is null
      and content_kind in ('training','editorial','verified_strategy')
  ) x;

  if counter_count_after <> 282 or training_count_after <> 535 then
    raise exception 'row counts changed: counters %, trainings %', counter_count_after, training_count_after;
  end if;
  if counter_internal <> 0 or training_internal <> 0 then
    raise exception 'internal terms remain: counters %, trainings %', counter_internal, training_internal;
  end if;
  if counter_abbrev <> 0 or training_abbrev <> 0 then
    raise exception 'abbreviations remain: counters %, trainings %', counter_abbrev, training_abbrev;
  end if;
  if published_count <> 0 or verified_count <> 0 then
    raise exception 'publication or verification state changed: published %, verified %', published_count, verified_count;
  end if;
end
$verify$;

