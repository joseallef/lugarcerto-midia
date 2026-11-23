// Renderiza HTML -> PNG com Playwright. Uso: render([{html, out, w, h}])
const { chromium } = require('playwright');
module.exports = async function render(jobs) {
  const browser = await chromium.launch();
  for (const j of jobs) {
    const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
    await page.setContent(j.html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: j.out });
    await page.close();
    console.log('ok', j.out);
  }
  await browser.close();
};
