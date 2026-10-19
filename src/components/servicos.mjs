import { esc, botaoAcao } from '../lib.mjs';

export default function servicos(ctx) {
  const { cfg, mostrar, selo } = ctx;
  const s = cfg.servicos;
  const itens = s.itens.filter(mostrar);
  if (!itens.length) return null;

  const linhas = itens
    .map((item) => {
      const meta = [item.duracao, item.preco].filter(Boolean);
      return `
    <li class="srv reveal">
      <h3 class="srv__nome">${esc(item.nome)} ${selo(item)}</h3>
      <div class="srv__body">
        <p>${esc(item.descricao)}</p>
        ${meta.length ? `<p class="srv__meta">${meta.map(esc).join(' · ')}</p>` : ''}
      </div>
    </li>`;
    })
    .join('');

  return {
    id: 'treinos',
    menu: 'Treinos',
    html: `
<section class="section section--dark servicos" id="treinos" aria-labelledby="treinos-titulo">
  <div class="wrap">
    <header class="section__head servicos__head reveal">
      <div>
        <p class="eyebrow">Treinos</p>
        <h2 class="h2" id="treinos-titulo">${esc(s.titulo)}</h2>
      </div>
      <p class="section__intro">${esc(s.intro)}</p>
    </header>
    <ul class="srv-list" role="list">${linhas}</ul>
    <div class="servicos__cta reveal">${botaoAcao(ctx, { rastreio: 'treinos' })}</div>
  </div>
</section>`,
  };
}
