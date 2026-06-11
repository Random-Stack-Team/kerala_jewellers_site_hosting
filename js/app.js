document.documentElement.classList.add('js-ready');

(() => {
  const METAL_RATES = [
    { label: 'GOLD 22 KT/1g - Rs. 14660', shortLabel: 'GOLD 22 KT/1g - Rs. 14660', icon: 'assets/coin/gold coin.png', metal: 'gold', page: '' },
    { label: 'GOLD 18 KT/1g - Rs. 12003', shortLabel: 'GOLD 18 KT/1g - Rs. 12003', icon: 'assets/coin/gold coin.png', metal: 'gold', page: '' },
    { label: 'PLATINUM 1g - Rs. 7901', shortLabel: 'PLATINUM 1g - Rs. 7901', icon: 'assets/coin/Platinum Coin.png', metal: 'platinum', page: '' },
    { label: 'SILVER 1g - Rs. 290', shortLabel: 'SILVER 1g - Rs. 290', icon: 'assets/coin/silver coin.png', metal: 'silver', page: '' }
  ];

  const getAssetPrefix = () => {
    const path = window.location.pathname.replace(/\\/g, '/');
    return /\/(goldproducts|silverproducts|diamondproducts|post)\//.test(path) ? '../' : '';
  };

  const getCurrentMetal = () => {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const category = (params.get('metal') || params.get('type') || '').toLowerCase();

    if (path.includes('silver') || category.includes('silver')) return 'silver';
    if (path.includes('coming-soon') || path.includes('platinum') || category.includes('platinum')) return 'platinum';
    if (path.includes('diamond') || category.includes('diamond')) return 'diamond';
    if (path.includes('gold') || /(^|\/)products\.html$/.test(path) || category.includes('gold')) return 'gold';
    return 'gold';
  };

  const getOrderedRates = () => {
    const currentMetal = getCurrentMetal();
    if (currentMetal === 'diamond') return [];
    return [
      ...METAL_RATES.filter((rate) => rate.metal === currentMetal),
      ...METAL_RATES.filter((rate) => rate.metal !== currentMetal)
    ];
  };

  const renderRateLabelForCurrentPage = () => {
    const currentMetal = getCurrentMetal();
    const shouldHideRate = currentMetal === 'diamond';
    const prefix = getAssetPrefix();

    document.documentElement.classList.toggle('kj-hide-rate-dropdown', shouldHideRate);
    document.body?.classList.toggle('kj-hide-rate-dropdown', shouldHideRate);

    document.querySelectorAll('.rate-dropdown, .rate-dropdown-container').forEach((dropdown) => {
      dropdown.hidden = shouldHideRate;
      dropdown.classList.toggle('kj-rate-hidden', shouldHideRate);
      dropdown.classList.remove('is-open');
      dropdown.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
      if (shouldHideRate) {
        dropdown.style.setProperty('display', 'none', 'important');
        dropdown.style.setProperty('visibility', 'hidden', 'important');
        dropdown.style.setProperty('pointer-events', 'none', 'important');
        return;
      }

      dropdown.style.removeProperty('display');
      dropdown.style.removeProperty('visibility');
      dropdown.style.removeProperty('pointer-events');

      const orderedRates = getOrderedRates();
      const primaryRate = orderedRates[0] || METAL_RATES[0];
      const trigger = dropdown.querySelector('.rate-toggle, .rate-dropdown-trigger');
      const triggerText = trigger?.querySelector('span');
      const triggerImage = trigger?.querySelector('img');
      const menu = dropdown.querySelector('.rate-menu, .rate-dropdown-menu');

      if (triggerText) triggerText.textContent = primaryRate.shortLabel;
      if (triggerImage) triggerImage.setAttribute('src', `${prefix}${primaryRate.icon}`);
      if (trigger) {
        trigger.style.setProperty('align-items', 'center', 'important');
        trigger.style.setProperty('background', 'rgba(255, 244, 204, 0.08)', 'important');
        trigger.style.setProperty('background-color', 'rgba(255, 244, 204, 0.08)', 'important');
        trigger.style.setProperty('border', '1px solid rgba(255, 244, 204, 0.18)', 'important');
        trigger.style.setProperty('border-radius', '999px', 'important');
        trigger.style.setProperty('color', '#fff8dc', 'important');
        trigger.style.setProperty('display', 'inline-flex', 'important');
        trigger.style.setProperty('gap', '8px', 'important');
        trigger.style.setProperty('min-height', '38px', 'important');
        trigger.style.setProperty('padding', '5px 11px', 'important');
      }

      if (triggerText) {
        triggerText.style.setProperty('align-items', 'center', 'important');
        triggerText.style.setProperty('color', '#fff8dc', 'important');
        triggerText.style.setProperty('display', 'inline-flex', 'important');
        triggerText.style.setProperty('font-family', 'Mulish, sans-serif', 'important');
        triggerText.style.setProperty('font-size', '18px', 'important');
        triggerText.style.setProperty('font-weight', '700', 'important');
        triggerText.style.setProperty('height', '24px', 'important');
        triggerText.style.setProperty('letter-spacing', '-0.45px', 'important');
        triggerText.style.setProperty('line-height', '24px', 'important');
      }

      if (triggerImage) {
        triggerImage.style.setProperty('display', 'block', 'important');
        triggerImage.style.setProperty('height', '24px', 'important');
        triggerImage.style.setProperty('width', '24px', 'important');
      }

      const triggerChevron = dropdown.querySelector('.rate-chevron');
      if (triggerChevron) {
        triggerChevron.style.setProperty('align-items', 'center', 'important');
        triggerChevron.style.setProperty('display', 'inline-flex', 'important');
        triggerChevron.style.setProperty('height', '24px', 'important');
        triggerChevron.style.setProperty('justify-content', 'center', 'important');
        triggerChevron.style.setProperty('width', '12px', 'important');
      }

      if (menu) {
        menu.style.setProperty('background', '#fffaf0', 'important');
        menu.style.setProperty('border', '1px solid rgba(153, 31, 35, 0.18)', 'important');
        menu.style.setProperty('border-radius', '8px', 'important');
        menu.style.setProperty('box-shadow', '0 18px 36px rgba(49, 13, 16, 0.22)', 'important');
        menu.style.setProperty('padding', '8px', 'important');
      }

      if (menu) {
        menu.innerHTML = orderedRates.map((rate) => `
          <button class="rate-row" type="button" role="menuitem" tabindex="-1" aria-disabled="true" data-metal="${rate.metal}" data-label="${rate.shortLabel}">
            <img src="${prefix}${rate.icon}" alt="" class="rate-coin" loading="eager" decoding="async" fetchpriority="high">
            <span>${rate.shortLabel}</span>
          </button>
        `).join('');
      }
    });
  };

  const injectNavbarThemeStyles = () => {
    if (document.getElementById('kj-final-rate-theme')) return;
    const style = document.createElement('style');
    style.id = 'kj-final-rate-theme';
    style.textContent = `
      header.site-header .site-header .rate-toggle,
      header.site-header .navigation-2 .rate-toggle,
      header.site-header .mobile-header .rate-toggle {
        align-items: center !important;
        appearance: none !important;
        background: rgba(255, 244, 204, 0.08) !important;
        border: 1px solid rgba(255, 244, 204, 0.18) !important;
        border-radius: 999px !important;
        color: #fff8dc !important;
        display: inline-flex !important;
        gap: 8px !important;
        justify-content: center !important;
        min-height: 38px !important;
        padding: 5px 11px !important;
        white-space: nowrap !important;
      }

      header.site-header .site-header .rate-toggle .rate-coin,
      header.site-header .navigation-2 .rate-toggle .rate-coin,
      header.site-header .mobile-header .rate-toggle .rate-coin {
        display: block !important;
        flex: 0 0 24px !important;
        height: 24px !important;
        object-fit: contain !important;
        width: 24px !important;
      }

      header.site-header .site-header .rate-toggle > span:not(.rate-chevron),
      header.site-header .navigation-2 .rate-toggle > span:not(.rate-chevron),
      header.site-header .mobile-header .rate-toggle > span:not(.rate-chevron) {
        align-items: center !important;
        color: #fff8dc !important;
        display: inline-flex !important;
        font-family: Mulish, sans-serif !important;
        font-size: 18px !important;
        font-weight: 700 !important;
        letter-spacing: -0.45px !important;
        line-height: 24px !important;
        min-height: 24px !important;
        text-transform: none !important;
        white-space: nowrap !important;
      }

      header.site-header .rate-chevron {
        align-items: center !important;
        display: inline-flex !important;
        flex: 0 0 12px !important;
        height: 24px !important;
        justify-content: center !important;
        margin: 0 !important;
        position: relative !important;
        transform: none !important;
        width: 12px !important;
      }

      header.site-header .rate-chevron::before {
        border-bottom: 2px solid currentColor !important;
        border-right: 2px solid currentColor !important;
        content: "" !important;
        display: block !important;
        height: 7px !important;
        margin-top: -3px !important;
        transform: rotate(45deg) !important;
        transform-origin: 50% 50% !important;
        transition: transform 180ms ease, margin-top 180ms ease !important;
        width: 7px !important;
      }

      header.site-header .rate-dropdown:hover .rate-chevron::before,
      header.site-header .rate-dropdown:focus-within .rate-chevron::before,
      header.site-header .rate-dropdown.is-open .rate-chevron::before {
        margin-top: 3px !important;
        transform: rotate(225deg) !important;
      }

      header.site-header .rate-menu {
        background: #fffaf0 !important;
        border: 1px solid rgba(153, 31, 35, 0.18) !important;
        border-radius: 8px !important;
        box-shadow: 0 18px 36px rgba(49, 13, 16, 0.22) !important;
        min-width: 292px !important;
        padding: 8px !important;
      }

      header.site-header .rate-menu .rate-row {
        align-items: center !important;
        border-radius: 6px !important;
        color: #681015 !important;
        cursor: pointer !important;
        display: flex !important;
        gap: 10px !important;
        padding: 10px 9px !important;
      }

      header.site-header .rate-menu .rate-row:hover,
      header.site-header .rate-menu .rate-row:focus-visible {
        background: rgba(153, 31, 35, 0.08) !important;
        color: #991f23 !important;
      }
    `;
    document.head.appendChild(style);
  };
  const closeDropdowns = (scope = document, except = null) => {
    scope.querySelectorAll('.dropdown.is-open, .rate-dropdown.is-open, .rate-dropdown-container.is-open').forEach((dropdown) => {
      if (dropdown !== except) {
        dropdown.classList.remove('is-open');
        dropdown.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  let _menusWired = false;
  const wireMenus = () => {
    if (_menusWired) return;
    _menusWired = true;
    const handledMenuClicks = new WeakSet();
    const lockMenuButtonColor = (button) => {
      if (!button) return;
      const isOpen = button.classList.contains('is-open') || button.getAttribute('aria-expanded') === 'true';
      const iconColor = isOpen ? '#d4af37' : '#ffffff';
      button.style.setProperty('background', '#991f23', 'important');
      button.style.setProperty('background-color', '#991f23', 'important');
      button.style.setProperty('color', iconColor, 'important');
      button.style.setProperty('border-color', 'rgba(153, 31, 35, .38)', 'important');
      button.querySelectorAll('.mobile-menu-toggle__icon, .menu-line').forEach((line) => {
        line.style.setProperty('background', iconColor, 'important');
        line.style.setProperty('background-color', iconColor, 'important');
        line.style.setProperty('color', iconColor, 'important');
      });
    };












































    document.addEventListener('click', (event) => {
      const toggle = event.target.closest('.dropdown-toggle, .rate-toggle, .rate-dropdown-trigger');
      const dropdown = toggle?.closest('.dropdown, .rate-dropdown, .rate-dropdown-container');
      const isRateToggle = !!toggle?.closest('.rate-dropdown, .rate-dropdown-container');

      if (isRateToggle) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }


      if (dropdown) {
        const link = event.target.closest('a');
        if (link && link.getAttribute('href') && !link.getAttribute('href').includes('#')) {
          if (link.textContent.trim().toLowerCase() === 'scheme') {
            event.preventDefault();
          } else {
            return;
          }
        }
        const list = dropdown.querySelector('.dropdown-list, .rate-menu, .rate-dropdown-menu');
        if (list) {
          event.preventDefault();
          event.stopPropagation();
          const shouldOpen = !dropdown.classList.contains('is-open');
          closeDropdowns(document, shouldOpen ? dropdown : null);
          dropdown.classList.toggle('is-open', shouldOpen);
          toggle.setAttribute('aria-expanded', String(shouldOpen));
        }
        return;
      }

      if (!event.target.closest('.dropdown, .rate-dropdown, .rate-dropdown-container')) {
        closeDropdowns();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeDropdowns();
    });

    // Same-page filtering for category links via event delegation
    document.addEventListener('click', (event) => {
      const link = event.target.closest('.kj-megamenu-link, .bko-wrap-111-2 a, .rate-dropdown a, .kj-clean-category-col a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      try {
        const url = new URL(href, window.location.href);
        const category = url.searchParams.get('category');
        
        // If it's a link to the exact same pathname and has a category
        const normalizePath = (p) => p.replace(/\/$/, '').replace(/\.html$/, '');
        if (category && normalizePath(url.pathname) === normalizePath(window.location.pathname)) {
          const toolbar = document.querySelector('.collection-toolbar');
          if (toolbar) {
            // We are on the same page and toolbar exists -> do same-page filter!
            event.preventDefault(); // Stop normal navigation
            event.stopPropagation();
            
            // Close any open dropdowns
            closeDropdowns();
            
            // Update the select and dispatch change to trigger applyProductFilters
            const select = toolbar.querySelector('[data-filter-control="category"]');
            if (select) {
              select.value = category;
              toolbar.dispatchEvent(new Event('change'));
              
              // Push state to URL so it behaves like a real navigation
              window.history.pushState({}, '', url.href);
              
              // Scroll to product results if needed
              const results = document.querySelector('.product-results, .collection-toolbar');
              if (results) {
                results.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }
        }
      } catch (e) {
        // invalid URL, ignore
      }
    });

  };

  const wireTimelineProgress = () => {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const progressBars = document.querySelectorAll('.timeline_progress');
    if (!progressBars.length) return;

    let ticking = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const viewportMid = viewportHeight / 2;
      const currentScroll = scrollTop + viewportMid;

      progressBars.forEach((progress) => {
        const track = progress.closest('.timeline_grid-wrap');
        if (!track) return;

        const trackRect = track.getBoundingClientRect();
        const trackTop = trackRect.top + scrollTop;
        const trackHeight = trackRect.height;
        const trackBottom = trackTop + trackHeight;

        let percentage = 0;
        if (currentScroll < trackTop) {
          percentage = 0;
        } else if (currentScroll > trackBottom) {
          percentage = 100;
        } else {
          percentage = ((currentScroll - trackTop) / trackHeight) * 100;
        }

        progress.style.height = `${percentage}%`;
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
  };

  const ensureSimpleMegamenus = () => {
    const prefix = getAssetPrefix();
    const basePages = {
      gold: prefix + 'products.html',
      silver: prefix + 'silver-products.html',
      diamond: prefix + 'diamonds-products.html',
      platinum: prefix + 'coming-soon.html',
      scheme: prefix + 'thanga-mazhai.html'
    };

    const staticImages = {
      gold: 'assets/images/66ae16158fbb46cce3ea01a1_Rectangle%20366.png',
      silver: 'assets/images/66ae1d64b0ff185260ad9b44_Rectangle%20367%20(1).png',
      diamond: 'assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png',
      platinum: 'assets/images/66ae249ccb35781959eac6fc_Rectangle%20366%20(6).png',
      scheme: 'assets/images/66ae249ef52614a0871e7f4c_Rectangle%20366%20(8).png'
    };

    document.querySelectorAll('.nav-menu-3.site-nav__panel, .site-nav.site-nav__panel').forEach((nav) => {
      const menuTypes = [
        { key: 'gold', selector: '.goldlink, .goldlink-2' },
        { key: 'silver', selector: '.silverlink, .silverlink-2' },
        { key: 'diamond', selector: '.diamondlink, .diamondlink-2' },
        { key: 'platinum', selector: '.platinumlink, .platinumlink-2' }
      ];

      menuTypes.forEach(({ key, selector }) => {
        let dropdown = nav.querySelector(selector);
        if (dropdown && dropdown.classList.contains('scheme-dropdown-list')) {
           dropdown = dropdown.closest('.bko-wrap-111-2') || dropdown;
        } else if (dropdown) {
           dropdown = dropdown.closest('.dropdown, .bko-dropdown-0, .bko-wrap-111-2');
        }
        if (!dropdown) return;

        const grid = dropdown.querySelector('.bko-grid-1-3-1');
        if (!grid) return;

        const cols = Array.from(grid.children).filter(c => c.tagName === 'DIV');
        if (cols.length < 2) return;

        const categoryCol = cols[0];
        let sliderCol = cols.find(c => c.classList.contains('content-slider') || c.classList.contains('slider-2') || c.classList.contains('slider-3') || c.classList.contains('slider-4') || c.classList.contains('slider-5') || c.classList.contains('slider-21') || c.classList.contains('kj-clean-slider-col'));
        
        // Hide middle columns
        cols.forEach((col) => {
          if (col !== categoryCol && col !== sliderCol) {
            col.style.display = 'none';
          }
        });

        // Add custom classes and unwrap category links to prevent boxes
        categoryCol.classList.add('kj-clean-category-col');
        
        // If slider column exists, replace its inner HTML with static image to remove slider markup entirely
        if (sliderCol) {
          sliderCol.className = 'kj-clean-slider-col';
          sliderCol.innerHTML = `<img src="${prefix}${staticImages[key]}" alt="${key} megamenu image" class="slide__image" loading="lazy" decoding="async" style="width: 100%; height: auto; display: block;" />`;
        } else {
          // Create static image column if it doesn't exist
          sliderCol = document.createElement('div');
          sliderCol.className = 'kj-clean-slider-col';
          sliderCol.innerHTML = `<img src="${prefix}${staticImages[key]}" alt="${key} megamenu image" class="slide__image" loading="lazy" decoding="async" style="width: 100%; height: auto; display: block;" />`;
          grid.appendChild(sliderCol);
        }

        const basePage = basePages[key];
        categoryCol.querySelectorAll('a').forEach((a) => {
          const href = a.getAttribute('href');
          if (href) {
            const categoryMatch = href.match(/category=([^&]+)/);
            if (categoryMatch) {
              const category = categoryMatch[1];
              a.setAttribute('href', `${basePage}?category=${category}`);
            } else if (href.includes('#') || href.includes('products.html')) {
              a.setAttribute('href', basePage);
            }
          }
        });
      });
    });
  };

  const renderPlatinumComingSoon = () => {
    const isPlatinumPage = /\/platinum-products\.html$/i.test(window.location.pathname.replace(/\\/g, '/'));
    if (!isPlatinumPage) return;

    document.body.classList.add('kj-platinum-coming-soon-page');
    const productShell = document.querySelector('.banner-18');
    if (!productShell || productShell.dataset.kjComingSoon === 'true') return;

    productShell.dataset.kjComingSoon = 'true';
    productShell.querySelector('.product-results, .content_filter')?.remove();
    productShell.querySelector('.dynamic-list')?.remove();

    if (!productShell.querySelector('.kj-coming-soon')) {
      productShell.insertAdjacentHTML('beforeend', `
        <section class="kj-coming-soon kj-coming-soon--image-only" aria-label="Platinum collection coming soon">
          <img src="${getAssetPrefix()}assets/images/67a5feb833299a7dd5d392f2_Frame%20185.webp" alt="Platinum collection coming soon" loading="eager" decoding="async" fetchpriority="high" width="1580" height="762" />
        </section>
      `);
    }
  };

  const polishBanner2Copy = () => {
    const copy = new Map([
      ['Find the wedding jewellery you\'ve always dreamed of.', 'Jewellery for vows, rituals, and every cherished beginning.'],
      ['Choose from a wide range of certified and authentic jewellery for all occasions.', 'Certified pieces chosen with trust, craft, and quiet elegance.'],
      ['Step back in time and bring a slice of the bejewelled past to the present.', 'Designs that carry tradition with grace for today.'],
    ]);

    document.querySelectorAll('.banner-2 .paragraph').forEach((paragraph) => {
      const current = paragraph.textContent.trim();
      if (copy.has(current)) paragraph.textContent = copy.get(current);
    });
  };

  let _rateWired = false;
  const wireRateSelection = () => {
    if (_rateWired) return;
    _rateWired = true;
    document.addEventListener('click', (event) => {
      const item = event.target.closest('.rate-row, .rate-item');
      if (!item) return;

      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  };

  const calculatePrice = (selector, rate) => {
    document.querySelectorAll(selector).forEach((priceElement) => {
      if (priceElement.dataset.kjCalculated) return;
      const priceValue = parseFloat(priceElement.textContent.replace(/,/g, ''));
      if (Number.isNaN(priceValue)) return;
      const subtotal = priceValue * rate * 1.18;
      priceElement.textContent = Math.round(subtotal * 1.03).toLocaleString('en-IN');
      priceElement.dataset.kjCalculated = 'true';
    });
  };

  const CATEGORY_ALIASES = {
    all: 'all',
    bangle: 'bangles',
    bangles: 'bangles',
    bracelet: 'bracelet',
    bracelets: 'bracelet',
    chain: 'chain',
    chains: 'chain',
    choker: 'necklace',
    chokers: 'necklace',
    earring: 'earrings',
    earrings: 'earrings',
    haram: 'necklace',
    idol: 'idols',
    idoels: 'idols',
    idols: 'idols',
    jimmiki: 'earrings',
    jimikki: 'earrings',
    necklace: 'necklace',
    necklaces: 'necklace',
    pendant: 'pendant',
    pendants: 'pendant',
    ring: 'rings',
    rings: 'rings',
    stud: 'earrings',
    studs: 'earrings'
  };

  const CATEGORY_LABELS = {
    all: 'All Categories',
    anklet: 'Anklets',
    bangles: 'Bangles',
    bracelet: 'Bracelets',
    chain: 'Chains',
    earrings: 'Earrings',
    idols: 'Idols',
    necklace: 'Necklace',
    pendant: 'Pendant',
    rings: 'Rings'
  };

  const normalizeCategory = (value = '') => {
    const compact = String(value)
      .toLowerCase()
      .replace(/&amp;/g, 'and')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!compact) return '';
    const direct = CATEGORY_ALIASES[compact.replace(/\s+/g, '-')];
    if (direct) return direct;
    const tokens = compact.split(/[\s-]+/).filter(Boolean);
    for (const token of tokens) {
      if (CATEGORY_ALIASES[token]) return CATEGORY_ALIASES[token];
    }
    if (compact.includes('bangle')) return 'bangles';
    if (compact.includes('bracelet')) return 'bracelet';
    if (compact.includes('earring') || compact.includes('stud') || compact.includes('jimmiki') || compact.includes('jimikki')) return 'earrings';
    if (compact.includes('necklace') || compact.includes('haram') || compact.includes('choker')) return 'necklace';
    if (compact.includes('pendant')) return 'pendant';
    if (compact.includes('ring')) return 'rings';
    if (compact.includes('idol') || compact.includes('idoel')) return 'idols';
    if (compact.includes('anklet')) return 'anklet';
    return compact.replace(/\s+/g, '-');
  };

  const parseNumber = (value = '') => {
    const cleaned = String(value).replace(/₹|rs\.?|inr|,/gi, '').replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getProductCards = () => Array.from(document.querySelectorAll('.product-card'));

  const inferProductCategory = (card) => {
    const explicit = normalizeCategory(card.dataset.category);
    if (explicit) return explicit;

    const categoryText = card.querySelector('.product-card-category')?.textContent || '';
    const normalizedCategory = normalizeCategory(categoryText);
    if (normalizedCategory) return normalizedCategory;

    const title = card.querySelector('.product-card-title')?.textContent || card.textContent || '';
    return normalizeCategory(title);
  };

  const inferProductPrice = (card) => {
    const explicit = parseNumber(card.dataset.price);
    if (explicit) return explicit;

    const priceNode = card.querySelector('.product-card-price, [data-price]');
    return parseNumber(priceNode?.dataset.price || priceNode?.textContent || '');
  };
  const normalizeProductCards = () => {
    const cards = getProductCards();
    cards.forEach((card) => {

      const normalizedCategory = inferProductCategory(card);
      const normalizedPrice = inferProductPrice(card);
      if (normalizedCategory) card.dataset.category = normalizedCategory;
      if (normalizedPrice) card.dataset.price = String(normalizedPrice);
      card.dataset.metal = getCurrentMetal();
    });
    return cards;
  };

  const ensureProductFilterToolbar = (cards) => {
    if (!cards.length || document.body.classList.contains('kj-platinum-coming-soon-page')) return null;
    const collection = cards[0].closest('.product-results') || cards[0].parentElement;
    if (!collection) return null;

    let toolbar = collection.parentElement?.querySelector(':scope > .collection-toolbar') || document.querySelector('.collection-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('section');
      toolbar.className = 'collection-toolbar';
      toolbar.setAttribute('aria-label', 'Product filters');
      toolbar.innerHTML = `
        <label class="collection-toolbar__field">
          <span class="collection-toolbar__label">Category</span>
          <select class="collection-toolbar__select" data-filter-control="category"></select>
        </label>
        <label class="collection-toolbar__field">
          <span class="collection-toolbar__label">Sort</span>
          <select class="collection-toolbar__select" data-filter-control="sort">
            <option value="default">Sort By</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </label>
        <button class="collection-toolbar__reset" type="button">Reset</button>
      `;
      collection.parentElement?.insertBefore(toolbar, collection);
    }

    const categories = Array.from(new Set(cards.map((card) => card.dataset.category).filter(Boolean)));
    const categorySelect = toolbar.querySelector('[data-filter-control="category"]');
    const sortSelect = toolbar.querySelector('[data-filter-control="sort"]');
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = normalizeCategory(params.get('category') || categorySelect.value || 'all') || 'all';
    const selectedSort = sortSelect.value || 'default';

    const selectedOnlyOption = selectedCategory !== 'all' && !categories.includes(selectedCategory)
      ? [`<option value="${selectedCategory}">${CATEGORY_LABELS[selectedCategory] || selectedCategory.replace(/-/g, ' ')}</option>`]
      : [];
    categorySelect.innerHTML = [
      `<option value="all">${CATEGORY_LABELS.all}</option>`,
      ...selectedOnlyOption,
      ...categories.sort().map((category) => `<option value="${category}">${CATEGORY_LABELS[category] || category.replace(/-/g, ' ')}</option>`)
    ].join('');
    categorySelect.value = selectedCategory;
    sortSelect.value = selectedSort;

    return toolbar;
  };

  const applyProductFilters = (toolbar, cards) => {
    const selectedCategory = normalizeCategory(toolbar?.querySelector('[data-filter-control="category"]')?.value || 'all') || 'all';
    const selectedSort = toolbar?.querySelector('[data-filter-control="sort"]')?.value || 'default';
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = normalizeCategory(card.dataset.category);
      const categoryMatches = selectedCategory === 'all' || category === selectedCategory;
      const visible = categoryMatches;
      card.hidden = !visible;
      card.classList.toggle('is-filter-hidden', !visible);
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });

    if (selectedSort === 'price-asc' || selectedSort === 'price-desc') {
      const grid = cards[0]?.parentElement;
      [...cards].sort((a, b) => {
        const difference = parseNumber(a.dataset.price) - parseNumber(b.dataset.price);
        return selectedSort === 'price-asc' ? difference : -difference;
      }).forEach((card) => grid?.appendChild(card));
    }

    const collection = cards[0]?.closest('.product-results') || cards[0]?.parentElement;
    let empty = collection?.parentElement?.querySelector('.collection-empty-state');
    if (collection && !empty) {
      empty = document.createElement('div');
      empty.className = 'collection-empty-state';
      empty.textContent = 'No products match these filters.';
      collection.parentElement.insertBefore(empty, collection.nextSibling);
    }
    if (empty) empty.hidden = visibleCount !== 0;

    const params = new URLSearchParams(window.location.search);
    if (selectedCategory === 'all') params.delete('category');
    else params.set('category', selectedCategory);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    if (window.location.protocol !== 'file:') {
      window.history.replaceState({}, '', nextUrl);
    }
  };

  const initProductFilters = () => {
    const cards = normalizeProductCards();
    if (!cards.length) return;
    const toolbar = ensureProductFilterToolbar(cards);
    if (!toolbar) return;

    applyProductFilters(toolbar, cards);
    if (toolbar.dataset.kjFilterReady === 'true') return;
    toolbar.dataset.kjFilterReady = 'true';
    toolbar.addEventListener('change', (event) => {
      if (!event.target.closest('.collection-toolbar__select')) return;
      applyProductFilters(toolbar, cards);
    });
    toolbar.querySelector('.collection-toolbar__reset')?.addEventListener('click', () => {
      toolbar.querySelector('[data-filter-control="category"]').value = 'all';
      toolbar.querySelector('[data-filter-control="sort"]').value = 'default';
      applyProductFilters(toolbar, cards);
    });
  };

  const reorderProductSections = () => {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    let priorityMetal = '';
    if (path.includes('silver')) priorityMetal = 'silver';
    else if (path.includes('diamond')) priorityMetal = 'diamond';
    else if (path.includes('platinum')) priorityMetal = 'platinum';
    else if (path.includes('products')) priorityMetal = 'gold';
    if (!priorityMetal) return;

    // Find product section containers and reorder based on the metal type
    const headings = document.querySelectorAll('[data-section-title], .section-title, h2, h3');
    const sectionMap = new Map();
    headings.forEach((h) => {
      const text = h.textContent.trim().toLowerCase();
      const section = h.closest('section, .section-2, .section-3, .section-4, .section-5, [class*="section"]');
      if (section && !sectionMap.has(section)) {
        sectionMap.set(section, text);
      }
    });

    const parent = sectionMap.keys().next().value?.parentElement;
    if (!parent || sectionMap.size < 2) return;

    const sections = Array.from(sectionMap.entries());
    const prioritySections = sections.filter(([, text]) => text.includes(priorityMetal));
    const otherSections = sections.filter(([, text]) => !text.includes(priorityMetal));

    [...prioritySections, ...otherSections].forEach(([section]) => {
      parent.appendChild(section);
    });
  };

  const normalizePlatinumNavState = () => {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const isPlatinumPage = path.includes('coming-soon.html') || path.includes('platinum');
    if (isPlatinumPage) return;
    document.querySelectorAll('.platinumlink.is-current, .platinumlink-2.is-current, a[href*="platinum"].is-current, a[href*="coming-soon"].is-current').forEach((link) => {
      link.classList.remove('is-current');
      link.removeAttribute('aria-current');
    });
  };

  const addHoverLife = () => {
    document.querySelectorAll('.product-card, .feature-card, .collection-card, .best-seller-card, .review-card, .team5_item, .blog33_item').forEach((item) => {
      item.classList.add('kj-interactive-card');
    });
  };

  const normalizePhoneLinks = () => {
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      const visibleText = link.textContent.replace(/\s+/g, ' ').trim();
      const numbers = visibleText.match(/(?:\+?91[\s-]?)?(?:0\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}|\d{5}[\s-]?\d{5})/g) || [];
      const primary = numbers[0]?.replace(/[^\d+]/g, '') || link.getAttribute('href').replace(/^tel:/i, '').split(/[\/,;]/)[0].replace(/[^\d+]/g, '');
      if (primary) link.href = `tel:${primary.startsWith('+') ? primary : primary.length === 10 ? `+91${primary}` : primary}`;
      link.classList.add('kj-phone-link');
      if (numbers.length > 1 && !link.dataset.kjPhoneFormatted) {
        link.dataset.kjPhoneFormatted = 'true';
        link.innerHTML = '';
        numbers.forEach((number) => {
          const item = document.createElement('span');
          item.className = 'kj-phone-number';
          item.textContent = number.trim().replace(/\s+/g, ' ');
          link.appendChild(item);
        });
      }
    });
  };

  const getProductContext = () => {
    const name = (
      document.querySelector('.product-header4_product-details .word2')?.textContent ||
      document.querySelector('.product-header4_product-details .text-size-large')?.textContent ||
      document.querySelector('.product-card-title')?.textContent ||
      document.title
    ).trim();
    const id = (
      document.querySelector('.product-header4_product-details .word8')?.textContent ||
      document.querySelector('[data-product-id]')?.dataset.productId ||
      window.location.pathname.split('/').pop()?.replace(/\.html$/i, '')
    ).trim();
    return { name, id };
  };

  const normalizeProductActions = () => {
    const prefix = getAssetPrefix();
    const context = getProductContext();
    const enquiryUrl = `${prefix}enquiry.html?product=${encodeURIComponent(context.name)}&id=${encodeURIComponent(context.id)}`;

    document.querySelectorAll('a, button, input[type="submit"]').forEach((control) => {
      const text = (control.value || control.textContent || '').trim().replace(/\s+/g, ' ');
      if (/^shop now$/i.test(text)) {
        if ('value' in control && control.tagName === 'INPUT') control.value = 'View Item';
        else control.textContent = 'View Item';
      }
      if (/^(buy now|continue to checkout|checkout)$/i.test(text)) {
        if ('value' in control && control.tagName === 'INPUT') control.value = 'Enquire';
        else control.textContent = 'Enquire';
      }
    });

    document.querySelectorAll([
      'a[href*="checkout"]',
      'a[href*="checkout-form"]',
      '.product-header4_add-to-cart a[href*="terms-conditions"]',
      '.product-header4_product-details a[href*="terms-conditions"]'
    ].join(', ')).forEach((link) => {
      link.href = enquiryUrl;
      link.classList.add('kj-enquiry-link');
      if (/buy now|checkout|continue to checkout|terms/i.test(link.textContent)) link.textContent = 'Enquire';
    });
  };

  const wireEnquiryPage = () => {
    const form = document.querySelector('[data-enquiry-form]');
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product') || params.get('name') || '';
    const id = params.get('id') || params.get('productId') || '';
    form.querySelector('[name="productName"]').value = product;
    form.querySelector('[name="productId"]').value = id;
    const message = form.querySelector('[name="message"]');
    if (message && product && !message.value) message.value = `I would like to know more about ${product}.`;

    const buildMessage = () => {
      const data = new FormData(form);
      return [
        'Kerala Jewellers Product Enquiry',
        `Name: ${data.get('customerName') || ''}`,
        `Mobile: ${data.get('mobile') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `City: ${data.get('city') || ''}`,
        `Preferred Time: ${data.get('preferredTime') || ''}`,
        `Product: ${data.get('productName') || ''}`,
        `Product ID: ${data.get('productId') || ''}`,
        `Message: ${data.get('message') || ''}`
      ].join('\n');
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('.enquiry-form__success')?.removeAttribute('hidden');
    });
    document.querySelector('[data-whatsapp-enquiry]')?.addEventListener('click', (event) => {
      event.preventDefault();
      window.open(`https://wa.me/919840088324?text=${encodeURIComponent(buildMessage())}`, '_blank', 'noopener');
    });
  };

  const fixLogoFallbacks = () => {
    const prefix = getAssetPrefix();
    const fallback = `${prefix}assets/images/66a8e4c051b2bb6c3fc7e4b8_logo%201.png`;
    document.querySelectorAll('img').forEach((img) => {
      const source = img.getAttribute('src') || '';
      if (/logo|side%20logo|store-logo/i.test(source)) {
        img.addEventListener('error', () => {
          img.removeAttribute('srcset');
          img.src = fallback;
        }, { once: true });
      }
    });
  };

  const equalizeProductDetails = () => {
    const imageBox = document.querySelector('.sp-product-image-wrapper');
    const details = document.querySelector('.product-header4_product-details');
    if (!imageBox || !details) return;
    const apply = () => {
      const height = Math.round(imageBox.getBoundingClientRect().height);
      if (!height) return;
      if (window.innerWidth >= 992) {
        details.style.minHeight = `${height}px`;
        details.style.height = 'auto';
      } else {
        details.style.minHeight = '';
        details.style.height = '';
      }
    };
    apply();
    window.addEventListener('resize', () => requestAnimationFrame(apply), { passive: true });
  };

  const normalizeHeroImages = () => {
    document.querySelectorAll('.intro-content-20.cc-homepage-20, .intro-content-20.cc-homepage-3').forEach((hero) => {
      hero.classList.add('kj-hero-image-safe');
    });
  };

  const wireMegamenuHover = () => {
    if (!window.matchMedia('(min-width: 992px)').matches) return;
    document.querySelectorAll('.nav-menu-3.site-nav__panel, .site-nav.site-nav__panel').forEach((nav) => {
      const items = Array.from(nav.querySelectorAll(':scope > .bko-wrap-111-2 > .dropdown, :scope > .rate-dropdown'));
      items.forEach((item) => {
        if (item.dataset.kjHoverBound) return;
        item.dataset.kjHoverBound = 'true';
        let closeTimer = 0;
        const open = () => {
          window.clearTimeout(closeTimer);
          items.forEach((other) => {
            if (other !== item) {
              other.classList.remove('is-open');
              other.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.add('is-open');
          item.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'true');
        };
        const close = () => {
          closeTimer = window.setTimeout(() => {
            item.classList.remove('is-open');
            item.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
          }, 90);
        };
        item.addEventListener('mouseenter', open);
        item.addEventListener('mouseleave', close);
      });
    });
  };

  
  window.initKeralaHeader = () => {
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.initKeralaHeader();
    requestAnimationFrame(renderRateLabelForCurrentPage);
    setTimeout(renderRateLabelForCurrentPage, 0);
    setTimeout(renderRateLabelForCurrentPage, 250);
    window.addEventListener('load', renderRateLabelForCurrentPage, { once: true });
    wireRateSelection();
    wireTimelineProgress();
    normalizePhoneLinks();
    normalizeProductActions();
    wireEnquiryPage();
    fixLogoFallbacks();
    equalizeProductDetails();
    normalizeHeroImages();
    renderPlatinumComingSoon();
    polishBanner2Copy();
    addHoverLife();
    reorderProductSections();
    calculatePrice('#goldprice', 14660);
    calculatePrice('#goldprices', 14660);
    calculatePrice('#silverpricesssproduct', 290);
    initProductFilters();
  });
})();


/* --- TRUE LOUPE ZOOM EFFECT --- */

  window.initKeralaHeader = () => {
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.initKeralaHeader();
  // Only apply to pointer devices, ignore touch/mobile
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  // Find all main product images
  const productImages = document.querySelectorAll('.sp-product-image');
  
  productImages.forEach(img => {
    // Look for the correct wrapper to become the host
    const container = img.closest('.sp-product-image-wrapper') || img.parentElement;
    if (!container) return;

    container.classList.add('kj-zoom-host');
    
    // Create the circle loupe
    const loupe = document.createElement('div');
    loupe.classList.add('kj-loupe-circle');
    container.appendChild(loupe);
    
    let isHovering = false;
    let reqId = null;
    let targetX = 0;
    let targetY = 0;
    
    // Using approx 2x zoom
    const zoomLevel = 2.0;

    const render = () => {
      if (!isHovering) return;
      
      const rect = container.getBoundingClientRect();
      // Ensure cursor doesn't pull loupe out of bounds for visual cleanliness
      let x = Math.max(0, Math.min(targetX, rect.width));
      let y = Math.max(0, Math.min(targetY, rect.height));
      
      loupe.style.left = `${x}px`;
      loupe.style.top = `${y}px`;
      
      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;
      
      loupe.style.backgroundPosition = `${bgX}% ${bgY}%`;
      
      reqId = requestAnimationFrame(render);
    };

    container.addEventListener('mouseenter', function() {
      // Lazy load background image on first hover
      if (!loupe.style.backgroundImage && img.src) {
        loupe.style.backgroundImage = `url("${img.src}")`;
      }
      
      if (img.width && img.height) {
        loupe.style.backgroundSize = `${img.width * zoomLevel}px ${img.height * zoomLevel}px`;
      }
      
      loupe.classList.add('is-visible');
      isHovering = true;
      reqId = requestAnimationFrame(render);
    });
    
    container.addEventListener('mousemove', function(e) {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });
    
    container.addEventListener('mouseleave', function() {
      loupe.classList.remove('is-visible');
      isHovering = false;
      if (reqId) cancelAnimationFrame(reqId);
    });
  });
});











































document.addEventListener("click", function (event) {
  const button = event.target.closest(".mobile-menu-toggle.mobile-menu-button");
  if (!button) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const header = button.closest(".mobile-header");
  const panel = header
    ? header.querySelector(".mobile-nav.site-nav__panel")
    : document.querySelector(".mobile-nav.site-nav__panel");

  if (!panel) return;

  if (panel.classList.contains("is-open")) {
    panel.classList.remove("is-open");
    button.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  } else {
    panel.classList.add("is-open");
    button.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  }
}, true);


/* --- MOBILE NAVBAR DESKTOP RESET --- */
function resetMobileMenuOnDesktop() {
  if (window.innerWidth >= 992) {
    document.querySelectorAll(".mobile-nav.site-nav__panel.is-open").forEach(panel => {
      panel.classList.remove("is-open");
    });

    document.querySelectorAll(".mobile-menu-toggle.mobile-menu-button.is-open").forEach(button => {
      button.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  }
}

window.addEventListener("resize", resetMobileMenuOnDesktop);
document.addEventListener("DOMContentLoaded", resetMobileMenuOnDesktop);
