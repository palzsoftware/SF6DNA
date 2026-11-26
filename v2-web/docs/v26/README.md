# V26 統合候補（2026-11-26・ローカルのみ／未Push・未適用）
基準 426fcf6 → branch local/v13-integration-20261126。DB・Migration・Deploy・公開フラグは未変更。

## Security P0
- `supabase/migrations/20261126100000_entity_videos_public_target_boundary.sql`：候補。隔離PostgreSQL16で、匿名/認証とも未公開キャラ・Playerへの関連2件→0件、公開分は維持、ロールバック復元を確認。現行コードの公開読み取りは character / player のみ(event-media.ts, character-sections.ts)で互換。管理画面で選べる他の種別(move, tournament等)は公開側では非表示(fail-closed)になる。本番に該当行はない(character 121・player 25のみ)。
- 115000/116000/117000/120000（本番DDLを2026-11-26に読み取り照合）
  - 本番でソース表を直接読む公開ポリシーは move_commands の1件のみ → 117000は本番では対象なし(不要)。
  - 115000：単独適用可。権限は変えない・2回実行可(隔離検証)。本番は sources/entity_sources のRLSが管理者限定のため、現行ポリシーでは技を公開しても匿名にコマンドが0件になる。115000はその修正でもある。現在は公開済みの技が0件なので、適用前後とも匿名に見える行は0件。
  - 116000：Preview用RPC 3本(phase39/42/44)だけが対象。120000の前提としてのみ必要。
  - 120000：匿名のテーブル権限を外す多重防御。115000と116000が前提。本番の関数定義(MD5照合)を使った隔離試験が未実施のため HOLD。公開阻害ではない。
- 配信物スキャン：`scripts/v26/scan_static_bundle.py .next/static public` → PASS(60ファイル、秘密0、JWT 0)。ローカルビルドのみ。Preview/本番の実配信は未実施。

## データ
- Player承認14名：開発draftがある7名を team-bindings.json に追加(全行PENDING=非表示)。翔(kakeru)は既存行を変更せず。開発に行が無い6名は `player14-pending-registration.json` と `sql/player6-dev-draft-candidate.sql`(未実行・隔離で冪等確認)。UMAは承認外のため対象外。本番行は作っていない。
- 表示ラベル：メインは公式プロフィール明記のみ(Xiaohai, NL)＋長年のメインは根拠つき(NuckleDu)。サブ・SNS・大会実績・動画・研究は未接続。「現在の所属」「大会登録チーム（大会名）」の2ラベルを新設(テストの許可リストに追加)。
- 攻略カード：既存2件を expect 一致で更新(arjun 岩肩、jamie JM-R3-D04)。旧ID56件は現行Patch未確認のためHOLD。数値補足249件は現行カードIDに一致するのが11件のみでHOLD(新規カードは作らない)。総数は不変。
- 大会：V25の審査ヘルパーを `src/lib/tournament-intake-review.ts` に追加(29テスト)。どこからも呼んでいない。候補行(V15 118・V17 312・CPT 360・V12 126)は正式大会ID・部門の照合が未了のため全行HOLD、製品データへ未投入。
- 動画：V24の28関連(22本)は既存1,038件とYouTube ID重複なし。再生・埋込未確認のため `player14-video-candidates.json` に保管(runtime未接続)。
- アルジュン：`sql/arjun-intake-candidate.sql`(62技/120コマンド/62フレーム、隔離検証済み・未実行)。
