/**
 * Portfolio JavaScript
 * Handles animations, interactions, and smooth scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFAQ();
    initDataFlowAnimation();
    initThemeToggle();
    initGallery();
});

/**
 * Photography lightbox - click a tile to view the full image.
 * Skips tiles whose image hasn't loaded (placeholder state), so empty
 * tiles never open a broken lightbox.
 */
function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>' +
        '<img alt="">' +
        '<p class="lightbox-caption"></p>';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('.lightbox-caption');

    const close = () => {
        lb.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    lb.addEventListener('click', (e) => {
        if (e.target === lb || e.target.classList.contains('lightbox-close')) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const full = item.getAttribute('data-full');
            // don't open a lightbox for a placeholder (no file yet)
            if (!full || (img && img.classList.contains('img-failed'))) return;
            lbImg.src = full;
            lbCap.textContent = item.getAttribute('data-caption') || '';
            lb.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        });
    });
}

/**
 * Tabbed navigation — show one panel at a time instead of one long scroll.
 * The active tab is chosen by the URL hash (so links are deep-linkable and
 * back/forward work); everything else stays hidden.
 */
function initTabs() {
    const panels = document.querySelectorAll('.tab-panel');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const navbar = document.querySelector('.navbar');
    if (!panels.length) return;

    // Replay the reveal cascade each time a panel is shown.
    function playReveals(panel) {
        const groups = new Map();
        panel.querySelectorAll('.reveal').forEach(el => {
            const g = el.parentElement;
            const i = groups.get(g) || 0;
            el.style.setProperty('--reveal-i', i);
            groups.set(g, i + 1);
            el.classList.remove('is-visible');
        });
        requestAnimationFrame(() => requestAnimationFrame(() => {
            panel.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        }));
    }

    function show(id) {
        let target = document.getElementById(id);
        if (!target || !target.classList.contains('tab-panel')) {
            target = document.getElementById('home');
            id = 'home';
        }
        panels.forEach(p => p.classList.toggle('active', p === target));
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        playReveals(target);
        window.scrollTo(0, 0);
    }

    // Intercept any in-page link that targets a tab (nav, logo, hero CTAs).
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.length < 2) return;
            const id = href.slice(1);
            const t = document.getElementById(id);
            if (t && t.classList.contains('tab-panel')) {
                e.preventDefault();
                if (location.hash !== `#${id}`) {
                    history.pushState(null, '', `#${id}`);
                }
                show(id);
            }
        });
    });

    // Back/forward navigation between tabs.
    window.addEventListener('popstate', () => show((location.hash || '#home').slice(1)));

    // Subtle navbar shadow once a (tall) panel is scrolled.
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.pageYOffset > 20
            ? '0 2px 20px rgba(0, 0, 0, 0.1)'
            : 'none';
    });

    show((location.hash || '#home').slice(1));
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

/**
 * Scroll Animations - Fade in elements on scroll
 */
function initScrollAnimations() {
    const revealEls = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Assign a per-group stagger index so siblings cascade in.
    // Grouping by parent keeps each row/section starting from 0.
    const groupCounters = new Map();
    revealEls.forEach(el => {
        const group = el.parentElement;
        const i = groupCounters.get(group) || 0;
        el.style.setProperty('--reveal-i', i);
        groupCounters.set(group, i + 1);
        observer.observe(el);
    });
}

/**
 * Smooth Scrolling for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Data Flow Animation - Interactive nodes
 */
function initDataFlowAnimation() {
    const nodes = document.querySelectorAll('.node');

    nodes.forEach((node) => {
        // Interactive hover effect — tint with the current brand accent
        node.addEventListener('mouseenter', () => {
            const accent = getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-rgb').trim() || '16, 185, 129';
            node.style.borderColor = 'var(--color-accent)';
            node.style.background = `rgba(${accent}, 0.06)`;
        });

        node.addEventListener('mouseleave', () => {
            node.style.borderColor = '';
            node.style.background = '';
        });
    });

    // Animate connection lines
    animateConnections();
}

/**
 * Animate the SVG connection lines
 */
function animateConnections() {
    const lines = document.querySelectorAll('.connection-line');

    lines.forEach((line, index) => {
        // Add different animation delays
        line.style.animationDelay = `${index * 0.5}s`;
    });
}

/**
 * Typing effect for hero text (optional enhancement)
 */
function initTypingEffect(element, text, speed = 100) {
    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

/**
 * Counter animation for statistics (if needed)
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Theme toggle (for manual dark mode switch)
 */
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme preference (falls back to system preference)
function loadThemePreference() {
    let theme = localStorage.getItem('theme');
    if (theme !== 'light' && theme !== 'dark') {
        theme = 'light';  // light-first, like the reference
    }
    document.documentElement.setAttribute('data-theme', theme);
}

// Wire up the nav theme-toggle button
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', toggleTheme);
}

// Initialize theme on load (inline <head> script sets it first to avoid flash)
loadThemePreference();

/**
 * Console greeting for developers
 */
console.log(`
%c  Data Engineer Portfolio
%c  Built with care using vanilla JS & Python

  Interested in the code?
  Check out the GitHub repo!

`, 'color: #b8860b; font-size: 16px; font-weight: bold;', 'color: #666;');
