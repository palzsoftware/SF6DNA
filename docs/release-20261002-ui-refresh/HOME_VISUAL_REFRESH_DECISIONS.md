# Home Visual Refresh Decisions — 2026-10-02

Base: `edc01e2f33fd815907d3e6aa60587933d6ed4956`。
Code RC: `c6054662f5258ba22a3e4c3c59b7f6b55d5fec61`。

## 変更の目的

同じ大きさの機能カードを並べる構成から、次の対戦に向けた練習を主役にしたTraining Labへ変更。
121サービス研究のfirst useful action、情報階層、return path、visual scanningだけを再利用。新しいサイト調査、他サイトの配置・文章・CSS・画像のコピーなし。

| Before | After | 意図 |
|---|---|---|
| Heroに3つの同列CTA | 15分練習をPrimary、診断をSecondary | 最初の行動を明確にする |
| 大きな同形の画像パネル | 既存3キャラを重ねたimage layer＋DNAの線・ノード | SF6と分析・練習の世界観を接続 |
| 等幅の今日やること3カード | 大きなDaily15＋小さな診断・キャラ導線 | 重要度に形と面積の差をつける |
| 時間を文章だけで説明 | 05 min × 3＋合計15分のaccessible label | 練習の短さを一目で伝える |
| 更新が探索より先 | 続きから→探索→更新 | 行動・再訪・探索を優先 |
| 更新の同形Box | 日付・見出し・本文を結ぶtimeline | 長文カードの反復を減らす |
| 長いHero説明と矢印の反復 | 短い説明、戻る対象の明示、重複矢印削減 | 読む負担を減らす |

My CharacterによるHeroの個別化は今回追加しない。既存の公開キャラからの選択を維持し、画像がなければCSSのDNAが残る。新しい保存state・画像asset・外部UI libraryなし。

動きはhover lift / tap responseのみ。常時animation、canvas、WebGL、parallaxなし。reduced-motionではtransitionとtransformを停止。

375pxを含む560px以下は1列へ切替、Hero画像は140pxに抑える。320px Stressを含む実viewport確認とは区別する。Dark/Light/appearanceには既存semantic paletteを利用する。

受入状態: 実装・ソース契約・テスト完了。遊び心・SF6らしさ・好みの最終判定はユーザー目視待ち。アカウントやProductionへ反映する判断ではない。
