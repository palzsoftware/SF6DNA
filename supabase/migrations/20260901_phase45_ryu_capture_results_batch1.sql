-- Record the first user-provided Ryu capture batch without promoting any item
-- to confirmed. A single successful clip does not satisfy the 10-repetition
-- success criteria, and two of the clips still require a targeted retake.

with capture_result(backlog_id, evidence_key, result_note) as (
  values
    (
      '70591aff-a85a-4354-b9e3-c9934324a07f'::uuid,
      'libfile_4da9e3258a08819182fd1aa6df719019'::text,
      'RYU-03を動画から特定。Evidence=ChatGPT Library libfile_4da9e3258a08819182fd1aa6df719019 / adbe0baa-b0ea-44b5-b0a7-e79aa8d97a6b.MP4。2560x1440、37.763秒。中央・クラシック・片側で、弱P×3→Cラッシュ立ち弱P→引き強P→Cラッシュ立ち強K→立ち強P→強昇龍拳→SA3が連続成立。最終表示は13ヒット・3983ダメージ、Drive全消費、SA3本→0、ハードノックダウン。通常SA3で成立を確認。10回反復、反対向き、距離差・キャラ差は未確認のため未解決。'::text
    ),
    (
      '66ea79b8-a49a-4144-b680-98432f33d7be'::uuid,
      'libfile_ebfffadf8f488191a5542e86678815b9'::text,
      'RYU-04を動画から特定。Evidence=ChatGPT Library libfile_ebfffadf8f488191a5542e86678815b9 / b1dea875-47a4-48b5-aa8b-14d5dec81779.MP4。2560x1440、実映像約23秒（ファイル継続時間150.525秒、後半は実質静止）。クラシック・片側で、立ち強P(PC)→強波掌撃→ドライブラッシュ引き強K→中竜巻→Cラッシュ引き強K→Cラッシュ引き強K→強昇龍拳→SA3が連続成立。最終表示は17ヒット・4437ダメージ、Drive全消費、SA3本→0、ハードノックダウン。開始位置が画面端寄りのため「中央」の確認には数えず、10回反復、反対向き、距離差・キャラ差も未確認のまま未解決。'::text
    ),
    (
      'e5b3147e-a5df-489c-b0ec-e1c1bbbcb340'::uuid,
      'libfile_13d6ba6f9ee081918a89e56c87af76ea'::text,
      'RYU-02再撮影を動画から特定。Evidence=ChatGPT Library libfile_13d6ba6f9ee081918a89e56c87af76ea / 5c21da96-4790-49ef-85e2-dd72050a4827.MP4。2560x1440、10.323秒。しゃがみ中P→OD上段足刀蹴り→溜めSA2までは3ヒット・3650ダメージで連続成立。続く強竜巻旋風脚はダミーの着地後に空振りし、コンボ表示は3650のまま。2回目も完全成立には至っていないため、SA2の溜め時間をさらに短くするか、強竜巻の入力を早めて再撮影が必要。未解決。'::text
    )
),
matched as (
  select cb.id, cr.evidence_key, cr.result_note
  from capture_result cr
  join public.capture_backlog cb on cb.id = cr.backlog_id
  where coalesce(cb.result_notes, '') not like '%' || cr.evidence_key || '%'
)
update public.capture_backlog cb
set
  capture_status = 'provided',
  requested_at = coalesce(cb.requested_at, now()),
  provided_at = coalesce(cb.provided_at, now()),
  result_notes = concat_ws(
    E'\n',
    nullif(cb.result_notes, ''),
    to_char(now() at time zone 'Asia/Tokyo', 'YYYY-MM-DD HH24:MI') || ' JST'
      || ' [provided] ' || m.result_note
  ),
  updated_at = now()
from matched m
where cb.id = m.id;

do $$
begin
  if exists (
    select 1
    from public.capture_backlog
    where id in (
      '70591aff-a85a-4354-b9e3-c9934324a07f'::uuid,
      '66ea79b8-a49a-4144-b680-98432f33d7be'::uuid,
      'e5b3147e-a5df-489c-b0ec-e1c1bbbcb340'::uuid
    )
      and capture_status <> 'provided'
  ) then
    raise exception 'Ryu capture batch 1 status audit failed';
  end if;

  if exists (
    select 1
    from public.capture_backlog
    where id in (
      '70591aff-a85a-4354-b9e3-c9934324a07f'::uuid,
      '66ea79b8-a49a-4144-b680-98432f33d7be'::uuid,
      'e5b3147e-a5df-489c-b0ec-e1c1bbbcb340'::uuid
    )
      and resolved_at is not null
  ) then
    raise exception 'Ryu capture batch 1 must remain unresolved';
  end if;
end
$$;
