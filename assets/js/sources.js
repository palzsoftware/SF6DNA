document.addEventListener("DOMContentLoaded", () => {

    const sourcesArea = document.getElementById("sourcesArea");

    if (typeof referenceSources === "undefined") return;

    sourcesArea.innerHTML = referenceSources.map(group => `
        <div class="about-card">
            <h2>${group.category}</h2>
            <ul class="sources-list">
                ${group.items.map(item => `
                    <li>
                        <a href="${item.url}" target="_blank" rel="noopener">
                            ${item.title}
                        </a>
                    </li>
                `).join("")}
            </ul>
        </div>
    `).join("");

});
