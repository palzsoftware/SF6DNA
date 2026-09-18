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
    "Street Fighter 6の診断・キャラクター情報・プレイヤー・動画を整理して確認できるSF6上達支援サイト。",
  openGraph: {
    type: "website",
    siteName: "SF6DNA",
    title: "SF6DNA",
    description:
      "Street Fighter 6の診断・キャラクター情報・プレイヤー・動画を整理して確認できるSF6上達支援サイト。",
  },
  twitter: {
    card: "summary_large_image",
    title: "SF6DNA",
    description:
      "Street Fighter 6の診断・キャラクター情報・プレイヤー・動画を整理して確認できるSF6上達支援サイト。",
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
              <Link href="/diagnosis">診断</Link>
              <Link href="/search">検索</Link>
              <Link href="/players">プレイヤー</Link>
              <Link href="/videos">動画</Link>
            </nav>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
        <footer className="site-footer">
          <div className="site-shell site-footer__inner">
            <div className="site-footer__brand"><strong>SF6DNA</strong><p>SF6の情報を、根拠と一緒に。</p></div>
            <nav className="site-footer__nav" aria-label="補助ナビゲーション">
              <div><strong>ガイド</strong><Link href="/about">SF6DNAについて</Link><Link href="/faq">よくある質問</Link><Link href="/feedback">フィードバック</Link></div>
              <div><strong>コンテンツ</strong><Link href="/characters">キャラクター</Link><Link href="/players">プレイヤー</Link><Link href="/videos">動画</Link><Link href="/diagnosis">診断</Link></div>
              <div><strong>情報と方針</strong><Link href="/sources">情報源</Link><Link href="/privacy">プライバシー</Link><Link href="/terms">利用規約</Link><Link href="/disclaimer">免責事項</Link></div>
              <div><strong>その他</strong><Link href="/changelog">更新履歴</Link><Link href="/contact">お問い合わせ</Link><Link href="/auth">アカウント</Link></div>
            </nav>
          </div>
        </footer>
        <nav className="mobile-dock" aria-label="スマートフォン用クイックナビゲーション">
          <Link href="/characters">キャラ</Link>
          <Link href="/diagnosis">診断</Link>
          <Link href="/search">検索</Link>
          <Link href="/players">選手</Link>
        </nav>
      </body>
    </html>
  );
}
