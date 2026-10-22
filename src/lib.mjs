/** Utilitários compartilhados pelos componentes. */

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Um item é considerado confirmado quando não declara `confirmado: false`. */
export const confirmado = (item) => !item || item.confirmado !== false;

/** Contexto de renderização criado no build. */
export function criarContexto(cfg, modo) {
  const demo = modo === 'demonstracao';
  const selos = demo && cfg.exibirSelos !== false;
  return {
    cfg,
    demo,
    /** Avisos de pendência visíveis? (demonstração + exibirSelos) */
    selos,
    /** Deve aparecer? Confirmado sempre; pendente só na demonstração. */
    mostrar: (item) => confirmado(item) || demo,
    /** Selo discreto para itens pendentes (apenas modo demonstração). */
    selo: (item) => (selos && !confirmado(item) ? '<span class="tbc">A confirmar</span>' : ''),
  };
}

/** Destino do botão de ação principal. */
export function linkAcao(cfg) {
  const { acao, contato } = cfg;
  if (acao.canal === 'whatsapp' && contato.whatsapp.numero) {
    const msg = encodeURIComponent(acao.mensagemWhatsApp || '');
    return `https://wa.me/${contato.whatsapp.numero}${msg ? `?text=${msg}` : ''}`;
  }
  return acao.link;
}

export const atributosExternos = 'target="_blank" rel="noopener noreferrer"';

export function botaoAcao(ctx, { classe = 'btn btn--primary', rotulo, rastreio = '' } = {}) {
  const { cfg } = ctx;
  const texto = rotulo || cfg.acao.rotulo;
  const destino = cfg.acao.canal === 'instagram' ? ' (abre o Direct do Instagram)' : '';
  return `<a class="${classe}" href="${esc(linkAcao(cfg))}" ${atributosExternos} data-cta="${esc(rastreio)}" aria-label="${esc(texto + destino)}"><span>${esc(texto)}</span>${icone('seta')}</a>`;
}

export function enderecoLinha(end) {
  return `${end.logradouro}, ${end.numero} – ${end.bairro}, ${end.cidade} – ${end.uf}`;
}

export function linkRota(cfg) {
  const m = cfg.contato.mapa;
  const destino = m.latitude != null && m.longitude != null ? `${m.latitude},${m.longitude}` : m.consulta;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
}

export function linkMapaEmbed(cfg) {
  return `https://www.google.com/maps?q=${encodeURIComponent(cfg.contato.mapa.consulta)}&output=embed`;
}

/** Quadro neutro no lugar de uma foto ainda não enviada (só na demonstração). */
export function espacoFoto(alt, proporcao = '4 / 5', rotulo = 'Foto a enviar') {
  return `<div class="ph" style="aspect-ratio:${proporcao}" role="img" aria-label="Espaço reservado: ${esc(alt)}"><span>${esc(rotulo)}</span></div>`;
}

/** Foto real com dimensões declaradas (evita deslocamento de layout). */
export function foto({ arquivo, alt, largura, altura }, { classe = '', lazy = true, prioridade = false, sizes = '100vw' } = {}) {
  const dims = largura && altura ? ` width="${largura}" height="${altura}"` : '';
  const carregamento = lazy && !prioridade ? ' loading="lazy"' : '';
  const fp = prioridade ? ' fetchpriority="high"' : '';
  return `<img class="${classe}" src="${esc(arquivo)}" alt="${esc(alt)}"${dims}${carregamento}${fp} decoding="async" sizes="${sizes}">`;
}

/** Imagem real se houver; senão espaço reservado na demonstração; senão nada. */
export function fotoOuEspaco(ctx, img, opcoes = {}) {
  if (img && img.arquivo) return foto(img, opcoes);
  if (ctx.demo) return espacoFoto(img?.alt || 'foto', opcoes.proporcao);
  return '';
}

const ICONES = {
  seta: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>',
  instagram:
    '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>',
  pino: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  telefone:
    '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6 6l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  mais: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  fechar: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  anterior: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  proxima: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
};

export const icone = (nome) => ICONES[nome] || '';

/** Assinatura da marca: logotipo oficial, se houver; senão assinatura tipográfica neutra. */
export function assinatura(ctx, { variante = 'escuro' } = {}) {
  const { logo } = ctx.cfg.marca;
  const arquivo = variante === 'claro' && logo.arquivoClaro ? logo.arquivoClaro : logo.arquivo;
  if (arquivo) {
    return `<img class="logo-img" src="${esc(arquivo)}" alt="${esc(ctx.cfg.negocio.nome)}" width="160" height="48">`;
  }
  return `<span class="wordmark" aria-label="${esc(ctx.cfg.negocio.nome)}"><span class="wordmark__pre" aria-hidden="true">CrossFit</span><span class="wordmark__main" aria-hidden="true">${esc(ctx.cfg.negocio.nomeCurto)}</span></span>`;
}
