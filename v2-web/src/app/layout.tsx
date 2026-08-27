import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
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
              <Link href="/search">検索</Link>
              <Link href="/diagnosis">診断</Link>
              <Link href="/characters">キャラクター</Link>
              <Link href="/players">プレイヤー</Link>
              <Link href="/videos">動画</Link>
              <Link href="/training">トレーニング</Link>
              <Link href="/coach">AIコーチ</Link>
            </nav>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}
