# 18:00 Device QA Handoff

最初はDay 1だけ実施する。目安45–60分。

1. 新PreviewでRyu/JPをスマホ幅とPC幅で開く。
2. Player検索・複合filter・detail遷移。
3. Video検索・filter・share・外部遷移。
4. global searchとguest diagnosis→Daily。
5. login→save→reload→history→logout。

PASSは項目名だけ、FAILは `URL + 操作 + 時刻 + Screenshot`。原因分析やCSV編集は不要。data loss、login loop、blank screen、5xxが出た経路は停止し、他の独立経路へ進む。

Day 2以降は `SF6DNA_WEEKEND_DEVICE_QA_PACK_1800_20260918.md` を使用する。
