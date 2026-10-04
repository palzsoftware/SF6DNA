-- READ ONLY. Export the two SELECT result sets as JSON arrays for audit-release-publication.py.
-- First SELECT: all 31 published characters, active required categories.
SELECT c.slug AS character,m.id,m.slug,m.name_ja,m.move_type,m.status,private.is_move_public_ready(m.id) AS sql_gate,
EXISTS(SELECT 1 FROM entity_sources es JOIN sources s ON s.id=es.source_id WHERE es.entity_type='move' AND es.entity_id=m.id AND s.reliability_level='official') AS move_evidence,
EXISTS(SELECT 1 FROM move_commands mc JOIN entity_sources es ON es.entity_type='move_command' AND es.entity_id=mc.id JOIN sources s ON s.id=es.source_id WHERE mc.move_id=m.id AND mc.control_scheme='classic' AND s.reliability_level='official') AS command_evidence,
EXISTS(SELECT 1 FROM move_frame_data f JOIN patches p ON p.id=f.valid_from_patch_id WHERE f.move_id=m.id AND f.valid_to_patch_id IS NULL AND p.is_current AND f.verification_status='verified') AS current_verified,
EXISTS(SELECT 1 FROM move_frame_data f JOIN patches p ON p.id=f.valid_from_patch_id JOIN entity_sources es ON es.entity_id=f.id AND es.entity_type IN ('frame','move_frame_data') JOIN sources s ON s.id=es.source_id WHERE f.move_id=m.id AND f.valid_to_patch_id IS NULL AND p.is_current AND f.verification_status='verified' AND s.reliability_level='official') AS frame_evidence
FROM moves m JOIN characters c ON c.id=m.character_id WHERE c.status='published' AND m.status<>'archived' AND m.move_type IN ('normal','unique','target_combo','special','throw','super') ORDER BY c.slug,m.slug;
-- Second SELECT: priority characters, exact command/frame/source relation records.
SELECT m.id,m.character_id,c.slug AS character,m.slug,m.name_ja,m.move_type,m.strength_variant,m.status,m.display_order,
private.is_move_public_ready(m.id) AS sql_gate,
(SELECT jsonb_agg(to_jsonb(mc)) FROM move_commands mc WHERE mc.move_id=m.id AND mc.control_scheme='classic') AS commands,
(SELECT jsonb_agg(to_jsonb(f)) FROM move_frame_data f WHERE f.move_id=m.id) AS frames,
(SELECT jsonb_agg(jsonb_build_object('entity_type',es.entity_type,'entity_id',es.entity_id,'source_id',s.id,'relationship',es.relationship,'relation_note',es.note,'title',s.title,'url',s.url,'source_type',s.source_type,'reliability_level',s.reliability_level,'source_notes',s.notes,'accessed_at',s.accessed_at)) FROM entity_sources es JOIN sources s ON s.id=es.source_id WHERE (es.entity_type='move' AND es.entity_id=m.id) OR (es.entity_type='move_command' AND es.entity_id IN (SELECT id FROM move_commands WHERE move_id=m.id AND control_scheme='classic')) OR (es.entity_type IN ('frame','move_frame_data') AND es.entity_id IN (SELECT id FROM move_frame_data WHERE move_id=m.id))) AS evidence
FROM moves m JOIN characters c ON c.id=m.character_id WHERE c.slug IN ('c-viper','elena','sagat') AND m.status<>'archived' AND m.move_type IN ('normal','unique','target_combo','special','throw','super') ORDER BY m.display_order,m.slug;
