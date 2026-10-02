# Device Review Handoff — 2026-10-02

確認対象はHome / JP / Ryu / Lukeの4ページに圧縮する。Previewのみ。本番URLでは確認しない。

## Home（必須）

第一印象、遊び心、SF6らしさ、単調さ、使いたくなる感じ、15分練習が一番目立つか、診断が次点と分かるか。

## JP / Ryu / Luke

文章が自然か、組み立て方の折りたたみが読みやすいか、距離カードで狙いがつかめるか、縦長感、技へ移りやすいか。今回のMedia mapping変更は0。⑤のJP SA1/SA2修正を維持。

## 自動確認と主観確認を分離

routes/構造/public gates/型/lint/full tests/buildは開発側が確認。見た目の好みはテストでPASSにできない。Cloud Browserで確認できるviewportだけをBrowser PASSにする。375/390/430/320pxは実viewport確認が取れなければ未確認として残す。

次の単一Action: 新PreviewのHomeを開き、今回の方向性を目視評価する。好みの具体的な差は追加候補とし、DB・ゲーム事実・新機能へ広げない。

RELEASE_STATUS = NO-GO。今回のUI実装完了はRelease GOを意味しない。

## 開発側のPreview確認結果

Code Preview: https://sf-6-amh8lq7p0-somas11620-9368.vercel.app/ 。READY / branch / code SHA一致。Homeを含む13ページでDesktop page-wide overflowなし。Home Dark/Light、CTA→Daily15、JPのnative開閉・Enter、0件から再検索を確認済み。

未確認: 375/390/430/320px実viewport、端末固有の描画、reduced-motion環境の実動作、見た目の主観評価。今回のpublic実機確認を4ページにまとめる。Homeの好みとあわせ、スマホで違和感があれば該当箇所を報告する。
