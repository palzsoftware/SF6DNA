# SF6DNA UX採用決定 — 2026-10-01

Status: ACTIVE  
Decision owner: user  
Target: Ver.1.0 release closure and post-release backlog

## 1. 決定

SF6DNAは、他のSF6サイトだけでなく、他ゲーム・学習・情報整理サービスの「見やすさ・使いやすさ・再訪しやすさ」を研究し、文章・CSS・HTML・画像・アイコン等をコピーせず、SF6DNA向けに再設計する。

判断軸は次の3点。

1. 初回利用者が「次に何をすればよいか」迷わない。
2. 情報量が増えても、検索・絞り込み・段階表示で探しやすい。
3. お気に入り・履歴・更新情報などを使い、次回すぐ続きを始められる。

## 2. Ver.1.0で採用

### 今回実装
- Homeの重複導線を整理し、「今日やること」を最上位へ置く。
- Daily15をHomeの主要CTAにする。
- Homeからお気に入り・マイキャラ・診断履歴へ戻りやすくする。
- Homeに最近の更新3件とChangelog導線を置く。
- Mobile DockからFavoritesへ直接戻れるようにする。
- Video LibraryのモバイルFilterを開閉式にし、選択条件数と全解除を表示する。

### 次の安全なVer.1.0 Batch候補
以下は採用方針だが、Character Detailの横スクロールP1・公開境界と同じ領域へ触れるため今回のcommitには混ぜない。

- Character Detail上部の「最初に見る5項目」
  - どんなキャラか
  - まず覚える技
  - 最初のコンボ
  - まず練習すること
  - 参考プレイヤー / 動画
- Character Tabs / ページ内ナビのsticky改善
- 技一覧の簡易検索とカテゴリChip

実装時も未verified Move/Comboを「おすすめ」として自動採用しない。公開可能なデータだけを使い、不足時は該当項目を無理に埋めない。

## 3. Ver.1.0.x候補

Release blockerにはしない。

- 最近見たキャラクター
- 検索履歴
- Favorite CharacterをHomeで優先
- 「主要技だけ」Toggle
- Combo簡易Filter
- Frame横断検索
- Punish Finder
- Combo Finder
- Compact Mobile Table
- Row Highlight
- Video chapter / tag導線

## 4. Ver.1.1以降へ後回し

- Daily streak
- Training履歴
- 「後で練習する」Queue
- 本格My Dashboard
- Personalized Home
- Popular / Trending
- User Activity Feed
- Character Progress
- Damage Calculator
- Pressure Checker
- Oki / Setplay Finder
- Training Planner拡張
- Hitbox視覚化

AI Coachは既存方針どおりHOLD。今回のUX決定によってVer.1.0へ自動追加しない。

## 5. 採用しないもの

- 他サイトの文章・CSS・HTML構造・画像・ロゴ・アイコン・動画のコピー
- 利用条件不明のデータ流用
- 未verified攻略を見た目改善のためにPublicへ出すこと
- Release直前のSNSフィード・ランキング・XP等の大型ゲーミフィケーション
- 保存基盤がない状態でのStreak表示

## 6. Release境界

この決定はUI/UX改善方針であり、DB write、Migration、RLS、RPC権限、Production、main、sf6dna-v2への変更承認ではない。

Ver.1.0では引き続きRelease Closureを優先し、重大なP1/P0の解消をUI追加より上位とする。
