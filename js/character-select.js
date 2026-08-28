const characterArea =document.getElementById("characterArea");

    const selectedCharacters =
    JSON.parse(
        localStorage.getItem("sf6dna_compare")
    ) || [];

    const selectedCount =document.getElementById("selectedCount");

    const startCompareButton =document.getElementById("startCompareButton");

renderCharacters();

updateSelectedCharacters();

function renderCharacters(){

    characterArea.innerHTML = "";

    Object.values(characterData).forEach(character => {

        characterArea.innerHTML += createCharacterCard(character);

    });

}

characterArea.addEventListener("click", e => {

    const card = e.target.closest(".card");

    if(!card) return;

    const id = card.dataset.id;

    toggleCharacter(id);

});

function toggleCharacter(id){

    const index =
        selectedCharacters.indexOf(id);

    if(index >= 0){

        selectedCharacters.splice(index,1);

    }else{

        if(selectedCharacters.length >= 4){

            alert("比較できるのは4人までです。");

            return;

        }

        selectedCharacters.push(id);

    }

    updateSelectedCharacters();

    localStorage.setItem(

    "sf6dna_compare",

    JSON.stringify(selectedCharacters)

);

}

function updateSelectedCharacters(){

    selectedCount.textContent =
        `選択中：${selectedCharacters.length} / 4`;

    startCompareButton.disabled =
        selectedCharacters.length < 2;

    document
        .querySelectorAll(".card")
        .forEach(card=>{

            card.classList.remove("selected");

            if(
                selectedCharacters.includes(card.dataset.id)
            ){
                card.classList.add("selected");
            }

        });

}

function createCharacterCard(character){

    return `

<div
    class="card"
    data-id="${character.id}"
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
</div>
`;

}
startCompareButton.addEventListener("click", () => {

    localStorage.setItem(

        "sf6dna_compare",

        JSON.stringify(selectedCharacters)

    );

    location.href = "compare.html";

});