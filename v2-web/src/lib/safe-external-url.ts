/** Validate untrusted public links without interpreting relative or executable URLs. */
export function safeExternalUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2048 || /[\u0000-\u001f\u007f\\]/.test(value)) return null;
  const candidate = value.trim();
  if (!/^https?:\/\//i.test(candidate)) return null;
  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
