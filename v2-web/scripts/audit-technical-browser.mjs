// Requires Playwright + Chromium. Never submits forms or performs database mutations.
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const moduleName = process.env.SF6DNA_PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(moduleName);
const base = new URL(process.argv[2] || 'http://127.0.0.1:3088');
const routes = process.argv[4] ? JSON.parse(readFileSync(resolve(process.argv[4]), 'utf8')) : ['/', '/characters', '/players', '/videos', '/diagnosis', '/me/training', '/sources', '/about', '/faq', '/contact', '/privacy', '/terms', '/disclaimer', '/search'];
if (!Array.isArray(routes) || routes.some(route => typeof route !== 'string' || !route.startsWith('/') || route.startsWith('//'))) throw new Error('Routes must be same-origin path strings');
const widths = process.env.SF6DNA_QA_WIDTHS ? JSON.parse(process.env.SF6DNA_QA_WIDTHS) : [320, 375, 390, 430, 768, 1024, 1440];
if (!Array.isArray(widths) || widths.some(width => !Number.isInteger(width) || width < 320 || width > 2560)) throw new Error('Invalid QA widths');
const browser = await chromium.launch({ headless: true,
  ...(process.env.SF6DNA_CHROMIUM_PATH ? { executablePath: process.env.SF6DNA_CHROMIUM_PATH } : {}),
  ...(process.env.SF6DNA_CHROMIUM_ARGS ? { args: JSON.parse(process.env.SF6DNA_CHROMIUM_ARGS) } : {}),
});
const results = [];
const expectedStatuses = JSON.parse(process.env.SF6DNA_QA_EXPECTED_STATUSES || '{}');
const context = await browser.newContext();
try {
  for (const width of widths) {
    for (const route of routes) {
      const page = await context.newPage();
      await page.setViewportSize({ width, height: 900 });
      const errors = [], warnings = [], networkFailures = [];
      page.on('pageerror', error => errors.push(error.name));
      page.on('console', message => {
        const type = message.type();
        if (type !== 'error' && type !== 'warning') return;
        const text = message.text();
        let path = null;
        try { path = new URL(message.location().url).pathname; } catch { /* Console can have no URL. */ }
        const item = { category: /hydration/i.test(text) ? 'hydration' : /failed to load resource/i.test(text) ? 'resource' : 'other', status: Number(text.match(/status of (\d+)/)?.[1]) || null, path, fingerprint: createHash('sha256').update(text).digest('hex').slice(0, 12) };
        (type === 'error' ? errors : warnings).push(item);
      });
      page.on('requestfailed', request => networkFailures.push({ path: new URL(request.url()).pathname, type: request.resourceType(), code: request.failure()?.errorText }));
      try {
        const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle', timeout: 30000 });
        let axe = null;
        if (process.env.SF6DNA_AXE_SCRIPT) {
          await page.addScriptTag({ content: readFileSync(process.env.SF6DNA_AXE_SCRIPT, 'utf8') });
          axe = await page.evaluate(async () => {
            const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
            return { violations: result.violations.map(row => ({ id: row.id, impact: row.impact, nodes: row.nodes.map(node => node.target) })), incomplete: result.incomplete.map(row => row.id) };
          });
        }
        const dom = await page.evaluate(() => {
          const main = document.querySelector('main');
          const commands = [...document.querySelectorAll('[aria-label$="のコマンド"] code, [data-token-type="TEXT"], [data-token-type="AMBIGUOUS"]')];
          const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
          const controls = [...document.querySelectorAll('a,button,select,input,summary')].filter(visible);
          const touchCandidates = controls.filter(element => { const box = element.getBoundingClientRect(); return box.width < 24 || box.height < 24; }).map(element => ({ tag: element.tagName, label: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 60) }));
          return {
            title: document.title, description: document.querySelector('meta[name="description"]')?.content ?? null,
            canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
            robots: document.querySelector('meta[name="robots"]')?.content ?? null,
            h1Count: document.querySelectorAll('h1').length,
            overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
            rawNull: /\b(undefined|null)\b/.test(main?.innerText ?? ''),
            commandScopes: commands.length,
            missingCommandNames: [...document.querySelectorAll('[data-command-display]')].filter(element => !element.getAttribute('aria-label')?.trim()).length,
            rawNumericCommands: commands.filter(element => visible(element) && /\b(?:236236|214214|236|214|623|421)\b|(?:236236|214214|236|214|623|421)(?:LP|MP|HP|LK|MK|HK|P|K)/i.test(element.innerText)).map(element => element.innerText),
            unnamedButtons: [...document.querySelectorAll('button')].filter(element => visible(element) && !element.innerText.trim() && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')).length,
            missingAlt: document.querySelectorAll('img:not([alt])').length, touchCandidates,
          };
        });
        await page.keyboard.press('Tab');
        const firstFocus = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), href: document.activeElement?.getAttribute('href') }));
        if (firstFocus.href === '#main-content') await page.keyboard.press('Enter');
        const skipFocusPass = await page.evaluate(() => document.activeElement?.id === 'main-content');
        // Freeze before closing the page; cleanup can cancel speculative Next prefetches.
        results.push(structuredClone({ route, width, expectedStatus: expectedStatuses[route] ?? 200, status: response?.status(), ...dom, firstFocus, skipFocusPass, axe, errors, warnings, networkFailures }));
      } catch (error) { results.push({ route, width, unavailable: error.name, errors, warnings, networkFailures }); }
      await page.close();
    }
  }
} finally { await browser.close(); }
const complete = results.every(row => !row.unavailable);
const gate = predicate => !complete ? 'INCOMPLETE' : results.every(predicate) ? 'PASS_TESTED_SCOPE' : 'FAIL';
const unexpectedErrors = row => row.errors.filter(error => !(error.category === 'resource' && row.status >= 400 && error.status === row.status && error.path === new URL(row.route, base).pathname));
const report = { kind: 'BROWSER_TECHNICAL_SMOKE', results,
  gates: { ROUTES_PASS: gate(row => row.status === row.expectedStatus), NO_CONSOLE_ERROR: gate(row => unexpectedErrors(row).length === 0), NO_RAW_NULL: gate(row => !row.rawNull), NO_MAJOR_OVERFLOW: gate(row => row.overflow <= 1), ACCESSIBILITY_CRITICAL_PASS: process.env.SF6DNA_AXE_SCRIPT ? gate(row => row.axe && !row.axe.violations.some(violation => ['critical', 'serious'].includes(violation.impact)) && !row.missingCommandNames) : 'MANUAL_AND_AXE_REVIEW_REQUIRED', SEO_REQUIRED_PASS: gate(row => row.status !== 200 || Boolean(row.title && row.description)), NO_BROKEN_INTERNAL_LINK: 'USE_STATIC_AND_HTTP_AUDITS', NO_RAW_NUMERIC_COMMAND: results.some(row => row.commandScopes > 0) ? gate(row => !row.rawNumericCommands.length) : 'NOT_COVERED' },
  limitations: ['No WCAG conformance claim', 'No screen reader, contrast, authentication or saved data verification', 'Add current published Character/Player paths to the optional JSON route file', 'Command tests cover selected command DOM only; zero matching scopes is not command verification', 'Touch candidates require review because WCAG has spacing/inline exceptions', 'Core Web Vitals require separate field/lab measurement'] };
if (process.argv[3]) writeFileSync(resolve(process.argv[3]), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ tested: results.length, gates: report.gates }));
if (!complete || Object.values(report.gates).includes('FAIL')) process.exitCode = 1;
