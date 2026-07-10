const questions = [
    {
        question: "相手の体力が残り少なくなった時、あなたはどう行動しますか？",
        answers: [
            "一気に攻め切る",
            "相手を見てから攻める",
            "無理をせず様子を見る",
            "飛び道具や牽制で削る",
            "状況によって変える"
        ]
    },
    {
        question: "ラウンド開始直後はどう動きますか？",
        answers: [
            "前へ歩く",
            "様子を見る",
            "ジャンプする",
            "飛び道具を撃つ",
            "相手次第"
        ]
    }
];

let currentQuestion = 0;
const userAnswers = [];
const nextButton = document.getElementById("nextButton");

nextButton.addEventListener("click", () => {

    const selected =
    document.querySelector('input[name="question"]:checked');

if(!selected){

    alert("回答を選択してください。");
    return;

}

/* 回答保存 */

userAnswers[currentQuestion] = Number(selected.value);

if(currentQuestion < questions.length - 1){

    currentQuestion++;

    renderQuestion();

}else{

    console.log(userAnswers);

    alert("診断終了です。（次回結果画面へ）");

}

});
const questionNumber = document.getElementById("questionNumber");
const questionTitle = document.getElementById("questionTitle");
const answerList = document.getElementById("answerList");
const progressBar = document.getElementById("progressBar");

function renderQuestion() {

    const q = questions[currentQuestion];

    questionNumber.textContent = `Q${currentQuestion + 1}`;

    questionTitle.textContent = q.question;

    answerList.innerHTML = "";

    q.answers.forEach((answer, index) => {

    const checked =
        userAnswers[currentQuestion] === index
        ? "checked"
        : "";

    answerList.innerHTML += `
        <label class="answer-item">
            <input
                type="radio"
                name="question"
                value="${index}"
                ${checked}
            >
            <span class="answer-text">${answer}</span>
        </label>
    `;

});

    });
    progressBar.style.width =
`${((currentQuestion + 1) / questions.length) * 100}%`;

}

renderQuestion();

