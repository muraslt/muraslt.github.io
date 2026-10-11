/* Мурад Султанов: лёгкий JS. Без него страница полностью читается. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Плавное появление: сдвиг по вертикали, без прозрачности. */
  var items = document.querySelectorAll('[data-reveal]');
  if (reduce || !hasIO) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Липкая кнопка: после первого экрана и до блока контактов. */
  var sticky = document.getElementById('sticky');
  var hero = document.getElementById('hero');
  var contacts = document.getElementById('contacts');
  if (sticky && hero && contacts && hasIO) {
    var heroOut = false;
    var contactsIn = false;
    var apply = function () { sticky.classList.toggle('is-on', heroOut && !contactsIn); };
    new IntersectionObserver(function (es) {
      heroOut = !es[0].isIntersecting;
      apply();
    }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(function (es) {
      contactsIn = es[0].isIntersecting;
      apply();
    }, { threshold: 0, rootMargin: '0px 0px -25% 0px' }).observe(contacts);
  }

  /* Лёгкий параллакс портрета. */
  var media = document.querySelector('[data-parallax]');
  if (media && !reduce) {
    var ticking = false;
    var limit = window.innerHeight || 800;
    window.addEventListener('resize', function () { limit = window.innerHeight || 800; });
    var update = function () {
      ticking = false;
      var y = window.scrollY || window.pageYOffset || 0;
      if (y > limit * 1.2) return;
      media.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }
})();
