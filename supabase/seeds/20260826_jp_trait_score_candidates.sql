-- JP character trait score candidates.
-- Reviewed draft only. Do not publish until editorial/gameplay review is complete.
with ctx as (
  select c.id character_id,
    (select id from public.sources where url='https://fgctopplayers.com/characters/jp/' order by created_at limit 1) source_id
  from public.characters c where c.slug='jp'
), vals(trait_key,score,note) as (
 values
 ('aggression',2,'制圧から攻めへ移るタイプ。'),
 ('patience',5,'観察・待ち・接近対応を強く活かす。'),
 ('keepout',5,'遠距離制圧・空間管理が主要特性。'),
 ('rushdown',2,'近距離ラッシュ専業ではない。'),
 ('grappling',1,'投げは使うがコマンド投げ主体ではない。'),
 ('setup',5,'ヴィーハト/ラヴーシュカ等の設置比重が高い。'),
 ('footsies',3,'中距離通常技と地上戦も必要。'),
 ('mobility',3,'ワープ等の位置調整を持つ。'),
 ('simplicity',2,'総合運用は複雑。'),
 ('technicality',5,'設置・距離別技・SA2など研究量が大きい。'),
 ('defense_preference',4,'迎撃・当身・距離管理を活かす。'),
 ('explosive',4,'設置/SA2/高リターン変換で展開を変える。')
)
insert into public.character_trait_scores(character_id,trait_id,score,verification_status,source_id,note,status)
select ctx.character_id,t.id,v.score,'reviewed',ctx.source_id,v.note,'draft'
from vals v join public.character_traits t on t.trait_key=v.trait_key cross join ctx
on conflict(character_id,trait_id) do update set
 score=excluded.score,
 verification_status='reviewed',
 source_id=excluded.source_id,
 note=excluded.note,
 status='draft',
 updated_at=now();
