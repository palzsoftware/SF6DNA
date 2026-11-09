import type { VideoSummary } from "@/lib/event-media";
/** ジェイミー Preview-only YouTube research candidates. Game content/relations unverified. */
const candidates = [
  {
    "id": "GHW9soxTVTA",
    "title": "【うりょの無料講座】Cジェイミー始めたらとりあえずコレ！ジェイミー基本コンボ講座",
    "channel": "うりょ",
    "date": "2025-05-13",
    "kind": "guide"
  },
  {
    "id": "hFBwfPhEgM4",
    "title": "【スト6】MR2000勝率約7割によるジェイミー対策、考え方や距離感など。",
    "channel": "深田ジェイミ",
    "date": "2026-10-18",
    "kind": "counter"
  },
  {
    "id": "cdaZOwSoX18",
    "title": "【スト6】 MR2000ジェイミーが実践で使うSA3のコンボをすべて紹介！！",
    "channel": "深田ジェイミ",
    "date": "2026-09-02",
    "kind": "guide"
  },
  {
    "id": "D9VI19A7RiE",
    "title": "Blaz先生の強さを研究!!ジェイミーのポテンシャルを120%出し切る先生の動きに驚愕する立川【Blaz/ジェイミー/スト6】【立川/CR/切り抜き】",
    "channel": "立川ちゃんねる",
    "date": "2026-09-20",
    "kind": "guide"
  },
  {
    "id": "LWFey_d41Cs",
    "title": "「みんなついてこれてる？」ジェイミー使い必見!!ももちによる”ももちコン徹底解説”【ストリートファイター6】",
    "channel": "ももち / Momochi",
    "date": "2026-09-18",
    "kind": "guide"
  },
  {
    "id": "A_k5J5-amNs",
    "title": "【知って得するスト６知識】ジェイミーラッシュ強パンチガード後の読み合いはこれ！【スト６】#ストリートファイター6 #ストリートファイター6 #スト6",
    "channel": "【スト6】ずんだもんふぁいたーch【解説】",
    "date": "2026-02-09",
    "kind": "guide"
  },
  {
    "id": "AnHYZtOlgi4",
    "title": "ジェイミー調整後の新コンボまとめ！ #ストリートファイター6 【スト6】 #sf6 #スト6 #streetfighter",
    "channel": "深田ジェイミ",
    "date": "2026-08-04",
    "kind": "guide"
  },
  {
    "id": "CxiXZIdm63Y",
    "title": "【スト6】ジェイミーがうざい理由 #ストリートファイター6 #ジェイミー #スト6",
    "channel": "Kei",
    "date": "2025-03-28",
    "kind": "guide"
  },
  {
    "id": "3gNVbMArYJM",
    "title": "ジェイミー2026今年ダメージコンボ　無駄にクソむずかったよ　#スト6 #ストリートファイター6 #sf6 #streetfighter #ジェイミー",
    "channel": "ガートスのゲーム実況",
    "date": "2026-09-23",
    "kind": "guide"
  },
  {
    "id": "2DxX1BAusnQ",
    "title": "ジェイミー豆知識㉚SA無し最大コンボ【スト6】 #ストリートファイター6 #スト6 #st6 #streetfighter6 #streetfighter #ジェイミー",
    "channel": "味見",
    "date": "2026-08-14",
    "kind": "guide"
  },
  {
    "id": "ZxIP22A6K7g",
    "title": "【スト6】待ちに待った全キャラ調整！調整リストとトレモで早速ジェイミーの変化をチェック【なるお・ストリートファイター6】",
    "channel": "なるおのひとりでできるもん",
    "date": "2026-03-18",
    "kind": "guide"
  },
  {
    "id": "YfuGSKxIpAg",
    "title": "【スト6】ジェイミーSA1難易度別最大コンボ",
    "channel": "なおべー",
    "date": "2026-09-20",
    "kind": "guide"
  },
  {
    "id": "s2b1BePB5k4",
    "title": "【SF6】🔥タンタンメンから学ぶジェイミー最新版の立ち回り！🔥 Latest Strategy from Tantanmen’s Jamie!",
    "channel": "SF6キャラ対策リプレイコレクション",
    "date": "2026-04-10",
    "kind": "guide"
  },
  {
    "id": "5ulbIFRp6fw",
    "title": "禁断の情報公開!ジェイミー使いのうりょによるジェイミー対策",
    "channel": "うりょ",
    "date": "2025-07-06",
    "kind": "counter"
  },
  {
    "id": "f9xUTHbpbCw",
    "title": "調整で手に入れたジェイミーの脅威",
    "channel": "ももち / Momochi",
    "date": "2026-08-09",
    "kind": "guide"
  },
  {
    "id": "O18R3LNc9c8",
    "title": "ジェイミーの汚連携をご紹介いたします！！勝てない時はこれを使って！！#ストリートファイター6 #スト6",
    "channel": "深田ジェイミ",
    "date": "2026-08-17",
    "kind": "guide"
  },
  {
    "id": "hqBHF1gnVYM",
    "title": "実はぼられてる？ジェイミー対策　 #Shorts #ストリートファイター6 #スト6 #sf6 #streetfighter6",
    "channel": "いおりチャンネル【スト6講座と対戦動画投稿】",
    "date": "2025-04-29",
    "kind": "counter"
  },
  {
    "id": "3G8wBNzDwRw",
    "title": "ジェイミー豆知識㉑新コンボまとめ【スト6】 #ストリートファイター6  #スト6 #st6 #streetfighter6 #sf6 #streetfighter #ジェイミー",
    "channel": "味見",
    "date": "2026-08-05",
    "kind": "guide"
  },
  {
    "id": "84ziBlONh-E",
    "title": "【SF６】ジェイミー対策で押さえておきたい３つのポイント #shorts #ストリートファイター6",
    "channel": "スト6ボイロ部",
    "date": "2025-03-01",
    "kind": "counter"
  },
  {
    "id": "X9wJ61WkyEQ",
    "title": "【 #スト６ 】ジェイミー 最大コンボ 【 #sf6 #初心者 #対策 #コンボ #streetfighter #short #ジェイミー 】",
    "channel": "リプラボ / Replay-Lab",
    "date": "2024-06-19",
    "kind": "counter"
  },
  {
    "id": "M4Wsb4rINJY",
    "title": "【スト6】ジェイミー対策完全版｜Year4対応 新・キャラ徹底対策②【トレモ付き】",
    "channel": "スト6初心者応援チャンネル",
    "date": "2026-08-11",
    "kind": "counter"
  },
  {
    "id": "nxCSx_lAwY4",
    "title": "スト6 ジェイミー コンボ 備忘録",
    "channel": "ぷぷぷ",
    "date": "2026-09-13",
    "kind": "guide"
  },
  {
    "id": "bPBY_dJLWcw",
    "title": "【スト6】なるおジェイミー 息もつかせぬ流酔の技 なるお (ジェイミー) 【ストリートファイター6】",
    "channel": "昇龍拳",
    "date": "2026-10-09",
    "kind": "guide"
  },
  {
    "id": "5Gxodt1PH0Y",
    "title": "【アルマス】30秒で超強化された「ひじ」を解説!!【ジェイミー】【スト6】【解説】【VTuber】",
    "channel": "Tajifu Ch. たじふ。",
    "date": "2026-08-03",
    "kind": "guide"
  },
  {
    "id": "6fjVxSl33M8",
    "title": "新SA1コンボ　※2026/08版【スト6　MR2200ジェイミー】",
    "channel": "MONSTER【スト6ジェイミー】",
    "date": "2026-08-03",
    "kind": "guide"
  },
  {
    "id": "Xj2wOF65lTw",
    "title": "【スト6】ジェイミー徹底対策【続編】キャラ対策を使った実戦での立ち回りを徹底解説｜初心者～マスター対応｜新シリーズ、キャラ対 実践編＃2",
    "channel": "スト6初心者応援チャンネル",
    "date": "2025-11-04",
    "kind": "counter"
  },
  {
    "id": "tuzUzlw33oU",
    "title": "1分でわかるYEAR2のジェイミー対策【SF6 ver 202409】",
    "channel": "格ゲーゴリラ やさい",
    "date": "2024-11-27",
    "kind": "counter"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_JAMIE: VideoSummary[] = candidates.map(({id,title,channel,date,kind}): VideoSummary => ({
 id:`preview-jamie-${id}`,slug:`preview-jamie-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:`${date}T00:00:00Z`,description:"ジェイミー関連候補。現行Patch・対戦関係は未検証。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["ジェイミー"],players:[],
 categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
