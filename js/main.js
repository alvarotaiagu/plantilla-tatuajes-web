/* ==========================================================================
   Papel Vegetal — estudio de tatuaje (SITIO DE DEMOSTRACIÓN, negocio ficticio)
   Concepto «Calco»: el movimiento imita el oficio. La línea se traza como si
   la estuvieran calcando, la tinta entra después y la banda avanza con el
   scroll como el papel bajo la mano.

   - `has-motion` solo se enciende si GSAP y ScrollTrigger existen de verdad.
   - `motion` y `gsapReady` son banderas distintas: con prefers-reduced-motion
     el contenido sigue vivo (estado del estudio, contadores, acordeón).
   - La cortina de entrada se quita SIEMPRE, haya GSAP o no: si no, taparía
     la página entera cuando falle el CDN.
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var motion = gsapReady && !reduce.matches;

  if (gsapReady) {
    gsap.registerPlugin(ScrollTrigger);
    if (motion) raiz.classList.add('has-motion');
  }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── 1. Scroll suave ─────────────────────────────────────────────────── */
  var lenis = null;
  if (motion && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var destino = document.getElementById(id.slice(1));
      if (!destino) return;
      e.preventDefault();
      cerrarMenu();
      if (lenis) lenis.scrollTo(destino, { offset: -70 });
      else destino.scrollIntoView();
      destino.setAttribute('tabindex', '-1');
      destino.focus({ preventScroll: true });
    });
  });

  /* ── 2. Cortina de entrada ───────────────────────────────────────────── */
  (function cortina() {
    var el = $('[data-cortina]');
    if (!el) return;
    function quitar() { el.hidden = true; }

    if (!motion) { quitar(); return; }

    var trazos = $$('path', el);
    var tl = gsap.timeline({ onComplete: quitar });
    tl.to(trazos, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.07 })
      .to(el, { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '+=0.15');

    // red de seguridad: pase lo que pase, la cortina se va
    setTimeout(quitar, 4000);
  })();

  /* ── 3. Titulares palabra a palabra ──────────────────────────────────── */
  function partirEnPalabras(el) {
    var original = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', original);
    el.textContent = '';
    var trozos = original.split(' ');
    var palabras = [];
    trozos.forEach(function (p, i) {
      var s = document.createElement('span');
      s.className = 'palabra';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = p;
      el.appendChild(s);
      if (i < trozos.length - 1) el.appendChild(document.createTextNode(' '));
      palabras.push(s);
    });
    return palabras;
  }

  if (motion) {
    $$('[data-palabras]').forEach(function (el) {
      var palabras = partirEnPalabras(el);
      gsap.set(palabras, { yPercent: 40, opacity: 0 });
      var comun = { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.05 };
      if (el.closest('.hero')) {
        gsap.to(palabras, Object.assign({ delay: 1.5 }, comun));
      } else {
        gsap.to(palabras, Object.assign({
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }, comun));
      }
    });
  }

  /* ── 4. El trazo se dibuja (recurso protagonista) ────────────────────── */
  if (motion) {
    $$('.dibujo').forEach(function (svg) {
      var trazos = $$('.trazo > *', svg);
      if (!trazos.length) return;
      var enHero = !!svg.closest('.hero');
      var tl = gsap.timeline(enHero
        ? { delay: 1.4 }
        : { scrollTrigger: { trigger: svg, start: 'top 85%', once: true } });
      tl.to(trazos, {
        strokeDashoffset: 0,
        duration: enHero ? 1.5 : 1.1,
        ease: 'power1.inOut',
        stagger: enHero ? 0.06 : 0.02
      });
      // el flash del hero se entinta solo, como cuando se pasa el calco
      if (enHero) {
        tl.to($$('.tinta', svg), { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');
      }
    });
  }

  /* ── 5. Entradas ─────────────────────────────────────────────────────── */
  if (motion) {
    // Ojo: `.pieza` lleva 0 de desplazamiento a propósito. Su eje Y ya lo mueve
    // el parallax de la hoja de flash, y dos tweens sobre la misma propiedad se
    // pelean.
    [['.kicker', 14], ['.indice', 14], ['.parrafo', 16], ['.hero__entrada', 16],
     ['.hero__acciones', 16], ['.hero__datos', 16], ['.pieza', 0], ['.ficha', 22],
     ['.tabla tr', 14], ['.condiciones', 22], ['.lista', 22], ['.acordeon details', 14]
    ].forEach(function (par) {
      $$(par[0]).forEach(function (el, i) {
        var enHero = !!el.closest('.hero');
        var ajustes = {
          opacity: 1, duration: 0.7, ease: 'power2.out',
          delay: enHero ? 1.6 + i * 0.06 : (i % 4) * 0.05,
          scrollTrigger: enHero ? null : { trigger: el, start: 'top 92%', once: true }
        };
        if (par[1]) { ajustes.y = 0; ajustes.startAt = { y: par[1] }; }
        gsap.to(el, ajustes);
      });
    });
  }

  /* ── 6. Banda diagonal ligada al scroll ──────────────────────────────── */
  (function banda() {
    var pista = $('[data-banda]');
    if (!pista || !motion) return;
    var x = 0, ancho = pista.scrollWidth / 3, extra = 0, dir = 1;

    ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom',
      onUpdate: function (self) {
        dir = self.direction || 1;
        extra = Math.min(Math.abs(self.getVelocity()) / 240, 16);
      }
    });

    gsap.ticker.add(function () {
      x -= (1.2 + extra) * dir;
      if (ancho > 0) {
        if (x <= -ancho) x += ancho;
        if (x > 0) x -= ancho;
      }
      pista.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
    });
    window.addEventListener('resize', function () { ancho = pista.scrollWidth / 3; });
  })();

  /* ── 7. La hoja de flash se desencaja: cada columna a su ritmo ───────── */
  if (motion && window.matchMedia('(min-width: 621px)').matches) {
    $$('.pieza').forEach(function (el) {
      var col = parseInt(el.getAttribute('data-col') || '1', 10);
      var desplaza = [0, -70, 34, -20][col] || 0;
      gsap.to(el, {
        y: desplaza, ease: 'none',
        scrollTrigger: { trigger: '[data-flash]', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
    });
  }

  /* ── 8. Los pasos se subrayan al llegar ──────────────────────────────── */
  if (motion) {
    $$('.paso').forEach(function (el) {
      ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: function () { el.classList.add('esta-visto'); } });
    });
  } else {
    $$('.paso').forEach(function (el) { el.classList.add('esta-visto'); });
  }

  /* ── 9. Contadores ───────────────────────────────────────────────────── */
  $$('[data-contador]').forEach(function (el) {
    var fin = parseFloat(el.getAttribute('data-contador'));
    var sufijo = el.getAttribute('data-sufijo') || '';
    if (!motion) { el.textContent = fin + sufijo; return; }
    var obj = { v: 0 };
    gsap.to(obj, {
      v: fin, duration: 1.2, ease: 'power2.out', delay: 1.8,
      onUpdate: function () { el.textContent = Math.round(obj.v) + sufijo; }
    });
  });

  /* ── 10. Botones magnéticos ──────────────────────────────────────────── */
  if (motion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('[data-iman]').forEach(function (el) {
      var qx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
      var qy = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
      el.addEventListener('pointermove', function (e) {
        var c = el.getBoundingClientRect();
        qx((e.clientX - (c.left + c.width / 2)) * 0.3);
        qy((e.clientY - (c.top + c.height / 2)) * 0.4);
      });
      el.addEventListener('pointerleave', function () { qx(0); qy(0); });
      el.addEventListener('blur', function () { qx(0); qy(0); });
    });
  }

  /* ── 11. Cursor: la mirilla del calco ────────────────────────────────── */
  (function cursor() {
    var el = $('[data-cursor]');
    if (!el || !motion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var texto = $('.cursor__texto', el);
    var qx = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3.out' });
    var qy = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3.out' });
    window.addEventListener('pointermove', function (e) { qx(e.clientX); qy(e.clientY); });

    var zonas = [
      ['.pieza', 'entintar'],
      ['.hero__flash', 'a la piel'],
      ['summary', 'abrir'],
      ['[data-mapa-boton]', 'cargar'],
      ['a, button, input, textarea, select', 'venga']
    ];
    document.addEventListener('pointerover', function (e) {
      for (var i = 0; i < zonas.length; i++) {
        if (e.target.closest(zonas[i][0])) {
          el.classList.add('es-grande');
          texto.textContent = zonas[i][1];
          return;
        }
      }
      el.classList.remove('es-grande');
      texto.textContent = '';
    });
  })();

  /* ── 12. Estado del estudio, en vivo ─────────────────────────────────── */
  (function estudio() {
    // Martes (2) a sábado (6), de 11:00 a 20:00. Horario ficticio.
    var estado = $('[data-estado]');
    if (!estado) return;
    var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    function refrescar() {
      var ahora = new Date();
      var d = ahora.getDay();
      var min = ahora.getHours() * 60 + ahora.getMinutes();
      var abre = 660, cierra = 1200;
      var hoyAbre = d >= 2 && d <= 6;

      if (hoyAbre && min >= abre && min < cierra) {
        estado.textContent = 'Abierto ahora · hasta las 20:00';
        estado.classList.add('esta-abierto');
      } else {
        var salto = 1;
        while (salto < 8) {
          var dd = (d + salto) % 7;
          if (dd >= 2 && dd <= 6) break;
          salto++;
        }
        var siguiente = (hoyAbre && min < abre) ? 'hoy' : 'el ' + DIAS[(d + salto) % 7];
        estado.textContent = 'Cerrado · abre ' + siguiente + ' a las 11:00';
        estado.classList.remove('esta-abierto');
      }
    }
    refrescar();
    setInterval(refrescar, 30000);
  })();

  /* ── 13. Cabecera ────────────────────────────────────────────────────── */
  (function cabecera() {
    var el = $('[data-cabecera]');
    if (!el) return;
    function mirar() { el.classList.toggle('esta-pegada', window.scrollY > 20); }
    mirar();
    window.addEventListener('scroll', mirar, { passive: true });
  })();

  /* ── 14. Menú móvil ──────────────────────────────────────────────────── */
  var boton = $('[data-menu-boton]');
  var menu = $('[data-menu]');
  function cerrarMenu() {
    if (!boton || !menu) return;
    boton.setAttribute('aria-expanded', 'false');
    menu.classList.remove('esta-abierto');
  }
  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abiertoYa = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abiertoYa));
      menu.classList.toggle('esta-abierto', !abiertoYa);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });
  }

  /* ── 15. Mapa solo bajo clic ─────────────────────────────────────────── */
  (function mapa() {
    var caja = $('[data-mapa]');
    var btn = $('[data-mapa-boton]');
    if (!caja || !btn) return;
    btn.addEventListener('click', function () {
      var marco = document.createElement('iframe');
      marco.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Travesa da Calcografía 3, Santiago de Compostela') + '&output=embed';
      marco.title = 'Mapa de la dirección de muestra: Travesa da Calcografía, 3, Santiago de Compostela';
      marco.loading = 'lazy';
      marco.referrerPolicy = 'no-referrer-when-downgrade';
      btn.remove();
      caja.insertBefore(marco, caja.firstChild);
      if (gsapReady) ScrollTrigger.refresh();
    });
  })();

  /* ── 16. Formulario de cita (de muestra) ─────────────────────────────── */
  (function cita() {
    var form = $('[data-cita]');
    if (!form) return;
    var salida = $('[data-cita-estado]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = form.querySelector('#nombre');
      var mayor = form.querySelector('#mayor');
      if (!nombre.value.trim()) {
        salida.textContent = 'Escribe un nombre para poder contestarte.';
        nombre.focus();
        return;
      }
      if (!mayor.checked) {
        salida.textContent = 'Solo tatuamos a mayores de 18 años: marca la casilla.';
        mayor.focus();
        return;
      }
      salida.textContent = 'Formulario de demostración: la petición de ' + nombre.value.trim() + ' no se ha enviado a ningún sitio.';
    });
  })();

  /* ── 17. Aviso de cookies ────────────────────────────────────────────── */
  (function cookies() {
    var banner = $('[data-cookies]');
    if (!banner) return;
    var CLAVE = 'papelvegetal-cookies';
    var visto = null;
    try { visto = localStorage.getItem(CLAVE); } catch (err) { visto = null; }
    if (!visto) banner.hidden = false;
    var ok = $('[data-cookies-ok]', banner);
    if (ok) {
      ok.addEventListener('click', function () {
        banner.hidden = true;
        try { localStorage.setItem(CLAVE, '1'); } catch (err) { /* modo privado */ }
      });
    }
  })();

  /* ── 18. Refrescos ───────────────────────────────────────────────────── */
  if (gsapReady) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
