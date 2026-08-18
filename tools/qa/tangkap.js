const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Tangkap per-VIEWPORT pada posisi gulir nyata, bukan fullPage.
 * `animation-timeline: view()` dihitung dari tinggi viewport; tangkapan
 * fullPage memaksa viewport setinggi halaman sehingga seluruh reveal
 * terbaca "belum masuk rentang" dan hasilnya tampak kosong -- artefak alat,
 * bukan keadaan yang dilihat pengguna.
 */
(async () => {
  const [base, out, url, scheme, wStr, hStr] = process.argv.slice(2);
  const w = +(wStr || 1280), h = +(hStr || 800);
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: w < 500,
    hasTouch: w < 500,
    colorScheme: scheme,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto(base + url, { waitUntil: 'networkidle' });
  const total = await page.evaluate(() => document.body.scrollHeight);
  const screens = Math.ceil(total / h);

  for (let i = 0; i < screens; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * h);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${out}/${scheme}-${w}-${String(i + 1).padStart(2, '0')}.png` });
  }
  console.log(`${scheme} ${w}x${h}: ${screens} layar, console-errors=${errors.length}`);
  if (errors.length) errors.slice(0, 3).forEach((e) => console.log('   ! ' + e.slice(0, 120)));
  await browser.close();
})();
