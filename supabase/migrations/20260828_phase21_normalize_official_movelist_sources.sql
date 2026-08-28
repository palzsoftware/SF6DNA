-- Phase21: normalize CAPCOM official movelist sources after the 31-character
-- current-page fetch audit on 2026-08-28.

update public.sources
set
  url = 'https://www.streetfighter.com/6/ja-jp/character/gouki_akuma/movelist',
  updated_at = now()
where source_type = 'official_movelist'
  and title = '豪鬼 公式ムーブリスト';

update public.sources
set
  url = 'https://www.streetfighter.com/6/ja-jp/character/vega_mbison/movelist',
  updated_at = now()
where source_type = 'official_movelist'
  and title = 'ベガ 公式ムーブリスト';

insert into public.sources (
  title,
  url,
  source_type,
  publisher,
  accessed_at,
  reliability_level,
  notes
)
select
  'JP 公式ムーブリスト',
  'https://www.streetfighter.com/6/ja-jp/character/jp/movelist',
  'official_movelist',
  'CAPCOM',
  now(),
  'official',
  'Phase21: CAPCOM official command list; confirmed in the 31-character audit on 2026-08-28.'
where not exists (
  select 1
  from public.sources
  where source_type = 'official_movelist'
    and url = 'https://www.streetfighter.com/6/ja-jp/character/jp/movelist'
);
