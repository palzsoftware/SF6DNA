"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_CATEGORIES, validateContactPayload } from "@/lib/contact-form";

export function ContactForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [category, setCategory] = useState(CONTACT_CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [targetUrl, setTargetUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { category, message, email, targetUrl, website };
    const validation = validateContactPayload(payload);
    if (!validation.ok) {
      setStatus(validation.message);
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        setStatus(result.message ?? "送信できませんでした。入力内容を残したまま、もう一度お試しください。");
        return;
      }
      setMessage("");
      setTargetUrl("");
      setStatus("お問い合わせを受け付けました。入力内容はこの画面に再表示されません。");
    } catch {
      setStatus("送信できませんでした。入力内容を残したまま、通信環境を確認してもう一度お試しください。");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <label><span>お問い合わせの種類</span><select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>{CONTACT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>内容</span><textarea required minLength={10} maxLength={4000} rows={8} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="お問い合わせ内容を10文字以上で入力してください" /></label>
      <label><span>返信先メールアドレス</span><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label><span>対象ページのURL（任意）</span><input type="url" inputMode="url" value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} placeholder="https://..." /></label>
      <label className="contact-form__honeypot" aria-hidden="true"><span>ウェブサイト</span><input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <button className="button-primary inline-button" type="submit" disabled={sending}>{sending ? "送信中…" : "サイト内で送信"}</button>
      {status ? <p className="data-notice" role="status" aria-live="polite">{status}</p> : null}
    </form>
  );
}
