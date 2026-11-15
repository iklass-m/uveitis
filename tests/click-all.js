const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:375,height:740},isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/');
let n=0;
for(const v of ['hx','ros','exam','invest','labs','summary']){await p.click(`.tab[data-v="${v}"]`);
 n+=await p.evaluate(v=>{let c=0;document.querySelectorAll(`#v-${v} button, #v-${v} .qhead, #v-${v} .echip, #v-${v} .pbchip`).forEach(e=>{if(/print|copy/i.test(e.textContent))return;e.click();c++});
 document.querySelectorAll(`#v-${v} select`).forEach(s=>{for(let i=0;i<s.options.length;i++){s.selectedIndex=i;s.dispatchEvent(new Event('change',{bubbles:true}))}});
 document.querySelectorAll(`#v-${v} input`).forEach(i=>{i.value='3';i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))});return c},v);
 const o=await p.evaluate(()=>document.documentElement.scrollWidth);console.log(v,'scrollW',o);}
const rb=await p.$$('button');for(const x of rb){const t=(await x.textContent())||'';if(/reset|clear/i.test(t)&&await x.isVisible()){await x.click();console.log('clicked',t.trim());break}}
console.log('clicked',n,'ERRS',errs);await b.close()})();
