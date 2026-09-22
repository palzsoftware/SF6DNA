import { ContactForm } from "@/components/contact-form";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_MAILTO } from "@/lib/contact";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export const metadata = {
  title: "お問い合わせ",
  description: "SF6DNAへのお問い合わせについてご案内します。",
};

export default async function ContactPage() {
  let accountEmail = "";
  try {
    const supabase = await getSupabaseAuthServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error) accountEmail = data.user?.email ?? "";
  } catch {
    // The form remains available without an account email.
  }

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">CONTACT</p>
        <h1>お問い合わせ</h1>
        <p>不具合や掲載情報、権利・プライバシーに関するご連絡を受け付けています。</p>
      </section>

      <section className="info-panel">
        <h2>サイト内お問い合わせフォーム</h2>
        <p className="data-notice">サイト内送信は接続準備中です。入力内容は送信・保存されません。現在は下記メールアドレスをご利用ください。</p>
        <ContactForm defaultEmail={accountEmail} />
      </section>

      <section className="info-panel">
        <h2>メールで問い合わせる</h2>
        <p>サイト内送信の接続が完了するまでは、メールで受け付けています。</p>
        <a className="button-secondary inline-button" href={PUBLIC_CONTACT_MAILTO}>{PUBLIC_CONTACT_EMAIL}</a>
      </section>

      <section>
        <h2>不具合についてご連絡いただく場合</h2>
        <p>問題が起きたページのURL、使っていた端末・ブラウザ、直前に行った操作が分かると調査しやすくなります。</p>
      </section>
    </div>
  );
}
