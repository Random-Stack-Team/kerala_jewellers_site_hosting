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
          color: #000 !important;
        }

        header.site-header .navigation-mob .mobile-nav.nav-menu-panel .kj-mobile-menu-link {
          color: #000 !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const simplifyMobileNavContent = () => {
    document.querySelectorAll('.mobile-nav.nav-menu-panel').forEach((nav) => {
      if (nav.dataset.kjLiveSimple === 'true') return;
      nav.dataset.kjLiveSimple = 'true';
      nav.innerHTML = `
        <a class="kj-mobile-menu-link" href="products.html">Gold</a>
        <a class="kj-mobile-menu-link" href="silver-products.html">Silver</a>
        <a class="kj-mobile-menu-link" href="diamonds-products.html">Diamond</a>
        <a class="kj-mobile-menu-link" href="coming-soon.html">Platinum</a>
        <a class="kj-mobile-menu-link" href="about.html">About Us</a>
        <a class="kj-mobile-menu-link" href="thanga-mazhai.html">Thanga Mazhai</a>
        <a class="kj-mobile-menu-link" href="swarnavarsha.html">Swarnavarsha</a>
        <a class="kj-mobile-menu-link" href="contact.html">Contact</a>
        <img class="kj-mobile-menu-image" src="${getAssetPrefix()}assets/images/66ae22bea37d1a6f594978b8_Rectangle%20367%20(6).png" alt=""/>
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
    const toggleMenuButton = (button) => {
      const header = button.closest('header') || document;
      const willOpen = !button.classList.contains('is-open');
      header.querySelectorAll('.nav-menu-panel, .w-nav-menu').forEach((menu) => {
        menu.classList.toggle('is-open', willOpen);
      });
      button.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    };

    document.querySelectorAll('.nav-menu-button, .menu-button-2, .menu-mob, .menu-mob-3').forEach((button) => {
      if (button.dataset.kjBound) return;
      button.dataset.kjBound = 'true';
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', button.getAttribute('tabindex') || '0');
      button.setAttribute('aria-expanded', 'false');

      button.onclick = (event) => {
        handledMenuClicks.add(event);
        toggleMenuButton(button);
      };
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

  const cleanNavCategoryPanels = () => {
    const panels = document.querySelectorAll('.bko-dropdown-list, .dropdown-list, .mobile-nav');
    const uniquePanels = Array.from(new Set(panels));

    uniquePanels.forEach((panel) => {
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

  const addHoverLife = () => {
    document.querySelectorAll('.product-item-1, .product-item-8, .product-item-81, .team5_item, .blog33_item').forEach((item) => {
      item.classList.add('kj-interactive-card');
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureLiveMobileHeaderStyle();
    ensureMobileRateStrip();
    ensureRateDropdown();
    simplifyMobileNavContent();
    wireMenus();
    wireRateSelection();
    cleanNavCategoryPanels();
    addHoverLife();
    calculatePrice('#goldprice', 14660);
    calculatePrice('#goldprices', 14660);
    calculatePrice('#silverpricesssproduct', 290);
    filterProductsByCategory();
  });
})();
