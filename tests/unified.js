const {chromium}=require('playwright');
(async()=>{const S=process.argv[2]||'/tmp';const b=await chromium.launch();
const errs=[];
async function page(w,h,mobile){const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(w+': '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(w+': '+m.text())});await p.goto('http://localhost:8765/');return [ctx,p];}
const top=p=>p.$$eval('#dxlist .dxname',x=>x.slice(0,4).map(e=>e.textContent));
const qtop=p=>p.$$eval('#qout .qdx',x=>x.slice(0,4).map(e=>e.textContent));
let [ctx,p]=await page(375,740,true);
// 1 tapped only -> shows in both lists
await p.click('.tab[data-v="exam"]');
await p.click('.echip:text-is("Heterochromia (lighter affected iris)")');await p.click('.echip:text-is("Diffuse stellate KP (whole endothelium)")');
console.log('tapped only  side:',await top(p),'\n             quick:',await qtop(p));
console.log('fits:',await p.$eval('#qout .qwhy',e=>e.textContent));
// 2 type the same finding -> counted once
const before=await p.$eval('#dxlist .cnt',e=>e.textContent);
await p.click('.tab[data-v="quick"]');await p.fill('#qtext','heterochromia');await p.evaluate(()=>{quickAnalyse();});
const after=await p.$eval('#dxlist .cnt',e=>e.textContent);
console.log('Fuchs score tapped:',before,' tapped+typed same finding:',after);
// 3 add typed extra + against
await p.fill('#qtext','heterochromia, bilateral, raised IOP');await p.evaluate(()=>{quickAnalyse();buildSummary();});
console.log('combined:',await qtop(p),'|',await p.$$eval('#qout .qagainst',x=>x.slice(0,1).map(e=>e.textContent)));
console.log('note:',await p.$eval('#flagnote',e=>e.textContent));
// 4 lab result feeds it
await p.click('.tab[data-v="labs"]');
const ids=await p.$$eval('.fsel',x=>x.map(s=>[s.dataset.id,[...s.options].map(o=>o.value)]));
const syph=ids.find(([id,o])=>/syph|trep|tppa/i.test(id));console.log('syph field',syph&&syph[0],syph&&syph[1]);
if(syph){await p.selectOption(`.fsel[data-id="${syph[0]}"]`,syph[1].find(o=>/pos|react/i.test(o)));console.log('after +ve syphilis:',await top(p));}
// 5 summary + reload restore
await p.click('.tab[data-v="summary"]');const t=await p.textContent('#summaryout');console.log(t.slice(t.indexOf('FREE-TEXT'),t.indexOf('FREE-TEXT')+60).replace(/\n/g,' / '),'...',t.slice(t.indexOf('WORKING DIFF'),t.indexOf('WORKING DIFF')+150).replace(/\n/g,' / '));
await p.waitForTimeout(500);await p.reload();await p.waitForTimeout(400);
console.log('after reload:',await top(p),'| resbar:',await p.$eval('#resbar',e=>e.textContent.slice(0,60)));
console.log('sw375',await p.evaluate(()=>document.documentElement.scrollWidth));
await p.evaluate(()=>{localStorage.clear()});await p.reload();await p.screenshot({path:S+'/hdr375.png'});
await ctx.close();
for(const [w,h,m] of [[800,1100,true],[1280,800,false]]){[ctx,p]=await page(w,h,m);await p.click('.tab[data-v="quick"]');await p.click('text=Example');await p.waitForTimeout(300);
 console.log(w,'sw',await p.evaluate(()=>document.documentElement.scrollWidth),'about open',await p.$eval('#about',e=>e.open),'side visible beside',await p.evaluate(()=>{const a=document.querySelector('.main').getBoundingClientRect(),b=document.getElementById('side').getBoundingClientRect();return b.left>=a.right-2}));
 await p.screenshot({path:S+`/w${w}.png`});await ctx.close();}
console.log('ERRS',errs);await b.close()})();
