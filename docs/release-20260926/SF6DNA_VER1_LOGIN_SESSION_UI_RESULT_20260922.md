# Login session-aware UI result

`LOGIN_SESSION_UI = PASS`

- Server Component creates the request-scoped Supabase SSR client.
- `auth.getUser()` validates the current user; URL/query email is never trusted.
- Guest: email, password, Login, Signup.
- Authenticated: `ログイン中`, current account email, Logout only.
- Missing session is treated as a guest; other auth-check failures show a safe retry message.
- Password is client state only and is not persisted.
- Existing local-scope logout and diagnosis save/history contracts are unchanged.

Tests cover guest/authenticated structure, missing/error handling, logout success/error/retry/double-click behavior.
