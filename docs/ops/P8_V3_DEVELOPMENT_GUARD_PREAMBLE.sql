-- SF6DNA P8 V3 Development専用ガード（前置き。V3の各SQLの先頭に置く。単体では何も書き込まない）
-- 使い方: 本ファイルの内容を V3 の各SQLの**先頭に直接記述**する。`\i` で読み込むと、停止しても呼び出し元が続行するため無効（PG16で確認）。
-- 手順・承認項目・Rollbackは STANDBY の SF6DNA_P8_V3_APPLY_PREP_20261117.md を正本とする。
-- 本ガードは V3 の fixture専用ガード（実DBで必ず停止）を置き換える候補。差分はガード部分のみであることを承認者がレビューする。
-- 停止は raise exception で行う（\quit は \i で読み込んだ場合に呼び出し元を止めないため使わない）。
-- 検証: 使い捨てPostgreSQL 16で 開発/本番/無関係ホスト・承認番号なし・開発ID欠落 の5ケースで停止・通過を確認（2026-11-18）。本番ユーザー名の偽装ケースはpsqlが接続時にUSERを上書きするため試験不能。
\set ON_ERROR_STOP on
-- 1) 接続先が Development プロジェクトであり、Production ではないこと（P8 V2 と同一条件）
select (:'HOST' || ' ' || :'USER') like '%vvsknbmlfvvnrmgtyhbf%' and (:'HOST' || ' ' || :'USER') not like '%wnuxaxbrpudyypzdbdho%' as v3_is_dev \gset
\if :v3_is_dev
\else
do $$ begin raise exception 'P8 V3: connection is not the Development project vvsknbmlfvvnrmgtyhbf. Stop.'; end $$;
\endif
-- 2) 承認番号が指定されていること（例: psql -v approval_ref=APPROVAL-xxxx）
\if :{?approval_ref}
\else
do $$ begin raise exception 'P8 V3: -v approval_ref=<approval id> is required. Stop.'; end $$;
\endif
-- 3) Development DB 固有の識別子が存在すること（P8 V2 と同一）
do $$ begin
  if not exists (select 1 from public.players where id = 'b3f67376-cb75-4b44-8b2d-ef50058a1b98' and slug = 'ryukichi') then
    raise exception 'P8 V3: Development identity (ryukichi) missing. Stop.';
  end if;
end $$;
