# Pre-Phase20 Priority Backlog & Feature Ideas

Date: 2026-08-28 JST
Branch: `sf6dna-v2`

## Purpose

Phase20へ入る前の作業順を固定する。

ユーザー方針:
1. まず残課題の優先度S/Aを完了する
2. その後、追加候補機能を実装する
3. 人力・外部依存はFinal Phaseへ残す
4. `reviewed ≠ verified`, `draft ≠ published` を維持する

---

## Priority S — 最優先

### S1. verified攻略データ拡大
対象:
- Combo
- Setup
- Sequence
- Counter
- Training

現状の大量candidateデータを、Source / Current Patch / verification条件に従って監査し、公開可能候補を増やす。

禁止:
- 件数目的のbulk verify
- Source不足データの昇格

### S2. Current Patch Frame verification拡大
- Current Patch Frame: 2065
- verified: 307

official / sufficient primary evidenceがあるものだけをverified候補として整理する。

### S3. Character Guide verification
- Guide section: 278
- 現在published / verifiedは未整備

31キャラのGuideをSource / Current Patch / verification基準で整理する。

### S4. Character Trait Score verification
- Trait Score: 372

診断推薦精度へ直結するため、Source付きverificationを優先する。

---

## Priority A — S完了後に実施

### A1. Modern Command不足622件のSource付き収集
Classicから推測変換しない。

### A2. Legacy parity追加機能をPhase20 Acceptanceへ追加
Phase19後に追加した以下をFinal Acceptance対象へ含める:
- `/tools`
- `/favorites`
- `/my-characters`
- `/compare`
- `/rank-tracker`
- `/diagnosis/history`
- `/about`
- `/faq`
- `/sources`
- `/changelog`

### A3. `PROJECT_STATUS.md` 最新同期
Pre-Phase20 legacy parity作業と追加機能を反映する。

### A4. Vercel Preview
Final Phase / 人力・外部作業として実施。

### A5. 実画面UI/UX監査
Vercel Preview作成後に実施。

### A6. Real Auth / Admin E2E
Final Phase。

### A7. PC / iPhone actual device acceptance
Final Phase。

---

# Feature Ideas — S/A完了後に実装検討

実装順の第一候補は以下。

## F1. 対戦後30秒ログ + 10戦弱点分析
1試合ごとに短時間入力:
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

一定件数ごとに:
- 知識
- 操作
- 判断
- 癖
- 対策不足
を分類し、次の最優先課題を提示する。

## F2. 弱点ヒートマップ + 今日の練習メニュー
対戦ログと既存Training DBを接続して、
- 苦手キャラ
- 対空
- DI
- 確反
- 投げ
- 端防御
- Drive管理
等を可視化。

弱点から当日の練習内容を自動選定する。

## F3. Punish Finder / 確反検索
入力:
- 自キャラ
- 相手キャラ
- 相手技

表示候補:
- ガード時不利F
- 最速安定確反
- 最大リターン候補
- ゲージ温存候補
- SAリーサル候補

既存Move / Frame / Combo DBのverified dataのみ使用する。

## F4. 対戦前30秒キャラ対策カード
相手キャラを選ぶと、ランク直前に読む内容を短く表示:
- 相手の勝ち筋
- 維持距離
- 最重要警戒3点
- 接近手段への回答
- 代表確反
- 端防御

初心者向け簡易版と上級者向け詳細版を将来的に分離可能。

## F5. Replay復習ワークフロー
Replay Takeover等で確認した場面をSF6DNA側に記録:
- 問題場面
- 原因
- 試した回答
- 採用回答
- 再練習対象

既存Training / Counterと接続する。

---

## Secondary Ideas

S/AとF1〜F5の後に検討:
- 状況別クイズ
- Frame/確反クイズ
- 自分の癖検出
- リーサル計算機
- ゲージ効率比較
- Matchup win-rate dashboard

---

## Execution Order

1. S1〜S4
2. A1〜A3（内部で可能なもの）
3. F1〜F5を順次実装
4. その他Secondary Ideas
5. Final PhaseでA4〜A7 + Vercel / device / real auth / Production decision

Phase20はこのメモの内部作業が完了するまで開始しない。
