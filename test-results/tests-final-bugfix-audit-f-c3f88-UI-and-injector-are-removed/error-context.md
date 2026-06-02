# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\final-bugfix-audit.spec.js >> final bugfix audit >> TEST 4: date/time UI and injector are removed
- Location: tests\final-bugfix-audit.spec.js:163:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/index.html", waiting until "load"

```

# Test source

```ts
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
  150 |   test('TEST 3: Platinum page works and shows coming soon only', async ({ page }) => {
  151 |     const response = await page.goto('/platinum-products.html');
  152 |     expect(response.status()).toBe(200);
  153 |     await waitForApp(page);
  154 | 
  155 |     await expect(page.locator('.kj-coming-soon, .kj-platinum-copy-panel').first()).toBeVisible();
  156 |     await expect(page.getByText(/coming soon|exclusive platinum designs/i).first()).toBeVisible();
  157 |     const imageOk = await page.locator('.kj-coming-soon img, .banner-21 img').first().evaluate((image) => image.complete && image.naturalWidth > 0);
  158 |     expect(imageOk).toBeTruthy();
  159 |     await expect(page.locator('.product-card, .product-item, .product-item-15').filter({ hasText: /View Item|Enquire|Shop Now/i })).toHaveCount(0);
  160 |     await expectNoHorizontalOverflow(page);
  161 |   });
  162 | 
  163 |   test('TEST 4: date/time UI and injector are removed', async ({ page }) => {
> 164 |     await page.goto('/index.html');
      |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  165 |     await waitForApp(page);
  166 | 
  167 |     await expect(page.locator('.kj-visit-time, [data-kj-visit-time]')).toHaveCount(0);
  168 |     const appSource = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  169 |     const cssSource = fs.readFileSync(path.join(rootDir, 'css', 'responsive.css'), 'utf8');
  170 |     expect(appSource).not.toContain('injectVisitDateTime');
  171 |     expect(cssSource).not.toContain('.kj-visit-time');
  172 |   });
  173 | 
  174 |   test('TEST 5: contact form outer box removed and mobile has no overflow', async ({ page }) => {
  175 |     await page.setViewportSize({ width: 390, height: 852 });
  176 |     await page.goto('/contact.html');
  177 |     await waitForApp(page);
  178 | 
  179 |     await expect(page.locator('.banner-19 form, form.get-in-touch-form').first()).toBeVisible();
  180 |     const wrapperStyles = await page.locator('.banner-19 .get-in-touch-form-wrap, .banner-19 .get-in-touch-form').first().evaluate((node) => {
  181 |       const styles = window.getComputedStyle(node);
  182 |       return {
  183 |         background: styles.backgroundColor,
  184 |         borderWidth: styles.borderTopWidth,
  185 |         boxShadow: styles.boxShadow,
  186 |       };
  187 |     });
  188 |     expect(wrapperStyles.borderWidth).toBe('0px');
  189 |     expect(wrapperStyles.boxShadow).toBe('none');
  190 |     await expectNoHorizontalOverflow(page);
  191 |   });
  192 | 
  193 |   test('TEST 6: homepage 4 collection cards are equal and have working buttons', async ({ page }) => {
  194 |     await page.goto('/index.html');
  195 |     await waitForApp(page);
  196 | 
  197 |     const cards = page.locator('.div-block-4612 .hero-wrapper > *');
  198 |     await expect(cards).toHaveCount(4);
  199 |     const sizes = await cards.evaluateAll((nodes) => nodes.map((node) => {
  200 |       const rect = node.getBoundingClientRect();
  201 |       const button = node.querySelector('a.kj-collection-button, a.button-3, a.button-321');
  202 |       const buttonRect = button?.getBoundingClientRect();
  203 |       return {
  204 |         width: Math.round(rect.width),
  205 |         height: Math.round(rect.height),
  206 |         text: node.textContent.trim(),
  207 |         buttonText: button?.textContent.trim() || '',
  208 |         buttonHref: button?.getAttribute('href') || '',
  209 |         buttonVisible: Boolean(buttonRect && buttonRect.width > 20 && buttonRect.height > 20),
  210 |         buttonInside: Boolean(buttonRect && buttonRect.top >= rect.top && buttonRect.bottom <= rect.bottom),
  211 |         fontFamily: window.getComputedStyle(node.querySelector('.heading-2, .heading-2-copy') || node).fontFamily,
  212 |         headingColor: window.getComputedStyle(node.querySelector('.heading-2, .heading-2-copy') || node).color,
  213 |         buttonBg: button ? window.getComputedStyle(button).backgroundColor : '',
  214 |         buttonColor: button ? window.getComputedStyle(button).color : '',
  215 |       };
  216 |     }));
  217 | 
  218 |     for (const size of sizes) {
  219 |       expect(Math.abs(size.width - sizes[0].width)).toBeLessThanOrEqual(3);
  220 |       expect(Math.abs(size.height - sizes[0].height)).toBeLessThanOrEqual(3);
  221 |       expect(size.text.length).toBeGreaterThan(10);
  222 |       expect(size.buttonVisible).toBeTruthy();
  223 |       expect(size.buttonInside).toBeTruthy();
  224 |       expect(size.buttonText).toMatch(/View Collection|Coming Soon/i);
  225 |       expect(size.buttonHref).not.toMatch(/^$|file:|terms/i);
  226 |       expect(size.fontFamily.toLowerCase()).toContain('com 4 dl');
  227 |     }
  228 |     expect(sizes[0].headingColor).toBe('rgb(255, 248, 208)');
  229 |     expect(sizes[0].buttonBg).toBe('rgb(255, 248, 208)');
  230 |     expect(sizes[0].buttonColor).toBe('rgb(48, 78, 81)');
  231 |     expect(sizes[1].headingColor).toBe('rgb(119, 11, 33)');
  232 |     expect(sizes[1].buttonBg).toBe('rgb(255, 248, 208)');
  233 |     expect(sizes[1].buttonColor).toBe('rgb(119, 11, 33)');
  234 |     expect(sizes[2].headingColor).toBe('rgb(255, 248, 208)');
  235 |     expect(sizes[2].buttonBg).toBe('rgb(255, 248, 208)');
  236 |     expect(sizes[2].buttonColor).toBe('rgb(30, 45, 94)');
  237 |     expect(sizes[3].headingColor).toBe('rgb(255, 248, 208)');
  238 |     expect(sizes[3].buttonBg).toBe('rgb(255, 248, 208)');
  239 |     expect(sizes[3].buttonColor).toBe('rgb(176, 0, 0)');
  240 |     await expectNoHorizontalOverflow(page);
  241 |   });
  242 | 
  243 |   test('TEST 7: font consistency across key surfaces', async ({ page }) => {
  244 |     await page.goto('/goldproducts/bombay-bangle.html');
  245 |     await waitForApp(page);
  246 | 
  247 |     const families = await page.evaluate(() => {
  248 |       const selectors = [
  249 |         '.nav-menu-panel a',
  250 |         '.product-header4_product-details .text-size-large',
  251 |         '.product-header4_product-details .word1',
  252 |         '.footer-2',
  253 |       ];
  254 |       return selectors.map((selector) => {
  255 |         const node = document.querySelector(selector);
  256 |         return node ? window.getComputedStyle(node).fontFamily.toLowerCase() : '';
  257 |       });
  258 |     });
  259 | 
  260 |     expect(families[0]).toContain('mulish');
  261 |     expect(families[1]).toMatch(/georgia|times/);
  262 |     expect(families[2]).toContain('mulish');
  263 |     expect(families[3]).toContain('mulish');
  264 | 
```