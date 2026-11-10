import type { VideoSummary } from "@/lib/event-media";
/** ジェイミー: YouTube title/ID/channel verified from search, Preview candidates only.
 * No verified gameplay, Player relation, or publication approval.
 */
const candidates = [
  {
    "id": "-TcI1Y2Gdlg",
    "title": "【スト6】2年ぶりにじっくり解説！なるおのジェイミー立ち回り＆コンボ講座【なるお・ストリートファイター6】",
    "channel": "なるおのひとりでできるもん",
    "date": "2025-06-24",
    "kind": "guide"
  },
  {
    "id": "7umJnTKsah8",
    "title": "【スト6】ジェイミー year3対応厳選18コンボとセットプレイまとめ【2025.06最新版】",
    "channel": "ミダ猫のゲーム動画",
    "date": "2025-06-28",
    "kind": "guide"
  },
  {
    "id": "VCCuiX8jBMs",
    "title": "【スト6】「リターンヤバすぎィ!ｗ」YEAR4ジェイミーでランクマやってみたら特に肘がヤバすぎて早くもトップtier認定【なるお・ストリートファイター6】",
    "channel": "なるおのひとりでできるもん",
    "date": "2026-08-11",
    "kind": "guide"
  },
  {
    "id": "xoe-btaE5Xw",
    "title": "【スト6】ジェイミーの使い方",
    "channel": "シバスピス",
    "date": "2026-05-21",
    "kind": "guide"
  },
  {
    "id": "pT19eZztV8E",
    "title": "【スト6】ジェイミー世界2位が伝授。ジェイミー必須コンボ\"ももちコン\"について解説！",
    "channel": "タンタンメン",
    "date": "2026-06-10",
    "kind": "guide"
  },
  {
    "id": "VFmbX_rFvKc",
    "title": "【スト6】Year3対応！C･ジェイミーのコンボ・セットプレイ解説！【荒巻ガイ】",
    "channel": "荒巻ガイ",
    "date": "2025-06-22",
    "kind": "guide"
  },
  {
    "id": "eLQfirdFbJ8",
    "title": "【スト6】これ1本でジェイミーを楽にマスター！コンボ＆起き攻め、立ち回り 26年最新版完全ガイド【初心者向けジェイミー解説 ストリートファイター6 】",
    "channel": "さわかぜの格ゲーチャンネル",
    "date": "2026-10-10",
    "kind": "guide"
  },
  {
    "id": "bxrNIUoOXCQ",
    "title": "【スト6】ジェイミーでマスターに行く方法・立ち回り編【荒巻ガイ】",
    "channel": "荒巻ガイ",
    "date": "2026-04-12",
    "kind": "guide"
  },
  {
    "id": "egSVVV02vdE",
    "title": "【スト6】世界で2番目に強いジェイミー使いが教えるジェイミーの使い方",
    "channel": "タンタンメン",
    "date": "2026-10-26",
    "kind": "guide"
  },
  {
    "id": "2a0YBnYkh4g",
    "title": "【スト6】勝率UP！ジェイミーのフレーム別起き攻め徹底解説！キャラ対策付！year3対応【ジェイミー】",
    "channel": "ぴゃんぴぃ",
    "date": "2025-07-29",
    "kind": "guide"
  },
  {
    "id": "-cOBtzBnh-0",
    "title": "【スト6】シルバー・ゴールド必見！ジェイミーのプラチナ昇格セットプレイ！【荒巻ガイ】",
    "channel": "荒巻ガイ",
    "date": "2025-09-15",
    "kind": "guide"
  },
  {
    "id": "2aQ02UMPbCM",
    "title": "【スト6】MR2000のジェイミーがとりあえずでよく使う強行動を紹介！！",
    "channel": "深田ジェイミ",
    "date": "2026-08-27",
    "kind": "guide"
  },
  {
    "id": "plij3MlmDhM",
    "title": "【スト6】year4対応最新版！！ MR2000レジェタッチのジェイミー使いによる実践で使うコンボを全部紹介！！！",
    "channel": "深田ジェイミ",
    "date": "2026-09-17",
    "kind": "guide"
  },
  {
    "id": "uNx9pnmw9LM",
    "title": "【SF6】ジェイミー 中央SA1活用コンボ❗️ #スト6解説 #スト6",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-02-19",
    "kind": "guide"
  },
  {
    "id": "HU-dPsPxhis",
    "title": "【スト６】ジェイミーレジェチャレ始動！ OD無影を絡めた起き攻めの強力さに爆笑するどぐら",
    "channel": "どぐら 生駒デビル",
    "date": "2025-04-07",
    "kind": "guide"
  },
  {
    "id": "2terIUAHwdM",
    "title": "【スト6】初・中級者向け起き攻めの防御択！ジェイミーで覚える起き攻めの防御択簡単まとめ！【ジェイミー】",
    "channel": "ぴゃんぴぃ",
    "date": "2025-09-04",
    "kind": "guide"
  },
  {
    "id": "ShDsO3xhlzU",
    "title": "【スト6】使いこなせば上級者⁉ジェイミーの小技連携解説！【ジェイミー】",
    "channel": "ぴゃんぴぃ",
    "date": "2025-08-29",
    "kind": "guide"
  },
  {
    "id": "qt2A_I1gmdE",
    "title": "分からん●しで勝利をもぎとる！ジェイミー渾身のコマ投げセットプレイ【スト6】【コンボ】",
    "channel": "うりょ",
    "date": "2024-12-14",
    "kind": "guide"
  },
  {
    "id": "hjyIl9KUx_I",
    "title": "【スト6】中下段のセットプレイ案！ジェイミーの中昇竜からのラッシュ起き攻め！【ジェイミー】",
    "channel": "ぴゃんぴぃ",
    "date": "2025-10-14",
    "kind": "guide"
  },
  {
    "id": "pAls7zHC8Po",
    "title": "【SF6】ジェイミー 画面端SA1リーサル用コンボ❗️#スト6 #スト6 解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-02-23",
    "kind": "guide"
  },
  {
    "id": "4InfG12KbX4",
    "title": "【スト6】新コンボも！？MR2000ジェイミーによるコンボ、起き攻め解説！！ ",
    "channel": "深田ジェイミ",
    "date": "2026-08-04",
    "kind": "guide"
  },
  {
    "id": "_o-JqpS05Og",
    "title": "【超講座】知らないと損！うりょが教えるジェイミーの全て【スト6】【うりょ】",
    "channel": "うりょ",
    "date": "2024-12-08",
    "kind": "guide"
  },
  {
    "id": "SFYWl0HBgnU",
    "title": "【SF6】ジェイミー 新バージョン酒レベル3アップコンボ！",
    "channel": "inaGuile@攻めガイル",
    "date": "2026-08-16",
    "kind": "guide"
  },
  {
    "id": "KTqGTVN42Og",
    "title": "アプデ後ジェイミーの流酔拳セットプレイを紹介！！ #ストリートファイター6 #スト6",
    "channel": "深田ジェイミ",
    "date": "2026-08-19",
    "kind": "guide"
  },
  {
    "id": "gKxCoTstFIs",
    "title": "【スト6】その行動、ちゃんと読みあえてる？？ジェイミーの中パン後の読み合いを完全解説！！",
    "channel": "深田ジェイミ",
    "date": "2026-09-07",
    "kind": "guide"
  },
  {
    "id": "DDCqeUWBqcI",
    "title": "【スト6】Year3 モダンジェイミーの強みからセットプレイまで徹底解説【荒巻ガイ】",
    "channel": "荒巻ガイ",
    "date": "2025-09-03",
    "kind": "guide"
  },
  {
    "id": "bpkmdqHWwJo",
    "title": "【SF6】世界1位ジェイミー！強化調整後のコンボが超カッケェ！！「竹内ジョン:ジェイミー(Jamie)」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-08-09",
    "kind": "guide"
  },
  {
    "id": "Imp4eTmdxoo",
    "title": "【スト6】ぼったくり飲みは終わり！ジェイミーの後ろ投げ後の起き攻め解説【ジェイミー】 #ストリートファイター6 #ジェイミー #スト6",
    "channel": "ぴゃんぴぃ",
    "date": "2025-08-24",
    "kind": "guide"
  },
  {
    "id": "TC99cWDHcW8",
    "title": "【Year4直前版】初心者から上級者まで!!ジェイミー全技解説 強攻撃編!!【ジェイミー】【スト6】【Switch2】【VTuber】",
    "channel": "Tajifu Ch. たじふ。",
    "date": "2026-04-22",
    "kind": "guide"
  },
  {
    "id": "cQ0XLqVBE9g",
    "title": "【スト6】ジェイミーの美しすぎるコンボ",
    "channel": "藤村 / Fujimura",
    "date": "2023-05-18",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_DEEP_JAMIE: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
 id:`preview-jamie-${id}`,slug:`preview-jamie-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
 description:"ジェイミー関連の候補動画。収録時点の情報です。現行Patch、出演者・対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ジェイミー"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
