"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { personalOwnerFromAuth, type PersonalOwner } from "@/lib/personalization-storage";

type OwnerState =
  | { status: "loading" | "error" }
  | { status: "ready"; owner: PersonalOwner; version: number };

/** Any auth event invalidates owner-bound UI before a new identity is accepted. */
export function usePersonalizationOwner() {
  const generation = useRef(0);
  const [state, setState] = useState<OwnerState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const client = getSupabaseBrowserClient();
      const refresh = () => {
        const version = ++generation.current;
        setState({ status: "loading" });
        void client.auth.getUser().then(({ data, error }: { data: { user: { id: string } | null }; error: { name?: string } | null }) => {
          if (!active || version !== generation.current) return;
          const owner = personalOwnerFromAuth(data.user?.id ?? null, error);
          setState(owner ? { status: "ready", owner, version } : { status: "error" });
        }).catch(() => {
          if (active && version === generation.current) setState({ status: "error" });
        });
      };
      const listener = client.auth.onAuthStateChange(() => {
        ++generation.current;
        setState({ status: "loading" });
        if (timer) clearTimeout(timer);
        // Avoid awaiting a Supabase Auth call inside onAuthStateChange.
        timer = setTimeout(() => { if (active) refresh(); }, 0);
      });
      subscription = listener.data.subscription;
      refresh();
    } catch {
      const version = ++generation.current;
      queueMicrotask(() => {
        if (active && version === generation.current) {
          setState({ status: "error" });
        }
      });
    }
    const generationRef = generation;
    return () => {
      active = false;
      ++generationRef.current;
      if (timer) clearTimeout(timer);
      subscription?.unsubscribe();
    };
  }, []);

  const isCurrent = useCallback(
    () => state.status === "ready" && state.version === generation.current,
    [state],
  );
  return { state, isCurrent };
}
