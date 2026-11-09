import type { VideoSummary } from "@/lib/event-media";
 /** Character: luke; YouTube-search verified video IDs. Preview-only, gameplay and participants unverified. */
 const candidates = [
  {
    "id": "dRSpIWpABaA",
    "title": "【スト6】これだけ覚えればOK！ルークの実戦コンボ＆セットプレイを徹底解説",
    "channel": "いおりチャンネル【スト6講座と対戦動画投稿】",
    "date": "2026-08-17",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "65sSnRAZsEA",
    "title": "【スト6 】Year4対応！ルークの厳選18コンボとセットプレイ集。おすすめ起き攻め方法や調整後のコンボも解説",
    "channel": "ミダ猫のゲーム動画",
    "date": "2026-08-16",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "IzUNF1avwR8",
    "title": "ルークで1位に到達したシュートがリュウとの違いと魅力を語る【CR/シュート/切り抜き/ルーク/リュウ/SF6】",
    "channel": "しゅーとチャンネル / Shuto",
    "date": "2026-10-03",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "F_gsb2-IYuE",
    "title": "【スト6】注目キャラルーク!!起き攻め・コンボ・セットプレイまとめて完全解説",
    "channel": "じゃじいのガチンコチャンネル",
    "date": "2026-08-08",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "SVKobqqwyJA",
    "title": "【スト6 】ルークの厳選17コンボとセットプレイ集。おすすめ起き攻め方法や調整後のコンボも解説",
    "channel": "ミダ猫のゲーム動画",
    "date": "2024-12-17",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "T6a4ol2L4C0",
    "title": "【スト6】ルークのコンボ解説！MでもCでもこれ意識して！【ルーク】",
    "channel": "じゃじいのガチンコチャンネル",
    "date": "2025-06-16",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "a5zkM6kCjTw",
    "title": "【スト6】おなじみから最新まで！ルークの起き攻めまとめてみたぞ【ルーク】",
    "channel": "じゃじいのガチンコチャンネル",
    "date": "2025-09-10",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "O5pls8N-jx8",
    "title": "【SF6】ルーク 立ち強K持続当てセットプレイ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-03-30",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "qQk00K6rcas",
    "title": "初心者向け！ルークはとりあえずこれ！状況別コンボ4種！",
    "channel": "キータカ Keyetaka",
    "date": "2024-02-23",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "veNUlpvI6is",
    "title": "【スト６】ルーク使うならこれだけ覚えて！！とりこれコンボとセットプレイ徹底解説！！　#スト6  #ストリートファイター6  #streetfighter6",
    "channel": "いおりチャンネル【スト6講座と対戦動画投稿】",
    "date": "2024-12-31",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "aGIFH-aBL-I",
    "title": "【モダン対応基礎力】““初心者向け””ルークのコンボや起き攻めセットプレイについて解説【スト6】",
    "channel": "人生迷子ちゃん",
    "date": "2026-10-07",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "0n-uiFFTfOY",
    "title": "【スト6】過去最高！？に強化されたルークの新しい使い方！！",
    "channel": "【スト6】ずんだもんふぁいたーch【解説】",
    "date": "2026-08-04",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "IpgIdZ5KM54",
    "title": "【SF6】ルーク 確定反撃フルゲージコンボ❗️#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2024-12-16",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "eKmgotlpjU0",
    "title": "【SF6】2400MR超えルーク！恐れ知らずの突進力！正面突破が止まらないｗｗｗ「ひなお(hinao):ルーク(Luke)」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2025-07-04",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "zVm4GaN5SG8",
    "title": "【SF6】世界1位ルーク！拳で押し潰す猛攻がエグすぎるｗｗｗ「Shuto:ルーク(Luke)」【スト6】",
    "channel": "SF6-MODERN",
    "date": "2026-11-09",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "D2g_wzFcKEM",
    "title": "【モダンルーク】最新版！Mルークの実戦的コンボと強力セットプレイまとめ！【スト６】",
    "channel": "【スト6】ずんだもんふぁいたーch【解説】",
    "date": "2026-04-03",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "zpCxmFMi2DI",
    "title": "ルークが旬すぎるので最新コンボ解説動画作りました【スト6・カワノ】",
    "channel": "カワノKawano",
    "date": "2026-08-06",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "qe-ONf3o6Kw",
    "title": "【スト6】強化されたルークの弾\"サンドブラスト\"の撃ち方を解説するじゃじい",
    "channel": "じゃじいのガチンコチャンネル",
    "date": "2026-08-09",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "zRUXv8YZT6s",
    "title": "【爆勝】モダンルーク、これだけで勝てます。格ゲー未経験からLEGENDまでやりこんだMルーク使いが立ち回りを徹底解説！【スト6】",
    "channel": "バーロえどがわ",
    "date": "2026-10-25",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "4mv18oVj5zk",
    "title": "ルークの調整を確認し強化を実感!!新しい武器の使い方や強い理由を解説する立川【ルーク/強化/調整/スト6】【立川/CR/切り抜き】",
    "channel": "立川ちゃんねる",
    "date": "2026-04-01",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "c-2Nny26pFQ",
    "title": "【スト6】超強化されて生まれ変わったルーク!!強化点をまとめて解説!!",
    "channel": "じゃじいのガチンコチャンネル",
    "date": "2026-08-06",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "KsaNA_A4-PE",
    "title": "スト6 ルーク レジェンドが教える前投げ後の起き攻め #ストリートファイター6 #スト6 #streetfighter #sf6 #ルーク",
    "channel": "うおち",
    "date": "2026-09-03",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "QiRP6dzuoiM",
    "title": "【スト6】「あかん！止まらへん！」調整後アレックスとルークがパワフルすぎて高まる【なるお・ストリートファイター6】",
    "channel": "なるおのひとりでできるもん",
    "date": "2026-08-10",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "5YFKa92p4eo",
    "title": "【SF6】ルーク 中央始動最大超高火力コンボ！",
    "channel": "inaGuile@攻めガイル",
    "date": "2026-06-18",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "CxZ7lWCwiS4",
    "title": "【 Mルーク 】屈中P⇒サプレッサー！？最強セットプレイ【 スト６ 】#shorts",
    "channel": "Shadow／シャドウ",
    "date": "2025-07-12",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "vkduVg1KfsU",
    "title": "【スト6】調整来た！新ルークに大興奮する漢【ルーク】",
    "channel": "じゃじいのガチンコチャンネル",
    "date": "2026-03-22",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "TXENXMIDvLk",
    "title": "【スト6】シルバー・ゴールド必見！ルークのプラチナ昇格セットプレイ！【荒巻ガイ】",
    "channel": "荒巻ガイ",
    "date": "2025-09-18",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "GGWIYqqEF4Y",
    "title": "【スト６】モダンルーク初心者やるべきおすすめコンボ#shorts  #ストリートファイター6",
    "channel": "戦闘民族ずんだもん【アクションゲーム解説】",
    "date": "2025-01-23",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "MwDpvxmGM2A",
    "title": "【スト6】勝てるようになる『ルークの使い方』を解説!!初心者におすすめのLUKEの強い技や連携、立ち回り方を紹介します！【STREET FIGHTER 6】",
    "channel": "Gorou / 五郎",
    "date": "2023-09-27",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "5fgAO4LyqqI",
    "title": "【SF6】ルーク 新バージョン ODフラッシュナックルエコ高火力コンボ！",
    "channel": "inaGuile@攻めガイル",
    "date": "2026-08-07",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  }
] as const;
 export const CHARACTER_VIDEO_DEEP_LUKE: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
  id:`preview-luke-${id}`,slug:`preview-luke-${id}`,title,platform:"youtube",
  videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
  description:"キャラ別動画候補（動画ID・タイトル確認）。収録時点の内容で、現行Patch適合性・出演者の正式関連は未検証です。",
  url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["ルーク"],
  players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
 }));
