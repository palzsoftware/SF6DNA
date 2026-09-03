
revoke execute on function public.save_diagnosis_result_with_answers(uuid, jsonb, jsonb) from anon;
revoke execute on function public.get_improvement_priorities(uuid, integer) from anon;
revoke execute on function public.get_training_recommendations_for_result(uuid, uuid, uuid, integer) from anon;
revoke execute on function public.get_ai_coach_context(integer, integer) from anon;
