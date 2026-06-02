# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\final-bugfix-audit.spec.js >> final bugfix audit >> TEST 9: no console errors on main affected pages
- Location: tests\final-bugfix-audit.spec.js:288:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/index.html", waiting until "load"

```

# Test source

```ts
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
  265 |     await page.goto('/contact.html');
  266 |     await waitForApp(page);
  267 |     const contactFont = await page.locator('form').first().evaluate((node) => window.getComputedStyle(node).fontFamily.toLowerCase());
  268 |     expect(contactFont).toContain('mulish');
  269 |   });
  270 | 
  271 |   test('TEST 8: Enquire button routing is clean in source files', async () => {
  272 |     const problems = [];
  273 |     for (const file of walkHtmlFiles(rootDir)) {
  274 |       const source = fs.readFileSync(file, 'utf8');
  275 |       const links = source.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
  276 |       for (const link of links) {
  277 |         const text = link.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  278 |         if (!/enquire/i.test(text)) continue;
  279 |         const href = /href="([^"]*)"/i.exec(link)?.[1] || '';
  280 |         if (!href || /terms|file:|coming-soon|checkout-form/i.test(href) || !/checkout\.html/i.test(href)) {
  281 |           problems.push(`${path.relative(rootDir, file)} -> ${href || '(empty)'}`);
  282 |         }
  283 |       }
  284 |     }
  285 |     expect(problems).toEqual([]);
  286 |   });
  287 | 
  288 |   test('TEST 9: no console errors on main affected pages', async ({ page }) => {
  289 |     const pages = [
  290 |       '/index.html',
  291 |       '/contact.html',
  292 |       '/platinum-products.html',
  293 |       '/checkout.html?product=BOMBAY%20BANGLES&id=KJG007',
  294 |       '/goldproducts/bombay-bangle.html',
  295 |       '/silverproducts/anklet.html',
  296 |       '/diamondproducts/necklace-4.html',
  297 |     ];
  298 | 
  299 |     for (const url of pages) {
  300 |       const errors = await collectConsoleErrors(page, async () => {
> 301 |         await page.goto(url);
      |                    ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  302 |         await waitForApp(page);
  303 |       });
  304 |       expect(errors, `${url} console errors`).toEqual([]);
  305 |     }
  306 | 
  307 |     const localPathRefs = [];
  308 |     for (const file of walkHtmlFiles(rootDir)) {
  309 |       const source = fs.readFileSync(file, 'utf8');
  310 |       if (/file:\/\/\/|[A-Z]:\\/i.test(source)) localPathRefs.push(path.relative(rootDir, file));
  311 |     }
  312 |     expect(localPathRefs).toEqual([]);
  313 |   });
  314 | 
  315 |   test('TEST 10: responsive overflow audit', async ({ page }, testInfo) => {
  316 |     test.skip(testInfo.project.name !== 'desktop-1366', 'Runs once and manually covers every requested breakpoint.');
  317 |     test.setTimeout(120_000);
  318 |     const widths = [320, 375, 390, 414, 425, 768, 1024, 1366];
  319 |     const pages = ['/index.html', '/contact.html', '/platinum-products.html', '/goldproducts/bombay-bangle.html'];
  320 | 
  321 |     for (const width of widths) {
  322 |       await page.setViewportSize({ width, height: width < 768 ? 852 : 900 });
  323 |       for (const url of pages) {
  324 |         await page.goto(url);
  325 |         await waitForApp(page);
  326 |         await expectNoHorizontalOverflow(page);
  327 |       }
  328 |     }
  329 |   });
  330 | });
  331 | 
```