import { notFound, redirect } from "next/navigation";
import { arjunPreviewQaEnabled, hasArjunQaSession } from "@/lib/arjun-preview-qa-auth";
export const dynamic = "force-dynamic";
export const metadata = { title: "アルジュン・QA認証 | SF6DNA", robots: { index: false, follow: false } };
export default async function ArjunQaLoginPage() {
  if (!arjunPreviewQaEnabled()) notFound();
  if (await hasArjunQaSession()) redirect("/arjun-research-preview");
  return <main className="site-shell" style={{maxWidth:560,paddingBlock:48}}>
    <h1>アルジュン・非公開QA</h1>
    <p>未承認候補の確認専用です。一般公開用の攻略データではありません。</p>
    <form method="post" action="/arjun-research-preview/access">
      <label htmlFor="arjunQaPassword">QA専用パスワード</label>
      <input id="arjunQaPassword" name="password" type="password" autoComplete="off" required minLength={24} maxLength={256} />
      <button type="submit">認証して確認する</button>
    </form>
  </main>;
}
