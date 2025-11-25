// ============================================
// AI WEAPON SHOP - JAVASCRIPT
// ============================================

// ============================================
// VISITOR COUNTER (訪問者カウンター)
// ============================================
function initVisitorCounter() {
    const counterElement = document.getElementById('visitorCount');
    
    // LocalStorageから訪問者数を取得（グローバルカウント）
    let globalCount = localStorage.getItem('aiWeaponShop_globalVisitors');
    
    if (!globalCount) {
        // 初回訪問の場合、ランダムな開始値（リアリティのため）
        globalCount = Math.floor(Math.random() * 500) + 100;
    } else {
        globalCount = parseInt(globalCount);
    }
    
    // 訪問ごとにカウントアップ
    globalCount++;
    localStorage.setItem('aiWeaponShop_globalVisitors', globalCount);
    
    // カウントアップアニメーション
    animateCounter(counterElement, 0, globalCount, 2000);
}

// カウントアップアニメーション
function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end.toLocaleString('ja-JP');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('ja-JP');
        }
    }, 16);
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });
    
    // メニューリンクをクリックしたら閉じる
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.textContent = '☰';
        });
    });
    
    // 外側をクリックしたら閉じる
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.textContent = '☰';
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // "#"だけの場合は処理しない
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, 0, target, 2000);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ============================================
// CONTACT FORM HANDLING
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // ボタンを無効化
        submitBtn.disabled = true;
        submitBtn.innerHTML = '送信中...';
        
        // フォームデータを取得
        const formData = {
            name: form.name.value,
            email: form.email.value,
            category: form.category.value,
            message: form.message.value,
            timestamp: new Date().toISOString()
        };
        
        // LocalStorageに保存（実際の実装では、サーバーに送信）
        const submissions = JSON.parse(localStorage.getItem('aiWeaponShop_submissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('aiWeaponShop_submissions', JSON.stringify(submissions));
        
        // 送信完了メッセージ
        setTimeout(() => {
            alert('お問い合わせありがとうございます！\n\n内容を確認次第、ご連絡させていただきます。\n\n緊急の場合は公式LINEからもお問い合わせいただけます。');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
        
        // Google Analytics イベント送信（実装されている場合）
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'contact',
                'event_label': formData.category
            });
        }
    });
}

// ============================================
// CARD ANIMATIONS
// ============================================
function initCardAnimations() {
    const cards = document.querySelectorAll('.card, .tool-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 14, 39, 0.98)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(10, 14, 39, 0.9)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        }
        
        // ヘッダーの表示/非表示（オプション）
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// PARTICLE EFFECT (オプション - 軽量版)
// ============================================
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.3';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function init() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 画面外に出たら反対側に戻す
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // パーティクルを描画
            ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    resize();
    init();
    animate();
    
    window.addEventListener('resize', () => {
        resize();
        init();
    });
    
    // パフォーマンス最適化：タブが非表示の時はアニメーション停止
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// ============================================
// TOOL CARD CLICK TRACKING
// ============================================
function initToolTracking() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const link = card.querySelector('.card-link');
        if (link) {
            link.addEventListener('click', (e) => {
                const toolName = card.querySelector('.card-title').textContent;
                
                // LocalStorageにクリック記録
                const clicks = JSON.parse(localStorage.getItem('aiWeaponShop_toolClicks') || '{}');
                clicks[toolName] = (clicks[toolName] || 0) + 1;
                localStorage.setItem('aiWeaponShop_toolClicks', JSON.stringify(clicks));
                
                // Google Analytics イベント送信（実装されている場合）
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'tool_click', {
                        'event_category': 'tools',
                        'event_label': toolName
                    });
                }
            });
        }
    });
}

// ============================================
// EASTER EGG (隠し要素)
// ============================================
function initEasterEgg() {
    let konamiCode = [];
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === code.join(',')) {
            activateGodMode();
        }
    });
}

function activateGodMode() {
    // 特別なエフェクト
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    // レインボーアニメーション
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // メッセージ表示
    alert('GOD MODE ACTIVATED!\n\nあなたは真の訪問者です！\nLv.99達成おめでとうございます！');
    
    // プレミアム機能解放（デモ）
    localStorage.setItem('aiWeaponShop_godMode', 'true');
    
    // 3秒後に元に戻す
    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-gold), var(--accent-blue));
        border: none;
        color: var(--darker-bg);
        font-size: 1.5rem;
        font-weight: 700;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.pointerEvents = 'all';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.pointerEvents = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px) scale(1.1)';
        scrollBtn.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.6)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
        scrollBtn.style.boxShadow = '0 4px 20px rgba(255, 215, 0, 0.4)';
    });
}

// ============================================
// THEME COLOR TOGGLE
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const themes = [
        { name: 'gold', primary: '#FFD700', secondary: '#FFA500', accent: '#00D4FF' },
        { name: 'blue', primary: '#00D4FF', secondary: '#0088FF', accent: '#9D4EDD' },
        { name: 'purple', primary: '#9D4EDD', secondary: '#7209B7', accent: '#FF006E' },
        { name: 'green', primary: '#00FF88', secondary: '#00CC6A', accent: '#FFD700' },
        { name: 'red', primary: '#FF3366', secondary: '#FF0044', accent: '#FFD700' }
    ];
    
    let currentThemeIndex = parseInt(localStorage.getItem('aiWeaponShop_theme') || '0');
    
    function applyTheme(index) {
        const theme = themes[index];
        document.documentElement.style.setProperty('--primary-gold', theme.primary);
        document.documentElement.style.setProperty('--secondary-gold', theme.secondary);
        document.documentElement.style.setProperty('--accent-blue', theme.accent);
        
        // ボタンの色を更新
        themeToggle.style.borderColor = theme.primary;
        const before = themeToggle.querySelector('::before');
        if (before) {
            before.style.background = theme.primary;
        }
    }
    
    // 初期テーマを適用
    applyTheme(currentThemeIndex);
    
    // クリックでテーマ切り替え
    themeToggle.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        applyTheme(currentThemeIndex);
        localStorage.setItem('aiWeaponShop_theme', currentThemeIndex.toString());
        
        // フィードバック
        themeToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 200);
    });
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚔️ AI WEAPON SHOP Initialized');
    
    // 全機能を初期化
    initVisitorCounter();
    initMobileMenu();
    initSmoothScroll();
    initStatsCounter();
    initContactForm();
    initCardAnimations();
    initHeaderScroll();
    initToolTracking();
    initEasterEgg();
    initScrollToTop();
    initThemeToggle();
    
    // パーティクルエフェクト（パフォーマンスに影響する場合はコメントアウト）
    // initParticles();
    
    // ウェルカムメッセージ（初回訪問のみ）
    const isFirstVisit = !localStorage.getItem('aiWeaponShop_visited');
    if (isFirstVisit) {
        setTimeout(() => {
            const welcome = confirm('AI WEAPON SHOP へようこそ！\n\n人生という無理ゲーを一緒に攻略しましょう！\n\n最強装備を受け取りますか？');
            if (welcome) {
                document.querySelector('#weapons').scrollIntoView({ behavior: 'smooth' });
            }
            localStorage.setItem('aiWeaponShop_visited', 'true');
        }, 2000);
    }
});

// ============================================
// PAGE VISIBILITY API (パフォーマンス最適化)
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('⏸️ Page hidden - Pausing animations');
    } else {
        console.log('▶️ Page visible - Resuming animations');
    }
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%cAI WEAPON SHOP', 'font-size: 24px; font-weight: bold; color: #FFD700;');
console.log('%c人生という無理ゲーをAIで攻略中', 'font-size: 14px; color: #00D4FF;');
console.log('%cGitHub: https://github.com/wagachanminigame', 'font-size: 12px; color: #9D4EDD;');
console.log('%c\n隠しコマンド: ↑↑↓↓←→←→BA', 'font-size: 10px; color: #666;');
