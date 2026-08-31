-- Phase23: rebuild the eight highest-priority JP matchups as reviewed draft data.
-- No row is published or verified here. Exact spacing/gap/DI/Amnesia interactions remain lab tasks unless the current verified frame data is sufficient.

with ctx as (
  select
    (select id from characters where slug = 'jp') as jp_id,
    (select id from patches where is_current = true order by released_at desc limit 1) as patch_id
),
rows(opponent_slug, suffix, counter_type, title, situation, summary, method, benefit, risk, difficulty, conditions) as (
  values
  ('akuma','approach','approach','JP vs 豪鬼：接近阻止','豪鬼の波動・百鬼・DR・通常ジャンプから接近される場面','豪鬼は地上弾と百鬼系で接近経路を散らせるため、JP側は一つの迎撃だけに固定しない。','豪波動拳／百鬼襲／前歩き／生DR／通常ジャンプを別スロットに記録し、5MP・2MP・2HP・ガード・パリィを距離別に比較する。','百鬼だけを見る、弾だけを見るといった一点読みを減らし、中距離の停止率を上げる。','百鬼派生は分岐と当たり方で有利不利が変化する。未実機の派生間隔やDI可否を確定扱いしない。',4,'2026.08.03以降。2HPは通常ジャンプ対空の候補。百鬼各派生は個別再現が必要。'),
  ('akuma','punish','punish','JP vs 豪鬼：確反候補','豪鬼の必殺技をガードした後','豪波動拳や百鬼派生は距離・派生で反撃可否が変わるため、技名とガード差だけで最大反撃を固定しない。','弱/中/強豪波動拳、金剛灼火、百鬼豪刃、百鬼豪斬をそれぞれガードさせ、JPの4F技・中技・SA候補が実距離で届くか確認する。','「数値上マイナスだが届かない」と「本当に確定」を分離できる。','百鬼豪刃は現行Frameで-4～+5、百鬼豪斬は+2。固定の確反表現は禁止。',3,'現行verified Frameを基準にし、距離別の到達可否はTrainingで確認する。'),
  ('akuma','air','anti_air','JP vs 豪鬼：百鬼・空中軌道対策','百鬼襲、斬空波動拳、通常ジャンプが混ざる場面','通常ジャンプと百鬼系を同じ対空タイミングで処理しない。','通常ジャンプ／斬空波動拳／百鬼襲からの複数派生をランダム再生し、2HP・空中投げ・ガード・後退を比較する。','対空の早出し・空振り・百鬼派生への誤反応を減らす。','百鬼の移動部分は標準的なstartup値がない枝がある。見た目だけで割り込みFを作らない。',4,'対空成功だけでなく、空振り後の被PCも記録する。'),
  ('akuma','corner','defense','JP vs 豪鬼：画面端防御','JPが端を背負い豪鬼の打撃・投げ・百鬼が重なる場面','端ではODアムネジアを自動回答にせず、ガード・Dリバ・パリィ・ジャンプ・ODアムネジアを相手択ごとに比較する。','打撃／通常投げ／シミー／百鬼派生をランダム再生し、防御結果を「確定・相打ち・読み・不成立」に分類する。','同じ防御択の連打を防ぎ、端脱出の再現可能な判断表を作れる。','2026.08.03でODアムネジアの投げ成立後JP硬直が増加。旧パッチの自動後ろ投げ等を前提にしない。',5,'ODアムネジア投げ成立後は別Trainingで現行挙動を確認する。'),
  ('akuma','zoning','zoning','JP vs 豪鬼：弾・設置管理','遠距離で豪波動拳・斬空波動拳とJPの弾/設置が競合する場面','JPは設置固定ではなく、相手の地上弾・空中弾・前進を見て弾、トリグラフ、ヴィーハト、前歩きを切り替える。','豪波動拳3強度、OD豪波動拳、斬空波動拳を録画し、JP側の各遠距離手段を同じ画面位置から比較する。','弾の撃ち合いを目的化せず、画面位置と設置時間を基準に選択できる。','弾強度や相殺後の状況を未確認のまま「勝つ/負ける」と断定しない。',4,'同距離・同ゲージ条件で比較し、相互作用は実機再現後のみ確定する。'),

  ('ken','approach','approach','JP vs ケン：接近阻止','ケンの波動・DR・龍尾脚・迅雷脚から触られる場面','強龍尾脚は現行Frameでガード+1のため、ガード後に自動暴れしない。弱/中/OD/奮迅龍尾脚は別状況として扱う。','波動拳／生DR／弱・中・強・OD龍尾脚／迅雷脚を別スロットで再生し、JPの置き技・2HP・ガード・パリィを比較する。','龍尾脚を一括で処理せず、強度ごとの判断を固定できる。','強龍尾脚+1と、弱-4・中-8・OD-9・奮迅-8を混同しない。距離による反撃可否は別確認。',4,'現行verified Frame使用。龍尾脚の届き方・DI相互作用は実機確認前に断定しない。'),
  ('ken','punish','punish','JP vs ケン：龍尾脚・迅雷の確反候補','龍尾脚や迅雷脚をガードした後','ガード差がマイナスでも距離と派生で反撃結果が変わる。強龍尾脚は+1なので確反対象ではない。','弱/中/OD/奮迅龍尾脚と、弱/中/強/OD迅雷脚・各追加派生を録画し、JPの4F・中技・SAが届く範囲を表にする。','誤確反と暴れ潰し被弾を減らせる。','迅雷は本体と派生のガード差が別。連携の隙間はガード差だけから推測しない。',4,'verified Frame例：弱迅雷-11、中-7、強-2、OD-7、通常派生は-5/-3/-3。実際の割り込みはTrainingで確認。'),
  ('ken','air','anti_air','JP vs ケン：飛び・龍尾脚の見分け','通常ジャンプと龍尾脚を混ぜられる場面','2HPは通常ジャンプ対空候補として使い、龍尾脚には同じ反応を機械的に当てない。','通常ジャンプ、空ジャンプ、各龍尾脚をランダム再生し、2HP・ガード・パリィ・後退の誤反応率を記録する。','通常飛びへの対空を維持しながら龍尾脚への誤2HPを減らす。','龍尾脚を空中攻撃扱いして対空確定と決めつけない。',3,'20回以上、通常飛びと龍尾脚を混合して確認する。'),
  ('ken','corner','defense','JP vs ケン：画面端防御','端で投げ・打撃・迅雷・龍尾脚が重なる場面','端では投げ抜け固定やODアムネジア固定を避け、防御択を相手のレコードごとに比較する。','打撃重ね／通常投げ／シミー／迅雷始動／龍尾脚を混ぜ、ガード・Dリバ・パリィ・ジャンプ・ODアムネジアを評価する。','ケンの端攻めに対して防御の根拠を残せる。','ODアムネジアの投げ成立後は2026.08.03変更後のため、旧有利状況を使わない。',5,'端位置固定。防御結果を確定・相打ち・読み・不成立で記録。'),
  ('ken','zoning','zoning','JP vs ケン：波動と設置','中遠距離で波動拳を盾にケンが前進する場面','JPは波動への反応だけでなく、その後のDR/龍尾脚まで含めて画面位置を管理する。','弱/中/強/OD波動拳と前歩き・DRを混ぜ、トリグラフ・トルバラン・ヴィーハト・前後歩きの選択を比較する。','遠距離で設置だけに固執せず、ケンの接近準備まで見られる。','波動拳のガード差は距離依存表記がある。近距離の数値を遠距離へ一般化しない。',3,'同一画面位置で反復し、弾相互作用は実機確認後に確定。'),

  ('cammy','approach','approach','JP vs キャミィ：接近阻止','DR・アクセルスピンナックル・キャノンストライクで接近される場面','強/ODアクセルスピンナックルは現行Frameでガード+3。ガード後に自動暴れせず、弱/中版と区別する。','前歩き／DR／弱中強ODスピンナックル／通常キャノンストライクを混ぜ、JPの置き技・2HP・ガード・パリィを比較する。','接近手段ごとに止め方を分け、+3状況での誤暴れを減らす。','キャノンストライクは当て方で-6～+5、ODは-3～+7。固定の確反は作らない。',4,'現行verified Frame使用。距離・高さ条件を必ず記録する。'),
  ('cammy','punish','punish','JP vs キャミィ：ガード後の確反候補','スピンナックル・キャノンストライク・フーリガン派生をガードした後','キャミィの空中/突進技は当たり位置でガード差が変動するため、技名だけでは確反を決めない。','弱/中/強/ODスピンナックル、通常/ODキャノンストライク、フーリガン各派生を距離・高さを変えて記録し、JPの最速反撃が届くか確認する。','誤確反と相手の有利継続への暴れを減らせる。','強/ODスピンナックルは+3。フーリガン・リバースエッジは-4～-1、ODレイザーエッジは+2。',4,'数値が範囲表記の技は最悪値/最良値を別々に再現する。'),
  ('cammy','air','anti_air','JP vs キャミィ：ダイブ・フーリガン対空','通常ジャンプ、キャノンストライク、フーリガンが混ざる場面','通常ジャンプには2HPを軸にし、軌道変化技にはガード・空中投げ・後退も比較する。','通常ジャンプ／キャノンストライク／フーリガン→各派生をランダム再生し、JPの回答と空振り後被弾を記録する。','対空入力の固定化を防ぎ、軌道変化への対応を分けられる。','ダイブキックの高さ・距離でフレームが変化。トレモで同じ軌道を再現する。',5,'飛びを落とせたかだけでなく、誤対空回数も集計する。'),
  ('cammy','corner','defense','JP vs キャミィ：画面端防御','端で小技・投げ・シミー・ダイブが重なる場面','ガード継続、投げ抜け、Dリバ、パリィ、ジャンプ、ODアムネジアの期待値を同一レコードで比較する。','打撃／投げ／遅らせ打撃／キャノンストライクをランダム再生し、防御ごとの被弾原因を分類する。','高速な近距離択に対して防御をルール化できる。','投げ読みODアムネジア後は2026.08.03変更済み。旧後ろ投げ確定等は採用しない。',5,'端固定・同ゲージ。20局面以上。'),
  ('cammy','zoning','zoning','JP vs キャミィ：弾・設置とスピンナックル','JPの遠距離行動にキャミィがスピンナックル等を合わせる場面','スピンナックルがJPの各弾/設置へどう作用するかは技ごとに再現し、まとめて「弾抜け」と扱わない。','トルバラン各種、トリグラフ、ヴィーハトに対し弱/中/強/ODスピンナックルを録画し、成立/相打ち/不成立を記録する。','遠距離択の安全圏を技単位で把握できる。','相互作用はフレーム値だけでは確定しない。実機確認前は候補扱い。',4,'画面位置を複数設定し、同じ条件を10回以上再現する。'),

  ('m-bison','approach','approach','JP vs ベガ：接近阻止','ダブルニープレス、シャドウライズ系、DRで接近される場面','ニーの弱/中は-5、強-4だが、接近阻止段階ではガード後確反より「触られる前の距離管理」を優先する。','弱中強ODニー、前歩き、DR、シャドウライズ系をランダム再生し、JPの置き技・2HP・ガード・パリィを比較する。','ベガの複数接近経路に対して中距離の回答を整理できる。','ODニーは-15だが、実距離の反撃可否を別確認。空中派生は軌道で回答が変わる。',4,'サイコマイン有/無を別条件として記録する。'),
  ('m-bison','punish','punish','JP vs ベガ：ニー・サイコクラッシャー確反候補','ニーやサイコクラッシャーをガードした後','通常サイコクラッシャーは現行Frameで大きくマイナス、ODは-3。通常版とOD版を混同しない。','弱/中/強/ODニー、弱/中/強/ODサイコクラッシャーを距離別にガードし、JPの反撃技が届くか記録する。','大きな隙を逃さず、OD版への誤確反を避けられる。','verified Frame：弱/中/強サイコクラッシャーは-20/-20/-23、ODは-3。距離で届かない場合がある。',3,'反撃はガード後の実距離まで確認して確定扱いする。'),
  ('m-bison','air','anti_air','JP vs ベガ：ヘッドプレス・空中派生','シャドウライズからヘッドプレス/派生が来る場面','通常ジャンプ用2HPだけで処理せず、空中派生にはガード・空中投げ・位置入れ替え候補を比較する。','通常ジャンプ、ヘッドプレス、ODヘッドプレス、デビルリバース系をランダム再生し、JP側の回答を記録する。','特殊軌道への誤対空を減らす。','ODヘッドプレスは現行Frameでガード+5～+7。ガード後の暴れを禁止候補として検証する。',5,'軌道・着地点を固定して再現。範囲表記は位置別に記録。'),
  ('m-bison','corner','defense','JP vs ベガ：画面端・マイン有無','端でマイン有/無の攻めを受ける場面','マイン有無を同じ対策表に混ぜず、防御候補を別々に検証する。','マイン無しの打撃/投げ/シミーと、マイン有りの代表連携を別セットで録画し、ガード・Dリバ・パリィ・ジャンプ・ODアムネジアを比較する。','条件付き攻めを整理し、誤った共通回答を減らせる。','mine-dependent variantsは現行DBでも一部review backlog。未確認の爆発連携を確定扱いしない。',5,'サイコマイン状態を必須条件として記録する。'),
  ('m-bison','zoning','zoning','JP vs ベガ：遠距離からの突進監視','JPが弾/設置を行いベガがサイコクラッシャー等で差し込む場面','JPの遠距離行動は相手の突進を見ずに連打せず、画面位置ごとに硬直を比較する。','トルバラン/トリグラフ/ヴィーハト後に、弱中強ODサイコクラッシャーを録画して成立・相打ち・ガードを分類する。','設置の隙へ突進を受ける回数を減らせる。','サイコクラッシャーの対弾性能や成立距離をフレーム値だけで断定しない。',4,'画面位置3段階以上。相互作用は実機再現後に確定。'),

  ('mai','approach','approach','JP vs 不知火舞：接近阻止','花蝶扇、必殺忍蜂、ムササビの舞で接近される場面','舞は地上弾と突進/空中軌道を切り替えるため、JP側は弾処理と対空を別々に見る。','弱中強/OD花蝶扇、必殺忍蜂、ムササビの舞、通常ジャンプをランダム再生し、JPの弾・置き技・2HP・ガードを比較する。','接近経路を分解し、弾を見すぎて空中接近を通す失敗を減らす。','強化版と通常版で性能が異なる。炎ストック状態を混同しない。',4,'炎ストック0/有りを別条件で記録する。'),
  ('mai','punish','punish','JP vs 不知火舞：必殺忍蜂・花蝶扇の確反候補','舞の必殺技をガードした後','通常必殺忍蜂は現行Frameで弱-10、中-12、強-13、OD-12。花蝶扇は距離が離れるため、数値と到達距離を分ける。','必殺忍蜂4種と花蝶扇3強度を距離別にガードし、JPの最速/中距離反撃が届くか確認する。','大きな隙を拾いながら、遠距離弾への無理な反撃を避ける。','花蝶扇は弱-7、中-9、強-11だが弾技。ガード後距離を必ず確認。',3,'強化/ODホールド花蝶扇は別データ。通常版の確反表へ混ぜない。'),
  ('mai','air','anti_air','JP vs 不知火舞：ムササビ・空中軌道','通常ジャンプとムササビの舞が混ざる場面','ムササビは当たり位置でガード差が変動するため、通常飛び用対空と同じタイミングに固定しない。','通常ジャンプ、通常/ODムササビ、空中SA2候補を別スロットで再生し、2HP・空中投げ・ガード・後退を比較する。','特殊空中軌道への対空精度を上げる。','通常/ODムササビは現行Frameで-7～+1。高さ・距離で結果が変わる。',5,'高さを変えた最低3パターンを保存する。'),
  ('mai','corner','defense','JP vs 不知火舞：画面端・炎ストック','端で炎ストックを使った弾/打撃/投げを受ける場面','炎ストック有無とODホールド花蝶扇等の有利状況を分け、防御候補を比較する。','通常状態と炎ストック有りを別セットにし、ガード・Dリバ・パリィ・ジャンプ・ODアムネジアの結果を記録する。','強化状態の攻めに通常状態の知識を誤適用するのを防ぐ。','強化ODホールド花蝶扇は+12など大きく有利。未確認の割り込みを作らない。',5,'炎ストック数、Drive、SAを記録する。'),
  ('mai','zoning','zoning','JP vs 不知火舞：花蝶扇とJP遠距離択','花蝶扇とJPのトルバラン/トリグラフ/設置が競合する場面','通常花蝶扇とOD/強化版で弾特性が異なるため、相殺関係を一括化しない。','弱中強花蝶扇、OD花蝶扇、強化版を分け、JPの各遠距離行動との相互作用を画面位置別に記録する。','弾戦で「どれなら撃てるか」を条件付きで整理できる。','現行Frame notesでは通常扇は低優先度で衝突時に消える等の特性があるが、JP各技との具体結果は実機確認する。',4,'同一画面位置・同一ストック条件で10回以上再現。'),

  ('luke','approach','approach','JP vs ルーク：接近阻止','サンドブラスト、DR、前歩きから中距離へ入られる場面','ルークの弾とDRを同時に監視し、JPは遠距離技だけでなく中距離の置き/ガードも用意する。','弱中強/ODサンドブラスト、前歩き、生DR、通常ジャンプを混ぜ、5MP・2MP・2HP・ガード・パリィを比較する。','弾を見ている間にDRを通す失敗を減らす。','Sand Blastは強度ごとに発生・硬直差が異なる。弾後の固定行動を作らない。',3,'画面位置別に20回以上。'),
  ('luke','punish','punish','JP vs ルーク：無敵技・ナックル確反候補','ライジングアッパーやフラッシュナックルをガードした後','ライジングアッパーは現行Frameで大きなマイナス。フラッシュナックルは強度/チャージ状態を分ける。','弱中強ODライジングアッパー、弱中強/ODフラッシュナックルを記録し、ノーゲージ/SA込みのJP反撃候補を比較する。','大きな反撃機会を逃さず、チャージ状態の混同を防ぐ。','verified Frame：Risingは-27/-29/-33/OD-40。Flash Knuckleは弱-12、中-8、強-4。ODは複合状態。',3,'チャージ/Perfectは別技状態として記録し、未確認値を通常版へ流用しない。'),
  ('luke','air','anti_air','JP vs ルーク：通常飛び対空','ルークが弾/DRに加えて通常ジャンプを混ぜる場面','通常ジャンプを見た時だけ2HPを出し、地上DRへの誤対空を抑える。','前歩き、生DR、通常ジャンプ、Sand Blastをランダム再生し、飛びのみ2HP/空中投げを選ぶ。','複合状況での対空反応を維持できる。','地上行動への2HP空振りは大きなリスク。成功率と誤反応を両方記録。',3,'20回中16回以上の正しい分類を目安にする。'),
  ('luke','corner','defense','JP vs ルーク：画面端防御','端で打撃・投げ・シミー・OD無敵が絡む場面','防御は投げ抜け固定にせず、ガード/Dリバ/パリィ/ジャンプ/ODアムネジアを比較する。','ルーク側に打撃、投げ、遅らせ打撃を記録し、JP側防御の勝敗を分類する。','近距離の読み合いを再現可能な形で残せる。','ODアムネジアの投げ成立後は2026.08.03現行仕様で確認する。',4,'端固定。最低20局面。'),
  ('luke','zoning','zoning','JP vs ルーク：サンドブラストと設置','中遠距離でSand BlastとJPの遠距離択が競合する場面','Sand Blastの強度で発生が14/17/20、OD16と異なるため、JPの設置可能時間を一括で決めない。','各Sand BlastとJPのトルバラン/トリグラフ/ヴィーハトを同距離で比較し、被弾・相打ち・ガード・設置成立を記録する。','遠距離行動を画面位置と弾強度で選べる。','相殺/弾抜けなどの具体相互作用は実機で確認する。',4,'同距離・同ゲージで各10回。'),

  ('juri','approach','approach','JP vs ジュリ：DR・歳破衝からの接近阻止','ジュリの速いDRと歳破衝を盾に接近される場面','歳破衝とDRを同時に見るため、JPは設置だけに固定せず中距離技・ガードを混ぜる。','歳破衝／前歩き／生DR／通常ジャンプをランダム再生し、5MP・2MP・2HP・ガード・パリィを比較する。','DRだけを止めようとして弾を受ける、弾だけ見てDRを通す失敗を減らす。','歳破衝のガード差は距離で変動表記。固定の確反を作らない。',4,'風破ストック有無も記録する。'),
  ('juri','punish','punish','JP vs ジュリ：天穿輪・風破刃確反候補','ジュリの無敵技/必殺技をガードした後','OD/中/強天穿輪は大きな反撃機会。弱天穿輪・風破刃は距離と派生状況を確認する。','弱中強OD天穿輪と弱中強OD風破刃をガードし、JPの距離別反撃候補を固定する。','無敵技ガード後の最大反撃を安定させる。','verified Frame：OD天穿輪-48、中/強-37、弱-8。風破刃は弱-4、中-6、強-8、OD-12。',3,'ガード後距離まで確認して確定反撃として採用する。'),
  ('juri','air','anti_air','JP vs ジュリ：飛びとDRの複合反応','DRと通常ジャンプが同時に警戒対象になる場面','飛びには2HP、地上DRには中距離停止候補と役割を分ける。','前歩き／DR／通常ジャンプ／歳破衝をランダム再生し、行動ごとの正答率を記録する。','対空意識を上げてもDR対応を失わない。','2HPの地上空振りを失敗として数える。',3,'20回以上のランダム再生。'),
  ('juri','corner','defense','JP vs ジュリ：画面端・風破ストック','端で風破ストックを使った攻めを受ける場面','風破ストック有無を分け、打撃/投げ/歳破衝を含む攻めへ防御手段を比較する。','ストック0/有りの2セットを作り、ガード・Dリバ・パリィ・ジャンプ・ODアムネジアを比較する。','相手リソースを見て防御を変える習慣を作れる。','風破派生の具体的な連携間隔は未検証なら確定扱いしない。',5,'ストック数とDriveを記録する。'),
  ('juri','zoning','zoning','JP vs ジュリ：歳破衝とJP遠距離択','歳破衝を盾にジュリが距離を詰める場面','JPは歳破衝だけを処理せず、その後のDR/前歩きまで含めて遠距離択を選ぶ。','歳破衝、OD歳破衝、前歩き、DRを混ぜ、トルバラン・トリグラフ・ヴィーハト・前歩きの結果を記録する。','弾処理後の接近まで一連で対策できる。','OD歳破衝は現行Frameで-2。弾相互作用や設置成立は実機確認する。',4,'同画面位置から10回以上。'),

  ('rashid','approach','approach','JP vs ラシード：風・接近阻止','ワールウインド・ショット、DR、アラビアンサイクロン等から接近される場面','ラシードは溜めワールウインドで有利状況を作れるため、弾を見てからの固定暴れを避ける。','ワールウインド3段階、弱中強/ODサイクロン、前歩き、DR、通常ジャンプをランダム再生し、JPの置き技・2HP・ガード・パリィを比較する。','風を伴う接近を行動単位で分解できる。','ワールウインドは現行Frameでガード-9/0/+8。溜め段階を混同しない。',4,'風状態/溜め段階を必ず記録する。'),
  ('rashid','punish','punish','JP vs ラシード：イーグル・ミキサー確反候補','イーグルスパイクやスピニングミキサーをガードした後','イーグルスパイク各種とOD/中/強ミキサーは現行Frame上大きな反撃機会。弱ミキサーは-3なので別扱い。','弱中強ODイーグルスパイク、弱中強ODスピニングミキサーをガードし、JPのノーゲージ/SA反撃を距離別に確認する。','大きな反撃機会を安定して回収できる。','verified Frame：イーグル各種-36、ODミキサー-42、中-45、強-55、弱ミキサー-3。',3,'実距離で技が届くことを確認してから最大反撃として固定する。'),
  ('rashid','air','anti_air','JP vs ラシード：特殊軌道・飛び対策','通常ジャンプと特殊移動/空中軌道が混ざる場面','通常飛びは2HP候補、特殊軌道はガード・空中投げ・位置調整を含めて比較する。','通常ジャンプ、イーグルスパイク、特殊移動からの接近を別スロットに記録し、JP側回答を分類する。','通常対空を維持しつつ特殊軌道への誤反応を減らす。','特殊移動の全枝を標準ジャンプと同じ発生として扱わない。',5,'空振り後被弾も記録する。'),
  ('rashid','corner','defense','JP vs ラシード：画面端・風あり防御','端で風/SA2等を背景に攻められる場面','風あり/なしを分け、防御候補を同じ条件で比較する。','通常の打撃/投げセットと、風を使った代表攻めを別録画し、ガード・Dリバ・パリィ・ジャンプ・ODアムネジアを評価する。','強化状態を見て防御を切り替えられる。','SA2や風連携の隙間は映像だけで確定しない。実機未検証は候補のまま。',5,'風状態、SA、Drive、画面端位置を記録。'),
  ('rashid','zoning','zoning','JP vs ラシード：ワールウインドと設置','遠距離のワールウインド・ショットとJP遠距離択が競合する場面','ワールウインドは溜め段階でガード差が-9/0/+8へ変化するため、溜めを見ずに同じ行動を返さない。','3段階のワールウインドを同距離から撃たせ、トルバラン・トリグラフ・ヴィーハト・前歩きの結果を記録する。','弾戦で相手の溜め時間を判断材料にできる。','具体的な弾相殺や風発生後のJP設置可否は実機確認が必要。',4,'各溜め段階を10回以上。')
),
inserted as (
  insert into counters (
    slug, defender_character_id, opponent_character_id, target_type, target_id,
    situation, counter_type, title, summary, method, benefit, risk, difficulty,
    conditions, valid_from_patch_id, verification_status, content_kind, status
  )
  select
    'jp-vs-' || r.opponent_slug || '-' || r.suffix,
    ctx.jp_id,
    o.id,
    'matchup',
    null,
    r.situation,
    r.counter_type,
    r.title,
    r.summary,
    r.method,
    r.benefit,
    r.risk,
    r.difficulty,
    r.conditions,
    ctx.patch_id,
    'reviewed',
    'strategy',
    'draft'
  from rows r
  cross join ctx
  join characters o on o.slug = r.opponent_slug
  on conflict (slug) do update set
    defender_character_id = excluded.defender_character_id,
    opponent_character_id = excluded.opponent_character_id,
    target_type = excluded.target_type,
    situation = excluded.situation,
    counter_type = excluded.counter_type,
    title = excluded.title,
    summary = excluded.summary,
    method = excluded.method,
    benefit = excluded.benefit,
    risk = excluded.risk,
    difficulty = excluded.difficulty,
    conditions = excluded.conditions,
    valid_from_patch_id = excluded.valid_from_patch_id,
    valid_to_patch_id = null,
    verification_status = 'reviewed',
    content_kind = 'strategy',
    status = 'draft',
    updated_at = now()
  returning id, slug, opponent_character_id
)
select count(*) from inserted;

-- Promote the eight parent containers from generic archived candidates into reviewed draft indexes.
with ctx as (
  select (select id from patches where is_current = true order by released_at desc limit 1) as patch_id
), p(opponent_slug, opponent_name) as (
  values
    ('akuma','豪鬼'),('ken','ケン'),('cammy','キャミィ'),('m-bison','ベガ'),
    ('mai','不知火舞'),('luke','ルーク'),('juri','ジュリ'),('rashid','ラシード')
)
update counters co
set
  title = 'JP vs ' || p.opponent_name || ' 対面対策',
  situation = '2026.08.03以降のJP対' || p.opponent_name,
  summary = '接近阻止・確反候補・対空/特殊軌道・画面端防御・弾/設置の5項目を個別Counterへ分解済み。',
  method = '各子CounterのレコードをTrainingで再現し、確定・相打ち・読み・不成立を区別する。数値だけで距離依存の反撃や割り込みを確定しない。',
  benefit = '対戦前確認からトレモ検証まで、対面固有の入口として使用できる。',
  risk = '未実機の距離、連携間隔、DI相互作用、ODアムネジア後状況はreviewedのまま。',
  conditions = '2026.08.03以降。子Counter5件を参照。実機検証完了前はverified/publishedへ昇格しない。',
  valid_from_patch_id = ctx.patch_id,
  valid_to_patch_id = null,
  verification_status = 'reviewed',
  content_kind = 'strategy',
  status = 'draft',
  updated_at = now()
from p cross join ctx
where co.slug = 'jp-matchup-' || p.opponent_slug;

-- Link every rebuilt row and its parent to JP's current baseline plus the opponent's current patch/frame sources.
with source_map(opponent_slug, opponent_patch_url, opponent_frame_url) as (
  values
    ('akuma','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/gouki_akuma','https://ultimateframedata.com/sf6/akuma'),
    ('ken','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ken','https://ultimateframedata.com/sf6/ken'),
    ('cammy','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/cammy','https://ultimateframedata.com/sf6/cammy'),
    ('m-bison','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/vega_mbison','https://ultimateframedata.com/sf6/mbison'),
    ('mai','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/mai','https://ultimateframedata.com/sf6/mai'),
    ('luke','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/luke','https://ultimateframedata.com/sf6/luke'),
    ('juri','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/juri','https://ultimateframedata.com/sf6/juri'),
    ('rashid','https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/rashid','https://ultimateframedata.com/sf6/rashid')
), target_rows as (
  select co.id, co.slug, o.slug as opponent_slug
  from counters co
  join characters o on o.id = co.opponent_character_id
  where o.slug in (select opponent_slug from source_map)
    and (co.slug like 'jp-vs-' || o.slug || '-%' or co.slug = 'jp-matchup-' || o.slug)
), links as (
  select tr.id as entity_id, s.id as source_id,
         case
           when s.url = 'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp' then 'patch_baseline'
           when s.url = sm.opponent_patch_url then 'supporting'
           else 'corroborating'
         end as relationship
  from target_rows tr
  join source_map sm on sm.opponent_slug = tr.opponent_slug
  join sources s on s.url in (
    'https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp',
    'https://ultimateframedata.com/sf6/jp',
    sm.opponent_patch_url,
    sm.opponent_frame_url
  )
)
insert into entity_sources (entity_type, entity_id, source_id, relationship, note)
select 'counter', entity_id, source_id, relationship,
       '2026.08.03+ JP priority matchup rebuild; reviewed draft evidence.'
from links
on conflict (entity_type, entity_id, source_id) do update set
  relationship = excluded.relationship,
  note = excluded.note;
