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
