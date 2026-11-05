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

  function updateConsentMode(val) {
    window.dataLayer = window.dataLayer || [];
    // gtag must push the arguments object itself for GTM to read it as a consent command.
    if (typeof window.gtag !== 'function') window.gtag = function () { window.dataLayer.push(arguments); };
    var v = val === 'accepted' ? 'granted' : 'denied';
    window.gtag('consent', 'update', { analytics_storage: v, ad_storage: v, ad_user_data: v, ad_personalization: v });
  }

  function saveConsent(val) {
    storageSet(val);
    hideBanner();
    updateConsentMode(val);
    if (val === 'accepted') loadTidio();
  }

  // ---- Conversion and engagement events for Google Tag Manager ----
  function pageType() {
    var p = location.pathname;
    if (p === '/' || p === '/index.html') return 'home';
    if (p.indexOf('/services/') === 0) return 'service';
    if (p.indexOf('/areas/') === 0) return 'area';
    return 'other';
  }

  function linkLocation(el) {
    if (el.classList && el.classList.contains('whatsapp-float')) return 'floating_button';
    if (el.closest('.top-bar')) return 'top_bar';
    if (el.closest('header, nav')) return 'header';
    if (el.closest('.hero-service, .hero')) return 'hero';
    if (el.closest('.sc-cta')) return 'cta_strip';
    if (el.closest('.sc-price')) return 'prices';
    if (el.closest('#contact, .contact-section, .service-contact')) return 'contact_section';
    if (el.closest('footer, #footer')) return 'footer';
    return 'page_body';
  }

  function track(event, extra) {
    window.dataLayer = window.dataLayer || [];
    var data = { event: event, page_type: pageType(), page_path: location.pathname };
    for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) data[k] = extra[k]; }
    window.dataLayer.push(data);
  }
  window.ecoTrack = track;

  // Phone, WhatsApp, email and "contact us" button clicks anywhere on the page.
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var event = null;
    if (href.indexOf('tel:') === 0) event = 'phone_click';
    else if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) event = 'whatsapp_click';
    else if (href.indexOf('mailto:') === 0 && href.indexOf('apexdigital') === -1) event = 'email_click';
    else if (/#contact$/.test(href)) event = 'contact_cta_click';
    if (!event) return;
    track(event, {
      link_url: href,
      link_text: (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      link_location: linkLocation(a)
    });
  }, true);

  // Form started (first interaction) so we can compare starts with successful sends.
  var formStarted = false;
  document.addEventListener('focusin', function (e) {
    if (formStarted || !e.target.closest || !e.target.closest('#contact-form')) return;
    formStarted = true;
    track('form_start', { form_id: 'contact-form' });
  });

  // Tidio live chat opened (only loads after cookie consent).
  document.addEventListener('tidioChat-ready', function () {
    try {
      window.tidioChatApi.on('open', function () { track('chat_open', {}); });
    } catch (err) { /* Tidio API unavailable */ }
  });

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
