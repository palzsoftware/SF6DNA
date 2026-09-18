# Global Page Accessibility Audit — 2026-09-18

## PASS

- `html lang="ja"`、skip link、`main` landmark、navigation labelsを維持。
- FAQ検索にlabel、カテゴリーにgroup label、選択状態に`aria-pressed`、件数に`aria-live`。
- FAQはnative details/summaryでキーボード利用可能。
- Global focus-visibleは3px accent outline。
- Feedback cardsはsection labelを持ち、送信できない状態を明記。
- Footerは意味のある見出しと単一の補助navigationを使用。
- 375px responsive contract、44px以上のbutton contract、wrap contractは回帰テストでPASS。

## USER_DEVICE_ONLY

実ブラウザのズーム、スクリーンリーダー読み上げ順、モバイル実機のフォーカス/タップ体感は最終代表Route QAで確認する。

