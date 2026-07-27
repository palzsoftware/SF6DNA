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