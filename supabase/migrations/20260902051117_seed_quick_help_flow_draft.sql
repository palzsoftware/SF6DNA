
insert into public.coach_quick_help_flows (
  slug,
  title,
  description,
  version,
  status
)
values (
  'quick-help',
  '今、何に困っていますか？',
  '対戦中や大会のインターバルでも、困りごとを短い質問で整理して、関連する対策・技・練習とAIコーチへつなぐためのフロー。',
  1,
  'draft'
)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  version = excluded.version,
  status = 'draft';

with flow as (
  select id
  from public.coach_quick_help_flows
  where slug = 'quick-help'
),
node_data(node_key,node_type,prompt,input_type,answer_key,topic_key,help_text,sort_order) as (
  values
    ('problem_type','question','今、何に困っていますか？','static','topic_key',null,'近いものを1つ選んでください。',10),
    ('anti_air_opponent','question','誰の飛びに困っていますか？','character','opponent_character_id','anti_air','相手キャラクターを選んでください。',20),
    ('anti_air_situation','question','飛びに対して、特に何が難しいですか？','static','situation_key','anti_air',null,30),
    ('projectile_opponent','question','誰の弾に困っていますか？','character','opponent_character_id','projectile','相手キャラクターを選んでください。',40),
    ('projectile_situation','question','弾に対して、特に何が難しいですか？','static','situation_key','projectile',null,50),
    ('drive_rush_opponent','question','誰のドライブラッシュに困っていますか？','character','opponent_character_id','drive_rush','相手キャラクターを選んでください。',60),
    ('drive_rush_situation','question','ドライブラッシュ後のどの場面に困っていますか？','static','situation_key','drive_rush',null,70),
    ('drive_impact_opponent','question','誰のドライブインパクトに困っていますか？','character','opponent_character_id','drive_impact','相手キャラクターを選んでください。',80),
    ('drive_impact_situation','question','ドライブインパクトに対して、特に何が難しいですか？','static','situation_key','drive_impact',null,90),
    ('character_opponent','question','どのキャラクターに困っていますか？','character','opponent_character_id','character_matchup','相手キャラクターを選んでください。',100),
    ('character_problem','question','そのキャラクターの何に困っていますか？','static','situation_key','character_matchup',null,110),
    ('move_character','question','その技を使うキャラクターは誰ですか？','character','opponent_character_id','specific_move','相手キャラクターを選ぶと、そのキャラクターの技を表示します。',120),
    ('move_select','question','どの技に困っていますか？','move','opponent_move_id','specific_move','技名が分からない場合は、前の画面に戻って「その他」を選べます。',130),
    ('move_problem','question','その技について、何を知りたいですか？','static','situation_key','specific_move',null,140),
    ('corner_opponent','question','誰の画面端や起き攻めに困っていますか？','character','opponent_character_id','corner_defense','相手キャラクターを選んでください。',150),
    ('corner_problem','question','画面端や起き攻めのどの場面に困っていますか？','static','situation_key','corner_defense',null,160),
    ('execution_character','question','どのキャラクターの操作やコンボに困っていますか？','character','player_character_id','execution','自分が使用しているキャラクターを選んでください。',170),
    ('execution_problem','question','操作やコンボの何に困っていますか？','static','situation_key','execution',null,180),
    ('other_detail','question','困っていることを短く入力してください。','free_text','question_detail','other','技名や状況が曖昧でも、そのまま入力できます。',190),
    ('handoff','handoff','情報を整理しました。関連する対策・技・練習を確認するか、AIコーチに相談できます。','none',null,null,null,200)
)
insert into public.coach_quick_help_nodes (
  flow_id,
  node_key,
  node_type,
  prompt,
  input_type,
  answer_key,
  topic_key,
  help_text,
  sort_order
)
select
  flow.id,
  d.node_key,
  d.node_type,
  d.prompt,
  d.input_type,
  d.answer_key,
  d.topic_key,
  d.help_text,
  d.sort_order
from flow
cross join node_data d
on conflict (flow_id,node_key) do update
set
  node_type = excluded.node_type,
  prompt = excluded.prompt,
  input_type = excluded.input_type,
  answer_key = excluded.answer_key,
  topic_key = excluded.topic_key,
  help_text = excluded.help_text,
  sort_order = excluded.sort_order;

with flow as (
  select id
  from public.coach_quick_help_flows
  where slug = 'quick-help'
),
links(node_key,next_node_key) as (
  values
    ('anti_air_opponent','anti_air_situation'),
    ('projectile_opponent','projectile_situation'),
    ('drive_rush_opponent','drive_rush_situation'),
    ('drive_impact_opponent','drive_impact_situation'),
    ('character_opponent','character_problem'),
    ('move_character','move_select'),
    ('move_select','move_problem'),
    ('corner_opponent','corner_problem'),
    ('execution_character','execution_problem'),
    ('other_detail','handoff')
)
update public.coach_quick_help_nodes n
set default_next_node_id = next_node.id
from flow
join links l on true
join public.coach_quick_help_nodes next_node
  on next_node.flow_id = flow.id
 and next_node.node_key = l.next_node_key
where n.flow_id = flow.id
  and n.node_key = l.node_key;

with flow as (
  select id
  from public.coach_quick_help_flows
  where slug = 'quick-help'
),
option_data(
  node_key,
  option_key,
  label,
  option_value,
  next_node_key,
  metadata,
  sort_order
) as (
  values
    ('problem_type','anti_air','飛び・対空','anti_air','anti_air_opponent','{"counter_types":["anti_air"],"training_types":["anti_air","anti_air_conversion","zoning_anti_air"]}'::jsonb,10),
    ('problem_type','projectile','弾への対応','projectile','projectile_opponent','{"counter_types":["projectile","approach","zoning"],"training_types":["projectile_response","zoning","approach"]}'::jsonb,20),
    ('problem_type','drive_rush','ドライブラッシュ','drive_rush','drive_rush_opponent','{"counter_types":["drive_rush","reaction","defense"],"training_types":["reaction_dr","reaction","defense"]}'::jsonb,30),
    ('problem_type','drive_impact','ドライブインパクト','drive_impact','drive_impact_opponent','{"counter_types":["drive_impact","reaction"],"training_types":["reaction_di","reaction"]}'::jsonb,40),
    ('problem_type','character_matchup','特定のキャラクター','character_matchup','character_opponent','{"counter_types":["matchup_plan","matchup_overview","matchup_baseline"],"training_types":["matchup"]}'::jsonb,50),
    ('problem_type','specific_move','特定の技','specific_move','move_character','{"counter_types":["punish","defense","reaction"],"training_types":["punish","defense","reaction"]}'::jsonb,60),
    ('problem_type','corner_defense','画面端・起き攻め','corner_defense','corner_opponent','{"counter_types":["defense"],"training_types":["corner_escape","defense_corner","defense"]}'::jsonb,70),
    ('problem_type','execution','コンボ・操作','execution','execution_character','{"counter_types":[],"training_types":["execution","combo","confirm","hit_confirm"]}'::jsonb,80),
    ('problem_type','other','その他','other','other_detail','{"counter_types":[],"training_types":[]}'::jsonb,90),

    ('anti_air_situation','normal_jump','通常の飛び込みを落とせない','normal_jump','handoff','{}'::jsonb,10),
    ('anti_air_situation','cross_up','めくりに対応できない','cross_up','handoff','{}'::jsonb,20),
    ('anti_air_situation','trajectory_change','軌道変化技や急降下技に対応できない','trajectory_change','handoff','{}'::jsonb,30),
    ('anti_air_situation','trade_or_lose','対空は出るが相打ちや負けになる','trade_or_lose','handoff','{}'::jsonb,40),
    ('anti_air_situation','low_reward','対空後のリターンを伸ばしたい','low_reward','handoff','{}'::jsonb,50),
    ('anti_air_situation','unclear','うまく説明できない','unclear','handoff','{}'::jsonb,60),

    ('projectile_situation','cannot_avoid','弾を避けられない','cannot_avoid','handoff','{}'::jsonb,10),
    ('projectile_situation','cannot_approach','近づけない','cannot_approach','handoff','{}'::jsonb,20),
    ('projectile_situation','jump_punished','飛ぶと対空される','jump_punished','handoff','{}'::jsonb,30),
    ('projectile_situation','bypass_unknown','弾抜けや対処技が分からない','bypass_unknown','handoff','{}'::jsonb,40),
    ('projectile_situation','burnout','バーンアウト中の削りが苦しい','burnout','handoff','{}'::jsonb,50),
    ('projectile_situation','unclear','その他・うまく説明できない','unclear','handoff','{}'::jsonb,60),

    ('drive_rush_situation','cannot_react','ラッシュそのものに反応できない','cannot_react','handoff','{}'::jsonb,10),
    ('drive_rush_situation','strike','ラッシュ後の打撃を止められない','strike','handoff','{}'::jsonb,20),
    ('drive_rush_situation','throw_mix','打撃と投げの二択が苦しい','throw_mix','handoff','{}'::jsonb,30),
    ('drive_rush_situation','crouching_medium_kick','中足ラッシュが苦しい','crouching_medium_kick','handoff','{}'::jsonb,40),
    ('drive_rush_situation','corner_carry','画面端まで運ばれてしまう','corner_carry','handoff','{}'::jsonb,50),
    ('drive_rush_situation','unclear','その他・うまく説明できない','unclear','handoff','{}'::jsonb,60),

    ('drive_impact_situation','cannot_react','見えても返せない','cannot_react','handoff','{}'::jsonb,10),
    ('drive_impact_situation','corner','画面端で受けてしまう','corner','handoff','{}'::jsonb,20),
    ('drive_impact_situation','during_attack','自分の攻撃中に受けてしまう','during_attack','handoff','{}'::jsonb,30),
    ('drive_impact_situation','armor_break_unknown','アーマーへの対処が分からない','armor_break_unknown','handoff','{}'::jsonb,40),
    ('drive_impact_situation','unclear','その他・うまく説明できない','unclear','handoff','{}'::jsonb,50),

    ('character_problem','neutral','立ち回りや間合い','neutral','handoff','{}'::jsonb,10),
    ('character_problem','normal_moves','通常技','normal_moves','handoff','{}'::jsonb,20),
    ('character_problem','special_moves','必殺技','special_moves','handoff','{}'::jsonb,30),
    ('character_problem','air_approach','飛びや空中からの攻め','air_approach','handoff','{}'::jsonb,40),
    ('character_problem','offense','固め・投げ・起き攻め','offense','handoff','{}'::jsonb,50),
    ('character_problem','defense','こちらから攻める方法','defense','handoff','{}'::jsonb,60),
    ('character_problem','modern_controls','モダン操作の技やSA','modern_controls','handoff','{}'::jsonb,70),
    ('character_problem','unclear','全体的に苦手・うまく説明できない','unclear','handoff','{}'::jsonb,80),

    ('move_problem','avoid','避け方・受け方を知りたい','avoid','handoff','{}'::jsonb,10),
    ('move_problem','after_block','ガードした後の行動を知りたい','after_block','handoff','{}'::jsonb,20),
    ('move_problem','punish','確定反撃を知りたい','punish','handoff','{}'::jsonb,30),
    ('move_problem','spacing','当たる間合いや避ける位置を知りたい','spacing','handoff','{}'::jsonb,40),
    ('move_problem','counter_move','対抗できる技を知りたい','counter_move','handoff','{}'::jsonb,50),
    ('move_problem','unclear','何が起きているか分からない','unclear','handoff','{}'::jsonb,60),

    ('corner_problem','cannot_escape','画面端から出られない','cannot_escape','handoff','{}'::jsonb,10),
    ('corner_problem','throw_mix','打撃と投げの二択が苦しい','throw_mix','handoff','{}'::jsonb,20),
    ('corner_problem','meaty','起き上がりに毎回攻撃を受ける','meaty','handoff','{}'::jsonb,30),
    ('corner_problem','drive_impact','ドライブインパクトが怖い','drive_impact','handoff','{}'::jsonb,40),
    ('corner_problem','reversal','無敵技やドライブリバーサルの使いどころが分からない','reversal','handoff','{}'::jsonb,50),
    ('corner_problem','unclear','その他・うまく説明できない','unclear','handoff','{}'::jsonb,60),

    ('execution_problem','combo_drop','コンボを途中で失敗する','combo_drop','handoff','{}'::jsonb,10),
    ('execution_problem','hit_confirm','ヒット確認ができない','hit_confirm','handoff','{}'::jsonb,20),
    ('execution_problem','cancel','キャンセルが安定しない','cancel','handoff','{}'::jsonb,30),
    ('execution_problem','super_art','SAまでつなげられない','super_art','handoff','{}'::jsonb,40),
    ('execution_problem','modern_input','モダン操作の入力やボタン配置','modern_input','handoff','{}'::jsonb,50),
    ('execution_problem','unclear','その他・うまく説明できない','unclear','handoff','{}'::jsonb,60)
)
insert into public.coach_quick_help_options (
  node_id,
  option_key,
  label,
  option_value,
  next_node_id,
  metadata,
  sort_order
)
select
  node.id,
  d.option_key,
  d.label,
  d.option_value,
  next_node.id,
  d.metadata,
  d.sort_order
from flow
join option_data d on true
join public.coach_quick_help_nodes node
  on node.flow_id = flow.id
 and node.node_key = d.node_key
join public.coach_quick_help_nodes next_node
  on next_node.flow_id = flow.id
 and next_node.node_key = d.next_node_key
on conflict (node_id,option_key) do update
set
  label = excluded.label,
  option_value = excluded.option_value,
  next_node_id = excluded.next_node_id,
  metadata = excluded.metadata,
  sort_order = excluded.sort_order;

update public.coach_quick_help_flows f
set root_node_id = n.id
from public.coach_quick_help_nodes n
where f.slug = 'quick-help'
  and n.flow_id = f.id
  and n.node_key = 'problem_type';
