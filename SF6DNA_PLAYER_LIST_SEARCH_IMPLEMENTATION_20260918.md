# Player一覧専用検索 実装報告

## 実装

- `/players` にGlobal Searchとは独立したClient-side検索を追加。
- 対象: Player名、alias、Team、全Character relation（main/reference/secondary）、Region、country code。
- `NFKC` + 日本語locale小文字化 + 空白/underscore/hyphen除去で正規化し、部分一致で検索。
- 0件Empty State、件数の`aria-live`通知、Clear、search input labelを追加。
- 375px以下ではInputとClearを1列化し、カード・入力の`min-width: 0`を維持。
- 大規模Filter UIは追加せず、1つの検索InputでTeam / Character / Regionの軽量Filter要件を満たす。

## Regression契約

- ときど → Player名
- VARREL → Team
- JP → Character / country code
- りゅうせい → Player名
- Crazy Raccoon → Team
- リュウ → Character
- alias rowが存在する場合はaliasも対象（現行DBは0/41）

## データ取得

`listPlayers()` はPlayer一覧取得後、Character relationとaliasを`Promise.all`で並列取得する。公開Character以外は従来どおり除外する。

## 自動検証

- Targeted Player tests: 13/13 PASS
- Full tests: 249/249 PASS
- Release gates: 14/14 PASS
- TypeScript: PASS
- Lint: PASS
- Build: PASS
- git diff --check: PASS
- Local dev server: 起動PASS（`127.0.0.1`指定）
- Cloud browserからlocalhostへの接続は環境ポリシーで遮断されたため、最終Previewでsmokeを継続する。
