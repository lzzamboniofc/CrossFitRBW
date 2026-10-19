/* CrossFit RBW — interações. Sem dependências. */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Cabeçalho: fundo sólido após o hero ---------- */
  const header = $('[data-header]');
  const hero = $('.hero');
  const atualizaHeader = () => {
    if (!header) return;
    const limite = hero ? Math.min(hero.offsetHeight * 0.18, 140) : 0;
    header.classList.toggle('is-solid', window.scrollY > limite || document.body.classList.contains('menu-open') || !hero);
  };

  /* ---------- Menu mobile ---------- */
  const burger = $('[data-burger]');
  const mnav = $('[data-mnav]');
  let ultimoFoco = null;

  const focaveis = () => [burger, ...$$('a, button', mnav)].filter(Boolean);

  function abrirMenu(abrir) {
    if (!burger || !mnav) return;
    burger.setAttribute('aria-expanded', String(abrir));
    burger.querySelector('.sr-only').textContent = abrir ? 'Fechar menu' : 'Abrir menu';
    mnav.classList.toggle('is-open', abrir);
    document.body.classList.toggle('menu-open', abrir);
    atualizaHeader();
    if (abrir) {
      ultimoFoco = document.activeElement;
      const primeiro = $('a', mnav);
      setTimeout(() => primeiro && primeiro.focus({ preventScroll: true }), 60);
    } else if (ultimoFoco && ultimoFoco !== document.body) {
      burger.focus({ preventScroll: true });
    }
  }

  if (burger && mnav) {
    burger.addEventListener('click', () => abrirMenu(burger.getAttribute('aria-expanded') !== 'true'));
    mnav.addEventListener('click', (e) => {
      if (e.target.closest('a')) abrirMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (!mnav.classList.contains('is-open')) return;
      if (e.key === 'Escape') abrirMenu(false);
      if (e.key === 'Tab') {
        const els = focaveis();
        const i = els.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          els[els.length - 1].focus();
        } else if (!e.shiftKey && i === els.length - 1) {
          e.preventDefault();
          els[0].focus();
        }
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && abrirMenu(false));
  }

  /* ---------- Link ativo no menu ---------- */
  const linksMenu = $$('.nav__list a');
  const secoes = linksMenu.map((a) => $(a.getAttribute('href').replace(/^.*#/, '#'))).filter(Boolean);
  if ('IntersectionObserver' in window && secoes.length) {
    const obsMenu = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((en) => {
          if (!en.isIntersecting) return;
          linksMenu.forEach((a) =>
            a.hash === `#${en.target.id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')
          );
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    secoes.forEach((s) => obsMenu.observe(s));
  }

  /* ---------- Revelação ao rolar ---------- */
  const revelaveis = $$('.reveal');
  if ('IntersectionObserver' in window && !reduz.matches) {
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            obs.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revelaveis.forEach((el) => obs.observe(el));
  } else {
    revelaveis.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- CTA flutuante (mobile) ---------- */
  const fab = $('[data-fab]');
  const contato = $('#contato');
  const footer = $('.footer');
  const atualizaFab = () => {
    if (!fab) return;
    const passouHero = hero ? window.scrollY > hero.offsetHeight * 0.75 : window.scrollY > 300;
    const vh = window.innerHeight;
    const perto = [contato, footer].some((el) => el && el.getBoundingClientRect().top < vh * 0.85);
    const visivel = passouHero && !perto && !document.body.classList.contains('menu-open');
    fab.classList.toggle('is-visible', visivel);
    if (visivel) fab.removeAttribute('inert');
    else fab.setAttribute('inert', '');
  };

  let pendente = false;
  const aoRolar = () => {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(() => {
      atualizaHeader();
      atualizaFab();
      pendente = false;
    });
  };
  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', aoRolar, { passive: true });
  atualizaHeader();
  atualizaFab();

  /* ---------- Accordion (dúvidas) ---------- */
  $$('[data-accordion]').forEach((acc) => {
    acc.addEventListener('click', (e) => {
      const btn = e.target.closest('.acc__btn');
      if (!btn) return;
      const aberto = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!aberto));
      const painel = document.getElementById(btn.getAttribute('aria-controls'));
      if (painel) painel.classList.toggle('is-open', !aberto);
    });
  });

  /* ---------- Mapa sob demanda ---------- */
  $$('[data-map]').forEach((mapa) => {
    const btn = $('[data-map-load]', mapa);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = mapa.dataset.src;
      iframe.title = 'Mapa com a localização do box';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      mapa.appendChild(iframe);
      const facade = $('.map__facade', mapa);
      iframe.addEventListener('load', () => facade && facade.remove(), { once: true });
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Carregando mapa…';
    });
  });

  /* ---------- Galeria ampliável ---------- */
  const lb = $('[data-lb]');
  const grade = $('[data-lightbox]');
  if (lb && grade) {
    const botoes = $$('.gallery__btn', grade);
    const img = $('[data-lb-img]', lb);
    const cap = $('[data-lb-cap]', lb);
    let atual = 0;
    let origem = null;

    const mostrar = (i) => {
      atual = (i + botoes.length) % botoes.length;
      const b = botoes[atual];
      img.src = b.dataset.src;
      img.alt = b.dataset.alt || '';
      if (b.dataset.w) img.width = Number(b.dataset.w);
      if (b.dataset.h) img.height = Number(b.dataset.h);
      cap.textContent = b.dataset.alt || '';
      const multiplas = botoes.length > 1;
      $('[data-lb-prev]', lb).hidden = !multiplas;
      $('[data-lb-next]', lb).hidden = !multiplas;
    };
    const abrir = (i) => {
      origem = document.activeElement;
      mostrar(i);
      lb.hidden = false;
      document.body.classList.add('menu-open');
      requestAnimationFrame(() => lb.classList.add('is-open'));
      $('[data-lb-close]', lb).focus();
    };
    const fechar = () => {
      lb.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      setTimeout(() => {
        lb.hidden = true;
        img.removeAttribute('src');
      }, reduz.matches ? 0 : 250);
      if (origem) origem.focus({ preventScroll: true });
    };

    botoes.forEach((b, i) => b.addEventListener('click', () => abrir(i)));
    $('[data-lb-close]', lb).addEventListener('click', fechar);
    $('[data-lb-prev]', lb).addEventListener('click', () => mostrar(atual - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => mostrar(atual + 1));
    lb.addEventListener('click', (e) => {
      if (e.target === lb) fechar();
    });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') fechar();
      else if (e.key === 'ArrowLeft') mostrar(atual - 1);
      else if (e.key === 'ArrowRight') mostrar(atual + 1);
      else if (e.key === 'Tab') {
        const els = $$('button:not([hidden])', lb);
        const i = els.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          els[els.length - 1].focus();
        } else if (!e.shiftKey && i === els.length - 1) {
          e.preventDefault();
          els[0].focus();
        }
      }
    });
    // gestos de toque
    let x0 = null;
    lb.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener(
      'touchend',
      (e) => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 45 && botoes.length > 1) mostrar(atual + (dx < 0 ? 1 : -1));
        x0 = null;
      },
      { passive: true }
    );
  }
})();
