"use client";

import { useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const pending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function logout() {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await getSupabaseBrowserClient().auth.signOut({ scope: "local" });
      if (error) {
        setMessage("ログアウトできませんでした。時間をおいて、もう一度お試しください。");
        return;
      }
      // Clear the in-memory router cache and any previously rendered account data.
      window.location.replace("/auth");
    } catch {
      setMessage("ログアウトできませんでした。接続を確認して、もう一度お試しください。");
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <p className="muted">別のアカウントを使う場合は、いったんログアウトしてください。</p>
      <button className="button-secondary" type="button" disabled={loading} onClick={logout}>
        {loading ? "ログアウト中…" : "ログアウト"}
      </button>
      {message ? <p role="status" aria-live="polite">{message}</p> : null}
    </div>
  );
}
