-- Phase47: add reader-facing Japanese explanations without overwriting the
-- imported source notes kept in description / usage_summary.
--
-- This migration changes no publication or verification state.

alter table public.moves
  add column if not exists description_ja text,
  add column if not exists usage_summary_ja text;

comment on column public.moves.description_ja is
  'Reader-facing Japanese move explanation. Original imported notes remain in description.';
comment on column public.moves.usage_summary_ja is
  'Reader-facing Japanese usage guidance. Original imported notes remain in usage_summary.';

with current_frame as (
  select distinct on (move_id)
    move_id,
    startup,
    on_block,
    on_hit,
    cancel_type,
    hit_level,
    invincibility
  from public.move_frame_data
  where valid_to_patch_id is null
  order by move_id,
    case verification_status when 'verified' then 0 when 'official' then 1 else 2 end,
    updated_at desc
)
update public.moves m
set description_ja = coalesce(nullif(trim(m.description_ja), ''), case
      when m.move_type = 'normal' and m.name_ja like '%ジャンプ%'
        then 'ジャンプ中に出す通常技です。空中から攻めるときや、空中の相手を迎え撃つときに使います。'
      when m.move_type = 'normal' and m.name_ja like '%しゃがみ%'
        then 'しゃがんだ状態から出す通常技です。間合いや発生、キャンセルの可否を見ながら使い分けます。'
      when m.move_type = 'normal'
        then '立った状態から出す通常技です。相手との距離や技の発生を見ながら、けん制やコンボの始動に使います。'
      when m.move_type = 'unique'
        then '方向入力と攻撃ボタンを組み合わせて出す特殊技です。通常技とは異なる間合いや攻撃判定を持ちます。'
      when m.move_type = 'target_combo'
        then '決められた順番で通常技を入力して出す連続技です。ヒット確認やコンボのつなぎとして使います。'
      when m.move_type = 'special' and coalesce(m.strength_variant, '') ~* '(^|[^A-Za-z])OD([^A-Za-z]|$)'
        then 'Dゲージを使うOD必殺技です。通常版とは発生、無敵、追撃などの性能が異なる場合があります。'
      when m.move_type = 'special'
        then 'このキャラクター固有の必殺技です。ボタンの強度や入力条件によって、性能が変わる場合があります。'
      when m.move_type = 'super' and (coalesce(m.strength_variant, '') ~* 'CA' or m.name_ja like '%クリティカルアーツ%')
        then '体力が少ないときに使えるクリティカルアーツです。SAゲージをすべて使い、コンボの締めや確定反撃で大きなダメージを狙います。'
      when m.move_type = 'super'
        then 'SAゲージを使うスーパーアーツです。コンボの締め、確定反撃、切り返しなど、技ごとの役割に合わせて使います。'
      when m.move_type = 'throw'
        then '近距離で相手をつかむ投げ技です。ガードを固める相手を崩すときや、画面位置を入れ替えたいときに使います。'
      when m.move_type = 'drive' and m.name_ja like '%ドライブインパクト%'
        then 'Dゲージを使い、相手の攻撃を受け止めながら攻撃する共通システム技です。画面端では壁やられも狙えます。'
      when m.move_type = 'drive' and m.name_ja like '%ドライブリバーサル%'
        then 'Dゲージを使って相手の攻めを押し返す共通システム技です。ガード中または起き上がり時に使います。'
      when m.move_type = 'drive' and m.name_ja like '%ドライブラッシュ%'
        then 'Dゲージを使って素早く前進する共通システム行動です。通常技につなげると、ヒット時とガード時の有利時間が増えます。'
      when m.move_type = 'drive' and m.name_ja like '%パリィ%'
        then '相手の打撃や飛び道具を受け止める共通システム行動です。タイミングが合えばジャストパリィになります。'
      when m.move_type = 'drive'
        then 'Dゲージを使う共通システム技です。使う場面と消費量を確認し、ゲージを残すか攻めに使うかを判断します。'
      when m.move_type = 'taunt'
        then '対戦中に使えるアピール動作です。実戦で使う場合は、動作時間や固有の効果を確認してください。'
      else 'この技の基本性能を、入力、フレーム、ダメージと合わせて確認できます。'
    end),
    usage_summary_ja = coalesce(nullif(trim(m.usage_summary_ja), ''), trim(concat_ws(' ',
      case
        when m.move_type = 'normal' and m.name_ja like '%ジャンプ%'
          then '飛び込みや空対空で使います。'
        when m.move_type = 'normal' and m.name_ja like '%しゃがみ弱K%'
          then '近距離で下段を意識させたいときに使います。'
        when m.move_type = 'normal' and m.name_ja like '%しゃがみ強K%'
          then '相手の立ちガードを崩し、ダウンを取るときに使います。'
        when m.move_type = 'normal' and f.startup ~ '^[0-9]+$' and f.startup::integer <= 4
          then '発生が早く、近距離の割り込みやコンボの始動に向いています。'
        when m.move_type = 'normal'
          then 'けん制、差し返し、コンボの始動など、間合いに合わせて使います。'
        when m.move_type = 'unique'
          then '通常技とは違う間合いや攻撃判定を生かして、相手の動きを崩すときに使います。'
        when m.move_type = 'target_combo'
          then '最初の攻撃が当たったことを確認してから出し切ると、反撃を受ける危険を抑えられます。'
        when m.move_type = 'special' and coalesce(f.invincibility, '') ~* '(full|完全)'
          then '無敵時間を生かした切り返しや対空に使えます。'
        when m.move_type = 'special'
          then '技の強度や相手との距離によって使いどころが変わります。'
        when m.move_type = 'super'
          then 'SAゲージ、ダメージ、攻撃後の状況を見て使う場面を選びます。'
        when m.move_type = 'throw'
          then '打撃をガードする相手への崩しとして使います。投げ後の距離や有利時間も確認しておきましょう。'
        when m.move_type = 'drive' and m.name_ja like '%ドライブインパクト%'
          then '相手の大振りな技、画面端の攻め、ドライブインパクト返しに使います。'
        when m.move_type = 'drive' and m.name_ja like '%ドライブリバーサル%'
          then '相手の攻めを止めたい場面で使います。ガードされた場合は反撃を受けるため、使いどころに注意が必要です。'
        when m.move_type = 'drive' and m.name_ja like '%ドライブラッシュ%'
          then '接近、コンボの延長、ガード後も攻めを続けたい場面で使います。'
        when m.move_type = 'drive' and m.name_ja like '%パリィ%'
          then '相手の攻撃を受け止めてDゲージを回復したい場面で使います。投げには負けるため注意が必要です。'
        when m.move_type = 'drive'
          then 'Dゲージの残量と、使った後の状況を見て選びます。'
        when m.move_type = 'taunt'
          then '対戦の進行には直接必要ありません。固有効果がある場合のみ、十分な隙がある場面で使います。'
        else '入力とフレーム情報を確認し、トレーニングモードで使いどころを確かめてください。'
      end,
      case
        when m.move_type in ('normal', 'unique')
          and coalesce(f.cancel_type, '') not in ('', '-', 'none', 'None')
          then 'ヒット時はキャンセル先を確認しておくと、安定してコンボへつなげられます。'
        else null
      end,
      case
        when f.on_block ~ '^-[0-9]+$' and abs(f.on_block::integer) >= 7
          then 'ガードされた場合は反撃を受けやすいため、当てる距離や出し切りに注意してください。'
        when f.on_block ~ '^\+[0-9]+$'
          then 'ガードされても先に動けるため、その後も攻めを続けやすい技です。'
        else null
      end
    ))),
    updated_at = now()
from current_frame f
where m.id = f.move_id
  and m.status <> 'archived'
  and (coalesce(trim(m.description_ja), '') = '' or coalesce(trim(m.usage_summary_ja), '') = '');

-- Keep coverage complete even when a move has no current frame row.
update public.moves m
set description_ja = coalesce(nullif(trim(description_ja), ''),
      case m.move_type
        when 'normal' then 'キャラクターの基本となる通常技です。間合いと攻撃判定を確認し、けん制やコンボの始動に使います。'
        when 'unique' then '方向入力と攻撃ボタンを組み合わせて出す特殊技です。'
        when 'target_combo' then '決められた順番で通常技を入力して出す連続技です。'
        when 'special' then 'このキャラクター固有の必殺技です。強度や入力条件によって性能が変わる場合があります。'
        when 'super' then 'SAゲージを使うスーパーアーツです。'
        when 'throw' then '近距離で相手をつかむ投げ技です。'
        when 'drive' then 'Dゲージを使う共通システム技です。'
        when 'taunt' then '対戦中に使えるアピール動作です。'
        else 'この技の基本性能を、入力やフレーム情報と合わせて確認できます。'
      end),
    usage_summary_ja = coalesce(nullif(trim(usage_summary_ja), ''),
      '技の入力と性能を確認し、トレーニングモードで使いどころを確かめてください。'),
    updated_at = now()
where m.status <> 'archived'
  and (coalesce(trim(m.description_ja), '') = '' or coalesce(trim(m.usage_summary_ja), '') = '');

-- Preview uses an invoker-rights helper so the existing token and RLS boundary
-- remain the only way to read unpublished Move copy.
create or replace function public.get_phase47_move_japanese_preview(
  target_character_id uuid,
  preview_token text
)
returns jsonb
language plpgsql
security invoker
set search_path = 'public', 'pg_temp'
as $function$
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
$function$;

revoke all on function public.get_phase47_move_japanese_preview(uuid, text) from public;
revoke all on function public.get_phase47_move_japanese_preview(uuid, text) from authenticated;
grant execute on function public.get_phase47_move_japanese_preview(uuid, text) to anon;
