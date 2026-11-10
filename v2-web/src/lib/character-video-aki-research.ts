import type { VideoSummary } from "@/lib/event-media";
/** A.K.I. source-traced videos, Preview-only. Patch, gameplay and playback verification pending. */
const candidates = [
  {
    "id": "AA0O7ZR_MFU",
    "title": "2026年1月版A.K.I.コンボ集",
    "channel": "ちょくじゅ",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=AA0O7ZR_MFU"
  },
  {
    "id": "CEv4vRv6rzg",
    "title": "A.K.I.強化後のコンボ研究",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=CEv4vRv6rzg"
  },
  {
    "id": "amLZptGY4G0",
    "title": "ひかる A.K.I. 高レベル対戦・毒を使う展開",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=amLZptGY4G0"
  },
  {
    "id": "2kBkizvG7eM",
    "title": "How to play A.K.I in SF6 - A Complete Guide",
    "channel": "Broski",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=2kBkizvG7eM"
  },
  {
    "id": "ApDAuGnwEvY",
    "title": "Broski A.K.I. 高レベル対戦とコンボ",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=ApDAuGnwEvY"
  },
  {
    "id": "gDv7DUtECVk",
    "title": "ひかる A.K.I. vs あくたがわ マノン",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=gDv7DUtECVk"
  },
  {
    "id": "Oo6LTXs1GeA",
    "title": "ひかる A.K.I. 新環境の対戦リプレイ",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Oo6LTXs1GeA"
  },
  {
    "id": "wPjdzuf1Z3w",
    "title": "ひかる A.K.I. vs YAS リュウ",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=wPjdzuf1Z3w"
  },
  {
    "id": "8EhRVlqc0nM",
    "title": "ひかる A.K.I. vs かずのこ アルジュン",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=8EhRVlqc0nM"
  },
  {
    "id": "7RiZ0p3h5hA",
    "title": "SFL2026 ガチくん ラシード vs ひかる A.K.I.",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=7RiZ0p3h5hA"
  },
  {
    "id": "Vi0lUTPCUMw",
    "title": "SFL2026 ふ～ど エド vs ひかる A.K.I.",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Vi0lUTPCUMw"
  },
  {
    "id": "j7MAQsGE2es",
    "title": "ひかる A.K.I. 高レベル対戦・猛毒展開",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=j7MAQsGE2es"
  },
  {
    "id": "HlkqZ2UV-l0",
    "title": "モダンA.K.I. 初心者向けコンボ・立ち回り",
    "channel": "れおなるど",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=HlkqZ2UV-l0"
  },
  {
    "id": "6gqlW_gmRqg",
    "title": "A.K.I. クラシック操作コンボ・セットプレイ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=6gqlW_gmRqg"
  },
  {
    "id": "dBP_oXWB2jc",
    "title": "A.K.I. 生ラッシュ起き攻めコンボ集",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/setplay.html"
  },
  {
    "id": "ohi5cFBwMjI",
    "title": "A.K.I. ノーゲージ起き攻め集",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/setplay.html"
  },
  {
    "id": "tkHuO_p50x0",
    "title": "A.K.I. 強蛇頭鞭後の44F起き攻め",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/setplay.html"
  },
  {
    "id": "MZMzVgBJNMI",
    "title": "A.K.I. 投げ後19F状況の起き攻め",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/setplay.html"
  },
  {
    "id": "DeAPB1maF00",
    "title": "A.K.I. 毒沼設置後38F状況の起き攻め",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/setplay.html"
  },
  {
    "id": "JeoXm1S9K1M",
    "title": "A.K.I. Year3中央・立ち回りコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo.html"
  },
  {
    "id": "KfbRs95Ra1w",
    "title": "A.K.I. Year3生ラッシュ始動コンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo.html"
  },
  {
    "id": "XCshC5QvmJQ",
    "title": "A.K.I. Year3ジャンプ攻撃始動コンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo.html"
  },
  {
    "id": "udhGheS8sJM",
    "title": "A.K.I. Year3打ち返し・カウンターコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo.html"
  },
  {
    "id": "91lKoPohb24",
    "title": "A.K.I. Year3暴れ潰し・相打ち始動コンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo.html"
  },
  {
    "id": "Nni-pcLAj_o",
    "title": "A.K.I. 強蛇頭鞭毒破裂コンボルート",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo.html"
  },
  {
    "id": "54PMK57AbCk",
    "title": "A.K.I. 中蛇頭鞭毒破裂コンボルート",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo.html"
  },
  {
    "id": "CVoCFIV5FO0",
    "title": "A.K.I. 画面端の毒破裂コンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo.html"
  },
  {
    "id": "gcU_t--zG4c",
    "title": "A.K.I. 旧版立弱P・渾沌コンボ（毒なし）",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "IKQ37xInB-k",
    "title": "A.K.I. 旧版立弱P・渾沌コンボ（毒あり）",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "T9TymHydV0Y",
    "title": "A.K.I. 旧版中Pカウンター・毒ありコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "kDM1bJlhNbo",
    "title": "A.K.I. 旧版窮奇始動コンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "EtHqfPPhojg",
    "title": "A.K.I. 旧版しゃがみ弱P始動コンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "BDdNar5aMSI",
    "title": "A.K.I. 旧版立強K始動・毒なしコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "gxpR6uNxqzM",
    "title": "A.K.I. 旧版立強K始動・毒ありコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "V2C4LO7WATE",
    "title": "A.K.I. 旧版しゃがみ弱K・生ラッシュコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "9V2BmPEh2Qg",
    "title": "A.K.I. 旧版しゃがみ中Kコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "eGXh7Ow__sg",
    "title": "A.K.I. 旧版しゃがみ強Kパニッシュカウンターコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "vmPU-i4-hrU",
    "title": "A.K.I. 旧版インパクト壁コンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "U0wOgh1hAk0",
    "title": "A.K.I. 旧版画面端限定コンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "yEOdsJSmN6U",
    "title": "A.K.I. 旧版インパクトパニッシュカウンターコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "IsiR1R1dAf4",
    "title": "A.K.I. 旧版毒ありインパクトパニッシュカウンターコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  },
  {
    "id": "_JJPstGL-bU",
    "title": "A.K.I. 旧版対空インパクトパニッシュカウンターコンボ",
    "channel": "ぱぐじろう",
    "kind": "guide",
    "source": "https://st6-aki-laboratory.com/combo-2.html"
  }
] as const;
export const CHARACTER_VIDEO_AKI_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-aki-${id}`,slug:`preview-aki-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`A.K.I.関連研究候補。出典: ${source}。再生・内容・現行Patch・公開適格性は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["A.K.I."],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
