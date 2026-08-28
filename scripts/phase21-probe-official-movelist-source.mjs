import fs from 'node:fs/promises';

const url = 'https://www.streetfighter.com/6/ja-jp/character/aki/movelist';
const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 SF6DNA-Phase21-Audit' }, signal: AbortSignal.timeout(45000) });
const html = await response.text();
await fs.mkdir('artifacts/phase21-source-probe', { recursive: true });
await fs.writeFile('artifacts/phase21-source-probe/aki.html', html);
const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m=>m[1]);
await fs.writeFile('artifacts/phase21-source-probe/scripts.json', JSON.stringify(scripts,null,2));
console.log('status', response.status, 'bytes', html.length, 'scripts', scripts.length);
for (const needle of ['紫煙砲','modern','d2.png','command','movelist']) {
  console.log('needle', needle, 'index', html.toLowerCase().indexOf(needle.toLowerCase()));
}
console.log(scripts.join('\n'));
