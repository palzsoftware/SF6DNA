import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { LATEST_VIDEO_CACHE_TAG } from "@/lib/latest-youtube-videos";
import { latestVideoEnabled } from "@/lib/latest-youtube-core";

const headers = { "Cache-Control": "private, no-store" };
function authorized(header: string | null, secret: string | undefined): boolean {
  if (!secret || secret.length < 32 || !header?.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice(7)); const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
/**
 * Scheduled refresh only (separate from user search). Marks the latest-video cache stale;
 * the next page view refetches within the quota guard. Fails closed without a configured secret.
 */
export async function GET(request: Request) {
  if (!latestVideoEnabled(process.env)) return NextResponse.json({ error: "DISABLED" }, { status: 404, headers });
  if (!authorized(request.headers.get("authorization"), process.env.CRON_SECRET)) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401, headers });
  revalidateTag(LATEST_VIDEO_CACHE_TAG, "max");
  return NextResponse.json({ ok: true }, { headers });
}
