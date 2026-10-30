export type VideoLearningAnnotation = {
  videoId: string;
  expectedUrl: string;
  expectedTitle: string;
  topics: readonly string[];
  targetRanks: readonly string[];
  categories?: readonly string[];
  controlTypes?: readonly ("classic" | "modern")[];
  level?: "beginner" | "intermediate" | "advanced";
  evidenceUrl: string;
  checkedOn: string;
};

// Only reviewed learning metadata for already-published videos belongs here.
// Research candidates stay outside src and cannot create or publish video rows.
// Bind to the exact published ID, URL and title; a changed video needs re-review.
export const PUBLISHED_VIDEO_LEARNING: readonly VideoLearningAnnotation[] = [];
