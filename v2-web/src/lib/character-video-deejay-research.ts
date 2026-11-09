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
  },
  {
    "id": "9A4QXgyMY68",
    "title": "SF6 Dee Jay Fundamentals Guide: Combos & Setups",
    "channel": "Joe Ebios",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=9A4QXgyMY68"
  },
  {
    "id": "X0pscP1dB7s",
    "title": "【202412ver】ディージェイ 基本コンボ",
    "channel": "メノ(Meno)",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=X0pscP1dB7s"
  },
  {
    "id": "8h8cgkkXnWE",
    "title": "ディージェイ誕生日記念動画2026 モダンディージェイ対戦動画",
    "channel": "投稿者未確認",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=8h8cgkkXnWE"
  },
  {
    "id": "xWijHMEOULI",
    "title": "ディージェイ修行！takeraCUPに参戦",
    "channel": "まりゅーちゃんねる",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=xWijHMEOULI"
  },
  {
    "id": "5uNmSR47C5k",
    "title": "ディージェイランクマ！各キャラの対策を考える",
    "channel": "まりゅーちゃんねる",
    "kind": "match",
    "source": "https://yutura.net/channel/120080/video/5uNmSR47C5k/"
  },
  {
    "id": "kEEvmbdtfqk",
    "title": "コンボダメージが高すぎるディージェイを研究",
    "channel": "ストーム久保",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=kEEvmbdtfqk"
  },
  {
    "id": "QKC538_gXzI",
    "title": "ディージェイのコンボ火力調整に驚くふ～ど",
    "channel": "ふ～ど Fuudo",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=QKC538_gXzI"
  },
  {
    "id": "nbPjCHPsYPQ",
    "title": "お昼DJランクマ２時間",
    "channel": "TAKERA CHANNEL",
    "kind": "match",
    "source": "https://yutura.net/channel/26082/video/nbPjCHPsYPQ/"
  },
  {
    "id": "zA3mLyohxdQ",
    "title": "ディージェイ対策講座",
    "channel": "スト6初心者応援チャンネル",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=zA3mLyohxdQ"
  },
  {
    "id": "_95lHl0MWsc",
    "title": "ディージェイランクマ！悔しさをバネに！",
    "channel": "まりゅーちゃんねる",
    "kind": "match",
    "source": "https://yutura.net/channel/120080/video/_95lHl0MWsc/"
  },
  {
    "id": "pZfbP3J9dWw",
    "title": "ディージェイ修行！キャラ対策を進めたい！",
    "channel": "まりゅーちゃんねる",
    "kind": "match",
    "source": "https://yutura.net/channel/120080/video/pZfbP3J9dWw/"
  },
  {
    "id": "L0Ede2sZyCc",
    "title": "Street Fighter 6 Dee Jay Combo Guide",
    "channel": "MC MuraFGC",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=L0Ede2sZyCc"
  },
  {
    "id": "FWar708A-W8",
    "title": "Must Know Deejay Combos for Street Fighter 6",
    "channel": "2XKairos",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=FWar708A-W8"
  },
  {
    "id": "x-5JuUmexfQ",
    "title": "Street Fighter 6 Dee Jay Combos - Combo Guide",
    "channel": "Daryus P",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=x-5JuUmexfQ"
  },
  {
    "id": "TLCRRTOUBNM",
    "title": "真面目にランクあげたいDJランクマ",
    "channel": "TAKERA CHANNEL",
    "kind": "match",
    "source": "https://yutura.net/channel/26082/video/TLCRRTOUBNM/"
  },
  {
    "id": "Tgo3I5ZbhPk",
    "title": "pad筋を取り戻すDJランクマ",
    "channel": "TAKERA CHANNEL",
    "kind": "match",
    "source": "https://yutura.net/channel/26082/video/Tgo3I5ZbhPk/"
  },
  {
    "id": "I80Ddi2TtZM",
    "title": "一旦パッド戻ったDJランクマ",
    "channel": "TAKERA CHANNEL",
    "kind": "match",
    "source": "https://yutura.net/channel/26082/video/I80Ddi2TtZM/"
  },
  {
    "id": "WBU_WIBTwqA",
    "title": "昼のランクマDJ",
    "channel": "TAKERA CHANNEL",
    "kind": "match",
    "source": "https://yutura.net/channel/26082/video/WBU_WIBTwqA/"
  },
  {
    "id": "-k8002NHQKM",
    "title": "禁煙DJランクマ",
    "channel": "TAKERA CHANNEL",
    "kind": "match",
    "source": "https://yutura.net/channel/26082/video/-k8002NHQKM/"
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
