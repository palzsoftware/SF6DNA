import type { VideoSummary } from "@/lib/event-media";
/** Alex video research. The 'counter' category means guidance AGAINST Alex, regardless of player character.
 * Preview candidate only; YouTube availability, current patch, reproduction and publication are not verified. */
const candidates = [
  {
    "id": "KOBn4nUUVKU",
    "title": "Street Fighter 6 Alex Combos Guide, With Annotations!",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=KOBn4nUUVKU"
  },
  {
    "id": "coibdQA1iY8",
    "title": "アレックスの立ち回りから必須コンボまで！使い方解説",
    "channel": "煌月ソウル【スト6解説】",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=coibdQA1iY8"
  },
  {
    "id": "_cusIwZk4Ck",
    "title": "アレックス対策！相手の強行動にリスクを与えるべし。",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=_cusIwZk4Ck"
  },
  {
    "id": "RzvS0bkwvAM",
    "title": "リスナーのリプレイを見ながらアレックス対策を伝授！",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://acqua-souken.com/v/RzvS0bkwvAM/"
  },
  {
    "id": "xqXOK6noUF8",
    "title": "アレックス CPU戦＆コンボトライアル 先行プレイ映像",
    "channel": "よんかめゲーム情報",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=xqXOK6noUF8"
  },
  {
    "id": "kZSRvjMrGpo",
    "title": "超実践向け！状況別アレックスの起き攻め(セットプレイ)40選！",
    "channel": "GANAKEN / ガナケン",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=kZSRvjMrGpo"
  },
  {
    "id": "FjjQgE4myuQ",
    "title": "アレックス 画面端・密着構え起き攻め",
    "channel": "かなた",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=FjjQgE4myuQ"
  },
  {
    "id": "R7KvPo7Lh1Y",
    "title": "改良版 アレックス+31F起き攻め集",
    "channel": "GAKU",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=R7KvPo7Lh1Y"
  },
  {
    "id": "y9cNx7e70PA",
    "title": "13分でわかるアレックス対策 ベガ目線 修正版",
    "channel": "大車輪",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=y9cNx7e70PA"
  },
  {
    "id": "ic1jRKXYdbM",
    "title": "アレックス対策 確定反撃・全技徹底解説 自キャラリュウ",
    "channel": "けんてぃちゅーぶ【スト6攻略】",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=ic1jRKXYdbM"
  },
  {
    "id": "lPvLljxNCf0",
    "title": "アレックス解説＆簡単コンボ紹介 新キャラの強い技・SA",
    "channel": "ぷにぷに@スト６解説ずんだもん",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=lPvLljxNCf0"
  },
  {
    "id": "DHVwKD4gH6A",
    "title": "今すぐ使えるアレックス解説！ 超絶テクキャラを簡単に使おう",
    "channel": "小路KOG",
    "kind": "guide",
    "source": "https://yutura.net/channel/75358/video/DHVwKD4gH6A/"
  },
  {
    "id": "0OVLCpwJOlQ",
    "title": "アレックス新発表の対戦映像をハイタニが解説",
    "channel": "ハイタニ TV",
    "kind": "guide",
    "source": "https://yutura.net/channel/55522/video/0OVLCpwJOlQ/"
  },
  {
    "id": "W9u4b_f_JAI",
    "title": "KEI.Bにアレックスを教わる甘結もか（元配信）",
    "channel": "甘結もか",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/RTA_riM4MZc"
  },
  {
    "id": "uKc9SMONlxU",
    "title": "アレックス コンボ解説（海外コミュニティ共有）",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=uKc9SMONlxU"
  },
  {
    "id": "49lg89YGQtU",
    "title": "アレックス コンボトライアル（海外コミュニティ共有）",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=49lg89YGQtU"
  },
  {
    "id": "z34waVoFeto",
    "title": "ネモのアレックス MR1900到達・実戦映像",
    "channel": "未確認（コミュニティ索引）",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=z34waVoFeto"
  },
  {
    "id": "oFo2KZYXSpc",
    "title": "アレックスの日本人上位プレイヤー対戦映像",
    "channel": "未確認（コミュニティ索引）",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=oFo2KZYXSpc"
  },
  {
    "id": "IpJrZ3ARb7U",
    "title": "Diaphone アレックス マスター挑戦",
    "channel": "未確認（コミュニティ索引）",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=IpJrZ3ARb7U"
  },
  {
    "id": "hm7pOWDLup4",
    "title": "Diaphone アレックス攻略ポイント",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=hm7pOWDLup4"
  },
  {
    "id": "hBmZsyIT1wc",
    "title": "Brian_F アレックス マスター挑戦",
    "channel": "未確認（コミュニティ索引）",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=hBmZsyIT1wc"
  },
  {
    "id": "OTUupXXEl0k",
    "title": "Chris_F アレックス攻略ガイド",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=OTUupXXEl0k"
  },
  {
    "id": "IcxokfrsS9M",
    "title": "Brian_F アレックス ハイマスター挑戦",
    "channel": "未確認（コミュニティ索引）",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=IcxokfrsS9M"
  },
  {
    "id": "cZ8loAhgOI4",
    "title": "アレックスへの対策ガイド",
    "channel": "未確認（コミュニティ索引）",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=cZ8loAhgOI4"
  },
  {
    "id": "6F-d5TYZlWU",
    "title": "MR1800帯プレイヤーによるアレックス考察",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=6F-d5TYZlWU"
  },
  {
    "id": "H3dGEtl0mSw",
    "title": "iZonk アレックス攻略ガイド",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=H3dGEtl0mSw"
  },
  {
    "id": "weypQccKcEE",
    "title": "アレックスの強い行動・ネタへの対策",
    "channel": "未確認（コミュニティ索引）",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=weypQccKcEE"
  },
  {
    "id": "Af1Q3NhcaZs",
    "title": "アレックスの投げループ研究",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Af1Q3NhcaZs"
  },
  {
    "id": "gBAMPgAEhmM",
    "title": "アレックスの構え（Prowler）解説",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=gBAMPgAEhmM"
  },
  {
    "id": "niL54FSweT4",
    "title": "アレックスの構え移行・ホップの行動分岐",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=niL54FSweT4"
  },
  {
    "id": "L4OjcgYa7-o",
    "title": "Brian_F アレックス攻略解説",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=L4OjcgYa7-o"
  },
  {
    "id": "A7PmzSV22_w",
    "title": "Diaphone アレックス グランドマスター帯対戦",
    "channel": "未確認（コミュニティ索引）",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=A7PmzSV22_w"
  },
  {
    "id": "XcL_mC291fQ",
    "title": "アレックス 上級者向け攻略解説",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=XcL_mC291fQ"
  },
  {
    "id": "r8U8-JsTIRE",
    "title": "アレックス エアニー後の起き攻め",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=r8U8-JsTIRE"
  },
  {
    "id": "6ZfpSE1-6Ak",
    "title": "Leshar アレックスの攻略ポイント",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=6ZfpSE1-6Ak"
  },
  {
    "id": "kJMZ1VlMJ3U",
    "title": "アレックス 構え（Prowler）攻略解説",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=kJMZ1VlMJ3U"
  },
  {
    "id": "mrL3t2_mMSY",
    "title": "アレックス 追加攻略ポイント",
    "channel": "未確認（コミュニティ索引）",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=mrL3t2_mMSY"
  },
  {
    "id": "frxVML8xfZk",
    "title": "アレックス対策：エアスタンピート対策3選",
    "channel": "ずんだもんふぁいたーch",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=frxVML8xfZk"
  },
  {
    "id": "JYf4yz2t0z8",
    "title": "今すぐ勝ちたいアレックス対策 初見連携を許さない",
    "channel": "小路KOG",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=JYf4yz2t0z8"
  },
  {
    "id": "1YdHZiL9kJ8",
    "title": "どぐらのアレックス研究・評価",
    "channel": "どぐら 生駒デビル",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=1YdHZiL9kJ8"
  },
  {
    "id": "4GuP2RNvxH0",
    "title": "Shinto（アレックス）vs ウメハラ（豪鬼）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=4GuP2RNvxH0"
  },
  {
    "id": "ui3s3w75lEA",
    "title": "Shinto（アレックス）vs かずのこ（アルジュン）10月13日",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=ui3s3w75lEA"
  },
  {
    "id": "eFj9AyFFLzM",
    "title": "Shinto（アレックス）vs かずのこ（アルジュン）10月17日",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=eFj9AyFFLzM"
  },
  {
    "id": "cwnF-NGNPFM",
    "title": "小路KOG アレックス 初日ランク配信",
    "channel": "小路KOG",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=cwnF-NGNPFM"
  },
  {
    "id": "wtxaZcPRpFw",
    "title": "小路KOG アレックス2 練習配信",
    "channel": "小路KOG",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=wtxaZcPRpFw"
  },
  {
    "id": "GOVnS9mJYl4",
    "title": "小路KOG 新しいアレックスムーブを発見",
    "channel": "小路KOG",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=GOVnS9mJYl4"
  },
  {
    "id": "bqirqxPEqcw",
    "title": "LeShar（アレックス）vs ひなお（サガット）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=bqirqxPEqcw"
  },
  {
    "id": "Rh1Sus7X-oU",
    "title": "かずのこ（アレックス）vs ときど（JP）",
    "channel": "Stremphoenix",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Rh1Sus7X-oU"
  }
] as const;

export const CHARACTER_VIDEO_ALEX_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
  id:`preview-alex-${id}`,slug:`preview-alex-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
  description:`${kind==="counter"?"アレックスへの対策。":"アレックスの攻略・コンボ等。"} 情報源: ${source}。再生可否・現行Patch・動画内容の実機検証・公開承認は未確認です。`,
  url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,channelName:channel,
  durationSeconds:null,language:null,controlTypes:[],events:[],characters:["アレックス"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
