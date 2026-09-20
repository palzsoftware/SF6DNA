export const V11_AI_COACH_PREVIEW_BRANCH = "sf6dna-v1-1-ai-coach-20260918";

export function isV11CoachPreviewEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VERCEL_ENV === "preview" && env.VERCEL_GIT_COMMIT_REF === V11_AI_COACH_PREVIEW_BRANCH;
}

export function isCoachSurfaceEnabled(defaultEnabled: boolean, env: NodeJS.ProcessEnv = process.env): boolean {
  return defaultEnabled || isV11CoachPreviewEnabled(env);
}
