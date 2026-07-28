// 全ページ共通のヘッダーナビゲーション制御
// - スマホ幅ではハンバーガーボタンでナビの開閉
// - ドロップダウン(診断▼/図鑑▼)はhoverが効かないタッチ端末のため、
//   クリック/タップでも開閉できるようにする
document.addEventListener("DOMContentLoaded", () => {

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

});
