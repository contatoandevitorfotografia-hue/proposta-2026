// Exporta cada .cena de cenas.html como PNG 1080×1920 em cenas/.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const exe = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 2100 } });
  await page.goto('file://' + path.join(__dirname, 'cenas.html'));
  await page.evaluate(() => document.fonts.ready);
  for (const c of await page.$$('.cena')) {
    const id = await c.getAttribute('id');
    await c.screenshot({ path: path.join(__dirname, 'cenas', `${id}.png`) });
  }
  await browser.close(); console.log('ok');
})();
