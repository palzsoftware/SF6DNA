"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePersonalizationOwner } from "@/lib/use-personalization-owner";
import { PREVIEW_VIDEO_PREFERENCE_CHANGED, previewVideoPreferenceKey, readPreviewVideoPreferences, togglePreviewVideoPreference } from "@/lib/preview-video-preferences";
import {
  ownedVideoPreferenceKey, readOwnedVideoPreferences, toggleOwnedVideoPreference,
  videoOwnerScopeIsCurrent, VIDEO_PREFERENCE_CHANGED,
  type OwnedVideoPreferenceRead, type VideoOwnerScope, type VideoPreferenceKind,
} from "@/lib/owned-video-preferences";

type Snapshot = { owner: VideoOwnerScope["owner"]; version: number; value: OwnedVideoPreferenceRead };
const EMPTY: ReadonlySet<string> = new Set();

export function useOwnedVideoPreferences(previewLocalOnly = false) {
  const { state, isCurrent } = usePersonalizationOwner(previewLocalOnly);
  const scope = useMemo<VideoOwnerScope | null>(() => state.status === "ready"
    ? { owner: state.owner, version: state.version, isCurrent } : null, [state, isCurrent]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [notice, setNotice] = useState<{ owner: VideoOwnerScope["owner"]; version: number; text: string } | null>(null);

  const refresh = useCallback(() => {
    if (!videoOwnerScopeIsCurrent(scope)) return;
    const value = previewLocalOnly ? readPreviewVideoPreferences() : readOwnedVideoPreferences(scope);
    if (videoOwnerScopeIsCurrent(scope)) setSnapshot({ owner: scope.owner, version: scope.version, value });
  }, [scope, previewLocalOnly]);

  useEffect(() => {
    if (!scope) return;
    const frame = window.requestAnimationFrame(refresh);
    const changed = () => refresh();
    const stored = (event: StorageEvent) => {
      if (event.key === null || event.key === (previewLocalOnly ? previewVideoPreferenceKey("favorite") : ownedVideoPreferenceKey(scope.owner, "favorite")) ||
          event.key === (previewLocalOnly ? previewVideoPreferenceKey("watched") : ownedVideoPreferenceKey(scope.owner, "watched"))) refresh();
    };
    window.addEventListener(previewLocalOnly ? PREVIEW_VIDEO_PREFERENCE_CHANGED : VIDEO_PREFERENCE_CHANGED, changed);
    window.addEventListener("storage", stored);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(previewLocalOnly ? PREVIEW_VIDEO_PREFERENCE_CHANGED : VIDEO_PREFERENCE_CHANGED, changed);
      window.removeEventListener("storage", stored);
    };
  }, [scope, refresh, previewLocalOnly]);

  // Mask on render; do not wait for effect cleanup to hide the previous Owner.
  const matching = videoOwnerScopeIsCurrent(scope) && snapshot?.owner === scope.owner && snapshot.version === scope.version;
  const status = state.status === "error" ? "error" : !matching ? "loading" : snapshot.value.ok ? "ready" : "error";
  const value = matching && snapshot.value.ok ? snapshot.value : null;
  const favorites: ReadonlySet<string> = value?.favorites ?? EMPTY;
  const watched: ReadonlySet<string> = value?.watched ?? EMPTY;

  const toggle = useCallback((kind: VideoPreferenceKind, videoId: string): boolean => {
    if (status !== "ready" || !videoOwnerScopeIsCurrent(scope)) return false;
    const result = previewLocalOnly ? togglePreviewVideoPreference(kind, videoId) : toggleOwnedVideoPreference(scope, kind, videoId);
    if (!videoOwnerScopeIsCurrent(scope)) return false;
    refresh();
    setNotice({ owner: scope.owner, version: scope.version, text: result.ok ? "" : "動画の保存に失敗しました。時間をおいて再度お試しください。" });
    return result.ok;
  }, [scope, status, refresh, previewLocalOnly]);

  const savedNotice = scope && notice?.owner === scope.owner && notice.version === scope.version ? notice.text : "";
  const message = status === "loading" ? "動画の保存設定を確認しています。"
    : status === "error" ? "動画の保存設定を確認できません。ページを開き直してください。" : savedNotice;
  return { status, favorites, watched, refresh, toggle, message };
}
