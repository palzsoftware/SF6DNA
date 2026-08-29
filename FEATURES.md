# SF6DNA v2 機能一覧

最終更新: 2026-08-29 JST

## 実装済み

- 4種の診断基盤
- 診断回答の端末内保存 / 途中再開 / 診断履歴
- キャラクター辞典
- 技 / Classic Command / Modern Command / Frame Data
- Combo / Setup / Sequence / Counter / Training
- プレイヤー情報
- 動画一覧・詳細
- Unified Search
- AI Coach Retrieval
- Admin管理画面
- Source / Patch / Verification / Public Data Gate
- Data Quality / Data Status
- お気に入り
- マイキャラ（メイン / サブ / 練習中）
- キャラクター比較
- MR / LPランク記録
- 対戦後30秒ログ
- 直近10戦の弱点整理とトレーニング導線
- リプレイ手動振り返り
- 対面ナレッジカード
- About / FAQ / Sources / Changelog
- robots / sitemap / OGP基盤

## データ品質上の意図的な制限

### Modern Command

Current Move 2052件のうち、公式情報から安全に確認できるModern Commandを掲載します。

Phase21監査時点:

- Classic: 2052 / 2052
- Modern: 1441 / 2052
- 未入力: 611

未入力611件はClassicから推測変換せず空欄を維持します。

### Strategy / Guide / Trait

Sourceが存在するだけでは攻略内容自体の正しさを証明したことにならないため、十分なEvidenceがない情報を件数目的でverified / publishedへ昇格しません。

### AI Coach

現在はSource-backed retrievalを中心に提供します。Evidence不足を自由生成で補う攻略回答は段階解禁前です。

## Release前調整中

- UI / 画像 / 文言の最終調整
- Preview / Auth / Public Gate最終確認
- Release docs同期
- CI / Performance再確認
- PC / iPhone実機Acceptance

## 将来候補

- AI Replay映像解析
- AI Coach生成回答の段階解禁
- Source-backed大会 / Actカレンダー
- Team Directory / Roster Historyのv2再構築
- アカウント同期型のお気に入り / ランク / 診断履歴
- 明示された問い合わせ先を使うContact機能

## 品質ルール

- `reviewed ≠ verified`
- `draft ≠ published`
- Sourceありだけでverifiedへ昇格しない
- Modern Commandを推測補完しない
- SourceなしFrameを確定しない
- 旧版の時限データを最新Source確認なしにv2へコピーしない
