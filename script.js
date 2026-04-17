/* ============================================================
   Penn Sharp Dental Surgeons — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. SCROLL PROGRESS BAR ── */
  const scrollBar = document.getElementById('scrollBar');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollBar) scrollBar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });

  /* ── 2. NAVBAR scroll state ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── 3. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ── 4. CUSTOM CURSOR ── */
  // const cursor = document.getElementById('cursor');
  // const cursorDot = document.getElementById('cursorDot');
  // let mx = -100, my = -100, cx = -100, cy = -100;

  // document.addEventListener('mousemove', e => {
  //   mx = e.clientX; my = e.clientY;
  //   cursorDot.style.left = mx + 'px';
  //   cursorDot.style.top  = my + 'px';
  // });
  // function animateCursor() {
  //   cx += (mx - cx) * 0.12;
  //   cy += (my - cy) * 0.12;
  //   cursor.style.left = cx + 'px';
  //   cursor.style.top  = cy + 'px';
  //   requestAnimationFrame(animateCursor);
  // }
  // animateCursor();

  // document.querySelectorAll('a, button, .svc-card, .tcard, .doc-card, .faq-q').forEach(el => {
  //   el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  //   el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  // });

  /* ── 5. HERO HEADLINE word-stagger ── */
  function fireWords() {
    document.querySelectorAll('.hw').forEach((w, i) => {
      setTimeout(() => w.classList.add('in'), 100 + i * 120);
    });
  }
  if (document.readyState === 'complete') { fireWords(); }
  else { window.addEventListener('load', fireWords); }

  /* ── 6. SCROLL REVEAL ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('revealed'), delay);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ── 7. COUNTER ANIMATION ── */
  function countUp(el, target, dur = 1800) {
    const ease = t => 1 - Math.pow(1 - t, 3);
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(ease(p) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  let counted = false;
  const statsObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.sn[data-count]').forEach(el => {
        countUp(el, parseInt(el.dataset.count));
      });
    }
  }, { threshold: 0.3 });
  const statsEl = document.getElementById('stats');
  if (statsEl) statsObs.observe(statsEl);

  /* ── 8. FAQ ACCORDION ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 9. FORM VALIDATION ── */
  const form = document.getElementById('consultForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRE = /^[\d\s\+\-\(\)]{7,}$/;

  function showErr(input, msg) {
    input.classList.add('error');
    const e = input.closest('.field')?.querySelector('.err');
    if (e) e.textContent = msg;
  }
  function clearErr(input) {
    input.classList.remove('error');
    const e = input.closest('.field')?.querySelector('.err');
    if (e) e.textContent = '';
  }
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => clearErr(el));
    el.addEventListener('change', () => clearErr(el));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    const fname   = document.getElementById('fname');
    const lname   = document.getElementById('lname');
    const email   = document.getElementById('email');
    const phone   = document.getElementById('phone');
    const service = document.getElementById('service');

    if (!fname.value.trim())  { showErr(fname,   'Please enter your first name'); ok = false; }
    if (!lname.value.trim())  { showErr(lname,   'Please enter your last name');  ok = false; }
    if (!email.value.trim())  { showErr(email,   'Please enter your email');       ok = false; }
    else if (!emailRE.test(email.value)) { showErr(email, 'Please enter a valid email'); ok = false; }
    if (!phone.value.trim())  { showErr(phone,   'Please enter your phone number'); ok = false; }
    else if (!phoneRE.test(phone.value)) { showErr(phone, 'Please enter a valid number'); ok = false; }
    if (!service.value)       { showErr(service, 'Please select a treatment');     ok = false; }
    if (!ok) return;

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-txt').classList.add('hidden');
    submitBtn.querySelector('.btn-spin').classList.remove('hidden');

    await new Promise(r => setTimeout(r, 1800)); // simulate

    form.classList.add('hidden');
    formSuccess.classList.remove('hidden');
    document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ── 10. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 11. PARALLAX on hero image ── */
  const heroBgImg = document.getElementById('heroBgImg');
  window.addEventListener('scroll', () => {
    if (heroBgImg && window.scrollY < window.innerHeight * 1.2) {
      heroBgImg.style.transform = `scale(1.08) translateX(-1.5%) translateY(calc(-1% + ${window.scrollY * 0.1}px))`;
    }
  }, { passive: true });

  /* ── 12. FLOAT BAR: hide when hero form visible ── */
  const floatBar = document.getElementById('floatBar');
  const bookForm = document.getElementById('booking-form');
  if (floatBar && bookForm) {
    new IntersectionObserver(([e]) => {
      floatBar.style.opacity = e.isIntersecting ? '0' : '1';
      floatBar.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
    }, { threshold: 0.2 }).observe(bookForm);
  }

  /* ── 13. SERVICE CARD tilt effect ── */
  document.querySelectorAll('.svc-card:not(.svc-emergency)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2)  / (r.width / 2);
      const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });

  /* ── 14. NAV active link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--gold)' : '';
    });
  }, { passive: true });

});