// 全ページ共通のヘッダーナビゲーション制御
// - スマホ幅ではハンバーガーボタンでナビの開閉
// - ドロップダウン(診断▼/図鑑▼)はhoverが効かないタッチ端末のため、
//   クリック/タップでも開閉できるようにする
document.addEventListener("DOMContentLoaded", () => {

    // ヘッダーの実際の高さを測ってCSS変数に反映する。
    // ハンバーガーメニューのパネルがヘッダー直下からズレず開くようにするため
    // (画面幅やフォントサイズでヘッダーの高さが変わってもズレない)
    const header = document.querySelector(".site-header");

    function updateHeaderHeight() {
        if (header) {
            document.documentElement.style.setProperty(
                "--header-height",
                `${header.offsetHeight}px`
            );
        }
    }

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    // ===== PC版/スマホ版 表示切り替え =====
    // - 「force-mobile」: 実際の画面幅に関わらず、カード類・文字サイズをスマホ向けに強制する
    //   (PCの広い画面でスマホでの見え方を確認したい場合に使う)
    // - 「force-pc」: スマホの実機で見ていても、meta viewportの幅を広げてPC版のレイアウトを
    //   強制表示する(いわゆる「デスクトップ用サイトを見る」と同じ仕組み)
    const viewModeToggle = document.getElementById("viewModeToggle");
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const defaultViewportContent = viewportMeta ? viewportMeta.getAttribute("content") : "width=device-width, initial-scale=1.0";

    function applyViewMode(mode) {

        document.body.classList.remove("force-mobile", "force-pc");

        if (mode === "mobile") {
            document.body.classList.add("force-mobile");
            if (viewModeToggle) {
                viewModeToggle.textContent = "🖥️";
                viewModeToggle.title = "PC版の表示に切り替えます";
            }
        } else if (mode === "pc") {
            document.body.classList.add("force-pc");
            // meta viewportの幅を広げることで、スマホ実機でもPC版レイアウトで表示させる
            if (viewportMeta) {
                viewportMeta.setAttribute("content", "width=1280");
            }
            if (viewModeToggle) {
                viewModeToggle.textContent = "📱";
                viewModeToggle.title = "スマホ版の表示に切り替えます";
            }
        } else {
            // "auto": 実際の画面幅にそのまま従う(初期状態)
            if (viewportMeta) {
                viewportMeta.setAttribute("content", defaultViewportContent);
            }
            if (viewModeToggle) {
                viewModeToggle.textContent = "📱";
                viewModeToggle.title = "PC版/スマホ版の表示を切り替えます";
            }
        }

    }

    if (viewModeToggle) {

        const savedMode = localStorage.getItem("sf6dna_view_mode") || "auto";
        applyViewMode(savedMode);

        viewModeToggle.addEventListener("click", () => {

            const current = localStorage.getItem("sf6dna_view_mode") || "auto";

            // auto/pc状態からは「スマホ版を強制」へ、mobile状態からは「PC版を強制」へ切り替える
            const next = current === "mobile" ? "pc" : "mobile";

            localStorage.setItem("sf6dna_view_mode", next);
            applyViewMode(next);

        });

    }

    const navToggle = document.getElementById("navToggle");
    const nav = document.querySelector(".site-header .nav");

    if (navToggle && nav) {

        navToggle.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("is-open");
            navToggle.classList.toggle("is-open", isOpen);
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

        });

    }

    // ドロップダウン(診断▼/図鑑▼)をタップでも開閉できるようにする
    document.querySelectorAll(".dropdown-button").forEach(button => {

        button.addEventListener("click", (event) => {

            const dropdown = button.closest(".dropdown");
            if (!dropdown) return;

            const willOpen = !dropdown.classList.contains("is-open");

            // 他に開いているドロップダウンがあれば閉じる
            document.querySelectorAll(".dropdown.is-open").forEach(d => {
                if (d !== dropdown) d.classList.remove("is-open");
            });

            dropdown.classList.toggle("is-open", willOpen);

        });

    });

    // メニュー外をクリックしたら、開いているナビ/ドロップダウンを閉じる
    document.addEventListener("click", (event) => {

        if (nav && !event.target.closest(".site-header")) {

            nav.classList.remove("is-open");
            if (navToggle) {
                navToggle.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }

            document.querySelectorAll(".dropdown.is-open").forEach(d => {
                d.classList.remove("is-open");
            });

        }

    });

    // ナビ内のリンクをタップしたらメニューを閉じる(スマホでのページ遷移時)
    if (nav) {

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                nav.classList.remove("is-open");
                if (navToggle) {
                    navToggle.classList.remove("is-open");
                    navToggle.setAttribute("aria-expanded", "false");
                }
            });

        });

    }

    // ===== 初心者モードに応じたナビゲーション文言の切り替え =====
    // 「図鑑」は初心者には伝わりにくいため、初心者モード選択時のみ
    // 「学ぶ」という表現に切り替える。中上級者向けの表示は変更しない。
    // (sf6dna_experience_level は onboarding.js が保存する)
    applyExperienceLevelNavLabels();

});

function applyExperienceLevelNavLabels() {

    const level = localStorage.getItem("sf6dna_experience_level");
    const isBeginner = level === "beginner";

    const charLink = document.querySelector('.dropdown-content a[href="characters.html"]');
    const playerLink = document.querySelector('.dropdown-content a[href="players.html"]');

    function setLinkText(link, beginnerText, normalText) {

        if (!link) return;

        const badge = link.querySelector("span");
        link.textContent = "";
        if (badge) link.appendChild(badge);
        link.appendChild(document.createTextNode(isBeginner ? beginnerText : normalText));

    }

    setLinkText(charLink, "キャラを学ぶ", "キャラクター図鑑");
    setLinkText(playerLink, "選手を学ぶ", "プレイヤー図鑑");

    // ドロップダウンの見出し(「図鑑 ▼」)自体も、キャラ/選手リンクを含む
    // ドロップダウンに限って「学ぶ ▼」に切り替える
    if (charLink) {

        const dropdown = charLink.closest(".dropdown");
        const trigger = dropdown ? dropdown.querySelector(".dropdown-button") : null;

        if (trigger) {
            trigger.textContent = isBeginner ? "学ぶ ▼" : "図鑑 ▼";
        }

    }

}
