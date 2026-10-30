export const FIVE_MINUTES_MS = 5 * 60 * 1000;
export type TrainingTimerState = { remainingMs: number; runningSince: number | null };
export function resetTrainingTimer(): TrainingTimerState {
  return { remainingMs: FIVE_MINUTES_MS, runningSince: null };
}
export function remainingTrainingTime(state: TrainingTimerState, now: number): number {
  return Math.max(0, state.remainingMs - (state.runningSince === null ? 0 : Math.max(0, now - state.runningSince)));
}
export function startTrainingTimer(state: TrainingTimerState, now: number): TrainingTimerState {
  return state.runningSince !== null || state.remainingMs <= 0 ? state : { ...state, runningSince: now };
}
export function pauseTrainingTimer(state: TrainingTimerState, now: number): TrainingTimerState {
  return { remainingMs: remainingTrainingTime(state, now), runningSince: null };
}
