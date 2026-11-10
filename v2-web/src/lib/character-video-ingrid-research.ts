import type { VideoSummary } from "@/lib/event-media";
/** Ingrid video research: source-linked preview candidates only. 
 * counter = advice AGAINST Ingrid. Full playback, content, patch and publication approval remain unverified.
 * Deleted/unavailable historic videos are intentionally excluded. */
const candidates = [
  {
    "id": "1o4EPXASNwg",
    "title": "Street Fighter 6 Ingrid Combo Guide! Annotations & Timestamps",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=1o4EPXASNwg",
    "published": "2026-05-30"
  },
  {
    "id": "lJKr8s3TII0",
    "title": "イングリッドの立ち回りから必須コンボまで！使い方解説",
    "channel": "煌月ソウル【スト6解説】",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=lJKr8s3TII0",
    "published": "2026-06-05"
  },
  {
    "id": "1kFHnxOx36A",
    "title": "SF6 Ingrid Combos Guide",
    "channel": "MC MuraFGC",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=1kFHnxOx36A",
    "published": "2026-05-28"
  },
  {
    "id": "TC5iK3yiOXk",
    "title": "【スト6、SF6】絶対勝率が上がる！イングリッド対策！",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=TC5iK3yiOXk",
    "published": "2026-06-01"
  },
  {
    "id": "w-xf_il8xqg",
    "title": "【スト6】イングリッド対策 実践編！実戦で勝率を上げる立ち回りと攻略ポイントを徹底解説",
    "channel": "いおりチャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=w-xf_il8xqg",
    "published": "2026-06-04"
  },
  {
    "id": "zeXnNeBJysM",
    "title": "イングリッドに勝てない人へ。歌広場さんと学ぶ対策講座【スト6】",
    "channel": "いおりチャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=zeXnNeBJysM",
    "published": "2026-06-02"
  },
  {
    "id": "q-HasgU1a_U",
    "title": "【5選】知識で差がつく『イングリッド対策』徹底解説 // じゃじい × ハメコ。",
    "channel": "SmashlogTV - SF6",
    "kind": "counter",
    "source": "https://sf6-ingrid.com/article/ingrid-matchup-anti-5-tips-smashlog",
    "published": "2026-06-12"
  },
  {
    "id": "I_pM4R_dO68",
    "title": "【スト6】イングリッドの実戦コンボ＆セットプレイまとめ！とりあえずこれ覚えればOK【SF6】",
    "channel": "いおりチャンネル",
    "kind": "guide",
    "source": "https://yutura.net/channel/75881/video/I_pM4R_dO68/",
    "published": "2026-10-01"
  },
  {
    "id": "6X6v4SKS-tQ",
    "title": "『スト6』イングリッドが参戦！CPU対決・技表・コンボトライアル",
    "channel": "電撃オンライン",
    "kind": "guide",
    "source": "https://yutura.net/channel/1077/video/6X6v4SKS-tQ/",
    "published": "2026-05-21"
  },
  {
    "id": "Fb566Gy3YcU",
    "title": "【202605ver】ストリートファイター6 イングリッド 基本コンボ",
    "channel": "メノ(Meno)",
    "kind": "guide",
    "source": "https://yutura.net/channel/60439/video/Fb566Gy3YcU/",
    "published": "2026-05-28"
  },
  {
    "id": "CRG2SuegGV8",
    "title": "対イングリッド専用バッドエンドコンボを研究するカワノ",
    "channel": "カワノKawano",
    "kind": "counter",
    "source": "https://yutura.net/channel/43075/trend/CRG2SuegGV8/",
    "published": "2026-10-08"
  },
  {
    "id": "91WWyC3AujQ",
    "title": "イングリッド実装！高火力コンボや隠し要素を試すありけん",
    "channel": "ありけん",
    "kind": "guide",
    "source": "https://yutura.net/channel/16537/video/91WWyC3AujQ/",
    "published": "2026-05-29"
  },
  {
    "id": "kwWm8THVuPQ",
    "title": "ぷげら（アルジュン）vs MT2 Impact（イングリッド）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/kwWm8THVuPQ/",
    "published": "2026-10-13"
  },
  {
    "id": "d45cgkMXB5w",
    "title": "かずのこ（アルジュン）vs こな76（イングリッド）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/d45cgkMXB5w/",
    "published": "2026-10-20"
  },
  {
    "id": "_AlYZkqEB18",
    "title": "かずのこ（アルジュン）vs オニキ（イングリッド）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/_AlYZkqEB18/",
    "published": "2026-10-19"
  },
  {
    "id": "A1Ed4u7uaQM",
    "title": "【スト6】イングリッド、実は超攻撃的キャラ！？調整後を使って対戦してみた",
    "channel": "いおりチャンネル",
    "kind": "match",
    "source": "https://yutura.net/channel/75881/video/A1Ed4u7uaQM/",
    "published": "2026-09-29"
  },
  {
    "id": "ox0fkqsh7R4",
    "title": "イングリッド最前線攻略所・実装初日の長時間研究配信",
    "channel": "ACQUA",
    "kind": "guide",
    "source": "https://acqua-souken.com/live/ox0fkqsh7R4/",
    "published": "2026-05-28"
  },
  {
    "id": "HXEDttti3Rg",
    "title": "【スト６】イングリッド触って対戦会がちでミリしらになりそうな件について",
    "channel": "渡会雲雀",
    "kind": "match",
    "source": "https://www.youtube.com/live/HXEDttti3Rg",
    "published": "2026-05-28"
  },
  {
    "id": "iyGSC0Vjk7w",
    "title": "イングリッドでついに最終レジェ達成！限界突破した立ち回り",
    "channel": "勇者きょーすけの配信",
    "kind": "match",
    "source": "https://yutura.net/channel/167116/video/iyGSC0Vjk7w/",
    "published": "2026-11-05"
  },
  {
    "id": "VBf4qf7fgtM",
    "title": "調整後も貯まったら出すだけのドパキャラだったイングリッドの面白さに気づくストーム久保",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://yutura.net/channel/58286/video/VBf4qf7fgtM/",
    "published": "2026-10-05"
  },
  {
    "id": "ohQhirOyiIY",
    "title": "【SF6】世界1位イングリッド！egutoの高レベル対戦集",
    "channel": "SF6-MODERN",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=ohQhirOyiIY",
    "published": "2026-06-01"
  },
  {
    "id": "oQpgRncS2JU",
    "title": "イングリッドの対戦動画が解禁されたので、早速海外から友達と見てみる",
    "channel": "カワノKawano",
    "kind": "guide",
    "source": "https://yutura.net/channel/43075/trend/oQpgRncS2JU/",
    "published": "2026-05-22"
  },
  {
    "id": "Ts0QlLNkoGI",
    "title": "レジェ帯でMRを爆盛りするイングリッド",
    "channel": "勇者きょーすけの配信",
    "kind": "match",
    "source": "https://yutura.net/channel/167116/video/Ts0QlLNkoGI/",
    "published": "2026-09-08"
  },
  {
    "id": "So068YOIB8c",
    "title": "【スト６】新キャラ・イングリッドを使ってみる",
    "channel": "かずのこチャンネル",
    "kind": "match",
    "source": "https://yutura.net/channel/20381/trend/So068YOIB8c/",
    "published": "2026-05-28"
  },
  {
    "id": "yMT_fWXdqaA",
    "title": "【完全解説】最終レジェイングリッドがキャラ相性表と対戦攻略を解説",
    "channel": "勇者きょーすけの配信",
    "kind": "guide",
    "source": "https://yutura.net/channel/167116/video/yMT_fWXdqaA/",
    "published": "2026-11-09"
  },
  {
    "id": "aonR2oJw0gQ",
    "title": "端は〇〇さえ意識すれば有利に動けます。MR1300イングリッドのリプレイコーチング#81",
    "channel": "ぷげら pugera",
    "kind": "guide",
    "source": "https://yutura.net/channel/111842/video/aonR2oJw0gQ/",
    "published": "2026-10-22"
  },
  {
    "id": "4HRZavsOV78",
    "title": "Mのサブキャラ二次面接!!イングリッドとジュリを試しに使ってみたら印象が大きく変わりました!!",
    "channel": "立川ちゃんねる",
    "kind": "guide",
    "source": "https://yutura.net/channel/100695/video/4HRZavsOV78/",
    "published": "2026-10-29"
  },
  {
    "id": "JQTFOP209hE",
    "title": "[SF6] Ingrid Basic Combo Guide Part 1 (Provisional)",
    "channel": "yoriの天敵 Gameちゃんねる",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=JQTFOP209hE",
    "published": "2026-05-29"
  },
  {
    "id": "xOfY-shPsPw",
    "title": "【SF6】相打ちなしワンコンボ最大ダメージランキング【イングリッド追加アプデver】",
    "channel": "traias channel",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=xOfY-shPsPw",
    "published": "2026-06-05"
  },
  {
    "id": "X_8DBIwexDo",
    "title": "MR2000の猛者イングリッドをレジェンドがコーチングしてみた！！！勝つために重要な考え方とは？",
    "channel": "勇者きょーすけの配信",
    "kind": "guide",
    "source": "https://yutura.net/channel/167116/video/X_8DBIwexDo/",
    "published": "2026-11-07"
  },
  {
    "id": "iqCqhmqh4wo",
    "title": "【限界突破】イングリッドでついにMR2200達成！！！宇宙規模のポテンシャルを見よ！！！",
    "channel": "勇者きょーすけの配信",
    "kind": "match",
    "source": "https://yutura.net/channel/167116/video/iqCqhmqh4wo/",
    "published": "2026-10-09"
  },
  {
    "id": "bSIyVWNfzyg",
    "title": "【スト6】「SA2回すキャラになる!?」イングリッドSAのダメージをガチ検証した結果",
    "channel": "ひろしまのあきら",
    "kind": "guide",
    "source": "https://yutura.net/channel/129246/popular/bSIyVWNfzyg/",
    "published": "2026-05-27"
  }
] as const;

export const CHARACTER_VIDEO_INGRID_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source,published}): VideoSummary => ({
  id:`preview-ingrid-${id}`, slug:`preview-ingrid-${id}`, title, platform:"youtube", videoType:kind,
  publishedAt: `${published}T00:00:00Z`,
  description:`${kind === "counter" ? "イングリッドに勝つためのキャラ対策候補。" : "イングリッドの使い方・コンボ解説候補。"} 参照元: ${source}。動画本編・現行Patch・再生可否・公開承認は未検証です。`,
  url:`https://www.youtube.com/watch?v=${id}`, thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  channelName:channel, durationSeconds:null, language:null, controlTypes:[], events:[],
  characters:["イングリッド"], players:[], categories:[kind], level:"unknown", viewCount:null, viewCountCheckedAt:null,
}));
