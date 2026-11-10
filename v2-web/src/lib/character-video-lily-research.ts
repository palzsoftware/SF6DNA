import type { VideoSummary } from "@/lib/event-media";
/** Lily-only candidate intake. Each record has a directly traceable video or indexed video page.
 * Preview-only; playing videos, character use in full, and current patch not verified. */
const candidates = [
  {
    "id": "Sjpas9Cbtlo",
    "title": "STREET FIGHTER 6 LILY COMBOS! Starter Combo Guide",
    "channel": "VesperArcade",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=Sjpas9Cbtlo"
  },
  {
    "id": "aAwSRuJRRFs",
    "title": "LILY's Basic Combos: Street Fighter 6 Combo Guide",
    "channel": "Ryoran",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=aAwSRuJRRFs"
  },
  {
    "id": "785kLPBDFcE",
    "title": "【スト6、SF6】リリー対策",
    "channel": "ACQUA",
    "kind": "counter",
    "source": "https://www.youtube.com/watch?v=785kLPBDFcE"
  },
  {
    "id": "4zps9WMHSiU",
    "title": "リリー 初級者向けコンボ & セットプレイ",
    "channel": "ブレイヴ片手好き",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=4zps9WMHSiU"
  },
  {
    "id": "budtNOWKnJU",
    "title": "リリーちゃん3人衆で行く同キャラ3on大会",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/budtNOWKnJU"
  },
  {
    "id": "wJmqCvObJMg",
    "title": "リリー村のコマ投げ雑談・相籠杯",
    "channel": "Vtuber Showdown",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/wJmqCvObJMg"
  },
  {
    "id": "ZF7Yv14hxJM",
    "title": "リリー使いで交流会！いっぱい学んで強くなる",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/ZF7Yv14hxJM"
  },
  {
    "id": "n9Fh2AoAoaY",
    "title": "リリーを爆裂愛してる。リリーMR1630〜",
    "channel": "岸堂天真",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/n9Fh2AoAoaY"
  },
  {
    "id": "h4LI_Ef2vZg",
    "title": "常闇祭2に向けてリリーを仕上げる千羽師匠",
    "channel": "Vtuber Showdown",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/h4LI_Ef2vZg"
  },
  {
    "id": "ZQUdWwOisiM",
    "title": "自己ベスト更新を目指してMリリーでランクマ",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/ZQUdWwOisiM"
  },
  {
    "id": "TSgVflS7OsA",
    "title": "モダンリリートップランカー・モダナー竹野",
    "channel": "Vtuber Showdown",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/TSgVflS7OsA"
  },
  {
    "id": "0DnOEjJs49o",
    "title": "新技を覚えたリリーでカスタム対戦会",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/0DnOEjJs49o"
  },
  {
    "id": "a0PM2Wg9Ebo",
    "title": "リリーMR1600 トレモ後のランクマ",
    "channel": "岸堂天真",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/a0PM2Wg9Ebo"
  },
  {
    "id": "EPSmyDcmnAQ",
    "title": "リリーでアルティメットマスターへ到達する岸堂天真",
    "channel": "ホロライブ切り抜き隊",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/EPSmyDcmnAQ"
  },
  {
    "id": "4yfzTimTmxs",
    "title": "リリーMR1700 今日でアルマス到達",
    "channel": "岸堂天真",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=4yfzTimTmxs"
  },
  {
    "id": "ojayr2e3GJE",
    "title": "希望を胸にランクマ リリーMR1656",
    "channel": "岸堂天真",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/ojayr2e3GJE"
  },
  {
    "id": "xa7NkZ853zc",
    "title": "アルマスを目指して毎日ランクマ",
    "channel": "ホロライブ切り抜き隊",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=xa7NkZ853zc"
  },
  {
    "id": "SSvwukeSQKI",
    "title": "ゆなっこ杯にリリーで参戦",
    "channel": "日野ハナ",
    "kind": "match",
    "source": "https://vmato.jp/watch/SSvwukeSQKI"
  },
  {
    "id": "fbIrba3T2_0",
    "title": "ElChakotay's Lily Combo Video - Street Fighter 6",
    "channel": "ElChakotay",
    "kind": "guide",
    "source": "https://www.youtube.com/watch?v=fbIrba3T2_0"
  },
  {
    "id": "31gQH22DrvU",
    "title": "Mリリーで高みを目指すグラマス帯ランクマ",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/31gQH22DrvU"
  },
  {
    "id": "kLs7qQrEB1c",
    "title": "リリー大足研究：ヤバい連携を発見",
    "channel": "Vtuber Showdown",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/kLs7qQrEB1c"
  },
  {
    "id": "LfOxW4AbNL0",
    "title": "今日こそMR盛るぞ Mリリーランクマ",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=LfOxW4AbNL0"
  },
  {
    "id": "Zi6jYfrvDDQ",
    "title": "MリリーMaster帯ランクマ 打撃と投げ",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/Zi6jYfrvDDQ"
  },
  {
    "id": "g18R7uZtQDc",
    "title": "リリーが消えた？判定検証",
    "channel": "千羽黒乃",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/g18R7uZtQDc"
  },
  {
    "id": "Ij0K3RzN8mw",
    "title": "リリー判定検証 元配信",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=Ij0K3RzN8mw"
  },
  {
    "id": "Dv08BfAgQog",
    "title": "リリーのリプレイで不可解な判定を検証",
    "channel": "Vtuber Showdown",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/Dv08BfAgQog"
  },
  {
    "id": "m0uM5X4hqTY",
    "title": "MリリーMR1820からのアルマス帯ランクマ",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=m0uM5X4hqTY"
  },
  {
    "id": "wMT2K07xUHE",
    "title": "桜葉ハグにリリーを教える千羽黒乃",
    "channel": "Vtuber Showdown",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/kirinuki/wMT2K07xUHE"
  },
  {
    "id": "x8BPgTtF4vI",
    "title": "Master帯で勝つためのMリリー講座",
    "channel": "千羽黒乃",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/x8BPgTtF4vI"
  },
  {
    "id": "hUgydxIPG10",
    "title": "Year3調整をひびき先生に教わるリリー講座",
    "channel": "千羽黒乃",
    "kind": "guide",
    "source": "https://ckworks.jp/vinforadar/video/hUgydxIPG10"
  },
  {
    "id": "uRZTb_F2Pxw",
    "title": "アルマス安定を目指すMリリーランクマ",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://ckworks.jp/vinforadar/video/uRZTb_F2Pxw"
  },
  {
    "id": "XnREVt1IsD8",
    "title": "MリリーMR1897からのランクマ配信",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=XnREVt1IsD8"
  },
  {
    "id": "FnC0QejTI-8",
    "title": "MリリーMR1900チャレンジ",
    "channel": "千羽黒乃",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=FnC0QejTI-8"
  },
  {
    "id": "SI3DZbC1Mq4",
    "title": "分析官・T リリーのランクマ研究",
    "channel": "岸堂天真",
    "kind": "match",
    "source": "https://www.youtube.com/watch?v=SI3DZbC1Mq4"
  }
] as const;
export const CHARACTER_VIDEO_LILY_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}): VideoSummary => ({
 id:`preview-lily-${id}`,slug:`preview-lily-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:null,
 description:`リリー関連動画候補。照合元: ${source}。再生・現行Patch・全映像の内容は未検証。`,
 url:`https://www.youtube.com/watch?v=${id}`,
 thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],
 characters:["リリー"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null
}));
