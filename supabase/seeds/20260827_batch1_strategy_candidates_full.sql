-- Phase 13 batch 1 strategy candidates: full reproducible seed
-- Source of truth: SF6DNAPro production DB snapshot, 2026-08-27
-- Scope: Jamie, Chun-Li, Guile, Kimberly
-- Safety: preserves unverified/draft; does not promote verification or publication.

begin;

with rows(character_slug, patch_from, patch_to, slug, name, setup_type, starter_condition, sequence_text, frame_advantage, position, meter_condition, description, counter_notes, verification_status, content_kind, status) as (
 values
  ('chun-li', '2026.08.03', null, 'chun-burnout-pressure', 'バーンアウト相手の気功拳固め', 'burnout', '相手バーンアウト', '気功拳/通常技で後退を制限 > DI警戒', null, 'corner', '相手Drive 0', '弾と長い通常技で逃げを制限する候補。', '確定ガード連係の可否は実機確認。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-corner-stance-pressure', '端の構え連係候補', 'corner_oki', '画面端でダウンまたは有利', '通常技 > 行雲流水派生 > 投げ/打撃', null, 'corner', '任意', '端で構えを使い選択肢を増やす候補。', 'Dリバ/無敵技/4F暴れの割込点を確認。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-hazanshu-pressure', '覇山蹴後の攻め継続候補', 'pressure_oki', '覇山蹴系ヒット/有利状況', '近距離継続 > 打撃/投げ', null, 'any', '任意', '覇山蹴から近距離択へ移る候補。', '強度・ヒット状況ごとの有利差を確認。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-kikoken-walk-oki', '気功拳を盾にした接近', 'projectile_oki', '気功拳を安全に撃てる距離', '気功拳 > 前歩き/DR > 投げ・打撃', null, 'mid', '溜め条件', '弾を盾に位置を上げる春麗の基本圧力候補。', '弾速別の距離と飛び込み反応を確認。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-safejump-candidate', '春麗の詐欺飛び候補', 'safejump_candidate', '十分な有利時間を取れるダウン', '前ジャンプ攻撃', null, 'any', '任意', '2026年にも複数のsafe jump資料があるため検証枠として保持。', '正確なダウン技と+Fを現行版で確認。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-stance-oki', '行雲流水を絡めた起き攻め候補', 'stance_oki', 'ダウン後に構え移行可能な状況', '行雲流水 > 構え派生/投げ/様子見', null, 'any', '任意', '構え派生を起き攻めに組み込む候補。', '派生ごとの重なり・隙間は実機確認。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-blade-boom-pressure', 'ソニックブレイド連係候補', 'projectile_setup', 'ソニックブレイドを安全に設置可能', 'ソニックブレイド > ソニックブーム/前進', null, 'mid', '溜め条件', 'ブレイドとブームで画面を制御する候補。', 'OD版を含む弾速変更と相手弾無敵を現行版で確認。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-boom-walk-oki', 'ソニックブームを盾にした前進', 'projectile_oki', 'ソニックブームを撃てる距離', 'ソニックブーム > 前歩き > 投げ/打撃', null, 'mid', '溜め条件', 'ブームを盾に陣地を取る基本候補。', '弾速・距離・相手弾抜け性能を確認。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-burnout-chip', 'バーンアウト相手へのブーム削り', 'burnout', '相手バーンアウト', 'ブーム連射 > 前進 > DI/通常技', null, 'corner', '相手Drive 0', '弾削りと端維持を優先する候補。', '飛び・SA・弾抜けへの回答を確認。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-corner-boom-oki', '端ダウン後のブーム重ね候補', 'corner_oki', '端でダウン獲得', '溜め維持 > ブーム/打撃/投げ', null, 'corner', '任意', '端で溜めを維持しながら択を作る候補。', '受け身ごとの重なりと飛び脱出を確認。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-flashkick-charge-oki', '溜め維持型起き攻め', 'charge_oki', 'ダウン後に下溜めを確保', '下溜め維持 > 打撃/投げ、飛びにはサマーソルト', null, 'any', '溜め条件', '攻めながら対空チャージを保持する運用候補。', '歩き投げ時に溜めを失うトレードオフを確認。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-safejump-candidate', 'ガイルの詐欺飛び候補', 'safejump_candidate', '十分な有利時間を取れるダウン', '前ジャンプ攻撃候補', null, 'any', '任意', '詐欺飛びルート検証用候補。', '正確なダウン技・+Fをトレモ確認。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-burnout-pressure', 'バーンアウト相手への端固め候補', 'burnout', '相手バーンアウト', 'キャンセル可能打撃 > 必殺技/DIを意識した継続', null, 'corner', '相手Drive 0', '削り・ガード硬直増加を活用する候補。', '確定連携と割り込み可能箇所をトレモ確認。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-commandgrab-layer', '高酔いレベル時のコマ投げレイヤー', 'mixup', 'コマンド投げ使用可能な酔いレベル', '打撃を見せる > コマンド投げ/シミー', null, 'any', '酔いレベル条件あり', '高酔いレベル時のみ成立する崩し候補。', '使用可能レベルと発生・間合いを現行版で確認。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-corner-pressure-oki', '画面端ダウン後の密着択', 'corner_oki', '画面端でダウン獲得', '密着維持 > 打撃/投げ/遅らせ打撃', null, 'corner', '任意', '端で位置を維持しつつ打撃投げを回す候補。', '無敵技・Dリバ・投げ抜けへの回答を要確認。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-drink-oki', '酔いレベル確保後の起き攻め', 'resource_oki', 'ダウン後に安全に酔いレベルを確保できる状況', '酔疾歩/魔身などで酔いレベル確保 > 距離を見て打撃・投げ・様子見', null, 'any', '状況依存', '酔いレベル上昇と起き攻め継続の期待値を比較する候補。', 'ダウン技・受け身・確反有無を実機確認。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-rekka-carry-oki', '流酔拳系からの運び後起き攻め', 'oki', '流酔拳系でダウンを取った後', '前歩き/DR > 打撃・投げ・シミー', null, 'any', 'Drive任意', '運び後の距離を利用した標準起き攻め候補。', '派生段数と酔いレベルごとの硬直差を要確認。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-safejump-candidate', 'ジャンプ起き攻め候補', 'safejump_candidate', '十分な有利時間を取れるダウン後', '前ジャンプ攻撃候補', null, 'any', '任意', '詐欺飛び成立候補を記録するための枠。', '正確な+Fと相手無敵技発生を実機確認するまで断定不可。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-burnout-can-pressure', 'バーンアウト相手への設置攻め', 'burnout', '相手バーンアウトかつ細工手裏剣あり', '設置 > 打撃で端維持 > DIを意識', null, 'corner', '相手Drive 0', '設置とガード硬直増加を組み合わせる候補。', 'SA切り返し・ジャンプ・投げへの回答を確認。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-can-oki', '細工手裏剣を使った起き攻め', 'setplay', '細工手裏剣を安全に設置できるダウン', '細工手裏剣設置 > 打撃/投げ/表裏候補', null, 'corner', 'ストック条件', 'キンバリー固有の設置を軸にしたセットプレイ候補。', '爆発タイミング・受け身・無敵技対応を実機確認。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-corner-can-loop', '端の細工手裏剣継続攻め候補', 'corner_setplay', '画面端かつ細工手裏剣あり', '設置 > 打撃/投げ > 爆発を背景に継続', null, 'corner', 'ストック条件', '端で設置を絡めて防御択を拘束する候補。', 'Dリバ・SA・ジャンプ逃げへの対応を確認。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-crossup-run-candidate', '疾駆け表裏候補', 'mixup', 'ダウン後に相手を越えられる距離', '疾駆け継続/停止 > 表裏択候補', null, 'any', '任意', 'ランの通過・停止で位置を変える候補。', 'キャラ体格・受け身で成立差があるため実機確認必須。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-run-oki', '疾駆けを絡めた起き攻め', 'run_oki', 'ダウン後に疾駆け接近可能', '疾駆け > 派生/停止 > 投げ・打撃', null, 'any', '任意', 'ラン派生と停止を使った多層択候補。', '各派生の隙間と暴れポイントを確認。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-teleport-layer', 'テレポートを混ぜた崩し候補', 'mobility_mixup', '相手の意識が地上に向いている状況', '通常攻め > テレポート択', null, 'any', '任意', '奇襲を常用せず、意識分散用として使う候補。', '見てから対応可否・確反を現行版で確認。', 'unverified', 'strategy', 'draft')
), resolved as (
 select c.id, r.slug, r.name, r.setup_type, r.starter_condition, r.sequence_text, r.frame_advantage, r.position, r.meter_condition, r.description, r.counter_notes, r.verification_status, r.content_kind, r.status, pf.id, pt.id
 from rows r
 join characters c on c.slug = r.character_slug
 left join patches pf on pf.version_label = r.patch_from
 left join patches pt on pt.version_label = r.patch_to
)
insert into setups (character_id, slug, name, setup_type, starter_condition, sequence_text, frame_advantage, position, meter_condition, description, counter_notes, verification_status, content_kind, status, valid_from_patch_id, valid_to_patch_id)
select * from resolved
on conflict (slug) do update set
  name = excluded.name,
  setup_type = excluded.setup_type,
  starter_condition = excluded.starter_condition,
  sequence_text = excluded.sequence_text,
  frame_advantage = excluded.frame_advantage,
  position = excluded.position,
  meter_condition = excluded.meter_condition,
  description = excluded.description,
  counter_notes = excluded.counter_notes,
  verification_status = excluded.verification_status,
  content_kind = excluded.content_kind,
  status = excluded.status,
  valid_from_patch_id = excluded.valid_from_patch_id,
  valid_to_patch_id = excluded.valid_to_patch_id,
  updated_at = now();

with rows(character_slug, patch_from, patch_to, slug, name, sequence_type, sequence_text, is_true_blockstring, mash_point, throw_point, shimmy_point, jump_option, parry_option, drive_reversal_option, invincible_option, notes, verification_status, content_kind, status) as (
 values
  ('chun-li', '2026.08.03', null, 'chun-burnout-sequence', '春麗バーンアウト攻め', 'burnout', '気功拳/通常技 > 接近 > DI意識', false, 'gap要確認', '近距離', '投げ候補', '飛び逃げ対空', 'パリィ不可', 'Dリバ不可', 'SA警戒', '相手Drive 0限定。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-corner-pressure', '春麗端固め', 'corner_pressure', '長い通常技/構え > 投げ/シミー', false, '4F割込確認', '密着', '後退シミー', '前ジャンプ対空', 'パリィ読み投げ', 'Dリバ注意', '無敵技注意', '端位置維持。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-defense-sequence', '春麗守備選択', 'defense', 'ガード/パリィ/Dリバ/無敵技を使い分け', false, '暴れは確定時', '投げ読み', 'シミー警戒', '空中逃げは状況依存', '多段注意', '端で優先度上昇', '無敵技ゲージ条件', '防御候補整理。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-hazanshu-layer', '覇山蹴レイヤー', 'mixup', '地上けん制 > 覇山蹴/通常技/待ち', false, '見てから暴れ可否確認', 'ヒット後条件依存', 'ガード後後退候補', '飛びとの意識分散', 'パリィ対策に投げ', 'Dリバ可否確認', '無敵技注意', '中段意識分散用。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-kikoken-pressure', '気功拳前進', 'projectile_pressure', '気功拳 > 前歩き/DR > 打撃・投げ', false, '弾と本体の隙間を確認', '接近成功時', '投げ抜け読み', '飛びには対空準備', '弾パリィに投げ候補', '接近後Dリバ注意', '弾抜けSA注意', '弾速別に検証。', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-stance-pressure', '行雲流水派生', 'stance_pressure', '通常技 > 行雲流水 > 派生/停止', false, '派生間を要確認', '停止後近距離', '停止シミー候補', 'ジャンプ可否確認', '派生にパリィ注意', 'Dリバ箇所確認', '無敵技割込確認', '確定連係とは断定しない。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-blade-pressure', 'ブレイド制圧', 'setup_pressure', 'ソニックブレイド > ブーム/待ち/前進', false, '設置後の割込確認', '接近後', '前進投げ', '飛び軌道制限', '弾パリィに前進', '本体攻撃時注意', '弾抜け注意', '現行OD弾速差を確認。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-boom-feint-tempo', 'ブーム撃ち分けテンポ', 'zoning', '弾速を散らす > 待つ/前進/対空', false, '非該当', '接近時', '急前進を誘う', '飛びを誘って対空', 'パリィタイミングずらし', '非該当', '弾抜けSA警戒', '速度差でリズム固定を避ける。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-boom-pressure', 'ブーム前進', 'projectile_pressure', 'ソニックブーム > 前歩き > 打撃/投げ', false, '弾本体間gap確認', '接近時', '後退で投げ抜け誘い', '飛びにサマーソルト準備', 'パリィ読み前進/投げ', '近距離Dリバ注意', '弾抜けSA注意', '溜め維持と前進の両立。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-burnout-sequence', 'ガイルバーンアウト攻め', 'burnout', 'ブーム削り > 前進 > DI/打撃', false, 'gap要確認', '接近時', '投げ候補', '飛び対空', 'パリィ不可', 'Dリバ不可', 'SA弾抜け警戒', '相手Drive 0限定。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-charge-defense', '溜め維持防御', 'defense', '下溜め維持 > 飛びにサマーソルト/地上はガード', false, '4F暴れ別途', '投げに弱い', '投げ誘いを見て立つ', '対空主軸', 'パリィ併用', '端でDリバ候補', '無敵サマーソルト条件', '守りながら溜め保持。', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-corner-pressure', 'ガイル端ブーム固め', 'corner_pressure', 'ブーム > 通常技 > 投げ/待ち', false, 'gap要確認', '近距離', '投げ候補', '前ジャンプ対空', '弾パリィ読み投げ', 'Dリバ注意', 'SA注意', '端から逃がさない運用。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-burnout-sequence', 'ジェイミーバーンアウト攻め', 'burnout', '通常技 > 必殺技でガード硬直活用 > DI意識', false, '実機でgap確認', '密着時', '投げ抜け読み', '端脱出ジャンプ警戒', 'パリィ不可', 'Dリバ不可', 'SA警戒', '相手Drive 0限定。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-corner-pressure', 'ジェイミー端攻め', 'corner_pressure', '端で打撃 > 投げ/シミー/連係停止', false, '4F暴れ箇所を要確認', '密着時', '投げ抜け読み', '前ジャンプ逃げを対空', 'パリィ読み投げ', 'Dリバ警戒', '無敵技警戒', '端維持優先。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-defense-sequence', 'ジェイミー守備選択', 'defense', 'ガード > 4F/パリィ/Dリバ/無敵SAを状況選択', false, '暴れは確定箇所のみ', '投げ読み', '遅らせ投げ抜け偏重を避ける', 'ジャンプ逃げは端位置注意', '多段に注意', '端脱出候補', 'SA切返し条件確認', '汎用防御枠。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-drink-tempo', '酔いレベル確保テンポ', 'resource', 'ダウン/距離確保 > 酔いレベル上昇 > 再接近', false, '相手の即前進', '再接近後', '急接近を誘って差し返し', '飛び込み注意', '酔い動作へのパリィ非該当', '非該当', 'SA/突進で咎められる可能性', '安全な飲酒状況を分離。', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-light-pressure', 'ジェイミー小技固め', 'pressure', '小技 > 打撃継続/投げ/止め', false, '隙間は距離・技選択依存', '近距離', '投げ抜け読み', '後退/ジャンプに注意', 'パリィ読み投げ', '本体打撃にDリバ可', '無敵技は読み合い', 'Exact gaps not asserted.', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-rekka-pressure', '流酔拳派生の読み合い', 'pressure', '流酔拳 > 派生継続/止め/投げ', false, '派生間を要確認', '止めた後の近距離', '止めから誘う', '飛び逃げ可否確認', '遅らせパリィ注意', '派生へのDリバ確認', '無敵技割込確認', '酔いレベル別に検証。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-burnout-sequence', 'キンバリーバーンアウト攻め', 'burnout', '設置 > 打撃継続 > DI意識', false, 'gap要確認', '近距離', '投げ候補', '飛び逃げ警戒', 'パリィ不可', 'Dリバ不可', 'SA注意', '相手Drive 0限定。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-can-pressure', '細工手裏剣圧力', 'setplay_pressure', '設置 > 本体打撃/投げ > 爆発', false, '爆発タイミング依存', '近距離', '爆発を背景に投げ', '逃げ方向確認', 'パリィ読み投げ', '本体打撃にDリバ', 'SA切返し注意', 'ストック条件あり。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-corner-setplay', 'キンバリー端セットプレイ', 'corner_pressure', '設置/疾駆け > 表裏/投げ/打撃', false, 'キャラ別gap確認', '密着', '投げ候補', 'ジャンプ逃げ対空', 'パリィ読み投げ', 'Dリバ注意', 'SA注意', '体格差・受け身差を検証。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-defense-sequence', 'キンバリー守備選択', 'defense', 'ガード/パリィ/Dリバ/SAを状況選択', false, '暴れは確定時', '投げ読み', 'シミー警戒', 'ジャンプ逃げは端注意', '多段注意', '端で重要', '無敵SA条件', '切返し性能の制約を前提に防御を分散。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-run-pressure', '疾駆け派生', 'run_pressure', '疾駆け > 派生/停止/投げ', false, '派生gap要確認', '停止後', '停止シミー', 'ジャンプ逃げ確認', '派生にパリィ注意', 'Dリバ箇所確認', '無敵技割込確認', '確定連係とは断定しない。', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-teleport-mix', 'テレポート混ぜ', 'mobility_mixup', '地上攻め > テレポート/継続/停止', false, '見てから暴れ確認', '出現位置依存', 'フェイク後シミー', 'ジャンプと競合', 'パリィ対応確認', 'Dリバ対象外場面あり', '無敵技注意', '奇襲は散らして使用。', 'unverified', 'strategy', 'draft')
), resolved as (
 select c.id, r.slug, r.name, r.sequence_type, r.sequence_text, r.is_true_blockstring, r.mash_point, r.throw_point, r.shimmy_point, r.jump_option, r.parry_option, r.drive_reversal_option, r.invincible_option, r.notes, r.verification_status, r.content_kind, r.status, pf.id, pt.id
 from rows r
 join characters c on c.slug = r.character_slug
 left join patches pf on pf.version_label = r.patch_from
 left join patches pt on pt.version_label = r.patch_to
)
insert into sequences (character_id, slug, name, sequence_type, sequence_text, is_true_blockstring, mash_point, throw_point, shimmy_point, jump_option, parry_option, drive_reversal_option, invincible_option, notes, verification_status, content_kind, status, valid_from_patch_id, valid_to_patch_id)
select * from resolved
on conflict (slug) do update set
  name = excluded.name,
  sequence_type = excluded.sequence_type,
  sequence_text = excluded.sequence_text,
  is_true_blockstring = excluded.is_true_blockstring,
  mash_point = excluded.mash_point,
  throw_point = excluded.throw_point,
  shimmy_point = excluded.shimmy_point,
  jump_option = excluded.jump_option,
  parry_option = excluded.parry_option,
  drive_reversal_option = excluded.drive_reversal_option,
  invincible_option = excluded.invincible_option,
  notes = excluded.notes,
  verification_status = excluded.verification_status,
  content_kind = excluded.content_kind,
  status = excluded.status,
  valid_from_patch_id = excluded.valid_from_patch_id,
  valid_to_patch_id = excluded.valid_to_patch_id,
  updated_at = now();

with rows(character_slug, patch_from, patch_to, slug, target_type, situation, counter_type, title, summary, method, benefit, risk, difficulty, conditions, verification_status, content_kind, status) as (
 values
  ('chun-li', '2026.08.03', null, 'chun-counter-corner-defense', 'system', '自分が画面端', 'defense', '端防御の選択分散', 'パリィ/Dリバ/無敵技/ジャンプを分散。', '相手の固め構造に応じ選ぶ。', '防御読まれを防ぐ。', 'ゲージと位置の損失。', 4, '相手連係依存', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-counter-di', 'system', 'キャンセル可能通常技に相手DI', 'drive_impact', 'DI返し', 'キャンセル可能な牽制からDIへ反応。', '演出を見てDI返し。', '端では特に高リターン。', 'キャンセル不可通常技中は不可。', 2, '技ごとのキャンセル可否確認', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-counter-jump-5mk', 'system', '相手の正面ジャンプ', 'anti_air', '立ち中K対空候補', '春麗の通常技対空候補。', '軌道に合わせて立ち中K。', '溜めを失わず迎撃可能。', '角度・深さで負ける。', 2, '正面ジャンプ中心', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-counter-jump-airthrow', 'system', '近距離の高い飛び', 'anti_air', '空中投げ候補', '通常技対空が難しい軌道への空対空候補。', '前/垂直ジャンプから空中投げ。', '位置入れ替え候補。', '届かない距離で空振り。', 3, '空中投げ間合い', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-counter-projectile-hazanshu', 'system', '相手の飛び道具', 'projectile', '覇山蹴での弾対応候補', '弾に対して接近を狙う候補。', '相手の弾タイミングに覇山蹴系を合わせる。', '弾主体へ意識を割かせる。', '見られると対空/反撃の可能性。', 4, '弾無敵等の現行性能を要確認', 'unverified', 'strategy', 'draft'),
  ('chun-li', '2026.08.03', null, 'chun-counter-rush', 'system', '相手の生DR', 'drive_rush', '長い通常技でDR停止', '春麗の地上牽制で侵入を止める候補。', '相手のDR到達点に中攻撃等を置く。', '地上戦へ戻せる。', '相手の先端技に負ける距離あり。', 3, '対キャラ距離確認', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-counter-corner-defense', 'system', '自分が画面端', 'defense', '溜めを維持した端防御', '下溜めを保ちながらガード/パリィ/Dリバ/サマーを選択。', '投げを意識しつつ対空溜めを切らさない。', '切返しの脅威を保つ。', '投げに固執すると崩される。', 4, 'ゲージ・溜め条件', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-counter-di', 'system', 'キャンセル可能技にDI', 'drive_impact', 'DI返し', 'キャンセル可能な技からDIへ反応。', 'DI演出を見てDI返し。', '壁際で高リターン。', 'キャンセル不可牽制では不可。', 2, '技ごとに可否確認', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-counter-jump-2hp', 'system', '相手の正面ジャンプ', 'anti_air', 'しゃがみ強P対空候補', '溜めを温存する通常技対空候補。', '正面飛びへしゃがみ強P。', '必殺技を使わず迎撃。', '深い飛び/めくりに弱い。', 2, '正面ジャンプ中心', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-counter-jump-flashkick', 'system', '相手のジャンプ', 'anti_air', 'サマーソルト対空', '溜めがある時の主力対空候補。', '下溜めからジャンプにサマーソルト。', '強い対空とダウン。', '溜め不足・めくりで失敗。', 2, '下溜め確保', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-counter-projectile-boom', 'system', '相手の飛び道具', 'projectile', 'ソニックブーム撃ち合い', '弾速差を使って弾戦を組み立てる。', '相手弾に合わせてブーム/待ち/パリィ。', '相手の前進を制限。', '弾抜け持ちにはリスク。', 2, '溜め確保', 'unverified', 'strategy', 'draft'),
  ('guile', '2026.08.03', null, 'guile-counter-rush', 'system', '相手の生DR', 'drive_rush', 'ブーム/通常技でDR停止', '遠距離からのDRに先置きで対応。', 'ブームまたは通常技で進行を止める。', '得意距離維持。', '弾抜け・アーマー等に注意。', 3, '相手キャラ依存', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-counter-corner-defense', 'system', '自分が画面端', 'defense', '端脱出の選択分散', 'ガード一辺倒にせずDリバ・パリィ・ジャンプ等を分散。', '相手の投げ/打撃傾向で選択。', '読みを散らせる。', '各選択に反撃リスク。', 4, 'ゲージ・相手連係依存', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-counter-di', 'system', 'キャンセル可能通常技に相手DI', 'drive_impact', 'DI返し', 'キャンセル可能技からDIへ反応する。', 'DI演出を見てDI返し。', '大きなリターン。', 'キャンセル不可技中は不可。', 2, 'キャンセル可能技使用時', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-counter-jump-2hp', 'system', '相手の正面ジャンプ', 'anti_air', 'しゃがみ強P対空候補', '地上通常技で迎撃する基本候補。', '正面飛びを見てしゃがみ強P。', '地上に留まり酔いレベル維持の判断へ戻りやすい。', 'めくり・深い飛びは別回答が必要。', 2, '正面ジャンプ中心', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-counter-jump-dp', 'system', '相手のジャンプ', 'anti_air', '昇龍系必殺技対空候補', '必殺技対空が届く軌道への回答候補。', 'ジャンプ軌道に合わせて対空必殺技。', 'ダウンと位置を取りやすい。', '入力遅れ・めくりで負ける可能性。', 3, '技性能を現行版で要確認', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-counter-projectile-bakkai', 'system', '中距離の飛び道具', 'projectile', '爆廻系弾抜け候補', '酔いレベル条件を満たした弾対策候補。', '相手の弾タイミングを読んで弾抜け技。', '弾主体相手へリスクを付ける。', 'フェイントや間合い外で反撃を受ける。', 4, '使用可能な酔いレベル・距離を確認', 'unverified', 'strategy', 'draft'),
  ('jamie', '2026.08.03', null, 'jamie-counter-rush', 'system', '相手の生DR接近', 'drive_rush', '置き技/4FでDR停止候補', '相手DRの到達点へ通常技を置く候補。', '距離ごとに小技・中技を使い分け。', '接近拒否し酔いレベルを活かす時間を作る。', '潰される技・距離あり。', 3, '相手キャラごとに要検証', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-counter-corner-defense', 'system', '自分が画面端', 'defense', 'Dリバ・パリィ中心の端防御候補', '無理な暴れを減らし共通防御を使う。', 'ガードからDリバ/パリィ/ジャンプ等を散らす。', '切返し不足を共通システムで補う。', '読まれると投げ/シミーに弱い。', 4, 'ゲージ状況依存', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-counter-di', 'system', 'キャンセル可能通常技にDI', 'drive_impact', 'DI返し', '連係中でもDIへ反応できる技を選ぶ。', '演出を見てDI返し。', '端攻め継続につながる。', '疾駆け派生等で返せない場面あり。', 3, '行動ごとのキャンセル可否確認', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-counter-jump-2hp', 'system', '相手の正面ジャンプ', 'anti_air', 'しゃがみ強P対空候補', 'キンバリーの地上対空候補。', '正面飛びにしゃがみ強P。', '地上位置を維持。', 'めくり・深い飛びは別回答。', 2, '正面ジャンプ中心', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-counter-jump-airtoair', 'system', '高めの飛び', 'anti_air', '空対空候補', '機動力を活かした空対空候補。', 'ジャンプ通常技で先に触る。', '位置入れ替え・追撃候補。', '早出しに負ける可能性。', 3, 'ジャンプ軌道依存', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-counter-projectile-teleport', 'system', '相手の飛び道具', 'projectile', 'テレポート弾対応候補', '弾を読んだ位置変更・接近候補。', '相手弾タイミングに移動技を合わせる。', '弾撃ちへリスクを付ける。', '読まれると迎撃される。', 4, '現行の無敵/移動性能を確認', 'unverified', 'strategy', 'draft'),
  ('kimberly', '2026.08.03', null, 'kim-counter-rush', 'system', '相手の生DR', 'drive_rush', '置き技でDR停止', '高速接近同士の読み合いで先置きする。', '到達点へ小/中攻撃を置く。', '自分の攻めターンへ移行。', '相手の長い技に負ける距離あり。', 3, '対キャラ確認', 'unverified', 'strategy', 'draft')
), resolved as (
 select c.id, r.slug, r.target_type, r.situation, r.counter_type, r.title, r.summary, r.method, r.benefit, r.risk, r.difficulty, r.conditions, r.verification_status, r.content_kind, r.status, pf.id, pt.id
 from rows r
 join characters c on c.slug = r.character_slug
 left join patches pf on pf.version_label = r.patch_from
 left join patches pt on pt.version_label = r.patch_to
)
insert into counters (defender_character_id, slug, target_type, situation, counter_type, title, summary, method, benefit, risk, difficulty, conditions, verification_status, content_kind, status, valid_from_patch_id, valid_to_patch_id)
select * from resolved
on conflict (slug) do update set
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
  verification_status = excluded.verification_status,
  content_kind = excluded.content_kind,
  status = excluded.status,
  valid_from_patch_id = excluded.valid_from_patch_id,
  valid_to_patch_id = excluded.valid_to_patch_id,
  updated_at = now();

select kind, count(*) as row_count,
       count(*) filter (where verification_status <> 'unverified' or status <> 'draft') as unsafe_count
from (
 select 'setup'::text kind, s.verification_status, s.status from setups s join characters c on c.id=s.character_id where c.slug in ('jamie','chun-li','guile','kimberly')
 union all
 select 'sequence', s.verification_status, s.status from sequences s join characters c on c.id=s.character_id where c.slug in ('jamie','chun-li','guile','kimberly')
 union all
 select 'counter', k.verification_status, k.status from counters k join characters c on c.id=k.defender_character_id where c.slug in ('jamie','chun-li','guile','kimberly')
) x
group by kind
order by kind;

commit;
