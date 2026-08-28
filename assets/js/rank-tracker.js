document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "sf6dna_rank_history";

    const rankForm = document.getElementById("rankForm");
    const rankDateInput = document.getElementById("rankDate");
    const rankCharacterSelect = document.getElementById("rankCharacterSelect");
    const rankChartArea = document.getElementById("rankChartArea");
    const rankHistoryArea = document.getElementById("rankHistoryArea");
    const clearRankButton = document.getElementById("clearRankButton");

    // 日付の初期値を今日にする
    rankDateInput.value = new Date().toISOString().slice(0, 10);

    // 使用キャラのプルダウンをcharacterData(全30キャラ)から生成する
    if (typeof characterData !== "undefined") {
        Object.values(characterData).forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.textContent = c.name;
            rankCharacterSelect.appendChild(option);
        });
    }

    function loadHistory() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    function saveHistory(history) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    let history = loadHistory();

    // ===== カレンダーウィジェット =====
    const rankCalendarToggle = document.getElementById("rankCalendarToggle");
    const rankCalendar = document.getElementById("rankCalendar");
    const calendarGrid = document.getElementById("calendarGrid");
    const calendarMonthLabel = document.getElementById("calendarMonthLabel");
    const calendarPrevMonth = document.getElementById("calendarPrevMonth");
    const calendarNextMonth = document.getElementById("calendarNextMonth");

    let calendarViewDate = new Date(); // 現在表示している月(1日固定で扱う)
    calendarViewDate.setDate(1);

    rankCalendarToggle.addEventListener("click", () => {
        const isVisible = rankCalendar.style.display !== "none";
        rankCalendar.style.display = isVisible ? "none" : "block";
        if (!isVisible) renderCalendar();
    });

    calendarPrevMonth.addEventListener("click", () => {
        calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
        renderCalendar();
    });

    calendarNextMonth.addEventListener("click", () => {
        calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
        renderCalendar();
    });

    function formatDate(y, m, d) {
        return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }

    function renderCalendar() {

        const y = calendarViewDate.getFullYear();
        const m = calendarViewDate.getMonth();

        calendarMonthLabel.textContent = `${y}年${m + 1}月`;

        const firstDay = new Date(y, m, 1);
        const startWeekday = firstDay.getDay(); // 0=日曜
        const daysInMonth = new Date(y, m + 1, 0).getDate();

        const recordedDates = new Set(history.map(e => e.date));

        const eventsByDate = {};
        if (typeof sf6CalendarEvents !== "undefined") {
            sf6CalendarEvents.forEach(ev => {
                eventsByDate[ev.date] = eventsByDate[ev.date] || [];
                eventsByDate[ev.date].push(ev);
            });
        }

        let html = "";

        const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];
        weekdayLabels.forEach(w => {
            html += `<div class="calendar-weekday">${w}</div>`;
        });

        for (let i = 0; i < startWeekday; i++) {
            html += `<div class="calendar-cell calendar-cell-empty"></div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {

            const dateStr = formatDate(y, m, d);
            const events = eventsByDate[dateStr] || [];
            const hasAct = events.some(e => e.type === "act");
            const hasUpdate = events.some(e => e.type === "update");
            const hasRecord = recordedDates.has(dateStr);

            const titleParts = events.map(e => e.label);
            const title = titleParts.length > 0 ? titleParts.join(" / ") : "";

            html += `
                <button type="button"
                    class="calendar-cell ${hasAct ? "calendar-cell-act" : ""} ${hasUpdate ? "calendar-cell-update" : ""}"
                    data-date="${dateStr}"
                    title="${title}"
                >
                    <span>${d}</span>
                    ${hasRecord ? '<i class="dot dot-record"></i>' : ""}
                </button>
            `;

        }

        calendarGrid.innerHTML = html;

        calendarGrid.querySelectorAll(".calendar-cell[data-date]").forEach(cell => {
            cell.addEventListener("click", () => {
                rankDateInput.value = cell.dataset.date;
                rankCalendar.style.display = "none";
            });
        });

    }

    // ===== フォーム送信 =====
    rankForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const formData = new FormData(rankForm);

        const entry = {
            id: `r_${Date.now()}`,
            date: formData.get("date"),
            mr: Number(formData.get("mr")),
            lp: formData.get("lp") ? Number(formData.get("lp")) : null,
            character: formData.get("character") || "",
            note: formData.get("note") || ""
        };

        history.push(entry);

        // 日付順に並び替えておく
        history.sort((a, b) => a.date.localeCompare(b.date));

        saveHistory(history);
        render();

        // MR以外の入力欄だけリセット(日付は今日のまま維持)
        rankForm.querySelector('[name="mr"]').value = "";
        rankForm.querySelector('[name="lp"]').value = "";
        rankForm.querySelector('[name="note"]').value = "";

    });

    // ===== 全削除 =====
    clearRankButton.addEventListener("click", () => {

        const ok = confirm("記録を全て削除しますか？この操作は取り消せません。");
        if (!ok) return;

        history = [];
        saveHistory(history);
        render();

    });

    // ===== 個別削除 =====
    function deleteEntry(id) {
        history = history.filter(e => e.id !== id);
        saveHistory(history);
        render();
    }

    // ===== キャラクター別フィルタ =====
    let currentCharacterFilter = "all"; // "all" または キャラID

    function getFilteredHistory() {
        if (currentCharacterFilter === "all") return history;
        return history.filter(e => e.character === currentCharacterFilter);
    }

    // 実際に記録に使われているキャラのみをボタンとして出す
    function renderCharacterFilterButtons() {

        const usedCharIds = [...new Set(
            history.filter(e => e.character).map(e => e.character)
        )];

        if (usedCharIds.length === 0) {
            return "";
        }

        const allButton = `
            <button type="button" class="rank-char-filter-btn ${currentCharacterFilter === "all" ? "active" : ""}" data-char="all">
                全キャラ
            </button>
        `;

        const charButtons = usedCharIds.map(cid => {
            const name = typeof characterData !== "undefined" && characterData[cid]
                ? characterData[cid].name
                : cid;
            return `
                <button type="button" class="rank-char-filter-btn ${currentCharacterFilter === cid ? "active" : ""}" data-char="${cid}">
                    ${name}
                </button>
            `;
        }).join("");

        return `<div class="rank-char-filter-row">${allButton}${charButtons}</div>`;

    }

    function bindCharacterFilterButtons(container) {
        container.querySelectorAll(".rank-char-filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                currentCharacterFilter = btn.dataset.char;
                render();
            });
        });
    }

    // ===== SVGでシンプルな折れ線グラフを描画する(外部ライブラリ不使用) =====
    function renderChart() {

        const filterButtonsHtml = renderCharacterFilterButtons();
        const filtered = getFilteredHistory();

        if (history.length === 0) {
            rankChartArea.innerHTML = `<p class="rank-empty">まだ記録がありません。上のフォームから記録を追加してください。</p>`;
            return;
        }

        if (filtered.length === 0) {
            rankChartArea.innerHTML = filterButtonsHtml + `<p class="rank-empty">このキャラクターの記録はまだありません。</p>`;
            bindCharacterFilterButtons(rankChartArea);
            return;
        }

        if (filtered.length === 1) {
            rankChartArea.innerHTML = filterButtonsHtml + `<p class="rank-empty">グラフの表示には2件以上の記録が必要です。もう1件追加してみましょう。</p>`;
            bindCharacterFilterButtons(rankChartArea);
            return;
        }

        const width = 800;
        const height = 300;
        const padding = 40;

        const mrValues = filtered.map(e => e.mr);
        const minMr = Math.min(...mrValues);
        const maxMr = Math.max(...mrValues);
        const range = maxMr - minMr || 1;

        const points = filtered.map((entry, i) => {
            const x = padding + (i / (filtered.length - 1)) * (width - padding * 2);
            const y = height - padding - ((entry.mr - minMr) / range) * (height - padding * 2);
            return { x, y, entry };
        });

        const pathD = points.map((p, i) => (i === 0 ? "M" : "L") + `${p.x},${p.y}`).join(" ");

        const dots = points.map(p => `
            <circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--primary, #ff6b00)" stroke="#0d1117" stroke-width="2">
                <title>${p.entry.date}: MR ${p.entry.mr}</title>
            </circle>
        `).join("");

        const labels = points.map((p, i) => {
            // ラベルが混み合わないよう、件数が多い場合は間引く
            const step = Math.ceil(filtered.length / 8);
            if (i % step !== 0 && i !== points.length - 1) return "";
            return `<text x="${p.x}" y="${height - 10}" font-size="11" fill="#9aa1ad" text-anchor="middle">${p.entry.date.slice(5)}</text>`;
        }).join("");

        rankChartArea.innerHTML = filterButtonsHtml + `
            <svg viewBox="0 0 ${width} ${height}" class="rank-chart-svg">
                <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#303847" />
                <path d="${pathD}" fill="none" stroke="var(--primary, #ff6b00)" stroke-width="3" />
                ${dots}
                ${labels}
                <text x="${padding}" y="20" font-size="12" fill="#9aa1ad">最高: ${maxMr}</text>
                <text x="${width - padding}" y="20" font-size="12" fill="#9aa1ad" text-anchor="end">最新: ${filtered[filtered.length - 1].mr}</text>
            </svg>
        `;

        bindCharacterFilterButtons(rankChartArea);

    }

    // ===== 記録一覧の描画 =====
    function renderHistoryList() {

        const filtered = getFilteredHistory();

        if (filtered.length === 0) {
            rankHistoryArea.innerHTML = `<p class="rank-empty">記録はまだありません。</p>`;
            return;
        }

        // 新しい記録が上に来るよう逆順で表示
        const sorted = [...filtered].reverse();

        rankHistoryArea.innerHTML = sorted.map((entry, index) => {

            const prevEntry = sorted[index + 1]; // 1つ古い記録(表示上の直前)
            let diffHtml = "";

            if (prevEntry) {
                const diff = entry.mr - prevEntry.mr;
                const diffClass = diff > 0 ? "rank-diff-up" : diff < 0 ? "rank-diff-down" : "rank-diff-flat";
                const diffText = diff > 0 ? `+${diff}` : diff === 0 ? "±0" : `${diff}`;
                diffHtml = `<span class="rank-diff ${diffClass}">${diffText}</span>`;
            }

            const charName = entry.character && typeof characterData !== "undefined" && characterData[entry.character]
                ? characterData[entry.character].name
                : "";

            return `
                <div class="rank-history-item">

                    <div class="rank-history-main">
                        <span class="rank-history-date">${entry.date}</span>
                        <span class="rank-history-mr">MR ${entry.mr}</span>
                        ${diffHtml}
                    </div>

                    <div class="rank-history-sub">
                        ${entry.lp !== null ? `<span>LP ${entry.lp}</span>` : ""}
                        ${charName ? `<button type="button" class="rank-history-char-link" data-char="${entry.character}">${charName}</button>` : ""}
                        ${entry.note ? `<span class="rank-history-note">${entry.note}</span>` : ""}
                    </div>

                    <button class="rank-delete-button" data-id="${entry.id}" aria-label="この記録を削除">✕</button>

                </div>
            `;

        }).join("");

        rankHistoryArea.querySelectorAll(".rank-delete-button").forEach(btn => {
            btn.addEventListener("click", () => deleteEntry(btn.dataset.id));
        });

        // 記録一覧のキャラ名をクリックすると、そのキャラでグラフを絞り込む
        rankHistoryArea.querySelectorAll(".rank-history-char-link").forEach(btn => {
            btn.addEventListener("click", () => {
                currentCharacterFilter = btn.dataset.char;
                render();
                rankChartArea.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        });

    }

    function render() {
        renderChart();
        renderHistoryList();
    }

    render();

});
