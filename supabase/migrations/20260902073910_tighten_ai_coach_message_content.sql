
alter table public.ai_coach_messages
  add constraint ai_coach_messages_nonblank_content_check
    check (btrim(content) <> ''),
  add constraint ai_coach_user_messages_no_grounding_check
    check (role <> 'user' or grounding_refs = '[]'::jsonb);
