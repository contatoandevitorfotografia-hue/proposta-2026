// Exporta cada slide de slides.html como PNG 1080×1350 em exportados/.
// Uso: node exportar.js   (precisa do pacote playwright)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const exe = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 } });
  await page.goto('file://' + path.join(__dirname, 'slides.html'));
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.join(__dirname, 'exportados'), { recursive: true });
  for (const s of await page.$$('.slide')) {
    const id = await s.getAttribute('id');
    await s.screenshot({ path: path.join(__dirname, 'exportados', `${id}.png`) });
    console.log('ok', id);
  }
  await browser.close();
})();
