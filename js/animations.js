/* Wagga Technology Solutions — Scroll & UI Animations */
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

  // --- Nav scroll shadow enhancement ---
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
})();
