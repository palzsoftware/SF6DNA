import type { VideoSummary } from "@/lib/event-media";
/** 49 video-identity/index sourced Arjun candidates, Preview ONLY. Source identity does not establish video playback, current-patch validation, Player relations, or publication approval. */
const candidates = [
  {
    "id": "Fzoo-kB508U",
    "kind": "guide",
    "channel": "たいじ",
    "title": "アルジュンLEGEND到達・立ち回り解説",
    "source": "https://www.youtube.com/watch?v=Fzoo-kB508U"
  },
  {
    "id": "hzuKqR3JvfM",
    "kind": "guide",
    "channel": "マゴ",
    "title": "アルジュン性能調査",
    "source": "https://www.youtube.com/watch?v=hzuKqR3JvfM"
  },
  {
    "id": "eN5pcZRbhQ8",
    "kind": "counter",
    "channel": "ACQUA",
    "title": "アルジュンとりこれ対策",
    "source": "https://www.youtube.com/watch?v=eN5pcZRbhQ8"
  },
  {
    "id": "j3d3Q4s8oXA",
    "kind": "guide",
    "channel": "どぐら",
    "title": "アルジュン初プレイと白ダメ研究",
    "source": "https://www.youtube.com/watch?v=j3d3Q4s8oXA"
  },
  {
    "id": "SYyx0vYyN9Y",
    "kind": "guide",
    "channel": "ACQUA",
    "title": "アルジュン初陣と性能評価",
    "source": "https://www.youtube.com/watch?v=SYyx0vYyN9Y"
  },
  {
    "id": "cx4MF1XGpFg",
    "kind": "match",
    "channel": "いおり",
    "title": "アルジュンゆっくり実況・対戦",
    "source": "https://www.youtube.com/watch?v=cx4MF1XGpFg"
  },
  {
    "id": "Jjd8p1cwFsA",
    "kind": "guide",
    "channel": "ストーム久保",
    "title": "アルジュン技性能初日調査",
    "source": "https://www.youtube.com/watch?v=Jjd8p1cwFsA"
  },
  {
    "id": "hnmFadqfpwY",
    "kind": "match",
    "channel": "たいじ",
    "title": "アルジュン修行",
    "source": "https://www.youtube.com/watch?v=hnmFadqfpwY"
  },
  {
    "id": "tWGkg6FG0cs",
    "kind": "counter",
    "channel": "うりょ",
    "title": "アルジュン対策講座",
    "source": "https://www.youtube.com/watch?v=tWGkg6FG0cs"
  },
  {
    "id": "ua0NmzQkPQc",
    "kind": "counter",
    "channel": "カワノ",
    "title": "アルジュン対策教室",
    "source": "https://www.youtube.com/watch?v=ua0NmzQkPQc"
  },
  {
    "id": "NShNqZeEH9k",
    "kind": "guide",
    "channel": "うりょ",
    "title": "アルジュン初日練習と対策",
    "source": "https://www.youtube.com/watch?v=NShNqZeEH9k"
  },
  {
    "id": "e5Ev9iqGB8Y",
    "kind": "guide",
    "channel": "ネモ",
    "title": "アルジュン大ダメージコンボ",
    "source": "https://www.youtube.com/watch?v=e5Ev9iqGB8Y"
  },
  {
    "id": "cUWO4dhDWnE",
    "kind": "guide",
    "channel": "いおり",
    "title": "アルジュン完全攻略",
    "source": "https://www.youtube.com/watch?v=cUWO4dhDWnE"
  },
  {
    "id": "AaZrowrW_Jc",
    "kind": "counter",
    "channel": "いおり",
    "title": "アルジュン対策ショート",
    "source": "https://www.youtube.com/watch?v=AaZrowrW_Jc"
  },
  {
    "id": "mr95PdHWhrY",
    "kind": "guide",
    "channel": "ACQUA",
    "title": "アルジュン研究配信",
    "source": "https://www.youtube.com/watch?v=mr95PdHWhrY"
  },
  {
    "id": "Jn-7Qs8jo1A",
    "kind": "guide",
    "channel": "かずのこ",
    "title": "アルジュン実装初日配信",
    "source": "https://www.youtube.com/watch?v=Jn-7Qs8jo1A"
  },
  {
    "id": "S0Q3vNzZuDo",
    "kind": "guide",
    "channel": "ボンちゃん",
    "title": "アルジュン性能予想",
    "source": "https://www.youtube.com/watch?v=S0Q3vNzZuDo"
  },
  {
    "id": "gpC3kYRYBYU",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "板橋アルジュン対戦",
    "source": "https://www.youtube.com/watch?v=gpC3kYRYBYU"
  },
  {
    "id": "UkzQORuE0lA",
    "kind": "match",
    "channel": "ひぐち",
    "title": "アルジュン初日使用",
    "source": "https://www.youtube.com/watch?v=UkzQORuE0lA"
  },
  {
    "id": "LEs5zDVOE9Y",
    "kind": "match",
    "channel": "まッつんTV",
    "title": "アルジュンアーケード対戦",
    "source": "https://www.youtube.com/watch?v=LEs5zDVOE9Y"
  },
  {
    "id": "GVWFFsTs9gI",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "かずのこアルジュン vs ウメハラ豪鬼",
    "source": "https://www.youtube.com/watch?v=GVWFFsTs9gI"
  },
  {
    "id": "FcdP0QP3sM4",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "立川アルジュン vs ボンちゃんサガット",
    "source": "https://www.youtube.com/watch?v=FcdP0QP3sM4"
  },
  {
    "id": "3nIlcKoPPn0",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "板橋アルジュン初日",
    "source": "https://www.youtube.com/watch?v=3nIlcKoPPn0"
  },
  {
    "id": "zNbYOYgfhTg",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "KIDOアルジュン vs きんちょテリー",
    "source": "https://www.youtube.com/watch?v=zNbYOYgfhTg"
  },
  {
    "id": "_DdppChXUJU",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "カワノアルジュン vs Guilegairuヤスミン",
    "source": "https://www.youtube.com/watch?v=_DdppChXUJU"
  },
  {
    "id": "jti5z_TOGYA",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "ネモアルジュン vs Hadokenリュウ",
    "source": "https://www.youtube.com/watch?v=jti5z_TOGYA"
  },
  {
    "id": "6HqMcgsLRQk",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "ネモアルジュン vs Werlchケン",
    "source": "https://www.youtube.com/watch?v=6HqMcgsLRQk"
  },
  {
    "id": "2nn6IujVX7c",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "Problem Xアルジュン vs EndingWalkerリュウ",
    "source": "https://www.youtube.com/watch?v=2nn6IujVX7c"
  },
  {
    "id": "8QJ8OWi4dmE",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "Suisenriアルジュン vs ウメハラ豪鬼",
    "source": "https://www.youtube.com/watch?v=8QJ8OWi4dmE"
  },
  {
    "id": "WHUr6XsG_6Y",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "Suisenriアルジュン vs LeSharエド",
    "source": "https://www.youtube.com/watch?v=WHUr6XsG_6Y"
  },
  {
    "id": "KnLbFi-wn4g",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "板橋アルジュン vs どぐらベガ",
    "source": "https://www.youtube.com/watch?v=KnLbFi-wn4g"
  },
  {
    "id": "lynFbqX2EAM",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "板橋アルジュン vs Shionケン",
    "source": "https://www.youtube.com/watch?v=lynFbqX2EAM"
  },
  {
    "id": "8EhRVlqc0nM",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "かずのこアルジュン vs ひかるAKI",
    "source": "https://www.youtube.com/watch?v=8EhRVlqc0nM"
  },
  {
    "id": "lT83dGc2-v4",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "翔アルジュン vs ひなおサガット",
    "source": "https://www.youtube.com/watch?v=lT83dGc2-v4"
  },
  {
    "id": "nbwWw8KrQ08",
    "kind": "match",
    "channel": "ストーム久保",
    "title": "アルジュン初日配信",
    "source": "https://www.youtube.com/watch?v=nbwWw8KrQ08"
  },
  {
    "id": "8kweBt43FEA",
    "kind": "guide",
    "channel": "ストーム久保",
    "title": "アルジュン白ダメ研究",
    "source": "https://www.youtube.com/watch?v=8kweBt43FEA"
  },
  {
    "id": "jeOTLfbvVAI",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "ACQUAアルジュン vs YHC餅ダルシム",
    "source": "https://www.youtube.com/watch?v=jeOTLfbvVAI"
  },
  {
    "id": "Dw7nOmTRaeY",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "KIDOアルジュン vs YHC餅ダルシム 10月19日",
    "source": "https://www.youtube.com/watch?v=Dw7nOmTRaeY"
  },
  {
    "id": "2uT3fiWqQjY",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "KIDOアルジュン vs YHC餅ダルシム 10月23日",
    "source": "https://www.youtube.com/watch?v=2uT3fiWqQjY"
  },
  {
    "id": "zYbPP8-fn9k",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "Suisenriアルジュン vs YHC餅ダルシム",
    "source": "https://www.youtube.com/watch?v=zYbPP8-fn9k"
  },
  {
    "id": "G1I4Pp2_AOM",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "KIDOアルジュン vs 鶏めしダルシム",
    "source": "https://www.youtube.com/watch?v=G1I4Pp2_AOM"
  },
  {
    "id": "nXUnKrlqUKI",
    "kind": "guide",
    "channel": "ストーム久保",
    "title": "岩設置の連係・起き攻め研究",
    "source": "https://www.youtube.com/watch?v=nXUnKrlqUKI"
  },
  {
    "id": "UvOwEBnEKx0",
    "kind": "match",
    "channel": "ストーム久保",
    "title": "アルジュンランクマ研究",
    "source": "https://www.youtube.com/watch?v=UvOwEBnEKx0"
  },
  {
    "id": "dACMSe65woA",
    "kind": "guide",
    "channel": "ストーム久保",
    "title": "アルジュン必殺技連打を考察",
    "source": "https://www.youtube.com/watch?v=dACMSe65woA"
  },
  {
    "id": "XMI_z63tQ2Y",
    "kind": "guide",
    "channel": "ストーム久保",
    "title": "アルジュン10000ダメージ研究ショート",
    "source": "https://www.youtube.com/watch?v=XMI_z63tQ2Y"
  },
  {
    "id": "mrDb0IUx6Q8",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "KIDOアルジュン vs RH本田",
    "source": "https://www.youtube.com/watch?v=mrDb0IUx6Q8"
  },
  {
    "id": "Pl6AYB_Nd4Q",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "KIDOアルジュン vs ウメハラ豪鬼",
    "source": "https://www.youtube.com/watch?v=Pl6AYB_Nd4Q"
  },
  {
    "id": "gRIwB4aM6UI",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "板橋アルジュン vs takepi JP",
    "source": "https://www.youtube.com/watch?v=gRIwB4aM6UI"
  },
  {
    "id": "WnJyjDH70AM",
    "kind": "match",
    "channel": "Stremphoenix",
    "title": "Suisenriアルジュン vs ウメハラ豪鬼 10月22日",
    "source": "https://www.youtube.com/watch?v=WnJyjDH70AM"
  }
] as const;
export const CHARACTER_VIDEO_ARJUN_RESEARCH: VideoSummary[] = candidates.map(({id,title,channel,kind,source}) => ({
 id:`preview-arjun-${id}`,slug:`preview-arjun-${id}`,title,
 platform:"youtube",videoType:kind,publishedAt:null,
 description:`アルジュン研究候補。動画ページまたは公開インデックス上のタイトル・IDから収集。出典: ${source}。映像の全編、再生、現行Patch、出演者、公開承認は未検証です。`,
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["アルジュン"],players:[],categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
