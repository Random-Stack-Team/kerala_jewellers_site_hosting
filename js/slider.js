document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initContentSlider = (slider) => {
    const track = slider.querySelector('.slider-track, .w-slider-mask');
    if (!track || slider.dataset.kjSliderReady) return;

    const slides = Array.from(track.querySelectorAll(':scope > .slider-slide, :scope > .slide, :scope > [class*="slide-"]'));
    if (slides.length <= 1) return;

    slider.dataset.kjSliderReady = 'true';
    let activeIndex = 0;
    let timerId = 0;
    const dots = slider.querySelector('.slider-dots, .w-slider-nav');
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

    // 1. If official Swiper library is loaded, use it outside the restored
    // testimonial section. The live-style review carousel below needs fixed
    // card geometry, so it uses the controlled fallback even when Swiper exists.
    if (typeof Swiper !== 'undefined' && !component.closest('.section-16')) {
      const slides = component.querySelectorAll('.swiper-slide');
      slides.forEach((slide, index) => {
        slide.setAttribute('data-hash', `slide${index + 1}`);
      });

      const swiperInstance = new Swiper(component.querySelector('.swiper') || component, {
        grabCursor: true,
        slidesPerView: 5,
        centeredSlides: true,
        loop: true,
        speed: 600,
        effect: "creative",
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
      const prev = component.closest('.slider-wrapper')?.querySelector(".area-prev") || component.closest('.slider-wrapper')?.querySelector(".cc-prev");
      const next = component.closest('.slider-wrapper')?.querySelector(".area-next") || component.closest('.slider-wrapper')?.querySelector(".cc-next");
      const hoverChangeDelay = 1000;
      let intervalID, intervalID2;

      if (prev) {
        prev.addEventListener("mouseover", () => {
          intervalID = setInterval(() => swiperInstance.slidePrev(), hoverChangeDelay);
        });
        prev.addEventListener("mouseleave", () => {
          clearInterval(intervalID);
        });
        prev.addEventListener("click", (e) => {
          e.preventDefault();
          swiperInstance.slidePrev();
        });
      }
      if (next) {
        next.addEventListener("mouseover", () => {
          intervalID2 = setInterval(() => swiperInstance.slideNext(), hoverChangeDelay);
        });
        next.addEventListener("mouseleave", () => {
          clearInterval(intervalID2);
        });
        next.addEventListener("click", (e) => {
          e.preventDefault();
          swiperInstance.slideNext();
        });
      }
      return;
    }

    // 2. Fallback (Offline) 3D carousel logic
    const wrapper = component.querySelector('.swiper-wrapper');
    const slides = Array.from(component.querySelectorAll('.swiper-slide'));
    if (!wrapper || slides.length <= 1) return;

    let activeIndex = 0;
    let timerId = 0;
    let dragStartX = 0;
    let dragDeltaX = 0;
    let isDragging = false;
    const host = component.closest('.slider-wrapper') || component;
    const prevAreas = host.querySelectorAll('.area-prev, .cc-prev');
    const nextAreas = host.querySelectorAll('.area-next, .cc-next');

    const render = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      const stage = component.querySelector('.swiper') || component;
      const stageWidth = wrapper.getBoundingClientRect().width || stage.getBoundingClientRect().width || 1200;
      const measuredSlideWidth = slides[activeIndex]?.getBoundingClientRect().width || slides[0]?.offsetWidth || stageWidth * 0.2;
      const slideWidth = Math.max(220, Math.min(stageWidth - 32, measuredSlideWidth));
      const centerOffset = (stageWidth - slideWidth) / 2;
      const slideGap = slideWidth * 1.72;

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
        slide.style.transform = `translate3d(${centerOffset + clampedOffset * slideGap}px, 0, ${distance ? -500 * distance : 0}px) scale(${distance ? 0.86 : 1})`;
        slide.style.opacity = distance > 1 ? '0.55' : '1';
        slide.style.zIndex = String(10 - distance);
        slide.style.pointerEvents = slideIndex === activeIndex ? 'auto' : 'none';
      });
      wrapper.style.minHeight = stageWidth < 768 ? '500px' : '600px';
    };

    const stop = () => window.clearInterval(timerId);
    const start = () => {
      stop();
      if (!prefersReducedMotion) timerId = window.setInterval(() => render(activeIndex + 1), 5200);
    };

    const applyDrag = () => {
      if (!isDragging) return;
      const stage = component.querySelector('.swiper') || component;
      const stageWidth = wrapper.getBoundingClientRect().width || stage.getBoundingClientRect().width || 1200;
      const measuredSlideWidth = slides[activeIndex]?.getBoundingClientRect().width || slides[0]?.offsetWidth || stageWidth * 0.2;
      const slideWidth = Math.max(220, Math.min(stageWidth - 32, measuredSlideWidth));
      const centerOffset = (stageWidth - slideWidth) / 2;
      const slideGap = slideWidth * 1.72;
      const dragProgress = Math.max(-1, Math.min(1, dragDeltaX / Math.max(1, slideWidth)));

      slides.forEach((slide) => {
        const baseOffset = Number(slide.dataset.kjOffset || 0);
        const liveOffset = baseOffset + dragProgress;
        const distance = Math.min(2, Math.abs(liveOffset));
        slide.style.transitionDuration = '0ms';
        slide.style.transform = `translate3d(${centerOffset + liveOffset * slideGap}px, 0, ${distance ? -500 * distance : 0}px) scale(${distance ? 0.86 : 1})`;
      });
    };

    const finishDrag = () => {
      if (!isDragging) return;
      const threshold = Math.min(90, Math.max(42, (slides[activeIndex]?.getBoundingClientRect().width || 260) * 0.18));
      const direction = Math.abs(dragDeltaX) > threshold ? (dragDeltaX < 0 ? 1 : -1) : 0;
      isDragging = false;
      dragStartX = 0;
      dragDeltaX = 0;
      render(activeIndex + direction);
      start();
    };

    prevAreas.forEach((button) => {
      button.addEventListener('click', () => render(activeIndex - 1));
      button.addEventListener('mouseenter', () => {
        stop();
        timerId = window.setInterval(() => render(activeIndex - 1), 1000);
      });
      button.addEventListener('mouseleave', start);
    });

    nextAreas.forEach((button) => {
      button.addEventListener('click', () => render(activeIndex + 1));
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
      dragStartX = event.clientX;
      dragDeltaX = 0;
      stop();
      host.setPointerCapture?.(event.pointerId);
    });
    host.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      dragDeltaX = event.clientX - dragStartX;
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

  document.querySelectorAll('.content-slider, .w-slider').forEach(initContentSlider);
  document.querySelectorAll('.swiper-component').forEach(initReviewCarousel);
});
