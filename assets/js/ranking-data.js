// ==========================================
// ランキング カテゴリ設定
// ==========================================
//
// 各カテゴリの「見た目の設定」と「データの取得方法」を分離している。
// 将来、実際の閲覧数・お気に入り数などのAPIが用意された場合は、
// dataSource の値を "api" に変え、対応する取得関数を差し替えるだけで良い設計。
//
// dataSource:
//   "computed" … 既存データ(achievements等)から、このページで計算する
//   "comingSoon" … 実データが無いため、準備中として表示する
//
// ==========================================

const rankingCategories = [
    {
        id: "player-achievements",
        title: "大会実績ランキング(プレイヤー)",
        icon: "ti-trophy",
        dataSource: "computed",
        description: "登録されている大会実績の件数が多い順に表示しています"
    },
    {
        id: "character-popularity",
        title: "人気キャラクターランキング",
        icon: "ti-swords",
        dataSource: "comingSoon",
        description: "使用率などの実データが揃い次第、公開予定です"
    },
    {
        id: "video-popularity",
        title: "人気動画ランキング",
        icon: "ti-player-play",
        dataSource: "comingSoon",
        description: "再生数などの実データが揃い次第、公開予定です"
    },
    {
        id: "diagnosis-type",
        title: "人気診断タイプランキング",
        icon: "ti-chart-bar",
        dataSource: "comingSoon",
        description: "診断結果の集計機能が実装され次第、公開予定です"
    }
];
