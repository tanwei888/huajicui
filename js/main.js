/* ============================
   花肌粹 FLOWER'YLAND - 主脚本
   ============================ */

'use strict';

// DOM 就绪
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimation();
    initCounter();
    initContactForm();
    initPetals();
});

/* ============================
   导航栏
   ============================ */
function initNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动检测
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;

        // 高亮当前 section
        updateActiveNav();
    });

    // 汉堡菜单
    hamburger?.addEventListener('click', () => {
        header.classList.toggle('nav-open');
    });

    // 导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-open');
        });
    });

    // 高亮当前 section
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ============================
   滚动动画
   ============================ */
function initScrollAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 添加延迟，支持 staggered 动画
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));

    // 给 grid 子项添加延迟
    document.querySelectorAll('.products-grid .product-card').forEach((el, i) => {
        el.dataset.delay = i * 100;
    });

    document.querySelectorAll('.philosophy-grid .phil-card').forEach((el, i) => {
        el.dataset.delay = i * 100;
    });

    document.querySelectorAll('.stats-grid .stat-item').forEach((el, i) => {
        el.dataset.delay = i * 150;
    });
}

/* ============================
   数字递增动画
   ============================ */
function initCounter() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2s
    const step = Math.max(1, Math.floor(target / 60));
    const increment = target > 0 ? step : 1;

    function update() {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = current;
        requestAnimationFrame(() => setTimeout(update, 30));
    }

    // 最后一个（有害添加 0%）特殊处理
    if (target === 0) {
        element.textContent = '0';
        return;
    }

    update();
}

/* ============================
   花瓣飘落效果
   ============================ */
function initPetals() {
    const container = document.querySelector('.hero-petals');
    if (!container) return;

    const petalEmojis = ['🌸', '🌿', '🌺', '🍃', '✨'];

    // 创建更多花瓣
    for (let i = 0; i < 8; i++) {
        const petal = document.createElement('div');
        petal.textContent = petalEmojis[i % petalEmojis.length];
        petal.style.cssText = `
            position: absolute;
            font-size: ${1 + Math.random() * 1.5}rem;
            left: ${Math.random() * 100}%;
            top: -10%;
            opacity: ${0.3 + Math.random() * 0.4};
            animation: petalFall ${10 + Math.random() * 15}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
            pointer-events: none;
        `;
        container.appendChild(petal);
    }
}

/* ============================
   联系表单
   ============================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-submit');
        const originalText = btn.textContent;

        btn.textContent = '发送中...';
        btn.disabled = true;

        // 模拟发送
        setTimeout(() => {
            btn.textContent = '✓ 已发送';
            btn.style.background = 'linear-gradient(135deg, #5A7E5E, #7A9D7E)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                form.reset();
            }, 2500);
        }, 1500);
    });

    // 输入框自动调整高度
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
        });
    });
}

/* ============================
   滚动时视差效果 (可选)
   ============================ */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-visual');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
});
