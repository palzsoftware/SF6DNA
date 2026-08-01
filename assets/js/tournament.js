// ==========================================
// 大会情報ページのロジック
// ==========================================
// tournament-data.js を読み込んで一覧表示する。
// 実データが用意され次第、このファイルの表示ロジックは変更せずに
// tournament-data.js の中身を更新するだけで反映される設計。
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const area = document.getElementById("tournamentArea");
    if (!area || typeof tournamentData === "undefined") return;

    if (tournamentData.length === 0) {
        area.innerHTML = `<p class="tournament-empty">現在、大会情報はありません</p>`;
        return;
    }

    area.innerHTML = tournamentData.map(t => `
        <div class="tournament-card">

            <div class="tournament-card-header">
                <p class="tournament-name">${t.name}</p>
                ${t.status ? `<span class="tournament-status tournament-status-${statusClass(t.status)}">${t.status}</span>` : ""}
            </div>

            <div class="tournament-meta">
                <span><i class="ti ti-calendar" aria-hidden="true"></i>${t.date}</span>
                ${t.region ? `<span><i class="ti ti-map-pin" aria-hidden="true"></i>${t.region}</span>` : ""}
                ${t.game ? `<span><i class="ti ti-device-gamepad-2" aria-hidden="true"></i>${t.game}</span>` : ""}
                ${t.participants ? `<span><i class="ti ti-users" aria-hidden="true"></i>${t.participants}人</span>` : ""}
                ${t.prize ? `<span><i class="ti ti-coin" aria-hidden="true"></i>${t.prize}</span>` : ""}
            </div>

            ${t.note ? `<p class="tournament-note">${t.note}</p>` : ""}

            <div class="tournament-links">
                ${t.officialUrl ? `<a href="${t.officialUrl}" target="_blank" rel="noopener" class="tournament-link">公式サイト <i class="ti ti-external-link" aria-hidden="true"></i></a>` : ""}
                ${t.streamUrl ? `<a href="${t.streamUrl}" target="_blank" rel="noopener" class="tournament-link">配信を見る <i class="ti ti-player-play" aria-hidden="true"></i></a>` : ""}
            </div>

        </div>
    `).join("");

});

function statusClass(status) {
    if (status === "開催中") return "live";
    if (status === "開催予定") return "upcoming";
    if (status === "終了") return "ended";
    return "unknown";
}
