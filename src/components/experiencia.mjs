import { esc, fotoOuEspaco } from '../lib.mjs';

export default function experiencia(ctx) {
  const { cfg, mostrar, selo } = ctx;
  const e = cfg.experiencia;
  if (!e.visivel) return null;
  const momentos = e.momentos.filter(mostrar);
  if (!momentos.length) return null;

  const img = e.imagem.arquivo ? (mostrar(e.imagem) ? e.imagem : null) : e.imagem;
  const midia = img ? fotoOuEspaco(ctx, img, { proporcao: '4 / 5', sizes: '(min-width: 900px) 45vw, 100vw' }) : '';

  return {
    id: 'aula',
    menu: 'A aula',
    html: `
<section class="section section--iron aula" id="aula" aria-labelledby="aula-titulo">
  <div class="wrap aula__grid${midia ? '' : ' aula__grid--solo'}">
    ${midia ? `<div class="aula__media reveal">${midia}</div>` : ''}
    <div class="aula__content">
      <header class="reveal">
        <p class="eyebrow">A aula</p>
        <h2 class="h2" id="aula-titulo">${esc(e.titulo)}</h2>
        <p class="section__intro">${esc(e.intro)}</p>
      </header>
      <ol class="moments" role="list">
        ${momentos
          .map(
            (m) => `<li class="moment reveal">
          <h3 class="moment__t">${esc(m.titulo)} ${selo(m)}</h3>
          <p>${esc(m.texto)}</p>
        </li>`
          )
          .join('')}
      </ol>
    </div>
  </div>
</section>`,
  };
}
