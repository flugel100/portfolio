import { chromium } from 'playwright';

// Dipakai lawan build lokal (`npx serve out`) maupun situs hidup:
//   node tools/qa/periksa.js https://app.flugel.my.id
const BASE = process.argv[2] || 'http://localhost:3000';

const lum = ([r, g, b]) => {
  const k = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * k(r) + 0.7152 * k(g) + 0.0722 * k(b);
};
const ratio = (a, b) => {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const parse = (c) => c.match(/\d+/g).slice(0, 3).map(Number);

(async () => {
  const browser = await chromium.launch();

  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    await page.goto(BASE + '/id/', { waitUntil: 'networkidle' });

    const samples = await page.evaluate(() => {
      const pick = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        let bgEl = el, bg = getComputedStyle(bgEl).backgroundColor;
        while (bg === 'rgba(0, 0, 0, 0)' && bgEl.parentElement) {
          bgEl = bgEl.parentElement;
          bg = getComputedStyle(bgEl).backgroundColor;
        }
        return { fg: getComputedStyle(el).color, bg, size: parseFloat(getComputedStyle(el).fontSize) };
      };
      return {
        'judul hero': pick('h1'),
        'lead hero': pick('h1 + p, section p'),
        'label eyebrow': pick('#work-title')
          ? pick('p.text-accent')
          : null,
        'teks nav': pick('header nav a'),
        'kind proyek (faint)': pick('#work article p.text-fg-faint'),
        'ringkasan proyek (muted)': pick('#work article p.text-fg-muted'),
        'chip stack': pick('#work li[class*="font-mono"]'),
        'footer': pick('footer p'),
      };
    });

    console.log(`\n── mode ${scheme.toUpperCase()} ──`);
    for (const [name, s] of Object.entries(samples)) {
      if (!s) { console.log(`  ${name.padEnd(20)} (tidak ketemu)`); continue; }
      const r = ratio(parse(s.fg), parse(s.bg));
      const min = s.size >= 24 ? 3.0 : 4.5;
      const ok = r >= min ? 'OK ' : 'GAGAL';
      console.log(`  ${name.padEnd(20)} ${r.toFixed(2).padStart(6)} (min ${min}) ${ok}`);
    }
    await ctx.close();
  }

  // prefers-reduced-motion: animasi harus benar-benar mati.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/id/', { waitUntil: 'networkidle' });
  const rm = await page.evaluate(() => {
    const els = [...document.querySelectorAll('[data-reveal]')];
    const beranimasi = els.filter((el) => getComputedStyle(el).animationName !== 'none');
    const tersembunyi = els.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99);
    return { total: els.length, beranimasi: beranimasi.length, tersembunyi: tersembunyi.length };
  });
  console.log(`\n── prefers-reduced-motion: reduce ──`);
  console.log(`  ${rm.total} elemen reveal · beranimasi: ${rm.beranimasi} · tersembunyi: ${rm.tersembunyi}  ${rm.beranimasi === 0 && rm.tersembunyi === 0 ? 'OK' : 'GAGAL'}`);
  await browser.close();
})();
