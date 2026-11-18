# ChatGPT Luke通常技18件 受領 × Claude台帳 差分照合 (2026-11-16)

受領: LUKE_NORMAL18_integration_manifest.json（本フォルダに保存）。QAレポート/CSV/RECORDING_LISTはDrive上で内容確認（CSVのSHAはManifestと同一）。
- ChatGPT提供のZIP(SF6DNA_LUKE_NORMAL18_QA_20261116.zip)は未展開。GIF実体バイトはこの環境では未再検証。
## 結果
- 18件すべて SHA-256 / ファイル名 / フレーム数が Claude台帳(luke-normals-18-20261116.json)と一致（スラッグ表記 jumping→jump のみ差）。新規・不一致ファイル 0。
- ChatGPT側の「新情報」: 技術検査PASS(18)のみ。技ID・強度は CLAUDE_CONFIRM_REQUIRED、強度/元動画照合は NOT_RUN と自己申告。→ 技ID/強度の根拠追加なし。
## 重複判定の比較対象差
- standing-mp 22_3 (8bc80480) = 旧 22_5-luke-standing-hp.gif と同一。ChatGPTは 22_5-…-hp-verified (52b1d934) を比較対象にしており、旧hp版との重複は未検出。
- jumping-mk 22_16 (5211977b) = 旧 22_18-luke-jumping-hk.gif と同一。ChatGPTは 22_18-…-hk-verified (fae48461) を採用。
- どちらも「verified版は別内容」だが、中P/中Kの映像が強P/強K旧版と同一バイトである事実は残る → HOLD維持。
## crouching-hk
- 22_12-luke-trench-break.gif (4068189e) は台帳上 role=unconfirmed_mapping、slug luke-crouching-hk は並び順のみ。現行技ID 9f9e639b-a942-40a2-ad23-33fa36e1ac06 との対応を示す元動画時刻・入力情報なし → HOLD_UNCONFIRMED_MAPPING。
## 集計
正式技ID照合済み 0 / HOLD 18 (強度不明15・重複2・対応未確定1) / ローカル表示追加 0 / 追加録画必要 確定0
