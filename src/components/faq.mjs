import { esc, icone } from '../lib.mjs';

export default function faq(ctx) {
  const { cfg, mostrar, selo } = ctx;
  const f = cfg.faq;
  const itens = f.itens.filter(mostrar);
  if (!itens.length) return null;

  return {
    id: 'duvidas',
    menu: 'Dúvidas',
    faqConfirmadas: itens.filter((i) => i.confirmado !== false),
    html: `
<section class="section section--light faq" id="duvidas" aria-labelledby="duvidas-titulo">
  <div class="wrap faq__grid">
    <header class="faq__head reveal">
      <p class="eyebrow">Dúvidas</p>
      <h2 class="h2" id="duvidas-titulo">${esc(f.titulo)}</h2>
    </header>
    <div class="accordion" data-accordion>
      ${itens
        .map(
          (q, i) => `<div class="acc reveal">
        <h3 class="acc__h">
          <button type="button" class="acc__btn" id="faq-b${i}" aria-expanded="false" aria-controls="faq-p${i}">
            <span>${esc(q.pergunta)} ${selo(q)}</span>${icone('mais')}
          </button>
        </h3>
        <div class="acc__panel" id="faq-p${i}" role="region" aria-labelledby="faq-b${i}">
          <div class="acc__inner"><p>${esc(q.resposta)}</p></div>
        </div>
      </div>`
        )
        .join('')}
    </div>
  </div>
</section>`,
  };
}
