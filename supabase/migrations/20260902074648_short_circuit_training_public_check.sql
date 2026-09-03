
alter policy "public read release-ready trainings"
on public.trainings
using (
  case
    when status = 'published'
     and verification_status = 'verified'
     and valid_to_patch_id is null
    then private.is_training_public_ready(id)
    else false
  end
);
