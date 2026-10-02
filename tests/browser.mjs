import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.TEST_URL||'http://localhost:8000';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1100}});
page.on('pageerror',e=>errors.push(e.message));
await page.goto(base);await page.locator('#own button').first().waitFor();
await page.getByRole('button',{name:'Destroyer 2',exact:true}).click();await page.locator('#own button').nth(0).click();
assert.equal(await page.getByRole('button',{name:'Destroyer 2',exact:true}).isDisabled(),true);
assert.equal(await page.getByRole('button',{name:'Carrier 5',exact:true}).isDisabled(),false);
for(const [name,cell] of [['Submarine 3',20],['Carrier 5',40],['Cruiser 3',60],['Battleship 4',80]]){await page.getByRole('button',{name,exact:true}).click();await page.locator('#own button').nth(cell).click();}
assert.equal(await page.locator('#own button.ship').count(),17);assert.equal(await page.locator('#start').isEnabled(),true);
await page.screenshot({path:'test-results/desktop-deployment.png',fullPage:true});
await page.locator('#start').click();assert.equal(await page.locator('#placement').isHidden(),true);
assert.equal(await page.evaluate(()=>{document.querySelector('#enemy button').click();return document.querySelectorAll('#enemy button:enabled').length;}),0);
await page.locator('#restart').click();await page.waitForTimeout(650);
assert.equal(await page.locator('#status').textContent(),'Deploy your fleet');assert.equal(await page.locator('#own button.hit,#own button.miss,#own button.sunk').count(),0);
assert.equal(await page.locator('#own button.ship').count(),0);assert.equal(await page.locator('#start').isDisabled(),true);
console.log('PASS manual inventory, combat lock, hidden controls, restart race');
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/mobile-deployment.png',fullPage:true});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.locator('#rotate').click();await page.locator('#own button').nth(60).click();assert.equal(await page.locator('#own button.ship').count(),0);
await page.locator('#own button').nth(0).click();assert.equal(await page.locator('#own button.ship').count(),5);
console.log('PASS mobile width and vertical boundary validation');
for(const win of [true,false]){
  const round=await browser.newPage({viewport:{width:1440,height:1100}});round.on('pageerror',e=>errors.push(e.message));
  await round.addInitScript(()=>{const values=[0,.9,.1,.9,.2,.9,.3,.9,.4,.9];let seed=92731;Math.random=()=>{if(values.length)return values.shift();seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const original=window.setTimeout;window.setTimeout=(cb,ms,...args)=>original(cb,Math.min(ms,20),...args);});
  await round.goto(base);await round.locator('#own button').first().waitFor();
  for(let i=0;i<5;i++)await round.locator('#own button').nth((win?9-i:i)*10).click();
  await round.locator('#start').click();
  const occupied=[0,1,2,3,4,10,11,12,13,20,21,22,30,31,32,40,41];
  const cells=win?occupied:Array.from({length:100},(_,i)=>i).filter(c=>!occupied.includes(c));
  for(const c of cells){if(await round.locator('#phase').textContent()==='COMPLETE')break;await round.locator('#enemy button').nth(c).click();await round.waitForFunction(()=>['YOUR TURN','COMPLETE'].includes(document.getElementById('phase').textContent));}
  assert.match(await round.locator('#status').textContent(),win?/Victory/:/Defeat/);
  assert.equal(await round.locator('#enemy button:enabled').count(),0);
  await round.screenshot({path:`test-results/${win?'victory':'defeat'}.png`,fullPage:true});
  await round.locator('#restart').click();assert.equal(await round.locator('#status').textContent(),'Deploy your fleet');
  console.log(`PASS full browser ${win?'victory':'defeat'} round and restart`);await round.close();
}
assert.deepEqual(errors,[]);console.log('PASS no browser JavaScript errors');await browser.close();
