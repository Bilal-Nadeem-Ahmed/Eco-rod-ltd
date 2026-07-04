(function () {
  var header = document.querySelector('header');
  if (!header) return;

  // Sticky shadow on scroll
  function update() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();

  var collapseEl = document.querySelector('.navbar-collapse');
  var toggler = document.querySelector('.navbar-toggler');
  if (!collapseEl) return;

  // Close entire navbar instantly when a link or dropdown item is clicked
  collapseEl.addEventListener('click', function (e) {
    var isNavLink = e.target.closest('.nav-link:not(.dropdown-toggle)');
    var isDropdownItem = e.target.closest('.dropdown-item');
    if (!isNavLink && !isDropdownItem) return;
    if (!collapseEl.classList.contains('show')) return;

    collapseEl.querySelectorAll('.dropdown-menu.show').forEach(function (m) {
      m.classList.remove('show');
    });
    collapseEl.querySelectorAll('.dropdown-toggle').forEach(function (t) {
      t.classList.remove('show');
      t.setAttribute('aria-expanded', 'false');
    });
    collapseEl.querySelectorAll('.nav-item.dropdown.show').forEach(function (d) {
      d.classList.remove('show');
    });

    collapseEl.classList.remove('show', 'collapsing');
    if (toggler) toggler.setAttribute('aria-expanded', 'false');
  });

  // Smooth close animation when the dropdown is toggled shut (not when navigating away)
  document.addEventListener('hide.bs.dropdown', function (e) {
    if (window.innerWidth >= 992) return;

    var toggle = e.target;
    var dropdownEl = toggle.closest('.dropdown');
    if (!dropdownEl) return;
    var menu = dropdownEl.querySelector('.dropdown-menu');
    if (!menu || !menu.classList.contains('show')) return;

    e.preventDefault();
    menu.classList.add('closing');

    setTimeout(function () {
      menu.classList.remove('show', 'closing');
      toggle.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      dropdownEl.classList.remove('show');
    }, 200);
  });
})();
