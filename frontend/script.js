/* =============================================
   ZENPHIRA — script.js
   ============================================= */

'use strict';

/* ── Preloader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    // Remove from DOM after fade
    setTimeout(() => preloader.remove(), 900);
  }, 2200);
});

/* ── Custom Cursor ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
const hoverTargets = document.querySelectorAll('a, button, input, .product-card, .feature-card, .slider-btn');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ── Navbar on Scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Hero Particles ── */
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const colors = [
    'rgba(242,196,206,VAR)',
    'rgba(181,201,176,VAR)',
    'rgba(237,224,212,VAR)',
    'rgba(201,169,110,VAR)',
  ];
  const count = 22;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size  = Math.random() * 14 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const op    = (Math.random() * 0.4 + 0.15).toFixed(2);
    const dur   = (Math.random() * 10 + 8).toFixed(1);
    const delay = (Math.random() * -14).toFixed(1);
    const left  = (Math.random() * 100).toFixed(1);
    const top   = (Math.random() * 100).toFixed(1);

    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color.replace('VAR', op)};
      left:${left}%;
      top:${top}%;
      --dur:${dur}s;
      --delay:${delay}s;
      --op:${op};
      animation-delay:${delay}s;
      animation-duration:${dur}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ── Scroll Reveal ── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, i) => {
        if (sib === entry.target) delay = i * 100;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ── Testimonial Slider ── */
const track = document.getElementById('testimonial-track');
const dotsContainer = document.getElementById('slider-dots');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
let current = 0;
let autoTimer;

function buildDots() {
  if (!dotsContainer) return;
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
}

function goTo(idx) {
  current = (idx + cards.length) % cards.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
  resetTimer();
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

function resetTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(next, 5000);
}

document.getElementById('next-btn')?.addEventListener('click', next);
document.getElementById('prev-btn')?.addEventListener('click', prev);

buildDots();
resetTimer();

// Pause on hover
const slider = document.querySelector('.testimonial-slider');
slider?.addEventListener('mouseenter', () => clearInterval(autoTimer));
slider?.addEventListener('mouseleave', resetTimer);

// Touch/swipe
let touchStart = 0;
track?.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, { passive: true });
track?.addEventListener('touchend', e => {
  const diff = touchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
});

/* ── Smooth Scroll for Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Newsletter Form ── */
const form = document.getElementById('newsletter-form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const input = form.querySelector('input');
  const btn   = form.querySelector('button');
  const email = input.value.trim();
  if (!email) return;

  btn.textContent = '✓ You\'re glowing!';
  btn.style.background = 'linear-gradient(135deg, var(--sage-deep), #5a8c54)';
  input.value = '';
  input.disabled = true;
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Join the Glow ✦';
    btn.style.background = '';
    input.disabled = false;
    btn.disabled = false;
  }, 4000);
});

/* ── Add to Cart ripple ── */
document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      width:100px; height:100px;
      background:rgba(255,255,255,.35);
      border-radius:50%;
      top:${e.clientY - rect.top - 50}px;
      left:${e.clientX - rect.left - 50}px;
      transform:scale(0);
      animation:ripple .5s ease-out forwards;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    // Temporary feedback
    const orig = btn.textContent;
    btn.textContent = '✓ Added!';
    setTimeout(() => btn.textContent = orig, 1800);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform:scale(3); opacity:0; } }`;
document.head.appendChild(style);

/* ── Parallax subtle effect on hero ── */
const heroVisual = document.querySelector('.hero-visual');
const heroBlob   = document.querySelector('.hero-blob');

window.addEventListener('mousemove', e => {
  if (!heroVisual) return;
  const x = (e.clientX / window.innerWidth  - 0.5) * 22;
  const y = (e.clientY / window.innerHeight - 0.5) * 14;
  heroVisual.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  if (heroBlob) heroBlob.style.transform = `translate(calc(-50% + ${x * 0.6}px), calc(-50% + ${y * 0.6}px))`;
}, { passive: true });

/* ── Active nav link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === id || (href === 'features' && id === 'about')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── Quick View Modal ── */
const quickBtns = document.querySelectorAll('.btn-quick');
const modal = document.getElementById('quick-view-modal');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.getElementById('modal-overlay');

if (modal && quickBtns.length > 0) {
  quickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = e.target.closest('.product-card');
      if (!card) return;
      
      const imgSrc = card.querySelector('img').src;
      const cat = card.querySelector('.product-cat').textContent;
      const title = card.querySelector('h3').textContent;
      const price = card.querySelector('.product-price').textContent;
      const desc = card.querySelector('.product-info p').textContent;
      
      document.getElementById('modal-img').src = imgSrc;
      document.getElementById('modal-img').alt = title;
      document.getElementById('modal-cat').textContent = cat;
      document.getElementById('modal-title').textContent = title;
      document.getElementById('modal-price').textContent = price;
      document.getElementById('modal-desc').textContent = desc;
      
      document.getElementById('qty-value').textContent = '1';
      
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyVal = document.getElementById('qty-value');
  
  qtyMinus.addEventListener('click', () => {
    let v = parseInt(qtyVal.textContent);
    if (v > 1) qtyVal.textContent = v - 1;
  });
  qtyPlus.addEventListener('click', () => {
    let v = parseInt(qtyVal.textContent);
    qtyVal.textContent = v + 1;
  });
  
  const modalCartBtn = document.getElementById('modal-cart-btn');
  modalCartBtn.addEventListener('click', () => {
    const orig = modalCartBtn.textContent;
    modalCartBtn.textContent = '✓ Added!';
    setTimeout(() => modalCartBtn.textContent = orig, 1800);
  });
}
