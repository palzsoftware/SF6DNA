import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { loadLocalQaGifDoc, loadLocalQaVariantDoc } from "@/lib/local-qa-gif-sources";
import { isLocalQaGifRequestFromEnv, isSafeQaGifFileName } from "@/lib/local-qa-gif";

export const dynamic = "force-dynamic";

/** ローカルQA用GIFの配信。開発環境のlocalhost限定。登録済みファイル名だけ返す(公開用の/media/とは別物)。 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string; name: string }> }) {
  if (!isLocalQaGifRequestFromEnv(request.headers.get("host"))) notFound();
  const { slug, name } = await params;
  const doc = await loadLocalQaGifDoc(slug);
  const variantDoc = await loadLocalQaVariantDoc(slug);
  // 登録済み(通常のQAデータ または 派生パターンのデータ)のファイル名だけ返す
  const registered = Boolean(doc?.entries.some((e) => e.fileName === name)) || Boolean(variantDoc?.groups.some((g) => g.variants.some((v) => v.fileName === name)));
  if (!isSafeQaGifFileName(name) || !registered) notFound();
  // turbopackIgnore: ビルド時のファイル追跡(nft)にこのパスを拾わせない。本番の成果物にQA用GIFを同梱しないため。
  const bytes = await readFile(path.join(/* turbopackIgnore: true */ process.cwd(), ".sf6dna-local-qa-gif", slug, name));
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
