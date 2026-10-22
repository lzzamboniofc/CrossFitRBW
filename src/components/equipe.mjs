import { esc, foto, atributosExternos, icone } from '../lib.mjs';

const iniciais = (nome) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function equipe(ctx) {
  const { cfg, mostrar, selo, demo } = ctx;
  const e = cfg.equipe;
  const membros = e.membros.filter(mostrar);
  if (!membros.length) return null;

  const cards = membros
    .map((m) => {
      const retrato = m.foto
        ? foto({ arquivo: m.foto, alt: `${m.nome}, ${m.funcao} da ${cfg.negocio.nome}`, largura: 800, altura: 1000 }, { sizes: '(min-width: 900px) 25vw, 70vw' })
        : `<div class="member__mono" aria-hidden="true"><span>${esc(iniciais(m.nome))}</span>${ctx.selos ? '<small>Foto a enviar</small>' : ''}</div>`;
      return `
      <li class="member reveal">
        <div class="member__photo">${retrato}</div>
        <h3 class="member__name">${esc(m.nome)} ${selo(m)}</h3>
        <p class="member__role">${esc(m.funcao)}</p>
        ${m.apresentacao ? `<p class="member__bio">${esc(m.apresentacao)}</p>` : ''}
        ${m.instagram ? `<a class="link" href="${esc(m.instagram)}" ${atributosExternos}>${icone('instagram')}<span>Instagram de ${esc(m.nome.split(' ')[0])}</span></a>` : ''}
      </li>`;
    })
    .join('');

  return {
    id: 'equipe',
    menu: 'Equipe',
    html: `
<section class="section section--light equipe" id="equipe" aria-labelledby="equipe-titulo">
  <div class="wrap">
    <header class="section__head reveal">
      <div>
        <p class="eyebrow">Equipe</p>
        <h2 class="h2" id="equipe-titulo">${esc(e.titulo)}</h2>
      </div>
      ${ctx.selos && e.observacao ? `<p class="section__intro">${esc(e.observacao)} <span class="tbc">A confirmar</span></p>` : ''}
    </header>
    <ul class="team" role="list">${cards}</ul>
  </div>
</section>`,
  };
}
