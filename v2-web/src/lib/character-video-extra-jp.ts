import type { VideoSummary } from "@/lib/event-media";
/** Research batch: JP. YouTube title, channel, date and video ID found via search.
 * Preview candidate ONLY; gameplay, patch applicability and match associations unverified.
 */
const candidates = [
  {
    "id": "LWbd0EOcF5w",
    "title": "「翔のプレイは宝」翔JPの完成度が高すぎて感動するりゅうせい【スト6】",
    "channel": "りゅうせい",
    "date": "2025-12-29",
    "kind": "guide"
  },
  {
    "id": "Um3_ZxTu4nk",
    "title": "凄まじい試合内容で大活躍した翔JPの強さを解説するりゅうせい【スト6】",
    "channel": "りゅうせい",
    "date": "2026-05-12",
    "kind": "match"
  },
  {
    "id": "levM5VIJfMc",
    "title": "【SF6】世界1位JP！この強さまさにラスボスすぎるｗｗｗ「翔(Kakeru):JP」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-05-11",
    "kind": "guide"
  },
  {
    "id": "BYsOO-2FARM",
    "title": "【SF6】まさに異次元の強さ！2400MR超えJPがマジで強すぎるｗｗｗ「翔(Kakeru):JP」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2025-06-21",
    "kind": "guide"
  },
  {
    "id": "ss38s32Cnh0",
    "title": "【スト6】圧倒的力と読み合い 無双で行く翔JP 翔 (JP) 【STREET FIGHTER 6】",
    "channel": "昇龍拳",
    "date": "2026-08-10",
    "kind": "guide"
  },
  {
    "id": "0oxMPaZ7jHU",
    "title": "ストリートファイター6✨翔 [JP] Vs かずのこ [キャミィ] 翔JPが再び登場！  | SF6✨Kakeru [JP] Vs Kazunoko [Cammy]✨スト6",
    "channel": "Stremphoenix",
    "date": "2025-11-19",
    "kind": "match"
  },
  {
    "id": "G78VBtaRf_4",
    "title": "【SF6】世界1位JP！この支配力まさにラスボスすぎるｗｗｗ「翔(Kakeru):JP」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2025-07-31",
    "kind": "guide"
  },
  {
    "id": "BStWRNanjE4",
    "title": "「JP弱すぎる！」と言い張るが隠しきれないで本音が漏れる政治家りゅうせい【スト6】",
    "channel": "りゅうせい",
    "date": "2026-08-25",
    "kind": "guide"
  },
  {
    "id": "gIl-SclitNc",
    "title": "ダルシム限定のJPドリームコンボ発見に感動【スト6】",
    "channel": "りゅうせい",
    "date": "2026-07-24",
    "kind": "guide"
  },
  {
    "id": "DuWxcgLuYCU",
    "title": "「引退するかも」伸び悩むJP使いに超激辛コーチングをするりゅうせい【スト6】",
    "channel": "りゅうせい",
    "date": "2026-04-22",
    "kind": "guide"
  },
  {
    "id": "fSokc0t_ack",
    "title": "【スト6】これぞ究極 圧倒的技量で魅せる翔JP 翔 (JP) 【STREET FIGHTER 6】",
    "channel": "昇龍拳",
    "date": "2026-07-27",
    "kind": "guide"
  },
  {
    "id": "fRheK4hlqtQ",
    "title": "【スト6】正面から穿ち抜く力の極致魅せる翔JP 翔 (JP) 【STREET FIGHTER 6】",
    "channel": "昇龍拳",
    "date": "2026-07-26",
    "kind": "guide"
  },
  {
    "id": "Xxapd81m6Wo",
    "title": "【スト6】JP MR1位！takepiJP、SFLの新星が強すぎる｜盤面支配で相手の自由を奪う",
    "channel": "スト6 リプレイ研究室",
    "date": "2026-08-14",
    "kind": "guide"
  },
  {
    "id": "0PPmi0MtaPo",
    "title": "【スト6】もはや振る技がない！？圧倒的ジャスパ制度の翔JPに邂逅し絶望するYAS【リュウ】",
    "channel": "YasTube",
    "date": "2025-01-07",
    "kind": "guide"
  },
  {
    "id": "lWRgCAwewd0",
    "title": "【SF6】世界1位JP！圧倒的支配力で魅せまくるｗｗｗ「takepi:JP」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-10-09",
    "kind": "guide"
  },
  {
    "id": "TPX6q-w00Us",
    "title": "【スト6】JP神スタンコンボでリーサル#shorts",
    "channel": "りゅうせい",
    "date": "2025-08-28",
    "kind": "guide"
  },
  {
    "id": "EbONhMVHIz8",
    "title": "スト6✨ボンちゃん [サガット] Vs りゅうせい [JP] 弾を撃つか、詰めるか――地上戦が別モノ  | Bonchan [Sagat] Vs Ryusei [JP]✨SF6",
    "channel": "Stremphoenix",
    "date": "2025-12-24",
    "kind": "match"
  },
  {
    "id": "MGvSh9IQ29A",
    "title": "ときどJP完成!? 凶悪連携 #SFL #スト6",
    "channel": "Capcom Fighters JP",
    "date": "2026-10-05",
    "kind": "guide"
  },
  {
    "id": "Y-n4dMh2pxg",
    "title": "JPの弱体化調整に怯えるプロゲーマー【スト6】",
    "channel": "りゅうせい",
    "date": "2026-07-20",
    "kind": "guide"
  },
  {
    "id": "EA91mrXZfsw",
    "title": "【スト6】冴え渡る技巧で戦い掌握する翔JP 翔 (JP) 【STREET FIGHTER 6】",
    "channel": "昇龍拳",
    "date": "2026-08-06",
    "kind": "guide"
  },
  {
    "id": "AsCtARH9V3I",
    "title": "【SF6】世界1位JP！抗うほど術中にハマっていく！！「takepi:JP」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-09-14",
    "kind": "guide"
  },
  {
    "id": "ocB3xsS9Aak",
    "title": "イングリッドに遠距離王の座を奪い取られそうで絶望するJP使いりゅうせい【スト6】",
    "channel": "りゅうせい",
    "date": "2026-05-30",
    "kind": "guide"
  },
  {
    "id": "tKzXSuAT9Aw",
    "title": "【スト6】先を行く攻略 支える技量 まさに最強JP 翔 (JP) 【ストリートファイター6】",
    "channel": "昇龍拳",
    "date": "2026-05-14",
    "kind": "guide"
  },
  {
    "id": "dWy7L3Mj7IY",
    "title": "【スト6】JPにブチギレた男の末路 #shorts #スト6 #sf6 #リュウ",
    "channel": "しゃりぞーチャンネル",
    "date": "2026-08-17",
    "kind": "guide"
  },
  {
    "id": "7CIMm2Vw9aI",
    "title": "【スト6】乱れなき技で捻じ伏せる翔JPが強すぎる!! 翔 (JP) 【ストリートファイター6】",
    "channel": "昇龍拳",
    "date": "2026-07-23",
    "kind": "guide"
  },
  {
    "id": "jgP5pvtpnBE",
    "title": "【SF6】世界1位JP！動けば狩られ、止まれば設置に追い詰められる！！「takepi:JP」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-08-15",
    "kind": "guide"
  },
  {
    "id": "20Ut1TXnUik",
    "title": "【スト6/JP】Year4調整で大パンはどう変わったのか【一番痛い】",
    "channel": "神木C",
    "date": "2026-08-19",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_JP: VideoSummary[] = candidates.map(({id,title,channel,date,kind}):VideoSummary => ({
 id:`preview-jp-${id}`,slug:`preview-jp-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:`${date}T00:00:00Z`,description:"JP関連動画候補。現行Patch適合性や対戦関係は未検証です。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["JP"],
 players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
