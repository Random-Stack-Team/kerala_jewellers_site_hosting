const { test, expect } = require('playwright/test');

const waitForApp = async (page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.documentElement.classList.contains('js-ready'));
  await page.waitForTimeout(250);
};

const expectNoHorizontalOverflow = async (page) => {
  const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
};

test.describe('platinum direct flow, compact rate, product cleanup, and contact form', () => {
  test('desktop Platinum is a direct Coming Soon link with no dropdown', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop-1366', 'desktop navbar check');
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/index.html');
    await waitForApp(page);

    const platinum = page.locator('header.site-header a.kj-platinum-direct-link:visible, header.site-header a.platinumlink:visible, header.site-header a.platinumlink-2:visible').first();
    await expect(platinum).toBeVisible();
    await platinum.hover();

    const dropdownCount = await platinum.evaluate((link) => {
      const wrapper = link.closest('.bko-wrap-111-2, .dropdown, .bko-dropdown-0');
      return wrapper ? wrapper.querySelectorAll('.bko-dropdown-list, .dropdown-list, .kj-megamenu-dropdown').length : 0;
    });
    expect(dropdownCount).toBe(0);

    await platinum.click();
    await expect(page).toHaveURL(/platinum-products\.html/);
    await expect(page.locator('.kj-coming-soon img, .kj-coming-soon--image-only img')).toBeVisible();
    await expect(page.locator('.product-card, .product-item-15, .product-card-title')).toHaveCount(0);
    await expect(page.locator('select')).toHaveCount(0);
  });

  test('mobile Platinum menu opens Coming Soon page directly', async ({ page }) => {
    test.skip(test.info().project.name !== 'mobile-375', 'mobile menu check');
    await page.setViewportSize({ width: 390, height: 852 });
    await page.goto('/index.html');
    await waitForApp(page);

    await page.locator('.menu-mob-3:visible, .menu-button-2:visible, .nav-menu-button:visible').first().click();
    const platinum = page.locator('.kj-mobile-menu-link:visible', { hasText: 'Platinum' }).first();
    await expect(platinum).toBeVisible();
    await platinum.click();

    await expect(page).toHaveURL(/platinum-products\.html/);
    await expect(page.locator('.kj-coming-soon img, .kj-coming-soon--image-only img')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('navbar rate text is compact, aligned, and does not wrap', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop-1366', 'desktop navbar typography check');
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/index.html');
    await waitForApp(page);

    const rate = page.locator('header.site-header .rate-toggle:visible').first();
    const gold = page.locator('header.site-header .goldlink:visible, header.site-header .goldlink-2:visible').first();
    await expect(rate).toBeVisible();
    await expect(rate.locator('.rate-coin')).toBeVisible();
    await expect(rate.locator('.kj-rate-label')).toHaveText('GOLD 22KT/g - ₹14660');

    const metrics = await page.evaluate(() => {
      const visible = (element) => {
        const rect = element?.getBoundingClientRect();
        return rect && rect.width > 0 && rect.height > 0;
      };
      const rate = Array.from(document.querySelectorAll('header.site-header .rate-toggle')).find(visible);
      const gold = Array.from(document.querySelectorAll('header.site-header .goldlink, header.site-header .goldlink-2')).find(visible);
      const coin = rate.querySelector('.rate-coin');
      const label = rate.querySelector('.kj-rate-label');
      const rateStyle = getComputedStyle(rate);
      const goldStyle = getComputedStyle(gold);
      const rateRect = rate.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const coinRect = coin.getBoundingClientRect();
      return {
        rateFont: parseFloat(rateStyle.fontSize),
        goldFont: parseFloat(goldStyle.fontSize),
        rateHeight: rateRect.height,
        labelHeight: labelRect.height,
        coinWidth: coinRect.width,
        coinHeight: coinRect.height,
        wraps: labelRect.height > parseFloat(rateStyle.lineHeight) * 1.35,
      };
    });

    expect(Math.abs(metrics.rateFont - metrics.goldFont)).toBeLessThanOrEqual(6);
    expect(metrics.wraps).toBeFalsy();
    expect(metrics.coinWidth).toBeGreaterThanOrEqual(26);
    expect(metrics.coinHeight).toBeGreaterThanOrEqual(26);
  });

  test('product details do not show share/Facebook/Twitter icons', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop-1366', 'desktop product detail cleanup check');
    const pages = [
      '/goldproducts/bombay-bangle.html',
      '/silverproducts/necklace1.html',
      '/diamondproducts/necklace-4.html',
    ];

    for (const productPage of pages) {
      await page.goto(productPage);
      await waitForApp(page);
      await expect(page.locator('.product-header4_product-details')).toBeVisible();
      await expect(page.locator('.product-header4_product-details .text-block-77')).toHaveCount(0);
      await expect(page.locator('.product-header4_product-details .image-261')).toHaveCount(0);
      await expect(page.locator('.product-header4_product-details .image-26-copy')).toHaveCount(0);
      await expect(page.locator('.product-header4_product-details', { hasText: /^Share$/i })).toHaveCount(0);
    }
  });

  test('contact form is visible, readable, and has no mobile overflow', async ({ page }) => {
    test.skip(test.info().project.name !== 'mobile-375', 'mobile contact readability check');
    await page.setViewportSize({ width: 390, height: 852 });
    await page.goto('/contact.html');
    await waitForApp(page);

    const name = page.locator('form input[placeholder*="Name"], form input[name*="name" i]').first();
    const message = page.locator('form textarea').first();
    const submit = page.locator('.contact-form input[type="submit"]:visible, .banner-19 input[type="submit"]:visible, .contact-form button[type="submit"]:visible, .submit-button:visible').first();
    await expect(name).toBeVisible();
    await expect(message).toBeVisible();
    await expect(submit).toBeVisible();

    const styles = await name.evaluate((input) => {
      const style = getComputedStyle(input);
      return {
        borderWidth: parseFloat(style.borderTopWidth),
        borderColor: style.borderTopColor,
        color: style.color,
        background: style.backgroundColor,
      };
    });

    expect(styles.borderWidth).toBeGreaterThanOrEqual(1);
    expect(styles.borderColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.background).not.toBe('rgba(0, 0, 0, 0)');
    await expectNoHorizontalOverflow(page);
  });
});
