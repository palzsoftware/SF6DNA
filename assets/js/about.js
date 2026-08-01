document.addEventListener("DOMContentLoaded", () => {

    // Formspreeのフォームエンドポイント。
    // 未設定の間は「準備中です」と表示するフォールバックになる。
    // 設定手順はREADME等を参照。
    // 例: const CONTACT_FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
    const CONTACT_FORM_ENDPOINT = "";

    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    if (contactForm) {

        contactForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            if (!CONTACT_FORM_ENDPOINT) {
                contactStatus.textContent =
                    "現在お問い合わせフォームは準備中です。もうしばらくお待ちください。";
                contactStatus.className = "contact-status error";
                return;
            }

            const submitButton = contactForm.querySelector("button[type=submit]");
            submitButton.disabled = true;
            contactStatus.textContent = "送信中です…";
            contactStatus.className = "contact-status";

            try {

                const formData = new FormData(contactForm);

                const res = await fetch(CONTACT_FORM_ENDPOINT, {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" }
                });

                if (res.ok) {
                    contactStatus.textContent = "送信しました。ありがとうございます。";
                    contactStatus.className = "contact-status success";
                    contactForm.reset();
                } else {
                    throw new Error("送信に失敗しました");
                }

            } catch (err) {

                console.warn("[contactForm] 送信に失敗しました", err);
                contactStatus.textContent =
                    "送信に失敗しました。お手数ですが時間をおいて再度お試しください。";
                contactStatus.className = "contact-status error";

            } finally {

                submitButton.disabled = false;

            }

        });

    }

    const faqSearch = document.getElementById("faqSearch");
    const faqItems = document.querySelectorAll(".faq-item");
    const faqNoResult = document.getElementById("faqNoResult");

    if (faqSearch && faqItems.length > 0) {

    // アコーディオン開閉
    faqItems.forEach(item => {

        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {

            const wasOpen = item.classList.contains("is-open");
            item.classList.toggle("is-open");

            // 開いた時(閉じた時は記録しない)だけ活動ログへ記録する
            if (!wasOpen && typeof recordActivity === "function") {
                recordActivity(ACTIVITY_TYPES.FAQ, question.textContent.trim(), question.textContent.trim());
            }

        });

    });

    // キーワード検索(質問文・data-keywordsの両方を対象にする)
    faqSearch.addEventListener("input", () => {

        const keyword = faqSearch.value.trim().toLowerCase();

        let visibleCount = 0;

        faqItems.forEach(item => {

            const questionText =
                item.querySelector(".faq-question").textContent.toLowerCase();

            const answerText =
                item.querySelector(".faq-answer").textContent.toLowerCase();

            const tags =
                (item.dataset.keywords || "").toLowerCase();

            const matched =
                keyword === "" ||
                questionText.includes(keyword) ||
                answerText.includes(keyword) ||
                tags.includes(keyword);

            item.style.display = matched ? "" : "none";

            if (matched) visibleCount++;

            // 検索でヒットした項目は自動的に開く
            if (matched && keyword !== "") {
                item.classList.add("is-open");
            }

        });

        faqNoResult.style.display = visibleCount === 0 ? "" : "none";

    });

    }

});

// ===== 今日のおすすめFAQ(Phase4) =====
// about.jsはabout/contact/faq/changelog/sources.htmlで共通利用されるため、
// FAQページ以外では対象要素が存在せず、何もせず終了する(他ページへの影響なし)。
(function renderTodayPickFaq() {

    const area = document.getElementById("todayPickFaqArea");
    if (!area) return;

    // site-constants.js が読み込まれていない環境でも安全に終了する
    if (typeof getDailyPick !== "function") return;

    const items = document.querySelectorAll(".faq-item");
    if (items.length === 0) return;

    // 「今日のおすすめキャラクター(salt=0)」等とズラすため salt=4 を使用
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    const index = (dayOfYear + 4) % items.length;

    const chosen = items[index];
    const question = chosen.querySelector(".faq-question")?.textContent.trim();
    const answer = chosen.querySelector(".faq-answer p")?.textContent.trim();

    if (!question) return;

    area.classList.add("today-pick-card");
    area.innerHTML = `
        <p class="today-pick-faq-question">${question}</p>
        <p class="today-pick-faq-answer">${answer || ""}</p>
    `;

})();

// ===== FAQのお気に入り機能(Phase4) =====
// FAQ項目は静的HTMLで24件あり、1件ずつ手作業でボタンを追加するのは
// 保守性の観点で避けたいため、JSで各.faq-itemに動的に追加する。
// localStorageキー: sf6dna_favorite_faq(質問文の配列。FAQには固定IDが無いため質問文をキーにする)
(function setupFaqFavorites() {

    const items = document.querySelectorAll(".faq-item");
    if (items.length === 0) return;

    const KEY = "sf6dna_favorite_faq";

    function getFavorites() {
        return (typeof getLocalJSON === "function") ? getLocalJSON(KEY, []) : [];
    }

    items.forEach(item => {

        const questionEl = item.querySelector(".faq-question");
        if (!questionEl) return;

        const questionText = questionEl.textContent.trim();

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "faq-favorite-btn";
        btn.setAttribute("aria-label", "お気に入りに追加");
        btn.innerHTML = `<i class="ti ti-heart" aria-hidden="true"></i>`;

        if (getFavorites().includes(questionText)) {
            btn.classList.add("faq-favorite-btn-active");
        }

        btn.addEventListener("click", (e) => {

            e.stopPropagation(); // アコーディオンの開閉トグルと干渉しないようにする

            const favorites = getFavorites();
            const index = favorites.indexOf(questionText);

            if (index === -1) {
                favorites.push(questionText);
            } else {
                favorites.splice(index, 1);
            }

            localStorage.setItem(KEY, JSON.stringify(favorites));
            btn.classList.toggle("faq-favorite-btn-active", index === -1);

        });

        questionEl.insertAdjacentElement("afterend", btn);

    });

})();
