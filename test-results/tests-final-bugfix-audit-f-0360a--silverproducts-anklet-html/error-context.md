# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\final-bugfix-audit.spec.js >> final bugfix audit >> TEST 1: product detail box alignment on /silverproducts/anklet.html
- Location: tests\final-bugfix-audit.spec.js:48:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/silverproducts/anklet.html", waiting until "load"

```

# Test source

```ts
  1   | const { test, expect } = require('playwright/test');
  2   | const fs = require('fs');
  3   | const path = require('path');
  4   | 
  5   | const rootDir = path.resolve(__dirname, '..');
  6   | const productPages = [
  7   |   '/goldproducts/bombay-bangle.html',
  8   |   '/silverproducts/anklet.html',
  9   |   '/diamondproducts/necklace-4.html',
  10  | ];
  11  | 
  12  | async function waitForApp(page) {
  13  |   await page.waitForLoadState('domcontentloaded');
  14  |   await page.waitForTimeout(700);
  15  | }
  16  | 
  17  | async function expectNoHorizontalOverflow(page) {
  18  |   const overflow = await page.evaluate(() => ({
  19  |     body: document.body.scrollWidth,
  20  |     html: document.documentElement.scrollWidth,
  21  |     viewport: window.innerWidth,
  22  |   }));
  23  |   expect(Math.max(overflow.body, overflow.html)).toBeLessThanOrEqual(overflow.viewport + 2);
  24  | }
  25  | 
  26  | async function collectConsoleErrors(page, action) {
  27  |   const errors = [];
  28  |   page.on('console', (message) => {
  29  |     if (message.type() === 'error') errors.push(message.text());
  30  |   });
  31  |   page.on('pageerror', (error) => errors.push(error.message));
  32  |   await action();
  33  |   return errors.filter((error) => !/favicon/i.test(error));
  34  | }
  35  | 
  36  | function walkHtmlFiles(dir, list = []) {
  37  |   for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  38  |     if (['node_modules', 'graphify-out', 'test-results', 'playwright-report'].includes(entry.name)) continue;
  39  |     const full = path.join(dir, entry.name);
  40  |     if (entry.isDirectory()) walkHtmlFiles(full, list);
  41  |     if (entry.isFile() && entry.name.endsWith('.html')) list.push(full);
  42  |   }
  43  |   return list;
  44  | }
  45  | 
  46  | test.describe('final bugfix audit', () => {
  47  |   for (const url of productPages) {
  48  |     test(`TEST 1: product detail box alignment on ${url}`, async ({ page }) => {
> 49  |       await page.goto(url);
      |                  ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  50  |       await waitForApp(page);
  51  | 
  52  |       const readMetrics = async () => page.evaluate(() => {
  53  |         const image = document.querySelector('.sp-product-image-wrapper, .sp-product-image-wrappersilver, .sp-product-image-wrapper-diamond');
  54  |         const details = document.querySelector('.product-header4_product-details');
  55  |         const imageRect = image?.getBoundingClientRect();
  56  |         const detailRect = details?.getBoundingClientRect();
  57  |         return {
  58  |           imageVisible: Boolean(imageRect && imageRect.width > 20 && imageRect.height > 20),
  59  |           detailVisible: Boolean(detailRect && detailRect.width > 20 && detailRect.height > 20),
  60  |           imageHeight: Math.round(imageRect?.height || 0),
  61  |           detailHeight: Math.round(detailRect?.height || 0),
  62  |           detailScrollHeight: details?.scrollHeight || 0,
  63  |           detailClientHeight: details?.clientHeight || 0,
  64  |           detailOverflowY: details ? window.getComputedStyle(details).overflowY : '',
  65  |           stacked: window.innerWidth < 1024,
  66  |         };
  67  |       });
  68  | 
  69  |       await expect.poll(async () => {
  70  |         const current = await readMetrics();
  71  |         if (current.stacked) return 0;
  72  |         return Math.abs(current.detailHeight - current.imageHeight);
  73  |       }, { timeout: 8_000 }).toBeLessThanOrEqual(12);
  74  | 
  75  |       const metrics = await readMetrics();
  76  | 
  77  |       expect(metrics.imageVisible).toBeTruthy();
  78  |       expect(metrics.detailVisible).toBeTruthy();
  79  |       expect(metrics.detailOverflowY).not.toMatch(/scroll|auto/);
  80  |       expect(metrics.detailScrollHeight).toBeLessThanOrEqual(metrics.detailClientHeight + 2);
  81  |       if (!metrics.stacked) {
  82  |         expect(Math.abs(metrics.detailHeight - metrics.imageHeight)).toBeLessThanOrEqual(12);
  83  |       }
  84  |       await expectNoHorizontalOverflow(page);
  85  |     });
  86  |   }
  87  | 
  88  |   test('TEST 2: product loupe zoom follows cursor and hides on leave', async ({ page }, testInfo) => {
  89  |     test.skip(testInfo.project.name !== 'desktop-1366', 'Loupe behavior is desktop pointer-only.');
  90  | 
  91  |     for (const width of [1024, 1366, 1440]) {
  92  |       await page.setViewportSize({ width, height: 780 });
  93  |       await page.goto('/goldproducts/bombay-bangle.html');
  94  |       await waitForApp(page);
  95  | 
  96  |       const imageBox = page.locator('.sp-product-image-wrapper, .sp-product-image-wrappersilver, .sp-product-image-wrapper-diamond').first();
  97  |       await expect(imageBox).toBeVisible();
  98  |       const box = await imageBox.boundingBox();
  99  |       expect(box).toBeTruthy();
  100 | 
  101 |       await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.45);
  102 |       await expect.poll(async () => imageBox.evaluate((node) => {
  103 |         const lens = node.querySelector('.kj-zoom-lens');
  104 |         return lens ? Number(window.getComputedStyle(lens).opacity) : 0;
  105 |       })).toBeGreaterThan(0.9);
  106 |       const firstState = await imageBox.evaluate((node) => {
  107 |         const lens = node.querySelector('.kj-zoom-lens');
  108 |         const styles = lens ? window.getComputedStyle(lens) : null;
  109 |         return {
  110 |           bg: styles?.backgroundImage || '',
  111 |           opacity: styles ? Number(styles.opacity) : 0,
  112 |           x: node.dataset.kjZoomX,
  113 |           y: node.dataset.kjZoomY,
  114 |           active: lens?.classList.contains('is-visible') || false,
  115 |         };
  116 |       });
  117 |       expect(firstState.active).toBeTruthy();
  118 |       expect(firstState.opacity).toBeGreaterThan(0.9);
  119 |       expect(firstState.bg).toContain('url(');
  120 | 
  121 |       await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.58);
  122 |       const nextState = await imageBox.evaluate((node) => ({
  123 |         x: node.dataset.kjZoomX,
  124 |         y: node.dataset.kjZoomY,
  125 |         bgPosition: window.getComputedStyle(node.querySelector('.kj-zoom-lens')).backgroundPosition,
  126 |       }));
  127 |       expect({ x: nextState.x, y: nextState.y }).not.toEqual({ x: firstState.x, y: firstState.y });
  128 |       expect(nextState.bgPosition).not.toBe('center');
  129 | 
  130 |       await page.mouse.move(box.x + box.width + 80, box.y + box.height + 80);
  131 |       await expect.poll(async () => imageBox.evaluate((node) => {
  132 |         const lens = node.querySelector('.kj-zoom-lens');
  133 |         return lens ? Number(window.getComputedStyle(lens).opacity) : 1;
  134 |       })).toBeLessThan(0.1);
  135 |     }
  136 |   });
  137 | 
  138 |   test('TEST 2b: mobile product image has no hover loupe blocker', async ({ page }, testInfo) => {
  139 |     test.skip(testInfo.project.name !== 'mobile-375', 'Mobile loupe guard is verified on the mobile project.');
  140 | 
  141 |     await page.setViewportSize({ width: 390, height: 760 });
  142 |     await page.goto('/goldproducts/bombay-bangle.html');
  143 |     await waitForApp(page);
  144 | 
  145 |     await expect(page.locator('.sp-product-image-wrapper, .sp-product-image-wrappersilver, .sp-product-image-wrapper-diamond').first()).toBeVisible();
  146 |     await expect(page.locator('.kj-zoom-lens')).toHaveCount(0);
  147 |     await expectNoHorizontalOverflow(page);
  148 |   });
  149 | 
```