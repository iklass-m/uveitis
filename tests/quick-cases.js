const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:375,height:740}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/');await p.click('.tab[data-v="quick"]');
const cases=require(require('path').resolve(process.argv[2]));
for(const [c,expect] of cases){await p.fill('#qtext',c);await p.evaluate(()=>quickAnalyse());
 const r=await p.evaluate(()=>({top:[...document.querySelectorAll('.qdx')].slice(0,3).map(e=>e.textContent),seen:[...document.querySelectorAll('.qchip')].map(e=>e.textContent)}));
 const ok=r.top[0]&&r.top[0].toLowerCase().includes(expect.toLowerCase());
 console.log((ok?'OK  ':'MISS')+' | '+c+'\n      top: '+r.top.join(' | ')+'\n      seen: '+r.seen.join(', '));}
console.log('ERRS',errs);await b.close()})();
