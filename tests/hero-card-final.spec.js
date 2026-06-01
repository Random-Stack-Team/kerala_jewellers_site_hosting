const { test, expect } = require('playwright/test');

const waitForApp = async (page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.documentElement.classList.contains('js-ready'));
  await page.waitForTimeout(250);
};

const cardMap = [
  { name: 'Gold', selector: '.div-block-4612 .hero-split-1', label: 'View Collection', href: /products\.html$/ },
  { name: 'Silver', selector: '.div-block-4612 .hero-split-4', label: 'View Collection', href: /silver-products\.html$/ },
  { name: 'Diamond', selector: '.div-block-4612 .hero-split-3', label: 'View Collection', href: /diamonds-products\.html$/ },
  { name: 'Platinum', selector: '.div-block-4612 .hero-split-2', label: 'Coming Soon', href: /platinum-products\.html$/ },
];

test.describe('homepage collection cards final state', () => {
  test('button text and links are mapped to the correct cards', async ({ page }) => {
    await page.goto('/index.html');
    await waitForApp(page);

    for (const card of cardMap) {
      const button = page.locator(`${card.selector} a.kj-collection-button, ${card.selector} a.button-3, ${card.selector} a.button-321`).first();
      await expect(button, `${card.name} button`).toBeVisible();
      await expect(button).toHaveText(card.label);
      await expect(button).toHaveAttribute('href', card.href);
    }
  });

  test('mobile cards stay visible, tappable, and inside the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 852 });
    await page.goto('/index.html');
    await waitForApp(page);

    const metrics = await page.evaluate((selectors) => selectors.map((selector) => {
      const card = document.querySelector(selector);
      const button = card?.querySelector('a.kj-collection-button, a.button-3, a.button-321');
      const rect = card?.getBoundingClientRect();
      const buttonRect = button?.getBoundingClientRect();
      return {
        selector,
        exists: Boolean(card),
        text: card?.innerText || '',
        x: rect?.x || 0,
        right: rect?.right || 0,
        width: rect?.width || 0,
        buttonVisible: Boolean(buttonRect && buttonRect.width > 20 && buttonRect.height > 20),
        buttonInside: Boolean(rect && buttonRect && buttonRect.left >= rect.left - 2 && buttonRect.right <= rect.right + 2),
      };
    }), cardMap.map((card) => card.selector));

    for (const item of metrics) {
      expect(item.exists, `${item.selector} exists`).toBeTruthy();
      expect(item.width).toBeGreaterThan(300);
      expect(item.x).toBeGreaterThanOrEqual(0);
      expect(item.right).toBeLessThanOrEqual(392);
      expect(item.buttonVisible).toBeTruthy();
      expect(item.buttonInside).toBeTruthy();
    }

    const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test('desktop cards are a balanced 2x2 grid', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/index.html');
    await waitForApp(page);

    const rects = await page.evaluate((selectors) => selectors.map((selector) => {
      const rect = document.querySelector(selector).getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }), cardMap.map((card) => card.selector));

    const widthDelta = Math.max(...rects.map((rect) => rect.width)) - Math.min(...rects.map((rect) => rect.width));
    const heightDelta = Math.max(...rects.map((rect) => rect.height)) - Math.min(...rects.map((rect) => rect.height));
    expect(widthDelta).toBeLessThanOrEqual(3);
    expect(heightDelta).toBeLessThanOrEqual(3);
    expect(new Set(rects.map((rect) => Math.round(rect.y))).size).toBe(2);
  });
});
