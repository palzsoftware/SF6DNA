import type { Metadata } from "next";
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
            <a className="site-brand" href="/">
              SF6DNA
            </a>
            <nav className="site-nav" aria-label="主要ナビゲーション">
              <a href="/diagnosis">診断</a>
              <a href="/characters">キャラクター</a>
              <a href="/players">プレイヤー</a>
              <a href="/coach">AIコーチ</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
