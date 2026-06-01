const { test, expect } = require('playwright/test');

const productPages = [
  '/goldproducts/bombay-bangles-2.html',
  '/silverproducts/anklet.html',
  '/diamondproducts/necklace-4.html',
];

async function waitForApp(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(600);
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  ));
  expect(hasOverflow).toBeFalsy();
}

test.describe('Kerala Jewellers final frontend regressions', () => {
  test('homepage collection boxes remain equal sized and centered', async ({ page }) => {
    await page.goto('/index.html');
    await waitForApp(page);

    await expectNoHorizontalOverflow(page);
    await expect(page.locator('.kj-visit-time')).toHaveCount(0);

    const boxes = await page.locator('.div-block-4612 .hero-wrapper > *').evaluateAll((items) => (
      items.map((item) => {
        const rect = item.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
    ));

    expect(boxes).toHaveLength(4);
    const first = boxes[0];
    for (const box of boxes) {
      expect(Math.abs(box.width - first.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.height - first.height)).toBeLessThanOrEqual(20);
    }
  });

  test('navbar rate dropdown matches nav rhythm and coin is visible', async ({ page }) => {
    test.skip(page.viewportSize().width < 1024, 'Desktop rate dropdown typography is only visible on desktop nav.');

    await page.goto('/index.html');
    await waitForApp(page);

    const toggle = page.locator('.rate-toggle:visible').first();
    await expect(toggle).toBeVisible();

    const metrics = await toggle.evaluate((element) => {
      const coin = element.querySelector('.rate-coin');
      const coinRect = coin.getBoundingClientRect();
      const styles = window.getComputedStyle(element);
      return {
        coinWidth: Math.round(coinRect.width),
        coinHeight: Math.round(coinRect.height),
        fontFamily: styles.fontFamily,
        fontWeight: Number(styles.fontWeight),
      };
    });

    expect(metrics.coinWidth).toBeGreaterThanOrEqual(30);
    expect(metrics.coinHeight).toBeGreaterThanOrEqual(30);
    expect(metrics.fontFamily.toLowerCase()).toContain('mulish');
    expect(metrics.fontWeight).toBeGreaterThanOrEqual(650);
  });

  for (const url of productPages) {
    test(`product detail panel matches image height and enquiry route on ${url}`, async ({ page }) => {
      await page.goto(url);
      await waitForApp(page);

      await expectNoHorizontalOverflow(page);

      const detail = page.locator('.product-header4_product-details').first();
      const imageBox = page.locator('.sp-product-image-wrapper, .sp-product-image-wrappersilver, .sp-product-image-wrapper-diamond').first();

      await expect(detail).toBeVisible();
      await expect(imageBox).toBeVisible();

      const sizes = await page.evaluate(() => {
        const detailEl = document.querySelector('.product-header4_product-details');
        const imageEl = document.querySelector('.sp-product-image-wrapper, .sp-product-image-wrappersilver, .sp-product-image-wrapper-diamond');
        return {
          detailHeight: Math.round(detailEl.getBoundingClientRect().height),
          imageHeight: Math.round(imageEl.getBoundingClientRect().height),
        };
      });

      if (page.viewportSize().width >= 1024) {
        expect(Math.abs(sizes.detailHeight - sizes.imageHeight)).toBeLessThanOrEqual(12);
      } else {
        expect(sizes.detailHeight).toBeGreaterThan(0);
        expect(sizes.imageHeight).toBeGreaterThan(0);
      }

      const enquireLinks = await page.locator('a').evaluateAll((links) => (
        links
          .filter((link) => /enquire/i.test(link.textContent || ''))
          .map((link) => link.getAttribute('href') || '')
      ));

      expect(enquireLinks.length).toBeGreaterThan(0);
      for (const href of enquireLinks) {
        expect(href.toLowerCase()).toContain('checkout.html');
        expect(href.toLowerCase()).not.toContain('terms');
      }

      if (page.viewportSize().width >= 1024) {
        const zoomReady = await page.locator('.kj-zoom-ready').count();
        expect(zoomReady).toBeGreaterThan(0);
      }
    });
  }

  test('Platinum page is coming-soon only with no product filters', async ({ page }) => {
    await page.goto('/platinum-products.html');
    await waitForApp(page);

    await expectNoHorizontalOverflow(page);
    await expect(page.locator('.kj-platinum-copy-panel')).toBeVisible();
    await expect(page.locator('.banner-21 img')).toBeVisible();
    await expect(page.locator('.filter-toolbar, .product-filter-toolbar, select')).toHaveCount(0);
    await expect(page.locator('.banner-18 .product-item-15, .banner-18 .dynamic-item').filter({ hasText: /Shop Now|View Item/i })).toHaveCount(0);
  });

  test('footer phone numbers are separate readable tel links', async ({ page }) => {
    await page.goto('/contact.html');
    await waitForApp(page);

    await expectNoHorizontalOverflow(page);
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();

    const badTelLinks = await page.locator('a[href^="tel:"]').evaluateAll((links) => (
      links
        .map((link) => link.getAttribute('href') || '')
        .filter((href) => /[,/;]/.test(href))
    ));

    expect(badTelLinks).toHaveLength(0);
  });

  test('enquiry page keeps product query data and themed form visible', async ({ page }) => {
    await page.goto('/checkout.html?product=BOMBAY%20BANGLES&id=KJG007');
    await waitForApp(page);

    await expectNoHorizontalOverflow(page);
    await expect(page.locator('.enquiry-page, body')).toBeVisible();
    await expect(page.locator('input[name*="product" i], input[id*="product" i], textarea, form').first()).toBeVisible();
    await expect(page.locator('text=/Submit Enquiry|WhatsApp Enquiry|Enquire/i').first()).toBeVisible();
  });
});
