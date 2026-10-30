import Link from "next/link";
import { videoRetrievalMessage, type VideoRetrievalState } from "@/lib/video-retrieval-state";

export function VideoRetrievalStatus({ state, invalidFilter = false }: { state: VideoRetrievalState; invalidFilter?: boolean }) {
  if (state === "SUCCESS_WITH_RESULTS") return null;
  return <section className="empty-state" role={state === "API_ERROR" ? "alert" : "status"} aria-live="polite" aria-busy={state === "LOADING"} data-video-state={state}>
    <h2>{invalidFilter ? "絞り込み条件を確認してください" : videoRetrievalMessage(state)}</h2>
    {invalidFilter ? <p>条件を解除して、もう一度お選びください。</p> : null}
    {state !== "LOADING" ? <Link href="/videos">公開動画の一覧に戻る</Link> : null}
  </section>;
}
