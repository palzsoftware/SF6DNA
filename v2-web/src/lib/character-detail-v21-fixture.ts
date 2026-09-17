import type { DevicePreviewBundle } from "@/lib/device-preview";

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
      { id: "1ca819b0-3ec0-48e6-8f9a-7b69a7a84d42", slug: "ryu-corner-od-tatsu-sa1", name: "端OD竜巻・SA1ルート", purpose: "SA1火力候補", damage: null, driveCost: null, saCost: null, difficulty: "4", status: "draft", verificationStatus: "reviewed" },
      { id: "599e4a07-7573-4814-a52a-a4686dd09b49", slug: "ryu-basic-light-shoryu", name: "小技始動・強昇龍拳締め", purpose: "基本・小技確認候補", damage: null, driveCost: null, saCost: null, difficulty: "1", status: "draft", verificationStatus: "reviewed" },
      { id: "0ed53837-003d-4bc0-a811-76726372ec25", slug: "ryu-basic-light-tatsu", name: "小技始動・弱竜巻締め", purpose: "起き攻め移行候補", damage: null, driveCost: null, saCost: null, difficulty: "1", status: "draft", verificationStatus: "reviewed" },
    ],
    setups: [
      { id: "7e84181f-555e-4b95-8528-0447bf3c5d2b", slug: "ryu-h-shoryu-dr-shimmy", name: "強昇龍締め→生ラッシュ自動シミー", setupType: "oki", description: "強昇龍拳でダウンを取る → 生ラッシュで接近 → 後ろ歩きで投げ抜けを確認する", frameAdvantage: "要トレモ確認", position: "中央・後方受け身候補", status: "draft", verificationStatus: "reviewed" },
      { id: "ac1b6fb6-95d7-4725-8692-c4b9494a3914", slug: "ryu-l-tatsu-dr-shimmy", name: "弱竜巻締め→生ラッシュ後ろ歩き", setupType: "oki", description: "弱竜巻旋風脚でダウンを取る → 生ラッシュで接近 → 後ろ歩きで投げ抜けを空振らせる", frameAdvantage: "要トレモ確認", position: "中央候補", status: "draft", verificationStatus: "reviewed" },
    ],
    sequences: [
      { id: "974a52a7-3af7-4c07-a84d-cc474737b649", slug: "ryu-crmp-pressure", name: "しゃがみ中Pからの継続候補", sequenceType: "pressure", sequenceText: "しゃがみ中Pガード後 → 投げ / 4F打撃 / 後ろ歩き", notes: "距離と各選択肢は実機確認が必要です。確定連携としては扱いません。", status: "draft", verificationStatus: "reviewed" },
      { id: "fd282142-945f-435c-9efb-e5bb3964721b", slug: "ryu-corner-throw-loop", name: "画面端 前投げ後の選択肢", sequenceType: "oki_pressure", sequenceText: "前投げ後 → 投げ / 打撃 / シミー", notes: "厳密なフレームは未検証です。Previewで見せ方だけを確認します。", status: "draft", verificationStatus: "reviewed" },
    ],
  },
  jp: {
    ...sharedEmpty,
    combos: [
      { id: "f4b028b9-3137-459a-9339-003bde34c9ed", slug: "jp-basic-light-sa3", name: "小技始動 SA3基本", purpose: "小技確認からSA3へつなぐ候補", damage: null, driveCost: 0, saCost: 3, difficulty: "1", status: "draft", verificationStatus: "reviewed" },
      { id: "31a791ff-97a2-4160-89b2-3dd78fcb9d68", slug: "jp-light-cdr-sa1", name: "小技CDRからSA1", purpose: "小技から火力と運びを取る候補", damage: null, driveCost: 3, saCost: 1, difficulty: "3", status: "draft", verificationStatus: "reviewed" },
      { id: "797eda8e-1075-4547-830e-11d4037e1d8c", slug: "jp-dr-mk-sa3", name: "DR中K始動 SA3", purpose: "ラッシュ始動リーサル候補", damage: null, driveCost: 1, saCost: 3, difficulty: "2", status: "draft", verificationStatus: "reviewed" },
    ],
    setups: [
      { id: "b6a2127b-100c-433a-a88d-7450eb62e401", slug: "jp-safejump42-after-di-pc", name: "DIパニカン後 +42F詐欺飛び候補", setupType: "safejump", description: "Drive Impactのパニッシュカウンターを取る → ダウンを取る → ジャンプ攻撃を重ねる", frameAdvantage: "+42F表記・要実機確認", position: "位置条件を要確認", status: "draft", verificationStatus: "reviewed" },
      { id: "bae99ed3-9530-4121-9eaf-3ebf2ef6330b", slug: "jp-vihhat-plus15-after-di-pc", name: "DIパニカン後ヴィーハト候補", setupType: "oki", description: "Drive Impactのパニッシュカウンターを取る → ヴィーハトを設置する → 設置を残して起き攻めへ移る", frameAdvantage: "+15F表記・要実機確認", position: "位置条件を要確認", status: "draft", verificationStatus: "reviewed" },
    ],
    sequences: [
      { id: "768bb0bb-fbb2-4233-a89b-2f85b62338b3", slug: "jp-5hk-plus2-pressure", name: "5HKガード後の近距離選択肢", sequenceType: "pressure", sequenceText: "5HKガード後 → 打撃 / 投げ / シミー", notes: "距離・連係の隙間・選択肢は未検証です。Previewで見せ方だけを確認します。", status: "draft", verificationStatus: "unverified" },
      { id: "5f8ef55c-13cf-47f6-9997-8549f1fb039e", slug: "jp-vihhat-trigger-pressure", name: "ヴィーハト起動を使った固め候補", sequenceType: "setup_pressure", sequenceText: "ヴィーハト設置 → 本体の打撃 / 投げ → 設置起動", notes: "正確な隙間は未検証です。確定連係としては扱いません。", status: "draft", verificationStatus: "unverified" },
    ],
  },
};

export function getCharacterDetailV21Fixture(slug: string): DevicePreviewBundle | null {
  return slug === "ryu" || slug === "jp" ? fixtures[slug] : null;
}
