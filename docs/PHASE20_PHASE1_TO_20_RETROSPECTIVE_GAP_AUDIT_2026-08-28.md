# SF6DNA Phase1〜20 Retrospective Implementation Gap Audit

最終更新: 2026-08-28 JST
対象ブランチ: `sf6dna-v2`

## 結論

Phase20終了前に、Phase1〜20で定義・計画・再分類された項目を、現在のGitHub実装とSupabase実DBを正本として再監査した。

最終判定:

- **Phase1〜20 automated/internal完了条件に対する重大な未実装: 0**
- **今回の監査で修正したPhase20終了処理上の欠陥: 3分類**
  1. temporary audit RPCの未撤去
  2. temporary frame-crosscheck workflowの未撤去
  3. legacy Frame退役後のMove lifecycle不整合
- **将来機能・外部Acceptanceを「未実装」と偽ってPhase20へ詰め込まない**
- Phase21は開始しない

## 判定ルール

この監査では、文書に「今後」と書かれているだけで全項目をPhase20必須とは扱わない。

分類:

1. **Phase完了条件**: 未実装ならPhase20で修正対象
2. **後続Phaseで吸収済み**: 現実装を確認して完了扱い
3. **将来機能として明示**: Phase1〜20の未実装扱いにしない
4. **Manual / External Acceptanceへ正式移管**: 実装漏れ扱いにしない
5. **提案 / UX改善案**: 正式Backlog採用前は必須実装扱いにしない

## Phase別監査

| Phase | 主要目的 | 最終判定 | Evidence / 補足 |
|---|---|---|---|
| Phase1 | 安全な開発基盤 / main保護 / v2正本化 | PASS | `sf6dna-v2`運用、V2_REQUIREMENTS保存、main未変更 |
| Phase2 | Architecture確定 | PASS | Next.js + TypeScript / PostgreSQL / Supabase / Express再利用方針を`V2_ARCHITECTURE.md`で確定 |
| Phase3 | DB/Data Model・UX/設計レビュー | PASS | relational schema・RLS・データ原則を後続Phaseで実DB化。Final Reviewの改善案は必須Gateではない |
| Phase4 | Next.js基盤 | PASS | `v2-web`、App Router、TS、Supabase/Backend helper。後続CIでtypecheck/lint/build実行済み |
| Phase5 | Character Encyclopedia基盤 | PASS | `/characters`、詳細、子URL、Repository。後続PhaseでDB実データ統合済み |
| Phase6 | Unified Search / Alias | PASS | `/search`、NFKC、`search_sf6dna`、pg_trgm、Alias検索実装。検索サジェスト/Match直接表現は当時「今後」でありPhase6 Exit Gateではない |
| Phase7 | Short Diagnosis | PASS | 実DBで4診断 published: improvement / playstyle / character-fit / comprehensive。診断Historyは後にLegacy Parityとして追加済み |
| Phase8 | Player Database | PASS | `/players`、detail、PlayerCharacter、外部link。91 Player / 41 publishedを実DB確認 |
| Phase9 | Strategy / Training表示基盤 | PASS | Move / Combo / Setup / Sequence / Counter / Training route・detail・DB構造実装。未publishedはEvidence Gateによる意図的状態 |
| Phase10 | Admin / Auth / RLS | PASS | `/admin`にCharacter、Move、Strategy、Player、Tournament、Video、Glossary、Patch/Source、Diagnosis等の管理導線あり。real session E2EはExternal Acceptance |
| Phase11 | AI Coach Retrieval | PASS | DB Evidence retrieval、Patch/Source、input boundary実装。AI生成はEvidence充足までOFFが正式仕様 |
| Phase12 | Replay Coach Research | PASS as research phase | 研究計画までがPhase定義。本格映像解析は将来機能と明記 |
| Phase13 | Character Content Verification & Expansion | PASS | 31 playable CharacterのMove/Frame/Command/Strategy等をworking DBへ展開。verification rule維持 |
| Phase14 | Application Integration / Public Gate | PASS | Final Auditで14完了 + 5件正式再分類、unclassified 0 |
| Phase15 | Acceptance strengthening | INTERNAL PASS / external deferred | Runtime/Browser/Lighthouseを自動確認。Vercel/real Auth/actual deviceは後続Manual Acceptanceへ正式移管 |
| Phase16 | Release Candidate hardening | PASS | RC Conditional Go、SEO/Public Gate/Failure-state hardening |
| Phase17 | Automated/Internal closure | PASS | Internal scope完了。Audit LogはRelease Gate必須ではないと正式判定 |
| Phase18 | Verified Content / Public Data Gate | PASS | strict Public Move Gate、Strategy Source RLS、Data Gate Acceptance |
| Phase19 | Internal Data Integrity / Hardening | PASS | FK/identifier/patch/source/gate/CI/security監査完了 |
| Phase20 | Verified Content Expansion | PASS after final cleanup | 2020/2052 current Frame verified、32 reviewed exception、unverified 0、Security 0 lint |

## Phase6〜11の旧「今後」項目の再判定

### 後続で実装済み

- Character Fit Diagnosis
- Playstyle Diagnosis
- Comprehensive Diagnosis
- Diagnosis History
- Character / Player / Strategy DB integration
- Patch / Source表示・Public Gate
- Admin管理画面の主要カテゴリ
- AI Coach Evidence retrieval
- verifiedデータを優先するPublic/Data Gate

### 必須未実装とは判定しない項目

- Search Suggestion / ranking tuning
- Match直接検索の専用表現
- 利用ログを使った検索ランキング最適化
- データ増加後のEXPLAIN性能調整
- Playerのさらに高度な地域/実績フィルタ

理由:
- これらは各Phase文書で「今後」「データ増加後」「別設計」とされ、当該PhaseのExit Criteriaに含まれていない。
- Phase21/22の正式Backlogに含まれるものをPhase20で先行実装しない。

## Future / Deferred — 未実装欠陥ではない

### AI generation

Phase11仕様は、十分なverified Evidence・Backend契約・Structured Output・引用Guardが成立するまでGeneration OFF。

したがって:
- Generation OFF = 正常
- Phase20で勝手にONにしない

### Replay Coach映像解析

Phase12はResearch Phase。
実動画解析・公式Replay data integrationは、取得方法・規約・コスト・精度確認後の将来機能。

### Manual / External Acceptance

以下は内部実装漏れではなく、後続Final Manual / External Acceptanceへ正式移管済み。

- Vercel Project / Preview deployment
- Preview runtime/log
- real Admin / non-admin authenticated E2E
- actual PC / smartphone / device browser verification
- public network performance
- Production readiness final decision

これらをPhase20完了のために捏造しない。

### Audit Log

Phase15で受け入れ先が未確定だったが、Phase17で`V2_RELEASE_READINESS.md`の必須Release Gateではないと正式判定済み。

よってPhase20で勝手にAudit機能を新設しない。

## 今回実際に発見・修正した未完了事項

### 1. Temporary SECURITY DEFINER audit RPC

問題:
- `public._phase20_frame_audit_fingerprints()`がPhase20 crosscheck終了後も残存
- Security Advisor 2 WARN

修正:
- 実DBからdrop
- migrationをRepositoryへ記録
- Security Advisor **0 lints**確認

### 2. Temporary GitHub Actions crosscheck

問題:
- temporary RPCに依存するPhase20専用crosscheck workflowが残存

修正:
- `.github/workflows/phase20-frame-crosscheck.yml`を退役
- 恒久`phase20-verified-content-acceptance.yml`のみ維持

### 3. Move / Frame lifecycle integrity

問題:
- legacy Frameを履歴化したMove 12件が`draft`のまま残り、active MoveにCurrent Frameが無い状態になった
- archived Dhalsim duplicate Moveにopen Current Frameが1件残存

修正:
- obsolete Move 12件を`archived`
- archived Dhalsim duplicate FrameをCurrent setから履歴化

最終:
- active Move: **2052**
- Current Frame: **2052**
- active Move without Current Frame: **0**
- active Move with multiple Current Frame: **0**

## Phase20 final data state

- Current active Frame: **2052**
- verified: **2020 (98.4%)**
- reviewed: **32**
- unverified: **0**
- verified rows with official CAPCOM Frame Source: **2020 / 2020**
- remaining 32 = Taunt 31 + Alex Exit Prowler Stance 1
- remaining 32はCAPCOM official Frame Data直接比較対象外のためreviewed維持

## Final Conclusion

Phase1〜20の正式なautomated/internalスコープを再監査した結果、機能本体の重大な実装漏れは確認されなかった。

今回発見したのはPhase20終了処理に伴う一時監査surfaceとMove/Frame lifecycleの整合性欠陥であり、すべて修正した。

将来機能、提案、External Acceptanceを未実装バグとしてPhase20へ無制限に取り込まず、既存のPhase境界を維持する。

**Phase1〜20 automated/internal implementation gap: 0**
