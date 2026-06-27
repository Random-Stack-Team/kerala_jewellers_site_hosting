const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = { desktop: {}, mobile: {}, issues: [] };
  
  try {
    // ---- DESKTOP VIEWPORT (1920x1080) ----
    console.log('\n=== DESKTOP VIEWPORT (1920x1080) ===');
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('http://localhost:8765/post/bridal-gold-jewellery-trends-in-kerala-2026-guide.html', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for header/footer to load
    await desktopPage.waitForTimeout(3000);

    // Take full-page screenshot
    await desktopPage.screenshot({ path: 'screenshots/blog-post-desktop-1920.png', fullPage: true });
    console.log('Screenshot saved: screenshots/blog-post-desktop-1920.png');

    // Check blog-post container max-width
    const blogContainer = await desktopPage.$('.blog-post__container');
    if (blogContainer) {
      const containerBox = await blogContainer.boundingBox();
      const styles = await desktopPage.evaluate(() => {
        const el = document.querySelector('.blog-post__container');
        const cs = window.getComputedStyle(el);
        return {
          maxWidth: cs.maxWidth,
          width: cs.width,
          marginLeft: cs.marginLeft,
          marginRight: cs.marginRight,
          display: cs.display,
          position: cs.position,
        };
      });
      results.desktop.container = styles;
      results.desktop.containerBox = containerBox;
      console.log('Blog container computed styles:', JSON.stringify(styles, null, 2));
      console.log('Blog container bounding box:', JSON.stringify(containerBox, null, 2));

      // Check if max-width is 960px
      if (styles.maxWidth !== '960px') {
        results.issues.push(`DESKTOP: Expected max-width: 960px, got: ${styles.maxWidth}`);
        console.log(`❌ ISSUE: max-width is ${styles.maxWidth}, expected 960px`);
      } else {
        console.log('✅ max-width is correctly 960px');
      }

      // Check centering
      const viewportWidth = 1920;
      const containerWidth = containerBox.width;
      const marginLeftPx = parseFloat(styles.marginLeft);
      const marginRightPx = parseFloat(styles.marginRight);
      const centerOffset = Math.abs(marginLeftPx - marginRightPx);
      console.log(`Container width: ${containerWidth}px, margins: L=${marginLeftPx}px R=${marginRightPx}px`);
      
      if (centerOffset > 2) {
        results.issues.push(`DESKTOP: Container not centered. Left margin: ${marginLeftPx}px, Right margin: ${marginRightPx}px`);
        console.log(`❌ ISSUE: Container not centered (offset: ${centerOffset}px)`);
      } else {
        console.log('✅ Container is centered');
      }
    } else {
      results.issues.push('DESKTOP: .blog-post__container not found');
      console.log('❌ ISSUE: .blog-post__container element not found');
    }

    // Check page title
    const title = await desktopPage.title();
    console.log(`Page title: ${title}`);

    // Check blog-post__title exists and is visible
    const blogTitle = await desktopPage.$('.blog-post__title');
    if (blogTitle) {
      const isVisible = await blogTitle.isVisible();
      const titleText = await blogTitle.textContent();
      console.log(`Blog title visible: ${isVisible}, text: "${titleText.trim().substring(0, 60)}..."`);
    } else {
      results.issues.push('DESKTOP: .blog-post__title not found');
    }

    // Check hero image
    const heroImage = await desktopPage.$('.blog-post__image');
    if (heroImage) {
      const imgBox = await heroImage.boundingBox();
      console.log(`Hero image box: ${JSON.stringify(imgBox)}`);
      if (imgBox && imgBox.width > 960) {
        results.issues.push(`DESKTOP: Hero image width (${imgBox.width}px) exceeds 960px container`);
        console.log(`❌ ISSUE: Hero image wider than container`);
      }
    } else {
      console.log('⚠ Hero image not found');
    }

    await desktopContext.close();

    // ---- MOBILE VIEWPORT (360px) ----
    console.log('\n=== MOBILE VIEWPORT (360px) ===');
    const mobileContext = await browser.newContext({
      viewport: { width: 360, height: 800 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:8765/post/bridal-gold-jewellery-trends-in-kerala-2026-guide.html', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(3000);

    await mobilePage.screenshot({ path: 'screenshots/blog-post-mobile-360.png', fullPage: true });
    console.log('Screenshot saved: screenshots/blog-post-mobile-360.png');

    // Check mobile container
    const mobileBlogContainer = await mobilePage.$('.blog-post__container');
    if (mobileBlogContainer) {
      const mobileStyles = await mobilePage.evaluate(() => {
        const el = document.querySelector('.blog-post__container');
        const cs = window.getComputedStyle(el);
        return {
          maxWidth: cs.maxWidth,
          width: cs.width,
          marginLeft: cs.marginLeft,
          marginRight: cs.marginRight,
          padding: cs.padding,
        };
      });
      const mobileBox = await mobileBlogContainer.boundingBox();
      results.mobile.container = mobileStyles;
      results.mobile.containerBox = mobileBox;
      console.log('Mobile container styles:', JSON.stringify(mobileStyles, null, 2));
      console.log('Mobile container bounding box:', JSON.stringify(mobileBox, null, 2));

      // Check overflow - content should not overflow 360px viewport
      if (mobileBox && mobileBox.width > 360) {
        results.issues.push(`MOBILE: Container width (${mobileBox.width}px) exceeds viewport (360px)`);
        console.log(`❌ ISSUE: Container overflows viewport`);
      } else {
        console.log('✅ Container fits within mobile viewport');
      }

      // Check text is readable (not too small)
      const mobileTitle = await mobilePage.$('.blog-post__title');
      if (mobileTitle) {
        const titleFontSize = await mobilePage.evaluate(() => {
          const el = document.querySelector('.blog-post__title');
          return window.getComputedStyle(el).fontSize;
        });
        console.log(`Mobile title font size: ${titleFontSize}`);
        if (parseFloat(titleFontSize) < 16) {
          results.issues.push(`MOBILE: Title font too small: ${titleFontSize}`);
        }
      }
    } else {
      results.issues.push('MOBILE: .blog-post__container not found');
    }

    // Check horizontal scroll (no overflow)
    const hasHorizontalScroll = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (hasHorizontalScroll) {
      results.issues.push('MOBILE: Page has horizontal scrollbar (content overflows)');
      console.log('❌ ISSUE: Horizontal scroll detected on mobile');
    } else {
      console.log('✅ No horizontal scroll on mobile');
    }

    await mobileContext.close();

  } catch (err) {
    console.error('Test error:', err.message);
    results.issues.push(`ERROR: ${err.message}`);
  } finally {
    await browser.close();
  }

  // ---- SUMMARY ----
  console.log('\n=============================');
  console.log('       TEST SUMMARY');
  console.log('=============================');
  if (results.issues.length === 0) {
    console.log('✅ ALL CHECKS PASSED - Page renders correctly at both viewports');
  } else {
    console.log(`❌ ${results.issues.length} ISSUE(S) FOUND:`);
    results.issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
  }
  console.log('=============================\n');
})();
