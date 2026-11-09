import type { VideoSummary } from "@/lib/event-media";
/** Video IDs sourced from YouTube listings or publisher indexes. Candidate-only:
 * playback, content relevance in full, and patch compatibility are not tested. */
const candidates = [
  [
    "D7u3kyRqc9w",
    "STREET FIGHTER 6 MANON COMBOS! Starter Combo Guide",
    "VesperArcade",
    "guide"
  ],
  [
    "GFfMyddJt7A",
    "Street Fighter 6 - Manon Combo Guide",
    "rooflemonger",
    "guide"
  ],
  [
    "BbvICjzUw3o",
    "マノン対策【最新版】コマ投げ・確反・立ち回り",
    "スト6初心者応援チャンネル",
    "counter"
  ],
  [
    "c-UaU8rqSPk",
    "マノン使いが本気のマノン対策を解説",
    "GANAKEN / ガナケン",
    "counter"
  ],
  [
    "rhP1qGozvT0",
    "Must Know Manon Combos for Street Fighter 6",
    "2XKairos",
    "guide"
  ],
  [
    "Q7CBrANnAEs",
    "5強と噂のマノン様",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "jNtfDtvnnHA",
    "一転攻勢のコマ投げ3連打",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "l68SHBal2hI",
    "マノン定期配信 GoGo Jump！掴めよVictory",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "FFwgyUhZoIY",
    "マノン WW#2参戦",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "T6FRGZbZ67s",
    "マノン定期配信 ダブルエリミネーション式ランクマ",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "wveM0yqqHSA",
    "マノン定期配信 ダイエット中",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "8NpWkRh2mgk",
    "マノン様ひとくち攻略#56 サガット中P対策",
    "GANAKEN / ガナケン",
    "counter"
  ],
  [
    "v_KvSeHj1j0",
    "マノン定期配信 体調悪め",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "8psf43UcusE",
    "大K弱体化されたマノン、実は強化されているかもしれない",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "MHJg8MczSSs",
    "マノン定期配信 梅雨",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "AID6zXAO9Ks",
    "マノンのスーパー偉いリーサルコンボ",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "LHbU7pLbg-g",
    "DriveTechマノン布教の回",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "tB62-JCDOd8",
    "LEGENDマノンによるリプレイ添削",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "bLvmSePfNrU",
    "地上戦で勝つマノンになりたい",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "Z9KkLste2QI",
    "マスターを目指すプラチナ・ダイヤ帯のマノン使い改善点7選",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "8GlOEGDFuwg",
    "マノン様ひとくち攻略#55 カウンター確認コンボの練習",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "HS-YR1uIMcY",
    "LEGENDに戻るマノン",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "jmJ5Ygs6zRc",
    "マノン様ひとくち攻略#54 アレックス対策",
    "GANAKEN / ガナケン",
    "counter"
  ],
  [
    "J5G3Ee6paaM",
    "マノン様ひとくち攻略#53 強ポワンのセットプレイ",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "Coj-5lpW_Xk",
    "マノン WW#1参加",
    "GANAKEN / ガナケン",
    "match"
  ],
  [
    "-KL04Cfe1_o",
    "マノン コンボトライアル 初級・中級・上級",
    "そーだらいと",
    "guide"
  ],
  [
    "-uhB4ySE9Ys",
    "テリー使いのマノン対策まとめ",
    "holosokuのスト6攻略チャンネル",
    "counter"
  ],
  [
    "5lMWtAKHroE",
    "たいじのマノン参考動画",
    "投稿者未確認",
    "guide"
  ],
  [
    "lgmyiRQJkTY",
    "マノン 起き上がり投げ参考動画",
    "投稿者未確認",
    "guide"
  ],
  [
    "Sh95nrJSPgE",
    "マノン起き攻め33選",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "8mWmWF6HGlk",
    "マノン起き攻め参考動画",
    "投稿者未確認",
    "guide"
  ],
  [
    "E064Ku0u8LM",
    "芥川 マノンLEGEND対戦",
    "投稿者未確認",
    "match"
  ],
  [
    "-06MaPCRNOM",
    "関優太 マノン関連",
    "投稿者未確認",
    "match"
  ],
  [
    "a3OyaMQ6p3E",
    "まさはる マノン対戦配信",
    "投稿者未確認",
    "match"
  ],
  [
    "pBii_Giu4XQ",
    "マノン新セットプレイ",
    "投稿者未確認",
    "guide"
  ],
  [
    "m3_bwlcMOrk",
    "GANAKEN Year2マノン強化点解説",
    "GANAKEN / ガナケン",
    "guide"
  ],
  [
    "-IlXBGdD_VQ",
    "世界1位マノン あくたがわ 調整後の対戦リプレイ",
    "SF6-MODERN",
    "match"
  ]
] as const;
export const CHARACTER_VIDEO_MANON_RESEARCH: VideoSummary[] = candidates.map(([id,title,channel,kind]): VideoSummary => ({
 id:`preview-manon-${id}`,slug:`preview-manon-${id}`,
 title,platform:"youtube",videoType:kind,publishedAt:null,
 description:"マノンの動画候補。現行Patchと映像再生、出演者・内容の完全照合は未検証。",
 url:`https://www.youtube.com/watch?v=${id}`,
 thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["マノン"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
