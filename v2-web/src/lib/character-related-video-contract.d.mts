import type { VideoSummary } from "@/lib/event-media";

export type CharacterVideoGroup = "beginner" | "intermediate" | "advanced" | "match";
export type CharacterVideoBuckets = Record<CharacterVideoGroup, VideoSummary[]> & { unclassified: VideoSummary[] };
export function youtubeVideoIdFromUrl(value: unknown): string | null;
export function dedupeCharacterRelatedVideos(videos: VideoSummary[]): VideoSummary[];
export function filterUniqueAutoVideoHits<T extends { videoId: string; watchUrl: string }>(hits: T[], registeredYoutubeIds?: readonly string[]): T[];
export function classifyCharacterVideo(video: VideoSummary): CharacterVideoGroup | "unclassified";
export function groupCharacterRelatedVideos(videos: VideoSummary[]): CharacterVideoBuckets;
export const CHARACTER_VIDEO_GROUPS: readonly { id: CharacterVideoGroup; label: string }[];
