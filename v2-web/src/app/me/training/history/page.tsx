import type { Metadata } from "next";
import { PracticeHistory } from "@/components/practice-history";
export const metadata: Metadata = { title: "練習履歴", robots: { index: false, follow: false } };
export default function PracticeHistoryPage() { return <PracticeHistory />; }
