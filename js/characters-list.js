const characterArea = document.getElementById("characterArea");
const characterSearch = document.getElementById("characterSearch");

const statusList = [
    {icon:"○",text:"未設定",class:"status-none"},
    {icon:"★",text:"メイン",class:"status-main"},
    {icon:"△",text:"サブ",class:"status-sub"},
    {icon:"◇",text:"気になる",class:"status-interest"},
    {icon:"♡",text:"使ってみたい",class:"status-try"}
];

let currentTypeFilter = "all";
let currentFavoriteFilter = "all";
let currentKeyword = "";
let currentSort = "default";

function filterByKeyword(list){

    if(!currentKeyword){

        return list;

    }

    return list.filter(character =>

        character.name
            .toLowerCase()
            .includes(currentKeyword)

    );

}

function filterByType(list){

    if(currentTypeFilter === "all"){

        return list;

    }

    if(currentTypeFilter === "beginner"){

        return list.filter(character =>
            character.difficulty <= 2
        );

    }

    const map = {
        balance:"バランス",
        power:"パワー",
        speed:"スピード",
        defense:"ディフェンス",
        grappler:"グラップラー",
        technical:"テクニカル",
        shooting:"シューティング"
    };

    return list.filter(character =>
        character.type.includes(map[currentTypeFilter])
    );

}

function filterByFavorite(list){

    if(currentFavoriteFilter === "all"){

        return list;

    }

    const status =
        JSON.parse(localStorage.getItem("sf6dna_status")) || {};

    return list.filter(character =>
        (status[character.id] ?? 0).toString() === currentFavoriteFilter
    );

}

function sortCharacters(list){

    switch(currentSort){

        case "difficultyAsc":
            list.sort((a,b) => a.difficulty - b.difficulty);
            break;

        case "difficultyDesc":
            list.sort((a,b) => b.difficulty - a.difficulty);
            break;

        case "name":
            list.sort((a,b) => a.name.localeCompare(b.name,"ja"));
            break;

    }

    return list;

}

function getStatusData(){

    return JSON.parse(
        localStorage.getItem("sf6dna_status")
    ) || {};

}

function applyFilters(){
    
    let list = Object.values(characterData);

    list = filterByKeyword(list);

    list = filterByType(list);

    list = filterByFavorite(list);

    list = sortCharacters(list);

    renderCharacters(list);

}

function createCharacterCard(character){

    const savedStatus = getStatusData();

    const statusIndex =
        savedStatus[character.id] ?? 0;

    const status =
        statusList[statusIndex];

    return `
<div class="card">

    <div
        class="character-status ${status.class}"
        data-id="${character.id}"
    >

        <span class="status-icon">
            ${status.icon}
        </span>

        <span class="status-text">
            ${status.text}
        </span>

    </div>

    <a
        href="character.html?id=${character.id}"
        class="card-link"
    >

        <img
            src="${character.image}"
            alt="${character.name}"
            class="character-image"
        >

        <div class="character-content">

            <h3 class="character-name">
                ${character.name}
            </h3>

            <span class="character-type">
                ${character.type}
            </span>

            <p class="character-difficulty">
                <strong>難易度：</strong>
                ${"★".repeat(character.difficulty)}
                ${"☆".repeat(5-character.difficulty)}
            </p>

        </div>

    </a>

</div>
`;

}

function renderCharacters(list){

    characterArea.innerHTML = "";

    list.forEach(character => {

    characterArea.innerHTML += createCharacterCard(character);

});
}


const searchInput = document.getElementById("characterSearch");

searchInput.addEventListener("input", () => {

    currentKeyword = searchInput.value.toLowerCase();

    applyFilters();

});

const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentTypeFilter = button.dataset.filter;

applyFilters();

    });

});

const favoriteButtons =document.querySelectorAll(".favorite-button");

favoriteButtons.forEach(button => {

    button.addEventListener("click", () => {

        favoriteButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFavoriteFilter = button.dataset.status;



applyFilters();

    });

});

const sortSelect = document.getElementById("sortSelect");
sortSelect.addEventListener("change", () => {

    currentSort = sortSelect.value;

    applyFilters();

});

document.addEventListener("click", e => {

    const target = e.target.closest(".character-status");

    if(!target) return;

    e.preventDefault();
    e.stopPropagation();

    const id = target.dataset.id;

    const status =
        JSON.parse(localStorage.getItem("sf6dna_status")) || {};

    status[id] =
        ((status[id] ?? 0) + 1) % statusList.length;

    localStorage.setItem(
        "sf6dna_status",
        JSON.stringify(status)
    );

    target.querySelector(".status-icon").textContent =
        statusList[status[id]].icon;

    target.querySelector(".status-text").textContent =
        statusList[status[id]].text;

    target.className =
    "character-status " + statusList[status[id]].class;
    
applyFilters();

});

const compareButton =
    document.getElementById("compareButton");

const compareModal =
    document.getElementById("compareModal");

const cancelCompare =
    document.getElementById("cancelCompare");

const startCompare =
    document.getElementById("startCompare");

compareButton.addEventListener("click", e => {

    e.preventDefault();

    compareModal.classList.remove("hidden");

});

cancelCompare.addEventListener("click", () => {

    compareModal.classList.add("hidden");

});

startCompare.addEventListener("click", () => {

    window.location.href =
        "character-select.html";

});

const filterToggle =
    document.querySelector(".filter-section .compare-toggle");

const filterArea =
    document.querySelector(".filter-area");

filterToggle.addEventListener("click",()=>{

    filterArea.classList.toggle("hidden");

    filterToggle.textContent =
        filterArea.classList.contains("hidden")
        ? "▶ プレイタイプ"
        : "▼ プレイタイプ";

});



applyFilters();