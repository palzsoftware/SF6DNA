const { chromium } = require('playwright'); const fs=require('fs');
const [,,out,port,slugList]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const res={};
for(const s of slugList.split(',')){
  const r=await p.goto(`http://127.0.0.1:${port}/characters/${s}`,{waitUntil:'domcontentloaded',timeout:600000});
  res[s]={status:r.status(),overflow:await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),cards:await p.evaluate(()=>[...document.querySelectorAll('article[data-move-id]')].map(a=>{
    const cell=scheme=>{const dd=[...a.querySelectorAll(':scope > dl > div')].find(d=>d.querySelector('dt')?.textContent.trim()===scheme)?.querySelector('dd');
      return dd?{labels:[...dd.querySelectorAll('[role="img"][aria-label]')].map(e=>e.getAttribute('aria-label')),text:dd.textContent.trim()}:null;};
    const det=a.querySelector('details');
    const row=label=>[...(det?.querySelectorAll('dl > div')||[])].filter(d=>d.querySelector('dt')?.textContent.trim()===label).map(d=>d.querySelector('dd').textContent.trim());
    return {id:a.dataset.moveId,name:a.querySelector('h3')?.textContent.trim(),classic:cell('Classic'),modern:cell('Modern'),
      sets:[...a.querySelectorAll('section[data-frame-move-id]')].map(sec=>({id:sec.dataset.frameMoveId,frames:Object.fromEntries([...sec.querySelectorAll('dl > div')].map(d=>[d.querySelector('dt').textContent.trim(),d.querySelector('dd').textContent.trim()]))})),
      condition:row('Condition / 条件'),damageCondition:[...(det?.querySelectorAll('[data-damage-condition]')||[])].map(d=>({id:d.dataset.damageCondition,text:d.querySelector('dd').textContent.trim()})),
      patch:row('Patch'),verification:row('Verification'),sources:[...(det?.querySelectorAll('a[href]')||[])].map(x=>x.getAttribute('href'))};}))};
  console.error(s,res[s].status,res[s].cards.length);
}
await b.close();fs.writeFileSync(out,JSON.stringify(res));})();
