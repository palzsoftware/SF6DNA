-- Phase23 practical Training batch 04.
-- Character-specific drills based on current official movelists/current frame data.
-- reviewed/draft only; no verified/published promotion.

with cp as (select id from public.patches where is_current=true order by created_at desc limit 1),
rows(char_slug,slug,name,training_type,purpose,level,duration_minutes,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step) as (
values
-- Cammy
('cammy','cammy-practical-cannon-spike-aa','キャミィ キャノンスパイク対空','anti_air','弱/中/強キャノンスパイクを距離に応じて対空で使う。','beginner',7,'ダミーに正面ジャンプ、遠めジャンプ、地上待機を記録。','ランダム再生。入力履歴ON。','CPU OFF。','飛びだけを見てキャノンスパイク。近距離と遠距離で強度を変え、地上待機には振らない。','20試行で16回以上対空し、地上待機への暴発3回以下。',20,'キャノンストライクを混ぜた空対空/地対空判断へ進む。'),
('cammy','cammy-practical-spin-knuckle-projectile','キャミィ アクセルスピンナックル弾抜け','projectile_response','飛び道具に対してアクセルスピンナックルを距離別に選ぶ。','intermediate',8,'ダミーに飛び道具、前歩き、何もしないを記録。','ランダム再生。入力履歴ON。','CPU OFF。','飛び道具時だけ弱/中/強またはODアクセルスピンナックルを選択。届かない距離では無理に出さない。','20試行で弾抜け成功14回以上、地上待機への誤発動3回以下。',20,'SA3弾抜けとの使い分けへ進む。'),
('cammy','cammy-practical-cannon-strike-spacing','キャミィ キャノンストライク高さ・間合い管理','spacing','キャノンストライクを低め/先端で当て、反撃を受けにくい距離感を身につける。','intermediate',8,'ダミーをガード固定。距離マーカー代わりに位置を3段階保存。','ガード固定。フレーム表示ON。','CPU OFF。','同じジャンプ軌道からキャノンストライクを高さと距離を変えて各10回ガードさせる。','30回で近すぎ/高すぎ/適正を分類し、適正距離を左右で再現できる。',30,'ヒット時コンボ、ガード時投げ/打撃へ分岐する。'),
('cammy','cammy-practical-crhp-plus-pressure','キャミィ しゃがみ強P有利から打撃・投げ','pressure','ガード有利のしゃがみ強P後に打撃/投げ/シミーを使い分ける。','intermediate',8,'しゃがみ強Pをガードさせ、ダミーに4F、投げ抜け、無敵技を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','しゃがみ強P後に立ち中P系の打撃、投げ、後ろ歩きを各10回。','30回で4Fへの打撃勝ち、投げ抜け空振り、無敵ガードを区別して記録できる。',30,'ラッシュ通常技から同じ三択へ接続する。'),
-- Dhalsim
('dhalsim','dhalsim-practical-fire-arch-zoning','ダルシム ヨガファイア/アーチ撃ち分け','zoning','地上進行とジャンプに対してヨガファイアとヨガアーチを使い分ける。','beginner',8,'ダミーに前歩き、前ジャンプ、待機を記録。','ランダム再生。入力履歴ON。','CPU OFF。','前歩きにはヨガファイア系、ジャンプ軌道にはヨガアーチ系を選び、待機時は位置調整。','20試行で16回以上狙った軌道を選択。',20,'強度差とホールドを追加する。'),
('dhalsim','dhalsim-practical-yoga-blast-aa','ダルシム ヨガブラスト対空','anti_air','近〜中距離ジャンプへヨガブラストを反応で出す。','intermediate',7,'ダミーに前ジャンプ、空ジャンプ、地上前歩きを記録。','ランダム再生。入力履歴ON。','CPU OFF。','飛びにだけ弱/中/強ヨガブラスト。軌道を見て強度を変える。','20試行で15回以上対空、地上への暴発3回以下。',20,'通常技対空との距離分担へ進む。'),
('dhalsim','dhalsim-practical-teleport-escape','ダルシム ヨガテレポート位置入れ替え','escape','端付近から前方/後方テレポートを状況で使い分ける。','intermediate',10,'自分を端付近。ダミーに前歩き、ジャンプ、待機、長い通常技を記録。','ランダム再生。','CPU OFF。','相手の前進に対し安全を確認して前方/後方テレポート。危険時はガードを選ぶ。','20局面で無理なテレポート被弾5回以下、位置入れ替え成功10回以上。',20,'空中テレポートを追加する。'),
('dhalsim','dhalsim-practical-slide-spacing','ダルシム スライディング先端管理','spacing','弱/中/強スライディング系通常技を距離で使い分ける。','intermediate',8,'ダミーをガード固定。近/中/遠の3距離を用意。','ガード固定。フレーム表示ON。','CPU OFF。','各距離でしゃがみ弱K/中K/強Kを試し、届く距離と反撃を受ける距離を記録。','左右3距離で安全/危険を再現し、20回中16回以上狙った距離で当てる。',20,'飛び・DIを混ぜた地上戦へ進む。'),
-- Guile
('guile','guile-practical-just-boom','ガイル ジャストソニックブーム入力','charge_execution','通常ソニックとジャストソニックを意図して出し分ける。','intermediate',8,'ダミーはガード固定。入力履歴ON。','通常再生。入力履歴・フレーム表示ON。','CPU OFF。','弱/中/強ソニックブームを各5回、その後ジャスト版を各5回。','ジャスト版15回中12回以上成功し、失敗を早押し/遅押しで分類。',30,'歩き・しゃがみを挟んでも溜めを維持する。'),
('guile','guile-practical-boom-somersault-cycle','ガイル ソニック→サマー対空循環','zoning_anti_air','ソニックで地上を動かし、飛びをサマーソルトで落とす基本循環を作る。','beginner',10,'ダミーに前歩き、前ジャンプ、パリィ、待機を記録。','ランダム再生。','CPU OFF。','ソニックを撃った後も下溜めを作り、飛びだけサマーソルト。地上にはソニック/通常技。','30局面で飛び被弾20%以下、無意味なサマー暴発3回以下。',30,'ソニックブレイドを追加する。'),
('guile','guile-practical-sonic-blade-cross','ガイル ソニックブレイド→ソニッククロス','projectile_setup','ソニックブレイドを置き、ソニッククロスへ繋ぐ操作を安定させる。','intermediate',8,'ダミーに前歩き/ジャンプ/ガードを記録。','ランダム再生。','CPU OFF。','距離を変えながら弱/中/強ソニックブレイド→対応ソニッククロスを左右各10回。','20回中18回以上クロスまで成立し、相手の飛びには対空へ切り替えられる。',20,'OD版と通常版のコスト差を比較する。'),
('guile','guile-practical-sa1-direction','ガイル SA1上下撃ち分け','super_decision','横ソニックハリケーンと上ソニックハリケーンを状況で選ぶ。','intermediate',7,'ダミーに地上大技、前ジャンプ、待機を別々に記録。','ランダム再生。入力履歴ON。','CPU OFF。','地上確反には横、飛び/空中状況には上を選択。無理な場面では使わない。','20試行で正しい方向選択16回以上。',20,'リーサル判断へ組み込む。'),
-- Kimberly
('kimberly','kimberly-practical-spray-can-setup','キンバリー 細工手裏剣設置→起き攻め','resource_setup','細工手裏剣を設置してから打撃/投げ/様子見へ移る手順を固定する。','intermediate',10,'ダミーをガード固定後、起き上がり4F/投げ/無敵を記録。','ランダム再生。','CPU OFF。','ダウンを取った後に弱/中/強細工手裏剣を設置し、距離に応じて打撃/投げ/様子見。','20局面で設置ミス2回以下、設置後の目的を毎回説明できる。',20,'乱れ細工手裏剣を追加する。'),
('kimberly','kimberly-practical-run-branches','キンバリー 疾駆け派生使い分け','mixup','疾駆けから急停止/影すくい/首狩り等を意図して出し分ける。','intermediate',10,'ダミーをガード固定。4F/ジャンプ/投げを別スロットに記録。','ランダム再生。入力履歴ON。','CPU OFF。','疾駆け開始後、急停止・影すくい・首狩りを各10回。相手の防御行動を見て分岐。','30回で派生入力ミス3回以下、同じ派生3連続以下。',30,'OD疾駆けを加える。'),
('kimberly','kimberly-practical-bushin-aa','キンバリー 武神旋風脚対空','anti_air','弱/中/強/OD武神旋風脚の対空強度を距離で使い分ける。','beginner',7,'ダミーに近距離飛び、遠距離飛び、地上待機を記録。','ランダム再生。','CPU OFF。','飛びだけを見て武神旋風脚。距離で強度を選び、地上には振らない。','20試行で15回以上対空、地上暴発3回以下。',20,'空対空/荒鵺捻りとの使い分けへ進む。'),
('kimberly','kimberly-practical-plus-normal-pressure','キンバリー 有利通常技から攻め継続','pressure','しゃがみ中Kや立ち強Kのガード有利を使い、打撃/投げの基本を確認する。','intermediate',8,'対象通常技をガードさせ、ダミー4F/投げ抜け/無敵を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','ガード後に小技、投げ、後ろ歩きを各10回。距離で届く/届かないも記録。','30局面で4Fとの関係、投げ間合い、シミー可否を区別できる。',30,'疾駆け停止から同じ読み合いへ接続する。'),
-- Lily
('lily','lily-practical-wind-stock','リリー コンドルウィンド風ストック管理','resource','安全に風ストックを作る場面と、攻め継続を優先する場面を分ける。','beginner',8,'ダミーに前歩き、前ジャンプ、待機を記録。','ランダム再生。','CPU OFF。','距離がある時だけ弱/中/強コンドルウィンドでストック。接近時は対空/ガードへ切り替える。','20局面で無理なストック被弾4回以下、ストック成功10回以上。',20,'ストック有無でスパイアの使い方を分ける。'),
('lily','lily-practical-spire-approach','リリー コンドルスパイア接近','approach','弱/中/強/ODコンドルスパイアを距離に応じて選ぶ。','intermediate',8,'ダミーに後ろ歩き、前歩き、ガード、DIを記録。','ランダム再生。','CPU OFF。','距離を見てスパイア強度を選び、DIが見えたら無理に押し切らない。','20試行で空振り/近すぎの失敗5回以下。',20,'風ストック有りの圧力へ進む。'),
('lily','lily-practical-tomahawk-aa','リリー トマホークバスター対空','anti_air','トマホークバスターを飛びへの対空として安定させる。','beginner',7,'ダミーに正面飛び、空ジャンプ、地上歩きを記録。','ランダム再生。','CPU OFF。','飛びだけに弱/中/強トマホーク。地上行動には振らない。','20試行で16回以上対空、地上暴発3回以下。',20,'OD版の切り返し用途と分ける。'),
('lily','lily-practical-typhoon-strike-throw','リリー メキシカンタイフーン打撃/投げ択','command_throw_mix','コマンド投げと打撃を混ぜ、投げだけに偏らない攻めを作る。','intermediate',8,'ダミーに4F、ジャンプ、投げ抜け、待機を記録。','ランダム再生。','CPU OFF。','密着でメキシカンタイフーン、立ち弱K系打撃、様子見を各10回。','30局面でジャンプに投げを連打せず、打撃/投げを各10回以上選択。',30,'風スパイア接近後に同じ択へ接続する。'),
-- M. Bison
('m-bison','bison-practical-psycho-crusher-projectile','ベガ ODサイコクラッシャー弾対応','projectile_response','飛び道具に対してODサイコクラッシャーを狙う判断を練習する。','intermediate',8,'ダミーに飛び道具、待機、前歩きを記録。','ランダム再生。','CPU OFF。','飛び道具を確認した時だけODサイコクラッシャー。届かない距離ではガード/パリィ。','20試行で弾への正答14回以上、待機への誤発動3回以下。',20,'SAによる弾対応と比較する。'),
('m-bison','bison-practical-devil-reverse-spacing','ベガ デビルリバース着地位置調整','air_approach','デビルリバースの軌道・着地位置を変え、同じ飛び方に偏らない。','intermediate',8,'ダミーに対空通常技、ガード、前歩きを記録。','ランダム再生。','CPU OFF。','シャドウライズからデビルリバース/ヘッドプレス系を距離で使い分け、着地位置を3種類作る。','20回で同じ軌道3連続以下、対空へ突っ込む失敗5回以下。',20,'OD版を加える。'),
('m-bison','bison-practical-plus-normal-pressure','ベガ 立ち強P/イビルニー有利攻め','pressure','ガード有利技から小技/投げ/様子見を使い分ける。','intermediate',8,'立ち強Pまたはイビルニーをガードさせ、4F/投げ/無敵を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','ガード後に小技、投げ、後ろ歩きを各10回。','30局面で暴れ潰し/投げ/無敵ガードを分類できる。',30,'ラッシュから有利技へ接続する。'),
('m-bison','bison-practical-knee-spacing','ベガ ダブルニープレス強度・間合い','spacing','弱/中/強ダブルニープレスを距離で使い分ける。','intermediate',8,'ダミーをガード固定。近/中/遠3距離を保存。','ガード固定。フレーム表示ON。','CPU OFF。','各距離で弱/中/強ダブルニープレスを試し、空振り/近すぎ/適正を記録。','左右各距離で適正強度を再現し、20回中16回以上狙った距離で当てる。',20,'OD版をコンボ専用として分離する。'),
-- Mai
('mai','mai-practical-fan-stock-cycle','不知火舞 花蝶扇→焔ストック運用','resource_projectile','花蝶扇とSA1による焔ストックを意識し、ストック有無で行動を変える。','intermediate',10,'ダミーに前歩き、ジャンプ、パリィ、待機を記録。','ランダム再生。','CPU OFF。','通常/ホールド花蝶扇で地上を制御し、SA1使用後は強化版花蝶扇/必殺技を選択。','30局面でストック有無を見失わず、同じ弾3連続以下。',30,'OD花蝶扇とDrive残量を加える。'),
('mai','mai-practical-ryuenjin-aa','不知火舞 飛翔龍炎陣対空','anti_air','弱/中/強飛翔龍炎陣を対空で使い分ける。','beginner',7,'ダミーに近/遠ジャンプ、地上待機を記録。','ランダム再生。','CPU OFF。','飛びだけに飛翔龍炎陣。距離で強度を選択。','20試行で16回以上対空、地上暴発3回以下。',20,'J中P空対空との距離分担へ進む。'),
('mai','mai-practical-musasabi-confirm','不知火舞 飛燕連脚→ムササビ確認','hit_confirm','弱K連係ヒット時にムササビの舞まで繋ぎ、ガード時は止める。','beginner',8,'ダミーGuard Random。','Random Guard。入力履歴ON。','CPU OFF。','弱K・弱K・弱Kまで入力し、ヒット時だけムササビの舞。','20回中18回以上正しく分岐し、ガード時ムササビ暴発2回以下。',20,'めくりJ中K始動を追加する。'),
('mai','mai-practical-od-fan-hold-pressure','不知火舞 OD花蝶扇ホールド攻め','projectile_pressure','OD花蝶扇ホールドをガードさせた後の打撃/投げを練習する。','intermediate',8,'ダミーに4F、投げ、パリィを記録。','ランダム再生。フレーム表示ON。','CPU OFF。','OD花蝶扇ホールドをガードさせ、前進して打撃/投げ/様子見を各10回。','30回で弾に重なって攻め、無理な投げ/打撃を分類できる。',30,'焔ストック強化版も比較する。'),
-- Manon
('manon','manon-practical-medal-throw-cycle','マノン メダル獲得→投げ圧更新','resource_command_throw','マネージュ・ドレ/ランヴェルセでメダルを上げ、メダル数に応じて投げ期待値を意識する。','beginner',8,'ダミーに待機、ジャンプ、4Fを記録。','ランダム再生。','CPU OFF。','密着で打撃とマネージュ・ドレを混ぜ、成立時のメダル増加を確認。ジャンプには投げを連打しない。','30局面で投げ/打撃を各10回以上選び、現在メダル数を毎回把握。',30,'ランヴェルセを含むメダル獲得ルートへ進む。'),
('manon','manon-practical-reverence-plus','マノン レベランス有利攻め','pressure','レベランスのガード有利から打撃/投げを使い分ける。','intermediate',8,'レベランスをガードさせ、ダミー4F/ジャンプ/無敵を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','レベランス後に小技、マネージュ・ドレ、様子見を各10回。','30局面で4Fへの結果、ジャンプへの結果、無敵ガードを分類。',30,'ラッシュレベランスから同じ択へ。'),
('manon','manon-practical-rond-point-aa','マノン ロン・ポワン対空/コンボ締め','anti_air','ロン・ポワンの強度を飛びの高さ・距離で使い分ける。','intermediate',7,'ダミーに近/遠ジャンプ、地上待機を記録。','ランダム再生。','CPU OFF。','飛びに弱/中/強ロン・ポワン。地上待機には振らない。','20試行で15回以上適切に対空、地上暴発3回以下。',20,'空対空との距離分担へ進む。'),
('manon','manon-practical-degage-spacing','マノン デガジェ強度・間合い','spacing','弱/中/強/ODデガジェを用途と距離で分ける。','intermediate',8,'ダミーをガード固定。近/中/遠3距離。','ガード固定。フレーム表示ON。','CPU OFF。','各距離でデガジェ強度を試し、届く/空振り/反撃されるを記録。','20回中16回以上、狙った距離で適切な強度を選べる。',20,'通常技差し合いからデガジェへ繋ぐ。'),
-- Rashid
('rashid','rashid-practical-whirlwind-charge','ラシード ワールウインド・ショット溜め段階','projectile_charge','ワールウインド・ショットの通常/溜め段階を意図して使い分ける。','intermediate',8,'ダミーに前歩き、ジャンプ、待機を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','通常、短溜め、長溜めを各10回。相手が飛んだら溜めを中断して対空。','30回で狙った溜め段階24回以上、飛びへの無防備5回以下。',30,'気流を使う接近へ進む。'),
('rashid','rashid-practical-mixer-aa','ラシード スピニングミキサー対空','anti_air','スピニングミキサーを距離に応じて対空で使う。','beginner',7,'ダミーに正面飛び、遠め飛び、地上待機。','ランダム再生。','CPU OFF。','飛びにだけ弱/中/強スピニングミキサー。地上には振らない。','20試行で16回以上対空、地上暴発3回以下。',20,'OD版の切り返しと分ける。'),
('rashid','rashid-practical-cyclone-branches','ラシード アラビアンサイクロン派生','mixup','アラビアンサイクロンからローリング/ウイング等の派生を使い分ける。','intermediate',10,'ダミーにガード、4F、ジャンプを記録。','ランダム再生。','CPU OFF。','アラビアンサイクロン後、ローリング・アサルト/ウイング・ストローク/何もしないを各10回。','30回で派生ミス3回以下、相手行動に応じて3種類以上選択。',30,'ODサイクロンを追加する。'),
('rashid','rashid-practical-ysaar-follow','ラシード SA2イウサール追従攻め','sa2_pressure','イウサールを盾に前進し、打撃/投げ/対空を切り替える。','advanced',10,'ダミーにガード、前ジャンプ、パリィ、DIを記録。','ランダム再生。','CPU OFF。','イウサール発動後、竜巻と一緒に前進。地上は打撃/投げ、飛びは対空、DIにはDI返し。','20局面で飛び/DIへの対応を各70%以上成功。',20,'気流派生と組み合わせる。'),
-- Terry
('terry','terry-practical-powerwave-aa','テリー パワーウェイブ→ライジング対空','zoning_anti_air','パワーウェイブで地上を動かし、飛びをライジングタックルで落とす。','beginner',10,'ダミーに前歩き、前ジャンプ、パリィ、待機。','ランダム再生。','CPU OFF。','パワーウェイブを撃ち、飛びだけライジングタックル。地上には通常技/再度弾。','30局面で飛び被弾20%以下、ライジング暴発3回以下。',30,'強クラックシュートの接近も混ぜる。'),
('terry','terry-practical-sthp-plus','テリー 立ち強P有利攻め','pressure','立ち強Pガード後の小技/投げ/様子見を練習する。','intermediate',8,'立ち強Pをガードさせ、4F/投げ/無敵を記録。','ランダム再生。フレーム表示ON。','CPU OFF。','立ち強P後にしゃがみ弱P、投げ、後ろ歩きを各10回。','30局面で4Fへの打撃勝ち、投げ、無敵ガードを分類できる。',30,'ラウンドウェイブ有利攻めへ進む。'),
('terry','terry-practical-roundwave-plus','テリー ラウンドウェイブ+5攻め','pressure','ラウンドウェイブガード後の有利を使って打撃/投げを重ねる。','intermediate',8,'通常/ODラウンドウェイブをガードさせ、4F/投げ/無敵を記録。','ランダム再生。','CPU OFF。','ガード後に中技、小技、投げ、様子見を各5回。','20局面で4F暴れを打撃で潰し、無敵読みではガードを選べる。',20,'強パワーチャージ派生ルートから接続する。'),
('terry','terry-practical-sa-route-choice','テリー SA1/SA2/SA3用途分け','super_decision','SA1/SA2/SA3を確反・コンボ・リーサルで選び分ける。','intermediate',8,'ダミーに大技、通常ガード、体力少量の3状況を作る。','ランダム再生。入力履歴ON。','CPU OFF。','状況を見てバスターウルフ、パワーゲイザー、ライジングファングのどれを使うか決定。','20試行で不要なSA使用3回以下、狙ったSA入力ミス2回以下。',20,'SA2派生を含むリーサル練習へ進む。')
), ins as (
 insert into public.trainings(slug,name,training_type,purpose,player_character_id,level,duration_minutes,recording_instructions,playback_settings,cpu_settings,method,success_criteria,recommended_reps,next_step,valid_from_patch_id,verification_status,status)
 select r.slug,r.name,r.training_type,r.purpose,c.id,r.level,r.duration_minutes,r.recording_instructions,r.playback_settings,r.cpu_settings,r.method,r.success_criteria,r.recommended_reps,r.next_step,cp.id,'reviewed','draft'
 from rows r join public.characters c on c.slug=r.char_slug cross join cp
 on conflict(slug) do nothing returning id,slug
)
select count(*) from ins;

-- Link every batch04 drill to the character's current official movelist.
insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',t.id,s.id,'reference','Current official movelist supports move identity; Training method is reviewed editorial guidance, not verified gameplay evidence.'
from public.trainings t
join public.characters c on c.id=t.player_character_id
join lateral (
 select s1.id from public.sources s1
 where s1.url = case c.slug
  when 'cammy' then 'https://www.streetfighter.com/6/ja-jp/character/cammy/movelist'
  when 'dhalsim' then 'https://www.streetfighter.com/6/ja-jp/character/dhalsim/movelist'
  when 'guile' then 'https://www.streetfighter.com/6/ja-jp/character/guile/movelist'
  when 'kimberly' then 'https://www.streetfighter.com/6/ja-jp/character/kimberly/movelist'
  when 'lily' then 'https://www.streetfighter.com/6/ja-jp/character/lily/movelist'
  when 'm-bison' then 'https://www.streetfighter.com/6/ja-jp/character/vega_mbison/movelist'
  when 'mai' then 'https://www.streetfighter.com/6/ja-jp/character/mai/movelist'
  when 'manon' then 'https://www.streetfighter.com/6/ja-jp/character/manon/movelist'
  when 'rashid' then 'https://www.streetfighter.com/6/ja-jp/character/rashid/movelist'
  when 'terry' then 'https://www.streetfighter.com/6/ja-jp/character/terry/movelist'
 end
 order by s1.created_at desc limit 1
) s on true
where t.status='draft' and t.verification_status='reviewed' and t.slug like '%-practical-%'
  and c.slug in ('cammy','dhalsim','guile','kimberly','lily','m-bison','mai','manon','rashid','terry')
on conflict(entity_type,entity_id,source_id) do nothing;
