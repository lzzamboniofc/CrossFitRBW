import { esc, foto, espacoFoto, confirmado } from '../lib.mjs';

export default function galeria(ctx) {
  const { cfg, demo } = ctx;
  const g = cfg.galeria;
  const fotos = g.fotos.filter((f) => f.arquivo && (confirmado(f) || demo));

  let conteudo = '';
  if (fotos.length) {
    conteudo = `<ul class="gallery" role="list" data-lightbox>
      ${fotos
        .map(
          (f, i) => `<li class="gallery__item reveal">
        <button type="button" class="gallery__btn" data-index="${i}" data-src="${esc(f.arquivo)}" data-alt="${esc(f.alt)}" data-w="${f.largura || ''}" data-h="${f.altura || ''}" aria-label="Ampliar foto: ${esc(f.alt)}">
          ${foto(f, { sizes: '(min-width: 1100px) 33vw, (min-width: 640px) 50vw, 100vw' })}
        </button>
      </li>`
        )
        .join('')}
    </ul>`;
  } else if (demo) {
    const proporcoes = ['4 / 5', '3 / 2', '1 / 1', '3 / 2', '4 / 5', '3 / 2'];
    conteudo = `<ul class="gallery gallery--demo" role="list">
      ${Array.from({ length: g.espacosDemonstracao }, (_, i) => `<li class="gallery__item">${espacoFoto('foto do box', proporcoes[i % proporcoes.length])}</li>`).join('')}
    </ul>
    ${ctx.selos ? '<p class="gallery__note">Espaço para fotos reais do box, das aulas e da comunidade. <span class="tbc">A confirmar</span></p>' : ''}`;
  } else {
    return null;
  }

  return {
    id: 'galeria',
    menu: 'Galeria',
    html: `
<section class="section section--dark galeria" id="galeria" aria-labelledby="galeria-titulo">
  <div class="wrap">
    <header class="section__head reveal">
      <div>
        <p class="eyebrow">Galeria</p>
        <h2 class="h2" id="galeria-titulo">${esc(g.titulo)}</h2>
      </div>
    </header>
    ${conteudo}
  </div>
</section>`,
  };
}
