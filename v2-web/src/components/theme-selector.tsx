"use client";

import { useSyncExternalStore } from "react";

type ColorMode = "system" | "light" | "dark";
const storageKey = "sf6dna-color-mode";

function currentMode(): ColorMode {
  const mode = document.documentElement.dataset.colorMode;
  return mode === "system" || mode === "light" ? mode : "dark";
}

function applyMode(mode: ColorMode) {
  const light = mode === "system" ? window.matchMedia("(prefers-color-scheme: light)").matches : mode === "light";
  document.documentElement.dataset.theme = light ? "light" : "dark";
  document.documentElement.dataset.colorMode = mode;
}

function subscribe(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const update = () => { if (currentMode() === "system") applyMode("system"); };
  media.addEventListener("change", update);
  window.addEventListener("sf6dna-theme-change", notify);
  return () => {
    media.removeEventListener("change", update);
    window.removeEventListener("sf6dna-theme-change", notify);
  };
}

const serverMode = (): ColorMode => "dark";

export function ThemeSelector() {
  const mode = useSyncExternalStore(subscribe, currentMode, serverMode);

  function choose(next: ColorMode) {
    applyMode(next);
    window.dispatchEvent(new Event("sf6dna-theme-change"));
    try { localStorage.setItem(storageKey, next); } catch { /* Mode still works for this page. */ }
  }

  return (
    <fieldset className="theme-selector" aria-label="表示モード">
      <legend>表示</legend>
      {([ ["system", "端末設定"], ["light", "ライト"], ["dark", "ダーク"] ] as const).map(([value, label]) => (
        <label key={value} className="theme-selector__option">
          <input type="radio" name="color-mode" value={value} checked={mode === value} onChange={() => choose(value)} />
          <span>{label}</span>
        </label>
      ))}
    </fieldset>
  );
}
