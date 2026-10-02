import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPilotIllustration } from "@/lib/illustration-pilot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const asset = getPilotIllustration(slug);
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff" };
  if (!asset || new URL(request.url).hostname !== process.env.VERCEL_URL) return new Response(null, { status: 404, headers });
  try {
    const bytes = await readFile(path.join(process.cwd(), "src/data/illustration-pilot", asset.file));
    return new Response(new Uint8Array(bytes), { headers: { ...headers, "Content-Type": "image/webp" } });
  } catch {
    return new Response(null, { status: 404, headers });
  }
}
