/* Wagga Technology Solutions — Scroll & UI Animations + Easter Eggs */
(function () {
  'use strict';

  // --- Scroll-triggered animations via IntersectionObserver ---
  var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('[data-animate]').forEach(function (el) {
    animObserver.observe(el);
  });

  // --- Stagger children of [data-stagger] containers ---
  document.querySelectorAll('[data-stagger]').forEach(function (container) {
    Array.from(container.children).forEach(function (child, i) {
      if (!child.hasAttribute('data-animate')) {
        child.setAttribute('data-animate', '');
      }
      child.setAttribute('data-delay', String(Math.min(i + 1, 7)));
      animObserver.observe(child);
    });
  });

  // --- Service Tabs ---
  var tabs = document.querySelectorAll('.service-tabs__tab');
  var panels = document.querySelectorAll('.service-tabs__panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Nav scroll shadow ---
  var nav = document.querySelector('.nav');
  if (nav) {
    var scrolled = false;
    window.addEventListener('scroll', function () {
      var nowScrolled = window.scrollY > 10;
      if (nowScrolled !== scrolled) {
        scrolled = nowScrolled;
        nav.style.boxShadow = scrolled ? '0 4px 24px rgba(56,57,97,0.14)' : '';
      }
    }, { passive: true });
  }

  // =====================================================
  // 🥚 EASTER EGGS
  // =====================================================

  // -- Toast helper --
  function showToast(msg) {
    var existing = document.querySelector('.egg-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'egg-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 500);
    }, 4000);
  }

  // -- Console art --
  if (typeof console !== 'undefined') {
    console.log('%c  WTS  ', 'background:#383961;color:#fff;font-size:22px;font-weight:bold;padding:4px 12px;border-radius:6px;');
    console.log('%cWagga Technology Solutions', 'color:#383961;font-size:14px;font-weight:bold;');
    console.log('%c\nHey there, DevTools detective! 🕵️\nYou\'ve got a keen eye. If you\'re a developer, I\'d love a chat.\n📧 alex@waggatechsolutions.au\n\nP.S. There are a few Easter eggs hidden on the site. Happy hunting 🥚\n', 'color:#52526e;font-size:12px;');
  }

  // -- Tab title change --
  var originalTitle = document.title;
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? '👋 Miss me already?' : originalTitle;
  });

  // -- Konami Code: ↑↑↓↓←→←→BA --
  var konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var konamiIdx = 0;
  var konamiMessages = [
    '🎮 +99 lives added. Unfortunately this isn\'t that kind of site.',
    '🕹️ Konami Code! Impressive. I accept payment in retro game cartridges.',
    '🥚 Easter egg unlocked! Now put your hands up and step away from the keyboard.',
    '🚀 Cheat code activated. Your WiFi speed has been... not changed at all.',
  ];
  document.addEventListener('keydown', function (e) {
    if (e.key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) {
        konamiIdx = 0;
        var msg = konamiMessages[Math.floor(Math.random() * konamiMessages.length)];
        showToast(msg);
      }
    } else {
      konamiIdx = e.key === konami[0] ? 1 : 0;
    }
  });

  // -- Logo click Easter egg (5 clicks in 3 seconds) --
  var logo = document.querySelector('.nav__logo');
  if (logo) {
    var clickCount = 0;
    var clickTimer = null;
    var logoMessages = [
      '🥚 Found it! You clicked the logo 5 times. Solid commitment.',
      '🎉 Logo Easter egg unlocked! Alex is impressed.',
      '👀 Still here? Try the Konami code next.',
    ];
    logo.addEventListener('click', function (e) {
      if (e.target.closest('a') && logo.getAttribute('href') !== '#') {
        // Don't block navigation, but count
      }
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      if (clickCount >= 5) {
        clickCount = 0;
        var msg = logoMessages[Math.floor(Math.random() * logoMessages.length)];
        showToast(msg);
        return;
      }
      clickTimer = setTimeout(function () { clickCount = 0; }, 3000);
    });
  }

  // -- Secret hover on footer copyright --
  var copy = document.querySelector('.footer__copy');
  if (copy) {
    var hoverCount = 0;
    copy.addEventListener('mouseenter', function () {
      hoverCount++;
      if (hoverCount === 7) {
        hoverCount = 0;
        showToast('🥚 You hovered the footer 7 times. Curiosity: 10/10.');
      }
    });
  }

  // -- Secret shake: shake the device (mobile) to trigger --
  if (typeof DeviceMotionEvent !== 'undefined') {
    var lastShake = 0;
    var shakeThreshold = 15;
    window.addEventListener('devicemotion', function (e) {
      var acc = e.accelerationIncludingGravity;
      if (!acc) return;
      var mag = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
      if (mag > shakeThreshold) {
        var now = Date.now();
        if (now - lastShake > 3000) {
          lastShake = now;
          showToast('📳 You shook your phone! Nice. That\'s dedication.');
        }
      }
    });
  }

})();
