# Final Unused CSS Selectors Analysis
# Kerala Jewellers Project

## Executive Summary
- **Total unique unused class selectors: 1,098**
- **Total unused CSS rules: 2,777**
- **HTML files analyzed: 100+**
- **CSS files analyzed: 9**

---

## TOP 30 MOST COMMON UNUSED CSS SELECTORS

| # | Selector | Count | Files | Status |
|---|----------|-------|-------|--------|
| 1 | `.navigation-2` | 66 | layout.css, desktop.css, overrides.css | **DEAD** - Not in HTML or JS |
| 2 | `.webp` | 38 | layout.css | **FALSE POSITIVE** - Image file extension in URLs |
| 3 | `.cc-product-detail` | 28 | desktop.css | **DEAD** - Webflow page pattern |
| 4 | `.kj-wrapper` | 25 | components.css | **DEAD** - Not in HTML |
| 5 | `.kj-menu` | 21 | components.css | **DEAD** - Not in HTML |
| 6 | `.swiper-slide-active` | 21 | overrides.css | **JS-GENERATED** - Added by slider.js |
| 7 | `.kj-selection` | 19 | components.css, desktop.css | **DEAD** - Not in HTML |
| 8 | `.is-open` | 19 | layout.css, components.css | **JS-GENERATED** - State class |
| 9 | `.kj-dropdown-trigger` | 17 | components.css | **DEAD** - Not in HTML |
| 10 | `.collection-toolbar__reset` | 17 | overrides.css | **JS-GENERATED** - Created by app.js |
| 11 | `.text-field-12` | 16 | header.css | **DEAD** - Webflow form field |
| 12 | `.cc-homepage-3` | 16 | components.css | **JS-REFERENCED** - Used in app.js selector |
| 13 | `.kj-banner2-gallery` | 15 | responsive.css | **JS-GENERATED** - Added by slider.js |
| 14 | `.kj-grid-2col` | 14 | components.css, header.css, desktop.css | **DEAD** - Not in HTML |
| 15 | `.site-nav` | 14 | layout.css | **DEAD** - Not in HTML |
| 16 | `.kj-grid` | 14 | components.css, header.css | **DEAD** - Not in HTML |
| 17 | `.kj-banner2-slide` | 14 | responsive.css | **JS-GENERATED** - Added by slider.js |
| 18 | `.collection-toolbar` | 13 | overrides.css, responsive.css | **JS-GENERATED** - Created by app.js |
| 19 | `.collection-toolbar__select` | 13 | overrides.css | **JS-GENERATED** - Created by app.js |
| 20 | `.footer-block` | 13 | desktop.css | **DEAD** - Webflow footer pattern |
| 21 | `.product-header5_product-details` | 13 | pages.css | **DEAD** - Webflow product template |
| 22 | `.png` | 12 | layout.css | **FALSE POSITIVE** - Image file extension |
| 23 | `.kj-dropdown-panel` | 12 | components.css, header.css | **DEAD** - Not in HTML |
| 24 | `.form-select` | 12 | base.css | **DEAD** - Not in HTML |
| 25 | `.product-item-14` | 11 | components.css, desktop.css, overrides.css | **DEAD** - Webflow product item |
| 26 | `.royal-blue` | 11 | layout.css, components.css | **DEAD** - Color class not used |
| 27 | `.navigation-item` | 10 | layout.css | **DEAD** - Not in HTML |
| 28 | `.nav-overlay` | 10 | layout.css | **DEAD** - Not in HTML |
| 29 | `.button-12` | 10 | header.css | **DEAD** - Webflow button |
| 30 | `.kj-nav-text` | 10 | components.css | **DEAD** - Not in HTML |

---

## WEBFLOW PATTERN ANALYSIS

### Confirmed Dead Webflow Patterns

| Pattern | CSS Occurrences | In HTML | Status |
|---------|-----------------|---------|--------|
| `.w-layout-grid` | 0 | Yes | **IN HTML** - Layout grid class |
| `.w-condition-invisible` | 0 | No | **NOT USED** - Can remove |
| `.w-variant-*` | 0 | No | **NOT USED** - Can remove |
| `.form-done` | 0 | Yes | **IN HTML** - Form success state |
| `.form-error` | 0 | No | **NOT USED** - Can remove |
| `.section-hero` | 0 | No | **NOT USED** - Can remove |
| `.section-footer` | 2 | No | **DEAD** - layout.css:975, desktop.css:2381 |
| `.section-header` | 0 | No | **NOT USED** - Can remove |
| `.collection-item-*` | 4 | No | **DEAD** - layout.css:903, components.css:1523, header.css:754 |

### Dead Webflow Page Patterns
- `.cc-product-detail` (28 rules) - Product detail page template
- `.cc-homepage-3` (16 rules) - Homepage template (JS-referenced)
- `.product-header5_product-details` (13 rules) - Product header template
- `.product-item-14` (11 rules) - Product item template
- `.footer-block` (13 rules) - Footer template
- `.text-field-12` (16 rules) - Form field template

---

## FILE-BY-FILE BREAKDOWN

### css/base.css
- `.form-select` (12 rules) - **DEAD**

### css/layout.css
- `.navigation-2` (66 rules) - **DEAD** (highest count)
- `.site-nav` (14 rules) - **DEAD**
- `.navigation-item` (10 rules) - **DEAD**
- `.nav-overlay` (10 rules) - **DEAD**
- `.royal-blue` (11 rules) - **DEAD**

### css/components.css
- `.kj-wrapper` (25 rules) - **DEAD**
- `.kj-menu` (21 rules) - **DEAD**
- `.kj-selection` (19 rules) - **DEAD**
- `.kj-dropdown-trigger` (17 rules) - **DEAD**
- `.kj-grid-2col` (14 rules) - **DEAD**
- `.kj-grid` (14 rules) - **DEAD**
- `.kj-dropdown-panel` (12 rules) - **DEAD**
- `.kj-nav-text` (10 rules) - **DEAD**

### css/header.css
- `.text-field-12` (16 rules) - **DEAD**
- `.button-12` (10 rules) - **DEAD**

### css/desktop.css
- `.cc-product-detail` (28 rules) - **DEAD**
- `.footer-block` (13 rules) - **DEAD**

### css/overrides.css
- `.collection-toolbar__reset` (17 rules) - **JS-GENERATED**
- `.collection-toolbar` (13 rules) - **JS-GENERATED**
- `.collection-toolbar__select` (13 rules) - **JS-GENERATED**

### css/pages.css
- `.product-header5_product-details` (13 rules) - **DEAD**

### css/responsive.css
- `.kj-banner2-gallery` (15 rules) - **JS-GENERATED**
- `.kj-banner2-slide` (14 rules) - **JS-GENERATED**

---

## CATEGORIES

### 1. TRULY DEAD SELECTORS (Safe to Remove)
**Total: ~800+ selectors**

High-priority removals:
- `.navigation-2` (66 rules)
- `.cc-product-detail` (28 rules)
- `.kj-wrapper` (25 rules)
- `.kj-menu` (21 rules)
- `.kj-selection` (19 rules)
- `.kj-dropdown-trigger` (17 rules)
- `.text-field-12` (16 rules)
- `.kj-grid-2col` (14 rules)
- `.site-nav` (14 rules)
- `.kj-grid` (14 rules)
- `.footer-block` (13 rules)
- `.product-header5_product-details` (13 rules)
- `.kj-dropdown-panel` (12 rules)
- `.form-select` (12 rules)
- `.product-item-14` (11 rules)
- `.royal-blue` (11 rules)
- `.navigation-item` (10 rules)
- `.nav-overlay` (10 rules)
- `.button-12` (10 rules)
- `.kj-nav-text` (10 rules)

### 2. JAVASCRIPT-GENERATED SELECTORS (Keep - Used Dynamically)
**Total: ~100+ selectors**

- `.swiper-slide-active` - Slider.js
- `.is-open` - State management
- `.collection-toolbar*` - app.js
- `.kj-banner2-*` - slider.js
- `.cc-homepage-3` - app.js selector

### 3. FALSE POSITIVES (Not Real Selectors)
- `.webp` - Image file extension in CSS URLs
- `.png` - Image file extension in CSS URLs

---

## RECOMMENDATIONS

### Immediate Cleanup (High Impact)
1. Remove `.navigation-2` rules from layout.css, desktop.css, overrides.css (66 rules)
2. Remove `.cc-product-detail` rules from desktop.css (28 rules)
3. Remove `.kj-wrapper`, `.kj-menu`, `.kj-selection` from components.css (65 rules)
4. Remove `.kj-dropdown-trigger`, `.kj-dropdown-panel` from components.css (29 rules)
5. Remove `.kj-grid-2col`, `.kj-grid` from components.css, header.css, desktop.css (28 rules)

### Webflow Template Cleanup
1. Remove `.text-field-12` from header.css (16 rules)
2. Remove `.button-12` from header.css (10 rules)
3. Remove `.product-header5_product-details` from pages.css (13 rules)
4. Remove `.product-item-14` from components.css, desktop.css, overrides.css (11 rules)
5. Remove `.footer-block` from desktop.css (13 rules)

### Navigation Cleanup
1. Remove `.site-nav` from layout.css (14 rules)
2. Remove `.navigation-item` from layout.css (10 rules)
3. Remove `.nav-overlay` from layout.css (10 rules)

### Estimated Savings
- **Total removable rules: ~800-1,000+**
- **Estimated file size reduction: 15-25% of CSS files**
- **Performance improvement: Reduced parse/compile time**