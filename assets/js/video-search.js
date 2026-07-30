// ==========================================
// 動画検索 共通ユーティリティ
// ==========================================
//
// 目的:
//   バックエンドの動画検索API(YouTube検索)に対して、
//   1つ目のクエリ(検索キーワード)で結果が0件だった場合に、
//   言い回しの異なる別のクエリで自動的に再検索(リトライ)する。
//
// 使い方:
//   const results = await fetchVideosWithQueryRetry(
//       "https://sf6dna-backend.onrender.com", // APIのベースURL
//       ["クエリ案1", "クエリ案2", "クエリ案3"], // 上から順に試す
//       8 // 取得したい最大件数
//   );
//   // results は動画配列、または全クエリで失敗した場合はnull
//
// team-detail.js / player.js / characters.js / compare.js から共通で呼び出す。
// このファイルは各ページのスクリプトより「前」に読み込むこと。

/**
 * 複数のクエリ候補を順番に試し、最初に結果が得られたものを返す。
 *
 * @param {string} baseUrl - 動画検索APIのベースURL(例: "https://sf6dna-backend.onrender.com")
 * @param {string[]} queries - 検索クエリの候補リスト(先頭から順に試す)
 * @param {number} maxResults - 1回のリクエストで取得する最大件数
 * @returns {Promise<Array|null>} 動画の配列。全クエリで結果が得られなかった場合はnull
 */
async function fetchVideosWithQueryRetry(baseUrl, queries, maxResults = 8) {

    // APIのURLが設定されていない場合は何もしない
    // (呼び出し側で従来通りのフォールバック表示を行う想定)
    if (!baseUrl) return null;

    // 空配列や未指定の場合も安全に抜ける
    if (!queries || queries.length === 0) return null;

    for (const query of queries) {

        try {

            const url = `${baseUrl}/api/videos/search?q=${encodeURIComponent(query)}&max=${maxResults}`;
            const res = await fetch(url);

            // このクエリでAPIエラーが起きた場合は、次のクエリで再試行する
            if (!res.ok) continue;

            const data = await res.json();

            // 結果が1件でもあれば、そこで確定して返す
            if (data.results && data.results.length > 0) {
                return data.results;
            }

            // 結果が0件だった場合は、次のクエリで再試行する

        } catch (err) {

            // ネットワークエラー等が起きても、他のクエリでの再試行を続ける
            console.warn("[fetchVideosWithQueryRetry] クエリで取得に失敗、次のクエリを試します:", query, err);

        }

    }

    // 用意した全てのクエリで結果が得られなかった
    return null;

}
