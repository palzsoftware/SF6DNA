# Internal Page Protection — 承認前準備

基準RC4e4241f9。18 internal/admin page patternsの既存証跡を再利用。15はrequireAdmin、2はgetUser+profiles.roleの既存inline guard、1はguardなし。admin layoutのnoindexは権限制御ではない。

| 対象 | 現在 | 変更案 |
|---|---|---|
| /internal/character-preview/[slug] | 既存Previewで匿名200、現在も同じコード | default async関数のparams/data読取前に await requireAdmin() |
| /admin ほか17 | 既存admin判定あり | 変更しない |

ADMIN_GUARD_APPROVED=NO、GUARD_APPLIED=NO。指示書§73/132を優先。新Auth・role変更・DB書込みなし。

## 適用する具体差分（未適用）

```diff
+import { requireAdmin } from "@/lib/admin";
 export default async function PreReleaseCharacterPreview({ params }) {
+  await requireAdmin();
   const { slug } = await params;
```

実際のTypeScript関数signatureは既存を維持する。掲載データ・noindexを変えない。

## 承認後の検証

1. 匿名：既存 /auth?next=/adminへ遷移、内部キャラ情報・sourceを描画しない。データ関数は呼ぶ前に認証する。
2. 認証済み非管理者：/adminへ遷移し既存の権限案内。内部内容なし。
3. 管理者：既知slugの内部内容を許可、存在しないslugは認証後404。
4. profile取得エラー／role不一致：既存fail-closed判定を保持。
5. 既存Adminのトップ・data-status・代表requireAdmin頁を影響範囲QA。ログインや管理者付与、テストDB書込みをこの承認へ含めない。
6. Targeted test→型検査/lint→まとめてRC/Preview。権限変更がない今回BatchではAuth試験を重複実行しない。

承認は内部guard適用に限定。Production・DB・公開Combo flag・Source metadata更新の承認を兼ねない。
