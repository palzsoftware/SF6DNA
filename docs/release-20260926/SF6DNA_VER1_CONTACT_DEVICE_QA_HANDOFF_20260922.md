# Contact final device QA handoff

Use the latest RC Preview and check only the following:

1. Open `/contact` while signed out and submit one short Guest inquiry.
2. Confirm the success message appears and the form clears only after success.
3. Sign in, reopen `/contact`, and confirm the account email is prefilled.
4. Submit one Auth inquiry and confirm the same success state.
5. Try an invalid email or fewer than 10 message characters and confirm it is blocked without losing the draft.
6. Confirm Contact/Privacy/Terms explain the stored fields and 180-day deletion.

Do not include real sensitive information in QA messages. Use a clearly identifiable test message so it can be removed from the inbox after QA.
