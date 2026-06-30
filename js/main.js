/* ============================
   花肌粹 FLOWER'YLAND - 主脚本
   ============================ */

'use strict';

// 当前语言
let currentLang = localStorage.getItem('floweryland-lang') || 'en';

// DOM 就绪
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initNavigation();
    initScrollAnimation();
    initCounter();
    initContactForm();
    initPetals();
    applyTranslation(currentLang);
});

/* ============================
   语言切换
   ============================ */
function initLanguage() {
    const langBtns = document.querySelectorAll('.lang-btn');

    // 设置初始状态
    langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // 切换事件
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang === currentLang) return;

            currentLang = lang;
            localStorage.setItem('floweryland-lang', lang);

            // 更新按钮状态
            langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

            // 应用翻译
            applyTranslation(lang);

            // 更新 HTML lang 属性
            document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

            // 更新字体 —— 英文切无衬线，中文切衬线
            document.documentElement.style.setProperty(
                '--font-cn',
                lang === 'zh'
                    ? "'Noto Serif SC', 'STSong', serif"
                    : "'Outfit', 'Helvetica Neue', sans-serif"
            );
        });
    });
}

function applyTranslation(lang) {
    const dict = translations[lang] || translations['zh'];

    // 翻译 data-i18n 文本元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // 翻译 placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (dict[key]) {
            el.placeholder = dict[key];
        }
    });

    // 更新页面标题
    if (dict['site_title']) {
        document.title = dict['site_title'];
    }

    // 触发自定义事件，让其他模块知道语言变了
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/* ============================
   导航栏
   ============================ */
function initNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动检测
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

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
    if (target === 0) {
        element.textContent = '0';
        return;
    }

    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));

    function update() {
        current += step;
        if (current >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = current;
        requestAnimationFrame(() => setTimeout(update, 30));
    }

    update();
}

/* ============================
   花瓣飘落效果（极简版 - 空函数保留兼容）
   ============================ */
function initPetals() {
    // 极简风格下不启用飘落效果
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
        const originalText = btn.innerHTML;

        const sendingText = currentLang === 'zh' ? '发送中...' : 'Sending...';
        const sentText = currentLang === 'zh' ? '✓ 已发送' : '✓ Sent';

        btn.innerHTML = sendingText;
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = sentText;
            btn.style.background = 'linear-gradient(135deg, #5A7E5E, #7A9D7E)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
                form.reset();

                // 重置 placeholder 翻译
                applyTranslation(currentLang);
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
   视差效果（极简版 - 不启用）
   ============================ */
