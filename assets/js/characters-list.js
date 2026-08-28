const characterArea = document.getElementById("characterArea");
const characterSearch = document.getElementById("characterSearch");

// 「未設定」+ site-constants.jsのRELATION_STATUS_CONFIG(設定テーブル)を
// この順番でカード上のステータス表示・クリック時の巡回に使う。
// ステータスの種類を増減する場合は、このファイルではなくsite-constants.js側の
// RELATION_STATUS_CONFIGを変更するだけでよい(Phase6-B)。
const statusList = [
    { status: null, icon: "○", text: "未設定", class: "status-none" },
    ...RELATION_STATUS_CONFIG.map(item => ({
        status: item.status,
        icon: item.icon,
        text: item.label,
        class: item.badgeClass
    }))
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

    // currentFavoriteFilterは "none"(未設定) または RELATION_STATUS の値のいずれか
    return list.filter(character => {
        const relation = getCharacterRelation(character.id);
        const status = relation ? relation.status : "none";
        return status === currentFavoriteFilter;
    });

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

function applyFilters(){
    
    let list = Object.values(characterData);

    list = filterByKeyword(list);

    list = filterByType(list);

    list = filterByFavorite(list);

    list = sortCharacters(list);

    renderCharacters(list);

}

function createCharacterCard(character){

    const relation = getCharacterRelation(character.id);
    const currentStatusValue = relation ? relation.status : null;

    // statusListの中から現在のステータスに一致するものを探す(先頭は「未設定」=status:null)
    const status =
        statusList.find(item => item.status === currentStatusValue) || statusList[0];

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
    const character = characterData[id];

    // statusList([未設定, メイン, サブ, 練習中, 苦手, 気になる])の中で、
    // 現在のステータスの次のものへ巡回する(末尾の次は「未設定」に戻る)
    const relation = getCharacterRelation(id);
    const currentIndex = statusList.findIndex(item => item.status === (relation ? relation.status : null));
    const nextItem = statusList[(currentIndex + 1) % statusList.length];

    setCharacterRelation(id, nextItem.status, character ? character.name : id);

    target.querySelector(".status-icon").textContent = nextItem.icon;
    target.querySelector(".status-text").textContent = nextItem.text;
    target.className = "character-status " + nextItem.class;

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
// ===== 今日のおすすめ(Phase4) =====
// 「今日」を基準にキャラクターを1体選ぶ(site-constants.jsのgetDailyPickを使用)。
// キャラクター用のsaltは0、動画用は2(他の「今日のおすすめ」機能とズラすことで
// カテゴリ間の偏りを避ける。ホームのキャラ=salt0、ワンポイント=salt1と重複しないよう2にしている)
(function renderTodayPicks() {

    const charArea = document.getElementById("todayPickCharacter");
    const videoArea = document.getElementById("todayPickVideo");
    if (!charArea || typeof characterData === "undefined") return;

    const dailyId = pickDailyCharacterId(characterData, 0);
    const character = dailyId ? characterData[dailyId] : null;

    if (!character) return;

    charArea.innerHTML = `
        <a href="character.html?id=${dailyId}" class="today-pick-link">
            <img src="${character.image}" alt="${character.name}" class="today-pick-avatar">
            <div>
                <p class="today-pick-sublabel">今日のキャラクター</p>
                <p class="today-pick-name">${character.name}</p>
            </div>
        </a>
    `;

    if (videoArea) {

        videoArea.innerHTML = `<p class="today-pick-loading">読み込み中…</p>`;

        const VIDEO_API_BASE_URL = "https://sf6dna-backend.onrender.com";
        const queries = [
            `${character.name} コンボ ストリートファイター6`,
            `${character.name} ストリートファイター6`
        ];

        fetchVideosWithQueryRetry(VIDEO_API_BASE_URL, queries, 1).then(results => {

            if (results && results.length > 0) {

                const video = results[0];

                videoArea.innerHTML = `
                    <a href="${video.url}" target="_blank" rel="noopener" class="today-pick-link">
                        <img src="${video.thumbnail}" alt="${video.title}" class="today-pick-avatar today-pick-avatar-square">
                        <div>
                            <p class="today-pick-sublabel">今日のおすすめ動画</p>
                            <p class="today-pick-name">${video.title}</p>
                        </div>
                    </a>
                `;

            } else {

                videoArea.innerHTML = `<p class="today-pick-loading">動画が見つかりませんでした</p>`;

            }

        });

    }

})();
