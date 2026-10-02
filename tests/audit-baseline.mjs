import {chromium} from 'playwright';
// Historical reproduction helper: run against baseline c800e42 served on port
// 8000. Current code is expected to produce corrected results instead.
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage();
await page.goto('http://localhost:8000');
await page.getByRole('button',{name:'Destroyer 2',exact:true}).click();
await page.locator('#own button').nth(0).click();
console.log('Inventory audit:',await page.locator('#ships button').evaluateAll(bs=>bs.filter(b=>b.disabled).map(b=>b.textContent)));
await page.locator('#random').click();await page.locator('#start').click();
console.log('Deployment controls during combat:',await page.locator('#placement').evaluate(el=>({hidden:el.hidden,display:getComputedStyle(el).display})));
await page.locator('#enemy button').nth(0).click();await page.locator('#restart').click();await page.waitForTimeout(600);
console.log('Restart audit:',await page.locator('#status').textContent(),await page.locator('#own button.hit,#own button.miss,#own button.sunk').count());
await browser.close();
