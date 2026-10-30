/** Selected existing server Owner formatter only; no auth resolution or storage access. */
export type DiagnosisStorageScope = "guest" | `uid:${string}`;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function accountScope(userId: unknown): DiagnosisStorageScope | null {
  if (typeof userId !== "string" || !UUID_RE.test(userId)) return null;
  return `uid:${userId.toLowerCase()}`;
}
