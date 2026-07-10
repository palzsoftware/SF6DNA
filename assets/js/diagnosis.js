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
const nextButton = document.getElementById("nextButton");

nextButton.addEventListener("click", () => {

    currentQuestion++;

    alert("Q" + (currentQuestion + 1) + "へ進みます。（次回実装）");

});