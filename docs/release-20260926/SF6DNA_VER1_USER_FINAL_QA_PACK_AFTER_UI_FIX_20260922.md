# User final QA pack after UI fix

Please check only these items on the new Preview:

1. Home: reload several times; three character images appear, do not duplicate, and change across reloads.
2. Login while signed out: email/password/Login/Signup appear; Logout does not.
3. Login while signed in: `ログイン中`, your email, Logout appear; login form does not.
4. Contact: form fields and the connection-pending notice appear; email fallback opens the correct address.
5. 375px: Home/Auth/Contact have no horizontal overflow, clipping, or overlap.
6. Read Home, Video, FAQ, Feedback quickly and note any remaining unnatural Japanese.
7. Continue the separate Character Detail copy review.

Do not test site-internal Contact delivery yet; its backend is approval-required and deliberately fail-closed.
