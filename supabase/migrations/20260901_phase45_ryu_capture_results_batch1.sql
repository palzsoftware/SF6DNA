-- Record the first user-provided Ryu capture batch without promoting any item
-- to confirmed. A single successful clip does not satisfy the 10-repetition
-- success criteria. Failed and suboptimal routes remain unresolved.

with capture_result(backlog_id, evidence_key, result_note) as (
  values
    (
      '70591aff-a85a-4354-b9e3-c9934324a07f'::uuid,
      'libfile_4da9e3258a08819182fd1aa6df719019'::text,
      'RYU-03を動画から特定。Evidence=ChatGPT Library libfile_4da9e3258a08819182fd1aa6df719019 / adbe0baa-b0ea-44b5-b0a7-e79aa8d97a6b.MP4。2560x1440、37.763秒。中央・クラシック・片側で、弱P×3→Cラッシュ立ち弱P→引き強P→Cラッシュ立ち強K→立ち強P→強昇龍拳→SA3が連続成立。最終表示は13ヒット・3983ダメージ、Drive全消費、SA3本→0、ハードノックダウン。通常SA3で成立を確認。10回反復、反対向き、距離差・キャラ差は未確認のため未解決。'::text
    ),
    (
      '66ea79b8-a49a-4144-b680-98432f33d7be'::uuid,
      'report:R04-not-connecting'::text,
      'ユーザー実機報告。RYU-04「立ち強Pパニッシュカウンター中央最大候補」はつながらない可能性が高い。どの技間で途切れるかは未確認のため、不成立確定にはせず未解決。'::text
    ),
    (
      'd31a2735-9e82-4f81-a997-a526d1eb0bb3'::uuid,
      'libfile_ebfffadf8f488191a5542e86678815b9'::text,
      'RYU-05としてEvidence=ChatGPT Library libfile_ebfffadf8f488191a5542e86678815b9 / b1dea875-47a4-48b5-aa8b-14d5dec81779.MP4を確認。2560x1440、実映像約23秒。画面端・クラシック・片側で、旋風脚→OD竜巻→強昇龍拳→SA3が連続成立。最終表示は17ヒット・4437ダメージ、Drive2本、SA3本、ハードノックダウン。ユーザー実機報告では、強昇龍拳を省いた旋風脚→OD竜巻→SA3は5200ダメージ。強昇龍拳ありは成立するがダメージ面で下位候補。反復・反対向き・キャラ差は未確認のため未解決。'::text
    ),
    (
      'ca96f642-2499-42b6-847f-51b28ac1ea3c'::uuid,
      'report:R06-not-connecting'::text,
      'ユーザー実機報告。RYU-06「端・立ち強K→立ち強P→OD電刃波掌撃→溜めSA2→旋風脚→OD竜巻→SA1」は最後まで入らない。どの技間で途切れるか、SA2の溜め段階、SA1入力時のゲージ・高度は未確認。現時点では不成立候補として未解決。'::text
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
      'd31a2735-9e82-4f81-a997-a526d1eb0bb3'::uuid,
      'ca96f642-2499-42b6-847f-51b28ac1ea3c'::uuid,
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
      'd31a2735-9e82-4f81-a997-a526d1eb0bb3'::uuid,
      'ca96f642-2499-42b6-847f-51b28ac1ea3c'::uuid,
      'e5b3147e-a5df-489c-b0ec-e1c1bbbcb340'::uuid
    )
      and resolved_at is not null
  ) then
    raise exception 'Ryu capture batch 1 must remain unresolved';
  end if;
end
$$;
