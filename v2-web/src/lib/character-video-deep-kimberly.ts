import type { VideoSummary } from "@/lib/event-media";
/** キンバリー YouTube title/ID candidates. Preview-only, gameplay and relationships not validated. */
const candidates = [
  {
    "id": "PSgWYdjUsIk",
    "title": "【スト６】最強キンバリープロがやってる全起き攻めまとめ＆解説（前編）【覚えるだけで勝率UP】【2026/02/05切り抜き】",
    "channel": "tako",
    "date": "2026-02-15",
    "kind": "guide"
  },
  {
    "id": "UHS7SvfLWdM",
    "title": "【スト6、SF6】レジェチャレ『キンバリー』達成！常に\"択\"を意識すべし！",
    "channel": "ACQUA",
    "date": "2025-02-04",
    "kind": "guide"
  },
  {
    "id": "Z02zfX_8nlE",
    "title": "【キンバリー】コンボ解説 初級編（マスター以下向け）【スト６】",
    "channel": "うらしま",
    "date": "2025-04-13",
    "kind": "guide"
  },
  {
    "id": "FipZdQzs-qI",
    "title": "ほぼ確定で体力を5割減らすキンバリーの新起き攻めの強制力が強すぎて困惑するストーム久保【スト6】",
    "channel": "ストーム久保",
    "date": "2025-06-27",
    "kind": "guide"
  },
  {
    "id": "gSP2GpkJRT0",
    "title": "【スト6】キンバリーでマスターになるための徹底解説！【攻略】【ストリートファイター6】",
    "channel": "ぴんぴゲームチャンネル",
    "date": "2024-02-09",
    "kind": "guide"
  },
  {
    "id": "6ssrEByA0P0",
    "title": "キンバリー初心者とりあえずこれ見て動画",
    "channel": "でりちゃんねる",
    "date": "2026-09-26",
    "kind": "guide"
  },
  {
    "id": "N8plKj376-k",
    "title": "【STEP1】キンバリーで勝つための3STEP【スト6講座】",
    "channel": "ピーポーくん",
    "date": "2025-05-29",
    "kind": "guide"
  },
  {
    "id": "Tk5_hcZDv_o",
    "title": "【スト６】最新版キンバリーの爆弾と新コンボ、実戦的なやつを解説します【2026/03/24切り抜き】",
    "channel": "tako",
    "date": "2026-04-01",
    "kind": "guide"
  },
  {
    "id": "NBtlTraDFrk",
    "title": "【スト６】キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！#スト6 #streetfighter6 #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2024-04-13",
    "kind": "guide"
  },
  {
    "id": "c8tO0vpCj6w",
    "title": "【スト6】キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6   #streetfighter6    #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2025-07-26",
    "kind": "guide"
  },
  {
    "id": "t5mcAq7Q_Ig",
    "title": "【スト6】キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6  #ストリートファイター6 #streetfighter6 #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2024-08-03",
    "kind": "guide"
  },
  {
    "id": "vep27SjXI6Y",
    "title": "【スト6】アプデ後版！キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6   #streetfighter6     #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2026-03-17",
    "kind": "guide"
  },
  {
    "id": "F1ZYbsM7NLw",
    "title": "【キンバリー】大会上位キンバリーの使っていたコンボ・セットプレイ   (メモ part35)【スト6】",
    "channel": "隼「スト6」",
    "date": "2026-08-02",
    "kind": "guide"
  },
  {
    "id": "qfA4luSiRwQ",
    "title": "【初心者～中級者向け】キンバリーで勝つための９ヵ条 #スト6 #キンバリー",
    "channel": "でりちゃんねる",
    "date": "2026-05-22",
    "kind": "guide"
  },
  {
    "id": "KimugdMtVJo",
    "title": "【キンバリー】大会上位キンバリーの使っていたコンボ・セットプレイ   (メモ part36)【スト6】",
    "channel": "隼「スト6」",
    "date": "2026-08-22",
    "kind": "guide"
  },
  {
    "id": "Ik0I8lEBmWg",
    "title": "【キンバリー】大会上位キンバリーの使っていたコンボ・セットプレイまとめ   (メモ part27)【スト6】",
    "channel": "隼「スト6」",
    "date": "2025-07-23",
    "kind": "guide"
  },
  {
    "id": "3g1KIPbdo8c",
    "title": "【初心者向け】なるべく簡単にマスターまで行ける講座 キンバリー編【ストリートファイター６ スト６ SF6 モダン クラシック 使い方 コンボ 立ち回り 起き攻め セットプレイ 解説】",
    "channel": "アキの秘密基地 ゲーム支部",
    "date": "2024-03-19",
    "kind": "guide"
  },
  {
    "id": "SQ-0zRY2IDM",
    "title": "【初心者向け解説】キンバリー脱初心者10の心得 #スト6 #キンバリー #コンボ",
    "channel": "でりちゃんねる",
    "date": "2025-08-03",
    "kind": "guide"
  },
  {
    "id": "_nJMTLA6GVQ",
    "title": "【キンバリー】大会上位キンバリーの使っていたコンボ・セットプレイ   (メモ part37)【スト6】",
    "channel": "隼「スト6」",
    "date": "2026-10-17",
    "kind": "guide"
  },
  {
    "id": "jifg4IAAPxM",
    "title": "【Year3最終版】キンバリーの強ムーブ10選【スト6】",
    "channel": "osyamannbe",
    "date": "2026-05-26",
    "kind": "guide"
  },
  {
    "id": "JO1obSLIXQk",
    "title": "【MR2000】キンバリーの地上戦・立ち回りの基礎を学ぼう【キンバリー解説】【モダン対応】",
    "channel": "ぎるふぇすと",
    "date": "2026-01-16",
    "kind": "guide"
  },
  {
    "id": "MaYseEGzGaI",
    "title": "【キンバリー】大会上位キンバリーのセットプレイ その３１【スト6】#shorts",
    "channel": "隼「スト6」",
    "date": "2026-09-14",
    "kind": "guide"
  },
  {
    "id": "9nX9OLZv2O4",
    "title": "【スト6】キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6  #ストリートファイター6 #streetfighter6 #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2024-06-01",
    "kind": "guide"
  },
  {
    "id": "AYnFyu24bfY",
    "title": "【スト6】アプデ後版！キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6   #streetfighter6     #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2026-03-21",
    "kind": "guide"
  },
  {
    "id": "QuD7H8tMuTw",
    "title": "【スト6】番外編！キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6  #ストリートファイター6 #streetfighter6        #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2025-04-20",
    "kind": "guide"
  },
  {
    "id": "01qZEEHTxkY",
    "title": "【スト６】キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6  #streetfighter6  #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2024-04-06",
    "kind": "guide"
  },
  {
    "id": "E3-Sr5PLjn0",
    "title": "【スト6】画面中央コンボ&起き攻め【キンバリー】【セットプレイ】",
    "channel": "matsu56 松五郎",
    "date": "2023-12-03",
    "kind": "guide"
  },
  {
    "id": "BODNm2t_h0w",
    "title": "【スト6】キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6  #ストリートファイター6 #streetfighter6    #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2024-11-17",
    "kind": "guide"
  },
  {
    "id": "w4lOmOhCnQ4",
    "title": "【スト6】キンバリーの強い（多分）立ち回り・コンボ・セットプレイ紹介！ #スト6 #streetfighter6 #shorts",
    "channel": "なーのやりたい放題ちゃんねる",
    "date": "2024-04-27",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_DEEP_KIMBERLY: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
 id:`preview-kimberly-${id}`,slug:`preview-kimberly-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
 description:"キンバリー関連の候補動画。現行Patch適合性、出演者・対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["キンバリー"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
