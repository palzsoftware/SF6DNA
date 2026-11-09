import type { VideoSummary } from "@/lib/event-media";
/** ガイル YouTube title/ID candidates. Preview-only, gameplay and relationships not validated. */
const candidates = [
  {
    "id": "UWsz9m-GULo",
    "title": "【スト6】シルバー・ゴールド必見！ガイルのプラチナ昇格セットプレイ！【荒巻ガイ】",
    "channel": "荒巻ガイ",
    "date": "2025-09-29",
    "kind": "guide"
  },
  {
    "id": "ahNyk1UXkQ8",
    "title": "不遜な通常技を許すな！うりょ式ガイル対策【うりょ】【スト6】",
    "channel": "うりょ",
    "date": "2025-03-24",
    "kind": "counter"
  },
  {
    "id": "MyZJE701a4Q",
    "title": "ガイルが使いやすくなったと聞いたが相変わらずキャラ限やジャスト入力に発狂するストーム久保【スト6/YEAR4】",
    "channel": "ストーム久保",
    "date": "2026-08-10",
    "kind": "guide"
  },
  {
    "id": "XPYDJEWNqK4",
    "title": "【スト6】ガイル対策【最新版】苦手な人必見！ソニックモード・通常技モード、シーン別対策を徹底解説｜初心者～マスター対応｜キャラ対策シリーズ#13",
    "channel": "スト6初心者応援チャンネル",
    "date": "2025-07-25",
    "kind": "counter"
  },
  {
    "id": "NMo8vNY8NPE",
    "title": "【スト6】立ち強Kが強化されてコンボが繋がらなくなった!?【ガイルのカス解説】",
    "channel": "グッドマン / グッディ",
    "date": "2026-08-10",
    "kind": "guide"
  },
  {
    "id": "5iVWOnxEHys",
    "title": "【SF6】ガイル 大足締めセットプレイ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-05-20",
    "kind": "guide"
  },
  {
    "id": "GnM-dVUIkoc",
    "title": "【ガイル対策】ぼったくられないためのソニックブレイド対策【スト６】#ストリートファイター6 #ストリートファイター6 #スト6",
    "channel": "【スト6】ずんだもんふぁいたーch【解説】",
    "date": "2026-04-01",
    "kind": "counter"
  },
  {
    "id": "odfKJ9b9NyY",
    "title": "全キャラ対応シミー!!ガイル新セットプレイ紹介!! #ストリートファイター6",
    "channel": "ひぐちゃんねる",
    "date": "2025-10-14",
    "kind": "guide"
  },
  {
    "id": "FFjbYRRi7FI",
    "title": "ガイル戦が苦手な人にマジで多い特徴 #スト6 #ストリートファイター6 #sfリーグ",
    "channel": "SmashlogTV - SF6",
    "date": "2024-10-04",
    "kind": "guide"
  },
  {
    "id": "ZYWYTeWZv7A",
    "title": "初心者向け！ガイルはとりあえずこれ！状況別コンボ！",
    "channel": "キータカ Keyetaka",
    "date": "2024-04-26",
    "kind": "guide"
  },
  {
    "id": "Sb29cwjHjfE",
    "title": "【ぼったくり注意】待ちガイル対策３選【スト６】#ストリートファイター6",
    "channel": "【スト6】ずんだもんふぁいたーch【解説】",
    "date": "2024-08-10",
    "kind": "counter"
  },
  {
    "id": "KQh75uGVeJo",
    "title": "【スト6】8/3アプデで強化されたガイルの「4ゲージコンボ」がヤバい",
    "channel": "nivaのガイル道",
    "date": "2026-08-10",
    "kind": "guide"
  },
  {
    "id": "3-f81zEu_s4",
    "title": "【SF6】ガイル 中央強サマー状況重視コンボ❗️#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-01-17",
    "kind": "guide"
  },
  {
    "id": "_yzxqpPJKNg",
    "title": "【スト６】ガイル1位！Lexxガイルのsa2起き攻め！「Lexx:Guile」vs「DJ」【SF6】",
    "channel": "StreetFighterPro",
    "date": "2026-08-12",
    "kind": "match"
  },
  {
    "id": "cbew5LIAbGk",
    "title": "【解説】下段をスカす技！差し込みに最適なガイルの主要技｢ソバット｣の使い方【スト6】 #ストリートファイター6 #ガイル #スト6",
    "channel": "愚浪 GROW Fighting gamer‘s",
    "date": "2023-09-15",
    "kind": "guide"
  },
  {
    "id": "R4d4icX755A",
    "title": "タメ無しでSA1対空出す方法【ガイル対戦攻略/スト6】 #ガイル研究所 #ストリートファイター6 #shorts",
    "channel": "nivaのガイル道",
    "date": "2025-08-02",
    "kind": "match"
  }
] as const;
export const CHARACTER_VIDEO_DEEP_GUILE: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
 id:`preview-guile-${id}`,slug:`preview-guile-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ガイル関連の候補動画。現行Patch適合性、出演者・対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ガイル"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
