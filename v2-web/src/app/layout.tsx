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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <div className="site-shell site-header__inner">
            <Link className="site-brand" href="/">SF6DNA</Link>
            <nav className="site-nav" aria-label="主要ナビゲーション">
              <Link href="/search">検索</Link>
              <Link href="/diagnosis">診断</Link>
              <Link href="/characters">キャラクター</Link>
              <Link href="/players">プレイヤー</Link>
              <Link href="/training">トレーニング</Link>
              <Link href="/coach">AIコーチ</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
