import fs from 'node:fs/promises';
import path from 'node:path';

const characters = [
  ['ryu','ryu'],['luke','luke'],['jamie','jamie'],['chun-li','chunli'],['guile','guile'],['kimberly','kimberly'],['juri','juri'],['ken','ken'],['blanka','blanka'],['dhalsim','dhalsim'],['e-honda','ehonda'],['dee-jay','deejay'],['manon','manon'],['marisa','marisa'],['jp','jp'],['zangief','zangief'],['lily','lily'],['cammy','cammy'],['rashid','rashid'],['aki','aki'],['ed','ed'],['akuma','gouki_akuma'],['m-bison','vega_mbison'],['terry','terry'],['mai','mai'],['elena','elena'],['sagat','sagat'],['c-viper','cviper'],['alex','alex'],['ingrid','ingrid'],['yasmine','yasmine'],
];

const outDir = path.resolve('artifacts/phase20-official-frame-snapshots');
await fs.mkdir(outDir, { recursive: true });

async function fetchOne([projectSlug, officialSlug]) {
  const sourceUrl = `https://www.streetfighter.com/6/en-uk/character/${officialSlug}/frame`;
  const mirrorUrl = `https://r.jina.ai/http://${sourceUrl}`;
  let ok = false;
  let status = 0;
  let text = '';
  let error = null;
  try {
    const response = await fetch(mirrorUrl, {
      headers: { 'User-Agent': 'SF6DNA-Phase20-Audit/1.0' },
      signal: AbortSignal.timeout(30000),
    });
    status = response.status;
    text = await response.text();
    ok = response.ok && text.length > 1000 && /Frame|Normal Moves|Startup|Recovery/i.test(text);
    if (ok) await fs.writeFile(path.join(outDir, `${projectSlug}.md`), text, 'utf8');
  } catch (e) {
    error = String(e?.message ?? e);
  }
  console.log(`${projectSlug}: status=${status} ok=${ok} bytes=${text.length}${error ? ` error=${error}` : ''}`);
  return { projectSlug, officialSlug, sourceUrl, mirrorUrl, status, ok, bytes: text.length, error };
}

const results = [];
const batchSize = 6;
for (let i = 0; i < characters.length; i += batchSize) {
  const batch = characters.slice(i, i + batchSize);
  results.push(...await Promise.all(batch.map(fetchOne)));
  await new Promise(r => setTimeout(r, 700));
}

results.sort((a,b) => a.projectSlug.localeCompare(b.projectSlug));
await fs.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify({ fetchedAt: new Date().toISOString(), results }, null, 2), 'utf8');
const failed = results.filter(r => !r.ok);
console.log(`success=${results.length - failed.length}/${results.length}`);
if (failed.length) {
  console.log('failed:', failed.map(r => `${r.projectSlug}:${r.status}:${r.error ?? ''}`).join(', '));
  process.exitCode = 1;
}
