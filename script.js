// ===== Scroll Reveal — bidirectional =====
const heroEls = new Set();
document.querySelectorAll('.hero .reveal').forEach(el => heroEls.add(el));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const el = entry.target;
        if (heroEls.has(el)) return; // hero handled separately
        if (entry.isIntersecting) {
            el.classList.remove('exit');
            el.classList.add('visible');
            el._hasSeen = true;
        } else if (el._hasSeen) {
            el.classList.remove('visible');
            el.classList.add('exit');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-card').forEach(el => revealObserver.observe(el));

// ===== Hero stagger on load =====
window.addEventListener('load', () => {
    const heroEls = document.querySelectorAll('.hero .reveal');
    heroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 80 + i * 130);
    });
});

// ===== Number counter animation =====
function animateCount(el, target) {
    if (target === 0) { el.textContent = 0; return; }
    const duration = 1800;
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            animateCount(el, parseInt(el.dataset.target));
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-n[data-target]').forEach(el => statObserver.observe(el));

// ===== FAQ accordion =====
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-a');
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        // Close all others
        document.querySelectorAll('.faq-q').forEach(b => {
            b.setAttribute('aria-expanded', 'false');
            b.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
        });

        // Toggle current
        if (!isOpen) {
            btn.setAttribute('aria-expanded', 'true');
            answer.classList.add('open');
        }
    });
});

// ===== CTA glow follows cursor =====
const ctaSection = document.querySelector('.cta-section');
const ctaGlow = document.querySelector('.cta-glow');

if (ctaSection && ctaGlow) {
    ctaSection.addEventListener('mousemove', (e) => {
        const rect = ctaSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctaGlow.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    });

    ctaSection.addEventListener('mouseleave', () => {
        ctaGlow.style.transition = 'transform 0.8s ease';
        ctaGlow.style.transform = 'translate(-50%, -50%)';
    });

    ctaSection.addEventListener('mouseenter', () => {
        ctaGlow.style.transition = 'transform 0.12s linear';
    });
}

// ===== Method card 3D tilt =====
document.querySelectorAll('.method-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) scale(1.01) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
        card.style.transition = 'transform 0.1s linear, border-left-color 0.25s ease, box-shadow 0.35s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), border-left-color 0.25s ease, box-shadow 0.35s ease';
    });
});

// ===== Nav scroll behavior =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50
        ? 'rgba(13, 17, 23, 0.96)'
        : 'rgba(13, 17, 23, 0.85)';
}, { passive: true });

// ===== Scroll progress bar =====
const scrollBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    scrollBar.style.width = (scrolled * 100) + '%';
}, { passive: true });

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
