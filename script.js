/* ========================================================
   PearlCare Dental — script.js
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: scroll behaviour ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── 2. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ── 3. REVEAL ON SCROLL (IntersectionObserver) ── */
  const revealItems = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));

  /* ── 4. COUNTER ANIMATION ── */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const startTime = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsSection = document.getElementById('stats');
  let countersStarted = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-num[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count));
      });
    }
  }, { threshold: 0.3 });
  if (statsSection) statsObserver.observe(statsSection);

  /* ── 5. FAQ ACCORDION ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
      });
      // Open clicked if it wasn't open
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 6. FORM VALIDATION & SUBMISSION ── */
  const form = document.getElementById('consultForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{7,}$/.test(phone.trim());
  }
  function showError(field, message) {
    field.classList.add('error');
    const err = field.closest('.field').querySelector('.err-msg');
    if (err) err.textContent = message;
  }
  function clearError(field) {
    field.classList.remove('error');
    const err = field.closest('.field').querySelector('.err-msg');
    if (err) err.textContent = '';
  }

  // Live clear on input
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const service = document.getElementById('service');

    if (!fname.value.trim()) { showError(fname, 'Please enter your first name'); valid = false; }
    if (!lname.value.trim()) { showError(lname, 'Please enter your last name'); valid = false; }
    if (!email.value.trim()) {
      showError(email, 'Please enter your email'); valid = false;
    } else if (!validateEmail(email.value)) {
      showError(email, 'Please enter a valid email address'); valid = false;
    }
    if (!phone.value.trim()) {
      showError(phone, 'Please enter your phone number'); valid = false;
    } else if (!validatePhone(phone.value)) {
      showError(phone, 'Please enter a valid phone number'); valid = false;
    }
    if (!service.value) { showError(service, 'Please select a treatment you\'re interested in'); valid = false; }

    if (!valid) return;

    // Simulate submission
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-text').classList.add('hidden');
    submitBtn.querySelector('.btn-loader').classList.remove('hidden');

    await new Promise(resolve => setTimeout(resolve, 1800));

    form.classList.add('hidden');
    formSuccess.classList.remove('hidden');

    // Scroll to form card on mobile
    document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ── 7. SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 8. TESTIMONIAL DOTS (mobile carousel) ── */
  const dots = document.querySelectorAll('.dot');
  const cards = document.querySelectorAll('.t-card');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      // On mobile: hide all, show only selected
      if (window.innerWidth <= 768) {
        cards.forEach((c, i) => {
          c.style.display = i === index ? 'block' : 'none';
        });
      }
    });
  });

  // Set up mobile testimonials on resize
  function setupMobileTestimonials() {
    if (window.innerWidth <= 768) {
      cards.forEach((c, i) => {
        c.style.display = i === 0 ? 'block' : 'none';
      });
      dots[0].classList.add('active');
      dots.forEach(d => d.classList.remove('active'));
      dots[0].classList.add('active');
    } else {
      cards.forEach(c => c.style.display = '');
    }
  }
  setupMobileTestimonials();
  window.addEventListener('resize', setupMobileTestimonials, { passive: true });

  /* ── 9. STICKY CTA BAR: hide when form is visible ── */
  const stickyCta = document.getElementById('stickyCta');
  const bookingForm = document.getElementById('booking-form');
  const stickyObserver = new IntersectionObserver((entries) => {
    stickyCta.style.opacity = entries[0].isIntersecting ? '0' : '1';
    stickyCta.style.pointerEvents = entries[0].isIntersecting ? 'none' : 'auto';
  }, { threshold: 0.2 });
  if (bookingForm) stickyObserver.observe(bookingForm);

  /* ── 10. SUBTLE PARALLAX on hero background ── */
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.getElementById('hero');
    if (hero && scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = `${scrolled * 0.25}px`;
    }
  }, { passive: true });

});