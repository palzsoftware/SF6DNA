"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const destinations = [
  { href: "/", label: "ホーム" },
  { href: "/me/training", label: "15分練習" },
  { href: "/favorites", label: "保存" },
  { href: "/diagnosis/history", label: "診断履歴" },
  { href: "/my-characters", label: "マイキャラ" },
] as const;

export function MobileDock() {
  const pathname = usePathname();
  return (
    <nav className="mobile-dock" aria-label="スマートフォン用クイックナビゲーション">
      {destinations.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
      ))}
    </nav>
  );
}
