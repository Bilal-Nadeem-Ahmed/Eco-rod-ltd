// Cookie consent banner + Tidio live chat (loaded only after consent).
// Shared by every page. The banner markup is injected here so pages only need this script.
(function () {
  var KEY = 'eco_rod_cookie_consent';
  var TIDIO_SRC = '//code.tidio.co/s45pcdd6yv1lcgdvykwhbchkw3rimf3y.js';

  function storageGet() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function storageSet(val) {
    try { localStorage.setItem(KEY, val); } catch (e) { /* storage unavailable */ }
  }
  function storageClear() {
    try { localStorage.removeItem(KEY); } catch (e) { /* storage unavailable */ }
  }

  function ensureBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) return b;
    b = document.createElement('div');
    b.id = 'cookie-banner';
    b.className = 'cookie-banner';
    b.hidden = true;
    b.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<p class="cookie-banner-text">We use cookies to provide live chat (Tidio) and analytics (Google). ' +
        'Only necessary cookies run until you accept. <a href="/privacy-policy">Privacy Policy</a></p>' +
        '<div class="cookie-banner-actions">' +
          '<button id="cookie-accept" class="cookie-btn cookie-btn-accept">Accept all</button>' +
          '<button id="cookie-decline" class="cookie-btn cookie-btn-decline">Necessary only</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(b);
    return b;
  }

  function loadTidio() {
    // Lift the floating WhatsApp button above the Tidio launcher.
    document.documentElement.classList.add('has-tidio');
    if (document.querySelector('script[src*="tidio"]')) return;
    var s = document.createElement('script');
    s.src = TIDIO_SRC;
    s.async = true;
    document.body.appendChild(s);
  }

  function showBanner() {
    var b = ensureBanner();
    b.hidden = false;
    requestAnimationFrame(function () { b.classList.add('cookie-banner-visible'); });
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (!b) return;
    b.classList.remove('cookie-banner-visible');
    setTimeout(function () { b.hidden = true; }, 300);
  }

  function saveConsent(val) {
    storageSet(val);
    hideBanner();
    if (val === 'accepted') loadTidio();
  }

  ensureBanner();
  document.getElementById('cookie-accept').addEventListener('click', function () { saveConsent('accepted'); });
  document.getElementById('cookie-decline').addEventListener('click', function () { saveConsent('declined'); });

  document.querySelectorAll('.js-manage-cookies, #manage-cookies').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      storageClear();
      showBanner();
    });
  });

  var consent = storageGet();
  if (consent === 'accepted') {
    loadTidio();
  } else if (!consent) {
    setTimeout(showBanner, 900);
  }
})();
