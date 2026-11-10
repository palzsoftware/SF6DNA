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
  }
] as const;

export const CHARACTER_VIDEO_ALEX_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
  id:`preview-alex-${id}`,slug:`preview-alex-${id}`,title,platform:"youtube",videoType:kind,publishedAt:null,
  description:`${kind==="counter"?"アレックスへの対策。":"アレックスの攻略・コンボ等。"} 情報源: ${source}。再生可否・現行Patch・動画内容の実機検証・公開承認は未確認です。`,
  url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,channelName:channel,
  durationSeconds:null,language:null,controlTypes:[],events:[],characters:["アレックス"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
