-- Phase23: rebuild the remaining 22 JP matchups from reviewed opponent cards
-- and current verified frame data. No row is verified or published here.

with done(slug) as (
  values ('akuma'),('ken'),('cammy'),('m-bison'),('mai'),('luke'),('juri'),('rashid')
),
ctx as (
  select
    (select id from characters where slug='jp') as jp_id,
    (select id from patches where is_current=true order by released_at desc limit 1) as patch_id
),
targets as (
  select c.id,c.slug,c.name_ja,gs.id as guide_id,gs.summary as guide_summary,gs.body as guide_body
  from characters c
  join character_guide_sections gs
    on gs.character_id=c.id
   and gs.section_type='matchup_card'
   and gs.status='draft'
   and gs.verification_status='reviewed'
  where c.is_playable=true
    and c.status='published'
    and c.slug<>'jp'
    and c.slug not in (select slug from done)
),
unsafe as (
  select t.id as character_id,
         string_agg(x.name_ja||' '||x.on_block||'F', ' / ' order by x.block_value, x.name_ja) as punish_list
  from targets t
  left join lateral (
    select m.name_ja,f.on_block,(f.on_block::int) as block_value
    from moves m
    join move_frame_data f
      on f.move_id=m.id
     and f.valid_to_patch_id is null
     and f.verification_status='verified'
    where m.character_id=t.id
      and f.on_block ~ '^-?[0-9]+$'
      and f.on_block::int <= -5
    order by f.on_block::int asc,m.display_order nulls last,m.name_ja
    limit 6
  ) x on true
  group by t.id
),
categories(suffix,counter_type,title_label,situation_label,difficulty) as (
  values
    ('approach','approach','接近阻止','接近手段を止める場面',4),
    ('punish','punish','確反候補','必殺技などをガードした後',3),
    ('air','anti_air','対空・特殊軌道','通常ジャンプと特殊軌道が混ざる場面',4),
    ('corner','defense','画面端防御','JPが画面端を背負った場面',5),
    ('zoning','zoning','弾・設置管理','JPの遠距離択と相手固有行動が競合する場面',4)
),
expanded as (
  select t.*,u.punish_list,c.*,
    case c.suffix
      when 'approach' then
        coalesce(t.guide_summary,'')||' '||coalesce(t.guide_body,'')||
        ' 接近手段を最低4スロットへ分け、JPの中距離通常技・対空・ガード・パリィ・後退を比較する。'
      when 'punish' then
        'current verified Frameからの反撃候補: '||
        coalesce(u.punish_list,'単純数値で抽出できる候補なし')||
        '。ガード後距離でJPの技が実際に届くかを確認し、届かない数値上のマイナスは確反扱いしない。'
      when 'air' then
        coalesce(t.guide_body,'')||
        ' 通常ジャンプとカード記載の特殊軌道/接近をランダム再生し、2HP・空中投げ・ガード・後退を比較する。'
      when 'corner' then
        coalesce(t.guide_body,'')||
        ' 端では相手固有リソース有無を分け、打撃・投げ・遅らせ・代表固有択へガード/Dリバ/パリィ/ジャンプ/ODアムネジアを比較する。'
      else
        coalesce(t.guide_body,'')||
        ' JPのトルバラン・トリグラフ・ヴィーハト・前歩きと相手の弾/設置/突進を画面位置別に比較する。'
    end as detail_summary
  from targets t
  left join unsafe u on u.character_id=t.id
  cross join categories c
),
upsert_detail as (
  insert into counters(
    slug,defender_character_id,opponent_character_id,target_type,target_id,
    situation,counter_type,title,summary,method,benefit,risk,difficulty,
    conditions,valid_from_patch_id,valid_to_patch_id,
    verification_status,content_kind,status
  )
  select
    'jp-vs-'||e.slug||'-'||e.suffix,
    ctx.jp_id,e.id,'matchup',null,
    e.name_ja||'戦：'||e.situation_label,
    e.counter_type,
    'JP vs '||e.name_ja||'：'||e.title_label,
    e.detail_summary,
    case e.suffix
      when 'approach' then '相手カードの勝ち筋・距離別行動を別スロットに録画し、JP側回答を確定/相打ち/読み/不成立へ分類する。'
      when 'punish' then 'verified Frameは入口としてのみ使用し、4F技・中距離反撃・SA候補を実距離で再現する。'
      when 'air' then '通常ジャンプと特殊軌道を20回以上ランダム再生し、正答率と誤2HP/空振り後被弾を記録する。'
      when 'corner' then '端位置・Drive・SA・相手固有リソースを固定し、防御択ごとの結果を最低20局面比較する。'
      else '遠・中遠・中距離の最低3位置で、JP遠距離択と相手固有行動を各10回以上比較する。'
    end,
    e.name_ja||'戦の対面固有判断を、旧共通テンプレートではなく再現可能な項目として残せる。',
    case e.suffix
      when 'punish' then 'ガード差だけで確反を断定しない。距離・派生・強化状態・持続当ては実機確認前に確定しない。'
      when 'corner' then 'ODアムネジア投げ成立後は2026.08.03変更後仕様で扱う。未確認の連携間隔や1F割り込みを確定しない。'
      else '弾相互作用、DI、アーマー、反射、軌道など実機依存の結果はreviewedのまま保持する。'
    end,
    e.difficulty::smallint,
    '2026.08.03以降。対象='||e.name_ja||'。実機確認前はverified/publishedへ昇格しない。',
    ctx.patch_id,null,'reviewed','strategy','draft'
  from expanded e cross join ctx
  on conflict(slug) do update set
    defender_character_id=excluded.defender_character_id,
    opponent_character_id=excluded.opponent_character_id,
    target_type='matchup',
    target_id=null,
    situation=excluded.situation,
    counter_type=excluded.counter_type,
    title=excluded.title,
    summary=excluded.summary,
    method=excluded.method,
    benefit=excluded.benefit,
    risk=excluded.risk,
    difficulty=excluded.difficulty,
    conditions=excluded.conditions,
    valid_from_patch_id=excluded.valid_from_patch_id,
    valid_to_patch_id=null,
    verification_status='reviewed',
    content_kind='strategy',
    status='draft',
    updated_at=now()
  returning id
)
select count(*) as rebuilt_detail_rows from upsert_detail;

with done(slug) as (
  values ('akuma'),('ken'),('cammy'),('m-bison'),('mai'),('luke'),('juri'),('rashid')
),
ctx as (
  select
    (select id from characters where slug='jp') as jp_id,
    (select id from patches where is_current=true order by released_at desc limit 1) as patch_id
),
targets as (
  select c.id,c.slug,c.name_ja
  from characters c
  where c.is_playable=true and c.status='published'
    and c.slug<>'jp'
    and c.slug not in (select slug from done)
)
insert into counters(
  slug,defender_character_id,opponent_character_id,target_type,target_id,
  situation,counter_type,title,summary,method,benefit,risk,difficulty,
  conditions,valid_from_patch_id,valid_to_patch_id,
  verification_status,content_kind,status
)
select
  'jp-matchup-'||t.slug,ctx.jp_id,t.id,'matchup_plan',null,
  '2026.08.03以降のJP対'||t.name_ja,
  'matchup_overview',
  'JP vs '||t.name_ja||' 対面対策',
  t.name_ja||'対面を接近阻止・確反候補・対空/特殊軌道・画面端防御・弾/設置の5項目へ分解した。',
  'jp-vs-'||t.slug||'-approach / punish / air / corner / zoning をTrainingで再現し、確定・相打ち・読み・不成立を区別する。',
  t.name_ja||'戦の対戦前確認からトレモ再検証までを一つの親対面として辿れる。',
  '距離、連携間隔、DI、弾相互作用、ODアムネジア後状況など実機依存項目はreviewedのまま扱う。',
  4,
  '2026.08.03以降。子Counter5件を参照。実機確認前はverified/publishedへ昇格しない。',
  ctx.patch_id,null,'reviewed','strategy','draft'
from targets t cross join ctx
on conflict(slug) do update set
  defender_character_id=excluded.defender_character_id,
  opponent_character_id=excluded.opponent_character_id,
  target_type='matchup_plan',
  target_id=null,
  situation=excluded.situation,
  counter_type=excluded.counter_type,
  title=excluded.title,
  summary=excluded.summary,
  method=excluded.method,
  benefit=excluded.benefit,
  risk=excluded.risk,
  difficulty=excluded.difficulty,
  conditions=excluded.conditions,
  valid_from_patch_id=excluded.valid_from_patch_id,
  valid_to_patch_id=null,
  verification_status='reviewed',
  content_kind='strategy',
  status='draft',
  updated_at=now();

delete from entity_sources es
using counters co,sources s
where es.entity_type='counter'
  and es.entity_id=co.id
  and es.source_id=s.id
  and co.slug like 'jp-matchup-%'
  and co.status='draft'
  and co.verification_status='reviewed'
  and s.url='https://github.com/palzsoftware/SF6DNA/blob/sf6dna-v2/docs/PHASE13_JP_MATCHUP_COUNTER_IMPORT.md';

with done(slug) as (
  values ('akuma'),('ken'),('cammy'),('m-bison'),('mai'),('luke'),('juri'),('rashid')
),
targets as (
  select c.id,c.slug,gs.id as guide_id
  from characters c
  join character_guide_sections gs
    on gs.character_id=c.id
   and gs.section_type='matchup_card'
   and gs.status='draft'
   and gs.verification_status='reviewed'
  where c.is_playable=true and c.status='published'
    and c.slug<>'jp'
    and c.slug not in (select slug from done)
),
target_counters as (
  select co.id,t.guide_id
  from targets t
  join counters co
    on co.opponent_character_id=t.id
   and co.defender_character_id=(select id from characters where slug='jp')
   and co.status='draft'
   and co.verification_status='reviewed'
   and (co.slug='jp-matchup-'||t.slug or co.slug like 'jp-vs-'||t.slug||'-%')
),
copied as (
  select tc.id as counter_id,es.source_id,
         case when es.relationship='patch_baseline' then 'supporting' else es.relationship end as relationship
  from target_counters tc
  join entity_sources es
    on es.entity_type='character_guide_section'
   and es.entity_id=tc.guide_id
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'counter',counter_id,source_id,coalesce(relationship,'supporting'),
       'Copied from reviewed opponent matchup card during JP matchup rebuild.'
from copied
on conflict(entity_type,entity_id,source_id) do update set
  relationship=excluded.relationship,
  note=excluded.note;

with jp_sources as (
  select id,url from sources
  where url in (
    'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp',
    'https://ultimateframedata.com/sf6/jp'
  )
),
rebuilt as (
  select co.id
  from counters co
  join characters d on d.id=co.defender_character_id and d.slug='jp'
  where co.status='draft'
    and co.verification_status='reviewed'
    and (co.slug like 'jp-vs-%' or co.slug like 'jp-matchup-%')
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'counter',r.id,s.id,
       case when s.url like '%battle_change/20260803/jp' then 'patch_baseline' else 'corroborating' end,
       'JP current 2026.08.03+ baseline for matchup review.'
from rebuilt r cross join jp_sources s
on conflict(entity_type,entity_id,source_id) do update set
  relationship=excluded.relationship,
  note=excluded.note;