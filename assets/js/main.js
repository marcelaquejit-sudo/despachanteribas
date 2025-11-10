(() => {
  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

  // Header shrink
  const header = $('header.site');
  if (header) {
    const onScrollHeader = () => header.classList.toggle('shrink', window.scrollY > 8);
    document.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  // Mobile menu
  const burger = $('.burger');
  const panel  = $('#mobile-panel');
  if (burger && panel) {
    const openPanel = () => {
      panel.hidden = false;
      panel.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('no-scroll');
    };
    const closePanel = () => {
      panel.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('no-scroll');
      setTimeout(() => { if (!panel.classList.contains('open')) panel.hidden = true; }, 230);
    };
    closePanel();
    burger.addEventListener('click', () =>
      panel.classList.contains('open') ? closePanel() : openPanel()
    );
    panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
    $$('.drawer a', panel).forEach(a => a.addEventListener('click', closePanel));
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', () => panel.classList.remove('open')));
  }

  // Reveal on Scroll
  const reveals = $$('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    reveals.forEach(el => io.observe(el));
  }

  // Counters
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = $$('.metric .num[data-counter]');
  if (counters.length) {
    const ioNum = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const end    = parseInt(el.getAttribute('data-counter'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        if (reduceMotion) { el.textContent = end + suffix; ioNum.unobserve(el); return; }

        const startTime = performance.now();
        const duration  = 1200 + Math.random() * 600;

        const tick = (now) => {
          const t = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          el.textContent = Math.floor(end * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        ioNum.unobserve(el);
      });
    }, { threshold: .5 });
    counters.forEach(n => ioNum.observe(n));
  }
})();