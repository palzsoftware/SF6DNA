import type { VideoSummary } from "@/lib/event-media";
 /** Character: jp; YouTube-search verified video IDs. Preview-only, gameplay and participants unverified. */
 const candidates = [
  {
    "id": "NYMfTRyFAvM",
    "title": "【スト６】これ一本で全てがわかるプロゲーマーのJP講座",
    "channel": "りゅうせい",
    "date": "2024-10-31",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "mmJusdic1Yg",
    "title": "MRが絶対上がる！JPの地上戦・弾打ち理論をプロが完全解説【りゅうせい・スト6】",
    "channel": "りゅうせい",
    "date": "2026-02-17",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "Lc1NGGRQTGw",
    "title": "JPが実戦で使うコンボ全て教えます【りゅうせい・スト6】",
    "channel": "りゅうせい",
    "date": "2026-09-23",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "RUnApYarDS4",
    "title": "JPの強行動を徹底解説します【りゅうせい・スト6】",
    "channel": "りゅうせい",
    "date": "2026-09-26",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "lqMgnWVXlv0",
    "title": "翔のJP講座が有料級で感動するりゅうせい【スト６】",
    "channel": "りゅうせい",
    "date": "2025-01-16",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "x5FrEpiVY2c",
    "title": "【完全版】最終レジェンドJPによるコンボ＆セットプレイ解説！【year3対応】",
    "channel": "なんでねー",
    "date": "2025-05-09",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "U-pvXjh4yS4",
    "title": "翔のJP弾打ち講座と考え方に衝撃を受けるりゅうせい【スト６】",
    "channel": "りゅうせい",
    "date": "2025-01-22",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "3hHac9ko9nY",
    "title": "【SF6】JP SA2 補正切りコンボ　5000ダメージ #解説 #コンボ #jp #sa2",
    "channel": "てんかく",
    "date": "2025-08-04",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "Dmd_zhtkQzM",
    "title": "【最新版】アプデで生まれ変わったJPを完全解説！弱体化点や強化点、新しいコンボも全部これ見たら分かります【スト6】",
    "channel": "勇者きょーすけ【実況】",
    "date": "2026-03-18",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "sqA-nQIBRUU",
    "title": "【スト6】コンボ立ち回りセットプレイ 全てに隙なし かけちゃんJP 翔 (JP) 【SF6】",
    "channel": "昇龍拳",
    "date": "2026-06-26",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "Mt0i0rJaL_M",
    "title": "JPはとりあえずこれ！状況別コンボ！！",
    "channel": "キータカ Keyetaka",
    "date": "2025-04-19",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "FEzGr7y1t1s",
    "title": "【ランク別】JP使い初心者必見！マスターに行くために立ち回りで必要なこと３選",
    "channel": "なんでねー",
    "date": "2025-03-26",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "Nil7Jm70YPc",
    "title": "【スト6】圧倒的立ち回り 終わらないセットプレイ これぞ究極JP 翔 (JP) 【SF6】",
    "channel": "昇龍拳",
    "date": "2026-04-30",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "eGFiGCrvgFw",
    "title": "スト6JPガード困難なセットプレイ #スト6コンボ #ストリートファイター6 #スト6jp #JP",
    "channel": "minko ",
    "date": "2025-02-09",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "TppoRqFmaVE",
    "title": "【SF6】JP SA2活用中央限定運び&起き攻めコンボ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-04-02",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "OZJsCK7YXzw",
    "title": "荒らされて負ける人これ見てください。JPの立ち回りの「真理」についに到達した男【スト6】",
    "channel": "勇者きょーすけ【実況】",
    "date": "2026-02-24",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "C7UNoWiJhCw",
    "title": "【SF6】JP 強K確定反撃(ダメージ更新版)高火力コンボ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-07-12",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "YGDNAcWvBPg",
    "title": "【スト6】JP絵面が終わってる詰みセットプレイ#shorts",
    "channel": "りゅうせい",
    "date": "2025-10-18",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "OIQsvoI6WGc",
    "title": "【SF6】JP アムネジア(投げ) 入れ替えコンボ❗️ #スト6解説 #スト6",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-02-15",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "JYauIAbdWWA",
    "title": "スト6 ガード困難な連携！たいじJPの見えないセットプレイが強すぎる【RAGE振り返り】 #shorts #ハイタニ",
    "channel": "ハイタニ TV",
    "date": "2024-08-17",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "A28Hs4CPas0",
    "title": "【SF6】JP インパクト返し不可しゃがみ対応セットプレイ！#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-06-14",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "dAPUpaGT14o",
    "title": "【SF6、スト6】JP 使い方講座 初級編",
    "channel": "ACQUA",
    "date": "2023-09-16",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "DYsHadiA8vk",
    "title": "【スト６】JPのコンボが別ゲーすぎる#shorts",
    "channel": "りゅうせい",
    "date": "2024-10-25",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "vJ4Q-WV_cdU",
    "title": "【スト6】簡単なのに超強力！JP攻め方講座【解説】",
    "channel": "ぽてんす",
    "date": "2025-04-06",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "g-m0AFGe4jY",
    "title": "【スト6】Year1で遊んでみた！今だから笑える初期JPのぶっ壊れ技",
    "channel": "ACQUA",
    "date": "2026-04-30",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "QliOqyPKAoU",
    "title": "お盆に覚えるJP基礎コンボ５選　 #jp #streetfighter #sa2 #ストリートファイター6 #コンボ #スト6 #解説 #sf6 #fgc #基礎 #基本 #基本コンボ",
    "channel": "てんかく",
    "date": "2025-08-12",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  },
  {
    "id": "rMhh3OP751o",
    "title": "【SF6】JP SA1オススメコンボ❗️#スト6 #スト6解説",
    "channel": "inaGuile@攻めガイル",
    "date": "2025-01-29",
    "kind": "guide",
    "source": "YouTube検索結果（動画ID・タイトル・チャンネル確認）"
  }
] as const;
 export const CHARACTER_VIDEO_DEEP_JP: VideoSummary[] = candidates.map(({id,title,channel,date,kind})=>({
  id:`preview-jp-${id}`,slug:`preview-jp-${id}`,title,platform:"youtube",
  videoType:kind,publishedAt:date?`${date}T00:00:00Z`:null,
  description:"キャラ別動画候補（動画ID・タイトル確認）。収録時点の内容で、現行Patch適合性・出演者の正式関連は未検証です。",
  url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["JP"],
  players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
 }));
