-- SF6DNA 2026-11-17 フレーム連結破損31件（ブランカ9・本田22） 実DB照合用SELECT
-- 読み取り専用。書き込み・DDL・一時テーブルなし。トランザクションを read only にして最後に rollback する。
-- 照合対象: スナップショット(2026-10-04) の frame ID / move ID / move slug / active値。
-- 既存の docs/move-data-fix-20261117/sql/frame_concat_0[1-4] は変更していない（本ファイルは追加の照合専用）。
begin;
set transaction read only;

with expected(frame_id, move_id, character_slug, move_slug, active_before, active_after) as (values
  ('80838acc-a40b-40da-ad1d-140a162a0187'::uuid, 'b8cf4e4f-a751-4123-b6f9-a9dba542d3e4'::uuid, 'blanka', 'blanka-double-knee-bombs', '9-209-11, 19-20', '9-11, 19-20'),
  ('35662d33-f39a-4482-98aa-b1045223fd82'::uuid, '7f789ff6-ca6a-4567-acb9-e89634bbfae9'::uuid, 'blanka', 'blanka-electric-thunder', '10-2110-11,15-16,20-21', '10-11,15-16,20-21'),
  ('0e8672fb-b2a3-4f97-a448-0c1c3d354672'::uuid, 'e9fa9fbf-40bb-4c6c-afde-168e8f9c1b77'::uuid, 'blanka', 'blanka-capcom-frame-031', '10-2110-11,15-16,20-21', '10-11,15-16,20-21'),
  ('5adf43da-e0ce-4376-bfdb-f40fc61e139d'::uuid, '47ddc7a4-b196-42dc-ae1d-792b60f59fe2'::uuid, 'blanka', 'blanka-electric-thunder-od', '10-2110-11,15-16,20-21', '10-11,15-16,20-21'),
  ('6c1a8375-d29f-4f0c-89e1-3bb28bf47545'::uuid, '3c803b4c-e143-492b-a9da-00a764a7fab3'::uuid, 'blanka', 'blanka-capcom-frame-033', '10-2110-11,15-16,20-21', '10-11,15-16,20-21'),
  ('90b4c08e-75a8-45cd-be3e-bc97bd134633'::uuid, 'e40fcfc2-0402-4a50-b9ab-dddf07ed11a8'::uuid, 'blanka', 'blanka-vertical-od', '7-227-14,17-22', '7-14,17-22'),
  ('42c75290-e3a3-46ad-9fb6-e5055b5fef41'::uuid, '26a8e2d6-b3b7-4073-a3c6-5ad96f0443f5'::uuid, 'blanka', 'blanka-capcom-frame-049', '7-227-14,17-22', '7-14,17-22'),
  ('2a6f6159-7886-4f36-bbdf-609192a9ed10'::uuid, 'e7bf4a22-5799-4f95-a2aa-9aae866f3b7d'::uuid, 'blanka', 'blanka-backstep-od', '8-668-12,41-61,63-66', '8-12,41-61,63-66'),
  ('d3a29659-4e9b-4b72-a908-c4ccef59442e'::uuid, 'e55ae08d-7544-4840-ac84-dba27039b87b'::uuid, 'blanka', 'blanka-capcom-frame-057', '8-668-12,41-61,63-66', '8-12,41-61,63-66'),
  ('705e9448-a972-4439-ae74-28090a7773a0'::uuid, 'ed775473-5629-4300-8280-1527ba680c3b'::uuid, 'e-honda', 'e-honda-standing-hk', '8-148-9, 11-14', '8-9, 11-14'),
  ('2ac425e9-49c6-4e09-9e4a-3d0df15e2373'::uuid, 'bceb16de-9e1e-4f2c-9ae3-1a1167e03d94'::uuid, 'e-honda', 'e-honda-crouching-hk', '11-2411-13,20-24', '11-13,20-24'),
  ('6652c7b5-3254-4155-8a5a-5f0cc2b34192'::uuid, '7145f149-c0d8-45e3-a48b-fd84e0609faa'::uuid, 'e-honda', 'e-honda-hhs-l', '12-3112-13, 18-19, 22, 25-26, 28, 30-31', '12-13, 18-19, 22, 25-26, 28, 30-31'),
  ('2863e7f0-3e01-42d4-b1d8-e52270d977f6'::uuid, '6046d59e-8cba-4f67-9f2f-d344e0392204'::uuid, 'e-honda', 'e-honda-capcom-frame-026', '12-3112-13, 18-19, 22, 25-26, 28, 30-31', '12-13, 18-19, 22, 25-26, 28, 30-31'),
  ('75bc627d-d300-4a1d-a712-2136a6652e64'::uuid, '9ba15351-05f5-481a-925f-647f061a291c'::uuid, 'e-honda', 'e-honda-hhs-m', '16-4716-17, 22-23, 25, 29, 32, 36, 40, 43, 46-47', '16-17, 22-23, 25, 29, 32, 36, 40, 43, 46-47'),
  ('63fefe39-4a2d-47dc-b77e-095a7760412f'::uuid, '5ae96b4f-b46a-4cd5-88ab-be0f0fb7ca22'::uuid, 'e-honda', 'e-honda-capcom-frame-028', '16-4716-17, 22-23, 25, 29, 32, 36, 40, 43, 46-47', '16-17, 22-23, 25, 29, 32, 36, 40, 43, 46-47'),
  ('6ff2e29c-6077-454f-a17b-441a2f6c218a'::uuid, '621f25d8-c0e1-47f1-bd48-1194b4fb7399'::uuid, 'e-honda', 'e-honda-hhs-h', '19-6219-20, 25-26, 30, 34, 38, 42, 46, 50, 53, 56, 59, 61-62', '19-20, 25-26, 30, 34, 38, 42, 46, 50, 53, 56, 59, 61-62'),
  ('25fae304-8637-4c96-b18d-18d808ba08e8'::uuid, 'c68e0ae6-2f07-4c64-8fa2-f2527eb0b32a'::uuid, 'e-honda', 'e-honda-capcom-frame-030', '19-6219-20, 25-26, 30, 34, 38, 42, 46, 50, 53, 56, 59, 61-62', '19-20, 25-26, 30, 34, 38, 42, 46, 50, 53, 56, 59, 61-62'),
  ('3db80893-80c6-4886-ad0c-072b1ae18d65'::uuid, '780dd2de-21f4-464c-973f-6393215eaa7c'::uuid, 'e-honda', 'e-honda-hhs-od', '19-6119-22, 29-30, 34-35, 39-40, 45-46, 49-50, 53-54, 57-58, 60-61', '19-22, 29-30, 34-35, 39-40, 45-46, 49-50, 53-54, 57-58, 60-61'),
  ('e38d330b-8f1a-4c00-a140-dd854cf98c4d'::uuid, '4165c674-e07a-4848-a990-77555f2fc68e'::uuid, 'e-honda', 'e-honda-capcom-frame-032', '19-6119-22, 29-30, 34-35, 39-40, 45-46, 49-50, 53-54, 57-58, 60-61', '19-22, 29-30, 34-35, 39-40, 45-46, 49-50, 53-54, 57-58, 60-61'),
  ('ea20395d-ff91-44a2-91c6-7f09161ee711'::uuid, '9a6640ab-8b12-4128-8369-ca415254fd7b'::uuid, 'e-honda', 'e-honda-headbutt-od', '9-569-13, 14-56', '9-13, 14-56'),
  ('560fa4b7-dfb9-4619-bbc3-8e27ef0f7f90'::uuid, 'd542dbae-aefc-4d1d-8055-c47f1820e019'::uuid, 'e-honda', 'e-honda-smash-l', '11-4811-14, 41-48', '11-14, 41-48'),
  ('b67a34bc-2b79-46b4-a50e-9b8c99e273ea'::uuid, '0d5b6fc5-ea0d-490f-a084-5485682dd0b5'::uuid, 'e-honda', 'e-honda-smash-m', '11-4511-14, 39-45', '11-14, 39-45'),
  ('22e50bbd-3e72-48e8-8019-98baab83316b'::uuid, '8a395c2c-05c6-4f39-9333-cbeaad9c607e'::uuid, 'e-honda', 'e-honda-smash-h', '11-4211-14, 37-42', '11-14, 37-42'),
  ('7695d46c-f283-4bd2-8bc9-bc8de134de4d'::uuid, 'bfa2b33e-e36e-4ca0-a7ba-3a3346e52f7b'::uuid, 'e-honda', 'e-honda-smash-od', '6-396-17, 31-39', '6-17, 31-39'),
  ('aac3a17d-2e2f-4262-b360-bff646b41e57'::uuid, '8d62220b-09e0-4e15-b1fc-e4a02c84686e'::uuid, 'e-honda', 'e-honda-capcom-frame-047', '9-279-11, 25-27', '9-11, 25-27'),
  ('c68fa57a-4383-401e-8ec7-302280408a33'::uuid, '947d31db-4465-488e-b623-42e9ec28a066'::uuid, 'e-honda', 'e-honda-capcom-frame-049', '9-279-11, 25-27', '9-11, 25-27'),
  ('22015ce0-6c29-49f5-a05f-1b08c683b125'::uuid, 'a5deec18-9dad-4b6f-ae6d-73027291211f'::uuid, 'e-honda', 'e-honda-taiho', '12-3312-13, 31-33', '12-13, 31-33'),
  ('57293bda-29c4-4aa4-8525-4018b5f1592c'::uuid, '676a3f3a-ef71-4e64-b692-e38dbbe8c399'::uuid, 'e-honda', 'e-honda-taiho-od', '12-3312-13, 31-33', '12-13, 31-33'),
  ('372b7019-e3cb-4677-8190-8ea3dcfa096a'::uuid, '329ff594-7654-4374-abaf-c6bb4ea6f259'::uuid, 'e-honda', 'e-honda-sa2', '12-3612-13, 16-36', '12-13, 16-36'),
  ('5bf56e66-8f28-45ad-8732-34c714c62cdf'::uuid, 'e7cbe7a0-f67f-4a13-bb22-70198d4e9210'::uuid, 'e-honda', 'e-honda-sa3', '9-229-11,20-22', '9-11,20-22'),
  ('f861e05c-f01b-4593-a89b-bb0760904155'::uuid, 'cbaacfbb-8a5e-4083-a8e3-b764fa6ed9b2'::uuid, 'e-honda', 'e-honda-ca', '9-229-11,20-22', '9-11,20-22')
),
by_id as (
  select e.*, f.id as found_frame_id, f.active as active_now, f.valid_to_patch_id, f.verification_status, f.updated_at,
         m.slug as db_move_slug, m.status as move_status, c.slug as db_character_slug
  from expected e
  left join public.move_frame_data f on f.id = e.frame_id
  left join public.moves m on m.id = f.move_id
  left join public.characters c on c.id = m.character_id
),
by_slug as (
  -- Fallback: current frame rows reached through the move slug (detects frame-ID replacement since the snapshot).
  select e.frame_id, count(f.id) as current_frames_for_slug,
         string_agg(f.id::text || '=' || coalesce(f.active, 'NULL'), ' | ' order by f.id) as current_frames_detail
  from expected e
  join public.moves m on m.slug = e.move_slug
  left join public.move_frame_data f on f.move_id = m.id and f.valid_to_patch_id is null
  group by e.frame_id
),
evidence as (
  select e.frame_id, count(es.id) filter (where s.reliability_level = 'official') as official_sources, count(es.id) as all_sources
  from expected e
  left join public.entity_sources es on es.entity_type = 'move_frame_data' and es.entity_id = e.frame_id
  left join public.sources s on s.id = es.source_id
  group by e.frame_id
)
select b.character_slug, b.move_slug, b.frame_id, b.active_before as expected_active, b.active_now, b.active_after as proposed_active,
  b.move_status, b.verification_status, b.updated_at, s.current_frames_for_slug, s.current_frames_detail,
  v.official_sources, v.all_sources,
  case
    when b.found_frame_id is null then 'MISSING_FRAME_ID'
    when b.move_id is distinct from (select f2.move_id from public.move_frame_data f2 where f2.id = b.frame_id) then 'MOVE_ID_MISMATCH'
    when b.db_move_slug is distinct from b.move_slug then 'MOVE_SLUG_MISMATCH'
    when b.db_character_slug is distinct from b.character_slug then 'CHARACTER_MISMATCH'
    when b.valid_to_patch_id is not null then 'NOT_CURRENT_FRAME'
    when coalesce(s.current_frames_for_slug, 0) <> 1 then 'MULTIPLE_OR_NO_CURRENT_FRAMES'
    when b.active_now = b.active_after then 'ALREADY_APPLIED'
    when b.active_now is distinct from b.active_before then 'VALUE_CHANGED_SINCE_SNAPSHOT'
    else 'READY' end as status
from by_id b
left join by_slug s on s.frame_id = b.frame_id
left join evidence v on v.frame_id = b.frame_id
order by b.character_slug, b.move_slug;

-- 集計（期待: READY 31）
with expected(frame_id, active_before) as (values

  ('80838acc-a40b-40da-ad1d-140a162a0187'::uuid, '9-209-11, 19-20'),
  ('35662d33-f39a-4482-98aa-b1045223fd82'::uuid, '10-2110-11,15-16,20-21'),
  ('0e8672fb-b2a3-4f97-a448-0c1c3d354672'::uuid, '10-2110-11,15-16,20-21'),
  ('5adf43da-e0ce-4376-bfdb-f40fc61e139d'::uuid, '10-2110-11,15-16,20-21'),
  ('6c1a8375-d29f-4f0c-89e1-3bb28bf47545'::uuid, '10-2110-11,15-16,20-21'),
  ('90b4c08e-75a8-45cd-be3e-bc97bd134633'::uuid, '7-227-14,17-22'),
  ('42c75290-e3a3-46ad-9fb6-e5055b5fef41'::uuid, '7-227-14,17-22'),
  ('2a6f6159-7886-4f36-bbdf-609192a9ed10'::uuid, '8-668-12,41-61,63-66'),
  ('d3a29659-4e9b-4b72-a908-c4ccef59442e'::uuid, '8-668-12,41-61,63-66'),
  ('705e9448-a972-4439-ae74-28090a7773a0'::uuid, '8-148-9, 11-14'),
  ('2ac425e9-49c6-4e09-9e4a-3d0df15e2373'::uuid, '11-2411-13,20-24'),
  ('6652c7b5-3254-4155-8a5a-5f0cc2b34192'::uuid, '12-3112-13, 18-19, 22, 25-26, 28, 30-31'),
  ('2863e7f0-3e01-42d4-b1d8-e52270d977f6'::uuid, '12-3112-13, 18-19, 22, 25-26, 28, 30-31'),
  ('75bc627d-d300-4a1d-a712-2136a6652e64'::uuid, '16-4716-17, 22-23, 25, 29, 32, 36, 40, 43, 46-47'),
  ('63fefe39-4a2d-47dc-b77e-095a7760412f'::uuid, '16-4716-17, 22-23, 25, 29, 32, 36, 40, 43, 46-47'),
  ('6ff2e29c-6077-454f-a17b-441a2f6c218a'::uuid, '19-6219-20, 25-26, 30, 34, 38, 42, 46, 50, 53, 56, 59, 61-62'),
  ('25fae304-8637-4c96-b18d-18d808ba08e8'::uuid, '19-6219-20, 25-26, 30, 34, 38, 42, 46, 50, 53, 56, 59, 61-62'),
  ('3db80893-80c6-4886-ad0c-072b1ae18d65'::uuid, '19-6119-22, 29-30, 34-35, 39-40, 45-46, 49-50, 53-54, 57-58, 60-61'),
  ('e38d330b-8f1a-4c00-a140-dd854cf98c4d'::uuid, '19-6119-22, 29-30, 34-35, 39-40, 45-46, 49-50, 53-54, 57-58, 60-61'),
  ('ea20395d-ff91-44a2-91c6-7f09161ee711'::uuid, '9-569-13, 14-56'),
  ('560fa4b7-dfb9-4619-bbc3-8e27ef0f7f90'::uuid, '11-4811-14, 41-48'),
  ('b67a34bc-2b79-46b4-a50e-9b8c99e273ea'::uuid, '11-4511-14, 39-45'),
  ('22e50bbd-3e72-48e8-8019-98baab83316b'::uuid, '11-4211-14, 37-42'),
  ('7695d46c-f283-4bd2-8bc9-bc8de134de4d'::uuid, '6-396-17, 31-39'),
  ('aac3a17d-2e2f-4262-b360-bff646b41e57'::uuid, '9-279-11, 25-27'),
  ('c68fa57a-4383-401e-8ec7-302280408a33'::uuid, '9-279-11, 25-27'),
  ('22015ce0-6c29-49f5-a05f-1b08c683b125'::uuid, '12-3312-13, 31-33'),
  ('57293bda-29c4-4aa4-8525-4018b5f1592c'::uuid, '12-3312-13, 31-33'),
  ('372b7019-e3cb-4677-8190-8ea3dcfa096a'::uuid, '12-3612-13, 16-36'),
  ('5bf56e66-8f28-45ad-8732-34c714c62cdf'::uuid, '9-229-11,20-22'),
  ('f861e05c-f01b-4593-a89b-bb0760904155'::uuid, '9-229-11,20-22')
)
select count(*) as expected_rows,
  count(f.id) as found_rows,
  count(*) filter (where f.active = e.active_before and f.valid_to_patch_id is null) as ready_rows
from expected e left join public.move_frame_data f on f.id = e.frame_id;

rollback;
