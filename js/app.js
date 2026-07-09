/**
 * Troy Amadeo Tania — Portfolio Interactions
 * Theme toggle, parallax, ripple, sounds, gallery, scroll reveal
 */

(function () {
  'use strict';

  /* ---- Audio Engine (Web Audio API) ---- */
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playBackgroundSound() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }

  function playButtonSound() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.16);
  }

  /* ---- Theme Toggle ---- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    playButtonSound();
  });

  /* ---- Ripple Effect on Background Click ---- */
  const rippleContainer = document.getElementById('ripple-container');

  document.addEventListener('click', (e) => {
    const isButton = e.target.closest('.btn-sound, .btn, .nav-link, .gallery-btn, .gallery-dot, a, button');

    if (isButton) {
      playButtonSound();
      return;
    }

    playBackgroundSound();

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.width = '60px';
    ripple.style.height = '60px';
    rippleContainer.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  });

  /* ---- Mobile Menu ---- */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    playButtonSound();
  });

  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ---- Navbar Scroll ---- */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ---- Active Nav Link ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinkEls.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  /* ---- Parallax Scrolling ---- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.05;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll(
    '.section-header, .about-card, .info-card, .project-card, .skills-category, .timeline-item, .contact-card'
  );

  revealEls.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---- Project Gallery ---- */
  const galleries = {
    unperson: {
      track: document.getElementById('gallery-unperson'),
      dots: document.getElementById('dots-unperson'),
      current: 0,
    },
    'unperson-vr': {
      track: document.getElementById('gallery-unperson-vr'),
      dots: document.getElementById('dots-unperson-vr'),
      current: 0,
    },
  };

  function initGallery(name) {
    const gallery = galleries[name];
    if (!gallery || !gallery.track) return;

    const slides = gallery.track.querySelectorAll('.gallery-slide');
    gallery.total = slides.length;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
      dot.addEventListener('click', () => {
        goToSlide(name, i);
        playButtonSound();
      });
      gallery.dots.appendChild(dot);
    });

    setInterval(() => {
      goToSlide(name, (gallery.current + 1) % gallery.total);
    }, 5000);
  }

  function goToSlide(name, index) {
    const gallery = galleries[name];
    if (!gallery) return;

    const slides = gallery.track.querySelectorAll('.gallery-slide');
    const dots = gallery.dots.querySelectorAll('.gallery-dot');

    gallery.current = index;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  document.querySelectorAll('.gallery-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-gallery');
      const dir = parseInt(btn.getAttribute('data-dir'), 10);
      const gallery = galleries[name];
      if (!gallery) return;

      const next = (gallery.current + dir + gallery.total) % gallery.total;
      goToSlide(name, next);
      playButtonSound();
    });
  });

  initGallery('unperson');
  initGallery('unperson-vr');

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---- Init Audio on first interaction ---- */
  document.addEventListener(
    'click',
    () => {
      getAudioContext();
    },
    { once: true }
  );
})();
