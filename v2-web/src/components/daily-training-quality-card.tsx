"use client";

import { useEffect, useEffectEvent, useId, useMemo, useRef, useState } from "react";
import type { DailyTrainingItem } from "@/lib/daily-training";
import { getQualityGuide } from "../lib/daily-training-quality";
import { pauseTrainingTimer, remainingTrainingTime, resetTrainingTimer, startTrainingTimer, FIVE_MINUTES_MS } from "../lib/daily-training-timer";
import { DailyTrainingReferences } from "./daily-training-references";
import { createTrainingSound } from "../lib/daily-training-sound";
import styles from "./daily-training-quality-card.module.css";

type Props = {
  item: DailyTrainingItem;
  index: number;
  expanded: boolean;
  complete: boolean;
  enabled: boolean;
  onToggle: () => void;
  onComplete: () => void;
};

function Lines({ lines }: { lines: readonly string[] }) {
  if (lines.length === 0) return <p>この項目の説明は保存されていません。</p>;
  return <ul>{lines.map((line, i) => <li key={`${i}:${line}`}>{line}</li>)}</ul>;
}

// Local timing only: no persistence, owner lookup, diagnosis read, or completion callback.
export function DailyTrainingQualityCard({ item, index, expanded, complete, enabled, onToggle, onComplete }: Props) {
  const panelId = useId();
  const headingId = useId();
  const [timer, setTimer] = useState(resetTrainingTimer);
  const [sample, setSample] = useState(0);
  const [prepared, setPrepared] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundMessage, setSoundMessage] = useState("");
  const sound = useRef<ReturnType<typeof createTrainingSound> | null>(null);
  const audioRevision = useRef(0);
  const timeoutNotified = useRef(false);
  const guide = useMemo(() => getQualityGuide(item.detail), [item.detail]);
  const active = enabled && expanded && prepared && !complete;
  const remaining = remainingTrainingTime(timer, sample);
  const running = active && timer.runningSince !== null && remaining > 0;
  const elapsed = FIVE_MINUTES_MS - remaining;
  const seconds = Math.ceil(remaining / 1000);
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  function getSound() {
    return sound.current ??= createTrainingSound();
  }

  function cancelSound() {
    audioRevision.current += 1;
    sound.current?.cancel();
  }

  function playSound() {
    const revision = ++audioRevision.current;
    void getSound().play().then(ok => {
      if (revision === audioRevision.current) setSoundMessage(ok
        ? "音を再生しました。聞こえない場合は端末・ブラウザの音量を確認してください。"
        : "音を再生できませんでした。画面の残り時間で確認してください。試聴ボタンから再度試せます。");
    });
  }

  const notifyTimeout = useEffectEvent(() => {
    if (timeoutNotified.current) return;
    timeoutNotified.current = true;
    if (soundEnabled) playSound();
  });

  useEffect(() => () => {
    audioRevision.current += 1;
    sound.current?.dispose();
    sound.current = null;
  }, []);

  useEffect(() => {
    if (!active) {
      audioRevision.current += 1;
      sound.current?.cancel();
    }
  }, [active]);

  useEffect(() => {
    if (!active || timer.runningSince === null) return;
    const sampleTime = () => {
      const now = performance.now();
      setSample(now);
      if (remainingTrainingTime(timer, now) === 0) {
        notifyTimeout();
        setTimer(pauseTrainingTimer(timer, now));
      }
    };
    const interval = window.setInterval(sampleTime, 200);
    return () => {
      window.clearInterval(interval);
      const now = performance.now();
      setSample(now);
      setTimer(previous => previous.runningSince === null ? previous : pauseTrainingTimer(previous, now));
    };
  }, [active, timer]);

  function toggleTimer() {
    if (!active) return;
    cancelSound();
    if (timer.runningSince === null && soundEnabled) {
      const revision = audioRevision.current;
      // Called directly from the start/resume click to unlock browser audio.
      void getSound().prepare().then(ok => {
        if (revision === audioRevision.current) setSoundMessage(ok ? "終了音が有効です。" : "音を有効にできませんでした。試聴ボタンで確認してください。");
      });
    }
    const now = performance.now();
    setSample(now);
    setTimer(previous => previous.runningSince === null ? startTrainingTimer(previous, now) : pauseTrainingTimer(previous, now));
  }

  const status = complete ? "完了に設定（保存状態は画面上部の案内をご確認ください）" : remaining === 0 ? "5分の目安に達しました。目標未達でも終了できます。" : running ? "計測中" : remaining < FIVE_MINUTES_MS ? "一時停止中" : "計測前";
  return <article className={styles.card} aria-labelledby={headingId}>
    <button className={styles.header} type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => { cancelSound(); onToggle(); }}>
      <span className={styles.number}>{index + 1}</span>
      <span><span className={styles.meta}>{complete ? "完了" : expanded ? "内容を表示中" : "内容を確認"}・5分</span><strong id={headingId}>{item.title}</strong></span>
      <span aria-hidden="true">{expanded ? "−" : "＋"}</span>
    </button>
    <div id={panelId} hidden={!expanded} className={styles.body}>
      {expanded ? <>
        <div className={styles.taskLead}><section><h3>今日やること</h3><p className={styles.action}>{guide?.action ?? item.title}</p></section>
          <p>準備を済ませて計測を開始し、下の手順を一つずつ試しましょう。</p></div>
        <section className={styles.timer} aria-label={`${item.title}の5分タイマー`}>
          <div className={styles.timerMain}>
            <div className={styles.timerDisplay}>
              <svg className={styles.ring} viewBox="0 0 100 100" role="progressbar" aria-label="計測時間の進捗" aria-valuemin={0} aria-valuemax={300} aria-valuenow={Math.floor(elapsed / 1000)} aria-valuetext={`${Math.floor(elapsed / 1000)}秒 / 300秒`}>
                <circle className={styles.track} cx="50" cy="50" r="42" />
                <circle className={styles.fill} cx="50" cy="50" r="42" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - elapsed / FIVE_MINUTES_MS)} />
              </svg>
              <span className={styles.clock} role="timer" aria-label={`残り${time}`}>{time}</span>
            </div>
            <div className={styles.timerActions}>
              <label className={styles.ready}><input type="checkbox" checked={prepared} disabled={!enabled || complete} onChange={event => setPrepared(event.target.checked)} />準備できました（初回設定は5分に含めません）</label>
              <p role="status">{status}</p>
              <div className={styles.controls}>
                <button type="button" disabled={!active || remaining === 0} onClick={toggleTimer}>{remaining === 0 ? "計測終了" : running ? "一時停止" : remaining < FIVE_MINUTES_MS ? "再開" : "5分の計測を開始"}</button>
                <button type="button" disabled={!enabled} onClick={() => { cancelSound(); timeoutNotified.current = false; setSoundMessage(""); setSample(performance.now()); setTimer(resetTrainingTimer()); }}>タイマーをリセット</button>
              </div>
            </div>
          </div>
          <div className={styles.soundControls}>
            <label className={styles.ready}><input type="checkbox" checked={soundEnabled} disabled={!enabled || complete} onChange={event => {
              cancelSound();
              const checked = event.target.checked;
              setSoundEnabled(checked);
              setSoundMessage(checked ? "試聴で音量を確認できます。" : "終了音をOFFにしました。");
              if (checked) {
                const revision = audioRevision.current;
                void getSound().prepare().then(ok => { if (!ok && revision === audioRevision.current) setSoundMessage("音を有効にできませんでした。試聴ボタンで確認してください。"); });
              }
            }} />終了音を鳴らす</label>
            <button type="button" disabled={!enabled || complete || !soundEnabled} onClick={playSound}>音を試聴する</button>
          </div>
          <p className={styles.note} role="status">{soundMessage || "5分経過時に短い音でお知らせします。音量は端末側で調整してください。"}</p>
          <p className={styles.note}>計測はこの画面内だけです。閉じると一時停止し、再読込するとリセットされます。時間が経っても練習完了や目標達成は自動記録されません。画面ロックやブラウザの省電力動作中は、音の通知が遅れたり鳴らない場合があります。</p>
        </section>
        <div className={styles.practiceContent}>
        <section><h3>練習の目的</h3><p>{item.detail.why}</p></section>
        <section><h3>準備する内容</h3><Lines lines={item.detail.setup} /></section>
        {guide?.hold.length ? <p className={styles.caution}>条件確認が必要です。確認できない設定は使わず、単独の動作・入力の確認までで区切れます。</p> : null}
        <section><h3>5分間の練習手順</h3><ol className={styles.steps}>
          <li><strong>0〜1分</strong><Lines lines={item.detail.minute01} /></li>
          <li><strong>1〜3分</strong><Lines lines={item.detail.minute13} /></li>
          <li><strong>3〜5分</strong><Lines lines={item.detail.minute35} /></li>
        </ol></section>
        <section><h3>今回の目標</h3><Lines lines={item.detail.successCondition} />{item.detail.successCondition.length > 0 ? <p className={styles.note}>数値は練習用の仮目標です。準備済みの条件で難しければ単純な練習に戻してください。達成までの延長は不要です。</p> : null}</section>
        <section><h3>次の対戦で意識すること</h3><p className={styles.action}>{item.detail.matchFocus[0] ?? "この項目の説明は保存されていません。"}</p></section>
        <details><summary>詳しい設定・理由・つまずき・難易度調整</summary>
          <section><h3>詳しいトレモ設定方法</h3>{guide ? <Lines lines={guide.details} /> : <p>保存時点の説明を表示しています。現在のメニューへ自動置換しません。</p>}</section>
          <section><h3>この練習が必要な理由</h3><p>{guide?.reason ?? item.detail.why}</p></section>
          <section><h3>よくある失敗</h3><Lines lines={item.detail.commonFailure} /></section>
          <section><h3>失敗時の改善方法・難易度調整</h3><Lines lines={item.detail.adjustment} /></section>
          {guide?.hold.length ? <section><h3>設定を確認できていない範囲</h3><Lines lines={guide.hold} /></section> : null}
          <section><h3>補足・参考資料</h3><p>レコードは相手の動きを記録して再生する機能です。ボタン配置や設定の違いは、お使いの機種の案内で確認してください。</p><a href="https://game.capcom.com/manual/SF6/ja/switch2/page/8/6" target="_blank" rel="noopener noreferrer">CAPCOM公式：レコード設定（Switch 2版）</a></section>
        </details>
        <DailyTrainingReferences detail={item.detail} />
        </div>
        <p className={styles.note}>取り組みを終えたら、目標未達でも完了にできます。目標の達成状況は保存しません。完了・取消は既存の保存処理で扱います。</p>
        <button className={styles.complete} type="button" disabled={!enabled} onClick={() => { cancelSound(); setTimer(previous => pauseTrainingTimer(previous, performance.now())); onComplete(); }}>{complete ? "完了を取り消す" : "この練習を完了にする"}</button>
      </> : null}
    </div>
  </article>;
}
