# Auth/save DB read-only contract — 2026-09-30

Project wnuxaxbrpudyypzdbdho; SELECT of pg_proc / pg_policies / pg_indexes only. No function invocation/save.

save_diagnosis_result_with_answers uses auth.uid and raises authentication_required for NULL. Invoker PL/pgSQL, search_path ''. Validates published diagnosis question count, question/option membership and unique question answers. Insert conflict key is (user_id, diagnosis_id, request_id) WHERE request_id IS NOT NULL. Identical samekey payload and answers returns existing result id; mismatched samekey raises idempotency_key_reused_with_different_payload. Different request_id is not deduplicated by equal payload. NULLrequest_id bypasses partial unique index.

Exact DB index: diagnosis_results_user_diagnosis_request_key UNIQUE(user_id,diagnosis_id,request_id) WHERE request_id IS NOT NULL.

History results SELECT: authenticated roles, owner auth.uid OR private.is_admin; additional admin ALL policy via private.is_admin. Answers SELECT: authenticated, EXISTS diagnosis_results with matching result id and owner auth.uid. This documents policy definitions, not session end-to-end proof.

Conclusion: if UI completed-state reload generates new request key then automatic save can create another identical result. Client behavior needs mocked/browser reproduction; preserve completed diagnosis request identity if demonstrated. Do not infer actual duplicate existing DBrows or modify DB.
