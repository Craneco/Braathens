/* =========================================
   Buss & Vogntogskolen AS – Main JS v2
   ========================================= */
(function () {
  'use strict';

  // ---- Sticky header ----
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ---- Hamburger / mobile nav ----
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('.nav__link').forEach(l =>
    l.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    })
  );
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- Kurs tabs ----
  const tabs = document.querySelectorAll('.kurs-tab');
  const panels = document.querySelectorAll('.kurs-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) {
        target.classList.add('active');
        // Re-trigger animations for newly shown cards
        target.querySelectorAll('.anim').forEach(el => {
          el.classList.remove('in');
          setTimeout(() => el.classList.add('in'), 50);
        });
      }
    });
  });

  // ---- Scroll-in animations ----
  const animEls = document.querySelectorAll(
    '.kk, .feat, .ps, .hcard, .ki, .visual-card--float, .b-feat, .logo-tile'
  );
  animEls.forEach(el => el.classList.add('anim'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Stagger siblings
  document.querySelectorAll('.kurs-grid, .prosess-steps, .om-oss__feats, .bedrift-feats, .logo-tiles').forEach(parent => {
    [...parent.children].forEach((child, i) => {
      if (child.classList.contains('anim')) {
        child.style.transitionDelay = `${i * 70}ms`;
      }
    });
  });

  animEls.forEach(el => io.observe(el));

  // ---- Back to top ----
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- Smooth scroll with header offset ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  // ---- Contact form ----
  const form = document.getElementById('kontakt-form');
  const successMsg = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sender…';
      setTimeout(() => {
        successMsg.hidden = false;
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Send henvendelse';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 800);
    });
  }

  // ---- Active nav highlight on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(l => l.classList.toggle('nav__link--active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' }).observe && sections.forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach(l => l.classList.toggle('nav__link--active', l.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' }).observe(s);
  });

})();
