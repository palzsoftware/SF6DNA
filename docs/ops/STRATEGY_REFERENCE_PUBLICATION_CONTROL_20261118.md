# 参考攻略カード384件 公開制御（検討・未実装）

## 現状（実装済み・ローカル）
- 表示判定: `isStrategyResearchPreviewAllowed(env)`（`v2-web/src/lib/strategy-research-contract.ts`）
  - `VERCEL_ENV=production` → 常に false（コード上で固定）
  - `VERCEL_ENV=preview` → true / ローカルは `NODE_ENV=development` のみ true
- 既存 `releaseFeatures.publicStrategyContent`（攻略DB）とは独立。旧攻略データは一切参照しない。

## server-only 削除の影響確認（実施済み）
- `character-strategy-research-grid.tsx` → slot → `character-unified-page.tsx` はいずれも `"use client"` 無しのサーバーコンポーネント。
- `npm run build` 後、`.next/static` に カードID（例 `guide-ref:SF6DNA-YASMINE-R5-037`）/ `referenceNotice` / `strategy-research-cards` / `YOUTUBE_DATA_API_KEY` / `CRON_SECRET` いずれも 0件。
- 推奨: 再発防止として Unit Test にクライアント境界の静的検査を追加（追加候補）。

## Production公開時の推奨案（承認待ち・未実装）
- 専用フラグ `releaseFeatures.publicStrategyReference`（既定 false）を新設し、production 判定のみこのフラグで開く。
- `publicStrategyContent` は変更しない（攻略DBの境界を維持）。
- 公開単位: キャラ単位の allowlist（例: ルークのみ先行）で段階公開。
- 表示文言「参考攻略（実機未検証）」と「数値は参考」を必須表示のまま維持。verified 昇格はしない。
