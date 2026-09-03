
alter policy "public read release-ready character trait scores"
on public.character_trait_scores
using (
  case
    when status = 'published'
     and verification_status = 'verified'
    then private.is_character_trait_score_public_ready(id)
    else false
  end
);
