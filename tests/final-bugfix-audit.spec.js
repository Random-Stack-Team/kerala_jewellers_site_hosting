const { test, expect } = require('playwright/test');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const productPages = [
  '/goldproducts/bombay-bangle.html',
  '/silverproducts/anklet.html',
  '/diamondproducts/necklace-4.html',
];

async function waitForApp(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(700);
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    html: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(Math.max(overflow.body, overflow.html)).toBeLessThanOrEqual(overflow.viewport + 2);
}

async function collectConsoleErrors(page, action) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await action();
  return errors.filter((error) => !/favicon/i.test(error));
}

function walkHtmlFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'graphify-out', 'test-results', 'playwright-report'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtmlFiles(full, list);
    if (entry.isFile() && entry.name.endsWith('.html')) list.push(full);
  }
  return list;
}

test.describe('final bugfix audit', () => {
  for (const url of productPages) {
    test(`TEST 1: product detail box alignment on ${url}`, async ({ page }) => {
      await page.goto(url);
      await waitForApp(page);

      const readMetrics = async () => page.evaluate(() => {
        const image = document.querySelector('.sp-product-image-wrapper, .sp-product-image-wrappersilver, .sp-product-image-wrapper-diamond');
        const details = document.querySelector('.product-header4_product-details');
        const imageRect = image?.getBoundingClientRect();
        const detailRect = details?.getBoundingClientRect();
        return {
          imageVisible: Boolean(imageRect && imageRect.width > 20 && imageRect.height > 20),
          detailVisible: Boolean(detailRect && detailRect.width > 20 && detailRect.height > 20),
          imageHeight: Math.round(imageRect?.height || 0),
          detailHeight: Math.round(detailRect?.height || 0),
          detailScrollHeight: details?.scrollHeight || 0,
          detailClientHeight: details?.clientHeight || 0,
          detailOverflowY: details ? window.getComputedStyle(details).overflowY : '',
          stacked: window.innerWidth < 1024,
        };
      });

      await expect.poll(async () => {
        const current = await readMetrics();
        if (current.stacked) return 0;
        return Math.abs(current.detailHeight - current.imageHeight);
      }, { timeout: 8_000 }).toBeLessThanOrEqual(12);

      const metrics = await readMetrics();

      expect(metrics.imageVisible).toBeTruthy();
      expect(metrics.detailVisible).toBeTruthy();
      expect(metrics.detailOverflowY).not.toMatch(/scroll|auto/);
      expect(metrics.detailScrollHeight).toBeLessThanOrEqual(metrics.detailClientHeight + 2);
      if (!metrics.stacked) {
        expect(Math.abs(metrics.detailHeight - metrics.imageHeight)).toBeLessThanOrEqual(12);
      }
      await expectNoHorizontalOverflow(page);
    });
  }

  test('TEST 2: product loupe zoom follows cursor and hides on leave', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1366', 'Loupe behavior is desktop pointer-only.');

    for (const width of [1024, 1366, 1440]) {
      await page.setViewportSize({ width, height: 780 });
      await page.goto('/goldproducts/bombay-bangle.html');
      await waitForApp(page);

      const imageBox = page.locator('.sp-product-image-wrapper, .sp-product-image-wrappersilver, .sp-product-image-wrapper-diamond').first();
      await expect(imageBox).toBeVisible();
      const box = await imageBox.boundingBox();
      expect(box).toBeTruthy();

      await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.45);
      await expect.poll(async () => imageBox.evaluate((node) => {
        const lens = node.querySelector('.kj-zoom-lens');
        return lens ? Number(window.getComputedStyle(lens).opacity) : 0;
      })).toBeGreaterThan(0.9);
      const firstState = await imageBox.evaluate((node) => {
        const lens = node.querySelector('.kj-zoom-lens');
        const styles = lens ? window.getComputedStyle(lens) : null;
        return {
          bg: styles?.backgroundImage || '',
          opacity: styles ? Number(styles.opacity) : 0,
          x: node.dataset.kjZoomX,
          y: node.dataset.kjZoomY,
          active: lens?.classList.contains('is-visible') || false,
        };
      });
      expect(firstState.active).toBeTruthy();
      expect(firstState.opacity).toBeGreaterThan(0.9);
      expect(firstState.bg).toContain('url(');

      await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.58);
      const nextState = await imageBox.evaluate((node) => ({
        x: node.dataset.kjZoomX,
        y: node.dataset.kjZoomY,
        bgPosition: window.getComputedStyle(node.querySelector('.kj-zoom-lens')).backgroundPosition,
      }));
      expect({ x: nextState.x, y: nextState.y }).not.toEqual({ x: firstState.x, y: firstState.y });
      expect(nextState.bgPosition).not.toBe('center');

      await page.mouse.move(box.x + box.width + 80, box.y + box.height + 80);
      await expect.poll(async () => imageBox.evaluate((node) => {
        const lens = node.querySelector('.kj-zoom-lens');
        return lens ? Number(window.getComputedStyle(lens).opacity) : 1;
      })).toBeLessThan(0.1);
    }
  });

  test('TEST 2b: mobile product image has no hover loupe blocker', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-375', 'Mobile loupe guard is verified on the mobile project.');

    await page.setViewportSize({ width: 390, height: 760 });
    await page.goto('/goldproducts/bombay-bangle.html');
    await waitForApp(page);

    await expect(page.locator('.sp-product-image-wrapper, .sp-product-image-wrappersilver, .sp-product-image-wrapper-diamond').first()).toBeVisible();
    await expect(page.locator('.kj-zoom-lens')).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test('TEST 3: Platinum page works and shows coming soon only', async ({ page }) => {
    const response = await page.goto('/platinum-products.html');
    expect(response.status()).toBe(200);
    await waitForApp(page);

    await expect(page.locator('.kj-coming-soon, .kj-platinum-copy-panel').first()).toBeVisible();
    await expect(page.getByText(/coming soon|exclusive platinum designs/i).first()).toBeVisible();
    const imageOk = await page.locator('.kj-coming-soon img, .banner-21 img').first().evaluate((image) => image.complete && image.naturalWidth > 0);
    expect(imageOk).toBeTruthy();
    await expect(page.locator('.product-card, .product-item, .product-item-15').filter({ hasText: /View Item|Enquire|Shop Now/i })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test('TEST 4: date/time UI and injector are removed', async ({ page }) => {
    await page.goto('/index.html');
    await waitForApp(page);

    await expect(page.locator('.kj-visit-time, [data-kj-visit-time]')).toHaveCount(0);
    const appSource = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
    const cssSource = fs.readFileSync(path.join(rootDir, 'css', 'responsive.css'), 'utf8');
    expect(appSource).not.toContain('injectVisitDateTime');
    expect(cssSource).not.toContain('.kj-visit-time');
  });

  test('TEST 5: contact form outer box removed and mobile has no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 852 });
    await page.goto('/contact.html');
    await waitForApp(page);

    await expect(page.locator('.banner-19 form, form.get-in-touch-form').first()).toBeVisible();
    const wrapperStyles = await page.locator('.banner-19 .get-in-touch-form-wrap, .banner-19 .get-in-touch-form').first().evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return {
        background: styles.backgroundColor,
        borderWidth: styles.borderTopWidth,
        boxShadow: styles.boxShadow,
      };
    });
    expect(wrapperStyles.borderWidth).toBe('0px');
    expect(wrapperStyles.boxShadow).toBe('none');
    await expectNoHorizontalOverflow(page);
  });

  test('TEST 6: homepage 4 collection cards are equal and have working buttons', async ({ page }) => {
    await page.goto('/index.html');
    await waitForApp(page);

    const cards = page.locator('.div-block-4612 .hero-wrapper > *');
    await expect(cards).toHaveCount(4);
    const sizes = await cards.evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const button = node.querySelector('a.kj-collection-button, a.button-3, a.button-321');
      const buttonRect = button?.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        text: node.textContent.trim(),
        buttonText: button?.textContent.trim() || '',
        buttonHref: button?.getAttribute('href') || '',
        buttonVisible: Boolean(buttonRect && buttonRect.width > 20 && buttonRect.height > 20),
        buttonInside: Boolean(buttonRect && buttonRect.top >= rect.top && buttonRect.bottom <= rect.bottom),
        fontFamily: window.getComputedStyle(node.querySelector('.heading-2, .heading-2-copy') || node).fontFamily,
        headingColor: window.getComputedStyle(node.querySelector('.heading-2, .heading-2-copy') || node).color,
        buttonBg: button ? window.getComputedStyle(button).backgroundColor : '',
        buttonColor: button ? window.getComputedStyle(button).color : '',
      };
    }));

    for (const size of sizes) {
      expect(Math.abs(size.width - sizes[0].width)).toBeLessThanOrEqual(3);
      expect(Math.abs(size.height - sizes[0].height)).toBeLessThanOrEqual(3);
      expect(size.text.length).toBeGreaterThan(10);
      expect(size.buttonVisible).toBeTruthy();
      expect(size.buttonInside).toBeTruthy();
      expect(size.buttonText).toMatch(/View Collection|Coming Soon/i);
      expect(size.buttonHref).not.toMatch(/^$|file:|terms/i);
      expect(size.fontFamily.toLowerCase()).toContain('com 4 dl');
    }
    expect(sizes[0].headingColor).toBe('rgb(255, 248, 208)');
    expect(sizes[0].buttonBg).toBe('rgb(255, 248, 208)');
    expect(sizes[0].buttonColor).toBe('rgb(48, 78, 81)');
    expect(sizes[1].headingColor).toBe('rgb(119, 11, 33)');
    expect(sizes[1].buttonBg).toBe('rgb(255, 248, 208)');
    expect(sizes[1].buttonColor).toBe('rgb(119, 11, 33)');
    expect(sizes[2].headingColor).toBe('rgb(255, 248, 208)');
    expect(sizes[2].buttonBg).toBe('rgb(255, 248, 208)');
    expect(sizes[2].buttonColor).toBe('rgb(30, 45, 94)');
    expect(sizes[3].headingColor).toBe('rgb(255, 248, 208)');
    expect(sizes[3].buttonBg).toBe('rgb(255, 248, 208)');
    expect(sizes[3].buttonColor).toBe('rgb(176, 0, 0)');
    await expectNoHorizontalOverflow(page);
  });

  test('TEST 7: font consistency across key surfaces', async ({ page }) => {
    await page.goto('/goldproducts/bombay-bangle.html');
    await waitForApp(page);

    const families = await page.evaluate(() => {
      const selectors = [
        '.nav-menu-panel a',
        '.product-header4_product-details .text-size-large',
        '.product-header4_product-details .word1',
        '.footer-2',
      ];
      return selectors.map((selector) => {
        const node = document.querySelector(selector);
        return node ? window.getComputedStyle(node).fontFamily.toLowerCase() : '';
      });
    });

    expect(families[0]).toContain('mulish');
    expect(families[1]).toMatch(/georgia|times/);
    expect(families[2]).toContain('mulish');
    expect(families[3]).toContain('mulish');

    await page.goto('/contact.html');
    await waitForApp(page);
    const contactFont = await page.locator('form').first().evaluate((node) => window.getComputedStyle(node).fontFamily.toLowerCase());
    expect(contactFont).toContain('mulish');
  });

  test('TEST 8: Enquire button routing is clean in source files', async () => {
    const problems = [];
    for (const file of walkHtmlFiles(rootDir)) {
      const source = fs.readFileSync(file, 'utf8');
      const links = source.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
      for (const link of links) {
        const text = link.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (!/enquire/i.test(text)) continue;
        const href = /href="([^"]*)"/i.exec(link)?.[1] || '';
        if (!href || /terms|file:|coming-soon|checkout-form/i.test(href) || !/checkout\.html/i.test(href)) {
          problems.push(`${path.relative(rootDir, file)} -> ${href || '(empty)'}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  test('TEST 9: no console errors on main affected pages', async ({ page }) => {
    const pages = [
      '/index.html',
      '/contact.html',
      '/platinum-products.html',
      '/checkout.html?product=BOMBAY%20BANGLES&id=KJG007',
      '/goldproducts/bombay-bangle.html',
      '/silverproducts/anklet.html',
      '/diamondproducts/necklace-4.html',
    ];

    for (const url of pages) {
      const errors = await collectConsoleErrors(page, async () => {
        await page.goto(url);
        await waitForApp(page);
      });
      expect(errors, `${url} console errors`).toEqual([]);
    }

    const localPathRefs = [];
    for (const file of walkHtmlFiles(rootDir)) {
      const source = fs.readFileSync(file, 'utf8');
      if (/file:\/\/\/|[A-Z]:\\/i.test(source)) localPathRefs.push(path.relative(rootDir, file));
    }
    expect(localPathRefs).toEqual([]);
  });

  test('TEST 10: responsive overflow audit', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1366', 'Runs once and manually covers every requested breakpoint.');
    test.setTimeout(120_000);
    const widths = [320, 375, 390, 414, 425, 768, 1024, 1366];
    const pages = ['/index.html', '/contact.html', '/platinum-products.html', '/goldproducts/bombay-bangle.html'];

    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 768 ? 852 : 900 });
      for (const url of pages) {
        await page.goto(url);
        await waitForApp(page);
        await expectNoHorizontalOverflow(page);
      }
    }
  });
});
