# User final QA pack after UI fix

Please check only these items on the new Preview:

1. Home: reload several times; three character images appear, do not duplicate, and change across reloads.
2. Login while signed out: email/password/Login/Signup appear; Logout does not.
3. Login while signed in: `ログイン中`, your email, Logout appear; login form does not.
4. Contact: signed-out and signed-in test messages succeed; signed-in email is prefilled; email fallback remains available.
5. 375px: Home/Auth/Contact have no horizontal overflow, clipping, or overlap.
6. Read Home, Video, FAQ, Feedback quickly and note any remaining unnatural Japanese.
7. Continue the separate Character Detail copy review.

Use clearly identifiable test text and no sensitive information. Report the test email so the verification row can be removed after QA.
