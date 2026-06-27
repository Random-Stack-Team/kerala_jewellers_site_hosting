# Kerala Jewellers - Agent Rules

## Context Management (CRITICAL)

CSS was split from one 17K-line file into logical modules. The largest file is now ~4500 lines.

- Always use `grep` to find class names before reading CSS — never read entire CSS files.
- After fixing an issue, stop. Do not re-read files you already examined.
- Batch related edits together rather than making many small read-edit cycles.
- Prefer `task` agents for parallel exploration instead of sequential reads.

## File Structure

### CSS (split from original style.css)
- `css/base.css` — reset, `:root` vars, fonts, Webflow utilities (~525 lines)
- `css/layout.css` — early responsive, base layout, nav skeleton (~2475 lines)
- `css/components.css` — product cards, banners, sliders, hero sections (~3540 lines)
- `css/header.css` — header, mega menu, product detail, timeline (~3089 lines)
- `css/desktop.css` — desktop/large-screen responsive overrides, grid nodes (~4526 lines)
- `css/overrides.css` — header refinements, slider/carousel fixes, loupe zoom (~1523 lines)
- `css/pages.css` — product typography, contact, footer, blog, gallery, a11y (~1569 lines)
- `css/responsive.css` — media query overrides (~3000 lines)
- `css/navbar.css` — header/nav styles (~2500 lines)

### HTML & JS
- `partials/header.html` — shared header (injected via JS)
- `partials/footer.html` — shared footer (injected via JS)
- `js/header-loader.js` — fetches and injects header
- `js/footer-loader.js` — fetches and injects footer
- `js/app.js` — core JS (product filtering, rates, mobile nav)
- Product pages: `goldproducts/`, `silverproducts/`, `diamondproducts/` (need `../` prefix for assets)

## Breakpoints

- `max-width: 479px` — small mobile
- `max-width: 767px` — mobile
- `max-width: 991px` — tablet
- `min-width: 992px` — desktop
- `min-width: 1200px` — large desktop

## Cache Busting

CSS/JS files use query strings: `?v=kj-20260627-2`
After modifying CSS/JS, update query strings in ALL HTML files that reference them.

## Deployment

Static site on Vercel. No build step. Changes deploy on push.
