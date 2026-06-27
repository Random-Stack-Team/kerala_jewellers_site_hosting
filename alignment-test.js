const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = 'E:\\Kerala-Jewellers-final';
const PORT = 8766;
const SCREENSHOT_DIR = path.join(ROOT, 'screenshots-alignment');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

const pages = [
  { name: 'about', url: 'http://localhost:8766/about.html' },
  { name: 'enquiry', url: 'http://localhost:8766/enquiry.html' },
  { name: 'blog', url: 'http://localhost:8766/blog.html' },
];

const viewports = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'mobile-360', width: 360, height: 800 },
];

async function checkPage(page, vp, url, pageName) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for JS header/footer loaders
  await page.waitForTimeout(2000);

  const screenshotPath = path.join(SCREENSHOT_DIR, `${pageName}-${vp.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`  Screenshot: ${screenshotPath}`);

  const results = {};

  // 1. Check horizontal scroll
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  results.noHorizontalScroll = {
    pass: scrollWidth <= clientWidth + 5,
    detail: `scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`
  };

  // 2. Check for content overflow (body > viewport width)
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  results.noBodyOverflow = {
    pass: bodyWidth <= clientWidth + 5,
    detail: `bodyWidth=${bodyWidth}, clientWidth=${clientWidth}`
  };

  // 3. Check content is visible (not zero height)
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  results.contentVisible = {
    pass: bodyHeight > 100,
    detail: `bodyHeight=${bodyHeight}`
  };

  // 4. Check header/nav exists
  const hasHeader = await page.evaluate(() => {
    const header = document.querySelector('header') || document.querySelector('nav') || document.querySelector('.navbar');
    return header !== null && header.offsetHeight > 0;
  });
  results.headerRenders = {
    pass: hasHeader,
    detail: hasHeader ? 'header/nav found and visible' : 'header/nav NOT found or zero height'
  };

  // 5. Check footer exists
  const footerInfo = await page.evaluate(() => {
    const footer = document.querySelector('footer') || document.querySelector('.footer');
    if (!footer) return { found: false, detail: 'no footer element' };
    const rect = footer.getBoundingClientRect();
    return { found: true, height: footer.offsetHeight, bottom: rect.bottom, detail: `footer height=${footer.offsetHeight}` };
  });
  results.footerRenders = {
    pass: footerInfo.found,
    detail: footerInfo.detail
  };

  // 6. Check for overlapping elements (z-index issues with fixed/sticky nav)
  const overlapIssues = await page.evaluate(() => {
    const issues = [];
    const fixed = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
    fixed.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 50) issues.push(`Fixed element too narrow: ${rect.width}px`);
    });
    return issues;
  });
  results.noOverlapIssues = {
    pass: overlapIssues.length === 0,
    detail: overlapIssues.length > 0 ? overlapIssues.join('; ') : 'No overlap issues detected'
  };

  // 7. Check text is not overflowing containers
  const textOverflow = await page.evaluate(() => {
    const issues = [];
    const allElements = document.querySelectorAll('h1, h2, h3, h4, p, span, a, div');
    let checked = 0;
    for (const el of allElements) {
      if (checked > 500) break;
      const style = window.getComputedStyle(el);
      if (style.overflow === 'hidden' || style.overflowX === 'hidden') {
        if (el.scrollWidth > el.clientWidth + 2) {
          issues.push(`${el.tagName}.${el.className.split(' ')[0]}: scrollW=${el.scrollWidth} > clientW=${el.clientWidth}`);
        }
      }
      checked++;
    }
    return issues.slice(0, 5);
  });
  results.noTextOverflow = {
    pass: textOverflow.length === 0,
    detail: textOverflow.length > 0 ? textOverflow.join('; ') : 'No text overflow'
  };

  // 8. Check no elements extend beyond viewport
  const outOfBounds = await page.evaluate((vpWidth) => {
    const issues = [];
    const elements = document.querySelectorAll('img, video, iframe, .container, .wrapper, main, section');
    let checked = 0;
    for (const el of elements) {
      if (checked > 200) break;
      const rect = el.getBoundingClientRect();
      if (rect.right > vpWidth + 10 && rect.width > 0) {
        issues.push(`${el.tagName}.${el.className.split(' ')[0] || 'no-class'}: right=${Math.round(rect.right)} > vp=${vpWidth}`);
      }
      checked++;
    }
    return issues.slice(0, 5);
  }, vp.width);
  results.noElementsOutOfBounds = {
    pass: outOfBounds.length === 0,
    detail: outOfBounds.length > 0 ? outOfBounds.join('; ') : 'No elements out of bounds'
  };

  // 9. Check main content is centered (for desktop)
  if (vp.width >= 992) {
    const centering = await page.evaluate(() => {
      const main = document.querySelector('main') || document.querySelector('.main-content') || document.querySelector('section');
      if (!main) return { pass: true, detail: 'No main element to check' };
      const rect = main.getBoundingClientRect();
      const vpCenter = window.innerWidth / 2;
      const elCenter = rect.left + rect.width / 2;
      const offset = Math.abs(vpCenter - elCenter);
      return { pass: offset < 100, detail: `elCenter=${Math.round(elCenter)}, vpCenter=${Math.round(vpCenter)}, offset=${Math.round(offset)}` };
    });
    results.contentCentered = centering;
  }

  return results;
}

(async () => {
  const server = await startServer();

  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const allResults = [];

  for (const pg of pages) {
    console.log(`\n=== Testing: ${pg.name} ===`);
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const vp of viewports) {
      console.log(`  Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      try {
        const results = await checkPage(page, vp, pg.url, pg.name);
        allResults.push({ page: pg.name, viewport: vp.name, results });
      } catch (err) {
        console.log(`  ERROR: ${err.message}`);
        allResults.push({ page: pg.name, viewport: vp.name, results: { error: { pass: false, detail: err.message } } });
      }
    }
    await context.close();
  }

  await browser.close();
  server.close();

  // Print summary table
  console.log('\n\n===== ALIGNMENT CHECK RESULTS =====\n');

  // Build table
  const checks = [
    'noHorizontalScroll', 'noBodyOverflow', 'contentVisible', 'headerRenders',
    'footerRenders', 'noOverlapIssues', 'noTextOverflow', 'noElementsOutOfBounds', 'contentCentered'
  ];
  const checkLabels = {
    noHorizontalScroll: 'No H-scroll',
    noBodyOverflow: 'No Body Overflow',
    contentVisible: 'Content Visible',
    headerRenders: 'Header/Nav',
    footerRenders: 'Footer',
    noOverlapIssues: 'No Overlap',
    noTextOverflow: 'No Text Overflow',
    noElementsOutOfBounds: 'In Bounds',
    contentCentered: 'Centered'
  };

  // Header
  const colWidth = 12;
  let header = '| Page'.padEnd(20) + '|';
  for (const ck of checks) header += ` ${checkLabels[ck].padEnd(colWidth)}|`;
  console.log(header);
  console.log('-'.repeat(header.length));

  for (const r of allResults) {
    let row = `${r.page}-${r.viewport}`.padEnd(20) + '|';
    for (const ck of checks) {
      if (r.results[ck]) {
        const status = r.results[ck].pass ? 'PASS' : 'FAIL';
        row += ` ${status.padEnd(colWidth)}|`;
      } else {
        row += ` ${'N/A'.padEnd(colWidth)}|`;
      }
    }
    console.log(row);
  }

  // Print details for failures
  console.log('\n--- Failure Details ---');
  let hasFailures = false;
  for (const r of allResults) {
    for (const ck of checks) {
      if (r.results[ck] && !r.results[ck].pass) {
        hasFailures = true;
        console.log(`[FAIL] ${r.page}/${r.viewport} - ${checkLabels[ck]}: ${r.results[ck].detail}`);
      }
    }
  }
  if (!hasFailures) console.log('No failures found!');

  console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}`);
})();
