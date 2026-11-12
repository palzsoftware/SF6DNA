import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "sf6dna_arjun_preview_qa";
const lifeSeconds = 60 * 60;

/** Disabled by default, disabled in Production, and requires independently configured secrets. */
export function arjunPreviewQaEnabled(): boolean {
  return process.env.VERCEL_ENV === "preview" &&
    process.env.NODE_ENV === "production" &&
    process.env.SF6DNA_ARJUN_PREVIEW_QA === "1" &&
    (process.env.SF6DNA_ARJUN_QA_PASSWORD?.length ?? 0) >= 24 &&
    (process.env.SF6DNA_ARJUN_QA_SIGNING_KEY?.length ?? 0) >= 32;
}
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8"); const right = Buffer.from(b, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}
export function correctArjunQaPassword(candidate: string): boolean {
  return arjunPreviewQaEnabled() && safeEqual(candidate, process.env.SF6DNA_ARJUN_QA_PASSWORD!);
}
function signature(until: string): string {
  return createHmac("sha256", process.env.SF6DNA_ARJUN_QA_SIGNING_KEY!).update(`arjun-qa-v1:${until}`).digest("hex");
}
export function createArjunQaToken(): string {
  if (!arjunPreviewQaEnabled()) throw new Error("QA preview disabled");
  const until = String(Math.floor(Date.now() / 1000) + lifeSeconds);
  return `${until}.${signature(until)}`;
}
export function verifyArjunQaToken(token: string | undefined): boolean {
  if (!arjunPreviewQaEnabled() || !token || token.length > 160) return false;
  const matched = /^(\d{10,11})\.([a-f0-9]{64})$/.exec(token);
  if (!matched) return false;
  const expiry = Number(matched[1]);
  const now = Math.floor(Date.now() / 1000);
  return expiry > now && expiry <= now + lifeSeconds && safeEqual(matched[2], signature(matched[1]));
}
export async function hasArjunQaSession(): Promise<boolean> {
  const jar = await cookies();
  return verifyArjunQaToken(jar.get(cookieName)?.value);
}
export const arjunQaCookie = { name: cookieName, maxAge: lifeSeconds };
