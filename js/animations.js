/* Wagga Technology Solutions — Animations, UX, Easter Eggs */
(function () {
  'use strict';

  var isMouse = window.matchMedia('(pointer: fine)').matches;

  // --- Scroll progress bar ---
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.prepend(progress);

  // --- Cursor glow (desktop only) ---
  var glow = null;
  if (isMouse) {
    glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
  }

  // --- Floating call bar ---
  var floatBar = document.createElement('div');
  floatBar.className = 'float-bar';
  floatBar.innerHTML = '<span class="float-bar__text"><strong>Ready to sort your tech?</strong> Alex is available today.</span>' +
    '<div class="float-bar__actions">' +
    '<a href="tel:0473430419" class="btn btn--white btn--sm">📞 Call now</a>' +
    '<a href="contact-us.html" class="btn btn--outline-white btn--sm">Message</a>' +
    '</div>';
  document.body.appendChild(floatBar);

  var heroSection = document.querySelector('.hero');
  var floatVisible = false;
  var lastY = 0;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    if (glow) {
      // Already tracked via mousemove
    }

    // Show float bar after scrolling past hero
    var heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 400;
    var shouldShow = y > heroBottom && y < max - 100;
    if (shouldShow !== floatVisible) {
      floatVisible = shouldShow;
      floatBar.classList.toggle('show', floatVisible);
    }

    // Nav shadow
    if (nav) nav.style.boxShadow = y > 10 ? '0 4px 24px rgba(56,57,97,0.14)' : '';

    lastY = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Cursor glow follow ---
  if (glow && isMouse) {
    var glowX = 0, glowY = 0;
    var targetX = 0, targetY = 0;
    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
    });
    function animGlow() {
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animGlow);
    }
    animGlow();
  }

  // --- Card 3D tilt (desktop only) ---
  if (isMouse) {
    document.querySelectorAll('.card, .review-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(700px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-4px) scale(1.01)';
        card.style.boxShadow = '0 16px 48px rgba(56,57,97,0.18)';
        card.style.transition = 'box-shadow 0.1s';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
      });
    });
  }

  // --- Magnetic buttons (desktop) ---
  if (isMouse) {
    document.querySelectorAll('.btn--primary, .btn--outline').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

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

  // --- Stagger children ---
  document.querySelectorAll('[data-stagger]').forEach(function (container) {
    Array.from(container.children).forEach(function (child, i) {
      if (!child.hasAttribute('data-animate')) child.setAttribute('data-animate', '');
      child.setAttribute('data-delay', String(Math.min(i + 1, 7)));
      animObserver.observe(child);
    });
  });

  // --- Typewriter in hero ---
  var twEl = document.getElementById('tw-phrase');
  var twCursor = document.getElementById('tw-cursor');
  if (twEl) {
    var words = JSON.parse(twEl.getAttribute('data-words'));
    var wIdx = 0, cIdx = words[0].length, deleting = false;
    // Start fully typed
    twEl.textContent = words[0];
    function runTw() {
      var word = words[wIdx];
      if (!deleting) {
        twEl.textContent = word.slice(0, cIdx + 1);
        cIdx++;
        if (cIdx >= word.length) {
          deleting = true;
          setTimeout(runTw, 2200);
          return;
        }
      } else {
        twEl.textContent = word.slice(0, cIdx - 1);
        cIdx--;
        if (cIdx <= 0) {
          deleting = false;
          wIdx = (wIdx + 1) % words.length;
          cIdx = 0;
        }
      }
      setTimeout(runTw, deleting ? 55 : 85);
    }
    setTimeout(runTw, 2800);
  }

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

  // --- Mobile Nav Accordion ---
  document.querySelectorAll('.nav__mobile-acc-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var acc = toggle.closest('.nav__mobile-acc');
      var open = acc.classList.contains('open');
      document.querySelectorAll('.nav__mobile-acc.open').forEach(function (el) { el.classList.remove('open'); });
      if (!open) acc.classList.add('open');
    });
  });

  // --- Nav ---
  var nav = document.querySelector('.nav');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  // =====================================================
  // 🥚 EASTER EGGS
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

  // Footer egg
  var footerEgg = document.getElementById('footer-egg');
  if (footerEgg) {
    footerEgg.addEventListener('click', function () {
      showToast('🥚 You found it! You\'re more tech-savvy than you think. Give Alex a call — 0473 430 419', 5000);
    });
  }

  // Alex photo click
  var alexPhoto = document.getElementById('alex-photo');
  if (alexPhoto) {
    var photoMsgs = [
      '👋 Hi! That\'s me — Alex. Call me on 0473 430 419 instead!',
      '📸 Good headshot, right? My mum thinks so. Call 0473 430 419.',
      '🙋 Less intimidating in person, I promise. Call 0473 430 419.',
    ];
    alexPhoto.addEventListener('click', function () {
      showToast(photoMsgs[Math.floor(Math.random() * photoMsgs.length)]);
    });
    alexPhoto.style.cursor = 'pointer';
  }

  // Logo 5 clicks
  var logo = document.querySelector('.nav__logo');
  if (logo) {
    var lClicks = 0, lTimer = null;
    logo.addEventListener('click', function () {
      lClicks++;
      if (lTimer) clearTimeout(lTimer);
      if (lClicks >= 5) {
        lClicks = 0;
        showToast('🏆 5 clicks! You win nothing. But Alex appreciates the dedication. Call 0473 430 419!');
        return;
      }
      lTimer = setTimeout(function () { lClicks = 0; }, 2500);
    });
  }

  // Tab away title
  var origTitle = document.title;
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? '👋 Your tech won\'t fix itself...' : origTitle;
  });

  // Type "wagga"
  var buf = '';
  document.addEventListener('keydown', function (e) {
    if (e.key.length === 1) {
      buf = (buf + e.key.toLowerCase()).slice(-5);
      if (buf === 'wagga') { buf = ''; showToast('🦘 You typed Wagga! Best town in the Riverina. Alex agrees.'); }
    }
  });

  // Price tag triple-click
  document.querySelectorAll('[data-price-egg]').forEach(function (tag) {
    var n = 0, t = null;
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', function () {
      n++;
      if (t) clearTimeout(t);
      if (n >= 3) { n = 0; showToast('💸 Yep, that\'s really the price. No hidden fees. Promise.'); return; }
      t = setTimeout(function () { n = 0; }, 2000);
    });
  });

  // Phone shake
  if (typeof DeviceMotionEvent !== 'undefined') {
    var lastShake = 0;
    window.addEventListener('devicemotion', function (e) {
      var acc = e.accelerationIncludingGravity;
      if (!acc) return;
      var mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      if (mag > 20 && Date.now() - lastShake > 4000) {
        lastShake = Date.now();
        showToast('📳 Shaking won\'t fix the WiFi. But Alex can. Call 0473 430 419!');
      }
    });
  }

  // Idle 45s nudge
  var idleTimer = null, idleDone = false;
  function resetIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    if (idleDone) return;
    idleTimer = setTimeout(function () {
      idleDone = true;
      showToast('🤔 Still thinking? No pressure. Call 0473 430 419 — happy to chat.', 6000);
    }, 45000);
  }
  ['mousemove','keydown','scroll','touchstart'].forEach(function (e) {
    document.addEventListener(e, resetIdle, { passive: true });
  });
  resetIdle();

  // Console
  if (typeof console !== 'undefined') {
    console.log('%c WTS ', 'background:#383961;color:#fff;font-size:20px;font-weight:bold;padding:4px 12px;border-radius:6px;');
    console.log('%cWagga Technology Solutions\nalex@waggatechsolutions.au\n\nHey dev 👋 Easter eggs are hidden all over this site for regular humans too. Happy hunting.\n', 'color:#52526e;font-size:12px;');
  }

  // Footer hover × 7
  var copy = document.querySelector('.footer__copy');
  if (copy) {
    var hCount = 0;
    copy.addEventListener('mouseenter', function () {
      hCount++;
      if (hCount === 7) { hCount = 0; showToast('🥚 You hovered the footer 7 times. Curious. I like it.'); }
    });
  }

})();
