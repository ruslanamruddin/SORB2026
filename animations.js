/* SORB 2026 — Animations & Interactive Features */

(function () {
  'use strict';

  /* ---- Page Load Fade ---- */
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('loaded');
  });

  /* ---- Scroll Animations (IntersectionObserver) ---- */
  var animateEls = document.querySelectorAll('.animate');

  if ('IntersectionObserver' in window && animateEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animateEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    animateEls.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ---- Countdown Timer ---- */
  // SET YOUR CONFERENCE DATE HERE (YYYY, month-1, day, hour, minute)
  var CONFERENCE_DATE = new Date(2026, 4, 6, 8, 30, 0); // May 6, 2026 at 8:30 AM

  var countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    var daysEl = document.getElementById('cd-days');
    var hoursEl = document.getElementById('cd-hours');
    var minutesEl = document.getElementById('cd-minutes');
    var secondsEl = document.getElementById('cd-seconds');

    function updateCountdown() {
      var now = new Date();
      var diff = CONFERENCE_DATE - now;

      if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minutesEl.textContent = '0';
        secondsEl.textContent = '0';
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      updateDigit(daysEl, days);
      updateDigit(hoursEl, hours);
      updateDigit(minutesEl, minutes);
      updateDigit(secondsEl, seconds);
    }

    function updateDigit(el, value) {
      var str = String(value);
      if (el.textContent !== str) {
        el.textContent = str;
        el.classList.remove('tick');
        // Force reflow
        void el.offsetWidth;
        el.classList.add('tick');
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---- Stats Counter ---- */
  var statsEls = document.querySelectorAll('[data-count-to]');

  if ('IntersectionObserver' in window && statsEls.length) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsEls.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    var suffix = el.getAttribute('data-count-suffix') || '';
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ---- Mobile Nav Toggle (enhanced) ---- */
  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.header-nav__list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

})();
