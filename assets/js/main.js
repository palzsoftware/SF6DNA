document.addEventListener("DOMContentLoaded", () => {

    console.log("SF6 DNA Loaded");

});

const bubbles = document.querySelectorAll(".feature-bubble");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach((entry,index)=>{

        if(entry.isIntersecting){

            setTimeout(()=>{

                entry.target.classList.add("show");

            },index*250);

        }

    });

});

bubbles.forEach((bubble)=>observer.observe(bubble));

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