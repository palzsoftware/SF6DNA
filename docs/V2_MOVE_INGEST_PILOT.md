# SF6DNA v2 Move / Frame Data Ingestion Pilot

更新日: 2026-08-26

## 目的

大量の技・フレームデータを投入する前に、以下の一連の流れをJPの一部通常技で検証する。

1. Source登録
2. Move登録
3. Classic command登録
4. Frame Data登録
5. Current Patchとの関連付け
6. EntitySourceとの関連付け
7. draft / unverifiedで保持
8. 管理画面から履歴を確認・追記できること
9. official cross-check後のみpublishedへ変更する

## 今回のSource

- URL: `https://frame-search.com/?character_name=JP&lang=ja-jp`
- Source type: `community_aggregator`
- Reliability: `community`
- 取得時に表示されたSF6 version: `Ver.2.0401.001`

このサイトはCAPCOM公式ページへのリンクを提供しているが、SF6DNAでは第三者集約サイト自体をCAPCOM公式Sourceとして扱わない。
CAPCOM公式ページはWeb取得時に403となったため、今回のデータは候補データとしてのみ保存する。

## Live DBへ投入した候補データ

2026-08-26時点:

- Move: 14件
- Classic command: 14件
- Frame: 14件
- Source relation: 14件
- published: 0件
- draft: 14件

対象:

- 立ち弱P
- 立ち弱K
- 立ち中P
- 立ち中K
- 立ち強P
- 立ち強K
- しゃがみ弱P
- しゃがみ弱K
- しゃがみ中P
- しゃがみ中K
- しゃがみ強P
- しゃがみ強K
- ギリオチーナ
- シャーロスチ

## 検証状態

全件:

- `moves.status = draft`
- `move_frame_data.verification_status = unverified`
- Source relationship = `candidate`

したがってPublicページ・AI Coachのpublishedデータとしてはまだ利用しない。

## 管理UI

実装済み:

- `/admin/moves`
- `/admin/moves/new`
- `/admin/moves/[id]`

Move新規登録時に以下をまとめて登録可能:

- Move基本情報
- Classic command
- Modern command
- Frame Data
- Valid-from Patch
- verification status
- Source

既存Move編集時:

- Move基本情報は編集可能
- 登録済みCommandを表示
- Frame履歴を表示
- 新しいPatch版Frameを追記
- Sourceを追記

過去Frameを直接上書きせずPatch単位の履歴として追加する。

## CI

`Add frame history and source management to move admin` のGitHub Actions runで以下成功:

- TypeScript typecheck
- ESLint
- Next.js build

## 再現用Seed

`supabase/seeds/20260826_jp_frame_candidates.sql`

Live DBのみ先行しないよう、投入SQLをrepositoryにも保存した。

## 次工程

1. CAPCOM公式Frameページをブラウザ/手動確認できる経路でcross-check
2. JP 14件をofficial/verifiedへ昇格可能か判定
3. JP残り技を同じ方式で投入
4. Modern commandを公式確認後に追加
5. JPで投入パイプラインを確定後、全31キャラへ展開
6. Combo / Setup / Sequence / Counter / Trainingの管理CRUDへ進む
