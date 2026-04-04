/* Wagga Technology Solutions — Scroll & UI Animations + Easter Eggs */
(function () {
  'use strict';

  // --- Scroll-triggered animations ---
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
      if (!child.hasAttribute('data-animate')) child.setAttribute('data-animate', '');
      child.setAttribute('data-delay', String(Math.min(i + 1, 7)));
      animObserver.observe(child);
    });
  });

  // --- Mobile Nav Accordion ---
  document.querySelectorAll('.nav__mobile-acc-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var acc = toggle.closest('.nav__mobile-acc');
      var isOpen = acc.classList.contains('open');
      // Close all others
      document.querySelectorAll('.nav__mobile-acc.open').forEach(function (el) {
        el.classList.remove('open');
      });
      if (!isOpen) acc.classList.add('open');
    });
  });

  // --- Service Tabs ---
  document.querySelectorAll('.service-tabs__tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');
      document.querySelectorAll('.service-tabs__tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.service-tabs__panel').forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Nav scroll shadow ---
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(56,57,97,0.14)' : '';
    }, { passive: true });
  }

  // =====================================================
  // 🥚 EASTER EGGS — fun for everyone
  // =====================================================

  function showToast(msg, duration) {
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
    }, duration || 4500);
  }

  // 🥚 1. Hidden egg in footer — small emoji anyone can click
  var footerEgg = document.getElementById('footer-egg');
  if (footerEgg) {
    footerEgg.addEventListener('click', function () {
      showToast('🥚 You found it! You\'re officially more tech-savvy than you think. Give Alex a call — 0473 430 419', 5000);
    });
  }

  // 🥚 2. Click Alex's photo on the index page
  var alexPhoto = document.getElementById('alex-photo');
  if (alexPhoto) {
    alexPhoto.addEventListener('click', function () {
      var msgs = [
        '👋 Hi! That\'s me — Alex. Caught mid-headshot. Call me on 0473 430 419 instead!',
        '📸 Good headshot, right? My mum thinks so. Call me on 0473 430 419.',
        '🙋 That\'s me! Less intimidating in person. Call 0473 430 419 and find out.',
      ];
      showToast(msgs[Math.floor(Math.random() * msgs.length)]);
    });
    alexPhoto.style.cursor = 'pointer';
  }

  // 🥚 3. Logo — click 5 times fast
  var logo = document.querySelector('.nav__logo');
  if (logo) {
    var clickCount = 0, clickTimer = null;
    logo.addEventListener('click', function () {
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      if (clickCount >= 5) {
        clickCount = 0;
        showToast('🏆 5 clicks! You win... absolutely nothing. But Alex appreciates the dedication. Call 0473 430 419!');
        return;
      }
      clickTimer = setTimeout(function () { clickCount = 0; }, 2500);
    });
  }

  // 🥚 4. Tab away — title changes to a friendly nudge
  var originalTitle = document.title;
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? '👋 Your tech won\'t fix itself...' : originalTitle;
  });

  // 🥚 5. Type "wagga" anywhere on the page
  var typedBuffer = '';
  document.addEventListener('keydown', function (e) {
    if (e.key.length === 1) {
      typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-5);
      if (typedBuffer === 'wagga') {
        typedBuffer = '';
        showToast('🦘 You typed Wagga! Good taste. Best town in the Riverina. Alex agrees.');
      }
    }
  });

  // 🥚 6. Click the price tag on any featured service card 3 times
  var priceTags = document.querySelectorAll('[data-price-egg]');
  priceTags.forEach(function (tag) {
    var n = 0, t = null;
    tag.addEventListener('click', function () {
      n++;
      if (t) clearTimeout(t);
      if (n >= 3) {
        n = 0;
        showToast('💸 Yep, that\'s really the price. No hidden fees, no nasty surprises. Promise.');
        return;
      }
      t = setTimeout(function () { n = 0; }, 2000);
    });
    tag.style.cursor = 'pointer';
  });

  // 🥚 7. Shake the phone (mobile users)
  if (typeof DeviceMotionEvent !== 'undefined') {
    var lastShake = 0;
    window.addEventListener('devicemotion', function (e) {
      var acc = e.accelerationIncludingGravity;
      if (!acc) return;
      var mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      if (mag > 20 && Date.now() - lastShake > 4000) {
        lastShake = Date.now();
        showToast('📳 Careful — shaking the phone won\'t fix the WiFi. But Alex can. Call 0473 430 419!');
      }
    });
  }

  // 🥚 8. Idle for 45 seconds — gentle nudge
  var idleTimer = null;
  var idleShown = false;
  function resetIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    if (idleShown) return;
    idleTimer = setTimeout(function () {
      idleShown = true;
      showToast('🤔 Still thinking? That\'s ok. Give Alex a call — 0473 430 419 — no pressure.', 6000);
    }, 45000);
  }
  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(function (evt) {
    document.addEventListener(evt, resetIdle, { passive: true });
  });
  resetIdle();

  // 🥚 9. Console message — for the devs who peek
  if (typeof console !== 'undefined') {
    console.log('%c WTS ', 'background:#383961;color:#fff;font-size:20px;font-weight:bold;padding:4px 12px;border-radius:6px;');
    console.log('%cWagga Technology Solutions\nalex@waggatechsolutions.au\n\nHey dev 👋 There are Easter eggs hidden all over the site for normal humans too, not just console-openers. Happy hunting.\n', 'color:#52526e;font-size:12px;');
  }

})();
