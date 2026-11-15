import { readFile } from "node:fs/promises";
import path from "node:path";
import { isRyuQaMotionRequest, ryuQaClips, RYU_QA_CHARACTER_ID } from "@/lib/ryu-qa-motion";

import { normalizeDevicePreviewToken } from "@/lib/device-preview";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ clip: string }> }) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!isRyuQaMotionRequest(request.headers.get("host"))) {
    return new Response(null, { status: 404, headers });
  }
  const { clip } = await params;
  const entry = ryuQaClips.find(item => item.key === clip);
  if (!entry) return new Response(null, { status: 404, headers });
  const tokens = new URL(request.url).searchParams.getAll("preview");
  const previewToken = tokens.length === 1 ? normalizeDevicePreviewToken(tokens[0]) : null;
  if (!previewToken) return new Response(null, { status: 404, headers });
  try {
    // Use the same token-gated, read-only RPC as the character Preview page.
    const { data, error } = await getSupabaseServerClient().rpc("get_phase23_character_preview", {
      target_character_id: RYU_QA_CHARACTER_ID,
      preview_token: previewToken,
    });
    if (error || !Array.isArray(data?.moves) || !data.moves.some(
      (move: { id?: unknown; slug?: unknown } | null) => move?.id === entry.moveId && move?.slug === entry.slug,
    )) return new Response(null, { status: 404, headers });
  } catch {
    return new Response(null, { status: 404, headers });
  }
  try {
    const bytes = await readFile(path.join(process.cwd(), "src/data/ryu-qa-gifs", `${entry.key}.gif`));
    return new Response(new Uint8Array(bytes), { headers: { ...headers, "Content-Type": "image/gif" } });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return new Response(null, { status: 404, headers });
  }
}
