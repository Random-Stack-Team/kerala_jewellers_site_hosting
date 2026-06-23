document.documentElement.classList.add('js-ready');

(() => {
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

  const renderRateLabelForCurrentPage = () => {
    const currentMetal = getCurrentMetal();
    const shouldHideRate = currentMetal === 'diamond';
    const prefix = getAssetPrefix();

    document.documentElement.classList.toggle('kj-hide-rate-select', shouldHideRate);
    document.body?.classList.toggle('kj-hide-rate-select', shouldHideRate);

    document.querySelectorAll('.rate-select, .rate-select-container').forEach((dropdown) => {
      dropdown.hidden = shouldHideRate;
      dropdown.classList.toggle('rate--hidden', shouldHideRate);
      dropdown.classList.remove('is-active');
      dropdown.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
      if (shouldHideRate) return;

      const triggerText = dropdown.querySelector('.rate-btn span, .rate-select-trigger span');
      const triggerImage = dropdown.querySelector('.rate-btn img, .rate-select-trigger img');
      const menu = dropdown.querySelector('.rate-list, .rate-select-menu');

      // The dynamic rate row generation has been removed from here.
      // It is now handled correctly by header-loader.js and rates.js
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

  let _rateWired = false;
  const wireRateSelection = () => {
    if (_rateWired) return;
    _rateWired = true;
    document.addEventListener('click', (event) => {
      const item = event.target.closest('.rate-option, .rate-item');
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
    if (value == null) return '';
    const compact = String(value)
      .toLowerCase()
      .replace(/&amp;/g, 'and')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!compact || compact === 'null' || compact === 'undefined') return '';
    if (compact === 'all') return 'all';
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
    
    // Populate options only if missing to preserve existing selections
    if (categorySelect && categorySelect.options.length <= 1) {
      categorySelect.innerHTML = [
        `<option value="all">${CATEGORY_LABELS.all}</option>`,
        ...categories.sort().map((category) => `<option value="${category}">${CATEGORY_LABELS[category] || category.replace(/-/g, ' ')}</option>`)
      ].join('');
    }

    return toolbar;
  };

  const applyProductFilters = (toolbar, cards, forceCategory = null, forceSort = null) => {
    const categorySelect = toolbar?.querySelector('[data-filter-control="category"]');
    const sortSelect = toolbar?.querySelector('[data-filter-control="sort"]');

    if (forceCategory !== null && categorySelect) {
      let fCat = forceCategory;
      if (!fCat || fCat === 'null' || fCat === 'undefined' || fCat === 'all') fCat = 'all';
      if (fCat !== 'all' && !categorySelect.querySelector(`option[value="${fCat}"]`)) {
        categorySelect.insertAdjacentHTML('beforeend', `<option value="${fCat}">${CATEGORY_LABELS[fCat] || fCat.replace(/-/g, ' ')}</option>`);
      }
      categorySelect.value = fCat;
    }
    if (forceSort !== null && sortSelect) {
      let fSort = forceSort;
      if (!fSort || fSort === 'null' || fSort === 'undefined') fSort = 'default';
      sortSelect.value = fSort;
    }

    let rawCategory = categorySelect?.value;
    if (!rawCategory || rawCategory === 'null' || rawCategory === 'undefined') rawCategory = 'all';
    const selectedCategory = rawCategory === 'all' ? 'all' : (normalizeCategory(rawCategory) || 'all');
    
    let selectedSort = sortSelect?.value || 'default';
    if (!selectedSort || selectedSort === 'null' || selectedSort === 'undefined') selectedSort = 'default';

    let visibleCount = 0;

    cards.forEach((card) => {
      const category = normalizeCategory(card.dataset.category);
      const categoryMatches = selectedCategory === 'all' || category === selectedCategory;
      const visible = categoryMatches;
      card.hidden = !visible;
      card.classList.toggle('is-filter-hidden', !visible);
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
    if (empty) {
      empty.hidden = visibleCount !== 0;
    }

    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    if (!selectedCategory || selectedCategory === 'all' || selectedCategory === 'null' || selectedCategory === 'undefined') {
      params.delete('category');
      hashParams.delete('category');
    } else {
      params.set('category', selectedCategory);
      hashParams.set('category', selectedCategory);
    }
    
    if (!selectedSort || selectedSort === 'default' || selectedSort === 'null' || selectedSort === 'undefined') {
      params.delete('sort');
    } else {
      params.set('sort', selectedSort);
    }

    const query = params.toString();
    const hashQuery = hashParams.toString();
    const hashStr = hashQuery ? `#${hashQuery}` : '';
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${hashStr}`;
    if (window.location.protocol !== 'file:') {
      window.history.replaceState({}, '', nextUrl);
    }
  };

  const initProductFilters = () => {
    const cards = normalizeProductCards();
    if (!cards.length) return;
    const toolbar = ensureProductFilterToolbar(cards);
    if (!toolbar) return;

    const params = new URLSearchParams(window.location.search);
    let catParam = params.get('category');
    
    if (!catParam || catParam === 'null' || catParam === 'undefined' || catParam === '') {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      catParam = hashParams.get('category');
    }

    if (!catParam || catParam === 'null' || catParam === 'undefined' || catParam === '') {
      const segments = window.location.pathname.split('/').filter(Boolean);
      const last = segments.pop() || '';
      if (last && !last.includes('.html') && !last.includes('products') && last !== 'category') {
        catParam = last;
      }
    }

    const urlCategory = (!catParam || catParam === 'null' || catParam === 'undefined' || catParam === 'all') 
      ? 'all' 
      : (normalizeCategory(catParam) || 'all');
      
    const sortParam = params.get('sort');
    const urlSort = (!sortParam || sortParam === 'null' || sortParam === 'undefined') 
      ? 'default' 
      : sortParam;

    applyProductFilters(toolbar, cards, urlCategory, urlSort);

    if (toolbar.dataset.kjFilterReady === 'true') return;
    toolbar.dataset.kjFilterReady = 'true';

    toolbar.addEventListener('change', (event) => {
      if (!event.target.closest('.collection-toolbar__select')) return;
      applyProductFilters(toolbar, cards);
    });
    toolbar.querySelector('.collection-toolbar__reset')?.addEventListener('click', () => {
      applyProductFilters(toolbar, cards, 'all', 'default');
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

  window.initKeralaHeader = () => {
    const mount = document.getElementById('header');
    if (!mount || !mount.children.length) return;
    if (document.documentElement.dataset.keralaHeaderInit === 'true') return;
    document.documentElement.dataset.keralaHeaderInit = 'true';

    renderRateLabelForCurrentPage();
    wireRateSelection();
    wireTimelineProgress();
    normalizePhoneLinks();
    normalizeProductActions();
    wireEnquiryPage();

    equalizeProductDetails();
    normalizeHeroImages();
    renderPlatinumComingSoon();

    reorderProductSections();
    calculatePrice('#goldprice', 13850);
    calculatePrice('#goldprices', 13850);
    calculatePrice('#silverpricesssproduct', 270);
    initProductFilters();
  }; // end window.initKeralaHeader

  if (!window.__keralaHeaderLifecycleBound) {
    window.__keralaHeaderLifecycleBound = true;
    window.addEventListener('kerala:header-loaded', window.initKeralaHeader);
  }

  if (document.getElementById('header')?.children.length) {
    window.initKeralaHeader();
  }
})();

/* --- TRUE LOUPE ZOOM EFFECT --- */

  function initLoupeEffect() {
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
} // end initLoupeEffect

document.addEventListener("click", function (event) {
  const button = event.target.closest(".nav-toggle.nav-toggle__btn");
  if (!button) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const header = button.closest(".header-mobile");
  const panel = header
    ? header.querySelector(".nav-mobile.nav-panel")
    : document.querySelector(".nav-mobile.nav-panel");

  if (!panel) return;

  if (panel.classList.contains("is-active")) {
    panel.classList.remove("is-active");
    button.classList.remove("is-active");
    button.setAttribute("aria-expanded", "false");
  } else {
    panel.classList.add("is-active");
    button.classList.add("is-active");
    button.setAttribute("aria-expanded", "true");
  }
}, true);

/* --- MOBILE main-navBAR DESKTOP RESET --- */
function resetMobileMenuOnDesktop() {
  if (window.innerWidth >= 992) {
    document.querySelectorAll(".nav-mobile.nav-panel.is-active").forEach(panel => {
      panel.classList.remove("is-active");
    });

    document.querySelectorAll(".nav-toggle.nav-toggle__btn.is-active").forEach(button => {
      button.classList.remove("is-active");
      button.setAttribute("aria-expanded", "false");
    });
  }
}

window.addEventListener("resize", resetMobileMenuOnDesktop);

function restoreEnquiryPrefill() {
  const nameEl = document.querySelector('.word2') || document.querySelector('.text-size-large');
  const codeEl = document.querySelector('.word8');
  
  if (nameEl && codeEl) {
    const enquireBtns = Array.from(document.querySelectorAll('.button-link')).filter(b => b.textContent.trim().toLowerCase() === 'enquire');
    if (enquireBtns.length > 0) {
      const productName = encodeURIComponent(nameEl.textContent.trim());
      const productCode = encodeURIComponent(codeEl.textContent.trim());
      
      enquireBtns.forEach(btn => {
        const baseHref = btn.getAttribute('href') || '../enquiry.html';
        if (!baseHref.includes('product=')) {
          const sep = baseHref.includes('?') ? '&' : '?';
          btn.setAttribute('href', `${baseHref}${sep}product=${productName}&code=${productCode}`);
        }
      });
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const prodParam = urlParams.get('product');
  const codeParam = urlParams.get('code');
  
  if (prodParam || codeParam) {
    const nameInput = document.querySelector('input[name="productName"]');
    const codeInput = document.querySelector('input[name="productId"]');
    const msgArea = document.querySelector('textarea[name="message"]');
    
    if (nameInput && prodParam) nameInput.value = prodParam;
    if (codeInput && codeParam) codeInput.value = codeParam;
    
    if (msgArea && !msgArea.value) {
      const pName = prodParam || 'this product';
      const pCode = codeParam ? ` (Code: ${codeParam})` : '';
      msgArea.value = `I am interested in ${pName}${pCode}. Please share more details about availability and pricing.`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof initLoupeEffect === 'function') initLoupeEffect();
  if (typeof resetMobileMenuOnDesktop === 'function') resetMobileMenuOnDesktop();
  restoreEnquiryPrefill();

  // Contact Page Form Submission Handler
  const contactForm = document.querySelector('.get-in-touch-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const wrap = contactForm.closest('.get-in-touch-form-wrap');
      if (wrap) {
        contactForm.style.display = 'none';
        const successMsg = wrap.querySelector('.form-done');
        if (successMsg) {
          successMsg.style.display = 'block';
        }
      }
    });
  }
});
