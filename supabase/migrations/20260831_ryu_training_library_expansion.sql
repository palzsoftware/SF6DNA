-- Phase23: expand Ryu practical training library with current Year4 recipes.
-- No publication or verification promotion. All rows remain reviewed/draft pending device reproduction.

with ctx as (
  select
    (select id from characters where slug='ryu') as ryu_id,
    (select id from patches where is_current=true order by released_at desc limit 1) as patch_id
), data(slug,name,training_type,purpose,level,method,success_criteria,reps,next_step,source_kind) as (
  values
  ('ryu-lib-crmk-drc-bnb','【コンボ】中足Cラッシュ基本','combo','下段始動から安定した基本火力へ繋ぐ','intermediate','しゃがみ中K ＞ Cラッシュ ＞ 立ち強P ＞ 上げ突き(4強P) ＞ 強昇龍拳','左右・中央で10回中8回以上完走する',20,'安定後はヒット確認からSA3締めへ分岐する','combo'),
  ('ryu-lib-crmk-drc-sa3','【コンボ】中足CラッシュSA3締め','combo','中足始動からSA3まで倒し切る','advanced','しゃがみ中K ＞ Cラッシュ ＞ 立ち強P ＞ 上げ突き(4強P) ＞ 強昇龍拳 ＞ SA3 真・昇龍拳','SA3まで10回中8回以上完走し、SA3がロックする距離を確認する',20,'画面端版の中昇龍拳経由と比較する','combo'),
  ('ryu-lib-crmk-drc-full-extension','【コンボ】中足Cラッシュ全伸ばし','combo','ドライブを使った高火力ルートを安定させる','advanced','しゃがみ中K ＞ Cラッシュ ＞ 立ち強P ＞ 上げ突き(4強P) ＞ Cラッシュ ＞ 立ち強K ＞ 立ち強P ＞ 強昇龍拳 ＞ SA3','ゲージ条件を固定して10回中8回以上完走する',20,'リーサル時だけ選ぶ基準を作る','combo'),
  ('ryu-lib-denjin-hashogeki-tatsu','【コンボ】電刃・強波掌撃から中竜巻','combo','電刃錬気中のノーゲージ追撃を固定する','intermediate','中攻撃以上 ＞ [電刃錬気]強波掌撃 ＞ 中竜巻旋風脚','電刃あり/なしを切り替え、電刃ありで10回中8回以上成立させる',20,'電刃なしで同じ入力をしない判断も練習する','combo'),
  ('ryu-lib-denjin-hashogeki-dr-dp','【コンボ】電刃・強波掌撃DR昇龍','combo','電刃からドライブを使って火力と運びを伸ばす','advanced','中攻撃以上 ＞ [電刃錬気]強波掌撃 ＞ Cラッシュ ＞ 上げ突き(4強P) ＞ 強昇龍拳','10回中8回以上完走し、Cラッシュ入力の遅延を減らす',20,'SA3がある場合の締め分岐を追加する','combo'),
  ('ryu-lib-sa1-od-donkey','【コンボ】OD足刀からSA1','combo','SA1を使う実戦的な締めを覚える','intermediate','中攻撃以上 ＞ OD上段足刀蹴り ＞ かかと落とし(4強K) ＞ SA1 真空波動拳','10回中8回以上SA1まで繋げる',20,'SA1を使わないルートとのダメージ・位置を比較する','combo'),
  ('ryu-lib-sa2-full-route','【コンボ】SA2高火力ルート','combo','SA2へ繋ぐ代表的なドライブ使用ルートを固定する','advanced','中攻撃以上 ＞ Cラッシュ ＞ 立ち強P ＞ 上げ突き(4強P) ＞ Cラッシュ ＞ 立ち強K ＞ しゃがみ強P ＞ SA2 真・波掌撃','SA2まで10回中8回以上完走する',20,'Lv1/Lv2/Lv3ホールド差は別Trainingで検証する','combo'),
  ('ryu-lib-sa3-full-route','【コンボ】SA3最大級ルート','combo','SA3リーサル用の長いルートを安定させる','advanced','中攻撃以上 ＞ Cラッシュ ＞ 立ち強P ＞ 上げ突き(4強P) ＞ Cラッシュ ＞ 立ち強K ＞ しゃがみ強P ＞ 強昇龍拳 ＞ SA3 真・昇龍拳','ゲージ満タン条件で10回中8回以上完走する',20,'実戦では必要ゲージと残体力を見て短いルートへ切り替える','combo'),
  ('ryu-lib-punish-reversal-5hk','【確反】無敵技ガード後・立ち強K始動','punish','大きな隙にパニッシュカウンター最大を入れる','advanced','無敵技をガード ＞ 立ち強K(PC) ＞ しゃがみ強P ＞ Cラッシュ ＞ 立ち強K ＞ しゃがみ強P ＞ Cラッシュ ＞ 立ち強K ＞ しゃがみ強P ＞ 強昇龍拳 ＞ SA3','録画した無敵技10回に対して8回以上、PC始動から完走する',20,'SAなし・Drive少量時の短縮版も作る','combo'),
  ('ryu-lib-punish-od-hashogeki-corner','【確反】端OD波掌撃PCルート','corner_combo','画面端の大きな確反でSA3まで伸ばす','advanced','OD波掌撃(PC) ＞ 上げ突き(4強P) ＞ Cラッシュ ＞ 立ち強K ＞ しゃがみ強P ＞ Cラッシュ ＞ 立ち強K ＞ しゃがみ強P ＞ 強上段足刀蹴り ＞ 中昇龍拳 ＞ SA3','画面端固定で10回中8回以上完走する',20,'OD波掌撃始動が届く距離だけを採用する','combo'),
  ('ryu-lib-drive-reversal-punish','【確反】ドライブリバーサル反撃','punish','Dリバをガードした後の確定反撃を固定する','intermediate','ドライブリバーサルをガード ＞ 立ち中P(PC) ＞ 立ち強P ＞ 強昇龍拳','10回中9回以上、最速で反撃する',20,'余裕があればCラッシュ高火力ルートへ分岐する','combo'),
  ('ryu-lib-corner-light-donkey-safejump','【詐欺飛び】端小技→弱足刀→前J強K','safe_jump','小技ヒットから+42F詐欺飛びへ直結させる','intermediate','画面端：しゃがみ弱K ＞ しゃがみ弱P ＞ しゃがみ弱P ＞ 弱上段足刀蹴り ＞ 前ジャンプ強K','相手にOD無敵技を録画し、10回中10回ジャンプ攻撃を重ねつつ着地ガードできるか確認する',20,'透かし下段・透かし投げも同じ起点から練習する','oki'),
  ('ryu-lib-meaty-overhead-plus4plus5','【持続重ね】鎖骨割り+4/+5作成','oki_meaty','中段の持続当てから4F/5F技をコンボにする','advanced','起き上がりに鎖骨割り(6中P)の持続3F目または4F目を当て、+4F/+5Fを作る ＞ 4F弱P、+5F時は5F弱Kも繋ぐ','トレモのフレーム表示で+4または+5を10回中8回以上再現し、その後の弱技まで連続ヒットさせる',30,'安定後は弱上段足刀締めから詐欺飛びへ繋ぐ','oki'),
  ('ryu-lib-di-counter-oki','【セットプレイ】DI返し→強波掌撃→昇龍→前ステ2回','setup','DI返しコンボ後に+2F付近の投げ・下段・シミー択へ移る','advanced','ドライブインパクト返し ＞ 強波掌撃 ＞ ドライブラッシュ立ち中P ＞ 強昇龍拳 ＞ 前方ステップ×2 ＞ 投げ / しゃがみ弱K→立ち弱P / 後ろ下がり','3択を各10回再現し、通常投げ間合いの相手では後ろ下がりで投げを空振らせられるか確認する',30,'投げ間合いが広いキャラでは後方ステップ版へ切り替える','oki')
)
insert into trainings(
  slug,name,training_type,purpose,level,duration_minutes,player_character_id,
  recording_instructions,playback_settings,method,success_criteria,recommended_reps,next_step,
  valid_from_patch_id,verification_status,content_kind,status
)
select d.slug,d.name,d.training_type,d.purpose,d.level,10,ctx.ryu_id,
       case when d.training_type in ('safe_jump','oki_meaty','setup','punish') then '相手側に対象行動を録画し、通常/後方受け身や無敵技を必要に応じて切り替える。' else null end,
       case when d.training_type in ('safe_jump','oki_meaty','setup') then '起き上がり行動をランダム再生し、成立条件を確認する。' else null end,
       d.method,d.success_criteria,d.reps,d.next_step,ctx.patch_id,'reviewed','training','draft'
from data d cross join ctx
on conflict (slug) do nothing;

-- Link current Year4 strategy/official/frame evidence.
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',tr.id,s.id,'supporting','Ryu Year4 practical training source'
from trainings tr
join sources s on s.url in (
  'https://sf6-genten.com/character/ryu/category/combo',
  'https://sf6-genten.com/character/ryu/category/okizeme-setplay',
  'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ryu',
  'https://ultimateframedata.com/sf6/ryu'
)
where tr.slug like 'ryu-lib-%'
on conflict (entity_type,entity_id,source_id) do nothing;
