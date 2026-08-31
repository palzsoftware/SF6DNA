import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./tools.css";
import "./visual-refresh.css";
import "./image-performance.css";
import "./ux-refresh.css";
import "./product-refresh.css";
import "./character-overview-refresh.css";
import "./mobile-refresh.css";

function getMetadataBase() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();
  const candidate = explicit || (vercelUrl ? `https://${vercelUrl}` : null);
  if (!candidate) return undefined;

  try {
    return new URL(candidate);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "SF6DNA",
    template: "%s | SF6DNA",
  },
  description:
    "Street Fighter 6の診断・キャラクター情報・プレイヤー情報・AIコーチングを統合する総合プラットフォーム。",
  openGraph: {
    type: "website",
    siteName: "SF6DNA",
    title: "SF6DNA",
    description:
      "Street Fighter 6の診断・キャラクター情報・プレイヤー情報・AIコーチングを統合する総合プラットフォーム。",
  },
  twitter: {
    card: "summary_large_image",
    title: "SF6DNA",
    description:
      "Street Fighter 6の診断・キャラクター情報・プレイヤー情報・AIコーチングを統合する総合プラットフォーム。",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <a className="skip-link" href="#main-content">本文へ移動</a>
        <header className="site-header">
          <div className="site-shell site-header__inner">
            <Link className="site-brand" href="/">SF6DNA</Link>
            <nav className="site-nav" aria-label="主要ナビゲーション">
              <Link href="/characters">キャラクター</Link>
              <Link href="/counters">対策</Link>
              <Link href="/training">練習</Link>
              <Link href="/search">検索</Link>
              <Link href="/diagnosis">診断</Link>
              <Link href="/coach">AIコーチ</Link>
              <Link href="/tools">マイ機能</Link>
            </nav>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
        <footer className="site-footer">
          <div className="site-shell site-footer__inner">
            <p>SF6DNA</p>
            <nav aria-label="補助ナビゲーション">
              <Link href="/players">プレイヤー</Link>
              <Link href="/videos">動画</Link>
              <Link href="/about">About</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/sources">情報源</Link>
              <Link href="/changelog">更新履歴</Link>
            </nav>
          </div>
        </footer>
        <nav className="mobile-dock" aria-label="スマートフォン用クイックナビゲーション">
          <Link href="/characters">キャラ</Link>
          <Link href="/counters">対策</Link>
          <Link href="/training">練習</Link>
          <Link href="/search">検索</Link>
        </nav>
      </body>
    </html>
  );
}
