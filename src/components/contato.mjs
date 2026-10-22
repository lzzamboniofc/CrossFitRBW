import { esc, botaoAcao, enderecoLinha, linkRota, linkMapaEmbed, icone, atributosExternos } from '../lib.mjs';

export default function contato(ctx) {
  const { cfg, mostrar, selo } = ctx;
  const { endereco, cep, telefone, whatsapp, email, mapa } = cfg.contato;
  const enderecoOk = mostrar(endereco);
  const h = cfg.horarios;

  const quadro = mostrar(h)
    ? `<div class="board reveal" aria-labelledby="horarios-titulo">
        <h3 class="board__title" id="horarios-titulo">Horário de funcionamento ${selo(h)}</h3>
        <dl class="board__list">
          ${h.dias
            .map(
              (d) => `<div class="board__row">
            <dt>${esc(d.dia)}</dt>
            <dd>${d.faixas.length ? d.faixas.map(([a, b]) => `<span><time>${a}</time>–<time>${b}</time></span>`).join('') : '<span class="board__off">Fechado</span>'}</dd>
          </div>`
            )
            .join('')}
        </dl>
        ${h.observacao ? `<p class="board__note">${esc(h.observacao)}</p>` : ''}
      </div>`
    : '';

  const canais = [];
  if (mostrar(telefone) && telefone.valor) {
    canais.push(`<li><a class="link" href="${esc(telefone.link)}">${icone('telefone')}<span>${esc(telefone.valor)}</span></a> ${selo(telefone)}</li>`);
  }
  if (whatsapp.numero && mostrar(whatsapp)) {
    canais.push(`<li><a class="link" href="https://wa.me/${esc(whatsapp.numero)}" ${atributosExternos}>${icone('telefone')}<span>WhatsApp</span></a> ${selo(whatsapp)}</li>`);
  }
  if (email.valor && mostrar(email)) {
    canais.push(`<li><a class="link" href="mailto:${esc(email.valor)}"><span>${esc(email.valor)}</span></a> ${selo(email)}</li>`);
  }
  cfg.redes.filter(mostrar).forEach((r) => {
    canais.push(`<li><a class="link" href="${esc(r.url)}" ${atributosExternos}>${icone('instagram')}<span>${esc(r.usuario)}</span></a></li>`);
  });

  const mapaAtivo = enderecoOk && mostrar(mapa);

  return {
    id: 'contato',
    menu: 'Contato',
    html: `
<section class="section section--dark contato" id="contato" aria-labelledby="contato-titulo">
  <div class="wrap contato__grid">
    <div class="contato__info reveal">
      <p class="eyebrow">Contato e localização</p>
      <h2 class="h2" id="contato-titulo">Venha treinar no box</h2>
      ${
        enderecoOk
          ? `<address class="contato__end">
        <span class="contato__end-l">${esc(endereco.logradouro)}, ${esc(endereco.numero)}</span>
        <span>${esc(endereco.bairro)} · ${esc(endereco.cidade)} – ${esc(endereco.uf)}</span>
        ${mostrar(cep) ? `<span>CEP ${esc(cep.valor)} ${selo(cep)}</span>` : ''}
        ${endereco.referencia ? `<span class="contato__ref">${esc(endereco.referencia)}</span>` : ''}
      </address>`
          : ''
      }
      <div class="contato__actions">
        ${botaoAcao(ctx, { rastreio: 'contato' })}
        ${mapaAtivo ? `<a class="btn btn--ghost" href="${esc(linkRota(cfg))}" ${atributosExternos}>${icone('pino')}<span>Como chegar</span></a>` : ''}
      </div>
      ${ctx.selos && !cfg.acao.confirmado ? `<p class="contato__nota">Botão de ação aponta para o Direct do Instagram. Canal oficial <span class="tbc">A confirmar</span></p>` : ''}
      ${canais.length ? `<ul class="contato__canais" role="list">${canais.join('')}</ul>` : ''}
    </div>
    ${quadro}
    ${
      mapaAtivo
        ? `<div class="map reveal" data-map data-src="${esc(linkMapaEmbed(cfg))}">
      <div class="map__facade">
        <svg class="map__grid" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M-10 140 L180 60 L420 120 M60 -10 L130 210 M250 -10 L300 210 M-10 40 L410 30 M-10 190 L410 170" />
        </svg>
        <span class="map__pin" aria-hidden="true">${icone('pino')}</span>
        <div class="map__copy">
          <p class="map__addr">${esc(enderecoLinha(endereco))}</p>
          <button type="button" class="btn btn--light" data-map-load><span>Mostrar mapa</span></button>
          <p class="map__hint">O mapa é carregado do Google Maps somente após o clique.</p>
        </div>
      </div>
    </div>`
        : ''
    }
  </div>
</section>`,
  };
}
