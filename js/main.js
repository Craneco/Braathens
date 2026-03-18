/* =========================================
   Buss & Vogntogskolen AS – Main JS
   ========================================= */

(function () {
  'use strict';

  // ---- Sticky header shadow on scroll ----
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile hamburger ----
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  const observerOptions = { rootMargin: '-40% 0px -50% 0px' };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('nav__link--active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ---- Scroll-in animations ----
  const animatedEls = document.querySelectorAll(
    '.feature-card, .kurs-card, .step, .team-card, .testimonial'
  );

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Stagger children inside grid
  animatedEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    el.classList.add('anim-hidden');
    animObserver.observe(el);
  });

  // ---- Counter animation for hero stats ----
  const stats = document.querySelectorAll('.stat__number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const suffix = raw.replace(/[\d.]/g, '');
      const target = parseFloat(raw);
      const duration = 1600;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const isInt = Number.isInteger(target);

      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
        if (current >= target) clearInterval(timer);
      }, step);

      statsObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => statsObserver.observe(s));

  // ---- Contact form ----
  const form = document.getElementById('kontakt-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sender...';

      // Simulate async send
      setTimeout(() => {
        successMsg.hidden = false;
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send henvendelse';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 900);
    });
  }

  // ---- Smooth scroll offset for fixed header ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
