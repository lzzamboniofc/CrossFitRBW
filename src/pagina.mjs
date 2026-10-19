import { esc, confirmado } from './lib.mjs';


/** Cores da configuração aplicadas como variáveis CSS. */
function variaveisCor(cfg) {
  const c = cfg.marca.cores;
  return `:root{--bg:${c.fundo};--surface:${c.superficie};--ink:${c.texto};--ink-soft:${c.textoSuave};--accent:${c.destaque};--on-accent:${c.destaqueTexto};--chalk:${c.claro}}`;
}

export function urlAbsoluta(cfg, caminho = '') {
  const base = confirmado(cfg.urlSite) || cfg.urlSite.valor ? cfg.urlSite.valor : '';
  if (!base) return '';
  return base.replace(/\/?$/, '/') + caminho.replace(/^\.?\//, '');
}

/** schema.org somente com dados verificados (independe do modo). */
export function dadosEstruturados(cfg, faqConfirmadas = []) {
  const { contato, negocio, horarios, redes } = cfg;
  const end = contato.endereco;
  const gym = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: negocio.nome,
    description: negocio.descricaoCurta,
  };
  if (confirmado(end)) {
    gym.address = {
      '@type': 'PostalAddress',
      streetAddress: `${end.logradouro}, ${end.numero}`,
      addressLocality: end.cidade,
      addressRegion: end.uf,
      addressCountry: 'BR',
    };
    if (confirmado(contato.cep)) gym.address.postalCode = contato.cep.valor;
  }
  if (contato.mapa.latitude != null && confirmado(contato.mapa)) {
    gym.geo = { '@type': 'GeoCoordinates', latitude: contato.mapa.latitude, longitude: contato.mapa.longitude };
  }
  if (confirmado(contato.telefone) && contato.telefone.valor) gym.telephone = contato.telefone.link.replace('tel:', '');
  if (confirmado(contato.email) && contato.email.valor) gym.email = contato.email.valor;
  const url = confirmado(cfg.urlSite) ? cfg.urlSite.valor : '';
  if (url) {
    gym.url = url;
    gym.image = urlAbsoluta(cfg, cfg.seo.imagemCompartilhamento);
  }
  const sameAs = redes.filter(confirmado).map((r) => r.url);
  if (sameAs.length) gym.sameAs = sameAs;
  if (confirmado(horarios)) {
    gym.openingHoursSpecification = horarios.dias.flatMap((d) =>
      d.faixas.map(([opens, closes]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: d.diasSchema,
        opens,
        closes,
      }))
    );
  }
  const blocos = [gym];
  if (faqConfirmadas.length) {
    blocos.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqConfirmadas.map((q) => ({
        '@type': 'Question',
        name: q.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: q.resposta },
      })),
    });
  }
  return blocos.map((b) => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`).join('\n');
}

export function documento(ctx, { titulo, descricao, caminho = '', corpo, schema = '', classeBody = '', indexar = true }) {
  const { cfg, demo } = ctx;
  const canonical = urlAbsoluta(cfg, caminho);
  const og = urlAbsoluta(cfg, cfg.seo.imagemCompartilhamento) || cfg.seo.imagemCompartilhamento;
  const robots = demo || !indexar ? 'noindex, nofollow' : 'index, follow';
  return `<!doctype html>
<html lang="${cfg.seo.idioma}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<meta name="robots" content="${robots}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<meta name="theme-color" content="${esc(cfg.marca.cores.fundo)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(cfg.negocio.nome)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(cfg.negocio.nome)} — ${esc(cfg.negocio.segmento)} em ${esc(cfg.negocio.cidade)}">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" href="assets/fonts/big-shoulders-display.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="assets/fonts/archivo.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="assets/css/styles.css">
<style>${variaveisCor(cfg)}</style>
<script>document.documentElement.classList.add('js')</script>
${schema}
</head>
<body class="${classeBody}${demo ? ' is-demo' : ''}">
${corpo}
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}
