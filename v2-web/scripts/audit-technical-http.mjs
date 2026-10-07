// Read-only HTML checks; this does not execute JavaScript or claim browser accessibility.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const base = new URL(process.argv[2] || 'http://127.0.0.1:3088');
const routes = ['/', '/characters', '/players', '/videos', '/diagnosis', '/me/training', '/sources', '/about', '/faq', '/contact', '/privacy', '/terms', '/disclaimer', '/search', '/feedback', '/changelog', '/auth', '/diagnosis/history', '/characters/unknown-ws8-slug', '/players/unknown-ws8-slug', '/videos/unknown-ws8-slug', '/unknown-ws8-route', '/daily', '/coach', '/combos', '/training'];
const results = [];
for (const route of routes) {
  const expected404 = /unknown-ws8|^\/daily$|^\/coach$|^\/combos$|^\/training$/.test(route);
  try {
    const response = await fetch(new URL(route, base), { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    const html = await response.text();
    const dom = new JSDOM(html, { url: response.url });
    const doc = dom.window.document;
    const main = doc.querySelector('main');
    const clone = main?.cloneNode(true);
    clone?.querySelectorAll('script,style').forEach(node => node.remove());
    const text = clone?.textContent ?? '';
    const links = [...doc.querySelectorAll('a[href]')].map(node => node.getAttribute('href'));
    const brokenAnchors = links.filter(href => href.startsWith('#') && href.length > 1).filter(href => {
      try { return !doc.getElementById(decodeURIComponent(href.slice(1))); } catch { return true; }
    });
    const unnamedButtons = [...doc.querySelectorAll('button')].filter(node => !node.textContent?.trim() && !node.getAttribute('aria-label') && !node.getAttribute('aria-labelledby')).length;
    const missingLabels = [...doc.querySelectorAll('input,select,textarea')].filter(node => node.getAttribute('type') !== 'hidden' && node.getAttribute('aria-hidden') !== 'true' && !node.closest('[aria-hidden="true"]') && !node.labels?.length && !node.getAttribute('aria-label') && !node.getAttribute('aria-labelledby')).length;
    const result = { route, expected404, status: response.status, statusPass: response.status === (expected404 ? 404 : 200), title: doc.title, description: doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? null, canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null, robots: doc.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null, h1Count: doc.querySelectorAll('h1').length, main: Boolean(main), rawNull: /\b(undefined|null)\b/.test(text), brokenAnchors, unnamedButtons, missingLabels, missingAlt: doc.querySelectorAll('img:not([alt])').length };
    results.push(result);
    dom.window.close();
  } catch (error) { results.push({ route, statusPass: false, error: error.name, transportCode: error.cause?.code ?? null }); }
}
const duplicateTitles = [...new Set(results.filter(row => !row.expected404 && row.title).map(row => row.title))].flatMap(title => {
  const routes = results.filter(row => !row.expected404 && row.title === title).map(row => row.route);
  return routes.length > 1 ? [{ title, routes }] : [];
});
const htmlComplete = results.every(row => !row.error);
const report = { mode: 'HTTP_HTML_ONLY_NO_DATABASE_CREDENTIALS', results, duplicateTitles,
  gates: { ROUTES_PASS: htmlComplete ? results.every(row => row.statusPass) ? 'PASS_TESTED_ROUTES_ONLY' : 'FAIL' : 'UNAVAILABLE_TRANSPORT', NO_RAW_NULL: htmlComplete ? results.every(row => !row.rawNull) ? 'PASS_HTML_ONLY' : 'FAIL' : 'NOT_RUN', NO_BROKEN_INTERNAL_LINK: htmlComplete ? results.every(row => row.brokenAnchors?.length === 0) ? 'PASS_LOCAL_ANCHORS_ONLY' : 'FAIL' : 'NOT_RUN', ACCESSIBILITY_CRITICAL_PASS: 'NOT_RUN_BROWSER', SEO_REQUIRED_PASS: 'REVIEW_REQUIRED', NO_CONSOLE_ERROR: 'NOT_RUN_BROWSER', NO_MAJOR_OVERFLOW: 'NOT_RUN_BROWSER' },
  limitations: ['No hydration, console, layout, keyboard or screen reader checks', 'Dynamic published details need actual read-only data', 'Expected 404 follows current disabled flags, not every future candidate', 'No form submission or authenticated persistence was performed'] };
if (process.argv[3]) writeFileSync(resolve(process.argv[3]), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ tested: results.length, gates: report.gates, anomalies: results.filter(row => !row.statusPass || row.rawNull || row.brokenAnchors?.length || row.unnamedButtons || row.missingLabels || row.missingAlt || row.h1Count !== 1), duplicateTitles }, null, 2));
if (results.some(row => !row.statusPass)) process.exitCode = 1;
