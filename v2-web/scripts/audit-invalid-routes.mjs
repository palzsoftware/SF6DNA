// GET-only regression gate. Run against an isolated candidate server; no form/action calls.
import http from 'node:http';
import https from 'node:https';
import { writeFileSync } from 'node:fs';
const base = new URL(process.argv[2] ?? 'http://127.0.0.1:3088');
const cases = [
  ['/', 200, 'VALID_ROUTE'], ['/characters', 200, 'EMPTY_SLUG_LIST'],
  ['/players/ws8-nonexistent-resource-20261007', 404, 'NOT_FOUND'],
  ['/characters/ws8-nonexistent-resource-20261007', 404, 'NOT_FOUND'],
  ['/videos/ws8-nonexistent-resource-20261007', 404, 'NOT_FOUND'],
  ...['/players/%ZZ', '/players/%', '/players/%E0%A4', '/characters/%C0%AF', '/videos/%ED%A0%80', '/api/illustration-pilot/%ZZ', '/players/%ZZ.webp', '/characters/%E0%A4.png', '/videos/%ZZ.svg'].map(path => [path, 400, 'BAD_REQUEST']),
  ['/missing-ws8-image.png',404,'UNKNOWN_IMAGE_ROUTE'],
  ['/players/00000000-0000-0000-0000-000000000000',404,'UNKNOWN_RESOURCE_ID'],
  ['/players/%E6%97%A5%E6%9C%AC',404,'VALID_ENCODED_UNKNOWN_SLUG'],
  ['/players/%2525',404,'LITERAL_PERCENT_UNKNOWN_SLUG'],
  ['/videos?player=%ZZ',200,'SAFE_EMPTY_STATE'],
  ['/videos?player=a&player=b',200,'ARRAY_QUERY'],
  ['/search?q=%ZZ&type=not-valid',200,'UNKNOWN_FILTER'],
  ['/characters?q=a&q=b',200,'ARRAY_QUERY'],
  ['/videos?player='+'a'.repeat(4000),200,'LONG_QUERY'],
  ['/auth',200,'AUTH_SHELL'], ['/characters/',308,'TRAILING_SLASH'],
  ['/me/training?session=not-a-uuid&diagnosis=unknown&focus=unknown',200,'INVALID_SESSION_AND_QUERY'],
  ['/me/training?session=a&session=b&diagnosis=a&diagnosis=b',200,'ARRAY_SESSION_QUERY'],
  ['/search?q='+'a'.repeat(4000),200,'LONG_SEARCH_QUERY'],
  ['/_next/data/invalid/auth.json',404,'UNKNOWN_NEXT_DATA'],
];
function get(path) {
  return new Promise((resolve,reject) => {
    const url = new URL(path, base);
    const request = (url.protocol === 'https:' ? https : http).get(url, response => {
      let body = ''; response.on('data', chunk => body += chunk);
      response.on('end', () => resolve({ status:response.statusCode, noindex:response.headers['x-robots-tag'], body }));
    });
    request.setTimeout(20000, () => request.destroy(new Error('REQUEST_TIMEOUT')));
    request.on('error', reject);
  });
}
const results=[];
for(const [path,expected,classification] of cases) {
  const display=path.length>200?`${path.slice(0,30)}[length=${path.length}]`:path;
  try {
    const response=await get(path);
    results.push({path:display,expected,classification,status:response.status,pass:response.status===expected,
      badRequestSafe:expected!==400 || (response.body.includes('400 Bad Request') && response.body.includes('<html lang="ja"') && response.noindex==='noindex' && !response.body.includes(path))});
  } catch(error) { results.push({path:display,expected,classification,pass:false,unavailable:error.message==='REQUEST_TIMEOUT'?'TIMEOUT':error.name}); }
}
const report={gate:results.every(x=>x.pass&&x.badRequestSafe!==false)?'PASS_TESTED_SCOPE':'FAIL_OR_UNAVAILABLE',results,
  limits:['No actual DB/public detail or authenticated session guarantee','No mutation endpoints exercised','URLs beyond framework/web-server limits require separate hosting validation']};
if(process.argv[3])writeFileSync(process.argv[3],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({gate:report.gate,tests:results.length,failures:results.filter(x=>!x.pass)}));
if(report.gate!=='PASS_TESTED_SCOPE')process.exitCode=1;
