-- Phase23: expand JP / Ken / Luke / Juri practical training libraries.
-- All rows remain reviewed/draft. No automatic verification or publication.
-- Recipes are sourced from current 2026-08 strategy pages plus CAPCOM current patch and current frame references.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select
  'JP セットプレイ・連係まとめ Year4',
  'https://takukakugamer.com/sf6-jp-setup/',
  'community_guide',
  '格ゲーブログ、略してかくぶろ',
  '2026-08-23 00:00:00+00'::timestamptz,
  now(),
  'community',
  '2026-08-23更新。Phase23 reviewed Training候補の根拠として使用。実機再現前にverifiedへ昇格しない。'
where not exists(select 1 from sources where url='https://takukakugamer.com/sf6-jp-setup/');

with ctx as (
  select
    (select id from patches where is_current=true order by released_at desc limit 1) as patch_id
), data(character_slug,slug,name,training_type,purpose,level,method,success_criteria,reps,next_step,guide_url) as (
values
-- JP +8
('jp','jp-lib-3hp-hit-plus17','【起き攻め】3強P通常ヒット+17','oki','3強P通常ヒット後の歩き打撃と生DR択を再現する','intermediate','3強P通常ヒット(+17) ＞ 前歩き ＞ しゃがみ中K / 立ち強P。別スロットで生ドライブラッシュから打撃・投げも比較する。','+17の開始条件を固定し、歩き2MK/5HPを各10回再現。生DR択も各10回、最速暴れ・投げ・ガードへの結果を記録する。',30,'通常ヒットとCH/PCを混同せず、CH/PC専用Trainingへ進む','https://takukakugamer.com/sf6-jp-setup/'),
('jp','jp-lib-3hp-chpc-plus39','【起き攻め】3強P CH/PC+39→前ステ','oki','3強Pカウンター/パニカン時の+39からシミーと投げを分ける','advanced','3強P CH/PC(+39) ＞ 前方ステップ ＞ 後ろ歩き / 投げ / 打撃。ODヴィーハト設置との比較も行う。','CH/PC条件を固定し、前ステ後の投げ・後ろ歩き・打撃を各10回。投げ抜け録画に対してシミー成立条件を記録する。',30,'画面位置ごとの投げ間合い差を記録する','https://takukakugamer.com/sf6-jp-setup/'),
('jp','jp-lib-2hk-plus27-dash','【起き攻め】2強K通常ヒット+27→前ステ','oki','大足通常ヒット後の+5前後の打撃投げを反復する','intermediate','しゃがみ強K通常ヒット(+27) ＞ 前方ステップ ＞ 投げ / しゃがみ中P。','通常ヒット条件で各択10回。相手4F暴れ・投げ・ガードを録画し、成立/相打ち/負けを記録する。',20,'パニカン時は別の+48ルートへ切り替える','https://takukakugamer.com/sf6-jp-setup/'),
('jp','jp-lib-2hk-pc-vihhat','【設置】2強Kパニカン+48→ヴィーハト','setup','大足パニカン後にヴィーハト設置の有利を活用する','advanced','しゃがみ強Kパニッシュカウンター(+48) ＞ 弱ヴィーハト または ODヴィーハト。OD版は設置後の有利状況を確認する。','PC条件を固定して弱/ODを各10回。設置後に相手4F・ジャンプ・DIを録画し、JP側の安全な継続を記録する。',30,'設置後の派生は確定と読み合いを区別する','https://takukakugamer.com/sf6-jp-setup/'),
('jp','jp-lib-corner-throw-plus23','【端起き攻め】前投げ+23→前ステ+1','oki','画面端前投げ後の基本投げ・打撃を固定する','beginner','画面端 前投げ(+23) ＞ 前方ステップ(+1) ＞ 投げ / しゃがみ弱P。別スロットで最速トリグラフも確認する。','投げ/2LPを各10回。相手4F・投げ抜け・ジャンプを録画し、どの択が何に勝つかを記録する。',20,'生DR立ち強K持続重ねへ進む','https://takukakugamer.com/sf6-jp-setup/'),
('jp','jp-lib-corner-throw-dr-5hk','【持続重ね】端前投げ→生DR立ち強K','oki_meaty','端前投げ後に生DR立ち強Kを持続当てする','advanced','画面端 前投げ ＞ 生ドライブラッシュ ＞ 立ち強Kを持続気味に重ねる。','フレーム表示を有効にし、ガード時の有利とヒット時の有利を各10回確認。4F暴れ録画に対して重ねが成立するか記録する。',30,'投げ・シミーとの3択へ統合する','https://takukakugamer.com/sf6-jp-setup/'),
('jp','jp-lib-medium-stribog-safejump42','【詐欺飛び】中ストリボーグ/弱トルバラン地上ヒット+42','safe_jump','+42Fダウンから前ジャンプ攻撃の詐欺飛びを再現する','intermediate','中ストリボーグ または 弱トルバラン地上ヒット(+42) ＞ 最速前ジャンプ強K。','相手OD無敵技を録画し、10回中10回ジャンプ攻撃を重ねつつ着地ガードできるか確認する。',20,'透かし投げ・透かし下段も同じ起点から練習する','https://takukakugamer.com/sf6-jp-setup/'),
('jp','jp-lib-plus42-2mk-whiff-5hk-meaty','【持続重ね】+42→2中K空振り→立ち強K','oki_meaty','+42Fダウンから時間消費して立ち強K持続重ねを作る','advanced','+42Fダウン ＞ しゃがみ中K空振り ＞ 立ち強K持続当て。','トレモ表示で時間消費後の有利を10回確認し、相手4F・無敵・投げに対する結果を分類する。',30,'成立後は投げ/シミー分岐へ進む','https://takukakugamer.com/sf6-jp-setup/'),

-- Ken +16
('ken','ken-lib-5hp-jinrai-light','【コンボ】立ち強P→中迅雷→弱派生','combo','初心者向けの短い立ち強P始動を固定する','beginner','立ち強P ＞ 中迅雷脚 ＞ 弱派生。','左右10回ずつ、10回中8回以上完走する。',20,'強派生や昇龍締めとの使い分けへ進む','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-corner-light-jinrai-dp','【端コンボ】小技→TC→迅雷→昇龍','corner_combo','画面端の小技始動から安定した追撃を覚える','intermediate','画面端：しゃがみ弱P ＞ 立ち中P・強Pターゲットコンボ ＞ 弱迅雷脚 ＞ 強派生 ＞ 中昇龍拳。','端固定で10回中8回以上完走する。',20,'SAゲージがある場合の締め分岐へ進む','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-di-wall-jinrai-dp','【端コンボ】DI壁→立ち強P→強迅雷','corner_combo','DI壁やられから安定した端追撃を固定する','intermediate','ドライブインパクト壁やられ ＞ 立ち強P ＞ 強迅雷脚 ＞ 強派生 ＞ 中昇龍拳。','壁やられを10回再現し、8回以上完走する。',20,'ゲージ使用の高火力版と比較する','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-di-clean-run-tatsu','【コンボ】DIクリーン→TC→奮迅竜巻','combo','DIクリーンヒット時の運びルートを覚える','beginner','DIクリーンヒット ＞ 立ち中P・強Pターゲットコンボ ＞ 奮迅脚 ＞ 奮迅竜巻旋風脚。','中央左右で10回中8回以上完走する。',20,'画面端到達距離を確認する','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-5hk-pc-run-dp','【確反】立ち強Kパニカン→奮迅昇龍','punish','大きな隙に立ち強KPCから簡単な高火力反撃を入れる','intermediate','立ち強Kパニッシュカウンター ＞ 奮迅脚 ＞ 奮迅昇龍拳。','無敵技ガードを録画し、10回中8回以上PC始動で完走する。',20,'より長いPCルートへ進む','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-jhk-5hp-run-dp','【コンボ】飛び込み強K→立ち強P→奮迅昇龍','combo','飛びが通った時の基本最大寄りルートを固定する','beginner','ジャンプ強K ＞ 立ち強P ＞ 奮迅脚 ＞ 奮迅昇龍拳。','左右10回ずつ、8割以上完走する。',20,'着地距離で5HPが届かない場合の短縮版を作る','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-5mp-5lp-dp','【コンボ】立ち中P→立ち弱P→強昇龍','combo','近距離中P始動の簡単な確認を覚える','beginner','立ち中P ＞ 立ち弱P ＞ 強昇龍拳。','ランダムガードでヒット時のみ昇龍まで10回中8回成功する。',20,'CH時の2MPルートへ進む','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-5mp-ch-2mp-run-dp','【コンボ】立ち中P CH→2中P→奮迅昇龍','combo','カウンターヒット時だけ伸ばす確認を練習する','intermediate','立ち中Pカウンターヒット ＞ しゃがみ中P ＞ 奮迅脚 ＞ 奮迅昇龍拳。','通常ヒット/CHを混ぜ、CH時だけ伸ばす判断を20回中15回以上成功する。',30,'PC時の最大反撃へ進む','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-corner-5mphp-jinrai-delay-dp','【端コンボ】TC→中迅雷ディレイ強派生→昇龍','corner_combo','端で迅雷ディレイ派生を安定させる','advanced','画面端：立ち中P・強Pターゲットコンボ ＞ 中迅雷脚 ＞ ディレイ強派生 ＞ 強昇龍拳。','ディレイ幅を固定し、10回中8回以上完走する。',30,'SA締めの有無でダメージを比較する','https://takukakugamer.com/sf6-ken-combo/'),
('ken','ken-lib-2hk-pc-plus47-side-switch','【起き攻め】大足PC+47→前ジャンプ入れ替え','oki','大足パニカン後に位置入れ替えと起き攻めを両立する','advanced','しゃがみ強Kパニッシュカウンター(+47) ＞ 前ジャンプで位置入れ替え ＞ 着地後の打撃/投げを確認する。','PC条件を10回再現し、位置入れ替え後の有利と相手4Fへの結果を記録する。',20,'入れ替え不要時の前ステ×2と比較する','https://takukakugamer.com/sf6-ken-setup/'),
('ken','ken-lib-run-tatsu-airhit-whiff-lp-overhead','【持続重ね】奮迅竜巻空中ヒット→弱P空振り→奮迅中段','oki_meaty','奮迅竜巻の空中ヒット後に時間消費して中段を重ねる','advanced','奮迅竜巻旋風脚 空中ヒット ＞ 立ち弱P空振り ＞ 奮迅脚 ＞ 中段派生を持続気味に重ねる。','トレモ表示で10回有利を確認し、相手4F/無敵/ジャンプへの結果を記録する。',30,'奮迅弱派生の+状況と比較する','https://takukakugamer.com/sf6-ken-setup/'),
('ken','ken-lib-medium-dp-plus33-whiff-2mk','【起き攻め】中昇龍+33→2中K空振り+5','oki_meaty','中昇龍締めから時間消費して打撃投げを作る','advanced','中昇龍拳ヒット後(+33) ＞ しゃがみ中K空振り ＞ 投げ / しゃがみ中P / しゃがみ弱K / 後ろ歩き。','各択10回。相手4F・投げ抜け・バクステをランダム再生し、適切な分岐を記録する。',30,'奮迅派生を使う起き攻めと比較する','https://takukakugamer.com/sf6-ken-setup/'),
('ken','ken-lib-od-dp-dash-plus3','【起き攻め】OD昇龍+22→前ステ+3','oki','OD昇龍後の+3から近距離択を作る','intermediate','OD昇龍拳ヒット(+22) ＞ 前方ステップ(+3) ＞ 投げ / 立ち中P / シミー。','各択10回、4F暴れと投げ抜けへの結果を記録する。',20,'ゲージを使った価値がある状況だけ採用する','https://takukakugamer.com/sf6-ken-setup/'),
('ken','ken-lib-corner-hdp-whiff-lp-5hp-meaty','【持続重ね】端強昇龍→弱P空振り→立ち強P','oki_meaty','端強昇龍締めから立ち強P持続重ねを作る','advanced','画面端 強昇龍拳地上ヒット ＞ 立ち弱P空振り ＞ 立ち強P持続重ね。','10回中8回以上同じ有利を再現し、4F暴れ録画に勝つか確認する。',30,'ガード後の2MP継続までセットで反復する','https://takukakugamer.com/sf6-ken-setup/'),
('ken','ken-lib-corner-forward-throw-plus20','【端起き攻め】前投げ+20→歩き/前ステ','oki','端前投げ後の歩き投げ・立ち強P・前ステ択を整理する','intermediate','画面端 前投げ(+20) ＞ 微歩き投げ / 立ち強P持続重ね / 前方ステップ(+1)から打撃・投げ。','各択10回。投げ抜け・4F・ジャンプに対する勝敗を記録する。',30,'生DRを使う高リターン択と比較する','https://takukakugamer.com/sf6-ken-setup/'),
('ken','ken-lib-medium-jinrai-gaptrap','【連携】中迅雷-7→弱派生ディレイ割り込み狩り','pressure','迅雷の派生タイミングを固定せず、暴れ狩りと派生なしを使い分ける','advanced','中迅雷脚ガード後 ＞ 弱派生をディレイ / 即派生 / 派生なし。','相手4F・ガード・DIをランダム再生し、20回中15回以上適切な派生/停止を選ぶ。',30,'相手キャラ固有の無敵技がある場合は別スロットで確認する','https://takukakugamer.com/sf6-ken-setup/'),

-- Luke +15
('luke','luke-lib-2lk-2lp-light-flash','【コンボ】2弱K→2弱P×2→弱フラッシュ','combo','5F下段始動の初心者BnBを固定する','beginner','しゃがみ弱K ＞ しゃがみ弱P ＞ しゃがみ弱P ＞ 弱フラッシュナックル。','左右10回ずつ、8割以上完走する。',20,'小技始動SA3と使い分ける','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-5hp-mp-sandblast','【コンボ】立ち強P→中サンドブラスト','combo','2026.08.03調整後の立ち強P始動短距離コンボを固定する','beginner','立ち強P ＞ 中サンドブラスト。','距離を変えながら10回中8回以上成立する間合いを確認する。',20,'画面位置と相手しゃがみ/立ちで成立差を記録する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-double-impact-sa3','【コンボ】ダブルインパクト→SA3','combo','ダブルインパクト始動からSA3へ繋ぐ','intermediate','ダブルインパクト(6HP＞HP) ＞ 強フラッシュナックル ＞ SA3。','10回中8回以上SA3まで完走する。',20,'SAなし起き攻め重視締めと比較する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-crmk-cdr-sa3','【コンボ】中足Cラッシュ→SA3','combo','中足始動のSA3ルートを固定する','advanced','しゃがみ中K または しゃがみ中P ＞ Cラッシュ ＞ しゃがみ中P ＞ しゃがみ強P ＞ ジャスト中フラッシュナックル ＞ ジャスト弱フラッシュナックル ＞ SA3。','ゲージ条件を固定し10回中8回以上完走する。',20,'SA1/起き攻め/火力ルートと状況別に選ぶ','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-corner-flash-sa1','【端コンボ】ジャスト弱フラ→弱フラ→SA1','corner_combo','端でSA1を使う短い追撃を固定する','advanced','画面端：対応始動 ＞ ジャスト弱フラッシュナックル ＞ 弱フラッシュナックル ＞ SA1。','端固定で10回中8回以上完走する。',20,'SA2版も同じ入力から確認する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-corner-flash-sa2','【端コンボ】ジャスト弱フラ→弱フラ→SA2','corner_combo','端でSA2を使う追撃を固定する','advanced','画面端：対応始動 ＞ ジャスト弱フラッシュナックル ＞ 弱フラッシュナックル ＞ SA2。','端固定で10回中8回以上完走する。',20,'SA1/SA3とのダメージ・位置を比較する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-corner-flash-hp-sa3','【端コンボ】ジャスト弱フラ→強フラ→SA3','corner_combo','端でSA3まで伸ばすリーサルルートを固定する','advanced','画面端：対応始動 ＞ ジャスト弱フラッシュナックル ＞ 強フラッシュナックル ＞ SA3。','ゲージ満タン条件で10回中8回以上完走する。',20,'必要体力だけ残っている時に選ぶ判断を付ける','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-jp-5hp-perfect-chain','【確反】ジャスパ→立ち強P→ジャストナックル連係','punish','ジャストパリィ後に補正を考慮した安定反撃を固定する','advanced','ジャストパリィ ＞ 立ち強P ＞ ジャスト中フラッシュナックル ＞ ジャスト弱フラッシュナックル ＞ アヴェンジャー ＞ ノーチェイサー。','代表技を10回ジャスパし、8回以上コンボを完走する。',20,'SA1/SA3締めへ分岐する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-jp-sa1','【確反】ジャスパ→SA1ルート','punish','ジャストパリィからSA1を使う確反を反復する','advanced','ジャストパリィ ＞ 立ち強P ＞ ジャスト中フラッシュナックル ＞ ジャスト弱フラッシュナックル ＞ SA1。','10回中8回以上完走する。',20,'SAゲージ価値をリーサル有無で判断する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-jp-sa3','【確反】ジャスパ→SA3ルート','punish','ジャストパリィからSA3リーサルへ繋ぐ','advanced','ジャストパリィ ＞ 立ち強P ＞ ジャスト中フラッシュナックル ＞ ジャスト弱フラッシュナックル ＞ SA3。','10回中8回以上完走する。',20,'SA3が不要な体力では短いルートへ切り替える','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-drev-guard-4hk-chain','【確反】Dリバガード→4強K高火力','punish','ドライブリバーサルガード後の大きな反撃を固定する','advanced','ドライブリバーサルをガード ＞ しゃがみ中P ＞ Cラッシュ ＞ 4強K ＞ しゃがみ強P ＞ ジャスト中フラッシュナックル ＞ ジャスト弱フラッシュナックル ＞ アヴェンジャー ＞ ノーチェイサー。','Dリバを10回録画し、8回以上完走する。',20,'SA1/SA3締めへ分岐する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-drev-guard-sa1','【確反】Dリバガード→SA1','punish','Dリバ反撃からSA1へ繋ぐ','advanced','ドライブリバーサルガード ＞ しゃがみ中P ＞ Cラッシュ ＞ 4強K ＞ しゃがみ強P ＞ ジャスト中フラッシュナックル ＞ ジャスト弱フラッシュナックル ＞ SA1。','10回中8回以上完走する。',20,'SAゲージなし版と比較する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-drev-guard-sa3','【確反】Dリバガード→SA3','punish','Dリバ反撃からSA3リーサルへ繋ぐ','advanced','ドライブリバーサルガード ＞ しゃがみ中P ＞ Cラッシュ ＞ 4強K ＞ しゃがみ強P ＞ ジャスト中フラッシュナックル ＞ ジャスト弱フラッシュナックル ＞ SA3。','10回中8回以上完走する。',20,'リーサル時のみ選択する基準を作る','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-perfect-knuckle-20-streak','【精度】ジャスト中→ジャスト弱ナックル20本','execution_timing','高頻度コンボに必要なPerfect Knuckle連続精度を上げる','intermediate','しゃがみ強P ＞ ジャスト中フラッシュナックル ＞ ジャスト弱フラッシュナックルを連続反復する。','20回中16回以上、両方ジャストで繋ぐ。早押し/遅押しを別記録する。',40,'16/20達成後はランダム始動から同精度を維持する','https://takukakugamer.com/sf6-luke-combo/'),
('luke','luke-lib-knuckle-route-choice','【判断】ジャスト失敗時ルート切替','decision_combo','Perfect失敗時にコンボを落とさず短縮する判断を練習する','advanced','中フラッシュナックルの通常/ジャストを混ぜ、成功時は通常ルート、失敗時は成立する短縮ルートへ即座に切り替える。','20回中15回以上、失敗を認識してコンボを落とさない。',30,'実戦ヒット確認と統合する','https://takukakugamer.com/sf6-luke-combo/'),

-- Juri +15
('juri','juri-lib-5mp-2mp-mfuhajin','【コンボ】立ち中P→2中P→中風破刃','combo','中P始動の短いストック回収ルートを固定する','beginner','立ち中P ＞ しゃがみ中P ＞ 中風破刃。','左右10回ずつ、8割以上完走する。',20,'ガード時は出し切らない確認へ進む','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-tc-sa1','【コンボ】中P→4強P→強P→SA1','combo','ターゲットコンボからSA1へ繋ぐ','intermediate','立ち中P ＞ 4強P ＞ 強P ＞ SA1。','10回中8回以上SA1まで完走する。',20,'SAを使わない締めと比較する','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-5mk1-od-ankensatsu','【コンボ】立ち中K1段→OD暗剣殺','combo','中K単発確認からOD技へ繋ぐ','advanced','立ち中K1段目 ＞ OD暗剣殺 ＞ 6中P ＞ 中風破刃。','ヒット/ガードを混ぜ、ヒット時のみOD暗剣殺へ20回中15回以上成功する。',30,'ストック有無で締めを切り替える','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-crmk-cdr-hp','【コンボ】中足Cラッシュ→中P→強P','combo','中足ラッシュの基本火力ルートを増やす','intermediate','しゃがみ中K ＞ Cラッシュ ＞ 立ち中P ＞ 立ち強P ＞ 強風破刃 ＞ 強天穿輪。','左右10回ずつ8割以上完走する。',20,'起き攻め重視締めと比較する','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-crmk-cdr-2hp','【コンボ】中足Cラッシュ→2強Pルート','combo','中足ラッシュから別始動補正のルートを固定する','advanced','しゃがみ中K ＞ Cラッシュ ＞ しゃがみ強P ＞ 立ち中P ＞ しゃがみ中P ＞ 中風破刃。','10回中8回以上完走する。',20,'SA締めへ分岐する','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-6hp2-od-ankensatsu','【コンボ】6強P2段→OD暗剣殺','combo','前強PヒットからOD技へ繋ぐ','intermediate','6強P2段目 ＞ OD暗剣殺 ＞ 6中P ＞ 中風破刃。','10回中8回以上完走する。',20,'ガード時にODを出さない確認を付ける','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-jmp-air-shikusen','【空対空コンボ】J中P→疾空閃','anti_air_conversion','空対空ヒットから必殺技へ変換する','intermediate','ジャンプ中P空対空 ＞ 疾空閃/派生。','ダミー前ジャンプを20回再生し、15回以上空対空ヒット後に変換する。',30,'高さ違いで成立する派生を記録する','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-jhk-hp-fuha-dp','【コンボ】J強K→立ち強P→強風破→天穿輪','combo','飛び込みが通った時の基本火力を固定する','beginner','ジャンプ強K ＞ 立ち強P ＞ 強風破刃 ＞ 強天穿輪。','左右10回ずつ8割以上完走する。',20,'OD暗剣殺版と比較する','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-jhk-hp-od-ankensatsu','【コンボ】J強K→強P→OD暗剣殺','combo','飛び込みからOD技を使った展開を覚える','advanced','ジャンプ強K ＞ 立ち強P ＞ OD暗剣殺 ＞ 6中P ＞ 中風破刃。','10回中8回以上完走する。',20,'ストック回収後の起き攻めへ進む','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-crossup-jmk','【コンボ】めくりJ中K→中P→2中P','combo','めくりヒット時の基本変換を固定する','beginner','めくりジャンプ中K ＞ 立ち中P ＞ しゃがみ中P ＞ 中風破刃。','左右10回ずつ8割以上完走する。',20,'ガード時の投げ/シミーへ分岐する','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-drev-punish-5mp','【確反】Dリバガード→立ち中P PC','punish','ドライブリバーサルガード後のPC反撃を固定する','intermediate','ドライブリバーサルガード ＞ 立ち中Pパニッシュカウンター ＞ 立ち強P ＞ 強風破刃 ＞ 強天穿輪。','録画Dリバ10回に対して8回以上完走する。',20,'OD暗剣殺版へ進む','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-drev-punish-od-ankensatsu','【確反】Dリバガード→OD暗剣殺','punish','Dリバ反撃でDriveを使って展開を伸ばす','advanced','ドライブリバーサルガード ＞ 立ち中P PC ＞ 立ち強P ＞ OD暗剣殺 ＞ 6中P ＞ 中風破刃。','10回中8回以上完走する。',20,'Drive残量を見てノーゲージ版へ切り替える','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-big-punish-dr-6hp','【確反】生DR6強P PC→暗剣殺','punish','大きな隙へ生DRを使った高火力PCを入れる','advanced','生ドライブラッシュ ＞ 6強Pパニッシュカウンター ＞ 立ち強P ＞ 暗剣殺 ＞ 立ち弱K ＞ 強天穿輪。','大きな隙の技を10回録画し8回以上完走する。',20,'SAゲージがある場合のリーサルへ分岐する','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-dr-overhead','【コンボ】生DR中段→中P→2中P','combo','生DR中段が通った時の基本追撃を固定する','intermediate','生ドライブラッシュ ＞ 6中P ＞ 立ち中P ＞ しゃがみ中P ＞ 中風破刃。','ランダムガードで中段ヒット時のみコンボを20回中15回以上成功する。',30,'ガード時の投げ/打撃継続へ進む','https://takukakugamer.com/sf6-juri-combo/'),
('juri','juri-lib-2hk-normal-plus32','【起き攻め】大足通常ヒット+32→前ステ+10','oki','大足通常ヒット後の打撃投げを固定する','intermediate','しゃがみ強K通常ヒット(+32) ＞ 前方ステップ(+10) ＞ 投げ / 立ち中P / 後ろ歩き。','各択10回、相手4F/投げ抜け/ジャンプへの結果を記録する。',30,'CH/PC時は+47専用Trainingへ切り替える','https://takukakugamer.com/sf6-juri-setup/')
)
insert into trainings(
  slug,name,training_type,purpose,level,duration_minutes,player_character_id,
  recording_instructions,playback_settings,method,success_criteria,recommended_reps,next_step,
  valid_from_patch_id,verification_status,content_kind,status
)
select d.slug,d.name,d.training_type,d.purpose,d.level,10,c.id,
       case when d.training_type in ('oki','oki_meaty','safe_jump','setup','punish','pressure','anti_air_conversion') then '相手側に対象行動を録画し、通常/後方受け身・4F・投げ・無敵技・DI等を必要に応じて切り替える。' else null end,
       case when d.training_type in ('oki','oki_meaty','safe_jump','setup','pressure') then '複数防御行動をランダム再生し、成立条件と読み合いを分離する。' else null end,
       d.method,d.success_criteria,d.reps,d.next_step,ctx.patch_id,'reviewed','training','draft'
from data d
join characters c on c.slug=d.character_slug
cross join ctx
on conflict (slug) do nothing;

-- Every added drill receives the current community guide, CAPCOM patch, and current frame source.
with maps(character_slug,guide_url,official_url,frame_url) as (
values
('jp','https://takukakugamer.com/sf6-jp-setup/','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp','https://ultimateframedata.com/sf6/jp'),
('ken','https://takukakugamer.com/sf6-ken-combo/','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ken','https://ultimateframedata.com/sf6/ken'),
('luke','https://takukakugamer.com/sf6-luke-combo/','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/luke','https://ultimateframedata.com/sf6/luke'),
('juri','https://takukakugamer.com/sf6-juri-combo/','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/juri','https://ultimateframedata.com/sf6/juri')
), selected as (
 select tr.id,tr.slug,c.slug as character_slug
 from trainings tr join characters c on c.id=tr.player_character_id
 where tr.slug like 'jp-lib-%' or tr.slug like 'ken-lib-%' or tr.slug like 'luke-lib-%' or tr.slug like 'juri-lib-%'
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',x.id,s.id,'supporting','Phase23 current training library evidence'
from selected x
join maps m on m.character_slug=x.character_slug
join sources s on s.url in (m.guide_url,m.official_url,m.frame_url)
on conflict(entity_type,entity_id,source_id) do nothing;

-- Ken and Juri setup-specific drills also get the dedicated setup guide.
with setup_maps(character_slug,url) as (
 values ('ken','https://takukakugamer.com/sf6-ken-setup/'),('juri','https://takukakugamer.com/sf6-juri-setup/')
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',tr.id,s.id,'supporting','Dedicated current setup guide'
from trainings tr
join characters c on c.id=tr.player_character_id
join setup_maps m on m.character_slug=c.slug
join sources s on s.url=m.url
where (tr.slug like 'ken-lib-%' or tr.slug like 'juri-lib-%')
  and tr.training_type in ('oki','oki_meaty','safe_jump','setup','pressure')
on conflict(entity_type,entity_id,source_id) do nothing;
