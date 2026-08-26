"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage("ログインできませんでした。メールアドレスとパスワードを確認してください。");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  async function signup() {
    setLoading(true);
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMessage(error ? "アカウントを作成できませんでした。" : "登録処理を受け付けました。確認メールが必要な場合はメールを確認してください。");
  }

  return (
    <div className="auth-form">
      <label>
        <span>メールアドレス</span>
        <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        <span>パスワード</span>
        <input type="password" minLength={8} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <div className="diagnosis-actions">
        <button className="button-primary" type="button" disabled={loading || !email || password.length < 8} onClick={login}>ログイン</button>
        <button className="button-secondary" type="button" disabled={loading || !email || password.length < 8} onClick={signup}>新規登録</button>
      </div>
      {message ? <p className="muted">{message}</p> : null}
    </div>
  );
}
