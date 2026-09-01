-- Ensure every active Kimberly strategy has a pending capture task, including
-- the pre-existing 2026.08.03 Modern Assist Combo 2 row.
insert into capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select t.player_character_id,t.id,'pending',
 case when tr.related_type='combo' then 35 when tr.related_type='setup' then 30 else 45 end,
 'キンバリー現行攻略の撮影確認。操作方式、入力、ダメージ、Drive/SA、位置、受け身、細工手裏剣数、キャラ条件を記録する。'
from trainings t
join training_relations tr on tr.training_id=t.id
where t.player_character_id=(select id from characters where slug='kimberly')
  and tr.related_type in ('combo','setup','sequence')
on conflict(training_id) do nothing;
