document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initContentSlider = (slider) => {
    const track = slider.querySelector('.slider-track');
    if (!track || slider.dataset.kjSliderReady) return;

    const slides = Array.from(track.querySelectorAll(':scope > .slider-slide, :scope > .slide, :scope > [class*="slide-"]'));
    if (slides.length <= 1) return;

    slider.dataset.kjSliderReady = 'true';
    let activeIndex = 0;
    let timerId = 0;
    const dots = slider.querySelector('.slider-dots');
    const delay = Number(slider.dataset.delay || 4000);

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots?.querySelectorAll('.slider-dot, button, div').forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    };

    if (dots && !dots.children.length) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot' + (index === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
        dot.addEventListener('click', () => showSlide(index));
        dots.appendChild(dot);
      });
    }

    const stop = () => window.clearInterval(timerId);
    const start = () => {
      stop();
      if (!prefersReducedMotion) timerId = window.setInterval(() => showSlide(activeIndex + 1), delay);
    };

    slider.querySelectorAll('.slider-arrow-left, .left-arrow, .area-prev').forEach((button) => {
      button.addEventListener('click', () => showSlide(activeIndex - 1));
    });
    slider.querySelectorAll('.slider-arrow-right, .right-arrow, .next-button, .area-next').forEach((button) => {
      button.addEventListener('click', () => showSlide(activeIndex + 1));
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    showSlide(0);
    start();
  };

    const initReviewCarousel = (component) => {
    if (component.dataset.kjSwiperReady) return;
    component.dataset.kjSwiperReady = 'true';

    // 1. If official Swiper library is loaded, use it for the testimonial
    // carousel too. The live site relies on Swiper's creative effect.
    if (typeof Swiper !== 'undefined' && !component.closest('.section-16')) {
      const slides = component.querySelectorAll('.swiper-slide');
      slides.forEach((slide, index) => {
        slide.setAttribute('data-hash', `slide${index + 1}`);
      });

      const swiperElement = component.querySelector('.swiper') || component;
      const swiperInstance = swiperElement.swiper || new Swiper(swiperElement, {
        autoplay: prefersReducedMotion ? false : {
          delay: 5200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        grabCursor: true,
        slidesPerView: 5,
        centeredSlides: true,
        loop: true,
        speed: 760,
        effect: "creative",
        threshold: 6,
        touchRatio: 1,
        hashNavigation: {
          watchState: true,
        },
        navigation: {
          nextEl: component.closest('.slider-wrapper')?.querySelector('.slider-arrow.cc-next') || ".slider-arrow.cc-next",
          prevEl: component.closest('.slider-wrapper')?.querySelector('.slider-arrow.cc-prev') || ".slider-arrow.cc-prev"
        },
        creativeEffect: {
          limitProgress: 2,
          prev: {
            translate: ["-110%", 0, -500],
            origin: "right center"
          },
          next: {
            translate: ["110%", 0, -500],
            origin: "left center"
          }
        },
        breakpoints: {
          320: { slidesPerView: 1, centeredSlides: true },
          768: { slidesPerView: 3, centeredSlides: true },
          1024: { slidesPerView: 5, centeredSlides: true }
        }
      });

      // Hover slide-advance navigation matching reference site
      const host = component.closest('.slider-wrapper') || component;
      const prevControls = host.querySelectorAll(".area-prev, .slider-arrow.cc-prev");
      const nextControls = host.querySelectorAll(".area-next, .slider-arrow.cc-next");
      const hoverChangeDelay = 1000;
      let intervalID = 0;
      let intervalID2 = 0;

      prevControls.forEach((prev) => {
        prev.addEventListener("click", (e) => {
          e.preventDefault();
          swiperInstance.slidePrev(760);
        });
        prev.addEventListener("mouseover", () => {
          window.clearInterval(intervalID);
          swiperInstance.autoplay?.stop();
          intervalID = setInterval(() => swiperInstance.slidePrev(760), hoverChangeDelay);
        });
        prev.addEventListener("mouseleave", () => {
          clearInterval(intervalID);
          swiperInstance.autoplay?.start();
        });
      });

      nextControls.forEach((next) => {
        next.addEventListener("click", (e) => {
          e.preventDefault();
          swiperInstance.slideNext(760);
        });
        next.addEventListener("mouseover", () => {
          window.clearInterval(intervalID2);
          swiperInstance.autoplay?.stop();
          intervalID2 = setInterval(() => swiperInstance.slideNext(760), hoverChangeDelay);
        });
        next.addEventListener("mouseleave", () => {
          clearInterval(intervalID2);
          swiperInstance.autoplay?.start();
        });
      });

      window.setTimeout(() => swiperInstance.update(), 250);
      window.setTimeout(() => swiperInstance.update(), 900);
      return;
    }

    // 2. Fallback/live-style review carousel logic. The legacy page also
    // initializes Swiper inline, so clean that instance before controlling the
    // section to avoid duplicate transforms fighting each other.
    if (component.closest('.section-16')) {
      component.closest('.section-16')?.classList.add('kj-review-section');
      component.closest('.slider-wrapper')?.classList.add('kj-review-carousel-shell');
      component.classList.add('kj-review-carousel');
      component.querySelector('.swiper-wrapper')?.classList.add('kj-review-track');
      component.querySelectorAll('.swiper-slide').forEach((slide, index) => {
        slide.classList.add('kj-review-card');
        slide.setAttribute('data-hash', `slide${index + 1}`);
      });
      const swiperElement = component.querySelector('.swiper');
      swiperElement?.swiper?.destroy(true, true);
      component.querySelectorAll('.swiper-slide-duplicate').forEach((slide) => slide.remove());
      component.querySelectorAll('.swiper-slide').forEach((slide) => {
        slide.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next', 'swiper-slide-duplicate-active', 'swiper-slide-duplicate-prev', 'swiper-slide-duplicate-next');
        slide.removeAttribute('style');
      });
      const wrapperElement = component.querySelector('.swiper-wrapper');
      wrapperElement?.removeAttribute('style');
      swiperElement?.classList.remove('swiper-initialized', 'swiper-horizontal', 'swiper-pointer-events', 'swiper-watch-progress', 'swiper-backface-hidden');
    }

    // 3. Fallback (Offline) 3D carousel logic
    const wrapper = component.querySelector('.swiper-wrapper');
    const slides = Array.from(component.querySelectorAll('.swiper-slide'));
    if (!wrapper || slides.length <= 1) return;

    let activeIndex = 0;
    let timerId = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragLastX = 0;
    let dragLastTime = 0;
    let dragVelocity = 0;
    let dragDeltaX = 0;
    let isDragging = false;
    let isHorizontalDrag = false;
    const host = component.closest('.slider-wrapper') || component;
    const prevAreas = host.querySelectorAll('.area-prev, .slider-arrow.cc-prev');
    const nextAreas = host.querySelectorAll('.area-next, .slider-arrow.cc-next');

    const render = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      const stage = component.querySelector('.swiper') || component;
      const stageWidth = stage.getBoundingClientRect().width || stage.clientWidth || 1200;
      const desktop = window.matchMedia('(min-width: 769px)').matches;
      const measuredSlideWidth = slides[activeIndex]?.offsetWidth || slides[0]?.offsetWidth || stageWidth * 0.42;
      const slideWidth = desktop
        ? Math.max(260, Math.min(stageWidth - 32, measuredSlideWidth))
        : Math.max(260, Math.min(window.innerWidth - 30, measuredSlideWidth));
      const stageLeft = stage.getBoundingClientRect().left || 0;
      const centerOffset = desktop ? (stageWidth - slideWidth) / 2 : ((window.innerWidth - slideWidth) / 2) - stageLeft;
      const slideGap = slideWidth * (desktop ? 0.68 : 0.9);
      const sideScale = desktop ? 0.82 : 0.9;
      const depth = desktop ? 160 : 90;

      wrapper.style.transform = 'none';
      slides.forEach((slide, slideIndex) => {
        let offset = slideIndex - activeIndex;
        if (offset > slides.length / 2) offset -= slides.length;
        if (offset < -slides.length / 2) offset += slides.length;
        const clampedOffset = Math.max(-2, Math.min(2, offset));
        const distance = Math.abs(clampedOffset);
        slide.classList.toggle('swiper-slide-active', slideIndex === activeIndex);
        slide.classList.toggle('swiper-slide-prev', offset === -1 || offset === slides.length - 1);
        slide.classList.toggle('swiper-slide-next', offset === 1 || offset === -(slides.length - 1));
        slide.dataset.kjOffset = String(clampedOffset);
        slide.style.transitionDuration = isDragging ? '0ms' : '';
        slide.style.transform = `translate3d(${centerOffset + clampedOffset * slideGap}px, 0, ${distance ? -depth * distance : 0}px) scale(${distance ? sideScale : 1})`;
        slide.style.opacity = distance > 1 ? '0.42' : '1';
        slide.style.zIndex = String(10 - distance);
        slide.style.pointerEvents = slideIndex === activeIndex ? 'auto' : 'none';
      });
      wrapper.style.minHeight = stageWidth < 769 ? '560px' : '470px';
    };

    const stop = () => window.clearInterval(timerId);
    const start = () => {
      stop();
      if (!prefersReducedMotion) timerId = window.setInterval(() => render(activeIndex + 1), 5200);
    };

    const applyDrag = () => {
      if (!isDragging) return;
      const stage = component.querySelector('.swiper') || component;
      const stageWidth = stage.getBoundingClientRect().width || stage.clientWidth || 1200;
      const desktop = window.matchMedia('(min-width: 769px)').matches;
      const measuredSlideWidth = slides[activeIndex]?.offsetWidth || slides[0]?.offsetWidth || stageWidth * 0.42;
      const slideWidth = desktop
        ? Math.max(260, Math.min(stageWidth - 32, measuredSlideWidth))
        : Math.max(260, Math.min(window.innerWidth - 30, measuredSlideWidth));
      const stageLeft = stage.getBoundingClientRect().left || 0;
      const centerOffset = desktop ? (stageWidth - slideWidth) / 2 : ((window.innerWidth - slideWidth) / 2) - stageLeft;
      const slideGap = slideWidth * (desktop ? 0.68 : 0.9);
      const sideScale = desktop ? 0.82 : 0.9;
      const depth = desktop ? 160 : 90;
      const dragProgress = Math.max(-1, Math.min(1, dragDeltaX / Math.max(1, slideWidth)));

      slides.forEach((slide) => {
        const baseOffset = Number(slide.dataset.kjOffset || 0);
        const liveOffset = baseOffset + dragProgress;
        const distance = Math.min(2, Math.abs(liveOffset));
        slide.style.transitionDuration = '0ms';
        slide.style.transform = `translate3d(${centerOffset + liveOffset * slideGap}px, 0, ${distance ? -depth * distance : 0}px) scale(${distance ? sideScale : 1})`;
      });
    };

    const finishDrag = () => {
      if (!isDragging) return;
      const slideWidth = slides[activeIndex]?.getBoundingClientRect().width || 260;
      const threshold = Math.min(82, Math.max(34, slideWidth * 0.14));
      const fastSwipe = Math.abs(dragVelocity) > 0.45 && Math.abs(dragDeltaX) > 18;
      const direction = (Math.abs(dragDeltaX) > threshold || fastSwipe) ? (dragDeltaX < 0 ? 1 : -1) : 0;
      isDragging = false;
      isHorizontalDrag = false;
      dragStartX = 0;
      dragStartY = 0;
      dragLastX = 0;
      dragLastTime = 0;
      dragVelocity = 0;
      dragDeltaX = 0;
      render(activeIndex + direction);
      start();
    };

    prevAreas.forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
      }, true);
      button.addEventListener('pointerup', (event) => {
        event.stopPropagation();
      }, true);
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        render(activeIndex - 1);
        start();
      }, true);
      button.addEventListener('mouseenter', () => {
        stop();
        timerId = window.setInterval(() => render(activeIndex - 1), 1000);
      });
      button.addEventListener('mouseleave', start);
    });

    nextAreas.forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
      }, true);
      button.addEventListener('pointerup', (event) => {
        event.stopPropagation();
      }, true);
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        render(activeIndex + 1);
        start();
      }, true);
      button.addEventListener('mouseenter', () => {
        stop();
        timerId = window.setInterval(() => render(activeIndex + 1), 1000);
      });
      button.addEventListener('mouseleave', start);
    });

    host.addEventListener('mouseenter', stop);
    host.addEventListener('mouseleave', start);
    host.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      isDragging = true;
      isHorizontalDrag = false;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragLastX = event.clientX;
      dragLastTime = performance.now();
      dragVelocity = 0;
      dragDeltaX = 0;
      stop();
      try {
        host.setPointerCapture?.(event.pointerId);
      } catch (error) {
        // Synthetic pointer tests may not have an active pointer to capture.
      }
    });
    host.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      dragDeltaX = event.clientX - dragStartX;
      const dragDeltaY = event.clientY - dragStartY;
      if (!isHorizontalDrag && Math.abs(dragDeltaX) > 8 && Math.abs(dragDeltaX) > Math.abs(dragDeltaY) * 1.15) {
        isHorizontalDrag = true;
      }
      if (!isHorizontalDrag && Math.abs(dragDeltaY) > Math.abs(dragDeltaX) * 1.25) return;
      if (isHorizontalDrag) event.preventDefault();
      const now = performance.now();
      const elapsed = Math.max(1, now - dragLastTime);
      dragVelocity = (event.clientX - dragLastX) / elapsed;
      dragLastX = event.clientX;
      dragLastTime = now;
      applyDrag();
    });
    host.addEventListener('pointerup', finishDrag);
    host.addEventListener('pointercancel', finishDrag);
    host.addEventListener('lostpointercapture', finishDrag);
    window.addEventListener('resize', () => render(activeIndex));
    render(0);
    window.setTimeout(() => render(activeIndex), 250);
    window.setTimeout(() => render(activeIndex), 900);
    start();
  };

  const banner2MobileQuery = window.matchMedia('(max-width: 991px)');

  const setBanner2Position = (slide, offset) => {
    const isActive = offset === 0;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));

    if (offset === 0) {
      slide.dataset.kjPosition = 'active';
    } else if (offset === -1) {
      slide.dataset.kjPosition = 'prev';
    } else if (offset === 1) {
      slide.dataset.kjPosition = 'next';
    } else {
      slide.dataset.kjPosition = 'off';
    }
  };

  const initBanner2Slider = (banner) => {
    if (!banner2MobileQuery.matches || banner.dataset.kjBanner2Ready === 'true') return;

    const track = banner.querySelector('.team5_list');
    const slides = Array.from(track?.querySelectorAll(':scope > .team5_item') || []);
    if (!track || slides.length <= 1) return;

    banner.dataset.kjBanner2Ready = 'true';
    banner.classList.add('kj-banner2-gallery');
    track.classList.add('kj-banner2-track');
    slides.forEach((slide) => slide.classList.add('kj-banner2-slide'));

    let activeIndex = 0;
    let timerId = 0;
    let resumeTimerId = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragDeltaX = 0;
    let isDragging = false;
    let isHorizontalDrag = false;

    const render = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        let offset = slideIndex - activeIndex;
        if (offset > slides.length / 2) offset -= slides.length;
        if (offset < -slides.length / 2) offset += slides.length;
        setBanner2Position(slide, Math.max(-2, Math.min(2, offset)));
      });
    };

    const stop = () => {
      window.clearInterval(timerId);
      window.clearTimeout(resumeTimerId);
    };
    const start = () => {
      stop();
      if (!prefersReducedMotion) timerId = window.setInterval(() => render(activeIndex + 1), 4200);
    };
    const resumeAfterInteraction = () => {
      window.clearTimeout(resumeTimerId);
      if (!prefersReducedMotion) resumeTimerId = window.setTimeout(start, 2600);
    };

    const finishDrag = () => {
      if (!isDragging) return;
      const threshold = Math.min(90, Math.max(42, banner.getBoundingClientRect().width * 0.12));
      const direction = Math.abs(dragDeltaX) > threshold ? (dragDeltaX < 0 ? 1 : -1) : 0;
      isDragging = false;
      isHorizontalDrag = false;
      dragStartX = 0;
      dragStartY = 0;
      dragDeltaX = 0;
      track.style.removeProperty('--kj-banner2-drag');
      render(activeIndex + direction);
      resumeAfterInteraction();
    };

    const onPointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      isDragging = true;
      isHorizontalDrag = false;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragDeltaX = 0;
      stop();
      try {
        banner.setPointerCapture?.(event.pointerId);
      } catch (error) {
        // Synthetic pointer tests may not have an active pointer to capture.
      }
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;
      dragDeltaX = event.clientX - dragStartX;
      const dragDeltaY = event.clientY - dragStartY;
      if (!isHorizontalDrag && Math.abs(dragDeltaX) > 8 && Math.abs(dragDeltaX) > Math.abs(dragDeltaY) * 1.15) {
        isHorizontalDrag = true;
      }
      if (!isHorizontalDrag && Math.abs(dragDeltaY) > Math.abs(dragDeltaX) * 1.25) return;
      if (isHorizontalDrag) {
        event.preventDefault();
        const limitedDrag = Math.max(-90, Math.min(90, dragDeltaX));
        track.style.setProperty('--kj-banner2-drag', `${limitedDrag}px`);
      }
    };

    banner.addEventListener('pointerdown', onPointerDown, { passive: false });
    banner.addEventListener('pointermove', onPointerMove, { passive: false });
    banner.addEventListener('pointerup', finishDrag);
    banner.addEventListener('pointercancel', finishDrag);
    banner.addEventListener('lostpointercapture', finishDrag);
    banner.addEventListener('mouseenter', stop);
    banner.addEventListener('mouseleave', resumeAfterInteraction);

    banner.__kjBanner2 = {
      cleanup() {
        stop();
        banner.removeEventListener('pointerdown', onPointerDown);
        banner.removeEventListener('pointermove', onPointerMove);
        banner.removeEventListener('pointerup', finishDrag);
        banner.removeEventListener('pointercancel', finishDrag);
        banner.removeEventListener('lostpointercapture', finishDrag);
        banner.removeEventListener('mouseenter', stop);
        banner.removeEventListener('mouseleave', resumeAfterInteraction);
      }
    };

    render(0);
    start();
  };

  const destroyBanner2Slider = (banner) => {
    banner.__kjBanner2?.cleanup?.();
    delete banner.__kjBanner2;
    delete banner.dataset.kjBanner2Ready;
    banner.classList.remove('kj-banner2-gallery');

    const track = banner.querySelector('.team5_list');
    track?.classList.remove('kj-banner2-track');
    track?.style.removeProperty('--kj-banner2-drag');
    banner.querySelectorAll('.team5_item').forEach((slide) => {
      slide.classList.remove('kj-banner2-slide', 'is-active');
      slide.removeAttribute('aria-hidden');
      delete slide.dataset.kjPosition;
      slide.removeAttribute('style');
    });
  };

  const refreshBanner2Sliders = () => {
    document.querySelectorAll('.banner-2').forEach((banner) => {
      if (banner2MobileQuery.matches) {
        initBanner2Slider(banner);
      } else if (banner.dataset.kjBanner2Ready === 'true') {
        destroyBanner2Slider(banner);
      }
    });
  };

  document.querySelectorAll('.content-slider').forEach(initContentSlider);
  document.querySelectorAll('.swiper-component').forEach(initReviewCarousel);
  refreshBanner2Sliders();
  if (typeof banner2MobileQuery.addEventListener === 'function') {
    banner2MobileQuery.addEventListener('change', refreshBanner2Sliders);
  } else {
    banner2MobileQuery.addListener(refreshBanner2Sliders);
  }
  window.addEventListener('resize', refreshBanner2Sliders);

});
