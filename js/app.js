document.documentElement.classList.add('js-ready');

(() => {
  const METAL_RATES = [
    { label: 'GOLD 22 KT/1g - Rs. 14660', shortLabel: 'GOLD 22 KT/1g - Rs. 14660', icon: 'assets/coin/gold coin.png' },
    { label: 'GOLD 18 KT/1g - Rs. 12003', shortLabel: 'GOLD 18 KT/1g - Rs. 12003', icon: 'assets/coin/gold coin.png' },
    { label: 'PLATINUM 1g - Rs. 7901', shortLabel: 'PLATINUM 1g - Rs. 7901', icon: 'assets/coin/Platinum Coin.png' },
    { label: 'SILVER 1g - Rs. 290', shortLabel: 'SILVER 1g - Rs. 290', icon: 'assets/coin/silver coin.png' }
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
    if (path.includes('platinum') || category.includes('platinum')) return 'platinum';
    if (path.includes('diamond') || category.includes('diamond')) return 'diamond';
    if (path.includes('gold') || /(^|\/)products\.html$/.test(path) || category.includes('gold')) return 'gold';
    return 'gold';
  };

  const getOrderedRates = () => {
    const currentMetal = getCurrentMetal();
    const matchesMetal = (rate) => rate.label.toLowerCase().includes(currentMetal);
    return [
      ...METAL_RATES.filter(matchesMetal),
      ...METAL_RATES.filter((rate) => !matchesMetal(rate))
    ];
  };

  const closeDropdowns = (scope = document, except = null) => {
    scope.querySelectorAll('.dropdown.is-open, .rate-dropdown.is-open, .rate-dropdown-container.is-open').forEach((dropdown) => {
      if (dropdown !== except) {
        dropdown.classList.remove('is-open');
        dropdown.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const buildRateDropdown = () => {
    const prefix = getAssetPrefix();
    const orderedRates = getOrderedRates();
    const rows = orderedRates.map((rate) => (
      `<button class="rate-row" type="button" data-label="${rate.shortLabel}" data-icon="${prefix}${rate.icon}">
        <img src="${prefix}${rate.icon}" alt="" class="rate-coin" loading="eager" decoding="async" fetchpriority="high"/>
        <span>${rate.label}</span>
      </button>`
    )).join('');

    const wrapper = document.createElement('div');
    wrapper.className = 'rate-dropdown dropdown';
    wrapper.innerHTML = `
      <button class="rate-toggle dropdown-toggle" type="button" aria-label="Today's metal rates" aria-expanded="false">
        <img src="${prefix}${orderedRates[0].icon}" alt="" class="rate-coin" loading="eager" decoding="async" fetchpriority="high"/>
        <span>${orderedRates[0].label}</span>
        <span class="rate-chevron" aria-hidden="true"></span>
      </button>
      <div class="rate-menu dropdown-list" role="menu">${rows}</div>`;
    return wrapper;
  };

  const ensureMobileRateStrip = () => {
    const headerMarquee = document.querySelector('header.site-header .logos-marquee');
    if (!headerMarquee || headerMarquee.querySelector('.kj-mobile-rate-strip')) return;

    const strip = document.createElement('div');
    strip.className = 'kj-mobile-rate-strip';
    const orderedRates = getOrderedRates();
    const rateText = orderedRates.map((rate) => rate.label.replace('/1g', '')).join(' ; ');
    strip.innerHTML = `
      <div class="kj-mobile-rate-strip__track">
        <span>Today&rsquo;s Rate (Updated on: 14-05-2026 10.00 AM) ; ${rateText}</span>
        <span>Today&rsquo;s Rate (Updated on: 14-05-2026 10.00 AM) ; ${rateText}</span>
        <span>Today&rsquo;s Rate (Updated on: 14-05-2026 10.00 AM) ; ${rateText}</span>
        <span>Today&rsquo;s Rate (Updated on: 14-05-2026 10.00 AM) ; ${rateText}</span>
      </div>`;

    const embed = headerMarquee.querySelector('.embed');
    if (embed?.nextSibling) {
      headerMarquee.insertBefore(strip, embed.nextSibling);
    } else {
      headerMarquee.prepend(strip);
    }
  };

  const ensureLiveMobileHeaderStyle = () => {
    if (document.getElementById('kj-live-mobile-header-style')) return;
    const style = document.createElement('style');
    style.id = 'kj-live-mobile-header-style';
    style.textContent = `
      @media (max-width: 991px) {
        header.site-header .navigation-mob.site-nav,
        header.site-header .navigation-mob.site-nav.navigation-mob,
        header.site-header .navigation-mob.site-nav.site-nav {
          background: #fff !important;
          background-color: #fff !important;
        }

        header.site-header .navigation-mob .mobile-nav.nav-menu-panel {
          background: #fff !important;
          color: #222 !important;
        }

        header.site-header .navigation-mob .mobile-nav.nav-menu-panel .kj-mobile-menu-link {
          color: #222 !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const simplifyMobileNavContent = () => {
    const prefix = getAssetPrefix();
    document.querySelectorAll('.mobile-nav.nav-menu-panel').forEach((nav) => {
      if (nav.dataset.kjLiveSimple === 'true') return;
      nav.dataset.kjLiveSimple = 'true';
      nav.innerHTML = `
        <a class="kj-mobile-menu-link" href="${prefix}products.html">Gold</a>
        <a class="kj-mobile-menu-link" href="${prefix}silver-products.html">Silver</a>
        <a class="kj-mobile-menu-link" href="${prefix}diamonds-products.html">Diamond</a>
        <a class="kj-mobile-menu-link" href="${prefix}coming-soon.html">Platinum</a>
        <a class="kj-mobile-menu-link" href="${prefix}about.html">About Us</a>
        <a class="kj-mobile-menu-link" href="${prefix}thanga-mazhai.html">Thanga Mazhai</a>
        <a class="kj-mobile-menu-link" href="${prefix}swarnavarsha.html">Swarnavarsha</a>
        <a class="kj-mobile-menu-link" href="${prefix}contact.html">Contact</a>
        <img class="kj-mobile-menu-image" src="${prefix}assets/images/66ae22bea37d1a6f594978b8_Rectangle%20367%20(6).png" alt="" loading="lazy" decoding="async"/>
      `;
    });
  };

  const ensureRateDropdown = () => {
    document.querySelectorAll('.nav-menu-3.nav-menu-panel, .nav-menu-5.nav-menu-panel').forEach((nav) => {
      const goldWrap = nav.querySelector('.goldlink, .goldlink-2')?.closest('.bko-wrap-111-2');
      if (!goldWrap) return;

      let insertionPoint = goldWrap;
      while (insertionPoint.parentElement && insertionPoint.parentElement !== nav) {
        insertionPoint = insertionPoint.parentElement;
      }
      if (insertionPoint.parentElement !== nav) return;

      let rate = nav.querySelector('.rate-dropdown');
      if (rate && rate.dataset.kjRateOrder !== getCurrentMetal()) {
        rate.remove();
        rate = null;
      }
      if (!rate) {
        rate = buildRateDropdown();
        rate.dataset.kjRateOrder = getCurrentMetal();
      }
      if (rate.nextElementSibling !== insertionPoint) nav.insertBefore(rate, insertionPoint);
    });
  };

  const wireMenus = () => {
    const handledMenuClicks = new WeakSet();
    const lockMenuButtonColor = (button) => {
      if (!button) return;
      const isOpen = button.classList.contains('is-open') || button.getAttribute('aria-expanded') === 'true';
      const iconColor = isOpen ? '#d4af37' : '#ffffff';
      button.style.setProperty('background', '#991f23', 'important');
      button.style.setProperty('background-color', '#991f23', 'important');
      button.style.setProperty('color', iconColor, 'important');
      button.style.setProperty('border-color', 'rgba(153, 31, 35, .38)', 'important');
      button.querySelectorAll('.hamburger-icon, .menu-line').forEach((line) => {
        line.style.setProperty('background', iconColor, 'important');
        line.style.setProperty('background-color', iconColor, 'important');
        line.style.setProperty('color', iconColor, 'important');
      });
    };

    const toggleMenuButton = (button) => {
      const header = button.closest('header') || document;
      const willOpen = !button.classList.contains('is-open');
      header.querySelectorAll('.nav-menu-panel').forEach((menu) => {
        menu.classList.toggle('is-open', willOpen);
      });
      button.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
      lockMenuButtonColor(button);
    };

    document.querySelectorAll('.nav-menu-button, .menu-button-2, .menu-mob, .menu-mob-3').forEach((button) => {
      if (button.dataset.kjBound) return;
      button.dataset.kjBound = 'true';
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', button.getAttribute('tabindex') || '0');
      button.setAttribute('aria-expanded', 'false');
      lockMenuButtonColor(button);

      // Intercept clicks in capture-phase and stop immediate propagation to prevent duplicate inline script toggles
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        handledMenuClicks.add(event);
        toggleMenuButton(button);
      }, true);

      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleMenuButton(button);
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (handledMenuClicks.has(event)) return;
      const button = event.target.closest('.nav-menu-button, .menu-button-2, .menu-mob, .menu-mob-3');
      if (!button) return;
      event.preventDefault();
      toggleMenuButton(button);
    });

    document.addEventListener('click', (event) => {
      const toggle = event.target.closest('.dropdown-toggle, .rate-toggle, .rate-dropdown-trigger');
      const dropdown = toggle?.closest('.dropdown, .rate-dropdown, .rate-dropdown-container');

      if (dropdown) {
        const link = event.target.closest('a');
        if (link && link.getAttribute('href') && !link.getAttribute('href').includes('#')) {
          return;
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
      platinum: prefix + 'platinum-products.html',
      scheme: prefix + 'thanga-mazhai.html'
    };

    const staticImages = {
      gold: 'assets/images/66ae16158fbb46cce3ea01a1_Rectangle%20366.png',
      silver: 'assets/images/66ae1d64b0ff185260ad9b44_Rectangle%20367%20(1).png',
      diamond: 'assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png',
      platinum: 'assets/images/66ae249ccb35781959eac6fc_Rectangle%20366%20(6).png',
      scheme: 'assets/images/66ae249ef52614a0871e7f4c_Rectangle%20366%20(8).png'
    };

    document.querySelectorAll('.nav-menu-3.nav-menu-panel, .nav-menu-5.nav-menu-panel').forEach((nav) => {
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

  const rebuildMegamenusFromScheme = () => {
    const prefix = getAssetPrefix();
    const imageMap = {
      gold: 'assets/images/66ae16158fbb46cce3ea01a1_Rectangle%20366.png',
      silver: 'assets/images/66ae1d64b0ff185260ad9b44_Rectangle%20367%20(1).png',
      diamond: 'assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png',
      platinum: 'assets/images/66ae249ccb35781959eac6fc_Rectangle%20366%20(6).png',
      scheme: 'assets/images/66ae249ef52614a0871e7f4c_Rectangle%20366%20(8).png'
    };

    const menus = [
      {
        key: 'gold',
        label: 'Gold',
        selector: '.goldlink, .goldlink-2',
        align: 'left',
        links: [
          ['Bangles', 'products.html?category=bangles'],
          ['Bracelets', 'products.html?category=bracelet'],
          ['Pendant', 'products.html?category=pendant'],
          ['Necklace', 'products.html?category=necklace'],
          ['Rings', 'products.html?category=rings'],
          ['Earrings', 'products.html?category=earrings']
        ]
      },
      {
        key: 'silver',
        label: 'Silver',
        selector: '.silverlink, .silverlink-2',
        align: 'left',
        links: [
          ['Bracelets', 'silver-products.html?category=bracelet'],
          ['Necklace', 'silver-products.html?category=necklace'],
          ['Idols', 'silver-products.html?category=idols'],
          ['Anklets', 'silver-products.html?category=anklet']
        ]
      },
      {
        key: 'diamond',
        label: 'Diamond',
        selector: '.diamondlink, .diamondlink-2',
        align: 'right',
        links: [
          ['Necklace', 'diamonds-products.html?category=necklace'],
          ['Rings', 'diamonds-products.html?category=rings']
        ]
      },
      {
        key: 'scheme',
        label: 'Scheme',
        selector: '.scheme-dropdown-list, a[href*="thanga-mazhai"], a[href*="swarnavarsha"]',
        align: 'right',
        links: [
          ['Thanga Mazhai', 'thanga-mazhai.html'],
          ['Swarnavarsha', 'swarnavarsha.html']
        ]
      }
    ];

    const findWrapper = (nav, config) => {
      let target = nav.querySelector(config.selector);
      if (!target) {
        target = Array.from(nav.querySelectorAll('.bko-wrap-111-2, .bko-dropdown-0.dropdown')).find((item) => (
          item.textContent || ''
        ).replace(/\s+/g, ' ').trim().toLowerCase().includes(config.label.toLowerCase()));
      }
      return target?.closest('.bko-wrap-111-2') || target?.closest('.bko-dropdown-0.dropdown') || null;
    };

    const ensureShell = (wrapper, config) => {
      let dropdown = wrapper.querySelector('.bko-dropdown-0.dropdown');
      if (!dropdown) {
        const currentLink = wrapper.querySelector('a');
        const href = currentLink?.getAttribute('href') || config.links[0][1];
        wrapper.innerHTML = `
          <div class="bko-dropdown-0 dropdown kj-runtime-dropdown">
            <div class="bko-dropdown-toggle-3 dropdown-toggle">
              <a href="${prefix}${href}" class="bko-nav-3-link w-inline-block">
                <div class="bko-dropdown-1-3">${config.label}</div>
              </a>
            </div>
            <nav class="bko-dropdown-list dropdown-list"></nav>
          </div>`;
        dropdown = wrapper.querySelector('.bko-dropdown-0.dropdown');
      }

      let panel = dropdown.querySelector('.bko-dropdown-list, .dropdown-list');
      if (!panel) {
        panel = document.createElement('nav');
        panel.className = 'bko-dropdown-list dropdown-list';
        dropdown.appendChild(panel);
      }
      return panel;
    };

    document.querySelectorAll('.nav-menu-3.nav-menu-panel, .nav-menu-5.nav-menu-panel').forEach((nav) => {
      menus.forEach((config) => {
        const wrapper = findWrapper(nav, config);
        if (!wrapper) return;

        const panel = ensureShell(wrapper, config);
        panel.className = `bko-dropdown-list dropdown-list kj-megamenu-dropdown kj-megamenu-${config.key} kj-menu-align-${config.align}${config.key === 'scheme' ? ' scheme-dropdown-list' : ''}`;
        panel.dataset.kjMegamenu = config.key;

        const links = config.links.map(([text, href]) => (
          `<a class="kj-megamenu-link" href="${prefix}${href}"><span>${text}</span></a>`
        )).join('');

        const imageMarkup = config.key === 'scheme'
          ? ''
          : `<div class="kj-megamenu-image">
              <img src="${prefix}${imageMap[config.key]}" alt="${config.label} jewellery" loading="lazy" decoding="async" />
            </div>`;

        panel.innerHTML = `
          <div class="kj-megamenu-panel${config.key === 'scheme' ? ' kj-megamenu-panel--text-only' : ''}">
            <div class="kj-megamenu-category">
              <div class="bko-text-11 kj-megamenu-heading">Category</div>
              <div class="kj-megamenu-links">${links}</div>
            </div>
            ${imageMarkup}
          </div>`;
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

  const wireRateSelection = () => {
    document.addEventListener('click', (event) => {
      const item = event.target.closest('.rate-row, .rate-item');
      if (!item) return;

      const dropdown = item.closest('.rate-dropdown, .rate-dropdown-container');
      const trigger = dropdown?.querySelector('.rate-toggle, .rate-dropdown-trigger');
      const triggerText = trigger?.querySelector('span');
      const triggerImage = trigger?.querySelector('img');
      const label = item.dataset.label || item.querySelector('span')?.textContent?.trim();
      const icon = item.dataset.icon || item.querySelector('img')?.getAttribute('src');

      if (triggerText && label) triggerText.textContent = label;
      if (triggerImage && icon) triggerImage.setAttribute('src', icon);
      dropdown?.classList.remove('is-open');
      trigger?.setAttribute('aria-expanded', 'false');
    });
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
    const isPlatinumPage = path.includes('platinum-products.html') || path.includes('platinum');
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
      const numbers = visibleText.match(/(?:\+?91[\s-]?)?(?:0\d{2,4}[\s-]?\d{4,8}|\d{5}[\s-]?\d{5})/g) || [];
      const primary = numbers[0]?.replace(/[^\d+]/g, '') || link.getAttribute('href').replace(/^tel:/i, '').split(/[\/,;]/)[0].replace(/[^\d+]/g, '');
      if (primary) link.href = `tel:${primary.startsWith('+') ? primary : primary.length === 10 ? `+91${primary}` : primary}`;
      link.classList.add('kj-phone-link');
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
    const enquiryUrl = `${prefix}checkout.html?product=${encodeURIComponent(context.name)}&id=${encodeURIComponent(context.id)}`;

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

    document.querySelectorAll('a[href*="checkout"], a[href*="checkout-form"]').forEach((link) => {
      link.href = enquiryUrl;
      link.classList.add('kj-enquiry-link');
      if (/buy now|checkout|continue to checkout/i.test(link.textContent)) link.textContent = 'Enquire';
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
      details.style.height = `${height}px`;
      details.style.minHeight = `${height}px`;
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
    document.querySelectorAll('.nav-menu-3.nav-menu-panel, .nav-menu-5.nav-menu-panel').forEach((nav) => {
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

  document.addEventListener('DOMContentLoaded', () => {
    ensureLiveMobileHeaderStyle();
    ensureMobileRateStrip();
    ensureRateDropdown();
    rebuildMegamenusFromScheme();
    simplifyMobileNavContent();
    wireMenus();
    wireMegamenuHover();
    normalizePlatinumNavState();
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
document.addEventListener('DOMContentLoaded', () => {
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
