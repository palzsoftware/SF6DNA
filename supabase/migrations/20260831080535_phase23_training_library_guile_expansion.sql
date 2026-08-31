-- Phase23: expand Guile practical training from a detailed oki source.
-- All rows remain reviewed/draft. The 2025 strategy source is compatibility-
-- checked against the 2026-08-03 CAPCOM patch and current frame reference,
-- but no row is promoted to verified without real-device reproduction.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select
  'スト6ガイルの起き攻めまとめ',
  'https://note.com/mochimochi_sf/n/n25e5ee23d718',
  'community_guide',
  'もちもち',
  '2025-02-22 00:00:00+00'::timestamptz,
  now(),
  'community',
  '具体的なダウン有利、フレーム消費、起き攻め、コンボ例を収録。2026-08-03公式変更と現行Frame DBを併記し、実機確認前はreviewed/draftに限定する。'
where not exists(select 1 from sources where url='https://note.com/mochimochi_sf/n/n25e5ee23d718');

with ctx as (
  select (select id from patches where is_current=true order by released_at desc limit 1) patch_id
), data(slug,name,training_type,purpose,level,method,success_criteria,reps,next_step) as (
values
('guile-lib-lsummer-plus36-dash','【起き攻め】中央弱サマー+36→前ステ','oki','弱サマー締めからその場受け身への打撃・投げを作る','intermediate','中央で弱サマーソルトキック地上ヒット(+36) ＞ 前方ステップ(21F) ＞ 投げ / 打撃。後方受け身には前ステ後の生DR弱攻撃も別再生で確認する。','その場/後方受け身をランダム再生し、各20回中15回以上、受け身を見て追い方を選ぶ。',30,'Driveが少ない場合は起き攻めを止める判断Trainingへ進む'),
('guile-lib-hsummer-plus39-guile-high','【端起き攻め】強サマー+39→ガイルハイ空振り','oki','端強サマー後のフレーム消費からシミー間合いを作る','advanced','画面端 強サマーソルトキック地上ヒット(+39) ＞ ガイルハイ空振り ＞ 微下がり / 投げ / 打撃。','投げ抜け・4F・無敵技をランダム再生し、20回中15回以上シミーまたはガードを選ぶ。',30,'投げ抜け空振り確認から強P反撃へ進む'),
('guile-lib-hsummer-plus39-mp-msonic','【端弾重ね】強サマー+39→中P空振り→中ソニック','oki_meaty','端強サマー後に中ソニックを重ねて有利を取る','advanced','画面端 強サマーソルトキック地上ヒット(+39) ＞ 立ち中P空振り ＞ 中ソニックブーム重ね。ガード時+3Fを起点に継続する。','通常起き・前ジャンプ・バクステ・4Fをランダム再生し、ソニックの重なりとヒット/ガード確認を各10回記録する。',30,'ヒット時は強P始動、ガード時は投げ間合い外の継続へ進む'),
('guile-lib-hsummer-plus39-lk-overhead','【端持続中段】強サマー+39→弱K空振り→6中P','oki_meaty','端強サマー後に中段を持続当てして追撃を狙う','advanced','画面端 強サマーソルトキック地上ヒット(+39) ＞ 立ち弱K空振り ＞ 6中Pを持続当て ＞ ヒット時しゃがみ弱P。','通常起き・バクステ・前ジャンプ・4Fを各10回。持続当て後に2LPが連続する条件を記録する。',30,'SA2使用ルートと立ち/しゃがみ確認へ進む'),
('guile-lib-hsummer-plus39-backdash-dr2lp','【遅い無敵ケア】強サマー+39→バクステ→生DR2弱P','oki','発生の遅い無敵技を着地ガードできる重ねとして検証する','advanced','画面端 強サマーソルトキック地上ヒット(+39) ＞ バックステップ ＞ 生ドライブラッシュしゃがみ弱P。','対象キャラの無敵技と4Fを録画し、各10回、ガード可否と2LPの重なりを記録する。成立を全キャラ共通と扱わない。',20,'対象キャラ別の成立表を実機確認待ちへ送る'),
('guile-lib-2hk-plus34-oki','【起き攻め】大足+34から受け身確認','oki','しゃがみ強K締め後の距離別起き攻めを整理する','intermediate','しゃがみ強Kヒット(+34) ＞ その場/後方受け身を確認 ＞ 生DR打撃 / 投げ / 弾で継続する。','両受け身をランダム再生し、20回中15回以上、届く択を選ぶ。距離不足は失敗として記録する。',30,'中央弱サマー+36との距離差を比較する'),
('guile-lib-pc-fthrow-plus15-drthrow','【起き攻め】前投げPC+15→生DR投げ','oki','パニカン前投げ後に生DR投げを重ねる','intermediate','前投げパニッシュカウンター(+15) ＞ 最速生ドライブラッシュ ＞ 投げ。シミーは成立しにくい条件として分離する。','4F・ジャンプ・無敵技を各10回録画し、DR投げの結果を記録する。通常投げ後と混同しない。',20,'無敵技がある相手には様子見へ切り替える'),
('guile-lib-dr-overhead-full-route','【中段コンボ】生DR6中P→しゃがみ限定ルート','combo','生DR中段ヒットから現行ルートを完走する','advanced','生DR 6中P ＞ 2中P ＞ Cラッシュ ＞ 2中P ＞ 強P ＞ 強K ＞ 中P ＞ 弱ジャストソニック ＞ 強K ＞ SA1。しゃがみヒット条件を固定する。','しゃがみガード/ヒットをランダム再生し、ヒット時10回中8回以上完走。ガード時は2弱P確認へ切り替える。',20,'立ちヒット時の共通短縮ルートを別途収集する'),
('guile-lib-dr-2mk-standing-route','【下段コンボ】生DR2中K→立ち限定ルート','combo','中段対の下段から高火力ルートへ移行する','advanced','生DR 2中K ＞ 強P ＞ Cラッシュ ＞ 強K ＞ 強P ＞ Cラッシュ ＞ 6中K ＞ 中P ＞ 2中P ＞ 弱ジャストソニック ＞ 強K ＞ SA1。立ちヒット条件を固定する。','立ち/しゃがみをランダム再生し、立ちヒット時10回中8回以上完走。しゃがみ時は短縮する。',20,'中段ルートとランダム択で統合する'),
('guile-lib-delayed-dr-2mk-delay-tech','【崩し】遅らせ生DR2中Kで遅らせグラを狩る','pressure','DRの後半の伸びを使い投げ抜けタイミングをずらす','advanced','ダミーに遅らせ投げ抜けを録画 ＞ 起き上がりに生DRを少し遅らせて2中K ＞ ヒット確認から成立ルート。','早いDR/遅らせDRを混ぜ、20回中15回以上、遅らせグラへ下段を当てる。',30,'リバサパリィのタイミングずらしも別記録する'),
('guile-lib-shimmy-crouchguard-5hp','【シミー】微下がりしゃがみガード→投げ空振り強P','pressure','投げ抜けと無敵技を同時にケアして反撃する','intermediate','起き攻めで微下がり ＞ しゃがみガード ＞ 投げ空振りを見て立ち強P。無敵技だった場合はガード後の最大反撃へ切り替える。','投げ抜け/4F/無敵技をランダム再生し、20回中15回以上正しい反撃またはガードを選ぶ。',30,'裏拳始動の無敵技ガード後最大を収集する'),
('guile-lib-corner-escape-dr-backthrow','【端脱出】生DR後ろ投げ→最速生DR中P/弱K','corner_escape','自分が端の時に後ろ投げで位置を入れ替え起き攻めを継続する','intermediate','自分が画面端 ＞ 生DR後ろ投げ ＞ 位置入れ替え後、最速生DR立ち中P または立ち弱K。','後ろ投げを10回通し、続くDR中P/弱Kが相手4F・ジャンプへどうなるか各10回記録する。',20,'後ろ投げを嫌う相手へのシミーと組み合わせる'),
('guile-lib-delayed-dr-5mp-delay-tech','【暴れ潰し】遅らせ生DR立ち中P→中P確認','pressure','遅らせグラを狩りつつガード時の継続を作る','advanced','画面端付近で遅らせ生DR立ち中P ＞ 立ち中P。ヒット時は立ち/しゃがみを見てコンボ、ガード時は暴れ潰し連携へ。','遅らせ投げ抜け/4F/ガードをランダム再生し、20回中15回以上ヒット・ガード分岐を成功する。',30,'立ち/しゃがみ共通コンボを別Trainingに固定する'),
('guile-lib-corner-throw-sonic-confirm','【端弾重ね】前投げ後ソニック→ヒット確認','oki_meaty','端投げ後にソニックを重ね、ヒット時だけコンボへ移行する','advanced','画面端 前投げ ＞ ソニックブーム重ね ＞ ヒット時は強サマー締めへ、ガード時は+3Fかつ投げ間合い外として鳥かご継続へ。','通常ガード/前ジャンプ/バクステをランダム再生し、20回中15回以上ヒット確認して分岐する。',30,'立ち/しゃがみ別コンボは動画Source候補へ送る'),
('guile-lib-corner-throw-backwalk-burn-straight','【端シミー】前投げ後下がりバーンストレート','pressure','ソニック重ねを待つファジー小技へ下がり強攻撃を当てる','advanced','画面端 前投げ ＞ 微下がり ＞ バーンストレート。ソニックまで仕込み、ヒット時だけコンボを伸ばす。','ファジー小技/投げ抜け/無敵技をランダム再生し、20回中15回以上、攻撃・ガードを選ぶ。',30,'ソニック重ねとの二択としてランダム化する'),
('guile-lib-hsummer-guilehigh-shimmy','【端シミー】強サマー→ガイルハイ空振り→2中P','pressure','端強サマー後のフレーム消費から投げ抜けを狩る','advanced','画面端 強サマーソルトキック ＞ ガイルハイ空振り ＞ 微下がり ＞ 投げ空振り確認しゃがみ中P。','投げ抜け/4F/無敵技をランダム再生し、20回中15回以上、2中P反撃またはガードを成功する。',30,'2中P始動の端コンボSourceを追加収集する'),
('guile-lib-hsummer-guilehigh-5mp-meaty','【端打撃重ね】強サマー→ガイルハイ空振り→立ち中P','oki_meaty','前ジャンプにも当たりやすい立ち中Pを重ねる','advanced','画面端 強サマーソルトキック ＞ ガイルハイ空振り ＞ 立ち中P重ね ＞ ノーマルヒット時2中P。','4F/前ジャンプ/ガードをランダム再生し、20回中15回以上ヒット・ガード確認を成功する。',30,'ガード時の安全な継続とDリバ対策を分離する'),
('guile-lib-hsummer-lk-overhead-sa2','【端SA2】強サマー→弱K空振り→持続中段→SA2','combo','持続中段後の立ち/しゃがみ確認をSA2で簡略化する','advanced','画面端 強サマーソルトキック ＞ 立ち弱K空振り ＞ 6中P持続当て ＞ SA2を使う対応コンボ。','立ち/しゃがみをランダム再生し、10回中8回以上SA2ルートを完走する。具体的追撃は実機/動画確認前に追加しない。',20,'具体的なSA2追撃レシピをユーザー提供動画待ちに登録する'),
('guile-lib-hsummer-mp-sonic-hit9','【端ヒット確認】強サマー→中P空振り→ソニック+9','oki_meaty','ソニック重ねがジャンプ/バクステへ当たった時に強Pへ繋ぐ','advanced','画面端 強サマーソルトキック ＞ 立ち中P空振り ＞ ソニック重ね ＞ ノーマルヒット(+9)を確認して立ち強Pからコンボ。','前ジャンプ/バクステ/ガードをランダム再生し、20回中15回以上ヒット時だけ強Pへ繋ぐ。',30,'立ち/しゃがみ別の端ルートを収集する'),
('guile-lib-oki-resource-decision','【判断】Drive2本以下では起き攻めを中止','resource_management','起き攻め後にバーンアウトする状況を避ける','intermediate','弱サマー/強サマー/投げ後に自分のDriveを確認。生DRで2本以下になる場合は起き攻めせず、距離を取りソニックと対空で回復する。','20回のランダムDrive条件で18回以上、攻める/回復するを基準どおり選ぶ。',20,'相手のDrive2本以下では削り優先判断を追加する')
)
insert into trainings(
  slug,name,training_type,purpose,level,duration_minutes,player_character_id,
  dummy_character_id,recording_instructions,playback_settings,cpu_settings,method,
  success_criteria,recommended_reps,next_step,valid_from_patch_id,
  verification_status,content_kind,status
)
select d.slug,d.name,d.training_type,d.purpose,d.level,10,c.id,c.id,
       '相手側に通常/後方受け身、4F、投げ抜け、前ジャンプ、無敵技を必要に応じて録画する。',
       '複数スロットをランダム再生し、確定・キャラ限定・読み合いを混同しない。',
       'CPU操作は使用せず録画再生を優先。',d.method,d.success_criteria,d.reps,d.next_step,
       ctx.patch_id,'reviewed','training','draft'
from data d join characters c on c.slug='guile' cross join ctx
on conflict(slug) do nothing;

with selected as (
  select t.id from trainings t join characters c on c.id=t.player_character_id
  where c.slug='guile' and t.slug like 'guile-lib-%'
), evidence(url,note) as (
values
('https://note.com/mochimochi_sf/n/n25e5ee23d718','Detailed Guile oki and combo recipe source'),
('https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/guile','Current patch compatibility context'),
('https://ultimateframedata.com/sf6/guile','Current frame reference')
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',x.id,s.id,'supporting',e.note
from selected x cross join evidence e join sources s on s.url=e.url
on conflict(entity_type,entity_id,source_id) do nothing;
