import type { VideoSummary } from "@/lib/event-media";
/** Dee Jay candidates from public YouTube and individually indexed video pages.
 * Preview-only, gameplay and current patch not verified. Source URL stored per ID. */
const candidates = [
  {
    "id": "W1gJLfZU7Jg",
    "title": "ディージェイの実用的基本コンボ Year2",
    "channel": "アダー@実用的ゲームちゃんねる",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=W1gJLfZU7Jg"
  },
  {
    "id": "tGiwK1SD1g4",
    "title": "ディージェイの移動技を研究・対策の対策",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=tGiwK1SD1g4"
  },
  {
    "id": "Hrf-PZpTuZ4",
    "title": "対ディージェイ確定反撃とジョスクール対策",
    "channel": "けんてぃちゅーぶ【スト6攻略】",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=Hrf-PZpTuZ4"
  },
  {
    "id": "OVVbXc0tIzg",
    "title": "STREET FIGHTER 6 DEE JAY COMBOS! Starter Combo Guide",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=OVVbXc0tIzg"
  },
  {
    "id": "o6jgdIigK0g",
    "title": "DEE JAY Combo Guide (Modern Controls)",
    "channel": "ahmz1404",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=o6jgdIigK0g"
  },
  {
    "id": "-gNlcGTpq9A",
    "title": "ディージェイ新コンボ練習＆ランクマッチ",
    "channel": "まりゅーちゃんねる",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=-gNlcGTpq9A"
  },
  {
    "id": "NOS2BZWELxI",
    "title": "エレナアプデ後ディージェイ新要素コンボ",
    "channel": "まりゅーちゃんねる",
    "kind": "guide",
    "source": "https://yutura.net/channel/120080/video/NOS2BZWELxI/"
  },
  {
    "id": "pwdhM2eFtO4",
    "title": "ウメハラ（豪鬼）vs 宗蔵（ディージェイ）",
    "channel": "投稿者未確認",
    "kind": "match",
    "source": "https://search.yahoo.co.jp/realtime/search/%E8%B1%AA%E9%AC%BC/"
  },
  {
    "id": "6AXqgjl7qeI",
    "title": "ふ～どディージェイ 圧倒的スピードの対戦",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/6AXqgjl7qeI/"
  },
  {
    "id": "u0kp5QUMh2k",
    "title": "ふ～どディージェイ 神速ビートの対戦",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/u0kp5QUMh2k/"
  },
  {
    "id": "vJqUVnwTAro",
    "title": "ふ～どディージェイ 強すぎる力の対戦",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/vJqUVnwTAro/"
  },
  {
    "id": "nyKaaAWOkVY",
    "title": "ふ～どディージェイ 復活のビート",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/nyKaaAWOkVY/"
  },
  {
    "id": "7Ae_pI-jSkQ",
    "title": "ふ～どディージェイ 熱烈ビート",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/7Ae_pI-jSkQ/"
  },
  {
    "id": "stSpGZYewL8",
    "title": "ふ～どディージェイ 弩級の重戦車",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/stSpGZYewL8/"
  },
  {
    "id": "55EsEzpGyyU",
    "title": "ふ～どディージェイ 疾風怒濤",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/55EsEzpGyyU/"
  },
  {
    "id": "eUwSRsHtXo4",
    "title": "ふ～どディージェイ ファンキービート",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/eUwSRsHtXo4/"
  },
  {
    "id": "ugUipzX_RIU",
    "title": "ふ～どディージェイ 超絶ラッシュ",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://yutura.net/channel/76337/video/ugUipzX_RIU/"
  },
  {
    "id": "nczOTDSPsnA",
    "title": "ふ～どディージェイ 不退転の重戦車",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://en.yutura.net/channel/76337/video/nczOTDSPsnA/"
  },
  {
    "id": "FT5VgMqqtXs",
    "title": "ふ～どディージェイ 最短最速の超絶ビート",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=FT5VgMqqtXs"
  },
  {
    "id": "cHx4QXc5X-0",
    "title": "ふ～どディージェイ 痺れるリズム",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=cHx4QXc5X-0"
  },
  {
    "id": "PiSVeoGimog",
    "title": "ふ～どディージェイ ブッ飛ぶ衝撃",
    "channel": "昇龍拳",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=PiSVeoGimog"
  },
  {
    "id": "pQ6LQGfPkGE",
    "title": "ディージェイのセットプレイ・コンボまとめ",
    "channel": "あじふらい",
    "kind": "guide",
    "source": "https://www.sf6-ingrid.com/article/deejay-setplay-and-combo-matsuri-ajifly"
  }
] as const;
export const CHARACTER_VIDEO_DEEJAY_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-dee-jay-${id}`, slug:`preview-dee-jay-${id}`,
 title,platform:"youtube",videoType:kind,publishedAt:null,
 description:`動画候補。検索根拠: ${source}。再生・現行パッチ・詳細な関連性は未検証。`,
 url:`https://www.youtube.com/watch?v=${id}`,
 thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["ディージェイ"],players:[],categories:[kind],
 level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
