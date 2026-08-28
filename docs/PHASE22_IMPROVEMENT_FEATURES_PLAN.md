# SF6DNA Phase22 Improvement Features Plan

最終更新: 2026-08-28 JST
状態: **未開始 / Phase21完了後**

## Phase22名称

**Player Improvement Loop & Advanced Utility Features**

## 目的

Priority S/A完了後に、初心者からMR1700以上を目指す上級者まで継続利用できる上達支援機能を追加する。

## Primary Features

### P22-01 対戦後30秒ログ + 10戦弱点分析
- 相手キャラ
- 勝敗
- MR/LP
- 主な被弾原因
- 対空
- DI返し
- 確反
- 端脱出
- Drive管理
- 困った技/連携
- 知識 / 操作 / 判断 / 癖 / 対策不足分類
- 次の最優先課題を提示

### P22-02 弱点ヒートマップ + 今日の練習メニュー
- 苦手キャラ
- 対空
- DI
- 確反
- 投げ
- 端防御
- Drive管理
等を可視化。

既存Training DBと接続し、弱点に基づく当日の練習候補を提示する。

### P22-03 Punish Finder / 確反検索
入力:
- 自キャラ
- 相手キャラ
- 相手技

表示:
- ガード時不利F
- 安定確反候補
- 最大リターン候補
- ゲージ温存候補
- SAリーサル候補

verified Move / Frame / Comboのみ使用する。

### P22-04 対戦前30秒キャラ対策カード
- 相手の勝ち筋
- 維持距離
- 最重要警戒3点
- 接近手段への回答
- 代表確反
- 端防御

初心者向け簡易表示と上級者向け詳細表示を設計可能にする。

### P22-05 Replay復習ワークフロー
- 問題場面
- 原因
- 試した回答
- 採用回答
- 再練習対象

既存Counter / Trainingと接続する。

## Secondary Features
Primary完了後に検討・可能なら実装:
- 状況別クイズ
- Frame / 確反クイズ
- 自分の癖検出
- リーサル計算機
- ゲージ効率比較
- Matchup win-rate dashboard

SecondaryはPrimaryを壊さず、重複機能がないことを確認してから追加する。

## Acceptance
- beginner / intermediate / advancedの導線が破綻しない
- 未verified攻略データを断定表示しない
- Existing Public Gateを迂回しない
- Typecheck / Lint / Test / Build PASS
- Phase22 Final Audit作成

## Exit Criteria

- P22-01〜P22-05実装・内部Acceptance完了
- Secondaryは実装有無を記録
- Phase23のManual/External Acceptance対象へ新規機能を追加
- main変更なし
- Production deployなし
