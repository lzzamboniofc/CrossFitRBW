import { esc, assinatura, botaoAcao, icone, atributosExternos, enderecoLinha, confirmado } from '../lib.mjs';

export function cabecalho(ctx, menu, { base = '' } = {}) {
  const links = menu.map((m) => `<li><a href="${base}#${m.id}">${esc(m.menu)}</a></li>`).join('');
  return `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="header" data-header>
  <div class="wrap header__inner">
    <a class="header__brand" href="${base || './'}#inicio" aria-label="${esc(ctx.cfg.negocio.nome)} — início">${assinatura(ctx)}</a>
    <nav class="nav" aria-label="Principal">
      <ul class="nav__list" role="list">${links}</ul>
    </nav>
    <div class="header__cta">${botaoAcao(ctx, { classe: 'btn btn--primary btn--sm', rotulo: ctx.cfg.acao.rotuloCurto, rastreio: 'header' })}</div>
    <button type="button" class="burger" aria-expanded="false" aria-controls="menu-mobile" data-burger>
      <span class="sr-only">Abrir menu</span><span class="burger__bars" aria-hidden="true"></span>
    </button>
  </div>
</header>
<div class="mnav" id="menu-mobile" data-mnav>
  <nav aria-label="Menu mobile">
    <ul class="mnav__list" role="list">${links}</ul>
  </nav>
  <div class="mnav__foot">
    ${botaoAcao(ctx, { rastreio: 'menu-mobile' })}
    ${ctx.cfg.redes.filter(confirmado).map((r) => `<a class="link" href="${esc(r.url)}" ${atributosExternos}>${icone('instagram')}<span>${esc(r.usuario)}</span></a>`).join('')}
  </div>
</div>`;
}

export function rodape(ctx, menu, { base = '' } = {}) {
  const { cfg, mostrar } = ctx;
  const ano = new Date().getFullYear();
  const end = cfg.contato.endereco;
  const cnpj = cfg.negocio.cnpj;
  const cred = cfg.creditos;
  return `
<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        ${assinatura(ctx)}
        <p>${esc(cfg.negocio.descricaoCurta)}</p>
        ${botaoAcao(ctx, { classe: 'btn btn--primary btn--sm', rotulo: cfg.acao.rotuloCurto, rastreio: 'rodape' })}
      </div>
      <nav class="footer__col" aria-label="Rodapé">
        <h2 class="label">Navegação</h2>
        <ul role="list">${menu.map((m) => `<li><a href="${base}#${m.id}">${esc(m.menu)}</a></li>`).join('')}</ul>
      </nav>
      <div class="footer__col">
        <h2 class="label">Onde estamos</h2>
        ${mostrar(end) ? `<p>${esc(enderecoLinha(end))}</p>` : ''}
        <ul role="list">
          ${cfg.redes.filter(mostrar).map((r) => `<li><a href="${esc(r.url)}" ${atributosExternos}>${esc(r.nome)} ${esc(r.usuario)}</a></li>`).join('')}
        </ul>
      </div>
    </div>
    <p class="footer__mark" aria-hidden="true">${esc(cfg.negocio.nomeCurto)}</p>
    <div class="footer__bottom">
      <p>© ${ano} ${esc(cfg.negocio.nome)}${mostrar(cnpj) ? ` · CNPJ ${esc(cnpj.valor)}` : ''}</p>
      <p><a href="${base}privacidade.html">Política de privacidade</a></p>
      ${cred.nome ? `<p>${esc(cred.texto)} ${cred.url ? `<a href="${esc(cred.url)}" ${atributosExternos}>${esc(cred.nome)}</a>` : esc(cred.nome)}</p>` : ''}
    </div>
    <p class="footer__legal">CrossFit® é marca registrada da CrossFit, LLC.</p>
  </div>
</footer>`;
}

export function ctaFlutuante(ctx) {
  return `<div class="fab" data-fab inert>${botaoAcao(ctx, { classe: 'btn btn--primary btn--block', rotulo: ctx.cfg.acao.rotuloCurto, rastreio: 'flutuante' })}</div>`;
}

export function seloModo(ctx) {
  return ctx.demo
    ? `<aside class="demo-flag" aria-label="Aviso de demonstração"><strong>Modo demonstração</strong><span>Itens “A confirmar” ficam ocultos na versão pública.</span></aside>`
    : '';
}
