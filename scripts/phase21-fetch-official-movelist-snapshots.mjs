import fs from 'node:fs/promises';
import path from 'node:path';

const characters = [
  ['ryu','ryu'],['luke','luke'],['jamie','jamie'],['chun-li','chunli'],['guile','guile'],['kimberly','kimberly'],['juri','juri'],['ken','ken'],['blanka','blanka'],['dhalsim','dhalsim'],['e-honda','ehonda'],['dee-jay','deejay'],['manon','manon'],['marisa','marisa'],['jp','jp'],['zangief','zangief'],['lily','lily'],['cammy','cammy'],['rashid','rashid'],['aki','aki'],['ed','ed'],['akuma','gouki_akuma'],['m-bison','vega_mbison'],['terry','terry'],['mai','mai'],['elena','elena'],['sagat','sagat'],['c-viper','cviper'],['alex','alex'],['ingrid','ingrid'],['yasmine','yasmine'],
];

const locale = process.env.MOVELIST_LOCALE || 'ja-jp';
const retryOnly = new Set(process.argv.slice(2));
const targets = retryOnly.size ? characters.filter(([slug]) => retryOnly.has(slug)) : characters;
const outDir = path.resolve(`artifacts/phase21-official-movelist-snapshots-${locale}`);
await fs.mkdir(outDir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchOne([projectSlug, officialSlug]) {
  const sourceUrl = `https://www.streetfighter.com/6/${locale}/character/${officialSlug}/movelist`;
  const mirrorUrl = `https://r.jina.ai/http://${sourceUrl}`;
  let last = { status: 0, text: '', error: null };
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(mirrorUrl, {
        headers: { 'User-Agent': 'SF6DNA-Phase21-Audit/1.0' },
        signal: AbortSignal.timeout(45000),
      });
      const text = await response.text();
      last = { status: response.status, text, error: null };
      const ok = response.ok && text.length > 1000 && /MOVELIST|ムーブリスト|モダン|Modern|クラシック|Classic|Special Moves|必殺技/i.test(text);
      if (ok) {
        await fs.writeFile(path.join(outDir, `${projectSlug}.md`), text, 'utf8');
        console.log(`${projectSlug}: status=${response.status} ok=true bytes=${text.length} attempt=${attempt}`);
        return { projectSlug, officialSlug, locale, sourceUrl, mirrorUrl, status: response.status, ok: true, bytes: text.length, attempts: attempt, error: null };
      }
      console.log(`${projectSlug}: status=${response.status} retry attempt=${attempt} bytes=${text.length}`);
    } catch (e) {
      last = { status: 0, text: '', error: String(e?.message ?? e) };
      console.log(`${projectSlug}: error retry attempt=${attempt} ${last.error}`);
    }
    await sleep(Math.min(4000 * attempt, 20000));
  }
  return { projectSlug, officialSlug, locale, sourceUrl, mirrorUrl, status: last.status, ok: false, bytes: last.text.length, attempts: 6, error: last.error };
}

const results = [];
for (const target of targets) {
  results.push(await fetchOne(target));
  await sleep(1500);
}
results.sort((a,b) => a.projectSlug.localeCompare(b.projectSlug));
await fs.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify({ fetchedAt: new Date().toISOString(), locale, results }, null, 2), 'utf8');
const failed = results.filter(r => !r.ok);
console.log(`success=${results.length - failed.length}/${results.length}`);
if (failed.length) {
  console.log('failed:', failed.map(r => `${r.projectSlug}:${r.status}:${r.error ?? ''}`).join(', '));
  process.exitCode = 1;
}
