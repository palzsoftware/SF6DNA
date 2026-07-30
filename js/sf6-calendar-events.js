// ===========================
// スト6 Act切り替え日・アップデート日データ
// ランク管理のカレンダー表示に使用する。
// 公式サイト(Buckler's Boot Camp)・SF6 Wikiの情報をもとに作成。
// Actは2023年11月のAct2以降、3ヶ月周期で切り替わっている。
// ===========================

const sf6CalendarEvents = [

    // ----- Act切り替え日(MRリセット) -----
    { date: "2023-06-02", type: "act", label: "Act1 開始（正式サービス開始）" },
    { date: "2023-11-01", type: "act", label: "Act2 開始" },
    { date: "2024-02-01", type: "act", label: "Act3 開始" },
    { date: "2024-05-01", type: "act", label: "Act4 開始" },
    { date: "2024-08-01", type: "act", label: "Act5 開始" },
    { date: "2024-11-01", type: "act", label: "Act6 開始" },
    { date: "2025-02-01", type: "act", label: "Act7 開始" },
    { date: "2025-05-01", type: "act", label: "Act8 開始" },
    { date: "2025-08-01", type: "act", label: "Act9 開始" },
    { date: "2025-11-01", type: "act", label: "Act10 開始" },
    { date: "2026-02-01", type: "act", label: "Act11 開始" },
    { date: "2026-05-01", type: "act", label: "Act12 開始" },
    { date: "2026-08-01", type: "act", label: "Act13 開始" },

    // ----- バランス調整・キャラクター追加などのアップデート日 -----
    { date: "2023-07-24", type: "update", label: "ラシード参戦" },
    { date: "2023-08-08", type: "update", label: "バランス調整" },
    { date: "2023-09-27", type: "update", label: "A.K.I.参戦" },
    { date: "2023-12-01", type: "update", label: "バランス調整" },
    { date: "2024-02-27", type: "update", label: "エド参戦" },
    { date: "2024-05-22", type: "update", label: "豪鬼参戦" },
    { date: "2024-06-26", type: "update", label: "M.ベガ参戦" },
    { date: "2024-09-24", type: "update", label: "テリー参戦" },
    { date: "2024-12-02", type: "update", label: "バランス調整" },
    { date: "2025-02-05", type: "update", label: "舞参戦" },
    { date: "2025-06-05", type: "update", label: "エレナ参戦・Switch2版発売" },
    { date: "2025-08-05", type: "update", label: "サガット参戦" },
    { date: "2025-10-15", type: "update", label: "C.ヴァイパー参戦" },
    { date: "2026-05-28", type: "update", label: "バランス調整" },

];
