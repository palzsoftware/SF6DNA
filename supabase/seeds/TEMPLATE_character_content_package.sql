-- Reusable character package ingestion template.
-- Replace :character_slug and populate only source-confirmed rows.
-- Never copy JP gameplay facts into another character.

-- 0. Context
-- select id from public.characters where slug = ':character_slug';
-- select id from public.patches where is_current = true;

-- 1. Sources
-- Insert official/current sources first, then secondary references.
-- Keep source type/reliability explicit.

-- 2. Moves
-- insert into public.moves (...)
-- status should remain 'draft' until verification gate passes.

-- 3. Commands
-- insert Classic and Modern into public.move_commands.
-- If Modern mapping is not directly confirmed, omit it instead of guessing.

-- 4. Frame data
-- insert into public.move_frame_data with valid_from_patch_id.
-- use verification_status = 'unverified' or 'reviewed' until direct verification.

-- 5. Aliases
-- insert into public.move_aliases.
-- include community shorthand only when actually used/confirmed.

-- 6. Source links
-- insert entity_sources for move/combo/setup/sequence/counter/training/player/video as appropriate.

-- 7. Combos
-- insert into public.combos.
-- cover small/medium/heavy starters, PC, DR, DI, corner, SA and burnout when applicable.

-- 8. Setups
-- insert into public.setups.
-- frame advantage and setup claims must be verified, otherwise leave null/review.

-- 9. Sequences
-- insert into public.sequences.
-- true blockstring/mash/jump/parry/DR reversal/invincible claims require verification.

-- 10. Counters
-- insert into public.counters.
-- distinguish guaranteed punish from matchup/read-based advice.

-- 11. Training
-- insert into public.trainings plus training_relations.
-- record exact dummy recording/playback/success criteria whenever possible.

-- 12. Player / Tournament / Match / Video
-- insert only current, verifiable references.

-- 13. Character Trait Score
-- insert all 12 character_trait_scores as draft/review first.
-- publish only after source-backed review.

-- 14. Package tracker
-- update public.character_content_packages
-- set rollout_status='in_progress', ...
-- where character_id=(select id from public.characters where slug=':character_slug');

-- 15. Completion gate
-- Complete only when current patch, sources, core gameplay package, references,
-- trait mapping, and verification checks all pass.
