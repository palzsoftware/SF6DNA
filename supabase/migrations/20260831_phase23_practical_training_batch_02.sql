-- Phase23 practical Training batch 02.
-- All rows remain reviewed/draft. No publication or verified promotion.

insert into public.sources (title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select v.title,v.url,'character_guide','格ゲーブログ、略してかくぶろ',v.published_at,now(),'community','2026.08.03+ practical Training source; reviewed only.'
from (values
 ('イングリッド コンボまとめ','https://takukakugamer.com/sf6-ingrid-combo/','2026-08-09'::timestamptz),
 ('イングリッド セットプレイまとめ','https://takukakugamer.com/st6-ingrid-setup/','2026-08-22'::timestamptz),
 ('ルーク コンボまとめ','https://takukakugamer.com/sf6-luke-combo/','2026-08-09'::timestamptz),
 ('ジェイミー コンボまとめ','https://takukakugamer.com/sf6-jamie-combo/','2026-08-04'::timestamptz),
 ('ジェイミー セットプレイまとめ','https://takukakugamer.com/sf6-jamie-setup/','2026-08-05'::timestamptz),
 ('エド コンボまとめ','https://takukakugamer.com/sf6-ed-combo/','2026-08-26'::timestamptz),
 ('エド セットプレイまとめ','https://takukakugamer.com/sf6-ed-setup/','2026-08-26'::timestamptz),
 ('ブランカ セットプレイまとめ','https://takukakugamer.com/sf6-blanka-setup/','2026-08-14'::timestamptz)
) v(title,url,published_at)
where not exists (select 1 from public.sources s where s.url=v.url);

with cp as (select id from public.patches where is_current=true order by created_at desc limit 1),
rows(char_slug,slug,name,training_type,purpose,level,duration_minutes,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,source_url) as (
values
-- Ingrid
('ingrid','ingrid-practical-medium-sunrise-oki','イングリッド 中サンライズ後+18起き攻め','oki','中サンライズ締め後に前ステから投げ・しゃがみ中P・シミーを使い分ける。','intermediate',8,'ダミーを通常/後方受け身。起き上がり4F、投げ、無敵技を別スロットに記録。','ランダム再生。入力履歴ON。','CPU OFF。','中サンライズでダウン→前ステ(+18)→前歩きから投げ、しゃがみ中P、後ろ歩きの3択を各10回。','各択10回で、打撃重ね・投げ・投げ空振り確認を崩さず再現できる。',30,'その場受け身と後方受け身を混ぜても距離調整できるようにする。','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid','ingrid-practical-strong-sunrise-resource-oki','イングリッド 強サンライズ→中ソーラーフレア後の選択','resource_oki','+50状況からシンボル回収・設置・前ステ攻めを選び分ける。','intermediate',10,'強サンライズ→中ソーラーフレアまで固定。ダミーは4F/投げ/無敵を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','締め後に弱サンフレア、各サンシュート、前ステ×2から打撃/投げ/シミーをローテーション。','20局面で同じ選択を3回以上連続せず、目的（回収/設置/攻め）を説明できる。',20,'SA2を絡めたリソース運用へ進む。','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid','ingrid-practical-sweep-pc-oki','イングリッド 大足パニカン+45起き攻め','punish_oki','大足パニカン後の前ステ×2から密着択を安定させる。','beginner',7,'ダミーに大きな隙の技を記録し、大足パニカンを取る。起き上がり4F/投げを記録。','ランダム再生。入力履歴ON。','CPU OFF。','大足PC→前ステ×2(+5)→投げ/しゃがみ中P/後ろ歩きを各10回。','30試行で、打撃重ね失敗2回以下・投げ間合いミス2回以下。',30,'垂直ジャンプ混ぜの原人狩り確認へ進む。','https://takukakugamer.com/st6-ingrid-setup/'),
('ingrid','ingrid-practical-combo-end-choice','イングリッド コンボ締め選択：起き攻めかシンボル回収','decision','中サンライズ締めと中サンフレア等の回収締めを状況で選ぶ。','intermediate',10,'ダミーは立ち。始動を同じにして、締めだけ変更できる状態を作る。','ダメージ/入力履歴ON。','CPU OFF。','同じ始動から「起き攻めを取る中サンライズ締め」と「サンシンボル回収を狙う締め」を交互に10回ずつ。','20回すべてで意図した締めを選び、締め後の目的を即答できる。',20,'Drive/SA残量を加えた判断へ進む。','https://takukakugamer.com/sf6-ingrid-combo/'),
-- Luke
('luke','luke-practical-light-bnb','ルーク 小技BnB：2LP×2〜3→弱フラッシュナックル','execution','最頻出の小技始動を左右で安定させる。','beginner',6,'ダミー立ち、ガードOFF。1P/2P位置を交互に使用。','入力履歴・ダメージ表示ON。','CPU OFF。','しゃがみ弱P×2〜3→弱フラッシュナックルを左右10回ずつ。','左右10回連続で完走し、弱フラの入力抜け0回。',20,'Random Guardで小技確認へ進む。','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-practical-hp-confirm-hold','ルーク 立ち強Pヒット/ガード分岐','hit_confirm','立ち強Pヒット時は強フラ、ガード時はホールドで攻め継続する判断を練習する。','intermediate',8,'ダミーGuard Random。立ち強Pが届く距離に固定。','Random Guard。入力履歴ON。','CPU OFF。','立ち強Pを振り、ヒット時は強フラを即解放、ガード時は強フラをホールドする。','20回中18回以上正しく分岐し、誤即解放/誤ホールド合計2回以下。',20,'DI/ジャスパを混ぜたリスク管理へ進む。','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-practical-just-flash-entry','ルーク 中ジャストフラッシュ入門','execution_timing','18〜20F解放のジャスト入力を実戦コンボで体得する。','intermediate',10,'ダミーにDIを記録し、パニッシュカウンターを取れる状態にする。','入力履歴・フレーム表示ON。','CPU OFF。','DIパニカン→しゃがみ強P→中フラッシュナックル（ジャスト）→ノーチェイサーを反復。','10回中8回以上ジャスト版になり、失敗を早離し/遅離しに分類できる。',20,'中足ラッシュからのジャスト2回ルートへ進む。','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-practical-corner-air-flash','ルーク 端J中P→遅らせエアフラッシュ','corner_combo','端の弱/ODフラッシュからJ中P→遅らせエアフラの着地差を安定させる。','advanced',10,'相手を画面端。ダミーは立ち。','入力履歴・ダメージ表示ON。','CPU OFF。','立ち強P→弱フラ（最大溜めorジャスト）→J中P→遅らせ通常版エアフラ→弱ライジングを10回。','10回中8回以上、エアフラを最大溜めにせず弱ライジング追撃まで完走。',20,'SA1/SA2締めを追加する。','https://takukakugamer.com/sf6-luke-combo/'),
-- Jamie
('jamie','jamie-practical-lv0-bnb','ジェイミー Lv0中足ラッシュ基本','execution','毎ラウンド使うLv0の中足始動を固定する。','beginner',7,'酔いLv0。ダミー立ち、ガードOFF。','入力履歴ON。','CPU OFF。','しゃがみ中K→キャンセルラッシュしゃがみ弱P→しゃがみ中K→中流酔脚の一連を左右10回ずつ。','左右10回連続完走。酔いLv0で始めることを毎回確認。',20,'Random Guardで中足確認へ進む。','https://takukakugamer.com/sf6-jamie-combo/'),
('jamie','jamie-practical-drink-vs-oki','ジェイミー 飲酒か起き攻めかの締め判断','decision_resource','張弓腿/酔疾歩後に魔身で飲むか、起き攻めへ行くかを状況で選ぶ。','intermediate',10,'OD張弓腿、強張弓腿、酔疾歩、OD酔疾歩の各締めを個別に再現する。','通常再生。入力履歴ON。','CPU OFF。','各締め後に魔身を出し安全度を確認。その後、同じ締めから起き攻めを選ぶ試行を各5回。','20局面で「飲む理由/攻める理由」を即答し、意図した行動を実行できる。',20,'体力/Drive/酔いLvをランダム化した判断へ進む。','https://takukakugamer.com/sf6-jamie-setup/'),
('jamie','jamie-practical-light-bakkai-oki','ジェイミー 弱張弓腿+42〜43起き攻め','oki','弱張弓腿後の前ステ×2から投げ/しゃがみ中Pを重ねる。','intermediate',8,'弱張弓腿でダウン。ダミー起き上がり4F/投げを記録。','ランダム再生。入力履歴ON。','CPU OFF。','弱張弓腿→前ステ×2(+4〜5)→投げ or しゃがみ中Pを各10回。','20回中18回以上、4Fに打撃を通すか投げを重ねられる。',20,'詐欺飛びが取れる端状況へ進む。','https://takukakugamer.com/sf6-jamie-setup/'),
('jamie','jamie-practical-corner-safejump','ジェイミー 端+42詐欺飛び','safe_jump','弱張弓腿/弱爆廻後の前J強P詐欺飛びを安定させる。','advanced',8,'画面端。弱張弓腿または弱爆廻で+42を作り、ダミーに4F/無敵技を記録。','ランダム再生。入力履歴ON。','CPU OFF。','ダウン後に前J強P。通常起き上がりには重ね、無敵技には着地ガードする。','10回連続で通常行動へ重ね、無敵技をガードできる。',20,'着地投げ/着地小技を加えてジャスパ対策へ進む。','https://takukakugamer.com/sf6-jamie-setup/'),
-- Ed
('ed','ed-practical-light-bnb','エド 小技→中サイコブリッツ','execution','近距離の最小コンボを安定させる。','beginner',6,'ダミー立ち、ガードOFF。','入力履歴ON。','CPU OFF。','しゃがみ弱P→立ち弱P→中サイコブリッツを左右10回ずつ。','左右10回連続完走。立ち弱P空振り0回。',20,'Random Guardで小技確認へ進む。','https://takukakugamer.com/sf6-ed-combo/'),
('ed','ed-practical-medium-route-choice','エド 立ち中P始動：運び/起き攻め締め選択','decision_combo','立ち中P始動から中アッパーと中/強ブリッツの用途を分ける。','intermediate',8,'ダミー立ち。中央と端手前の2位置を保存。','入力履歴・ダメージ表示ON。','CPU OFF。','立ち中P→しゃがみ弱Kから中サイコアッパー/中サイコブリッツを各10回。別途TC→強ブリッツで起き攻め締めを確認。','20回で意図した締めを選択し、運び/起き攻めの目的を説明できる。',20,'ODフリッカーを含む中技始動へ進む。','https://takukakugamer.com/sf6-ed-combo/'),
('ed','ed-practical-strong-blitz-killstep-oki','エド 強サイコブリッツ→キルステップ+9','oki','強ブリッツ締め後の立ち強P/中足/投げ/シミーを実戦化する。','intermediate',10,'強サイコブリッツ地上ヒット→キルステップまで固定。ダミー4F/投げ/無敵技を記録。','ランダム再生。入力履歴ON。','CPU OFF。','+9から立ち強P、しゃがみ中K、投げ、シミーを各5回。','20局面で打撃重ね失敗2回以下、シミー時に最速投げを空振りさせられる。',20,'相手の防御傾向に応じて4択を選ぶ。','https://takukakugamer.com/sf6-ed-setup/'),
('ed','ed-practical-crhp-dash-meaty','エド しゃがみ強P+30→前ステ+11重ね','oki_meaty','しゃがみ強Pダウン後の立ち強P持続重ねを固定する。','intermediate',7,'しゃがみ強P通常ヒットを作り、ダミー起き上がり4Fを記録。','通常再生。フレーム表示ON。','CPU OFF。','しゃがみ強P→前ステ(+11)→立ち強Pを10回。','10回中9回以上4Fを潰し、ガード時の状況をフレーム表示で確認できる。',20,'弱フリッカーホールド+4ルートも比較する。','https://takukakugamer.com/sf6-ed-setup/'),
-- Blanka
('blanka','blanka-practical-electricity-39-meaty','ブランカ 端電撃+39→持続中K重ね','oki_meaty','端の電撃後に←中K持続重ねを安定させる。','intermediate',8,'画面端。電撃で+39を作り、ダミー起き上がり4F/ガードを記録。','ランダム再生。入力履歴ON。','CPU OFF。','電撃(+39)→←中K空振り(+13)→←中K持続重ねを10回。','10回中9回以上重ね成功し、ヒット時の追撃始動まで入力できる。',20,'投げ/前ステ択を混ぜる。','https://takukakugamer.com/sf6-blanka-setup/'),
('blanka','blanka-practical-corner-doll-loop','ブランカ 端人形再設置ループ','doll_setup','小技始動から人形を再設置し、次の起き攻めまで一連で行う。','advanced',12,'画面端。人形使用可能。ダミー立ち。','入力履歴・ダメージ表示ON。','CPU OFF。','しゃがみ弱K→立ち弱K→OD電撃+起動→前ステ×2→後ろJ中P→人形設置→強バーチカルまで反復。','10回中8回以上、再設置とダウンまで完走し次の起き攻めに移れる。',20,'起き攻めが通った後の再ループを追加する。','https://takukakugamer.com/sf6-blanka-setup/'),
('blanka','blanka-practical-rock-crush-mix','ブランカ ラッシュ中段ロッククラッシュ択','mixup','ラッシュ→中Pと下段/投げを混ぜ、中段だけに依存しない崩しを作る。','intermediate',8,'ダミーGuard Random。起き上がり4F/投げを記録。','ランダム再生。入力履歴ON。','CPU OFF。','ラッシュ→中P、ラッシュから下段、ラッシュ停止投げをランダムに選び20回。','20回で同じ択を3回連続させず、各択の当たり/負け理由を記録できる。',20,'人形設置後の中段択へ進む。','https://takukakugamer.com/sf6-blanka-setup/'),
('blanka','blanka-practical-plus2-strike-throw','ブランカ ←中K+2打撃/投げ','pressure','+2から4F暴れを潰す打撃と投げの基本二択を固定する。','beginner',6,'←中Kをガードさせ、ダミーに4F/投げ抜けを記録。','ランダム再生。入力履歴ON。','CPU OFF。','←中Kガード(+2)後に立ち弱Kまたは投げ。立ち弱Kヒット時は安定コンボへ。','20回中、4Fには立ち弱Kを10回中9回以上通し、投げ抜けには打撃択を選べる。',20,'ODサンダーを混ぜた攻め継続へ進む。','https://takukakugamer.com/sf6-blanka-setup/')
), ins as (
 insert into public.trainings(slug,name,training_type,purpose,player_character_id,level,duration_minutes,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,status)
 select r.slug,r.name,r.training_type,r.purpose,c.id,r.level,r.duration_minutes,r.recording_instructions,r.playback_settings,r.cpu_settings,r.method,r.success_criteria,r.recommended_reps,r.next_step,cp.id,'reviewed','draft'
 from rows r join public.characters c on c.slug=r.char_slug cross join cp
 on conflict (slug) do nothing
 returning id,slug
)
insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Practical Training recipe source; reviewed, not verified.'
from rows r
join public.trainings t on t.slug=r.slug
join public.sources s on s.url=r.source_url
on conflict (entity_type,entity_id,source_id) do nothing;
