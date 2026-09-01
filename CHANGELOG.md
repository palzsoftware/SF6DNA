# SF6DNA Changelog

SF6DNAの主要な開発マイルストーンを記録する。

## 2026-09-01 — Strategy Source quality audit

- Active Combo / Setup / Sequence 2,480件を再監査
- 31キャラの2026.08.03公式変更ページを全Active Strategyと対応Trainingへpatch contextとして接続
- 収集時に関係登録が空振りしていた文章Source 9件、Strategy 18件、Training 18件を修復
- Source 2件以上を1,406件から2,469件へ改善
- 公式変更ページのみの11件は未確認・撮影待ちを維持
- verified / publishedは変更せず、Security Advisor 0、Web tests 55 / 55 PASS

## 2026-08-29 — Pre-release polish

- Phase22完了後のUI仕上げを開始
- キャラクター画像を使ったホーム / カードデザインへ更新
- 診断一覧カードの情報量・視認性を改善
- ユーザー画面に残っていた内部管理用語を一般向け表現へ整理
- Release文書をPhase23の現在状態へ同期
- 実機テストをRelease Candidate固定後の最後のAcceptanceとして再配置

## 2026-08-29 — Phase22 complete

- `/improve` 対戦後30秒ログ
- 直近10戦の弱点整理と練習導線
- 診断回答の端末内保存 / 再開
- `/matchup-card` 対面ナレッジカード
- リプレイ手動振り返りワークフロー
- マイ機能への統合
- Phase22内部CI / Policy Gate PASS

## 2026-08-29 — Phase21 complete

- Current Move 2052件を対象にModern Commandを監査
- Classic Command 2052 / 2052
- Modern Command 1441 / 2052
- 公式情報から安全に確認できない611件は推測せず未入力を維持

## 2026-08-28 — Phase20 complete

- Current PatchのMove / Frame / CommandをCAPCOM公式情報と追加照合
- Current Frame 2052 / 2052
- verified Frame 2020 / 2052
- 重大なPhase1〜20 implementation gap 0
- temporary audit RPC削除
- Supabase Security Advisor 0 lints

## 2026-08-27〜28 — Phase13〜19

- 全31キャラクター共通データモデル整備
- Application Integration / Public Data Gate
- Runtime / Browser / Lighthouse / Release Candidate hardening
- Data Integrity / Source / Patch lifecycle / RLS / Security監査
- お気に入り、マイキャラ、比較、ランク記録、診断履歴などをv2へ統合

## 2026-07-30 — Legacy Phase1 Final

旧静的版でホームページ、デザインシステム、プレイヤー画像、データ整合性チェック等を整備した。

現在の公開候補は`v2-web`を正とし、旧静的版の記録は履歴として保持する。
