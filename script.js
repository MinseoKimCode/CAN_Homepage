/* =======================================
   CAN - Computer Algorithm Network
   script.js
======================================= */

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navItems = navLinks.querySelectorAll('a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

/* ── CANVAS PARTICLE BACKGROUND ── */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

function randomBetween(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = randomBetween(0, canvas.width);
    this.y = randomBetween(0, canvas.height);
    this.vx = randomBetween(-0.3, 0.3);
    this.vy = randomBetween(-0.3, 0.3);
    this.r = randomBetween(1, 2.5);
    this.alpha = randomBetween(0.2, 0.7);
    const colors = ['108,99,255', '0,212,255', '255,101,132'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(80, Math.floor(canvas.width / 16));
  particles = Array.from({ length: count }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const alpha = (1 - dist / 140) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Stop animation when hero is off screen (performance)
const heroSection = document.getElementById('home');
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!animId) animateParticles();
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  });
}, { threshold: 0.1 });
heroObserver.observe(heroSection);

/* ── TYPING EFFECT ── */
const phrases = ['CAN', 'Code.', 'Algo.', 'Hack.', 'Build.', 'Win.'];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 80 : 120;

  if (!isDeleting && charIdx === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 300;
  }
  setTimeout(type, delay);
}
type();

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(animateCounter);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

/* ── ACTIVITY CARDS SCROLL ANIMATION ── */
const activityCards = document.querySelectorAll('.activity-card[data-aos]');
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
activityCards.forEach(card => cardObserver.observe(card));

/* ── GALLERY FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const cat = item.dataset.category;
      if (filter === 'all' || cat === filter) {
        item.style.display = '';
        item.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

/* ── CONTACT FORM: Firebase 모듈(firebase-form.js)에서 처리 ── */

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── TOAST ── */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── CODE CARD TILT ── */
const aboutCard = document.querySelector('.about-card');
if (aboutCard) {
  const wrap = aboutCard.closest('.about-card-wrap');
  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    aboutCard.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    aboutCard.style.transform = '';
  });
}

/* ── IMAGE PROTECTION ── */
document.querySelectorAll('img').forEach(img => {
  // 우클릭 차단
  img.addEventListener('contextmenu', e => e.preventDefault());
  // 드래그 저장 차단
  img.addEventListener('dragstart', e => e.preventDefault());
  // 모바일 길게 누르기 차단
  img.addEventListener('touchstart', e => { if (e.cancelable) e.preventDefault(); }, { passive: false });
});

/* ── NOTICE MODAL ── */
const noticeOverlay = document.getElementById('noticeOverlay');
const modalBadgeEl  = document.getElementById('modalBadge');
const modalDateEl   = document.getElementById('modalDate');
const modalTitleEl  = document.getElementById('modalTitle');
const modalBodyEl   = document.getElementById('modalBody');

function openNoticeModal(item) {
  const badge  = item.querySelector('.notice-badge');
  const title  = item.querySelector('h4').textContent;
  const date   = item.querySelector('.notice-date').textContent;
  const detail = item.querySelector('.notice-detail');

  modalBadgeEl.innerHTML  = badge.innerHTML;
  modalBadgeEl.className  = badge.className.replace('notice-badge', 'modal-badge notice-badge');
  modalDateEl.textContent = date;
  modalTitleEl.textContent = title;
  modalBodyEl.innerHTML   = detail ? detail.innerHTML : `<p>${item.querySelector('p').textContent}</p>`;

  noticeOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  lucide.createIcons({ nodes: [modalBadgeEl, document.getElementById('modalClose')] });
}

function closeNoticeModal() {
  noticeOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.notice-item').forEach(item => {
  item.addEventListener('click', () => openNoticeModal(item));
});
document.getElementById('modalClose').addEventListener('click', closeNoticeModal);
noticeOverlay.addEventListener('click', e => { if (e.target === noticeOverlay) closeNoticeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNoticeModal(); });

/* ── REVEAL SECTIONS ── */
const sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });
sections.forEach(sec => {
  sec.style.opacity = '0';
  sec.style.transform = 'translateY(24px)';
  sec.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  sectionObserver.observe(sec);
});
