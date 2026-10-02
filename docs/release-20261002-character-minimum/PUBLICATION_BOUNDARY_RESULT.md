# Publication Boundary Result

## RC / parallel isolation

開始 `2e8500d38ef9010fc8fdcbab9526c0d0f36b7721`（⑫Daily15 persistence）。統合ベース `e67f38341fd6175266aca7c3dd081011776ab15f`（⑫Browser検証文書のみ）。⑬はこのディレクトリの4文書だけを変更。Daily15 / Retention files touched=0、Retention storage touched=0、Shared components touched=0、JP motion media touched=0。Production/main/sf6dna-v2/Ver1.1変更0。

## Fresh public contract

- `v2-web/src/lib/release-features.ts`: aiCoach=false / training=false / publicStrategyContent=false。
- `v2-web/src/lib/character-sections.ts`: Combo/Setup/Sequenceはpublished AND verified。Videoは明示Relation AND published。
- `v2-web/src/app/characters/[slug]/combos/page.tsx` と `[section]/page.tsx`:通常Combo/Setup/Sequence経路はStrategy gate配下、非公開時404。Preview token経路は独立契約のまま。
- `character-detail-pilot.tsx`: Previewまたはflag＋published＋verifiedでStrategy内容を表示。通常Character Detailは候補を漏らさない。JPも通常公開bundleをsanitizationする。
- `public-source-links.ts` / `character-video-references.ts`:既存RPCとRelation許可リストを維持。YouTube Source Referenceは公開Video entityと別分類。タイトル一致だけの関連付けなし。

DB read-onlyで private.is_combo_public_ready / is_setup_public_ready / is_sequence_public_ready および公開RLSを確認。published＋verified、公開playable Character、DBcurrent patch、valid_toなし、実レシピ欄、候補用placeholder排除、Source Relation等が必要。Source存在だけでverifiedにはならない。Admin SELECTの候補数をanon公開可能数と混同しない。Device Preview用の別policyは変更せず、tokenを成果物に記録していない。

**公開準備の次にGateを自動解除することはない。** 今回は不足条件を記録する段階。Gate変更・DB status変更・Migration/RLS/RPC/GRANT変更0。未verified攻略の静的直書き0。UNVERIFIED_FACT_PUBLICATION=0、GAME_FACT_GUESSING=0。

## Tests / browser

開始RCの実測: npm run typecheck PASS / lint PASS / npm test **422 PASS** / test:release-gates **14 PASS** / build PASS / git diff --check PASS。Linux環境でnpm.cmd相当を実行。統合された⑫差分は文書のみでapp tree同一のためfull test再実行なし。Buildが自動更新したnext-env/tsconfigは該当2ファイルだけ元へ戻し、変更を残していない。

Base Preview `dpl_8psqdyjBa4Xodaj9uk6Xz45hvZxk`: READY、target Preview、branch一致、開始SHA一致。Ryu/JP/Luke/Jamie/Zangief/Yasmineの6ページをdesktopで確認、document overflowなし。通常Ryu Combo専用routeは期待どおり404。Ryuは「確認済みのコンボはまだありません。」を維持。Ryu Light/Dark切替でテーマ属性とoverflowなしを確認（完全Contrast監査ではない）。YouTube CTAは既存Ryu公式動画へ新tab遷移PASS、再生完了は未確認。

375px等の実Mobile viewportは本環境で未実施: MOBILE_NOT_VERIFIED。既存文字折り返し/公開境界のstatic・test確認と、実Mobile確認を混同しない。新UIを導入していないため⑬でDevice確認を繰り返し依頼しない。公開内容導入時にMobile QAを改めて行う。

最終docs commitのSHA/Preview READYはチャット最終報告で記録する（自己参照の追記commitを作らない）。Release status **NO-GOを維持**。Content Minimum未達に加え、他WorkstreamのDevice/Auth等を⑬で自動PASS扱いしない。
