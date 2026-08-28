-- Phase16 P16-03: Character Guide Public Verification Gate
-- Align character guide sections with the established strategy rule:
-- public strategy content requires both published + verified.
-- No data rows are modified by this migration.

drop policy if exists "public read published character guides" on public.character_guide_sections;
drop policy if exists "public read verified published character guides" on public.character_guide_sections;

create policy "public read verified published character guides"
on public.character_guide_sections
for select
using (
  status = 'published'
  and verification_status = 'verified'
);
