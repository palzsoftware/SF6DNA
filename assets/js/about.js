document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();

            alert("現在お問い合わせフォームは準備中です。もうしばらくお待ちください。");

        });

    }

    const faqSearch = document.getElementById("faqSearch");
    const faqItems = document.querySelectorAll(".faq-item");
    const faqNoResult = document.getElementById("faqNoResult");

    // アコーディオン開閉
    faqItems.forEach(item => {

        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            item.classList.toggle("is-open");
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

});
