/* ============================================================
   CaptainPepe — portfolio · app.js
   vanilla JS: i18n toggle, lucide, cursor glow, magnetic
   buttons, 3D card tilt, scroll reveal, mobile nav
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');

  /* ---------- lucide icons ---------- */
  function initIcons() {
    try {
      if (window.lucide) window.lucide.createIcons();
    } catch (e) { /* no-op */ }
  }
  window.addEventListener('load', initIcons);
  if (document.readyState === 'complete') initIcons();

  /* ---------- i18n ---------- */
  var LANG_KEY = 'cp-lang';
  var heroName = $('#heroName');

  function currentLang() {
    var l;
    try { l = localStorage.getItem(LANG_KEY); } catch (e) {}
    return l === 'ru' ? 'ru' : 'en';
  }

  function setLangButtonState(lang) {
    var en = $('#langEn'), ru = $('#langRu');
    if (en) en.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    if (ru) ru.setAttribute('aria-pressed', lang === 'ru' ? 'true' : 'false');
  }

  /* kinetic split-name renderer */
  function renderHeroName(lang) {
    if (!heroName) return;
    var text = lang === 'ru' ? heroName.getAttribute('data-ru') : heroName.getAttribute('data-en');
    heroName.textContent = '';
    Array.prototype.forEach.call(text, function (ch, i) {
      var s = document.createElement('span');
      s.className = 'ln';
      s.textContent = ch;
      s.style.setProperty('--i', String(i));
      if (!reducedMotion) {
        s.classList.add('on');
        // re-trigger animation on each render
        void s.offsetWidth;
      }
      heroName.appendChild(s);
    });
  }

  function applyLang(lang) {
    $$('[data-en]').forEach(function (el) {
      var key = lang === 'ru' ? 'data-ru' : 'data-en';
      var htmlKey = lang === 'ru' ? 'data-ru-html' : 'data-en-html';
      if (el.hasAttribute(htmlKey)) {
        var html = el.getAttribute(htmlKey);
        if (html !== null) el.innerHTML = html;
      } else {
        var val = el.getAttribute(key);
        if (val !== null && el !== heroName) el.textContent = val;
      }
    });
    document.documentElement.lang = lang;
    setLangButtonState(lang);
    renderHeroName(lang);
  }

  function bindLang() {
    var en = $('#langEn'), ru = $('#langRu');
    if (en) en.addEventListener('click', function () { setLang('en'); });
    if (ru) ru.addEventListener('click', function () { setLang('ru'); });
  }

  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyLang(lang);
  }

  /* ---------- cursor glow (desktop, non-reduced) ---------- */
  var glow = $('#cursorGlow');
  function initCursorGlow() {
    if (!glow || reducedMotion) return;
    var x = -500, y = -500, tx = -500, ty = -500, raf = null, on = false;

    function tick() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      glow.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) {
        raf = requestAnimationFrame(tick);
      } else { raf = null; }
    }
    function ensure() { if (!raf) { on = true; document.body.classList.add('cursor-on'); raf = requestAnimationFrame(tick); } }
    function drop() { on = false; document.body.classList.remove('cursor-on'); }

    function move(e) {
      tx = e.clientX; ty = e.clientY; ensure();
    }
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', drop);
    // pause when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) drop();
    });
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    if (reducedMotion || !finePointer.matches) return;
    $$('.magnetic').forEach(function (el) {
      var strength = el.classList.contains('btn') ? 0.28 : 0.35;
      var raf = null;

      el.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = el.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2);
          var dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = 'translate(' + (dx * strength).toFixed(1) + 'px,' + (dy * strength * 0.8).toFixed(1) + 'px)';
        });
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, filter 0.3s ease';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
    });
  }

  /* ---------- 3D card tilt (desktop only) ---------- */
  function initTilt() {
    if (reducedMotion || !finePointer.matches) return;
    var MAX = 5; // degrees

    $$('.tilt-card').forEach(function (card) {
      var raf = null;
      card.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.classList.add('is-tilting');
          card.style.transform =
            'perspective(900px) rotateX(' + (-py * MAX * 2).toFixed(2) + 'deg) rotateY(' + (px * MAX * 2).toFixed(2) + 'deg)';
        });
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reducedMotion) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) {
      var d = el.getAttribute('data-d');
      if (d !== null) el.style.setProperty('--d', d);
      io.observe(el);
    });
  }

  /* ---------- sticky topbar state ---------- */
  function initScrolled() {
    var bar = $('.topbar');
    if (!bar) return;
    function upd() {
      if (window.scrollY > 12) bar.classList.add('scrolled');
      else bar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ---------- mobile menu ---------- */
  function initMobileNav() {
    var burger = $('#burger');
    var menu = $('#mobileMenu');
    if (!burger || !menu) return;

    function close() {
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
    }
    burger.addEventListener('click', function () {
      var willOpen = menu.hidden;
      menu.hidden = !willOpen;
      burger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) close();
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    applyLang(currentLang());
    initIcons();
    initCursorGlow();
    initMagnetic();
    initTilt();
    initReveal();
    initScrolled();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // pointer type can change (e.g. detach/attach mouse)
  if (finePointer.addEventListener) {
    finePointer.addEventListener('change', function () {
      if (finePointer.matches && !reducedMotion) initMagnetic();
    });
  }
})();
