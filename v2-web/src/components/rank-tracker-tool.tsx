"use client";

import { useEffect, useMemo, useState } from "react";
import type { CharacterSummary } from "@/types/character";
import { deleteRankRecord, getRankHistory, saveRankRecord, type RankRecord } from "@/lib/local-user-tools";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function RankTrackerTool({ characters }: { characters: CharacterSummary[] }) {
  const [records, setRecords] = useState<RankRecord[]>([]);
  const [date, setDate] = useState(today());
  const [characterSlug, setCharacterSlug] = useState(characters[0]?.slug ?? "");
  const [metric, setMetric] = useState<"MR" | "LP">("MR");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRecords(getRankHistory()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selected = characters.find((character) => character.slug === characterSlug) ?? null;
  const filtered = useMemo(
    () => records.filter((record) => record.characterSlug === characterSlug && record.metric === metric),
    [records, characterSlug, metric]
  );

  const latest = filtered.at(-1);
  const first = filtered[0];
  const delta = latest && first ? latest.value - first.value : null;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numeric = Number(value);
    if (!selected || !date || !Number.isFinite(numeric) || numeric < 0) return;

    const record: RankRecord = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      date,
      characterSlug: selected.slug,
      characterName: selected.name,
      metric,
      value: Math.round(numeric),
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    saveRankRecord(record);
    setRecords(getRankHistory());
    setValue("");
    setNote("");
  }

  function remove(id: string) {
    deleteRankRecord(id);
    setRecords(getRankHistory());
  }

  return (
    <div className="page-stack">
      <form className="tool-form" onSubmit={submit}>
        <label className="compact-field"><span>日付</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
        <label className="compact-field"><span>キャラクター</span><select value={characterSlug} onChange={(e) => setCharacterSlug(e.target.value)}>{characters.map((character) => <option key={character.id} value={character.slug}>{character.name}</option>)}</select></label>
        <label className="compact-field"><span>指標</span><select value={metric} onChange={(e) => setMetric(e.target.value as "MR" | "LP")}><option value="MR">MR</option><option value="LP">LP</option></select></label>
        <label className="compact-field"><span>数値</span><input type="number" min="0" step="1" value={value} onChange={(e) => setValue(e.target.value)} required /></label>
        <label className="compact-field tool-form__wide"><span>メモ</span><input type="text" maxLength={120} value={note} onChange={(e) => setNote(e.target.value)} placeholder="対戦内容やActなど" /></label>
        <button className="primary-button" type="submit">記録する</button>
      </form>

      <section className="tool-summary-grid">
        <article className="info-panel"><p className="eyebrow">LATEST</p><h2>{latest ? `${latest.value} ${metric}` : "記録なし"}</h2></article>
        <article className="info-panel"><p className="eyebrow">CHANGE</p><h2>{delta === null ? "-" : `${delta >= 0 ? "+" : ""}${delta}`}</h2></article>
        <article className="info-panel"><p className="eyebrow">RECORDS</p><h2>{filtered.length}</h2></article>
      </section>

      <section>
        <div className="section-heading"><h2>履歴</h2><p>{selected?.name ?? "キャラクター"} / {metric}</p></div>
        {filtered.length ? (
          <div className="table-wrap"><table className="compare-table"><thead><tr><th>日付</th><th>{metric}</th><th>メモ</th><th>操作</th></tr></thead><tbody>{[...filtered].reverse().map((record) => <tr key={record.id}><td>{record.date}</td><td>{record.value}</td><td>{record.note || "-"}</td><td><button className="text-button" type="button" onClick={() => remove(record.id)}>削除</button></td></tr>)}</tbody></table></div>
        ) : <div className="empty-state"><p>この条件の記録はまだありません。</p></div>}
      </section>
    </div>
  );
}
