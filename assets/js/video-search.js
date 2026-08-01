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

/**
 * 動画カード1枚分のHTMLを生成する(共通コンポーネント)
 *
 * home.js / beginner-guide.js / characters.js で個別に実装されていた
 * ほぼ同じ見た目のカードHTMLを、ここに一本化している。
 * デザインを変更する場合は、このファイルだけを直せば全ページに反映される。
 *
 * @param {Object} video - { url, title, thumbnail, channelTitle?, publishedAt?, duration? }
 * @param {Object} [options]
 * @param {string} [options.variant="default"] - "default"(縦長カード) | "compact"(小型カード)
 * @returns {string} カード1枚分のHTML文字列
 */
function renderVideoCardHtml(video, options = {}) {

    const variant = options.variant || "default";
    const cardClass = variant === "compact" ? "video-card video-card-compact" : "video-card";

    const favoriteBtnHtml = options.showFavorite
        ? `<button type="button" class="video-favorite-btn" data-video-url="${video.url}" data-video-title="${(video.title || "").replace(/"/g, "&quot;")}" data-video-thumb="${video.thumbnail || ""}" aria-label="お気に入りに追加" onclick="event.preventDefault(); event.stopPropagation(); toggleVideoFavorite(this);"><i class="ti ti-heart" aria-hidden="true"></i></button>`
        : "";

    return `
        <a class="${cardClass}" href="${video.url}" target="_blank" rel="noopener">
            <div class="video-thumb-wrap">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                ${video.duration ? `<span class="video-duration-badge">${video.duration}</span>` : ""}
                ${favoriteBtnHtml}
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                ${(video.channelTitle || video.publishedAt) ? `
                    <div class="video-meta">
                        ${video.channelTitle ? `<span class="video-channel">${video.channelTitle}</span>` : ""}
                        ${video.publishedAt ? `<span class="video-date">${video.publishedAt}</span>` : ""}
                    </div>
                ` : ""}
                <span class="video-link-label">▶ 動画を見る</span>
            </div>
        </a>
    `;

}

// ===== 動画お気に入りの共通ヘルパー =====
// localStorageキー: sf6dna_favorite_videos
// 動画にはキャラクター/選手のような固定IDが無いため、url をキーとして
// { url, title, thumbnail } をまるごと保存する(一覧表示時に再取得が不要なようにするため)

function getVideoFavorites() {
    return (typeof getLocalJSON === "function")
        ? getLocalJSON("sf6dna_favorite_videos", [])
        : [];
}

function isVideoFavorite(url) {
    return getVideoFavorites().some(v => v.url === url);
}

function toggleVideoFavorite(buttonEl) {

    const url = buttonEl.dataset.videoUrl;
    const title = buttonEl.dataset.videoTitle;
    const thumbnail = buttonEl.dataset.videoThumb;

    const favorites = getVideoFavorites();
    const index = favorites.findIndex(v => v.url === url);

    if (index === -1) {
        favorites.push({ url, title, thumbnail });
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem("sf6dna_favorite_videos", JSON.stringify(favorites));

    // ページ内の同じ動画を指す全てのボタンの見た目を更新する
    // (同じ動画が複数タブ・複数箇所に出ている場合を考慮)
    document.querySelectorAll(`.video-favorite-btn[data-video-url="${CSS.escape(url)}"]`).forEach(btn => {
        btn.classList.toggle("video-favorite-btn-active", index === -1);
    });

}

// ページ内の動画お気に入りボタンの初期状態(すでにお気に入り済みか)を反映する
function applyVideoFavoriteStates(root = document) {

    root.querySelectorAll(".video-favorite-btn").forEach(btn => {
        const active = isVideoFavorite(btn.dataset.videoUrl);
        btn.classList.toggle("video-favorite-btn-active", active);
    });

}

/**
 * 動画が見つからなかった場合の「YouTubeで検索する」フォールバックカードを生成する
 *
 * @param {string} query - 検索クエリ(YouTube検索ページへのリンクに使う)
 * @param {string} label - カードに表示する案内文
 * @returns {string} カード1枚分のHTML文字列
 */
function renderVideoSearchFallbackHtml(query, label) {

    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    return `
        <a class="video-card video-card-fallback" href="${searchUrl}" target="_blank" rel="noopener">
            <div class="video-thumb-search"><i class="ti ti-brand-youtube" aria-hidden="true"></i></div>
            <div class="video-info">
                <h3>${label}</h3>
                <span class="video-link-label">YouTubeで検索する ↗</span>
            </div>
        </a>
    `;

}
