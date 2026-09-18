const publicTermReplacements: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bDrive Rush\b/gi, "ドライブラッシュ"],
  [/\bDrive Impact\b/gi, "ドライブインパクト"],
  [/\bDrive Gauge\b/gi, "ドライブゲージ"],
  [/\bPerfect Parry\b/gi, "ジャストパリィ"],
  [/\bPunish Counter\b/gi, "パニッシュカウンター"],
  [/\bCounter Hit\b/gi, "カウンターヒット"],
  [/\bBurnout\b/gi, "バーンアウト"],
  [/\bSuper Art\b/gi, "スーパーアーツ"],
  [/\bDrive Reversal\b/gi, "ドライブリバーサル"],
  [/\bOverdrive\b/gi, "OD"],
];

export function normalizePublicCopy(value: string) {
  return publicTermReplacements.reduce(
    (copy, [pattern, replacement]) => copy.replace(pattern, replacement),
    value,
  );
}

export function isInternalMoveNote(value: string) {
  return /(?:baseline|secondary-current|publication gated|awaiting official\/game verification)/i.test(value);
}
