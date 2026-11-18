"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./strategy-card-scroll.module.css";

export function StrategyCardScroll({ label, count, children }: { label: string; count: number; children: ReactNode }) {
  const id = useId();
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const start = el.scrollLeft <= 2;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      setEdges(old => old.start === start && old.end === end ? old : { start, end });
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    Array.from(el.children).forEach(child => observer.observe(child));
    el.addEventListener("scroll", update, { passive: true });
    const frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); el.removeEventListener("scroll", update); };
  }, [count, children]);
  const move = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const gap = first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth;
    el.scrollBy({ left: dir * Math.max(1, gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <div className={styles.wrapper}>
    <div className={styles.toolbar}><span>{count}件 · 横スクロール</span><div className={styles.buttons}>
      <button type="button" aria-controls={id} aria-label={`${label}の前のカード`} disabled={edges.start} onClick={() => move(-1)}>‹</button>
      <button type="button" aria-controls={id} aria-label={`${label}の次のカード`} disabled={edges.end} onClick={() => move(1)}>›</button>
    </div></div>
    <div ref={track} id={id} role="region" aria-label={`${label}カード一覧`} tabIndex={0} className={styles.track}>{children}</div>
  </div>;
}
