import "server-only";
import type { VideoSummary } from "@/lib/event-media";
import type { VideoLearningAnnotation } from "@/lib/video-learning-registry";

// Development IDs only. This server module never queries videos or changes
// their publication state. Only metadata for rows already supplied by the
// authorized loader is returned to the client.
const DEVELOPMENT_VIDEO_LEARNING: readonly VideoLearningAnnotation[] = [
  {
    "videoId": "a31f633b-c13f-4bd3-9e89-7d93c93cd2f5",
    "expectedUrl": "https://www.youtube.com/watch?v=YzLw5vcfvlU",
    "expectedTitle": "【スト6/神まとめ】MR1600から上に行く人のための動画まとめ",
    "topics": [],
    "targetRanks": [
      "mr1600"
    ],
    "evidenceUrl": "https://www.youtube.com/watch?v=YzLw5vcfvlU",
    "checkedOn": "2026-10-30"
  },
  {
    "videoId": "1fcd6028-87c1-4832-8b0b-4a5c53e8aa85",
    "expectedUrl": "https://www.youtube.com/watch?v=ELqbxdcNeeE",
    "expectedTitle": "【スト6、SF6】『差し返し』のコツを解説！",
    "topics": [
      "theory",
      "whiff_punish"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=ELqbxdcNeeE",
    "checkedOn": "2026-10-30"
  },
  {
    "videoId": "5fcb98b4-7361-462a-aa6d-c1f993d4953d",
    "expectedUrl": "https://www.youtube.com/watch?v=-jrlvVLnWgg",
    "expectedTitle": "【スト6、SF6】見てるだけだと\"分からないコツ\"あります。差し返しの極意を解説！",
    "topics": [
      "theory",
      "whiff_punish"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=-jrlvVLnWgg",
    "checkedOn": "2026-10-30"
  },
  {
    "videoId": "2aec04a2-e3ff-4cb2-9104-de9e92bb9a96",
    "expectedUrl": "https://www.youtube.com/watch?v=Eqss07fWSsA",
    "expectedTitle": "【スト６備忘録】フレーム？？パニカン？？何それ？システム用語ガッツリ解説①",
    "topics": [
      "theory",
      "frame_knowledge"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=Eqss07fWSsA",
    "checkedOn": "2026-10-30"
  },
  {
    "videoId": "7ddb80ca-727a-4874-a263-28dd7d540f4e",
    "expectedUrl": "https://www.youtube.com/watch?v=TrmgGCJJQGc",
    "expectedTitle": "【スト６】ちょっと細かいリスナーの質問に答えます！ディージェイ講座質疑応答編",
    "topics": [],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=TrmgGCJJQGc",
    "checkedOn": "2026-10-30"
  },
  {
    "videoId": "69f5feea-5d5a-4f3e-bf90-f300e89e2e0d",
    "expectedUrl": "https://www.youtube.com/watch?v=4JBvAUgLFik",
    "expectedTitle": "【スト6】最新版、誰でも今日から舞使いになれる、とりあえず覚えるべき立ち回りとコンボを徹底解説！【ゆっくり実況】",
    "topics": [
      "neutral"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=4JBvAUgLFik",
    "checkedOn": "2026-10-30",
    "categories": [
      "combo"
    ]
  },
  {
    "videoId": "9634b93c-e911-41c2-a2ca-fffc51145aec",
    "expectedUrl": "https://www.youtube.com/watch?v=EoxvAwnaP9g",
    "expectedTitle": "【スト6】ジェイミー使いが絶対に覚えておきたい必須テクニック・酔いレベルの上げ方・コンボ・立ち回り徹底解説 // DFM 竹内ジョン選手【SF6 / ストリートファイター6】",
    "topics": [
      "neutral"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=EoxvAwnaP9g",
    "checkedOn": "2026-10-30",
    "categories": [
      "combo"
    ]
  },
  {
    "videoId": "4e35f1d0-4504-4adc-8ad1-5879d52f5369",
    "expectedUrl": "https://www.youtube.com/watch?v=h3RmwnO48Ok",
    "expectedTitle": "【スト6】MR1600到達！りゅうきちに学ぶケンの添えるだけで強い技とは【ゼロスト】",
    "topics": [],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=h3RmwnO48Ok",
    "checkedOn": "2026-10-30"
  },
  {
    "videoId": "4e84f991-5fcc-4e9d-ba58-ea879fd5c734",
    "expectedUrl": "https://www.youtube.com/watch?v=Lp6gD4toejw",
    "expectedTitle": "【スト6、SF6】読み合いの制し方。なんとなく起き攻めしてませんか？",
    "topics": [
      "theory",
      "risk_reward"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=Lp6gD4toejw",
    "checkedOn": "2026-10-30",
    "categories": [
      "oki"
    ]
  },
  {
    "videoId": "6fa28007-cb92-435b-8749-05e8608c87ee",
    "expectedUrl": "https://www.youtube.com/watch?v=8cvaFH9cCDg",
    "expectedTitle": "【スト６】起き攻めの読み合い解説",
    "topics": [
      "theory",
      "risk_reward"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=8cvaFH9cCDg",
    "checkedOn": "2026-10-30",
    "categories": [
      "oki"
    ]
  },
  {
    "videoId": "0b026f75-6ba8-4bbb-aae9-ec481e2b6bf4",
    "expectedUrl": "https://www.youtube.com/watch?v=xKNlTaqhHsc",
    "expectedTitle": "その画面端の攻め、〇〇だからすぐに逃げられてます...！鳥籠にするためのコツと考え方！MR1600キャミィのリプレイコーチング#39【スト6/ぷげら】",
    "topics": [
      "theory",
      "replay_review"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=xKNlTaqhHsc",
    "checkedOn": "2026-10-30",
    "categories": [
      "corner"
    ]
  },
  {
    "videoId": "66a35f53-4b39-48ab-8a15-211bfac257f6",
    "expectedUrl": "https://www.youtube.com/watch?v=wVDnU0dRBXg",
    "expectedTitle": "とりあえずで強そうな技も、“強い使い方”が分かってなければ弱くなります。MR1600ラシードのリプレイコーチング#48【スト6/ぷげら】",
    "topics": [
      "replay_review"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=wVDnU0dRBXg",
    "checkedOn": "2026-10-30"
  },
  {
    "videoId": "b234278f-29a9-4b66-8fdc-1b303e389745",
    "expectedUrl": "https://www.youtube.com/watch?v=7jwFN7hM0Sk",
    "expectedTitle": "【スト6、SF6】投げ抜けのリスクについて解説します",
    "topics": [
      "theory",
      "defense",
      "risk_reward"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=7jwFN7hM0Sk",
    "checkedOn": "2026-10-30"
  },
  {
    "videoId": "21a2e835-7c60-48f5-b839-e5730aeb0c7b",
    "expectedUrl": "https://www.youtube.com/watch?v=snni6itzr4I",
    "expectedTitle": "【スト6】格ゲー知識解説「差し合い」",
    "topics": [
      "theory",
      "neutral"
    ],
    "targetRanks": [],
    "evidenceUrl": "https://www.youtube.com/watch?v=snni6itzr4I",
    "checkedOn": "2026-10-30"
  }
];

export function getRegisteredVideoLearning(
  videos: readonly VideoSummary[],
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
): readonly VideoLearningAnnotation[] {
  if (!supabaseUrl || !videos.length) return [];
  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== "https:" || url.hostname !== "vvsknbmlfvvnrmgtyhbf.supabase.co"
      || url.port || url.username || url.password || url.search || url.hash || url.pathname !== "/") return [];
  } catch { return []; }
  const supplied = new Map(videos.map(video => [video.id, video]));
  return DEVELOPMENT_VIDEO_LEARNING.filter(record => {
    const video = supplied.get(record.videoId);
    return video?.url === record.expectedUrl && video.title === record.expectedTitle;
  });
}
