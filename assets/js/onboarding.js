// ==========================================
// オンボーディング(初心者モード選択・チュートリアル・設定)
// ==========================================
//
// このファイルがやること:
//   1. 初回アクセス時に「あなたの現在地を教えてください」モーダルを表示する
//   2. 「初心者」を選んだ場合のみ、続けて簡単なチュートリアル(1〜2画面)を表示する
//      (中級者・上級者はレベル選択のみで即座に利用開始できる)
//   3. ナビの「About ▼」内に設定リンクを追加し、いつでもレベル変更・
//      チュートリアル再表示ができるようにする
//
// localStorageキー:
//   sf6dna_experience_level : "beginner" | "intermediate" | "advanced"
//   sf6dna_tutorial_seen    : "true" (チュートリアルを最後まで見た/スキップした場合)
//
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    injectOnboardingMarkup();
    injectSettingsLink();

    const level = localStorage.getItem("sf6dna_experience_level");

    if (!level) {
        showLevelModal({ isFirstVisit: true });
    }

    document.getElementById("onboardingSettingsLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        showLevelModal({ isFirstVisit: false });
    });

});

// ===== モーダルのHTMLを差し込む =====
function injectOnboardingMarkup() {

    if (document.getElementById("levelModal")) return;

    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
        <div id="levelModal" class="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="levelModalTitle" style="display:none;">
            <div class="onboarding-modal">

                <button type="button" class="onboarding-close-btn" data-close-modal="levelModal" aria-label="閉じる">✕</button>

                <p class="onboarding-eyebrow">SF6 DNAへようこそ</p>
                <h2 id="levelModalTitle" class="onboarding-title">あなたの現在地を教えてください</h2>
                <p class="onboarding-lead">選んだ内容に合わせて、表示する情報を最適化します。設定はあとから変更できます。</p>

                <div class="onboarding-level-list">

                    <button type="button" class="onboarding-level-card" data-level="beginner">
                        <span class="onboarding-level-icon">🌱</span>
                        <span class="onboarding-level-text">
                            <span class="onboarding-level-title">初心者</span>
                            <span class="onboarding-level-desc">スト6を始めたばかり。まずは基本から学びたい</span>
                        </span>
                    </button>

                    <button type="button" class="onboarding-level-card" data-level="intermediate">
                        <span class="onboarding-level-icon">⚔️</span>
                        <span class="onboarding-level-text">
                            <span class="onboarding-level-title">中級者</span>
                            <span class="onboarding-level-desc">ランクマッチに挑戦中。もっと勝率を上げたい</span>
                        </span>
                    </button>

                    <button type="button" class="onboarding-level-card" data-level="advanced">
                        <span class="onboarding-level-icon">🏆</span>
                        <span class="onboarding-level-text">
                            <span class="onboarding-level-title">上級者</span>
                            <span class="onboarding-level-desc">大会・MR向上を目指している。高度な情報が欲しい</span>
                        </span>
                    </button>

                </div>

            </div>
        </div>

        <div id="tutorialModal" class="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="tutorialModalTitle" style="display:none;">
            <div class="onboarding-modal">

                <button type="button" class="onboarding-close-btn" data-close-modal="tutorialModal" aria-label="閉じる">✕</button>

                <div id="tutorialStep1" class="tutorial-step">
                    <p class="onboarding-eyebrow">SF6 DNAの使い方</p>
                    <h2 id="tutorialModalTitle" class="onboarding-title">ようこそSF6DNAへ</h2>
                    <p class="onboarding-lead">
                        SF6DNAは、診断・図鑑・練習メニューがひとつになった、あなたの成長を支えるサイトです。
                    </p>
                    <div class="tutorial-flow">
                        <span class="tutorial-flow-item">診断して</span>
                        <span class="tutorial-flow-arrow">→</span>
                        <span class="tutorial-flow-item">学んで</span>
                        <span class="tutorial-flow-arrow">→</span>
                        <span class="tutorial-flow-item">強くなろう</span>
                    </div>
                </div>

                <div id="tutorialStep2" class="tutorial-step" style="display:none;">
                    <p class="onboarding-eyebrow">はじめの一歩</p>
                    <h2 class="onboarding-title">まずは診断から</h2>
                    <p class="onboarding-lead">
                        簡単な質問に答えるだけで、あなたに合ったキャラクターや練習メニューが分かります。
                        迷ったら、まず「初心者はこちら」ボタンから見てみましょう。
                    </p>
                </div>

                <div class="tutorial-actions">
                    <button type="button" id="tutorialSkip" class="onboarding-ghost-btn">スキップ</button>
                    <button type="button" id="tutorialNext" class="onboarding-primary-btn">次へ</button>
                </div>

            </div>
        </div>
    `;

    document.body.appendChild(wrapper);

    // ===== レベル選択の処理 =====
    wrapper.querySelectorAll(".onboarding-level-card").forEach(card => {

        card.addEventListener("click", () => {

            const level = card.dataset.level;
            localStorage.setItem("sf6dna_experience_level", level);

            hideModal("levelModal");

            if (typeof applyExperienceLevelNavLabels === "function") {
                applyExperienceLevelNavLabels();
            }

            // 初心者を選んだ場合のみ、チュートリアルを続けて表示する
            // (中級者・上級者はここで完了し、すぐにサイトを使い始められる)
            if (level === "beginner" && localStorage.getItem("sf6dna_tutorial_seen") !== "true") {
                showTutorialModal();
            }

        });

    });

    // ===== チュートリアルの処理 =====
    let tutorialStep = 1;

    function goToTutorialStep(step) {

        tutorialStep = step;

        const step1El = document.getElementById("tutorialStep1");
        const step2El = document.getElementById("tutorialStep2");
        const showEl = step === 1 ? step1El : step2El;
        const hideEl = step === 1 ? step2El : step1El;

        hideEl.style.display = "none";
        showEl.style.display = "";

        // 瞬間的な切り替えではなく、ふわっと切り替わるようにする
        showEl.classList.remove("tutorial-step-fade");
        void showEl.offsetWidth; // アニメーションを再トリガーするための強制リフロー
        showEl.classList.add("tutorial-step-fade");

        document.getElementById("tutorialNext").textContent = step === 2 ? "はじめる" : "次へ";

    }

    document.getElementById("tutorialNext").addEventListener("click", () => {

        if (tutorialStep === 1) {
            goToTutorialStep(2);
            return;
        }

        finishTutorial();

    });

    document.getElementById("tutorialSkip").addEventListener("click", finishTutorial);

    function finishTutorial() {
        localStorage.setItem("sf6dna_tutorial_seen", "true");
        hideModal("tutorialModal");
        goToTutorialStep(1); // 次回設定から見直す時のために状態をリセットしておく
    }

}

function showLevelModal({ isFirstVisit }) {

    const modal = document.getElementById("levelModal");
    if (!modal) return;

    // 設定画面から開いた場合は、現在選択中のレベルを分かるようにしておく
    const currentLevel = localStorage.getItem("sf6dna_experience_level");

    modal.querySelectorAll(".onboarding-level-card").forEach(card => {
        card.classList.toggle("onboarding-level-card-current", !isFirstVisit && card.dataset.level === currentLevel);
    });

    showModal("levelModal");

}

function showTutorialModal() {
    showModal("tutorialModal");
}

// ===== モーダル表示中に画面下のフォーカス移動を戻すための記録 =====
let lastFocusedElementBeforeModal = null;

function showModal(id) {

    const modal = document.getElementById(id);
    if (!modal) return;

    lastFocusedElementBeforeModal = document.activeElement;

    modal.style.display = "flex";

    // 最初のフォーカス可能な要素(閉じるボタン)へフォーカスを移す
    const closeBtn = modal.querySelector(".onboarding-close-btn");
    if (closeBtn) closeBtn.focus();

    document.addEventListener("keydown", handleModalKeydown);

}

function hideModal(id) {

    const modal = document.getElementById(id);
    if (!modal) return;

    modal.style.display = "none";

    document.removeEventListener("keydown", handleModalKeydown);

    // 開く前にフォーカスされていた要素(設定リンク等)へフォーカスを戻す
    if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === "function") {
        lastFocusedElementBeforeModal.focus();
    }

}

// ===== Escキーでの終了、Tabキーでのフォーカストラップ =====
function handleModalKeydown(e) {

    const openModal = Array.from(document.querySelectorAll(".onboarding-overlay"))
        .find(m => m.style.display === "flex");

    if (!openModal) return;

    if (e.key === "Escape") {
        e.preventDefault();
        hideModal(openModal.id);
        return;
    }

    if (e.key === "Tab") {

        // モーダル内のフォーカス可能な要素だけをぐるぐる回す(フォーカストラップ)
        const focusable = openModal.querySelectorAll(
            'button, a[href], [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }

    }

}

// ===== 閉じるボタン(✕)の処理を一括で登録 =====
document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", () => {
            hideModal(btn.dataset.closeModal);
        });
    });

});

// ===== 「🎮 レベル変更」を独立したナビ項目として追加する =====
// (以前はAbout▼の中に入れていたが、初心者はAboutを開こうと考えないため、
//  ナビの目立つ位置に単独のボタンとして配置し、設定変更までを最短2タップにする)
function injectSettingsLink() {

    const nav = document.querySelector("nav.nav");
    if (!nav || document.getElementById("onboardingSettingsLink")) return;

    const settingsBtn = document.createElement("button");
    settingsBtn.type = "button";
    settingsBtn.id = "onboardingSettingsLink";
    settingsBtn.className = "nav-level-btn";
    settingsBtn.innerHTML = `🎮 レベル変更`;

    // 表示モード切替ボタンの直前に挿入(ナビの一番右寄り、目立つ位置)
    const viewModeToggle = nav.querySelector(".view-mode-toggle");

    if (viewModeToggle) {
        nav.insertBefore(settingsBtn, viewModeToggle);
    } else {
        nav.appendChild(settingsBtn);
    }

}
