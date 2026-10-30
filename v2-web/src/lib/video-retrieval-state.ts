export type VideoRetrievalState =
  | "LOADING"
  | "SUCCESS_WITH_RESULTS"
  | "SUCCESS_WINDOW_EMPTY"
  | "SUCCESS_EMPTY"
  | "UNAVAILABLE"
  | "API_ERROR"
  | "RELATION_UNRESOLVED";

export type VideoRetrievalResult<T> = {
  state: Exclude<VideoRetrievalState, "LOADING">;
  items: T[];
  warnings: string[];
};

export function videoRetrievalMessage(state: VideoRetrievalState): string | null {
  switch (state) {
    case "LOADING": return "関連動画を読み込んでいます。";
    case "SUCCESS_WITH_RESULTS": return null;
    case "SUCCESS_WINDOW_EMPTY": return "今回取得した範囲には、表示できる関連動画がありません。";
    case "SUCCESS_EMPTY": return "この条件で表示できる公開動画はまだありません。";
    case "UNAVAILABLE": return "現在、関連動画を取得できません。";
    case "API_ERROR": return "関連動画の取得に失敗しました。時間をおいて再度お試しください。";
    case "RELATION_UNRESOLVED": return "関連動画の紐付けを確認中です。";
  }
}
