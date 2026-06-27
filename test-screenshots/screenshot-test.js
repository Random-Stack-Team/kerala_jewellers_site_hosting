const { chromium } = require('playwright');
const path = require('path');

const BASE = 'http://localhost:8768';
const OUT = 'E:\\Kerala-Jewellers-final\\test-screenshots\\final-verification';

const pages = [
  { name: 'index', url: '/index.html' },
  { name: 'products', url: '/products.html' },
  { name: 'contact', url: '/contact.html' },
  { name: 'blog', url: '/blog.html' },
  { name: 'silver-ring', url: '/silverproducts/ring.html' },
  { name: 'diamond-ring', url: '/diamondproducts/ring.html' },
];

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 360, height: 640 },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    for (const pg of pages) {
      const page = await context.newPage();
      const fullName = `${pg.name}-${vp.name}`;
      console.log(`Testing: ${fullName} (${vp.width}x${vp.height})`);

      try {
        const resp = await page.goto(`${BASE}${pg.url}`, { waitUntil: 'networkidle', timeout: 20000 });
        const status = resp ? resp.status() : 'N/A';

        // Wait a bit for any JS loaders
        await page.waitForTimeout(2000);

        // Check for horizontal scroll
        const scrollInfo = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const viewWidth = document.documentElement.clientWidth;
          const bodyWidth = document.body ? document.body.scrollWidth : 0;
          return {
            docScrollWidth: docWidth,
            viewClientWidth: viewWidth,
            bodyScrollWidth: bodyWidth,
            hasHorizontalScroll: docWidth > viewWidth + 5,
          };
        });

        // Check header and footer
        const hasHeader = await page.evaluate(() => {
          const h = document.querySelector('header, .header, .navbar, nav, #header, .site-header');
          return !!h;
        });
        const hasFooter = await page.evaluate(() => {
          const f = document.querySelector('footer, .footer, #footer, .site-footer');
          return !!f;
        });

        // Check centering (content not shifted left)
        const centerInfo = await page.evaluate(() => {
          const main = document.querySelector('main, .main-content, .container, .content, #content, body > div');
          if (!main) return { centered: true, reason: 'no main element found' };
          const rect = main.getBoundingClientRect();
          const offset = Math.abs(rect.left);
          return {
            centered: offset < 50,
            leftOffset: Math.round(offset),
            reason: offset >= 50 ? `content shifted ${offset}px left` : 'ok',
          };
        });

        const pass = !scrollInfo.hasHorizontalScroll && centerInfo.centered;

        // Screenshot
        const filePath = path.join(OUT, `${fullName}.png`);
        await page.screenshot({ path: filePath, fullPage: true });

        results.push({
          name: fullName,
          status,
          pass,
          horizontalScroll: scrollInfo.hasHorizontalScroll,
          docWidth: scrollInfo.docScrollWidth,
          clientWidth: scrollInfo.viewClientWidth,
          header: hasHeader,
          footer: hasFooter,
          centered: centerInfo.centered,
          leftOffset: centerInfo.leftOffset,
          error: null,
        });

        console.log(`  -> ${pass ? 'PASS' : 'FAIL'} | HTTP ${status} | scroll: ${scrollInfo.hasHorizontalScroll} | header: ${hasHeader} | footer: ${hasFooter} | centered: ${centerInfo.centered}`);
      } catch (err) {
        results.push({
          name: fullName,
          status: 'ERR',
          pass: false,
          horizontalScroll: null,
          header: null,
          footer: null,
          centered: null,
          error: err.message,
        });
        console.log(`  -> ERROR: ${err.message}`);
      }
      await page.close();
    }
    await context.close();
  }

  await browser.close();

  // Output summary
  console.log('\n=== SUMMARY TABLE ===');
  console.log('Page | Viewport | HTTP | Pass | H-Scroll | Header | Footer | Centered | Notes');
  console.log('-----|----------|------|------|----------|--------|--------|----------|------');
  for (const r of results) {
    const parts = r.name.split('-');
    const vpName = parts.pop();
    const pageName = parts.join('-');
    const notes = r.error || (r.horizontalScroll ? `docW=${r.docWidth} > viewW=${r.clientWidth}` : (r.centered === false ? `offset=${r.leftOffset}px` : 'ok'));
    console.log(`${pageName} | ${vpName} | ${r.status} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.horizontalScroll === null ? '?' : r.horizontalScroll} | ${r.header === null ? '?' : r.header} | ${r.footer === null ? '?' : r.footer} | ${r.centered === null ? '?' : r.centered} | ${notes}`);
  }

  const totalPass = results.filter(r => r.pass).length;
  const totalFail = results.filter(r => !r.pass).length;
  console.log(`\nTotal: ${results.length} | Pass: ${totalPass} | Fail: ${totalFail}`);
})();
