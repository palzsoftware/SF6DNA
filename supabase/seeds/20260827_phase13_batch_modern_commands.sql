-- Phase13 batch: Jamie / Chun-Li / Guile / Kimberly Modern commands
-- Source of truth: CAPCOM official frame tables, Modern tab, checked 2026-08-27.
-- Idempotent: existing Modern rows and source links are preserved.

begin;

insert into public.sources
  (title, url, source_type, publisher, accessed_at, reliability_level, notes)
select v.title, v.url, 'official_frame_data', 'CAPCOM', now(), 'official',
       'Modern tab checked against the current official frame table on 2026-08-27.'
from (values
  ('ジェイミー 公式フレームデータ', 'https://www.streetfighter.com/6/ja-jp/character/jamie/frame'),
  ('春麗 公式フレームデータ', 'https://www.streetfighter.com/6/ja-jp/character/chunli/frame'),
  ('キンバリー 公式フレームデータ', 'https://www.streetfighter.com/6/ja-jp/character/kimberly/frame')
) as v(title, url)
where not exists (select 1 from public.sources s where s.url = v.url);

with command_seed(character_slug, move_slug, command_text, numeric_notation, button_notation, condition_text) as (
 values
  ('jamie', 'jamie-standing-lp', '弱攻撃', 'L', 'L', NULL),
  ('jamie', 'jamie-standing-mp', '中攻撃', 'M', 'M', NULL),
  ('jamie', 'jamie-standing-mk', 'アシスト + 中攻撃', 'Auto+M', 'Auto+M', NULL),
  ('jamie', 'jamie-standing-hp', '強攻撃', 'H', 'H', NULL),
  ('jamie', 'jamie-standing-hk', 'アシスト + 強攻撃', 'Auto+H', 'Auto+H', NULL),
  ('jamie', 'jamie-crouching-lp', '↓ + 弱攻撃', '2L', '↓+L', NULL),
  ('jamie', 'jamie-crouching-lk', 'アシスト + 弱攻撃', 'Auto+L', 'Auto+L', NULL),
  ('jamie', 'jamie-crouching-mk', '↓ + 中攻撃', '2M', '↓+M', NULL),
  ('jamie', 'jamie-crouching-hp', '↓ + 強攻撃', '2H', '↓+H', NULL),
  ('jamie', 'jamie-crouching-hk', '↘ + 強攻撃', '3H', '↘+H', NULL),
  ('jamie', 'jamie-jump-lp', '（ジャンプ中に）アシスト + 弱攻撃', 'j.Auto+L', 'j.Auto+L', 'ジャンプ中'),
  ('jamie', 'jamie-jump-lk', '（ジャンプ中に）弱攻撃', 'j.L', 'j.L', 'ジャンプ中'),
  ('jamie', 'jamie-jump-mp', '（ジャンプ中に）中攻撃', 'j.M', 'j.M', 'ジャンプ中'),
  ('jamie', 'jamie-jump-mk', '（ジャンプ中に）アシスト + 中攻撃', 'j.Auto+M', 'j.Auto+M', 'ジャンプ中'),
  ('jamie', 'jamie-jump-hp', '（ジャンプ中に）アシスト + 強攻撃', 'j.Auto+H', 'j.Auto+H', 'ジャンプ中'),
  ('jamie', 'jamie-jump-hk', '（ジャンプ中に）強攻撃', 'j.H', 'j.H', 'ジャンプ中'),
  ('jamie', 'jamie-tensei-kick', '↓ + 中攻撃 + 強攻撃', '2M+H', '↓+M+H', NULL),
  ('jamie', 'jamie-phantom-sway-2', '↘ + 強攻撃 > 強攻撃', '3H>H', '↘+H > H', NULL),
  ('chun-li', 'chun-li-standing-lp', '弱攻撃', 'L', 'L', NULL),
  ('chun-li', 'chun-li-standing-lk', 'アシスト + 弱攻撃', 'Auto+L', 'Auto+L', NULL),
  ('chun-li', 'chun-li-standing-mp', '中攻撃', 'M', 'M', NULL),
  ('chun-li', 'chun-li-standing-hp', '強攻撃', 'H', 'H', NULL),
  ('chun-li', 'chun-li-crouching-lp', '↓ + 弱攻撃 > ↓ + 弱攻撃', '2L>2L', '↓+L > ↓+L', NULL),
  ('chun-li', 'chun-li-crouching-lk', '↓ + 弱攻撃', '2L', '↓+L', NULL),
  ('chun-li', 'chun-li-crouching-mp', 'アシスト + 中攻撃', 'Auto+M', 'Auto+M', NULL),
  ('chun-li', 'chun-li-crouching-mk', '↓ + 中攻撃', '2M', '↓+M', NULL),
  ('chun-li', 'chun-li-crouching-hp', '↓ + 強攻撃', '2H', '↓+H', NULL),
  ('chun-li', 'chun-li-crouching-hk', '↘ + 強攻撃', '3H', '↘+H', NULL),
  ('chun-li', 'chun-li-jump-lp', '（ジャンプ中に）弱攻撃', 'j.L', 'j.L', 'ジャンプ中'),
  ('chun-li', 'chun-li-jump-lk', '（ジャンプ中に）アシスト + 弱攻撃', 'j.Auto+L', 'j.Auto+L', 'ジャンプ中'),
  ('chun-li', 'chun-li-jump-mp', '（ジャンプ中に）中攻撃', 'j.M', 'j.M', 'ジャンプ中'),
  ('chun-li', 'chun-li-jump-mk', '（ジャンプ中に）アシスト + 中攻撃', 'j.Auto+M', 'j.Auto+M', 'ジャンプ中'),
  ('chun-li', 'chun-li-jump-hp', '（ジャンプ中に）アシスト + 強攻撃', 'j.Auto+H', 'j.Auto+H', 'ジャンプ中'),
  ('chun-li', 'chun-li-jump-hk', '（ジャンプ中に）強攻撃', 'j.H', 'j.H', 'ジャンプ中'),
  ('guile', 'guile-standing-lp', '弱攻撃', 'L', 'L', NULL),
  ('guile', 'guile-standing-lk', 'アシスト + 弱攻撃 > 弱攻撃 > 弱攻撃', 'Auto+L>L>L', 'Auto+L > L > L', NULL),
  ('guile', 'guile-standing-mp', 'アシスト + 強攻撃', 'Auto+H', 'Auto+H', NULL),
  ('guile', 'guile-standing-mk', '中攻撃', 'M', 'M', NULL),
  ('guile', 'guile-standing-hk', '強攻撃', 'H', 'H', NULL),
  ('guile', 'guile-crouching-lp', '↓ + 弱攻撃', '2L', '↓+L', NULL),
  ('guile', 'guile-crouching-lk', 'アシスト + 弱攻撃', 'Auto+L', 'Auto+L', NULL),
  ('guile', 'guile-crouching-mp', 'アシスト + 中攻撃', 'Auto+M', 'Auto+M', NULL),
  ('guile', 'guile-crouching-mk', '↓ + 中攻撃', '2M', '↓+M', NULL),
  ('guile', 'guile-crouching-hp', '↓ + 強攻撃', '2H', '↓+H', NULL),
  ('guile', 'guile-crouching-hk', '↘ + 強攻撃', '3H', '↘+H', NULL),
  ('guile', 'guile-jump-lp', '（ジャンプ中に）弱攻撃', 'j.L', 'j.L', 'ジャンプ中'),
  ('guile', 'guile-jump-lk', '（ジャンプ中に）アシスト + 弱攻撃', 'j.Auto+L', 'j.Auto+L', 'ジャンプ中'),
  ('guile', 'guile-jump-mp', '（ジャンプ中に）中攻撃', 'j.M', 'j.M', 'ジャンプ中'),
  ('guile', 'guile-jump-mk', '（ジャンプ中に）アシスト + 中攻撃', 'j.Auto+M', 'j.Auto+M', 'ジャンプ中'),
  ('guile', 'guile-jump-hp', '（ジャンプ中に）アシスト + 強攻撃', 'j.Auto+H', 'j.Auto+H', 'ジャンプ中'),
  ('guile', 'guile-jump-hk', '（ジャンプ中に）強攻撃', 'j.H', 'j.H', 'ジャンプ中'),
  ('kimberly', 'kimberly-standing-lp', '弱攻撃', 'L', 'L', NULL),
  ('kimberly', 'kimberly-standing-mp', '中攻撃', 'M', 'M', NULL),
  ('kimberly', 'kimberly-standing-mk', 'アシスト + 中攻撃', 'Auto+M', 'Auto+M', NULL),
  ('kimberly', 'kimberly-standing-hp', '強攻撃', 'H', 'H', NULL),
  ('kimberly', 'kimberly-standing-hk', 'アシスト + 強攻撃', 'Auto+H', 'Auto+H', NULL),
  ('kimberly', 'kimberly-crouching-lp', '↓ + 弱攻撃', '2L', '↓+L', NULL),
  ('kimberly', 'kimberly-crouching-lk', 'アシスト + 弱攻撃', 'Auto+L', 'Auto+L', NULL),
  ('kimberly', 'kimberly-crouching-mk', '↓ + 中攻撃', '2M', '↓+M', NULL),
  ('kimberly', 'kimberly-crouching-hp', '↓ + 強攻撃', '2H', '↓+H', NULL),
  ('kimberly', 'kimberly-crouching-hk', '↘ + 強攻撃', '3H', '↘+H', NULL)
)
insert into public.move_commands
  (move_id, control_scheme, command_text, numeric_notation, button_notation, condition_text, sort_order)
select m.id, 'modern', cs.command_text, cs.numeric_notation, cs.button_notation, cs.condition_text, 10
from command_seed cs
join public.moves m on m.slug = cs.move_slug
join public.characters c on c.id = m.character_id and c.slug = cs.character_slug
where not exists (
  select 1 from public.move_commands existing
  where existing.move_id = m.id and existing.control_scheme = 'modern'
);

with command_seed(character_slug, move_slug) as (
 values
  ('jamie', 'jamie-standing-lp'),
  ('jamie', 'jamie-standing-mp'),
  ('jamie', 'jamie-standing-mk'),
  ('jamie', 'jamie-standing-hp'),
  ('jamie', 'jamie-standing-hk'),
  ('jamie', 'jamie-crouching-lp'),
  ('jamie', 'jamie-crouching-lk'),
  ('jamie', 'jamie-crouching-mk'),
  ('jamie', 'jamie-crouching-hp'),
  ('jamie', 'jamie-crouching-hk'),
  ('jamie', 'jamie-jump-lp'),
  ('jamie', 'jamie-jump-lk'),
  ('jamie', 'jamie-jump-mp'),
  ('jamie', 'jamie-jump-mk'),
  ('jamie', 'jamie-jump-hp'),
  ('jamie', 'jamie-jump-hk'),
  ('jamie', 'jamie-tensei-kick'),
  ('jamie', 'jamie-phantom-sway-2'),
  ('chun-li', 'chun-li-standing-lp'),
  ('chun-li', 'chun-li-standing-lk'),
  ('chun-li', 'chun-li-standing-mp'),
  ('chun-li', 'chun-li-standing-hp'),
  ('chun-li', 'chun-li-crouching-lp'),
  ('chun-li', 'chun-li-crouching-lk'),
  ('chun-li', 'chun-li-crouching-mp'),
  ('chun-li', 'chun-li-crouching-mk'),
  ('chun-li', 'chun-li-crouching-hp'),
  ('chun-li', 'chun-li-crouching-hk'),
  ('chun-li', 'chun-li-jump-lp'),
  ('chun-li', 'chun-li-jump-lk'),
  ('chun-li', 'chun-li-jump-mp'),
  ('chun-li', 'chun-li-jump-mk'),
  ('chun-li', 'chun-li-jump-hp'),
  ('chun-li', 'chun-li-jump-hk'),
  ('guile', 'guile-standing-lp'),
  ('guile', 'guile-standing-lk'),
  ('guile', 'guile-standing-mp'),
  ('guile', 'guile-standing-mk'),
  ('guile', 'guile-standing-hk'),
  ('guile', 'guile-crouching-lp'),
  ('guile', 'guile-crouching-lk'),
  ('guile', 'guile-crouching-mp'),
  ('guile', 'guile-crouching-mk'),
  ('guile', 'guile-crouching-hp'),
  ('guile', 'guile-crouching-hk'),
  ('guile', 'guile-jump-lp'),
  ('guile', 'guile-jump-lk'),
  ('guile', 'guile-jump-mp'),
  ('guile', 'guile-jump-mk'),
  ('guile', 'guile-jump-hp'),
  ('guile', 'guile-jump-hk'),
  ('kimberly', 'kimberly-standing-lp'),
  ('kimberly', 'kimberly-standing-mp'),
  ('kimberly', 'kimberly-standing-mk'),
  ('kimberly', 'kimberly-standing-hp'),
  ('kimberly', 'kimberly-standing-hk'),
  ('kimberly', 'kimberly-crouching-lp'),
  ('kimberly', 'kimberly-crouching-lk'),
  ('kimberly', 'kimberly-crouching-mk'),
  ('kimberly', 'kimberly-crouching-hp'),
  ('kimberly', 'kimberly-crouching-hk')
),
source_map(character_slug, source_url) as (
 values
  ('jamie', 'https://www.streetfighter.com/6/ja-jp/character/jamie/frame'),
  ('chun-li', 'https://www.streetfighter.com/6/ja-jp/character/chunli/frame'),
  ('guile', 'https://www.streetfighter.com/6/ja-jp/character/guile/frame'),
  ('kimberly', 'https://www.streetfighter.com/6/ja-jp/character/kimberly/frame')
)
insert into public.entity_sources (entity_type, entity_id, source_id, relationship, note)
select 'move_command', mc.id, src.id, 'official',
       'CAPCOM official frame table Modern tab; checked 2026-08-27.'
from command_seed cs
join public.moves m on m.slug = cs.move_slug
join public.move_commands mc on mc.move_id = m.id and mc.control_scheme = 'modern'
join source_map sm on sm.character_slug = cs.character_slug
join lateral (
  select s.id from public.sources s where s.url = sm.source_url order by s.created_at limit 1
) src on true
on conflict (entity_type, entity_id, source_id) do nothing;

update public.character_content_packages ccp
set command_status = 'review',
    notes = case
      when position('Modern Command official frame table sync 2026-08-27' in coalesce(ccp.notes, '')) > 0 then ccp.notes
      else concat_ws(E'\n', nullif(ccp.notes, ''), 'Modern Command official frame table sync 2026-08-27: direct CAPCOM mapping added; schema has no per-command verification/status fields.')
    end,
    updated_at = now()
from public.characters c
where c.id = ccp.character_id
  and c.slug in ('jamie','chun-li','guile','kimberly');

commit;
