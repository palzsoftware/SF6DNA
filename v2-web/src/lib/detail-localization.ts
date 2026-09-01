export type MoveGlossaryEntry = {
  english: string;
  japanese: string;
};

const exactLabels: Record<string, string> = {
  draft: "下書き",
  reviewed: "内容確認済み",
  unverified: "未検証",
  verified: "検証済み",
  published: "公開済み",
  archived: "アーカイブ済み",
  any: "中央・画面端共通",
  midscreen: "画面中央",
  corner: "画面端",
  "near corner": "画面端付近",
  "year3。": "Year 3資料。",
  "legacy candidate": "旧バージョン候補",
  "modern only": "モダン専用",
  "modern only.": "モダン専用。",
  "current written": "現行版の文章資料",
  "punish counter required.": "パニッシュカウンター必須。",
  "legacy route": "旧バージョンルート",
  "year4 current": "Year 4現行版",
  "drive rush, perfect knuckle execution": "ドライブラッシュとジャストナックルの入力精度が必要",
  "legacy candidate; drive6 + sa3.": "旧バージョン候補。Dゲージ6本＋SA3。",
  "spacing dependent.": "距離依存。",
  "2026 post-patch claim": "2026年の調整後資料に記載",
  "2026.08.03 current guide recipe": "2026.08.03現行攻略記事のレシピ",
  "classic only": "クラシック専用",
  "consumes wind + sa1.": "風ストック＋SA1を消費。",
  "corner only.": "画面端限定。",
  "corner wall splat": "画面端の壁やられ",
  "written/image-confirmed route; no video playback. current-device capture required.": "文章・画像で確認したルートです。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-confirmed claim; no video playback. current capture required.": "文章・画像で確認した情報です。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-only collection. no video playback; capture required for current-device confirmation.": "文章・画像から収集しました。動画再生は未実施で、現行版の実機確認用撮影が必要です。",
  "written/image-only collection. no video playback; current-device capture required.": "文章・画像から収集しました。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-confirmed; no video playback. current-device capture required.": "文章・画像で確認済みです。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-confirmed; no video playback. current capture required.": "文章・画像で確認済みです。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written/image-only collection; current-device capture required.": "文章・画像から収集しました。現行版の実機撮影が必要です。",
  "written/image source only; no video playback. current-device capture required.": "文章・画像の情報源のみで確認しました。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written route collected without video playback; verify on 2026.08.03 build.": "動画を再生せず文章から収集したルートです。2026.08.03版で確認してください。",
  "written/image claim from before 2026-08-03; no video playback. current-device capture required.": "2026.08.03より前の文章・画像資料に基づく情報です。動画再生は未実施で、現行版の実機撮影が必要です。",
  "modern written/image-only claim. no video playback; current-device capture required.": "モダン操作の文章・画像資料に基づく情報です。動画再生は未実施で、現行版の実機撮影が必要です。",
  "written recipe; no video inference. current-patch capture required.": "文章に記載されたレシピです。動画からの推測は行っておらず、現行版の実機撮影が必要です。",
  "written route; no video inference. device capture required.": "文章に記載されたルートです。動画からの推測は行っておらず、実機撮影が必要です。",
  "year4 modern written route; current device capture required.": "Year 4のモダン操作向け文章資料に記載されたルートです。現行版の実機撮影が必要です。",
  "older written route; year4 device verification pending.": "旧資料に記載されたルートです。Year 4での実機確認待ちです。",
  "2026-08-03 year4 ken guide value; reviewed, not in-game verified in this environment.": "2026.08.03のYear 4ケン攻略記事記載値です。内容確認済みですが、この環境では実機未検証です。",
  "current 2026-08-05 guide candidate; exact damage remains null unless reproduced.": "2026.08.05の現行攻略記事候補です。再現確認が取れるまで正確なダメージは未入力とします。",
  "damage and notation are explicitly paired in the linked combo guide. compatibility reviewed against 2026.08.03 jp change context; in-game reproduction still pending.": "リンク先のコンボ攻略記事でダメージと入力が明確に対応しています。2026.08.03のJP変更内容とは照合済みですが、実機での再現確認待ちです。",
  "text/image-only claim. no video playback. record medal level and do not store a fixed damage value until reproduction.": "文章・画像資料に基づく情報です。動画再生は未実施です。メダルレベルを記録し、再現確認までは固定ダメージを入力しません。",
  "2026-08 current guide candidate": "2026年8月の現行攻略記事候補です。",
  "written route only; no video playback. verify on 2026.08.03 build.": "文章に記載されたルートのみです。動画再生は未実施で、2026.08.03版で確認してください。",
  "written/image-only claim. no video playback; current-device capture required.": "文章・画像資料に基づく情報です。動画再生は未実施で、現行版の実機撮影が必要です。",
  oki: "起き攻め",
  frame_kill: "フレーム消費",
  meaty: "持続重ね",
  modern_oki: "モダン起き攻め",
  throw_oki: "投げ後の起き攻め",
  safe_jump: "詐欺飛び",
  safejump: "詐欺飛び",
  legacy_candidate: "旧バージョン候補",
  corner_oki: "画面端の起き攻め",
  legacy: "旧バージョン",
  modern_only: "モダン専用",
  command_throw: "コマンド投げ",
  teleport: "テレポート",
  written_candidate: "文章資料候補",
  side_switch: "位置入れ替え",
  super_setup: "SAセットプレイ",
  pressure: "攻め継続",
  setup_pressure: "セットプレイからの攻め継続",
  oki_pressure: "起き攻め継続",
  modern_pressure: "モダンの攻め継続",
  burnout_pressure: "バーンアウト中の攻め継続",
  corner_pressure: "画面端の攻め継続",
  defense: "防御連携",
  frame_trap: "暴れ潰し",
  oki_sequence: "起き攻め連携",
  sa2_sequence: "SA2連携",
  zoning: "遠距離戦",
  neutral_pressure: "立ち回りからの攻め継続",
  projectile_pressure: "飛び道具からの攻め継続",
  resource: "リソース管理",
  safe_jump_pressure: "詐欺飛びからの攻め継続",
  anti_air_setup: "対空セットプレイ",
  counter_sequence: "対策連携",
  anti_air: "対空",
  punish: "確定反撃",
  approach: "接近への対応",
  matchup_overview: "対面概要",
  matchup_plan: "対面プラン",
  reaction: "見てから対応",
  drive_rush: "ドライブラッシュ対策",
  projectile: "飛び道具対策",
  drive_impact: "ドライブインパクト対策",
  adaptation: "相手の動きへの対応",
  system: "システム対策",
  neutral_check: "立ち回り確認",
  patch_specific: "現行パッチ限定",
  whiff_punish: "差し返し",
  none: "ゲージ不要",
  drive: "Dゲージ使用",
  drive_sa: "Dゲージ／SA使用",
  sa_optional: "SA任意",
  "record 4f gaps": "4F技で割り込める箇所を撮影確認",
  "record throw point": "投げを選べる箇所を撮影確認",
  "record shimmy spacing": "シミー間合いを撮影確認",
  "record jump escape": "ジャンプ逃げを撮影確認",
  "record parry answer": "パリィへの対応を撮影確認",
  "record d-reversal": "ドライブリバーサルを撮影確認",
  "record reversal": "無敵技の割り込みを撮影確認",
  "4f check": "4F技での割り込み確認",
  "throw branch": "投げ択",
  "backwalk branch": "後ろ歩きのシミー択",
  "walk-back branch": "後ろ歩きのシミー択",
  "jump check": "ジャンプ逃げ確認",
  "parry check": "パリィ確認",
  "d-reversal check": "ドライブリバーサル確認",
  "invincible check": "無敵技確認",
  "n/a": "該当なし",
  "verify rises, 4f, jump, backdash, parry, d-reversal, di and invincible options.": "受け身、4F技、ジャンプ、バックステップ、パリィ、ドライブリバーサル、ドライブインパクト、無敵技を確認してください。",
  "verify normal/back rise, 4f, jump, backdash, parry, d-reversal, di and invincible options.": "その場／後方受け身、4F技、ジャンプ、バックステップ、パリィ、ドライブリバーサル、ドライブインパクト、無敵技を確認してください。",
  "verify rise, 4f, jump, backdash, parry, d-reversal, di and invincible options.": "受け身、4F技、ジャンプ、バックステップ、パリィ、ドライブリバーサル、ドライブインパクト、無敵技を確認してください。",
  "verify normal/back rise, 4f, jump, backdash, parry, d-reversal and invincible options.": "その場／後方受け身、4F技、ジャンプ、バックステップ、パリィ、ドライブリバーサル、無敵技を確認してください。",
  "legacy candidate. verify normal/back rise, 4f, jump, backdash, parry, d-reversal, di and invincible options.": "旧バージョン候補です。その場／後方受け身、4F技、ジャンプ、バックステップ、パリィ、ドライブリバーサル、ドライブインパクト、無敵技を確認してください。",
  "verify both rises, 4f, jump, backdash, parry, d-reversal, di and invincible options.": "両受け身、4F技、ジャンプ、バックステップ、パリィ、ドライブリバーサル、ドライブインパクト、無敵技を確認してください。",
  "verify normal/back rise, 4f, 5f/6f reversal, jump, backdash, parry and drive reversal.": "その場／後方受け身、4F技、5F／6F無敵技、ジャンプ、バックステップ、パリィ、ドライブリバーサルを確認してください。",
  "older written frame claim; verify on year4.": "旧資料に記載されたフレーム情報です。Year 4で確認してください。",
  "legacy written claim. verify both recoveries, 4f, jump, backdash, parry, d-reversal, di and invincible options.": "旧資料に記載された情報です。両受け身、4F技、ジャンプ、バックステップ、パリィ、ドライブリバーサル、ドライブインパクト、無敵技を確認してください。",
  "check 4f, invincible reversal, parry, d-reversal and back rise.": "4F技、無敵技、パリィ、ドライブリバーサル、後方受け身を確認してください。",
  "candidate strategy; exact gaps remain training dependent.": "攻略候補です。正確な隙間はトレーニングモードでの確認が必要です。",
  "height and cross-up.": "高度とめくりを確認してください。",
  "resource automation.": "リソースの自動消費／獲得を確認してください。",
  "do not merge frame kills.": "フレーム消費をまとめず、個別に確認してください。",
  "invulnerability and scaling.": "無敵時間と補正を確認してください。",
  "both rises and reversal classes.": "両受け身と無敵技の種類別に確認してください。",
  "charge, height and cross-up.": "溜め、高度、めくりを確認してください。",
  "reversal and projectile interaction.": "無敵技と飛び道具の相互作用を確認してください。",
  "scaling and missing normals.": "補正と不足している通常技を確認してください。",
  "simple-input scaling separate.": "簡易入力補正は別項目で確認してください。",
  "knockdown with raw dr reach": "生ドライブラッシュが届くダウン後",
  "slight hold": "少し溜める",
  "block advantage claim": "ガード時有利フレームの資料記載値",
  "written spacing rule; every branch needs current capture before verification.": "文章資料に記載された間合い別ルールです。各択は検証前に現行版の実機撮影が必要です。",
  "gap by strength": "技の強度によって割り込める箇所が変わる",
  "typhoon after plus": "有利な状況からメキシカンタイフーンを狙う",
  "raw guillotine>l spire / dr guillotine>m spire / two guarded guillotines>h spire / lightx3>od only / lightx2>m / 2mk>h": "生ギロチン → 弱コンドルスパイア\nドライブラッシュ → ギロチン → 中コンドルスパイア\nギロチンを2回ガードさせた後 → 強コンドルスパイア\n小技×3 → ODコンドルスパイアのみ\n小技×2 → 中コンドルスパイア\nしゃがみ中K → 強コンドルスパイア",
};

const phraseLabels: Array<[string, string]> = [
  ["Written/image-only collection; current capture required.", "文章・画像から収集。現行版での撮影確認が必要です。"],
  ["PCラッシュ", "パニッシュカウンター・ラッシュ"],
  ["M DI", "モダン ドライブインパクト"],
  ["blocked Drive Reversal", "ドライブリバーサルをガード"],
  ["Drive Reversal punish", "ドライブリバーサルへの確定反撃"],
  ["D-reversal timing", "ドライブリバーサルのタイミング"],
  ["D-Reversal timing", "ドライブリバーサルのタイミング"],
  ["D-reversal", "ドライブリバーサル"],
  ["D-Reversal", "ドライブリバーサル"],
  ["invincible reversal", "無敵技"],
  ["OD/SA reversal", "OD／SA無敵技"],
  ["one-button reversal", "ワンボタン無敵技"],
  ["reversal bait", "無敵技釣り"],
  ["reversal check", "無敵技確認"],
  ["reversal timing", "無敵技のタイミング"],
  ["jump escape", "ジャンプ逃げ"],
  ["jump timing", "ジャンプのタイミング"],
  ["jump escapes throw", "ジャンプで投げを回避"],
  ["parry loses to throw", "パリィは投げに負ける"],
  ["perfect-parry timing", "ジャストパリィのタイミング"],
  ["normal/back rise", "その場／後方受け身"],
  ["normal/back recovery", "その場／後方受け身"],
  ["both rises", "両受け身"],
  ["both recoveries", "両受け身"],
  ["back rise", "後方受け身"],
  ["backdash", "バックステップ"],
  ["frame kill", "フレーム消費"],
  ["safe jump", "詐欺飛び"],
  ["meaty", "持続重ね"],
  ["forward jump attack", "前ジャンプ攻撃"],
  ["two guarded Guillotines", "ギロチンを2回ガードさせた後"],
  ["two guarded", "2回ガードさせた後の"],
  ["Guillotines", "ギロチン"],
  ["Guillotine", "ギロチン"],
  ["Typhoon", "タイフーン"],
  ["OD only", "OD版のみ"],
  ["guarded", "ガード後の"],
  ["blocked", "ガードした"],
  ["forward throw", "前投げ"],
  ["back throw", "後ろ投げ"],
  ["empty jump guard", "すかしジャンプからガード"],
  ["empty jump throw", "すかしジャンプ投げ"],
  ["empty jump", "すかしジャンプ"],
  ["micro-walk", "微歩き"],
  ["hit-confirm", "ヒット確認"],
  ["ground wait", "地上で様子見"],
  ["air follow-up", "空中追撃"],
  ["air route", "空中ルート"],
  ["on block", "ガード時"],
  ["manual ender", "手動締め"],
  ["automatic SA", "自動SA"],
  ["stock ender", "ストック獲得締め"],
  ["command/normal throw", "コマンド投げ／通常投げ"],
  ["command throw", "コマンド投げ"],
  ["normal throw", "通常投げ"],
  ["throw point", "投げ択の箇所"],
  ["throw branch", "投げ択"],
  ["strike branch", "打撃択"],
  ["guard/feint branch", "ガード／フェイント択"],
  ["backwalk or stop branch", "後ろ歩き／停止択"],
  ["backwalk", "後ろ歩き"],
  ["walk-back", "後ろ歩き"],
  ["raw", "生"],
  ["diagonal jump/air special", "斜めジャンプ／空中必殺技"],
  ["punish counter", "パニッシュカウンター"],
  ["poisoned opponent", "毒状態の相手"],
  ["opponent jump", "相手のジャンプ"],
  ["opponent stun", "相手がスタン"],
  ["wall splat", "壁やられ"],
  ["close hit", "近距離ヒット"],
  ["hard knockdown", "強制ダウン"],
  ["ground hit", "地上ヒット"],
  ["normal projectile branch", "通常弾ルート"],
  ["automatic route", "オートコンボルート"],
  ["exact timing/notation requires training verification", "正確なタイミング／入力はトレーニングモードでの確認が必要"],
  ["current-patch in-game verification pending", "現行版での実機確認待ち"],
  ["not in-game verified in this environment", "この環境では実機未検証"],
  ["do not infer from similar routes", "類似ルートから推測しないでください"],
  ["do not infer", "推測しないでください"],
  ["Guide recipe candidate", "攻略記事のレシピ候補"],
  ["Article candidate", "攻略記事候補"],
  ["current guide candidate", "現行攻略記事候補"],
  ["Drive Rush", "ドライブラッシュ"],
  ["current-patch damage", "現行版のダメージ"],
  ["exact damage", "正確なダメージ"],
  ["Damage", "ダメージ"],
  ["Drive", "Dゲージ"],
  ["Source", "出典"],
  ["NULL", "未入力"],
  ["air-to-air", "空対空"],
  ["counter hit", "カウンターヒット"],
  ["counter", "カウンターヒット"],
  ["poison burst", "毒破裂"],
  ["anti-air", "対空"],
  ["follow-up", "追撃"],
  ["side switch", "位置入れ替え"],
  ["knockdown", "ダウン"],
  ["burnout", "バーンアウト"],
  ["no poison", "毒なし"],
  ["projectile", "飛び道具"],
  ["launcher", "浮かせ"],
  ["delayed", "遅らせ"],
  ["lights", "小技"],
  ["light attacks", "小技"],
  ["light", "弱攻撃"],
  ["stun", "スタン"],
  ["burst", "破裂"],
  ["poison", "毒"],
  ["dash", "前ステップ"],
  ["walk", "歩き"],
  ["route", "ルート"],
  ["option", "選択肢"],
  ["options", "選択肢"],
  ["verify", "確認"],
  ["check", "確認"],
  ["record", "撮影"],
  ["branch", "択"],
  ["spacing", "間合い"],
  ["gaps", "隙間"],
  ["gap", "隙間"],
  ["stop", "停止"],
  ["block", "ガード"],
  ["guard", "ガード"],
  ["throw", "投げ"],
  ["jump", "ジャンプ"],
  ["invincible", "無敵"],
  ["rises", "受け身"],
  ["rise", "受け身"],
  ["parry", "パリィ"],
  ["timing", "タイミング"],
  ["response", "応答"],
  ["interaction", "相互作用"],
  ["allowed", "可能"],
  ["escapes", "逃げ"],
  ["corner", "画面端"],
  ["current", "現行版"],
  ["only", "専用"],
  ["required", "必須"],
];

export type SequenceDetailField =
  | "mash_point"
  | "throw_point"
  | "shimmy_point"
  | "jump_option"
  | "parry_option"
  | "drive_reversal_option"
  | "invincible_option";

export type SetupDetailField =
  | "starter_condition"
  | "sequence_text"
  | "frame_advantage"
  | "position"
  | "meter_condition"
  | "description"
  | "counter_notes";

export type TrainingDetailField =
  | "name"
  | "purpose"
  | "recording_instructions"
  | "playback_settings"
  | "cpu_settings"
  | "method"
  | "success_criteria"
  | "next_step";

const setupTypeLabels: Record<string, string> = {
  approach: "接近手段",
  bait: "様子見・誘い",
  burnout: "バーンアウト中",
  charge_oki: "溜めを維持した起き攻め",
  command_throw: "コマンド投げ",
  corner_oki: "画面端の起き攻め",
  corner_setplay: "画面端セットプレイ",
  doll: "人形設置",
  fireball: "飛び道具重ね",
  float: "浮遊セットプレイ",
  frame_kill: "フレーム消費",
  impact: "ドライブインパクト",
  impact_setup: "ドライブインパクトを使うセットプレイ",
  legacy: "旧バージョン",
  legacy_candidate: "旧バージョン候補",
  meaty: "持続重ね",
  meaty_projectile: "飛び道具の持続重ね",
  mixup: "崩し",
  mobility_mixup: "移動を使った崩し",
  modern_frame_kill: "モダン専用フレーム消費",
  modern_oki: "モダン専用起き攻め",
  modern_only: "モダン専用",
  modern_throw_oki: "モダン専用の投げ後起き攻め",
  oki: "起き攻め",
  overhead: "中段重ね",
  positioning: "位置調整",
  pressure: "攻め継続",
  pressure_oki: "攻め継続重視の起き攻め",
  projectile_oki: "飛び道具を重ねる起き攻め",
  projectile_setup: "飛び道具セットプレイ",
  resource_oki: "リソースを使う起き攻め",
  resource_pressure: "リソースを使った攻め継続",
  run_oki: "走りを使った起き攻め",
  sa2_oki: "SA2後の起き攻め",
  safe_jump: "詐欺飛び",
  safe_meaty: "安全重ね",
  safejump: "詐欺飛び",
  safejump_candidate: "詐欺飛び候補",
  setplay: "セットプレイ",
  setup: "セットプレイ",
  shimmy: "シミー",
  side_switch: "位置入れ替え",
  spacing: "間合い調整",
  spray: "スプレー設置",
  stance_oki: "構えを使った起き攻め",
  super_setup: "SAセットプレイ",
  teleport: "テレポート",
  throw_oki: "投げ後の起き攻め",
  trade_setup: "相打ちセットプレイ",
  written_candidate: "文章資料候補",
};

const sequenceTypeLabels: Record<string, string> = {
  anti_air_setup: "対空後の攻め",
  burnout: "バーンアウト中の連携",
  burnout_pressure: "バーンアウト中の攻め継続",
  corner_pressure: "画面端の攻め継続",
  counter_sequence: "対策連携",
  defense: "防御連携",
  drive_rush: "ドライブラッシュ連携",
  frame_trap: "暴れ潰し",
  jump_escape_punish: "ジャンプ逃げ狩り",
  legacy_reset: "旧バージョンの補正切り",
  mixup: "崩し",
  mobility_mixup: "移動を使った崩し",
  modern_pressure: "モダン専用の攻め継続",
  neutral_pressure: "立ち回りからの攻め継続",
  oki_pressure: "起き攻め継続",
  oki_sequence: "起き攻め連携",
  pressure: "攻め継続",
  projectile_pressure: "飛び道具からの攻め継続",
  reset: "補正切り",
  resource: "リソース管理",
  resource_management: "リソース管理",
  resource_pressure: "リソースを使った攻め継続",
  resource_sequence: "リソース管理連携",
  run_pressure: "走りを使った攻め継続",
  sa_pressure: "SAを使った攻め継続",
  sa2_pressure: "SA2を使った攻め継続",
  sa2_sequence: "SA2連携",
  safe_jump_candidate: "詐欺飛び候補",
  safe_jump_pressure: "詐欺飛びからの攻め継続",
  safejump_mix: "詐欺飛びを絡めた崩し",
  setplay_pressure: "セットプレイからの攻め継続",
  setup_pressure: "セットプレイからの攻め継続",
  stance_pressure: "構えを使った攻め継続",
  stun_sequence: "スタン時の連携",
  throw_sequence: "投げを狙う連携",
  throw_setup: "投げを絡めたセットプレイ",
  trade_sequence: "相打ち連携",
  whiff_punish_sequence: "差し返し連携",
  zoning: "遠距離戦",
};

const counterTypeLabels: Record<string, string> = {
  anti_air: "対空",
  defense: "守り",
  punish: "確定反撃",
  approach: "接近への対応",
  zoning: "遠距離戦",
  matchup_overview: "対面概要",
  matchup_plan: "対面プラン",
  reaction: "見てから対応",
  drive_rush: "ドライブラッシュ対策",
  projectile: "飛び道具対策",
  drive_impact: "ドライブインパクト対策",
  adaptation: "相手の動きへの対応",
  system: "システム対策",
  counter: "対策",
  neutral_check: "立ち回り確認",
  patch_specific: "現行パッチ限定",
  whiff_punish: "差し返し",
};

const trainingTypeLabels: Record<string, string> = {
  air_approach: "空中からの接近",
  anti_air: "対空",
  anti_air_conversion: "対空からの追撃",
  approach: "接近",
  charge_execution: "溜め入力",
  charge_pressure: "溜め技からの攻め継続",
  combo: "コンボ",
  combo_discovery: "コンボ検証",
  combo_retest: "コンボの実機確認",
  command_throw_mix: "コマンド投げを使った崩し",
  confirm: "ヒット確認",
  corner_combo: "画面端コンボ",
  corner_escape: "画面端からの脱出",
  decision: "状況判断",
  decision_combo: "コンボ選択",
  decision_mixed: "複合的な状況判断",
  decision_oki: "起き攻めの判断",
  decision_resource: "リソースの使い分け",
  defense: "守り",
  defense_corner: "画面端の守り",
  defense_throw: "投げへの守り",
  doll_setup: "ブランカちゃん人形セットプレイ",
  escape: "脱出",
  execution: "操作練習",
  execution_timing: "入力タイミング",
  footsies: "地上戦",
  hit_confirm: "ヒット確認",
  instructional_media: "初心者向け解説素材",
  mixup: "崩し",
  neutral: "立ち回り",
  offense: "攻め",
  oki: "起き攻め",
  oki_command_throw: "起き攻めのコマンド投げ",
  oki_meaty: "持続重ね",
  oki_mix: "起き攻めの崩し",
  oki_retest: "起き攻めの実機確認",
  pressure: "攻め継続",
  pressure_retest: "連携の実機確認",
  projectile_charge: "溜め飛び道具",
  projectile_pressure: "飛び道具からの攻め継続",
  projectile_response: "飛び道具への対応",
  projectile_setup: "飛び道具セットプレイ",
  punish: "確定反撃",
  punish_oki: "確定反撃後の起き攻め",
  reaction: "見てから対応",
  reaction_di: "ドライブインパクトへの反応",
  reaction_dr: "ドライブラッシュへの反応",
  resource: "リソース管理",
  resource_command_throw: "リソースを使うコマンド投げ",
  resource_management: "リソース管理",
  resource_oki: "リソースを使う起き攻め",
  resource_projectile: "リソースを使う飛び道具",
  resource_setup: "リソースを使うセットプレイ",
  sa2_pressure: "SA2を使った攻め継続",
  safe_jump: "詐欺飛び",
  setup: "セットプレイ",
  spacing: "間合い管理",
  super: "SA活用",
  super_decision: "SAの使い分け",
  video_candidate_retest: "動画由来候補の実機確認",
  whiff_punish: "差し返し",
  zoning: "遠距離戦",
  zoning_anti_air: "飛び道具と対空",
};

const trainingLevelLabels: Record<string, string> = {
  beginner: "初心者向け",
  intermediate: "中級者向け",
  advanced: "上級者向け",
};

const setupFieldLabels: Partial<Record<SetupDetailField, Record<string, string>>> = {
  frame_advantage: {
    unknown: "未確認",
    "source-described": "資料に記載あり（数値は未確認）",
    "source timing claim": "資料記載のタイミング",
    "route-specific": "ルートによって変化",
    "branch-specific": "派生によって変化",
    "manual timing": "手動でのタイミング調整が必要",
    "projectile cover": "飛び道具を重ねる状況",
    "safe-jump claim": "詐欺飛び成立候補（資料記載）",
    "meaty claim": "持続重ね候補（資料記載）",
    "range-dependent": "距離によって変化",
    "distance-dependent": "距離によって変化",
    "rise-dependent": "受け身によって変化",
    "rise-specific": "受け身によって変化",
    "position-dependent": "画面位置によって変化",
    "position-specific": "画面位置によって変化",
    "frame-specific": "フレーム状況によって変化",
    "ender-specific": "締め方によって変化",
    "sa-specific": "使用するSAによって変化",
    "sa1-specific": "SA1使用時のみ",
    "sa2-specific": "SA2使用時のみ",
    "sa3/ca-specific": "SA3／CA使用時のみ",
  },
  position: {
    any: "画面中央・画面端共通",
    midscreen: "画面中央",
    mid: "画面中央",
    corner: "画面端",
    "near corner": "画面端付近",
    own_corner: "自分が画面端",
  },
  meter_condition: {
    "drive gaugeあり": "Dゲージが必要",
    "drive rush使用可": "ドライブラッシュを使用可能",
    "相手drive 0": "相手のDゲージが0本",
  },
};

const sequenceFieldLabels: Record<SequenceDetailField, Record<string, string>> = {
  mash_point: {
    "gap by strength": "技の強度によって割り込める箇所が変わる",
    "record 4f gaps": "4F技で割り込める箇所を撮影して確認する",
    "4f check": "4F技で割り込めるか未確認",
    "4f interrupt check": "4F技で割り込めるか未確認",
    "record 4f response": "4F技での割り込み結果を撮影して確認する",
    "gap要確認": "割り込める箇所の確認が必要",
    "strike branch": "打撃択",
  },
  throw_point: {
    "typhoon after plus": "有利時はメキシカンタイフーンを狙う",
    "record throw point": "投げを狙える箇所を撮影して確認する",
    "throw branch": "投げを狙う",
    "command/normal throw branch": "コマンド投げと通常投げを使い分ける",
    "throw/command throw branch": "通常投げとコマンド投げを使い分ける",
    "n/a": "投げ択なし",
    "なし": "投げ択なし",
  },
  shimmy_point: {
    stop: "その場で様子を見る",
    block: "ガードして様子を見る",
    "ground wait": "地上で様子を見る",
    "dr stop": "ドライブラッシュ後にその場で様子を見る",
    "cdr stop": "キャンセルドライブラッシュ後にその場で様子を見る",
    "backwalk branch": "後ろ歩きで投げ抜けを誘う",
    "walk-back branch": "後ろ歩きで投げ抜けを誘う",
    "backwalk or stop branch": "後ろ歩き、またはその場で様子を見る",
    "record shimmy spacing": "シミーが成立する間合いを撮影して確認する",
    "record back-walk branch": "後ろ歩きで投げ抜けを誘えるか撮影して確認する",
    "guard/feint branch": "ガード、またはフェイントで様子を見る",
  },
  jump_option: {
    "jump check": "ジャンプで逃げられるか未確認",
    "jump escape check": "ジャンプで逃げられるか未確認",
    "record jump escape": "ジャンプで逃げられるか撮影して確認する",
    "record jump timing": "ジャンプで逃げられるタイミングを撮影して確認する",
  },
  parry_option: {
    "parry check": "パリィで対応できるか未確認",
    "record parry answer": "パリィへの対応を撮影して確認する",
    "record parry and perfect-parry timing": "パリィとジャストパリィのタイミングを撮影して確認する",
    "parry loses to throw": "パリィには投げが有効",
  },
  drive_reversal_option: {
    "d-reversal check": "ドライブリバーサルで割り込めるか未確認",
    "record d-reversal": "ドライブリバーサルで割り込めるか撮影して確認する",
    "record d-reversal timing": "ドライブリバーサルのタイミングを撮影して確認する",
  },
  invincible_option: {
    "reversal check": "無敵技で割り込めるか未確認",
    "invincible check": "無敵技で割り込めるか未確認",
    "invincible reversal check": "無敵技で割り込めるか未確認",
    "od/sa reversal check": "OD／SA無敵技で割り込めるか未確認",
    "record reversal": "無敵技で割り込めるか撮影して確認する",
    "record od/sa reversal timing": "OD／SA無敵技のタイミングを撮影して確認する",
    "reversal bait": "無敵技をガードして反撃を狙う",
  },
};

const directionLabels: Record<string, string> = {
  "1": "後ろ斜め下",
  "2": "しゃがみ",
  "3": "前斜め下",
  "4": "後ろ",
  "5": "立ち",
  "6": "前",
  "7": "後ろジャンプ",
  "8": "垂直ジャンプ",
  "9": "前ジャンプ",
};

const strengthLabels: Record<string, string> = { L: "弱", M: "中", H: "強" };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeLiteralPattern(value: string) {
  const left = /^[A-Za-z0-9]/.test(value) ? "(?<![A-Za-z0-9])" : "";
  const right = /[A-Za-z0-9]$/.test(value) ? "(?![A-Za-z0-9])" : "";
  return `${left}${escapeRegExp(value)}${right}`;
}

function derivedGlossary(glossary: MoveGlossaryEntry[]) {
  const entries = new Map<string, string>();
  const suffixCandidates = new Map<string, Set<string>>();

  const add = (english: string | null | undefined, japanese: string | null | undefined) => {
    const from = english?.replace(/<br\s*\/?>(.*)$/i, "").trim();
    const to = japanese?.trim();
    if (!from || !to || from === to) return;
    entries.set(from, to);
    entries.set(`${from}s`, to);

    const strength = from.match(/^(.*) \((Light|Medium|Heavy|OD)\)$/i);
    if (strength) {
      const prefix = strength[2].toLowerCase() === "light" ? "L" : strength[2].toLowerCase() === "medium" ? "M" : strength[2].toLowerCase() === "heavy" ? "H" : "OD";
      const base = strength[1].trim();
      entries.set(`${prefix} ${base}`, to);
      const suffix = base.split(/\s+/).at(-1);
      if (suffix) {
        const key = `${prefix} ${suffix}`;
        const values = suffixCandidates.get(key) ?? new Set<string>();
        values.add(to);
        suffixCandidates.set(key, values);
      }
    } else {
      const suffix = from.split(/\s+/).at(-1);
      if (suffix && suffix.length >= 4) {
        const values = suffixCandidates.get(suffix) ?? new Set<string>();
        values.add(to);
        suffixCandidates.set(suffix, values);
      }
    }
  };

  for (const entry of glossary) add(entry.english, entry.japanese);
  for (const [key, values] of suffixCandidates) {
    if (values.size === 1) entries.set(key, [...values][0]);
  }

  return [...entries.entries()].sort((a, b) => b[0].length - a[0].length);
}

export function localizeComboText(value: string | number | null, glossary: MoveGlossaryEntry[] = []) {
  if (value === null) return null;
  if (typeof value === "number") return value;

  const exact = exactLabels[value.trim().toLowerCase()];
  if (exact) return exact;

  let result = value;
  for (const [english, japanese] of derivedGlossary(glossary)) {
    result = result.replace(new RegExp(safeLiteralPattern(english), "gi"), japanese);
  }
  for (const [english, japanese] of phraseLabels) {
    result = result.replace(new RegExp(safeLiteralPattern(english), "gi"), japanese);
  }

  result = result
    .replace(/\blights?\s*x(\d+)/gi, "弱攻撃×$1")
    .replace(/\bj\.([LMH])([PK])\b/gi, (_, strength: string, button: string) => `ジャンプ${strengthLabels[strength.toUpperCase()]}${button.toUpperCase()}`)
    .replace(/\b([1-9])([LMH])([PK])\b/g, (_, direction: string, strength: string, button: string) => `${directionLabels[direction]}${strengthLabels[strength]}${button}`)
    .replace(/\b([LMH])DP\b/g, (_, strength: string) => `${strengthLabels[strength]}昇龍系必殺技`)
    .replace(/\b([LMH])([PK])\b/g, (_, strength: string, button: string) => `${strengthLabels[strength]}${button}`)
    .replace(/\b([1-9])([LMH])\b/g, (_, direction: string, strength: string) => `${directionLabels[direction]}${strengthLabels[strength]}攻撃`)
    .replace(/\bAssist ([LMH])\b/gi, (_, strength: string) => `アシスト${strengthLabels[strength.toUpperCase()]}`)
    .replace(/\bCDR\b/g, "キャンセルドライブラッシュ")
    .replace(/\bDR\b/g, "ドライブラッシュ")
    .replace(/\bDI\b/g, "ドライブインパクト")
    .replace(/\bPC\b/g, "パニッシュカウンター")
    .replace(/\bCH\b/g, "カウンターヒット")
    .replace(/\bTC\b/g, "ターゲットコンボ")
    .replace(/\bModern\b/gi, "モダン")
    .replace(/^M(?=[^\sA-Za-z])/, "モダン")
    .replace(/\b([LMH])\b/g, (_, strength: string) => strengthLabels[strength])
    .replace(/\b([LMH]) (?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu, (_, strength: string) => `${strengthLabels[strength]} `)
    .replace(/\s*>\s*/g, " → ")
    .replace(/\s*~\s*/g, " → ")
    .replace(/\s*\/\s*/g, "／")
    .replace(/\s*x(\d+)-(\d+)/gi, "×$1～$2")
    .replace(/\s*x(\d+)/gi, "×$1")
    .replace(/\(/g, "（")
    .replace(/\)/g, "）")
    .replace(/(弱|中|強|OD) (?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu, "$1")
    .replace(/生 (?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu, "生")
    .replace(/\s{2,}/g, " ")
    .trim();

  return result;
}

export function localizeSequenceDetail(
  field: SequenceDetailField,
  value: string | number | null,
  glossary: MoveGlossaryEntry[] = []
) {
  if (value === null || typeof value === "number") return value;
  const natural = sequenceFieldLabels[field][value.trim().toLowerCase()];
  return natural ?? localizeComboText(value, glossary);
}

export function localizeSetupType(value: string | number | null) {
  if (value === null || typeof value === "number") return value;
  return setupTypeLabels[value.trim().toLowerCase()] ?? localizeComboText(value);
}

export function localizeSequenceType(value: string | number | null) {
  if (value === null || typeof value === "number") return value;
  return sequenceTypeLabels[value.trim().toLowerCase()] ?? localizeComboText(value);
}

export function localizeCounterType(value: string | number | null) {
  if (value === null || typeof value === "number") return value;
  return counterTypeLabels[value.trim().toLowerCase()] ?? localizeComboText(value);
}

export function localizeSetupDetail(
  field: SetupDetailField,
  value: string | number | null,
  glossary: MoveGlossaryEntry[] = []
) {
  if (value === null || typeof value === "number") return value;
  const source = value.trim();
  const natural = setupFieldLabels[field]?.[source.toLowerCase()];
  if (natural) return natural;

  if (field === "frame_advantage") {
    const claim = source.match(/^([+-]\d+)\s*F?\s+claim$/i);
    if (claim) return `${claim[1]}F（資料記載）`;

    const sourceClaim = source.match(/^Source\s+([+-]\d+)(?:\s+claim)?$/i);
    if (sourceClaim) return `${sourceClaim[1]}F（資料記載）`;

    const blockClaim = source.match(/^(?:Source\s+)?(?:guard|block)\s+([+-]\d+)\s+claim$/i);
    if (blockClaim) return `ガード時${blockClaim[1]}F（資料記載）`;

    const trailingBlockClaim = source.match(/^([+-]\d+)\s+block\s+claim$/i);
    if (trailingBlockClaim) return `ガード時${trailingBlockClaim[1]}F（資料記載）`;

    const guardHitClaim = source.match(/^Source\s+guard\s+([+-]?\d+)\s+hit\s+([+-]?\d+)\s+claim$/i);
    if (guardHitClaim) {
      const guard = guardHitClaim[1] === "0" ? "±0" : guardHitClaim[1];
      const hit = guardHitClaim[2] === "0" ? "±0" : guardHitClaim[2];
      return `ガード時${guard}F／ヒット時${hit}F（資料記載）`;
    }

    const hitGuardClaim = source.match(/^hit\s+([+-]?\d+)\s*\/\s*guard\s+([+-]?\d+)\s+claim$/i);
    if (hitGuardClaim) {
      const hit = hitGuardClaim[1] === "0" ? "±0" : hitGuardClaim[1];
      const guard = hitGuardClaim[2] === "0" ? "±0" : hitGuardClaim[2];
      return `ヒット時${hit}F／ガード時${guard}F（資料記載）`;
    }

    const rangeClaim = source.match(/^([+-]\d+)\s+to\s+([+-]\d+)\s+claims?$/i);
    if (rangeClaim) return `${rangeClaim[1]}～${rangeClaim[2]}F（資料記載）`;

    const approximateGuardClaim = source.match(/^guard\s+approximately\s+([+-]?\d+)\s+claim$/i);
    if (approximateGuardClaim) {
      const guard = approximateGuardClaim[1] === "0" ? "±0" : approximateGuardClaim[1];
      return `ガード時およそ${guard}F（資料記載）`;
    }

    const safeJumpClaim = source.match(/^(\d+)F\s+safe-jump\s+claim$/i);
    if (safeJumpClaim) return `${safeJumpClaim[1]}F詐欺飛び成立候補（資料記載）`;

    if (/^\+42\s+family$/i.test(source)) return "+42F系統（資料記載）";
    if (/^\+42\s+safe-jump$/i.test(source)) return "+42Fの詐欺飛び";
    if (/^oki\s+claim$/i.test(source)) return "起き攻め可能（資料記載）";
    if (/^frame-kill\s+claim$/i.test(source)) return "フレーム消費成立候補（資料記載）";
    if (/^not a true throw meaty$/i.test(source)) return "投げは最速で重ならない";
    if (/^DI return possible claim$/i.test(source)) return "ドライブインパクト返しが可能（資料記載）";
  }

  if (field === "meter_condition") {
    const driveMinimum = source.match(/^Drive\s+(\d+)\+$/i);
    if (driveMinimum) return `Dゲージ${driveMinimum[1]}本以上`;

    const driveGaugeMinimum = source.match(/^Drive\s+Gauge\s+(\d+)本以上$/i);
    if (driveGaugeMinimum) return `Dゲージ${driveGaugeMinimum[1]}本以上`;
  }

  return localizeComboText(value, glossary);
}

export function localizeBlockstring(value: boolean | null) {
  if (value === true) return "連続ガードになる";
  if (value === false) return "連続ガードではない";
  return null;
}

export function localizeCounterText(value: string | number | null, glossary: MoveGlossaryEntry[] = []) {
  if (value === null || typeof value === "number") return value;

  const counterType = counterTypeLabels[value.trim().toLowerCase()];
  if (counterType) return counterType;

  if (value.trim().toLowerCase() === "drive impact") return "ドライブインパクト";
  if (value.trim().toLowerCase() === "exact distance/gap remains training dependent.") {
    return "正確な距離と連携の隙間は、トレーニングモードで確認が必要です。";
  }
  if (value === "verified Frameは入口としてのみ使用し、4F技・中距離反撃・SA候補を実距離で再現する。") {
    return "検証済みのフレーム情報を目安に、4F技・中距離からの反撃・SAを実際の間合いで確認します。";
  }
  if (value === "mine-dependent variantsは現行DBでも一部review backlog。未確認の爆発連携を確定扱いしない。") {
    return "地雷の有無で変わる派生は、一部が実機確認待ちです。未確認の爆発連携は確定情報として扱いません。";
  }

  const matchupTitle = value.trim().match(/^(.+?)\s+vs\s+(.+?)\s+対面対策$/i);
  if (matchupTitle) return `${matchupTitle[1]}使用時の${matchupTitle[2]}対策`;

  let result = value
    .replace(/current verified Frame/gi, "現行版の検証済みフレーム情報")
    .replace(/verified Frame/gi, "検証済みのフレーム情報")
    .replace(/mine-dependent variants/gi, "地雷の有無で変わる派生")
    .replace(/review backlog/gi, "実機確認待ち")
    .replace(/\b[a-z0-9-]+-approach\s*\/\s*punish\s*\/\s*air\s*\/\s*corner\s*\/\s*zoning\b/gi, "接近阻止・確定反撃・対空・画面端・遠距離戦の各項目")
    .replace(/子Counter(\d+)件を参照/gi, "関連する$1件の対策を確認します")
    .replace(/子Counter(\d+)件/gi, "関連する対策$1件")
    .replace(/verified\s*\/\s*published/gi, "検証済み・公開済み")
    .replace(/\breviewed\b/gi, "内容確認済み")
    .replace(/\bverified\b/gi, "検証済み")
    .replace(/\bpublished\b/gi, "公開済み")
    .replace(/\bTraining\b/g, "トレーニングモード")
    .replace(/トレモ/g, "トレーニングモード")
    .replace(/2026\.08\.03基準。距離と実機再現を確認。/g, "2026.08.03版を基準に、距離と実機での再現性を確認します。")
    .replace(/実機確認前は検証済み・公開済みへ昇格しない。/g, "実機確認が終わるまでは、検証済み・公開済みとして扱いません。")
    .replace(/(.+?)戦の対面固有判断を、旧共通テンプレートではなく再現可能な項目として残せる。/g, "$1戦で必要な判断を、状況ごとに練習できます。")
    .replace(/(.+?)戦の対戦前確認からトレーニングモード再検証までを一つの親対面として辿れる。/g, "$1戦で確認したいポイントと、トレーニングモードでの再確認項目を一つのページで確認できます。")
    .replace(/相手カードの勝ち筋・距離別行動を別スロットに録画し、JP側回答を確定\/相打ち\/読み\/不成立へ分類する。/g, "相手の主な勝ち筋と距離別の行動を分けて録画し、JP側の対応を「確定」「相打ち」「読み合い」「不成立」に分類します。")
    .replace(/別スロットに?録画/g, "行動ごとに分けて録画")
    .replace(/【候補・2026\.08\.03再監査】保存済み初版攻略を移植。/g, "2026.08.03版以降で再確認が必要です。")
    .replace(/保存済み初版攻略を移植。/g, "過去資料の内容を現行版向けに再確認します。")
    .replace(/最優先再監査:/g, "優先確認項目：")
    .replace(/再監査/g, "再確認")
    .replace(/現行トレモ確認前に確定しない。/g, "現行版のトレーニングモードで確認するまでは確定情報として扱いません。")
    .replace(/JP対面では/g, "JP戦では")
    .replace(/接近手段を最低4スロットへ分け/g, "接近手段を4種類以上に分けて録画し")
    .replace(/各項目\s+を/g, "各項目を")
    .replace(/一つの親対面として辿れる。/g, "一つの対面ページから確認できます。")
    .replace(/確定・相打ち・読み・不成立を区別する。/g, "確定・相打ち・読み合い・不成立を区別します。")
    .replace(/接近阻止・確反候補・対空\/特殊軌道・画面端防御・弾\/設置の5項目へ分解した。/g, "接近阻止、確定反撃候補、対空・特殊軌道、画面端防御、飛び道具・設置技の5項目に分けています。")
    .replace(/距離、連携間隔、DI、弾相互作用、ODアムネジア後状況など実機依存項目は内容確認済みのまま扱う。/g, "距離、連携の間隔、ドライブインパクト、飛び道具同士の相互作用、ODアムネジア後の状況は、実機確認が終わるまで検証済みとは扱いません。");

  result = String(localizeComboText(result, glossary));
  return result.replace(/\s+vs\s+/gi, "対");
}

export function localizeTrainingType(value: string | number | null) {
  if (value === null || typeof value === "number") return value;
  return trainingTypeLabels[value.trim().toLowerCase()] ?? localizeComboText(value);
}

export function localizeTrainingLevel(value: string | number | null) {
  if (value === null || typeof value === "number") return value;
  return trainingLevelLabels[value.trim().toLowerCase()] ?? localizeComboText(value);
}

export function localizeTrainingText(
  field: TrainingDetailField,
  value: string | number | null,
  glossary: MoveGlossaryEntry[] = []
) {
  if (value === null || typeof value === "number") return value;

  let result = String(localizeComboText(value, glossary))
    .replace(/\bClassic\b/gi, "クラシック")
    .replace(/\bAssist\b/gi, "アシスト")
    .replace(/\bBnB\b/gi, "基本コンボ")
    .replace(/\bCPU操作\s*[:：]\s*OFF\b/gi, "CPU操作：オフ")
    .replace(/\bCPU\s*OFF\b/gi, "CPU操作：オフ")
    .replace(/\bFrame\s*Meter\s*ON\b/gi, "フレームメーター：オン")
    .replace(/フレーム表示\s*ON\b/gi, "フレームメーター：オン")
    .replace(/入力履歴・ダメージ表示\s*ON\b/gi, "入力履歴とダメージ表示：オン")
    .replace(/入力履歴\s*ON\b/gi, "入力履歴：オン")
    .replace(/ガード\s*OFF\b/gi, "ガード：オフ")
    .replace(/\bGuard\s*OFF\b/gi, "ガード：オフ")
    .replace(/\b(?:Guard\s*Random|Random\s*Guard)\b/gi, "ランダムガード")
    .replace(/\bON\b/g, "オン")
    .replace(/\bOFF\b/g, "オフ")
    .replace(/\bverified候補/gi, "検証候補")
    .replace(/\breviewed候補/gi, "内容確認候補")
    .replace(/\breviewed\b/gi, "内容確認済み")
    .replace(/\bverified\b/gi, "検証済み")
    .replace(/\bunverified\b/gi, "未検証")
    .replace(/\brejected\b/gi, "不成立")
    .replace(/\barchived\b/gi, "アーカイブ")
    .replace(/\bPlayback\b/gi, "再生")
    .replace(/\bTraining\b/gi, "トレーニング")
    .replace(/\bSource\b/gi, "出典")
    .replace(/\bDamage\b/gi, "ダメージ")
    .replace(/文章・画像から収集した攻略の2026-08-03版成立を確定する。/g, "文章・画像で確認した内容が、2026.08.03版でも成立するか確認します。")
    .replace(/\bDリバ/g, "ドライブリバーサル")
    .replace(/バクステ/g, "バックステップ")
    .replace(/パニカン/g, "パニッシュカウンター")
    .replace(/トレモ/g, "トレーニングモード")
    .replace(/確反/g, "確定反撃")
    .replace(/(^|[^一-龠々])屈(?=[弱中強][PK])/g, "$1しゃがみ")
    .replace(/(^|[^一-龠々])立(?=[弱中強][PK])/g, "$1立ち")
    .replace(/\bJ([弱中強])([PK])\b/g, "ジャンプ$1$2")
    .replace(/\b2([弱中強])([PK])\b/g, "しゃがみ$1$2")
    .replace(/\b5([弱中強])([PK])\b/g, "立ち$1$2")
    .replace(/\b6([弱中強])([PK])\b/g, "前$1$2")
    .replace(/\b4([弱中強])([PK])\b/g, "後ろ$1$2")
    .replace(/\b1P\s*／\s*2P\b/g, "1P側／2P側")
    .replace(/ヒット\s*／\s*ガード/g, "ヒット時／ガード時")
    .replace(/成立なら検証候補。不成立ならアーカイブ。/g, "成立した場合は検証候補にし、不成立ならアーカイブします。")
    .replace(/成立なら内容確認済み、非成立ならアーカイブへ。/g, "成立した場合は内容確認済みに更新し、不成立ならアーカイブします。")
    .replace(/現行版での実機確認待ちへ進む。/g, "現行版で実機確認します。")
    .replace(/短尺ループと説明クリップへ分割。/g, "短いループ動画と説明用クリップに分けます。")
    .replace(/必要な動作だけ個別再生。/g, "必要な動作だけを個別に再生します。")
    .replace(/左右各(\d+)回で成立、/g, "左右各$1回試し、成立可否、")
    .replace(/(^|[。！？]\s*)4F、/g, "$14F技、")
    .replace(/、無敵を必要時に録画。/g, "、無敵技を必要に応じて録画します。")
    .replace(/CPU操作：オフ。/g, "CPU操作：オフ。")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (field === "recording_instructions") {
    result = result.replace(/^ダミー立ち、/g, "ダミーを立ち状態にし、");
  }

  return result;
}

export function localizeDifficulty(value: string | number | null) {
  if (value === null || value === "") return null;
  return `レベル${value}`;
}

export function localizeSourceType(value: string) {
  return ({
    article: "記事",
    character_guide: "キャラクター攻略",
    community: "コミュニティ情報",
    community_aggregator: "コミュニティ集約情報",
    community_article: "コミュニティ記事",
    community_discussion: "コミュニティ投稿",
    community_frame_database: "コミュニティフレームデータ",
    official_patch: "公式パッチノート",
    official_patch_notes: "公式パッチノート",
    official: "公式情報",
    official_frame_data: "公式フレームデータ",
    official_movelist: "公式技表",
    official_guide: "公式ガイド",
    community_guide: "攻略記事",
    community_video: "コミュニティ動画",
    community_wiki: "コミュニティWiki",
    frame_data: "フレームデータ",
    frame_database: "フレームデータベース",
    guide: "攻略記事",
    note: "攻略記事",
    player_database: "プレイヤーデータベース",
    strategy: "攻略情報",
    video: "動画",
    video_guide: "解説動画",
    social_post: "SNS投稿",
  } as Record<string, string>)[value] ?? value;
}

export function localizeSourceRelationship(value: string) {
  return ({
    baseline: "基準資料",
    candidate: "候補資料",
    candidate_basis: "候補の根拠",
    contradicting: "相反する情報",
    corroborating: "裏付け資料",
    current_patch_context: "現行パッチ情報",
    derived: "算出根拠",
    patch_baseline: "パッチ基準",
    primary: "主要根拠",
    reference: "参考資料",
    supporting: "補足根拠",
    verification: "検証根拠",
    patch_context: "パッチ情報",
  } as Record<string, string>)[value] ?? value;
}
