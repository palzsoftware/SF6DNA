import type { VideoSummary } from "@/lib/event-media";
/** C. Viper research candidates sourced from indexed YouTube pages. Preview only: playback and current patch applicability unverified. Counter videos target C. Viper. */
const candidates = [
  {
    "id": "Ka0KUJuYe5o",
    "title": "So You Want to Learn C. Viper... | Road to Master",
    "channel": "Nephew",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Ka0KUJuYe5o"
  },
  {
    "id": "oN2JGpTk6lQ",
    "title": "C. Viper Ultimate Starter Guide - Street Fighter 6",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=oN2JGpTk6lQ"
  },
  {
    "id": "sD6SaqB9h-M",
    "title": "Street Fighter 6 C. Viper Combos Guide, With Annotations!",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=sD6SaqB9h-M"
  },
  {
    "id": "CHBX-njUPm0",
    "title": "C. Viper Combo Guide - Street Fighter 6",
    "channel": "rooflemonger",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=CHBX-njUPm0"
  },
  {
    "id": "j52YVgja-Ms",
    "title": "C.Viper Beginner Guide | Street Fighter 6",
    "channel": "UltraSnance",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=j52YVgja-Ms"
  },
  {
    "id": "iTETV5HOfJ0",
    "title": "How to beat C. Viper in SF6",
    "channel": "Broski",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=iTETV5HOfJ0"
  },
  {
    "id": "uIp0RtZg_m0",
    "title": "【スト6】ヴァイパーを勉強する！ #あきひろ中学校",
    "channel": "獅白ぼたん",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=uIp0RtZg_m0"
  },
  {
    "id": "4rtacgNj7oY",
    "title": "SFL第2節でヴァイパー出陣！カワノvsときどさんを振り返りながらチームの個人的MVPを語るぷげら",
    "channel": "ぷげら pugera",
    "kind": "guide",
    "source": "https://yutura.net/channel/111842/video/4rtacgNj7oY/"
  },
  {
    "id": "kDQ-dQhXxMM",
    "title": "【スト６】ヴァイパーと対戦して対策する！！",
    "channel": "いおりチャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=kDQ-dQhXxMM"
  },
  {
    "id": "RINLGEfZGMU",
    "title": "【スト6】とりあえず一週間ぼられないためのヴァイパー対策",
    "channel": "えらさんは今日も頑張る",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=RINLGEfZGMU"
  },
  {
    "id": "U1PPJygEnxg",
    "title": "【Mジュリ】キャラ対策ヴァイパー編 / Mヴァイパー使いと対戦研究",
    "channel": "黒燿リラ / KOKUYOU LIRA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=U1PPJygEnxg"
  },
  {
    "id": "N_Zwgoy1g4A",
    "title": "Punk（キャミィ）vs かずのこ（C.ヴァイパー）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/N_Zwgoy1g4A/"
  },
  {
    "id": "JjoLN3LnMoY",
    "title": "立川にヴァイパーを教わる石狩あかり",
    "channel": "Vtuber Showdown",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/JjoLN3LnMoY"
  },
  {
    "id": "0nJsNGYSiAQ",
    "title": "『ストリートファイター6』キャラクターガイド｜C.ヴァイパー",
    "channel": "CapcomChannel",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=0nJsNGYSiAQ"
  },
  {
    "id": "FoK_E3zJYE8",
    "title": "C.ヴァイパーコンボトライアルをレバーレスで解説",
    "channel": "Rush Gorou / 五郎",
    "kind": "guide",
    "source": "https://yutura.net/channel/106217/video/FoK_E3zJYE8/"
  },
  {
    "id": "5fIGxqhzd98",
    "title": "C.ヴァイパーを制圧する 対空精度 #SFL #スト6",
    "channel": "Capcom Fighters JP",
    "kind": "counter",
    "source": "https://yutura.net/channel/47625/video/5fIGxqhzd98/"
  },
  {
    "id": "IRjymRoP4bU",
    "title": "『ストリートファイター6』キャラクターガイド｜C.ヴァイパー（C.Viper）",
    "channel": "PlayStation Japan",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=IRjymRoP4bU"
  },
  {
    "id": "lZkkIZFpcYg",
    "title": "C. Viper Combo Compilation!!! (ALL YOU NEED TO KNOW!)",
    "channel": "Doctor DP | FGC",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=lZkkIZFpcYg"
  },
  {
    "id": "oQQzfQhT2Tg",
    "title": "SF6: C Viper SA1 Overview + Useful Setups",
    "channel": "Killerex100",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=oQQzfQhT2Tg"
  },
  {
    "id": "fRsNOJCkizA",
    "title": "【スト6】ヴァイパー完全解説!!コンボ・使い方・対策・セットプレイ・対戦動画すべてある！",
    "channel": "いおりチャンネル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=fRsNOJCkizA"
  },
  {
    "id": "metNr-Gz0Yc",
    "title": "【スト6】ヴァイパーの実戦コンボ＆セットプレイまとめ！",
    "channel": "いおりチャンネル",
    "kind": "guide",
    "source": "https://yutura.net/channel/75881/video/metNr-Gz0Yc/"
  },
  {
    "id": "8dO7xNajc9Y",
    "title": "【スト6】ヴァイパーが強そうなので使っていきます！",
    "channel": "いおりチャンネル",
    "kind": "match",
    "source": "https://yutura.net/channel/75881/video/8dO7xNajc9Y/"
  },
  {
    "id": "61O8EIekHCU",
    "title": "【スト6】「ここから倒せる」ヴァイパーの火力が理不尽すぎた！",
    "channel": "いおりチャンネル",
    "kind": "match",
    "source": "https://yutura.net/channel/75881/video/61O8EIekHCU/"
  },
  {
    "id": "2IXxqqFbFGU",
    "title": "REJECTのヴァイパー対策を支えたたいじについて、ときどに聞く立川",
    "channel": "立川ちゃんねる",
    "kind": "counter",
    "source": "https://yutura.net/channel/100695/video/2IXxqqFbFGU/"
  },
  {
    "id": "Oof7jZJILkE",
    "title": "SFL2026 さはら（エド）vs ふ～ど（C.ヴァイパー）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/Oof7jZJILkE/"
  },
  {
    "id": "QnanF8nM-gU",
    "title": "SFL2026 ぷげら（C.ヴァイパー）vs わびいち（テリー）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/QnanF8nM-gU/"
  },
  {
    "id": "B_P0z75f3_s",
    "title": "SFL2026 ぷげら（C.ヴァイパー）vs YAS（リュウ）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/B_P0z75f3_s/"
  },
  {
    "id": "u5O4saobv0E",
    "title": "SFL2026 ふ～ど（C.ヴァイパー）vs KEI.B（舞）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/u5O4saobv0E/"
  },
  {
    "id": "ECDx7XOmBXA",
    "title": "KIDO（アルジュン）vs ふ～ど（C.ヴァイパー）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/ECDx7XOmBXA/"
  },
  {
    "id": "EtOH8v9CYCk",
    "title": "SFL2026 ふ～ど（C.ヴァイパー）vs 大谷（ルーク）",
    "channel": "Capcom Fighters JP",
    "kind": "match",
    "source": "https://yutura.net/channel/47625/video/EtOH8v9CYCk/"
  },
  {
    "id": "jaa-yqsYi_k",
    "title": "ハイタニがふ～どヴァイパー対大谷戦を解説",
    "channel": "ハイタニ TV",
    "kind": "guide",
    "source": "https://yutura.net/channel/55522/video/jaa-yqsYi_k/"
  },
  {
    "id": "YAyjmKbVd38",
    "title": "ふ～ど（C.ヴァイパー）vs ウメハラ（豪鬼）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://yutura.net/channel/56626/video/YAyjmKbVd38/"
  },
  {
    "id": "LFmPkskwW6Y",
    "title": "SFL2026 ふ～どインタビュー・ヴァイパーの戦い方（3:32〜）",
    "channel": "ぶいすぽ暮らし",
    "kind": "guide",
    "source": "https://yutura.net/channel/125402/video/LFmPkskwW6Y/"
  },
  {
    "id": "5e-Jw-48Hj8",
    "title": "実用的！ヴァイパー使いの悩みを捌きまくるChatPGR",
    "channel": "ぷげら pugera",
    "kind": "guide",
    "source": "https://yutura.net/channel/111842/video/5e-Jw-48Hj8/"
  },
  {
    "id": "edPoRFtwgxE",
    "title": "上位ヴァイパーのリプレイ見てみる",
    "channel": "うりょ",
    "kind": "guide",
    "source": "https://yutura.net/channel/141424/video/edPoRFtwgxE/"
  },
  {
    "id": "WbUCOPEgi5g",
    "title": "いおり配信のLEGEND帯対戦まとめ（00:58:26 C.ヴァイパー戦）",
    "channel": "いおりチャンネル",
    "kind": "match",
    "source": "https://yutura.net/channel/75881/video/WbUCOPEgi5g/"
  }
] as const;
export const CHARACTER_VIDEO_C_VIPER_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-c-viper-${id}`,slug:`preview-c-viper-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`${kind==="counter"?"C.ヴァイパーへの対策。":"C.ヴァイパーの攻略・研究。"} 出典: ${source}。再生・内容全編・現行パッチ適合性・公開承認は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,channelName:channel,
 durationSeconds:null,language:null,controlTypes:[],events:[],characters:["C.ヴァイパー"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
