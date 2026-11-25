-- What the public API (anon) can read. Run as a superuser on the ISOLATED DB: psql -d $DB -f api_counts.sql
begin read only; set local role anon;
select 'characters' t, count(*) from characters
union all select 'moves', count(*) from moves
union all select 'move_commands', count(*) from move_commands
union all select 'move_frame_data (all)', count(*) from move_frame_data
union all select 'move_frame_data (current)', count(*) from move_frame_data where valid_to_patch_id is null
union all select 'move_frame_data (superseded)', count(*) from move_frame_data where valid_to_patch_id is not null
union all select 'sources (direct)', count(*) from sources
union all select 'moves named ベガワープ', count(*) from moves where name_ja like '%ベガワープ%';
rollback;
