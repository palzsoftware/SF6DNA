// ===== セクション全体のスクロールインアニメーション =====
const revealTargets = document.querySelectorAll(".reveal-on-scroll");

if (revealTargets.length > 0 && "IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.15 });

    revealTargets.forEach(target => revealObserver.observe(target));

}