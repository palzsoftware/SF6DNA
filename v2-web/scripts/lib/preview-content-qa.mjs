// Pure, read-only checks for public-facing Preview text. Never exports body text.
const FATAL = [
  ['UNINITIALIZED_VALUE', /\b(?:undefined|null|NaN)\b/g],
  ['DEVELOPMENT_MARKER', /\b(?:TODO|TBD|FIXME|debug)\b/gi],
  ['UNRENDERED_TEMPLATE', /\{\{[^{}]{2,100}\}\}|\$\{[^{}]{2,100}\}/g],
  ['CREDENTIAL_NAME_VALUE', /\b(?:SUPABASE_SERVICE_ROLE_KEY|OPENAI_API_KEY|VERCEL_TOKEN)\s*[:=]\s*\S+/gi],
];
const WARN = [
  ['PLACEHOLDER_COPY', /\b(?:coming soon|placeholder)\b|(?:仮表示|作成中|準備中|確認中)/gi],
  ['DRAFT_COPY', /\b(?:draft|unverified)\b/gi],
  ['GENERIC_STRATEGY_COPY', /(?:この技は強力です|状況に応じて使いましょう)/g],
];
const AUTH_TITLE = /(?:Vercel Authentication|Authentication Required|Sign in to Vercel)/i;
const AUTH_BRAND = /(?:Vercel Authentication|vercel\.com\/sso|Vercel Deployment Protection)/i;

export function samePath(a, b) {
  const normalize = p => {
    try { return decodeURI(new URL(p, 'https://qa.invalid').pathname).replace(/\/+$/, '') || '/'; }
    catch { return p; }
  };
  return normalize(a) === normalize(b);
}

export function detectPreviewAuthGate({ title = '', bodyText = '', currentUrl = '', htmlAuthPageHint = false } = {}) {
  // A site's own /auth page is not a Vercel SSO challenge.
  if (htmlAuthPageHint) return true;
  if (AUTH_TITLE.test(title)) return true;
  if (AUTH_BRAND.test(bodyText.slice(0, 1200))) return true;
  if (/vercel\.com\/(?:sso|login)/i.test(currentUrl)) return true;
  return false;
}

export function auditPublicText({ bodyText = '', title = '', currentUrl = '', requestedPath = '/', expectedStatus = 200, status = 200, htmlAuthPageHint = false } = {}) {
  const blockedAuth = status === 401 || status === 403 || detectPreviewAuthGate({ title, bodyText, currentUrl, htmlAuthPageHint });
  const isExpectedPublicPage = expectedStatus === 200;
  const findings = [];
  const warnings = [];
  if (blockedAuth) return { blockedAuth: true, findings, warnings, visibleTextChars: bodyText.length };
  if (!isExpectedPublicPage || status !== 200) return { blockedAuth: false, findings, warnings, visibleTextChars: bodyText.length };
  if (!bodyText.trim()) findings.push({ code: 'EMPTY_VISIBLE_TEXT' });
  if (!title.trim()) findings.push({ code: 'EMPTY_TITLE' });
  if (currentUrl && !samePath(requestedPath, currentUrl)) findings.push({ code: 'UNEXPECTED_ROUTE_REDIRECT' });
  // Do not output match samples: public text may contain sensitive data or URL tokens.
  for (const [code, re] of FATAL) {
    const count = [...bodyText.matchAll(re)].length;
    if (count) findings.push({ code, count: Math.min(count, 1000) });
  }
  for (const [code, re] of WARN) {
    const count = [...bodyText.matchAll(re)].length;
    if (count) warnings.push({ code, count: Math.min(count, 1000) });
  }
  return { blockedAuth: false, findings, warnings, visibleTextChars: bodyText.length };
}
