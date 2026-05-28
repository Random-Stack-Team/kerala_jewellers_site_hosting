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
    const wrapper = component.querySelector('.swiper-wrapper');
    const slides = Array.from(component.querySelectorAll('.swiper-slide'));
    if (!wrapper || slides.length <= 1) return;

    component.dataset.kjSwiperReady = 'true';
    let activeIndex = 0;
    let timerId = 0;
    const host = component.closest('.slider-wrapper') || component;
    const prevAreas = host.querySelectorAll('.area-prev, .cc-prev');
    const nextAreas = host.querySelectorAll('.area-next, .cc-next');

    const render = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      const stage = component.querySelector('.swiper') || component;
      const stageWidth = stage.getBoundingClientRect().width || 1200;
      const slideWidth = Math.max(220, stageWidth * 0.2);
      const centerOffset = (stageWidth - slideWidth) / 2;
      const slideGap = slideWidth * 1.72;
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
        slide.style.transform = `translate3d(${centerOffset + clampedOffset * slideGap}px, 0, ${distance ? -500 * distance : 0}px) scale(${distance ? 0.86 : 1})`;
        slide.style.opacity = distance > 1 ? '0.55' : '1';
        slide.style.zIndex = String(10 - distance);
        slide.style.pointerEvents = slideIndex === activeIndex ? 'auto' : 'none';
      });
      wrapper.style.minHeight = '600px';
    };

    const stop = () => window.clearInterval(timerId);
    const start = () => {
      stop();
      if (!prefersReducedMotion) timerId = window.setInterval(() => render(activeIndex + 1), 4500);
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
    window.addEventListener('resize', () => render(activeIndex));
    render(0);
    start();
  };

  document.querySelectorAll('.content-slider, .w-slider').forEach(initContentSlider);
  document.querySelectorAll('.swiper-component').forEach(initReviewCarousel);
});
