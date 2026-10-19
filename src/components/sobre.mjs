import { esc, fotoOuEspaco } from '../lib.mjs';

export default function sobre(ctx) {
  const { cfg, mostrar, selo } = ctx;
  const s = cfg.sobre;
  if (!s.visivel) return null;

  const paragrafos = s.paragrafos.filter(mostrar);
  if (!paragrafos.length) return null;

  const imagens = s.imagens
    .filter((img) => (img.arquivo ? mostrar(img) : ctx.demo))
    .map((img, i) => `<figure class="sobre__fig sobre__fig--${i ? 'b' : 'a'} reveal">${fotoOuEspaco(ctx, img, { proporcao: i ? '1 / 1' : '4 / 3', sizes: '(min-width: 900px) 40vw, 90vw' })}</figure>`)
    .join('');

  const est = s.estrutura;
  const estrutura = mostrar(est)
    ? `<div class="sobre__estrutura reveal">
        <h3 class="label">${esc(est.titulo)} ${selo(est)}</h3>
        <ul class="tags">${est.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>`
    : '';

  return {
    id: 'sobre',
    menu: 'O box',
    html: `
<section class="section section--light sobre" id="sobre" aria-labelledby="sobre-titulo">
  <div class="wrap sobre__grid">
    <header class="sobre__head reveal">
      <p class="eyebrow">O box</p>
      <h2 class="h2" id="sobre-titulo">${esc(s.titulo)}</h2>
    </header>
    <div class="sobre__body">
      ${paragrafos.map((p) => `<p class="lead reveal">${esc(p.texto)} ${selo(p)}</p>`).join('')}
      ${estrutura}
    </div>
    ${imagens ? `<div class="sobre__media">${imagens}</div>` : ''}
  </div>
</section>`,
  };
}
