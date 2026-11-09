import type { VideoSummary } from "@/lib/event-media";
/** ダルシム Preview-only video candidates. Gameplay, current patch and relations unverified. */
const candidates = [
  {
    "id": "HGPfN9LW8P4",
    "title": "ダルシム使いとの連携・補正切りの解説",
    "date": "2026-02-13",
    "channel": "ストーム久保",
    "kind": "guide"
  },
  {
    "id": "sr_a0m2T6_Q",
    "title": "ダルシム 低コストSA1高火力コンボ",
    "date": "2025-09-21",
    "channel": "inaGuile@攻めガイル",
    "kind": "guide"
  },
  {
    "id": "Dx8N73WYtI0",
    "title": "ダルシム超高火力コンボに驚くカワノ",
    "date": "2024-01-17",
    "channel": "カワノKawano",
    "kind": "guide"
  },
  {
    "id": "LN8QA3xKoHE",
    "title": "ダルシム とりこれコンボ・セットプレイ",
    "date": "2026-10-21",
    "channel": "牙キバル@VTuber",
    "kind": "guide"
  }
] as const;
export const CHARACTER_VIDEO_EXTRA_DHALSIM: VideoSummary[] = candidates.map(({id,title,date,channel,kind}):VideoSummary=>({
 id:`preview-dhalsim-${id}`,slug:`preview-dhalsim-${id}`,title,platform:"youtube",videoType:kind,
 publishedAt:`${date}T00:00:00Z`,description:"ダルシム関連の動画候補。現行Patch適合性は未検証。",
 url:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
 channelName:channel,durationSeconds:null,language:null,controlTypes:[],events:[],characters:["ダルシム"],players:[],
 categories:[kind],level:"unknown",viewCount:null,viewCountCheckedAt:null,
}));
