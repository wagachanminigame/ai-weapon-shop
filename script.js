// ============================================
// AI WEAPON SHOP - JAVASCRIPT
// ============================================

// ============================================
// VISITOR COUNTER (訪問者カウンター)
// ============================================
async function initVisitorCounter() {
  const counterElement = document.getElementById("visitorCount");

  if (!counterElement) return;

  // 初期表示
  counterElement.textContent = "---";

  // LocalStorageベースのカウンター
  // グローバルカウント用のキー（全訪問者で共有したい場合はサーバーサイドが必要）
  const storageKey = "aiWeaponShop_visitorData_v2";
  const globalStartCount = 1; // 初期値を1から開始

  let visitorData = JSON.parse(localStorage.getItem(storageKey) || "null");

  if (!visitorData) {
    // 初回訪問者：新規カウント開始
    visitorData = {
      count: globalStartCount,
      isFirstVisit: true,
      visitCount: 1,
      lastVisit: new Date().toDateString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(visitorData));
  } else {
    // リピーター：訪問回数を増やす
    const today = new Date().toDateString();
    if (visitorData.lastVisit !== today) {
      visitorData.visitCount = (visitorData.visitCount || 0) + 1;
      visitorData.lastVisit = today;
      localStorage.setItem(storageKey, JSON.stringify(visitorData));
    }
  }

  // 表示するカウント（個人の訪問回数ではなく、その人が何番目の訪問者かを表示）
  const targetCount = visitorData.count;
  animateCounter(counterElement, 0, targetCount, 1500);
}

// カウントアップアニメーション
function animateCounter(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      element.textContent = Math.floor(end).toLocaleString("ja-JP");
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString("ja-JP");
    }
  }, 16);
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
  });

  // メニューリンクをクリックしたら閉じる
  const links = navLinks.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.textContent = "☰";
    });
  });

  // 外側をクリックしたら閉じる
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove("active");
      menuToggle.textContent = "☰";
    }
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // "#"だけの場合は処理しない
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-target"));
            animateCounter(stat, 0, target, 2000);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// ============================================
// CONTACT FORM - Google Apps Script連携
// ============================================
function initContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  // Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzNH8A-X-Cs3nYB5YS9uBNzIRg40KbWENwVcJm2yLsUMBKUw8aHDEFCK73Deou1XpSu/exec";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // ボタンを無効化
    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳ 送信中...";

    // フォームデータを取得
    const formData = {
      name: form.name.value,
      email: form.email.value,
      category: form.category.value,
      message: form.message.value,
      timestamp: new Date().toISOString(),
    };

    try {
      // Google Apps Scriptにデータを送信（複数の方法を試行）
      console.log("📤 送信開始:", formData);

      // 方法1: fetchでPOST送信
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(formData),
      });

      console.log("📧 送信完了");

      // 送信成功メッセージ
      alert(
        "✅ お問い合わせありがとうございます！\n\n内容を確認次第、ご連絡させていただきます。\n\n緊急の場合は公式LINEからもお問い合わせいただけます。"
      );
      form.reset();
    } catch (error) {
      console.error("送信エラー:", error);

      // フォールバック: 別の方法で送信を試行
      try {
        const img = new Image();
        const params = new URLSearchParams(formData).toString();
        img.src = GOOGLE_SCRIPT_URL + "?" + params;
        console.log("📧 フォールバック送信");

        alert(
          "✅ お問い合わせありがとうございます！\n\n内容を確認次第、ご連絡させていただきます。"
        );
        form.reset();
      } catch (e2) {
        alert(
          "❌ 送信に失敗しました。\n\nお手数ですが、公式LINEからお問い合わせください。"
        );
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }

    // Google Analytics イベント送信（実装されている場合）
    if (typeof gtag !== "undefined") {
      gtag("event", "form_submit", {
        event_category: "contact",
        event_label: formData.category,
      });
    }
  });
}

// ============================================
// CARD ANIMATIONS
// ============================================
function initCardAnimations() {
  const cards = document.querySelectorAll(".card, .tool-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
  const header = document.querySelector("header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.background = "rgba(10, 14, 39, 0.98)";
      header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
    } else {
      header.style.background = "rgba(10, 14, 39, 0.9)";
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    }

    // ヘッダーの表示/非表示（オプション）
    if (currentScroll > lastScroll && currentScroll > 500) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });
}

// ============================================
// PARTICLE EFFECT (オプション - 軽量版)
// ============================================
function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "0";
  canvas.style.opacity = "0.3";
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext("2d");
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
      opacity: Math.random() * 0.5 + 0.2,
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

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  // パフォーマンス最適化：タブが非表示の時はアニメーション停止
  document.addEventListener("visibilitychange", () => {
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
  const toolCards = document.querySelectorAll(".tool-card");

  toolCards.forEach((card) => {
    const link = card.querySelector(".card-link");
    if (link) {
      link.addEventListener("click", (e) => {
        const toolName = card.querySelector(".card-title").textContent;

        // LocalStorageにクリック記録
        const clicks = JSON.parse(
          localStorage.getItem("aiWeaponShop_toolClicks") || "{}"
        );
        clicks[toolName] = (clicks[toolName] || 0) + 1;
        localStorage.setItem("aiWeaponShop_toolClicks", JSON.stringify(clicks));

        // Google Analytics イベント送信（実装されている場合）
        if (typeof gtag !== "undefined") {
          gtag("event", "tool_click", {
            event_category: "tools",
            event_label: toolName,
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
  const code = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  document.addEventListener("keydown", (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(",") === code.join(",")) {
      activateGodMode();
    }
  });
}

function activateGodMode() {
  // 特別なエフェクト
  document.body.style.animation = "rainbow 2s linear infinite";

  // レインボーアニメーション
  const style = document.createElement("style");
  style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
  document.head.appendChild(style);

  // メッセージ表示
  alert(
    "GOD MODE ACTIVATED!\n\nあなたは真の訪問者です！\nLv.99達成おめでとうございます！"
  );

  // プレミアム機能解放（デモ）
  localStorage.setItem("aiWeaponShop_godMode", "true");

  // 3秒後に元に戻す
  setTimeout(() => {
    document.body.style.animation = "";
  }, 3000);
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
  const scrollBtn = document.createElement("button");
  scrollBtn.innerHTML = "↑";
  scrollBtn.className = "scroll-to-top";
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

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 500) {
      scrollBtn.style.opacity = "1";
      scrollBtn.style.pointerEvents = "all";
    } else {
      scrollBtn.style.opacity = "0";
      scrollBtn.style.pointerEvents = "none";
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  scrollBtn.addEventListener("mouseenter", () => {
    scrollBtn.style.transform = "translateY(-5px) scale(1.1)";
    scrollBtn.style.boxShadow = "0 8px 30px rgba(255, 215, 0, 0.6)";
  });

  scrollBtn.addEventListener("mouseleave", () => {
    scrollBtn.style.transform = "translateY(0) scale(1)";
    scrollBtn.style.boxShadow = "0 4px 20px rgba(255, 215, 0, 0.4)";
  });
}

// ============================================
// THEME COLOR TOGGLE
// ============================================
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const themes = [
    {
      name: "gold",
      primary: "#FFD700",
      secondary: "#FFA500",
      accent: "#00D4FF",
    },
    {
      name: "blue",
      primary: "#00D4FF",
      secondary: "#0088FF",
      accent: "#9D4EDD",
    },
    {
      name: "purple",
      primary: "#9D4EDD",
      secondary: "#7209B7",
      accent: "#FF006E",
    },
    {
      name: "green",
      primary: "#00FF88",
      secondary: "#00CC6A",
      accent: "#FFD700",
    },
    {
      name: "red",
      primary: "#FF3366",
      secondary: "#FF0044",
      accent: "#FFD700",
    },
  ];

  let currentThemeIndex = parseInt(
    localStorage.getItem("aiWeaponShop_theme") || "0"
  );
  let triedThemes = new Set(
    JSON.parse(localStorage.getItem("aiWeaponShop_triedThemes") || "[]")
  );

  function applyTheme(index) {
    const theme = themes[index];
    document.documentElement.style.setProperty("--primary-gold", theme.primary);
    document.documentElement.style.setProperty(
      "--secondary-gold",
      theme.secondary
    );
    document.documentElement.style.setProperty("--accent-blue", theme.accent);

    // ボタンの色を更新
    themeToggle.style.borderColor = theme.primary;
    const before = themeToggle.querySelector("::before");
    if (before) {
      before.style.background = theme.primary;
    }
  }

  // 初期テーマを適用し、記録に追加
  applyTheme(currentThemeIndex);
  triedThemes.add(currentThemeIndex);

  // クリックでテーマ切り替え
  themeToggle.addEventListener("click", () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(currentThemeIndex);
    localStorage.setItem("aiWeaponShop_theme", currentThemeIndex.toString());

    // 試したテーマを記録
    triedThemes.add(currentThemeIndex);
    localStorage.setItem(
      "aiWeaponShop_triedThemes",
      JSON.stringify([...triedThemes])
    );

    // フィードバック＆進捗表示
    themeToggle.style.transform = "scale(1.2)";
    console.log(
      `🎨 テーマ変更: ${themes[currentThemeIndex].name} (${triedThemes.size}/${themes.length})`
    );
    setTimeout(() => {
      themeToggle.style.transform = "scale(1)";
    }, 200);

    // 全色試したら裏ステージへ！
    if (triedThemes.size >= themes.length) {
      console.log("🎮 全色コンプリート！裏ステージ解放！");
      setTimeout(() => {
        startSecretMiniGame();
      }, 500);
      // リセット
      triedThemes.clear();
      localStorage.setItem("aiWeaponShop_triedThemes", "[]");
    }
  });
}

// グローバルでミニゲームをテスト起動できるように
window.testMiniGame = function () {
  console.log("🎮 テストモードでミニゲーム起動！");
  startSecretMiniGame();
};

// ============================================
// SECRET MINI GAME - キャラクターキャッチゲーム
// ============================================
function startSecretMiniGame() {
  // ゲーム画面を作成
  const gameOverlay = document.createElement("div");
  gameOverlay.id = "secretMiniGame";
  gameOverlay.innerHTML = `
        <div class="game-container">
            <button class="game-close-btn">×</button>
            <div class="game-header">
                <h2>🎮 裏ステージ 🎮</h2>
                <p>赤いパンツで店主をキャッチ！</p>
                <div class="game-stats">
                    <span class="game-score">キャッチ: <span id="catchCount">0</span>/10</span>
                    <span class="game-lives">❤️ <span id="livesCount">3</span></span>
                </div>
            </div>
            <div class="game-area" id="gameArea">
                <div class="catcher" id="catcher">
                    <div class="pants-catcher"></div>
                </div>
            </div>
            <div class="game-message" id="gameMessage"></div>
        </div>
    `;

  // スタイルを追加
  const gameStyles = document.createElement("style");
  gameStyles.textContent = `
        #secretMiniGame {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.5s ease;
        }
        
        .game-container {
            width: 90%;
            max-width: 500px;
            height: 80vh;
            max-height: 700px;
            background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
            border: 4px solid #FFD700;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
        }
        
        .game-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: #FF3366;
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 100;
            transition: all 0.3s ease;
        }
        
        .game-close-btn:hover {
            background: #FF0044;
            transform: scale(1.1);
        }
        
        .game-header {
            text-align: center;
            padding: 15px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%);
            border-bottom: 2px solid #FFD700;
        }
        
        .game-header h2 {
            color: #FFD700;
            margin: 0;
            font-size: 1.5rem;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        .game-header p {
            color: #fff;
            margin: 5px 0 0;
            font-size: 0.9rem;
        }
        
        .game-stats {
            display: flex;
            justify-content: space-around;
            margin-top: 10px;
            color: #fff;
            font-size: 1rem;
        }
        
        .game-score {
            color: #00FF88;
        }
        
        .game-lives {
            color: #FF3366;
        }
        
        .game-area {
            position: relative;
            width: 100%;
            height: calc(100% - 120px);
            background: 
                radial-gradient(circle at 30% 70%, rgba(157, 78, 221, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(0, 212, 255, 0.1) 0%, transparent 50%);
            cursor: none;
        }
        
        .catcher {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            transition: left 0.05s ease-out;
            user-select: none;
        }
        
        .pants-catcher {
            width: 100px;
            height: 40px;
            background: linear-gradient(180deg, #CC2233 0%, #FF3344 50%, #CC2233 100%);
            border: 3px solid #AA1122;
            border-radius: 0 0 30px 30px;
            box-shadow: 
                0 5px 15px rgba(255, 51, 102, 0.5),
                inset 0 -5px 10px rgba(0,0,0,0.3),
                inset 0 5px 10px rgba(255,255,255,0.2);
            position: relative;
        }
        
        .pants-catcher::before {
            content: '';
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 110px;
            height: 15px;
            background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
            border: 2px solid #5C3A21;
            border-radius: 3px;
        }
        
        .falling-character {
            position: absolute;
            animation: fall linear forwards;
            user-select: none;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
        }
        
        .falling-character img {
            width: 70px;
            height: auto;
            image-rendering: pixelated;
        }
        
        @keyframes fall {
            0% {
                top: -100px;
                transform: rotate(0deg) scale(1);
            }
            25% {
                transform: rotate(15deg) scale(1.05);
            }
            50% {
                transform: rotate(-15deg) scale(1);
            }
            75% {
                transform: rotate(10deg) scale(1.05);
            }
            100% {
                top: calc(100% + 100px);
                transform: rotate(-5deg) scale(1);
            }
        }
        
        .catch-effect {
            position: absolute;
            font-size: 30px;
            animation: catchPop 0.5s ease-out forwards;
            pointer-events: none;
        }
        
        @keyframes catchPop {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(2) translateY(-30px);
                opacity: 0;
            }
        }
        
        .game-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #FFD700;
            font-size: 2rem;
            font-weight: bold;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            z-index: 50;
            display: none;
        }
        
        .game-message.show {
            display: block;
            animation: messageAppear 0.5s ease;
        }
        
        @keyframes messageAppear {
            0% {
                transform: translate(-50%, -50%) scale(0);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        .game-message button {
            display: block;
            margin: 20px auto 0;
            padding: 10px 30px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border: none;
            border-radius: 25px;
            color: #1a1a2e;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .game-message button:hover {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
    `;

  document.head.appendChild(gameStyles);
  document.body.appendChild(gameOverlay);

  // ゲーム変数
  let catchCount = 0;
  let lives = 3;
  let gameRunning = true;
  let spawnInterval;
  let useImages = true; // 画像を使用するか

  // キャラクター画像のポーズ (images/game/ フォルダに保存)
  const characterImages = [
    "images/game/pose1.png",
    "images/game/pose2.png",
    "images/game/pose3.png",
    "images/game/pose4.png",
    "images/game/pose5.png",
    "images/game/pose6.png",
    "images/game/pose7.png",
    "images/game/pose8.png",
    "images/game/pose9.png",
    "images/game/pose10.png",
  ];

  // フォールバック用絵文字
  const characterEmojis = [
    "🧍",
    "🏃",
    "🤸",
    "💃",
    "🕺",
    "🧘",
    "🙆",
    "🙋",
    "🤷",
    "🙅",
  ];

  // 要素を取得
  const gameArea = document.getElementById("gameArea");
  const catcher = document.getElementById("catcher");
  const catchCountEl = document.getElementById("catchCount");
  const livesCountEl = document.getElementById("livesCount");
  const gameMessage = document.getElementById("gameMessage");
  const closeBtn = gameOverlay.querySelector(".game-close-btn");

  // キャッチャーをマウス/タッチで移動
  function moveCatcher(clientX) {
    const rect = gameArea.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(60, Math.min(rect.width - 60, x));
    catcher.style.left = x + "px";
  }

  gameArea.addEventListener("mousemove", (e) => {
    if (gameRunning) moveCatcher(e.clientX);
  });

  gameArea.addEventListener(
    "touchmove",
    (e) => {
      if (gameRunning) {
        e.preventDefault();
        moveCatcher(e.touches[0].clientX);
      }
    },
    { passive: false }
  );

  // キャラクターを落とす
  function spawnCharacter() {
    if (!gameRunning) return;

    const character = document.createElement("div");
    character.className = "falling-character";

    if (useImages) {
      // 画像を使用
      const img = document.createElement("img");
      const randomIndex = Math.floor(Math.random() * characterImages.length);
      img.src = characterImages[randomIndex];
      img.alt = "店主";
      img.onerror = function () {
        // 画像が読み込めない場合はemoji代替
        useImages = false; // 以降は絵文字のみ
        character.innerHTML =
          characterEmojis[randomIndex % characterEmojis.length];
        character.style.fontSize = "50px";
      };
      character.appendChild(img);
    } else {
      // 絵文字を使用
      character.textContent =
        characterEmojis[Math.floor(Math.random() * characterEmojis.length)];
      character.style.fontSize = "50px";
    }

    const x = Math.random() * (gameArea.clientWidth - 80) + 40;
    character.style.left = x + "px";

    const duration = 2.5 + Math.random() * 2; // 2.5-4.5秒
    character.style.animationDuration = duration + "s";

    gameArea.appendChild(character);

    // 当たり判定チェック
    const checkCollision = setInterval(() => {
      if (!gameRunning) {
        clearInterval(checkCollision);
        return;
      }

      const charRect = character.getBoundingClientRect();
      const catcherRect = catcher.getBoundingClientRect();

      // キャッチ判定
      if (
        charRect.bottom > catcherRect.top &&
        charRect.bottom < catcherRect.bottom + 30 &&
        charRect.left < catcherRect.right &&
        charRect.right > catcherRect.left
      ) {
        clearInterval(checkCollision);
        character.remove();
        catchCount++;
        catchCountEl.textContent = catchCount;

        // キャッチエフェクト
        const effect = document.createElement("div");
        effect.className = "catch-effect";
        effect.textContent = "✨";
        effect.style.left =
          charRect.left - gameArea.getBoundingClientRect().left + "px";
        effect.style.top =
          catcherRect.top - gameArea.getBoundingClientRect().top + "px";
        gameArea.appendChild(effect);
        setTimeout(() => effect.remove(), 500);

        // クリア判定
        if (catchCount >= 10) {
          gameWin();
        }
      }

      // ミス判定（画面外に落ちた）
      if (charRect.top > gameArea.getBoundingClientRect().bottom) {
        clearInterval(checkCollision);
        character.remove();
        lives--;
        livesCountEl.textContent = lives;

        // ミスエフェクト
        catcher.style.filter = "drop-shadow(0 0 20px red)";
        setTimeout(() => {
          catcher.style.filter =
            "drop-shadow(0 0 10px rgba(255, 51, 102, 0.8))";
        }, 300);

        if (lives <= 0) {
          gameOver();
        }
      }
    }, 50);

    // アニメーション終了時に削除
    character.addEventListener("animationend", () => {
      clearInterval(checkCollision);
      character.remove();
    });
  }

  // ゲームクリア
  function gameWin() {
    gameRunning = false;
    clearInterval(spawnInterval);

    gameMessage.innerHTML = `
            <div style="font-size: 2.5rem;">🎊 CLEAR! 🎊</div>
            <div style="font-size: 1.2rem; margin-top: 15px; color: #00FF88;">店主を全員キャッチ！</div>
            <div style="font-size: 0.9rem; margin-top: 10px; color: #FFD700;">🏆 裏ボス撃破 🏆</div>
            <button onclick="document.getElementById('secretMiniGame').remove()">HPに戻る</button>
        `;
    gameMessage.classList.add("show");

    // 紙吹雪エフェクト
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.textContent = ["🎉", "✨", "🌟", "💫", "🎊", "⭐"][
          Math.floor(Math.random() * 6)
        ];
        confetti.style.cssText = `
                    position: absolute;
                    font-size: ${20 + Math.random() * 20}px;
                    left: ${Math.random() * 100}%;
                    top: -50px;
                    animation: fall ${3 + Math.random() * 2}s linear forwards;
                    pointer-events: none;
                `;
        gameArea.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
      }, i * 80);
    }
  }

  // ゲームオーバー
  function gameOver() {
    gameRunning = false;
    clearInterval(spawnInterval);

    gameMessage.innerHTML = `
            <div style="font-size: 2rem; color: #FF3366;">💔 GAME OVER 💔</div>
            <div style="font-size: 1rem; margin-top: 15px;">キャッチ数: ${catchCount}/10</div>
            <div style="font-size: 0.8rem; margin-top: 5px; color: #888;">店主が逃げてしまった...</div>
            <button onclick="location.reload()">リトライ</button>
            <button onclick="document.getElementById('secretMiniGame').remove()" style="background: #666;">HPに戻る</button>
        `;
    gameMessage.classList.add("show");
  }

  // 閉じるボタン
  closeBtn.addEventListener("click", () => {
    gameRunning = false;
    clearInterval(spawnInterval);
    gameOverlay.remove();
    gameStyles.remove();
  });

  // ゲーム開始
  setTimeout(() => {
    spawnInterval = setInterval(spawnCharacter, 800);
  }, 1000);

  console.log("🎮 ミニゲーム開始！");
}

// ============================================
// SHOPKEEPER SPEECH BUBBLE
// ============================================
function initShopkeeperBubble() {
  const clickArea = document.getElementById("shopkeeperArea");
  const bubble = document.getElementById("shopkeeperBubble");

  if (!clickArea || !bubble) return;

  // クリックで吹き出し表示/非表示
  clickArea.addEventListener("click", () => {
    bubble.classList.toggle("show");

    // 表示されたら効果音的なログ
    if (bubble.classList.contains("show")) {
      console.log("🗨️ 店主「いらっしゃい！」");
    }
  });

  // 吹き出し以外をクリックしたら閉じる
  document.addEventListener("click", (e) => {
    if (!clickArea.contains(e.target) && !bubble.contains(e.target)) {
      bubble.classList.remove("show");
    }
  });

  // メッセージをランダムに変える（オプション）
  const messages = [
    { main: "いらっしゃい！", sub: "今日も最強装備、揃ってるよ！" },
    { main: "よう、冒険者！", sub: "何かお探しかい？" },
    { main: "おっ、来たな！", sub: "いいツールあるぜ！" },
    { main: "へいらっしゃい！", sub: "今日のオススメはGifMojoだ！" },
  ];

  clickArea.addEventListener("click", () => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const bubbleText = bubble.querySelector(".bubble-text");
    const bubbleSubtext = bubble.querySelector(".bubble-subtext");

    if (bubbleText) bubbleText.textContent = randomMsg.main;
    if (bubbleSubtext) bubbleSubtext.textContent = randomMsg.sub;
  });
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("⚔️ AI WEAPON SHOP Initialized");

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
  initShopkeeperBubble();

  // パーティクルエフェクト（パフォーマンスに影響する場合はコメントアウト）
  // initParticles();

  // ウェルカムメッセージは削除（吹き出しに置き換え）
});

// ============================================
// PAGE VISIBILITY API (パフォーマンス最適化)
// ============================================
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("⏸️ Page hidden - Pausing animations");
  } else {
    console.log("▶️ Page visible - Resuming animations");
  }
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log(
  "%cAI WEAPON SHOP",
  "font-size: 24px; font-weight: bold; color: #FFD700;"
);
console.log(
  "%c人生という無理ゲーをAIで攻略中",
  "font-size: 14px; color: #00D4FF;"
);
console.log(
  "%cGitHub: https://github.com/wagachanminigame",
  "font-size: 12px; color: #9D4EDD;"
);
console.log("%c\n隠しコマンド: ↑↑↓↓←→←→BA", "font-size: 10px; color: #666;");
