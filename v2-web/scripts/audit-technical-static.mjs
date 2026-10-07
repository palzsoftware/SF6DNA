import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export function walk(root) {
  return readdirSync(root).flatMap(name => {
    const path = resolve(root, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
export function routePattern(route) {
  const parts = route.split('/').filter(Boolean).map(part => {
    if (/^\[\[\.\.\..+\]\]$/.test(part)) return '.*';
    if (/^\[\.\.\..+\]$/.test(part)) return '.+';
    if (/^\[.+\]$/.test(part)) return '[^/]+';
    return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  return new RegExp(`^/${parts.join('/')}/?$`);
}
export function audit(root) {
  const src = resolve(root, 'src');
  const app = resolve(src, 'app');
  const files = walk(src).filter(path => /\.(ts|tsx)$/.test(path));
  const routes = walk(app).filter(path => /[/\\]page\.tsx$/.test(path)).map(path =>
    '/' + relative(app, path).split(sep).slice(0, -1).filter(part => !/^\(.+\)$/.test(part)).join('/'));
  const patterns = routes.map(routePattern);
  const findings = [];
  const links = [];
  const metrics = { sourceFiles: files.length, clientFiles: 0, fullRowSelects: [], queriesWithoutLimit: [] };
  for (const path of files) {
    const source = readFileSync(path, 'utf8');
    const file = relative(root, path).split(sep).join('/');
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    if (/^["']use client["']/.test(source)) metrics.clientFiles++;
    function visit(node) {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        if (node.expression.name.text === 'select' && node.arguments.some(arg => ts.isStringLiteral(arg) && arg.text === '*')) metrics.fullRowSelects.push(file);
        if (node.expression.name.text === 'from') {
          let chain = node;
          while (chain.parent && (ts.isPropertyAccessExpression(chain.parent) || ts.isCallExpression(chain.parent))) chain = chain.parent;
          const text = chain.getText(ast);
          if (!/\.(limit|range|maybeSingle|single)\(/.test(text) && /\.select\(/.test(text)) metrics.queriesWithoutLimit.push({ file, line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1, query: text.replace(/\s+/g, ' ').slice(0, 350) });
        }
      }
      if (ts.isJsxAttribute(node) && node.name.getText(ast) === 'href') {
        const literal = node.initializer;
        if (literal && ts.isStringLiteral(literal) && literal.text.startsWith('/') && !literal.text.startsWith('//')) {
          const href = literal.text;
          const pathname = href.split(/[?#]/)[0];
          links.push({ file, href });
          if (!patterns.some(pattern => pattern.test(pathname))) findings.push({ severity: 'P0', gate: 'NO_BROKEN_INTERNAL_LINK', file, href, detail: 'No matching page route for literal href' });
        }
      }
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(ast);
        if (tag === 'img') {
          const attrs = node.attributes.properties.filter(ts.isJsxAttribute).map(attr => attr.name.getText(ast));
          if (!attrs.includes('alt')) findings.push({ severity: 'P1', gate: 'ACCESSIBILITY_CRITICAL_PASS', file, detail: 'Native image without alt attribute' });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
  return {
    kind: 'STATIC_ONLY', routes, links, metrics, findings,
    gates: { ROUTES_PASS: 'NOT_RUN_RUNTIME', NO_BROKEN_INTERNAL_LINK: findings.some(f => f.gate === 'NO_BROKEN_INTERNAL_LINK') ? 'FAIL' : 'PASS_LITERAL_ONLY',
      ACCESSIBILITY_CRITICAL_PASS: 'NOT_RUN_BROWSER', SEO_REQUIRED_PASS: 'NOT_RUN_BROWSER', NO_CONSOLE_ERROR: 'NOT_RUN_BROWSER', NO_RAW_NULL: 'NOT_RUN_BROWSER', NO_MAJOR_OVERFLOW: 'NOT_RUN_BROWSER' },
    limits: ['Computed hrefs and dynamic data are not resolved', 'Route existence does not prove publication or HTTP status', 'Query flags are review candidates, not proven N+1 or performance failures'],
  };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
  const result = audit(root);
  const output = process.argv[2];
  if (output) writeFileSync(resolve(output), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ routes: result.routes.length, literalLinks: result.links.length, findings: result.findings, metrics: result.metrics }, null, 2));
  if (result.findings.some(f => f.severity === 'P0')) process.exitCode = 1;
}
