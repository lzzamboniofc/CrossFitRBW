import { esc, atributosExternos, confirmado } from '../lib.mjs';

/** Exibe somente avaliações reais e verificáveis. Sem avaliações confirmadas, a seção não existe
 *  (nem no modo demonstração: depoimentos não são simulados). */
export default function avaliacoes(ctx) {
  const a = ctx.cfg.avaliacoes;
  const itens = a.itens.filter(confirmado);
  if (!itens.length) return null;

  const estrelas = (n) =>
    `<span class="stars" role="img" aria-label="Nota ${n} de 5">${'★'.repeat(Math.round(n))}<span aria-hidden="true" class="stars__off">${'★'.repeat(5 - Math.round(n))}</span></span>`;

  return {
    id: 'avaliacoes',
    menu: 'Avaliações',
    html: `
<section class="section section--light avaliacoes" id="avaliacoes" aria-labelledby="avaliacoes-titulo">
  <div class="wrap">
    <header class="section__head reveal">
      <div>
        <p class="eyebrow">Avaliações</p>
        <h2 class="h2" id="avaliacoes-titulo">${esc(a.titulo)}</h2>
      </div>
      ${a.linkPerfil ? `<a class="link" href="${esc(a.linkPerfil)}" ${atributosExternos}>Ver todas no Google</a>` : ''}
    </header>
    <ul class="reviews" role="list">
      ${itens
        .map(
          (r) => `<li class="review reveal">
        <blockquote><p>${esc(r.texto)}</p></blockquote>
        <p class="review__meta">${estrelas(r.nota)} <strong>${esc(r.nome)}</strong> · ${esc(r.origem)}</p>
      </li>`
        )
        .join('')}
    </ul>
  </div>
</section>`,
  };
}
