-- Phase49: polish the generated Japanese Move copy after a cross-type sample
-- review. Publication and verification states remain unchanged.

update public.moves
set description_ja = '近距離で相手をつかむ投げ技です。打撃をガードする相手を崩すときに使います。',
    usage_summary_ja = '打撃をガードする相手への崩しとして使います。投げ後の距離や有利時間も確認しておきましょう。',
    updated_at = now()
where status <> 'archived'
  and move_type = 'throw';

update public.moves
set usage_summary_ja = '対戦の進行には直接必要ありません。固有効果がある場合のみ、十分な隙がある場面で使います。',
    updated_at = now()
where status <> 'archived'
  and move_type = 'taunt';

update public.moves
set description_ja = replace(description_ja, '。 ', '。'),
    usage_summary_ja = replace(usage_summary_ja, '。 ', '。'),
    updated_at = now()
where status <> 'archived'
  and (
    description_ja like '%。 %'
    or usage_summary_ja like '%。 %'
  );
