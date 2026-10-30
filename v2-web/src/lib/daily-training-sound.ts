/** Screen-local alert. No storage, network request, or completion write. */
export function createTrainingSound(factory: () => AudioContext | null = () => {
  if (typeof window === "undefined") return null;
  const Constructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return Constructor ? new Constructor() : null;
}) {
  let context: AudioContext | null = null;
  let disposed = false;
  let generation = 0;
  const oscillators = new Set<OscillatorNode>();

  function cancel() {
    generation += 1;
    for (const oscillator of oscillators) {
      try { oscillator.stop(); } catch { /* already finished */ }
      oscillator.disconnect();
    }
    oscillators.clear();
  }

  async function prepare(): Promise<boolean> {
    if (disposed) return false;
    try {
      if (!context || context.state === "closed") context = factory();
      if (!context) return false;
      if (context.state === "suspended") await context.resume();
      return !disposed && context.state === "running";
    } catch {
      return false;
    }
  }

  async function play(): Promise<boolean> {
    cancel();
    const currentGeneration = generation;
    if (!await prepare() || disposed || currentGeneration !== generation || !context) return false;
    try {
      const audio = context;
      for (const [offset, frequency] of [[0, 880], [0.25, 1046.5]]) {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const at = audio.currentTime + offset;
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(0.12, at + 0.015);
        gain.gain.linearRampToValueAtTime(0, at + 0.18);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillators.add(oscillator);
        oscillator.onended = () => {
          oscillators.delete(oscillator);
          oscillator.disconnect();
          gain.disconnect();
        };
        oscillator.start(at);
        oscillator.stop(at + 0.19);
      }
      return true;
    } catch {
      cancel();
      return false;
    }
  }

  function dispose() {
    disposed = true;
    cancel();
    if (context && context.state !== "closed") void context.close().catch(() => {});
    context = null;
  }

  return { prepare, play, cancel, dispose };
}
