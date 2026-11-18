-- SF6DNA P9 未登録Top8候補11名 Development DB 重複確認（読み取り専用。書き込み・DDLなし。最後にrollback）
-- 入力: SF6DNA_P9_UNREGISTERED_TOP8_CANDIDATES_20261117.csv（Drive。SHA-256先頭16桁 3e25ff7b87d4f0d8）
-- P8（59名）とは別管理。P8のSQL・承認CSVには触れない。HOLD: nl, hope（指示による）, shigematsu, zhen（CSV記載）
-- 実行: psql "<Development>" -v ON_ERROR_STOP=1 -f P9_DEV_DUPLICATE_CHECK_READONLY.sql
\set ON_ERROR_STOP on
select (:'HOST' || ' ' || :'USER') like '%vvsknbmlfvvnrmgtyhbf%' and (:'HOST' || ' ' || :'USER') not like '%wnuxaxbrpudyypzdbdho%' as p9_is_dev \gset
\if :p9_is_dev
\else
\echo 'Connection is not the Development project vvsknbmlfvvnrmgtyhbf. Stop.'
\quit
\endif
begin;
set transaction read only;
do $$ begin
  if not exists (select 1 from public.players where id = 'b3f67376-cb75-4b44-8b2d-ef50058a1b98' and slug = 'ryukichi') then
    raise exception 'Not the SF6DNA Development DB (ryukichi Development identity missing). Stop.';
  end if;
end $$;

with cand(proposed_slug, display_name, hold, patterns) as (values
  ('nl',         'NL',         true,  array['nl','sf5nl']),
  ('phenom',     'Phenom',     false, array['phenom']),
  ('xiaohai',    'Xiaohai',    false, array['xiaohai','小孩']),
  ('angrybird',  'AngryBird',  false, array['angrybird']),
  ('punk',       'Punk',       false, array['punk']),
  ('hope',       'Hope',       true,  array['hope']),
  ('naooonn',    'naooonn',    false, array['naooonn','naoon']),
  ('nuckledu',   'NuckleDu',   false, array['nuckledu']),
  ('shigematsu', 'Shigematsu', true,  array['shigematsu','shigematus','重松']),
  ('zhen',       'Zhen',       true,  array['zhen']),
  ('booce-lee',  'Booce_Lee',  false, array['booceLee','boocelee'])
),
norm as (
  -- 比較用の正規化: 小文字化し、英数字・ひらがな・カタカナ・漢字以外を除去
  select c.*, array(select regexp_replace(lower(x), '[^a-z0-9ぁ-んァ-ヶ一-龠]', '', 'g') from unnest(c.patterns) x) as keys from cand c
),
hits as (
  select n.proposed_slug, 'players.slug' as matched_on, p.id, p.slug, p.display_name, p.status
    from norm n join public.players p on regexp_replace(lower(p.slug), '[^a-z0-9]', '', 'g') = any (n.keys)
  union
  select n.proposed_slug, 'players.display_name', p.id, p.slug, p.display_name, p.status
    from norm n join public.players p on regexp_replace(lower(p.display_name), '[^a-z0-9ぁ-んァ-ヶ一-龠]', '', 'g') = any (n.keys)
  union
  select n.proposed_slug, 'player_aliases', p.id, p.slug, p.display_name, p.status
    from norm n join public.player_aliases a on regexp_replace(lower(a.alias), '[^a-z0-9ぁ-んァ-ヶ一-龠]', '', 'g') = any (n.keys)
                   or regexp_replace(lower(a.normalized_alias), '[^a-z0-9ぁ-んァ-ヶ一-龠]', '', 'g') = any (n.keys)
    join public.players p on p.id = a.player_id
  union
  -- 部分一致（4文字以上のキーのみ。短い名前NL/Punk/Hope/Zhenは誤検出が多いため完全一致のみ）
  select n.proposed_slug, 'partial(slug/display_name)', p.id, p.slug, p.display_name, p.status
    from norm n join public.players p on exists (select 1 from unnest(n.keys) k where length(k) >= 6 and
      (regexp_replace(lower(p.slug), '[^a-z0-9]', '', 'g') like '%' || k || '%' or regexp_replace(lower(p.display_name), '[^a-z0-9ぁ-んァ-ヶ一-龠]', '', 'g') like '%' || k || '%'))
)
select n.proposed_slug, n.display_name, case when n.hold then 'HOLD' else 'CANDIDATE' end as p9_state,
  coalesce(string_agg(distinct h.matched_on || ':' || h.slug || '(' || h.status || ',' || h.id || ')', ' | '), '') as existing_matches,
  case when count(h.id) = 0 then 'NO_DUPLICATE_FOUND' else 'REVIEW_DUPLICATE' end as result
from norm n left join hits h on h.proposed_slug = n.proposed_slug
group by n.proposed_slug, n.display_name, n.hold
order by n.proposed_slug;
rollback;
