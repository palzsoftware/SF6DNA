import type { VideoSummary } from "@/lib/event-media";
/** Research batch: ルーク. YouTube title, channel, date and video ID found via search.
 * Preview candidate ONLY; gameplay, patch applicability and match associations unverified.
 */
const candidates = [
  {
    "id": "_uAWQObyP8k",
    "title": "【スト6】カワノルーク 全て通し切るプロの読み合い カワノ (ルーク) 【ストリートファイター6】",
    "channel": "昇龍拳",
    "date": "2026-08-29",
    "kind": "guide"
  },
  {
    "id": "O7-j2jVGaU8",
    "title": "【スト6】前進あるのみ 圧倒的破壊力で打ち砕く!! カワノ (ルーク) 【ストリートファイター6】",
    "channel": "昇龍拳",
    "date": "2026-09-23",
    "kind": "guide"
  },
  {
    "id": "qazB93YVZNY",
    "title": "プロと当たりまくるランクマで勝利を重ね、ルークの可能性を確信するシュート【CR/シュート/切り抜き/ルーク/SF6】",
    "channel": "しゅーとチャンネル / Shuto",
    "date": "2026-09-28",
    "kind": "match"
  },
  {
    "id": "GRARnAaNTVQ",
    "title": "【スト6】力強すぎるコンボで粉砕するカワノルーク カワノ (ルーク) 【ストリートファイター6】",
    "channel": "昇龍拳",
    "date": "2026-09-13",
    "kind": "guide"
  },
  {
    "id": "MEGGSO6piME",
    "title": "コンボ火力超アップ!!ルークのJ中Pを解説",
    "channel": "じゃじいのガチンコチャンネル",
    "date": "2026-08-17",
    "kind": "guide"
  },
  {
    "id": "Y9OowPNZDw0",
    "title": "現環境でのリュウの苦しさや難しい所を実践しながら語るシュート【CR/シュート/切り抜き/ルーク/リュウ/SF6】",
    "channel": "しゅーとチャンネル / Shuto",
    "date": "2026-10-04",
    "kind": "guide"
  },
  {
    "id": "d2puPmrrocI",
    "title": "ストリートファイター6【カワノ (ルーク) VS かずのこ (ヤスミン)】KAWANO (LUKE) VS KAZUNOKO (YASMINE) SFVI スト6",
    "channel": "GAME-PC-LIFE",
    "date": "2026-08-03",
    "kind": "match"
  },
  {
    "id": "ZFbAJoLCqc0",
    "title": "【スト6】全力で打ち抜く ボンちゃんルーク正義の鉄拳 ボンちゃんルーク (ルーク) 【SF6】",
    "channel": "昇龍拳",
    "date": "2026-08-17",
    "kind": "guide"
  },
  {
    "id": "Dl-P4_VA7SI",
    "title": "【スト6】強化で変わった！カワノルーク、攻めがさらに鋭く | ストリートファイター6",
    "channel": "SF6 DOJO REPLAYS",
    "date": "2026-08-10",
    "kind": "guide"
  },
  {
    "id": "iLdrtPHDiuI",
    "title": "【スト6】一種のルーク対策！コマ投げ後のラッシュしゃがみ大KがSA1と相打ちで+41F有利！ #スト6 #アレックス",
    "channel": "かめすけ",
    "date": "2026-08-31",
    "kind": "counter"
  },
  {
    "id": "TK2tq-QhRaE",
    "title": "【スト6】BigBurnoutMan (ケン) vs ルーク｜DIを躱してキッチリ打ち込む奮迅昇龍 【Act.13】",
    "channel": "SF6 Brawlers Nest",
    "date": "2026-09-17",
    "kind": "match"
  },
  {
    "id": "v2FIcw8Xawg",
    "title": "【スト6】増殖したルークに勝つ方法、それは汚技 #ストリートファイター6 #sf6 #ルーク",
    "channel": "惑い人",
    "date": "2026-09-20",
    "kind": "guide"
  },
  {
    "id": "KEgMrJMWKAA",
    "title": "スト6 LeShar LeSharルーク始動 #streetfighter #ストリートファイター6 #スト6",
    "channel": "スト6 Best Legend Replays",
    "date": "2026-10-01",
    "kind": "guide"
  },
  {
    "id": "boxkTSUbFMM",
    "title": "【スト6】画面端の魅せる攻防 ふ～ど (ディージェイ) カワノ (ルーク) 【SF6】",
    "channel": "昇龍拳",
    "date": "2024-01-11",
    "kind": "guide"
  },
  {
    "id": "kaaNypYDaYY",
    "title": "【スト6】超絶パワー叩き込むBlazルーク Blaz (ルーク) 【ストリートファイター6】",
    "channel": "昇龍拳",
    "date": "2026-09-15",
    "kind": "guide"
  },
  {
    "id": "fe0n3bwqo70",
    "title": "ルーク対策【STREET FIGHTER 6/ケン/舞】",
    "channel": "おらりん",
    "date": "2026-05-12",
    "kind": "counter"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_LUKE: VideoSummary[] = candidates.map(({id,title,channel,date,kind}):VideoSummary => ({
 id:`preview-luke-${id}`,slug:`preview-luke-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:`${date}T00:00:00Z`,description:"ルーク関連動画候補。現行Patch適合性や対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["ルーク"],
 players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
