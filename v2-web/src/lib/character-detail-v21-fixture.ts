import type { DevicePreviewBundle } from "@/lib/device-preview";
import { jpMoveReviewFixture } from "@/lib/jp-move-review-fixture";

const sharedEmpty: Pick<DevicePreviewBundle, "guideSections" | "moves" | "matchups" | "training"> = {
  guideSections: [],
  moves: [],
  matchups: [],
  training: [],
};

const fixtures: Record<"ryu" | "jp", DevicePreviewBundle> = {
  ryu: {
    ...sharedEmpty,
    combos: [
      { id: "1ca819b0-3ec0-48e6-8f9a-7b69a7a84d42", slug: "ryu-corner-od-tatsu-sa1", name: "端OD竜巻・SA1ルート", purpose: "画面端でSA1へつなぐ火力候補", category: "sa", command: "小技×3 ＞ OD竜巻旋風脚 ＞ ドライブラッシュ立ち中P ＞ キャンセルラッシュしゃがみ強P ＞ 強上段足刀蹴り ＞ SA1", startCondition: "小技始動", endCondition: "Drive GaugeとSA1を使用", position: "画面端", patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://sf6-genten.com/character/ryu/category/combo", damage: null, driveCost: null, saCost: null, difficulty: "4", status: "draft", verificationStatus: "reviewed" },
      { id: "599e4a07-7573-4814-a52a-a4686dd09b49", slug: "ryu-basic-light-shoryu", name: "小技始動・強昇龍拳締め", purpose: "近距離の小技確認からダウンを取る基本候補", category: "basic", command: "しゃがみ弱K ＞ 立ち弱P ＞ 立ち弱P ＞ 強昇龍拳", startCondition: "近距離でしゃがみ弱Kがヒット", endCondition: "強昇龍拳でダウン", position: "中央 / 画面端", patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://sf6-genten.com/character/ryu/category/combo", damage: null, driveCost: null, saCost: null, difficulty: "1", status: "draft", verificationStatus: "reviewed" },
      { id: "0ed53837-003d-4bc0-a811-76726372ec25", slug: "ryu-basic-light-tatsu", name: "小技始動・弱竜巻締め", purpose: "弱竜巻旋風脚で締め、次の起き攻めへ移る候補", category: "basic", command: "しゃがみ弱K ＞ 立ち弱P ＞ 立ち弱P ＞ 弱竜巻旋風脚", startCondition: "近距離でしゃがみ弱Kがヒット", endCondition: "弱竜巻旋風脚でダウン", position: "中央 / 画面端", patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://sf6-genten.com/character/ryu/category/combo", damage: null, driveCost: null, saCost: null, difficulty: "1", status: "draft", verificationStatus: "reviewed" },
    ],
    setups: [
      { id: "7e84181f-555e-4b95-8528-0447bf3c5d2b", slug: "ryu-h-shoryu-dr-shimmy", name: "強昇龍締め→生ラッシュ自動シミー", setupType: "oki", description: "強昇龍拳でダウンを取る → 生ドライブラッシュで接近 → しゃがみガードで投げ抜けを空振らせる", command: "生ドライブラッシュ ＞ しゃがみガード", startCondition: "小技×3 ＞ 強昇龍拳", successCondition: "後方受け身への投げ抜けを空振らせる", opponentOptions: "投げ抜け / 中足 / 無敵技を要確認", failureCondition: "後方受け身以外、または距離がずれた場合", damage: null, driveCost: null, saCost: null, difficulty: null, patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://www.sf6-genten.com/character/ryu", frameAdvantage: "要トレモ確認", position: "中央・後方受け身候補", status: "draft", verificationStatus: "reviewed" },
      { id: "ac1b6fb6-95d7-4725-8692-c4b9494a3914", slug: "ryu-l-tatsu-dr-shimmy", name: "弱竜巻締め→生ラッシュ後ろ歩き", setupType: "oki", description: "弱竜巻旋風脚でダウンを取る → 生ドライブラッシュで接近 → 後ろ歩きで投げ抜けを空振らせる", command: "生ドライブラッシュ ＞ 後ろ歩き", startCondition: "小技×3 ＞ 弱竜巻旋風脚", successCondition: "投げ抜けの空振りを確認して反撃", opponentOptions: "中足暴れとの相互作用を要確認", failureCondition: "相手の受け身や距離で後ろ歩きが間に合わない場合", damage: null, driveCost: null, saCost: null, difficulty: null, patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://www.sf6-genten.com/character/ryu", frameAdvantage: "要トレモ確認", position: "中央候補", status: "draft", verificationStatus: "reviewed" },
    ],
    sequences: [
      { id: "974a52a7-3af7-4c07-a84d-cc474737b649", slug: "ryu-crmp-pressure", name: "しゃがみ中Pからの継続候補", sequenceType: "pressure", sequenceText: "しゃがみ中Pガード後 ＞ 投げ / 4F打撃 / 後ろ歩き", purpose: "ガード後の五分状況から相手の反応を確認する", gap: "未確認", throwOption: "投げ", strikeOption: "4F打撃", driveImpactOption: "未確認", punishability: "距離と選択肢ごとに要確認", condition: "しゃがみ中Pをガードさせた近距離", damage: null, driveCost: null, saCost: null, patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://www.sf6-genten.com/character/ryu", notes: "距離と各選択肢は実機確認が必要です。確定連携としては扱いません。", status: "draft", verificationStatus: "reviewed" },
      { id: "fd282142-945f-435c-9efb-e5bb3964721b", slug: "ryu-corner-throw-loop", name: "画面端 前投げ後の選択肢", sequenceType: "oki_pressure", sequenceText: "前投げ後 ＞ 投げ / 打撃 / シミー", purpose: "画面端で投げ・打撃・後ろ歩きを使い分ける", gap: "未確認", throwOption: "投げ", strikeOption: "打撃", driveImpactOption: "未確認", punishability: "各選択肢の厳密なフレームを要確認", condition: "画面端で前投げ後", damage: null, driveCost: null, saCost: null, patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://www.sf6-genten.com/character/ryu", notes: "厳密なフレームは未検証です。確定連携としては扱いません。", status: "draft", verificationStatus: "reviewed" },
    ],
  },
  jp: {
    ...sharedEmpty,
    moves: jpMoveReviewFixture,
    combos: [
      { id: "f4b028b9-3137-459a-9339-003bde34c9ed", slug: "jp-basic-light-sa3", name: "小技始動 SA3基本", purpose: "近距離の小技確認からSA3へつなぐ候補", category: "confirm", command: "5LP ＞ 5LP ＞ 5LP ＞ 弱ストリボーグ ＞ SA3 ザプリェット", startCondition: "5LPがヒット", endCondition: "SA3を使用", position: "中央 / 画面端", patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://pachi-mea.com/sf6-wiki/10259/", damage: null, driveCost: 0, saCost: 3, difficulty: "1", status: "draft", verificationStatus: "reviewed" },
      { id: "31a791ff-97a2-4160-89b2-3dd78fcb9d68", slug: "jp-light-cdr-sa1", name: "小技CDRからSA1", purpose: "小技からキャンセルラッシュを使い、SA1まで運ぶ候補", category: "confirm", command: "5LP ＞ 5LP ＞ 5LP ＞ CDR ＞ 5LP ＞ 5MP ＞ 派生MP ＞ SA1 チェルノボーグ", startCondition: "5LPがヒット", endCondition: "Drive Gauge 3本とSA1を使用", position: "中央 / 画面端", patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://pachi-mea.com/sf6-wiki/10259/", damage: null, driveCost: 3, saCost: 1, difficulty: "3", status: "draft", verificationStatus: "reviewed" },
      { id: "797eda8e-1075-4547-830e-11d4037e1d8c", slug: "jp-dr-mk-sa3", name: "DR中K始動 SA3", purpose: "ドライブラッシュ中K始動からSA3へつなぐ候補", category: "neutral", command: "DR ＞ 5MK ＞ 5MP ＞ 中ストリボーグ ＞ SA3 ザプリェット", startCondition: "ドライブラッシュ5MKがヒット", endCondition: "Drive Gauge 1本とSA3を使用", position: "中央 / 画面端", patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://pachi-mea.com/sf6-wiki/10259/", damage: null, driveCost: 1, saCost: 3, difficulty: "2", status: "draft", verificationStatus: "reviewed" },
    ],
    setups: [
      { id: "b6a2127b-100c-433a-a88d-7450eb62e401", slug: "jp-safejump42-after-di-pc", name: "DIパニカン後 +42F詐欺飛び候補", setupType: "safejump", description: "垂直JHK → ディレイ5HK → 中ストリボーグ → 5HP → 中ストリボーグ → 前ジャンプ攻撃", command: "垂直JHK ＞ ディレイ5HK ＞ 中ストリボーグ ＞ 5HP ＞ 中ストリボーグ ＞ 前ジャンプ攻撃", startCondition: "Drive Impactのパニッシュカウンター", successCondition: "+42F状況からジャンプ攻撃を重ねる", opponentOptions: "キャラクター別の起き上がり行動を要確認", failureCondition: "受け身や距離が想定と異なる場合", damage: null, driveCost: null, saCost: null, difficulty: null, patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://pachi-mea.com/sf6-wiki/10259/", frameAdvantage: "+42F表記・要実機確認", position: "位置条件を要確認", status: "draft", verificationStatus: "reviewed" },
      { id: "bae99ed3-9530-4121-9eaf-3ebf2ef6330b", slug: "jp-vihhat-plus15-after-di-pc", name: "DIパニカン後ヴィーハト候補", setupType: "oki", description: "垂直JHK → ディレイ5HK → 中ストリボーグ → 5HP → ヴィーハト", command: "垂直JHK ＞ ディレイ5HK ＞ 中ストリボーグ ＞ 5HP ＞ ヴィーハト", startCondition: "Drive Impactのパニッシュカウンター", successCondition: "ヴィーハトを残して起き攻めへ移る", opponentOptions: "受け身・暴れ・無敵技を要確認", failureCondition: "設置位置や距離がずれた場合", damage: null, driveCost: null, saCost: null, difficulty: null, patch: "2026.08.03", sourceLabel: "記事を読む", sourceUrl: "https://pachi-mea.com/sf6-wiki/10259/", frameAdvantage: "+15F表記・要実機確認", position: "位置条件を要確認", status: "draft", verificationStatus: "reviewed" },
    ],
    sequences: [
      { id: "768bb0bb-fbb2-4233-a89b-2f85b62338b3", slug: "jp-5hk-plus2-pressure", name: "5HKガード後の近距離選択肢", sequenceType: "pressure", sequenceText: "5HKガード後 ＞ 打撃 / 投げ / シミー", purpose: "5HKガード後の有利状況から相手の守り方を確認する", gap: "未確認", throwOption: "投げ", strikeOption: "打撃", driveImpactOption: "未確認", punishability: "派生ごとの距離と隙間を要確認", condition: "5HKを近距離でガードさせる", damage: null, driveCost: null, saCost: null, patch: "2026.08.03", sourceLabel: "公式情報を見る", sourceUrl: "https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/jp", notes: "距離・連係の隙間・選択肢は未検証です。確定連携としては扱いません。", status: "draft", verificationStatus: "unverified" },
      { id: "5f8ef55c-13cf-47f6-9997-8549f1fb039e", slug: "jp-vihhat-trigger-pressure", name: "ヴィーハト起動を使った固め候補", sequenceType: "setup_pressure", sequenceText: "ヴィーハト設置 ＞ 本体の打撃 / 投げ ＞ 設置起動", purpose: "設置を残した状態で打撃と投げの選択を迫る", gap: "未確認", throwOption: "投げ", strikeOption: "本体打撃", driveImpactOption: "未確認", punishability: "設置位置と起動タイミングごとに要確認", condition: "ヴィーハト設置後", damage: null, driveCost: null, saCost: null, patch: "2026.08.03", sourceLabel: "YouTubeで見る", sourceUrl: "https://www.youtube.com/watch?v=o6zXaO4iIz0", notes: "正確な隙間は未検証です。確定連係としては扱いません。", status: "draft", verificationStatus: "unverified" },
    ],
  },
};

export function getCharacterDetailV21Fixture(slug: string): DevicePreviewBundle | null {
  return slug === "ryu" || slug === "jp" ? fixtures[slug] : null;
}
