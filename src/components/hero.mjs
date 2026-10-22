import { esc, botaoAcao, foto, icone, confirmado } from '../lib.mjs';

export default function hero(ctx) {
  const { cfg, demo } = ctx;
  const h = cfg.hero;
  const temFoto = Boolean(h.imagem.arquivo) && (confirmado(h.imagem) || demo);

  const midia = temFoto
    ? `<div class="hero__media">${foto({ ...h.imagem, largura: h.imagem.largura || 1600, altura: h.imagem.altura || 1100 }, { prioridade: true, lazy: false, classe: 'hero__img' })}</div>`
    : '';

  const parceiros = cfg.servicos.itens.find((s) => /wellhub/i.test(s.nome) && confirmado(s));

  return {
    id: 'inicio',
    html: `
<section class="hero${temFoto ? ' hero--foto' : ''}" id="inicio" aria-labelledby="hero-titulo">
  ${midia}
  <div class="hero__art" aria-hidden="true">
    <svg class="hero__plate" viewBox="0 0 600 600">
      <circle cx="300" cy="300" r="292" />
      <circle cx="300" cy="300" r="250" />
      <circle cx="300" cy="300" r="128" />
      <circle cx="300" cy="300" r="46" class="hero__plate-hub" />
    </svg>
  </div>
  <div class="wrap hero__inner">
    <p class="eyebrow hero__eyebrow" data-anim="1">${esc(h.sobretitulo)}</p>
    <h1 class="hero__title" id="hero-titulo">
      <span class="sr-only">${esc(cfg.negocio.nome)} — </span>
      ${h.titulo.map((l, i) => `<span class="hero__line${i === h.titulo.length - 1 ? ' hero__line--accent' : ''}" data-anim="${i + 2}">${esc(l)}</span>`).join('')}
    </h1>
    <p class="hero__text" data-anim="4">${esc(h.texto)}</p>
    <div class="hero__actions" data-anim="5">
      ${botaoAcao(ctx, { rastreio: 'hero' })}
      <a class="btn btn--ghost" href="#aula"><span>${esc(h.rotuloSecundario)}</span></a>
    </div>
  </div>
  <div class="hero__facts" data-anim="6">
    <div class="wrap hero__facts-inner">
      <p>${icone('pino')}<span>${esc(cfg.contato.endereco.bairro)}, ${esc(cfg.negocio.cidade)} · ${esc(cfg.contato.endereco.referencia.replace(/^A cerca de/, 'a cerca de'))}</span></p>
      ${parceiros ? `<p><span>Parceiro Wellhub e TotalPass</span></p>` : ''}
    </div>
  </div>
  ${ctx.selos && !temFoto ? '<p class="hero__demo-note">Foto real do box a enviar <span class="tbc">A confirmar</span></p>' : ''}
</section>`,
  };
}
