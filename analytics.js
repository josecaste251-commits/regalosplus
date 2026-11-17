/* Google Analytics 4 de Regalos Plus Nic.
   Para activarlo, pega entre las comillas tu ID de medición (empieza con G-),
   por ejemplo: var GA_ID = 'G-ABC123XYZ';
   Mientras esté vacío, no se carga nada y el sitio sigue igual de rápido. */
var GA_ID = '';

(function () {
  'use strict';
  window.track = function () {};
  if (!/^G-[A-Z0-9]+$/i.test(GA_ID)) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false });

  /* La tienda usa direcciones con # (#catalogo, #producto-...), así que
     registramos cada cambio de sección como una página vista. */
  function pageView() {
    var sec = (location.hash || '#inicio').slice(1) || 'inicio';
    gtag('event', 'page_view', {
      page_location: location.href,
      page_path: location.pathname + (location.hash || ''),
      page_title: document.title + (location.hash ? ' | ' + sec : '')
    });
  }
  pageView();
  window.addEventListener('hashchange', pageView);

  /* Eventos que manda la tienda: add_to_cart, view_item, begin_checkout, generate_lead */
  window.track = function (name, params) { gtag('event', name, params || {}); };

  /* Cada clic en un enlace de WhatsApp */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    gtag('event', 'click_whatsapp', {
      link_text: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 80),
      page_path: location.pathname + (location.hash || '')
    });
  }, true);

  /* Cargamos el script de Google después de que la página ya se mostró */
  function load() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  if (document.readyState === 'complete') load();
  else window.addEventListener('load', function () { setTimeout(load, 0); });
})();
