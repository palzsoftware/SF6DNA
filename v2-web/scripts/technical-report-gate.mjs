// SF6DNA RC technical QA report postprocessor; read-only, fail-closed.
// Input: existing Browser technical report. Does not handle browser credentials.
const PASS = 'PASS_TESTED_SCOPE';
const AUTH = /(?:Vercel Authentication|Authentication Required|Sign in to Vercel|Vercel Deployment Protection)/i;
const KEY = (route, width) => `${width}\u0000${route}`;
const VALID_WIDTH = w => Number.isInteger(w) && w >= 320 && w <= 2560;
const VALID_ROUTE = r => typeof r === 'string' && /^\/(?!\/)[^?#]*$/.test(r) && !r.includes('\\');

export function verifyManifest({ routes, widths, expectedStatuses = {} } = {}) {
  if (!Array.isArray(routes) || !routes.length || routes.some(r => !VALID_ROUTE(r)) || new Set(routes).size !== routes.length) throw new Error('INVALID_ROUTE_MANIFEST');
  if (!Array.isArray(widths) || !widths.length || widths.some(w => !VALID_WIDTH(w)) || new Set(widths).size !== widths.length) throw new Error('INVALID_WIDTH_MANIFEST');
  if (!expectedStatuses || typeof expectedStatuses !== 'object' || Array.isArray(expectedStatuses) || Object.entries(expectedStatuses).some(([r, s]) => !routes.includes(r) || ![200, 404].includes(s))) throw new Error('INVALID_EXPECTED_STATUSES');
  return true;
}

export function verdict({ report, routes, widths, expectedStatuses = {} }) {
  verifyManifest({ routes, widths, expectedStatuses });
  const findings = [];
  const countByCode = new Map();
  const flag = code => countByCode.set(code, (countByCode.get(code) || 0) + 1);
  const expected = new Set(widths.flatMap(w => routes.map(r => KEY(r, w))));
  const observed = new Set();
  if (!report || !Array.isArray(report.results)) throw new Error('INVALID_TECHNICAL_REPORT');
  for (const row of report.results) {
    if (!row || !VALID_ROUTE(row.route) || !VALID_WIDTH(row.width)) { flag('INVALID_REPORT_ROW'); continue; }
    const k = KEY(row.route, row.width);
    if (!expected.has(k)) flag('UNEXPECTED_ROUTE_WIDTH');
    if (observed.has(k)) flag('DUPLICATE_ROUTE_WIDTH');
    observed.add(k);
    if (row.unavailable) { flag('UNAVAILABLE_ROUTE'); continue; }
    const expectedStatus = expectedStatuses[row.route] ?? 200;
    if (!Number.isInteger(row.status) || row.status < 100 || row.status > 599) { flag('INVALID_HTTP_STATUS'); continue; }
    const blockedAuth = row.status === 401 || row.status === 403 || AUTH.test(String(row.title || ''));
    if (blockedAuth) { flag('AUTH_CHALLENGE'); continue; }
    if (row.status !== expectedStatus) flag('HTTP_STATUS_MISMATCH');
    if (expectedStatus === 404) continue;
    if (!String(row.title || '').trim()) flag('MISSING_TITLE');
    if (!String(row.description || '').trim()) flag('MISSING_META_DESCRIPTION');
    if (row.canonical == null) flag('MISSING_CANONICAL_REVIEW');
    if (!('main' in row)) flag('MAIN_NOT_MEASURED');
    else if (!row.main) flag('MISSING_MAIN');
    if (row.h1Count !== 1) flag('H1_COUNT_MISMATCH');
    if (row.rawNull) flag('RAW_NULL');
    if (!Number.isFinite(row.overflow) || row.overflow > 1) flag('OVERFLOW');
    if ((row.errors?.length || 0) > 0) flag('BROWSER_CONSOLE_OR_PAGE_ERROR');
    if ((row.networkFailures?.length || 0) > 0) flag('NETWORK_FAILURE_REVIEW');
    if ((row.missingAlt || 0) > 0) flag('MISSING_IMAGE_ALT');
    if ((row.unnamedButtons || 0) > 0) flag('UNNAMED_BUTTON');
    if ((row.missingCommandNames || 0) > 0) flag('MISSING_COMMAND_LABEL');
    if ((row.rawNumericCommands?.length || 0) > 0) flag('RAW_NUMERIC_COMMAND');
    if (!row.axe) flag('AXE_NOT_EXECUTED');
    else if ((row.axe.violations || []).some(v => ['critical', 'serious'].includes(v.impact))) flag('AXE_CRITICAL_VIOLATION');
  }
  for (const k of expected) if (!observed.has(k)) flag('MISSING_ROUTE_WIDTH');
  const mandatory = new Set(['INVALID_REPORT_ROW','UNEXPECTED_ROUTE_WIDTH','DUPLICATE_ROUTE_WIDTH','UNAVAILABLE_ROUTE','INVALID_HTTP_STATUS','AUTH_CHALLENGE','HTTP_STATUS_MISMATCH','MISSING_TITLE','MISSING_META_DESCRIPTION','MISSING_MAIN','H1_COUNT_MISMATCH','RAW_NULL','OVERFLOW','BROWSER_CONSOLE_OR_PAGE_ERROR','MISSING_IMAGE_ALT','UNNAMED_BUTTON','MISSING_COMMAND_LABEL','RAW_NUMERIC_COMMAND','AXE_CRITICAL_VIOLATION','MISSING_ROUTE_WIDTH']);
  const incomplete = new Set(['AXE_NOT_EXECUTED','NETWORK_FAILURE_REVIEW','MISSING_CANONICAL_REVIEW','MAIN_NOT_MEASURED']);
  for (const [code, count] of [...countByCode].sort(([a],[b]) => a.localeCompare(b))) findings.push({ code, count });
  const blocked = (countByCode.get('AUTH_CHALLENGE') || 0) > 0;
  const failures = findings.filter(f => mandatory.has(f.code));
  const reviews = findings.filter(f => incomplete.has(f.code));
  const status = blocked ? 'BLOCKED_AUTH' : failures.length ? 'FAIL' : reviews.length ? 'INCOMPLETE_REVIEW' : PASS;
  return { kind:'SF6DNA_RC_TECHNICAL_QA_FAIL_CLOSED', status, pass:status === PASS,
    scope:{ routes:routes.length, widths:widths.length, requiredCombinations:expected.size, observedCombinations:observed.size },
    findings,
    limitation:'Evaluates supplied technical-browser JSON only. Does not execute Preview QA or verify session/DB/Security P0. SSO title detection is best-effort, not authorization proof.' };
}
