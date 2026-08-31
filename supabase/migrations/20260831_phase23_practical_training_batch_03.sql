-- Phase23 practical Training batch 03: Marisa / Dee Jay / Juri / Ken.
-- reviewed/draft only.

insert into public.sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select v.title,v.url,'character_guide','格ゲーブログ、略してかくぶろ',v.published_at,now(),'community','2026.08.03+ practical Training source; reviewed only.'
from (values
 ('マリーザ セットプレイまとめ','https://takukakugamer.com/sf6-marisa-setup/','2026-08-24'::timestamptz),
 ('ディージェイ コンボまとめ','https://takukakugamer.com/sf6-deejay-combo/','2026-08-16'::timestamptz),
 ('ディージェイ セットプレイまとめ','https://takukakugamer.com/sf6-deejay-setup/','2026-08-16'::timestamptz),
 ('ジュリ コンボまとめ','https://takukakugamer.com/sf6-juri-combo/','2026-08-19'::timestamptz),
 ('ジュリ セットプレイまとめ','https://takukakugamer.com/sf6-juri-setup/','2026-08-19'::timestamptz),
 ('ケン コンボまとめ','https://takukakugamer.com/sf6-ken-combo/','2026-08-28'::timestamptz),
 ('ケン セットプレイまとめ','https://takukakugamer.com/sf6-ken-setup/','2026-08-28'::timestamptz)
) v(title,url,published_at)
where not exists(select 1 from public.sources s where s.url=v.url);

with cp as (select id from public.patches where is_current=true order by created_at desc limit 1),
rows(char_slug,slug,name,training_type,purpose,level,duration_minutes,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,source_url) as (
values
-- Marisa
('marisa','marisa-practical-phalanx-safejump','マリーザ ファランクス+42詐欺飛び','safe_jump','ファランクス後のJ強P/J強K詐欺飛びを安定させる。','intermediate',8,'ファランクスで+42を作り、ダミーに4F/無敵技を記録。','ランダム再生。入力履歴ON。','CPU OFF。','ファランクス→最速前ジャンプ強Pまたは強K。通常起き上がりには重ね、無敵技には着地ガード。','10回連続で通常技へ重ね、無敵技をガードできる。',20,'着地後の←強P/エンフォルド二択へ進む。','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-practical-light-dimach-31','マリーザ 弱ディマカイルス+31起き攻め','oki','+31から打撃とエンフォルドを使い分ける。','intermediate',8,'弱ディマカイルス派生で+31。ダミー4F/ジャンプ/投げを記録。','ランダム再生。','CPU OFF。','弱ディマカイルス派生→立ち弱P空振り→前強Kまたは最速エンフォルドを各10回。','20回中18回以上、狙った択を入力し4F/ジャンプへの結果を分類できる。',20,'パリィラッシュ択も追加する。','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-practical-corner-plus36-enfold','マリーザ 端+36→最速エンフォルド','oki_command_throw','中ディマカイルス/弱グラディウス後に端エンフォルドを埋める。','intermediate',8,'画面端。中ディマカイルスまたは弱グラディウスで+36。ダミー4F/ジャンプを記録。','ランダム再生。入力履歴ON。','CPU OFF。','+36→しゃがみ中P空振り(+10)→最速スクトゥム→エンフォルド。','10回中9回以上最速入力し、4Fに割られない。',20,'溜め←強Pとの二択へ進む。','https://takukakugamer.com/sf6-marisa-setup/'),
('marisa','marisa-practical-safejump-plus11-mix','マリーザ 詐欺飛び+11後の太い二択','pressure','最低空J強攻撃後に←強Pとエンフォルドを使い分ける。','intermediate',8,'+42詐欺飛びを再現。ダミー4F/投げ/ジャンプを記録。','ランダム再生。','CPU OFF。','J強P/J強Kガード(+11)後、←強Pまたは最速エンフォルド。補助択として前強Kも5回。','25局面で打撃と投げを各10回以上成功させ、読み負けを分類できる。',25,'最大溜めJ強攻撃+18からの連係へ進む。','https://takukakugamer.com/sf6-marisa-setup/'),
-- Dee Jay
('dee-jay','deejay-practical-sweep-sunrise-meaty','ディージェイ 大足+33→サンライズヒール持続重ね','oki_meaty','大足後に持続サンライズヒールで+状況を作る。','intermediate',7,'しゃがみ強Kで+33。ダミー4F/ガードを記録。','ランダム再生。','CPU OFF。','しゃがみ強K→立ち弱P空振り→サンライズヒール。','10回中9回以上4Fを潰し、ガード時+2をフレーム表示で確認。',20,'投げとの二択へ進む。','https://takukakugamer.com/sf6-deejay-setup/'),
('dee-jay','deejay-practical-quick-sobat-rush','ディージェイ クイックソバ+34ラッシュ択','oki','クイックソバ後にラッシュ前中K/立中Pを重ねる。','intermediate',8,'クイックローリングソバット地上ヒットで+34。ダミー4F/投げ。','ランダム再生。','CPU OFF。','+34→パリィラッシュ→前中Kまたは立ち中Pを各10回。','20回中18回以上重ね成功し、前中K(+5)と立中P(+6)の距離差を説明できる。',20,'ラッシュ停止投げを追加する。','https://takukakugamer.com/sf6-deejay-setup/'),
('dee-jay','deejay-practical-jackknife-42','ディージェイ 強ジャックナイフ+42起き攻め','oki','強ジャックナイフ締めから中央でも密着+4を作る。','beginner',7,'強ジャックナイフ地上ヒット。ダミー通常/後方受け身、4Fを記録。','ランダム再生。','CPU OFF。','強ジャックナイフ(+42)→前ステ×2(+4)→打撃/投げを各10回。','後方受け身を含む20回中18回以上で密着択を成立させる。',20,'+42詐欺飛びとの使い分けへ進む。','https://takukakugamer.com/sf6-deejay-setup/'),
('dee-jay','deejay-practical-frontthrow-chase','ディージェイ 前投げ後の受け身確認','decision_oki','前投げ後、その場/後方受け身に応じて前ステ・ラッシュを使い分ける。','intermediate',10,'前投げ後、ダミーの受け身をRandom。起き上がり4F/無敵技を記録。','Random recovery + random playback。','CPU OFF。','前投げ後、その場受け身には前ステ、後方受け身にはパリィラッシュを基本として20回処理。','20回中16回以上で受け身に合った追い方を選び、無理な投げを減らせる。',20,'ジョスクール疑似シミーを追加する。','https://takukakugamer.com/sf6-deejay-setup/'),
-- Juri
('juri','juri-practical-light-fuha-bnb','ジュリ 小技→中風破刃ストック回収','execution','小技始動から安定して風破ストックを作る。','beginner',6,'ダミー立ち、ガードOFF。','入力履歴ON。','CPU OFF。','しゃがみ弱P→しゃがみ弱P→中風破刃を左右10回ずつ。','左右10回連続完走し、中風破刃の暴発/抜け0回。',20,'弱天穿輪締めとの起き攻め差を比較する。','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-practical-crmk-drc','ジュリ 中足ラッシュ基本ルート','execution','中足ラッシュから標準コンボを固定する。','intermediate',8,'ダミー立ち、ガードOFF。','入力履歴・ダメージ表示ON。','CPU OFF。','しゃがみ中K→キャンセルラッシュ→立ち中P→立ち強P→強風破刃→強天穿輪を10回。','10回中9回以上完走。始動をしゃがみ中P/前強Pへ変えても各5回成功。',20,'Random Guardで中足確認へ進む。','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-practical-medium-fuha-oki','ジュリ 中風破刃+37→前ステ起き攻め','oki','中風破刃後に立ち中P/投げ/シミーを使い分ける。','intermediate',8,'中風破刃で+37→前ステ(+15)。ダミー4F/投げ/無敵技。','ランダム再生。','CPU OFF。','前ステ後、立ち中P、歩き投げ、後ろ歩きシミーを各10回。','30回で打撃重ね失敗3回以下、シミー時に投げを空振りさせる。',30,'受け身別の歩き量調整へ進む。','https://takukakugamer.com/sf6-juri-setup/'),
('juri','juri-practical-sweep-pc-meaty','ジュリ 大足PC+47→立ち強K空振り持続中P','oki_meaty','大足CH/PC後に+8から立ち中P持続重ねを固定する。','intermediate',7,'大足CH/PCを作り、ダミー4F/ガード。','ランダム再生。フレーム表示ON。','CPU OFF。','大足CH/PC(+47)→立ち強K空振り(+8)→立ち中P。','10回中9回以上4Fを潰し、ガード+5/ヒット+10の持続当てを確認。',20,'投げ/様子見を追加する。','https://takukakugamer.com/sf6-juri-setup/'),
-- Ken
('ken','ken-practical-light-bnb','ケン 小技→強昇龍拳BnB','execution','ケンの基本小技コンボを左右で安定させる。','beginner',6,'ダミー立ち、ガードOFF。','入力履歴ON。','CPU OFF。','しゃがみ弱P×2→立ち弱K→強昇龍拳を左右10回ずつ。','左右10回連続完走。立ち弱Pを混ぜる誤入力0回。',20,'下段始動しゃがみ弱Kを追加する。','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-practical-crmk-run-tatsu','ケン 中足ラッシュ運びルート','execution','中足ラッシュから奮迅竜巻で運びと起き攻めを取る。','intermediate',8,'ダミー立ち。中央から開始。','入力履歴・ダメージ表示ON。','CPU OFF。','しゃがみ中K→キャンセルラッシュ立ち弱P→立ち中P・強P→奮迅脚→派生竜巻を10回。','10回中9回以上完走し、端到達位置を記録。',20,'ガード時は後ろ投げ等へ分岐する確認へ進む。','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-practical-sweep40-oki','ケン 大足+40→前ステ×2択','oki','大足後の密着+2から投げ/しゃがみ中P/バクステを使い分ける。','beginner',8,'大足通常ヒット。ダミー4F/投げ/無敵技。','ランダム再生。','CPU OFF。','しゃがみ強K(+40)→前ステ×2(+2)→投げ/しゃがみ中P/バクステを各10回。','30回で各択を成立させ、バクステ時に最速投げを避けられる。',30,'PC+47の入れ替え択へ進む。','https://takukakugamer.com/sf6-ken-setup/'),
('ken','ken-practical-run-shoryu-25','ケン 奮迅昇龍+25→前ステ+6起き攻め','oki','奮迅昇龍後の投げ/立ち強P/バクステ狩りを実戦化する。','intermediate',10,'奮迅昇龍で+25。ダミー4F/投げ/バクステ/無敵技を記録。','ランダム再生。','CPU OFF。','前ステ(+6)後に歩き投げ、立ち強P、バクステ→立ち強Kを各10回。','30回で4F相打ち後の有利、投げ抜け狩り、無敵読みを区別できる。',30,'奮迅中K/弱K派生の表裏択を追加する。','https://takukakugamer.com/sf6-ken-setup/')
), ins as (
 insert into public.trainings(slug,name,training_type,purpose,player_character_id,level,duration_minutes,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,status)
 select r.slug,r.name,r.training_type,r.purpose,c.id,r.level,r.duration_minutes,r.recording_instructions,r.playback_settings,r.cpu_settings,r.method,r.success_criteria,r.recommended_reps,r.next_step,cp.id,'reviewed','draft'
 from rows r join public.characters c on c.slug=r.char_slug cross join cp
 on conflict(slug) do nothing returning id,slug
)
insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'supporting','Practical Training recipe source; reviewed, not verified.'
from rows r join public.trainings t on t.slug=r.slug join public.sources s on s.url=r.source_url
on conflict(entity_type,entity_id,source_id) do nothing;
