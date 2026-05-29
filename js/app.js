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
    const rows = METAL_RATES.map((rate) => (
      `<button class="rate-row" type="button" data-label="${rate.shortLabel}" data-icon="${prefix}${rate.icon}">
        <img src="${prefix}${rate.icon}" alt="" class="rate-coin"/>
        <span>${rate.label}</span>
      </button>`
    )).join('');

    const wrapper = document.createElement('div');
    wrapper.className = 'rate-dropdown dropdown';
    wrapper.innerHTML = `
      <button class="rate-toggle dropdown-toggle" type="button" aria-label="Today's metal rates" aria-expanded="false">
        <img src="${prefix}${METAL_RATES[0].icon}" alt="" class="rate-coin"/>
        <span>${METAL_RATES[0].label}</span>
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
    strip.innerHTML = `
      <div class="kj-mobile-rate-strip__track">
        <span>Today&rsquo;s Rate (Updated on: 14-05-2026 10.00 AM) ; Gold Rate 22 k - &#8377; 14,800 Sliver Rate - &#8377; 315</span>
        <span>Today&rsquo;s Rate (Updated on: 14-05-2026 10.00 AM) ; Gold Rate 22 k - &#8377; 14,800 Sliver Rate - &#8377; 315</span>
        <span>Today&rsquo;s Rate (Updated on: 14-05-2026 10.00 AM) ; Gold Rate 22 k - &#8377; 14,800 Sliver Rate - &#8377; 315</span>
        <span>Today&rsquo;s Rate (Updated on: 14-05-2026 10.00 AM) ; Gold Rate 22 k - &#8377; 14,800 Sliver Rate - &#8377; 315</span>
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
        <a class="kj-mobile-menu-link" href="${prefix}platinum-products.html">Platinum</a>
        <a class="kj-mobile-menu-link" href="${prefix}about.html">About Us</a>
        <a class="kj-mobile-menu-link" href="${prefix}thanga-mazhai.html">Thanga Mazhai</a>
        <a class="kj-mobile-menu-link" href="${prefix}swarnavarsha.html">Swarnavarsha</a>
        <a class="kj-mobile-menu-link" href="${prefix}contact.html">Contact</a>
        <img class="kj-mobile-menu-image" src="${prefix}assets/images/66ae22bea37d1a6f594978b8_Rectangle%20367%20(6).png" alt=""/>
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
      if (!rate) rate = buildRateDropdown();
      if (rate.nextElementSibling !== insertionPoint) nav.insertBefore(rate, insertionPoint);
    });
  };

  const wireMenus = () => {
    const handledMenuClicks = new WeakSet();
    const lockMenuButtonColor = (button) => {
      if (!button) return;
      const isOpen = button.classList.contains('is-open') || button.classList.contains('w--open') || button.getAttribute('aria-expanded') === 'true';
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
      header.querySelectorAll('.nav-menu-panel, .w-nav-menu').forEach((menu) => {
        menu.classList.toggle('is-open', willOpen);
        menu.classList.toggle('w--open', willOpen);
      });
      button.classList.toggle('is-open', willOpen);
      button.classList.toggle('w--open', willOpen);
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
          sliderCol.innerHTML = `<img src="${prefix}${staticImages[key]}" alt="${key} megamenu image" class="slide__image" style="width: 100%; height: auto; display: block;" />`;
        } else {
          // Create static image column if it doesn't exist
          sliderCol = document.createElement('div');
          sliderCol.className = 'kj-clean-slider-col';
          sliderCol.innerHTML = `<img src="${prefix}${staticImages[key]}" alt="${key} megamenu image" class="slide__image" style="width: 100%; height: auto; display: block;" />`;
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
          ['Bangles', 'diamonds-products.html?category=bangles'],
          ['Necklace', 'diamonds-products.html?category=necklace'],
          ['Rings', 'diamonds-products.html?category=rings']
        ]
      },
      {
        key: 'platinum',
        label: 'Platinum',
        selector: '.platinumlink, .platinumlink-2',
        align: 'right',
        links: [
          ['Platinum', 'platinum-products.html']
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
              <img src="${prefix}${imageMap[config.key]}" alt="${config.label} jewellery" loading="eager" />
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
    productShell.querySelector('.content_filter')?.remove();
    productShell.querySelector('.dynamic-list')?.remove();

    if (!productShell.querySelector('.kj-coming-soon')) {
      productShell.insertAdjacentHTML('beforeend', `
        <section class="kj-coming-soon" aria-labelledby="platinum-coming-soon-title">
          <div class="kj-coming-soon__inner">
            <p class="kj-coming-soon__eyebrow">Platinum</p>
            <h1 id="platinum-coming-soon-title">Platinum Collection Coming Soon</h1>
            <p>Our exclusive platinum designs will be available soon. Stay connected for updates.</p>
          </div>
        </section>
      `);
    }
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

  const cleanDiamondDropdown = () => {
    if (document.querySelector('.kj-megamenu-diamond')) return;
    document.querySelectorAll('.nav-menu-3.nav-menu-panel, .nav-menu-5.nav-menu-panel').forEach((nav) => {
      const diamondLink = nav.querySelector('.diamondlink, .diamondlink-2');
      if (!diamondLink) return;
      const dropdown = diamondLink.closest('.dropdown, .bko-dropdown-0');
      if (!dropdown) return;
      const grid = dropdown.querySelector('.bko-grid-1-3-1');
      if (!grid) return;
      const cols = Array.from(grid.children).filter(c => c.tagName === 'DIV');
      if (!cols.length) return;
      const categoryCol = cols[0];
      // Remove empty dynamic-item divs first
      categoryCol.querySelectorAll('.dynamic-item').forEach((item) => {
        if (!item.textContent.trim()) item.remove();
      });
      // Keep ONLY Necklace and Rings in Diamond dropdown
      categoryCol.querySelectorAll('a').forEach((a) => {
        const text = a.textContent.trim().toLowerCase();
        if (!text.includes('necklace') && !text.includes('ring')) {
          const parent = a.closest('.dynamic-item');
          if (parent) parent.remove();
          else a.remove();
        }
      });
    });
  };

  const cleanNavCategoryPanels = () => {
    const panels = document.querySelectorAll('.bko-dropdown-list, .dropdown-list, .mobile-nav');
    const uniquePanels = Array.from(new Set(panels));

    uniquePanels.forEach((panel) => {
      // Remove empty dynamic-items (empty list item divs)
      panel.querySelectorAll('.dynamic-item').forEach((item) => {
        if (!item.textContent.trim()) item.remove();
      });

      const seen = new Set();
      panel.querySelectorAll('[class*="bko-text-12"], .category-menu-link').forEach((item) => {
        const text = (item.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text) return;

        const normalized = text.replace(/^[-–—]\s*/, '').toLowerCase();
        const isDuplicateLabel = /^[-–—]/.test(text);
        const columnHeader = item.closest('.bko-text-1, .bko-text-1-2, .bko-grid-11, .bko-grid-11-category')?.querySelector('.bko-text-11')?.textContent?.trim() || '';
        const key = normalized + '|' + columnHeader;

        if (isDuplicateLabel || seen.has(key)) {
          const removable = item.closest('a, .dynamic-item') || item;
          removable.remove();
          return;
        }

        seen.add(key);
      });
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

  const filterProductsByCategory = () => {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = (params.get('category') || '').trim().toLowerCase();
    if (!selectedCategory) return;

    const aliases = {
      bangles: ['bangles', 'bangle'],
      bracelet: ['bracelet', 'bracelets'],
      pendant: ['pendant', 'pendants'],
      necklace: ['necklace', 'necklaces', 'haram', 'choker'],
      rings: ['ring', 'rings'],
      earrings: ['earring', 'earrings', 'studs', 'jimmiki'],
      idols: ['idol', 'idols', 'idoels'],
      anklet: ['anklet', 'anklets']
    };

    const accepted = aliases[selectedCategory] || [selectedCategory];
    const products = Array.from(document.querySelectorAll('.product-item-14'));
    if (!products.length) return;

    let visibleCount = 0;
    products.forEach((product) => {
      const categoryText = (product.querySelector('.product-name1141')?.textContent || '').trim().toLowerCase();
      const titleText = (product.querySelector('.product-name114')?.textContent || '').trim().toLowerCase();
      const matches = accepted.some((term) => categoryText.includes(term) || titleText.includes(term));
      product.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (!visibleCount) products.forEach((product) => { product.hidden = false; });
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
    const headings = document.querySelectorAll('.heading-32, .heading-2-12, h2, h3');
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

  const addHoverLife = () => {
    document.querySelectorAll('.product-item-1, .product-item-8, .product-item-81, .team5_item, .blog33_item').forEach((item) => {
      item.classList.add('kj-interactive-card');
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureLiveMobileHeaderStyle();
    ensureMobileRateStrip();
    ensureRateDropdown();
    ensureSimpleMegamenus();
    rebuildMegamenusFromScheme();
    simplifyMobileNavContent();
    wireMenus();
    wireRateSelection();
    wireTimelineProgress();
    cleanNavCategoryPanels();
    cleanDiamondDropdown();
    renderPlatinumComingSoon();
    addHoverLife();
    reorderProductSections();
    calculatePrice('#goldprice', 14660);
    calculatePrice('#goldprices', 14660);
    calculatePrice('#silverpricesssproduct', 290);
    filterProductsByCategory();
  });
})();
