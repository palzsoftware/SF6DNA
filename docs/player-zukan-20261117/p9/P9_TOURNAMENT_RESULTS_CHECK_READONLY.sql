-- SF6DNA P9 大会実績追加候補 Development DB 照合（読み取り専用。最後にrollback）
-- 入力: SF6DNA_P9_TOURNAMENT_RESULT_ADDITIONS_20261117.csv（Drive。SHA-256先頭16桁 d4317873ab053261、5行）
-- 注意: 指示の「31件」に対し、受領できたCSVは5行。31件の正本（未受領のZIP）を受領したら、下のVALUESを差し替える。
-- 対象5名はいずれもP8の59名に含まれるが、本照合はP8 SQLとは独立（P8の承認・SQLには含めない）。
\set ON_ERROR_STOP on
select (:'HOST' || ' ' || :'USER') like '%vvsknbmlfvvnrmgtyhbf%' and (:'HOST' || ' ' || :'USER') not like '%wnuxaxbrpudyypzdbdho%' as p9_is_dev \gset
\if :p9_is_dev
\else
\echo 'Connection is not the Development project vvsknbmlfvvnrmgtyhbf. Stop.'
\quit
\endif
begin;
set transaction read only;
with add(player_slug, dev_player_id, tournament_slug, placement_text) as (values
  ('micky',    '99addbae-9429-4128-9242-b8f2b89365c2'::uuid, 'ceo-2026', '3'),
  ('blaz',     '830621f4-38aa-49e3-a320-31621e983fb5'::uuid, 'ceo-2026', '4'),
  ('kilzyou',  '626062e4-4300-43ee-a20d-10d4c7672364'::uuid, 'ceo-2026', '5T'),
  ('craime',   'e3cb3bf2-9ec9-4b40-a89a-e33361211cf4'::uuid, 'ceo-2026', '5T'),
  ('wabiichi', 'b873fd7a-8989-4012-af27-5048b973f880'::uuid, 'ceo-2026', '7T')
)
select a.player_slug, a.placement_text, p.slug as db_player_slug, p.status as player_status,
  t.id as tournament_id, t.status as tournament_status, r.placement as existing_placement,
  case
    when p.id is null then 'PLAYER_ID_NOT_FOUND'
    when p.slug <> a.player_slug then 'PLAYER_SLUG_MISMATCH'
    when t.id is null then 'TOURNAMENT_NOT_FOUND (P6 APPLY 未実行の可能性。P6はceo-2026を下書きで作成する)'
    when t.status <> 'draft' then 'TOURNAMENT_NOT_DRAFT (公開境界: 公開大会への追加は不可)'
    when r.tournament_id is not null and r.placement::text = regexp_replace(a.placement_text, '[^0-9]', '', 'g') then 'ALREADY_EXISTS_SAME'
    when r.tournament_id is not null then 'ALREADY_EXISTS_DIFFERENT_PLACEMENT'
    else 'READY_TO_ADD' end as result
from add a
left join public.players p on p.id = a.dev_player_id
left join public.tournaments t on t.slug = a.tournament_slug
left join public.tournament_results r on r.tournament_id = t.id and r.player_id = a.dev_player_id
order by a.player_slug;
rollback;
