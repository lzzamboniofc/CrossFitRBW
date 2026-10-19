#!/usr/bin/env node
/**
 * Gera o site estático na raiz do projeto (pronto para GitHub Pages: branch main, pasta /).
 *   node scripts/build.mjs              → usa o modo definido em site.config.mjs
 *   node scripts/build.mjs --publico    → força o modo público
 *   node scripts/build.mjs --demo       → força o modo demonstração
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

import { criarContexto, esc, enderecoLinha, confirmado } from '../src/lib.mjs';
import { documento, dadosEstruturados, urlAbsoluta } from '../src/pagina.mjs';
import { cabecalho, rodape, ctaFlutuante, seloModo } from '../src/components/layout.mjs';
import hero from '../src/components/hero.mjs';
import sobre from '../src/components/sobre.mjs';
import servicos from '../src/components/servicos.mjs';
import experiencia from '../src/components/experiencia.mjs';
import equipe from '../src/components/equipe.mjs';
import galeria from '../src/components/galeria.mjs';
import avaliacoes from '../src/components/avaliacoes.mjs';
import faq from '../src/components/faq.mjs';
import contato from '../src/components/contato.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function build({ modoForcado } = {}) {
  // Reimporta a configuração a cada build (útil no modo de desenvolvimento).
  const cfgUrl = pathToFileURL(path.join(raiz, 'site.config.mjs')).href + `?t=${Date.now()}`;
  const cfg = (await import(cfgUrl)).default;
  const modo = modoForcado || cfg.modo;
  const ctx = criarContexto(cfg, modo);

  // Ordem das seções. O menu se monta apenas com as seções que existirem.
  const secoes = [hero, sobre, servicos, experiencia, equipe, galeria, avaliacoes, faq, contato]
    .map((s) => s(ctx))
    .filter(Boolean);
  const menu = secoes.filter((s) => s.menu);
  const faqSecao = secoes.find((s) => s.id === 'duvidas');

  const corpoIndex = `
${cabecalho(ctx, menu)}
<main id="conteudo">
${secoes.map((s) => s.html).join('\n')}
</main>
${rodape(ctx, menu)}
${ctaFlutuante(ctx)}
${seloModo(ctx)}
<div class="lb" data-lb hidden role="dialog" aria-modal="true" aria-label="Foto ampliada">
  <button type="button" class="lb__btn lb__close" data-lb-close aria-label="Fechar"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
  <button type="button" class="lb__btn lb__prev" data-lb-prev aria-label="Foto anterior"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
  <figure class="lb__fig"><img data-lb-img alt=""><figcaption data-lb-cap></figcaption></figure>
  <button type="button" class="lb__btn lb__next" data-lb-next aria-label="Próxima foto"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
</div>`;

  const index = documento(ctx, {
    titulo: cfg.seo.titulo,
    descricao: cfg.seo.descricao,
    corpo: corpoIndex,
    schema: dadosEstruturados(cfg, faqSecao?.faqConfirmadas || []),
  });

  // Política de privacidade
  const end = cfg.contato.endereco;
  const canalPrivacidade = cfg.redes.find(confirmado);
  const corpoPriv = `
${cabecalho(ctx, menu, { base: './' })}
<main id="conteudo" class="legal">
  <div class="wrap legal__wrap">
    <p class="eyebrow">Transparência</p>
    <h1 class="h2">Política de privacidade</h1>
    <p class="lead">Este site é institucional: apresenta a ${esc(cfg.negocio.nome)} e direciona o contato para canais externos. Ele não tem formulários, não cria contas e não usa cookies de rastreamento, de publicidade ou de análise.</p>
    <h2 class="h3">Quais dados são coletados</h2>
    <p>O site não coleta nem armazena dados pessoais. Ao tocar nos botões de contato, você é levado a um serviço externo (como Instagram, WhatsApp ou Google Maps), que passa a seguir a política de privacidade própria dele.</p>
    <h2 class="h3">Serviços de terceiros</h2>
    <p>As fontes tipográficas são hospedadas no próprio site, sem chamadas a serviços externos. O mapa do Google só é carregado se você tocar em “Mostrar mapa”; a partir daí, o Google pode usar cookies conforme a política dele.</p>
    <h2 class="h3">Hospedagem</h2>
    <p>O site é hospedado no GitHub Pages, que pode registrar dados técnicos de acesso (como endereço IP) para segurança e funcionamento do serviço.</p>
    <h2 class="h3">Seus direitos</h2>
    <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir informações sobre o tratamento dos seus dados pelos canais oficiais do box${canalPrivacidade ? ` — ${esc(canalPrivacidade.nome)} <a class="link" href="${esc(canalPrivacidade.url)}" target="_blank" rel="noopener noreferrer">${esc(canalPrivacidade.usuario)}</a>` : ''}.</p>
    <p class="legal__meta">${esc(cfg.negocio.nome)}${confirmado(cfg.negocio.cnpj) ? ` · CNPJ ${esc(cfg.negocio.cnpj.valor)}` : ''}${confirmado(end) ? ` · ${esc(enderecoLinha(end))}` : ''}</p>
    <p><a class="btn btn--ghost btn--ink" href="./"><span>Voltar ao início</span></a></p>
  </div>
</main>
${rodape(ctx, menu, { base: './' })}`;

  const privacidade = documento(ctx, {
    titulo: `Política de privacidade | ${cfg.negocio.nome}`,
    descricao: `Como o site da ${cfg.negocio.nome} trata dados e serviços de terceiros.`,
    caminho: 'privacidade.html',
    corpo: corpoPriv,
    classeBody: 'page-legal',
  });

  // 404 autônoma (estilos embutidos): funciona em qualquer profundidade de URL no GitHub Pages.
  const urlInicio = urlAbsoluta(cfg) || '/';
  const c = cfg.marca.cores;
  const pagina404 = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${esc(cfg.negocio.nome)}</title>
<meta name="robots" content="noindex">
<style>
*{box-sizing:border-box}html,body{margin:0;height:100%}
body{background:${c.fundo};color:${c.texto};font:400 1rem/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;display:grid;place-items:center;padding:24px}
main{max-width:34rem}
.k{font:900 clamp(5rem,30vw,12rem)/.8 Impact,"Arial Narrow",sans-serif;letter-spacing:-.02em;color:transparent;-webkit-text-stroke:2px ${c.destaque};margin:0 0 .25em}
h1{font:800 clamp(1.6rem,6vw,2.4rem)/1.1 Impact,"Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.01em;margin:0 0 .5em}
p{color:${c.textoSuave};margin:0 0 1.75em}
a{display:inline-flex;align-items:center;min-height:48px;padding:0 1.5em;background:${c.destaque};color:${c.destaqueTexto};font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:.06em;font-size:.9rem}
a:focus-visible{outline:3px solid ${c.texto};outline-offset:3px}
</style>
</head>
<body>
<main>
<p class="k" aria-hidden="true">404</p>
<h1>Esse movimento não existe</h1>
<p>A página que você procurou não está aqui. Volte para o início e encontre o caminho para o box.</p>
<a href="${esc(urlInicio)}">Voltar ao início</a>
</main>
</body>
</html>
`;

  // robots.txt e sitemap.xml
  const base = urlAbsoluta(cfg);
  const robots = ctx.demo
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}sitemap.xml\n` : ''}`;
  const hoje = new Date().toISOString().slice(0, 10);
  const sitemap = base
    ? `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}</loc><lastmod>${hoje}</lastmod><priority>1.0</priority></url>
  <url><loc>${base}privacidade.html</loc><lastmod>${hoje}</lastmod><priority>0.2</priority></url>
</urlset>
`
    : `<?xml version="1.0" encoding="UTF-8"?>
<!-- Defina urlSite em site.config.mjs e rode "npm run build" para gerar as URLs. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>
`;

  const manifest = JSON.stringify(
    {
      name: cfg.negocio.nome,
      short_name: cfg.negocio.nomeCurto,
      start_url: './',
      display: 'browser',
      background_color: c.fundo,
      theme_color: c.fundo,
      icons: [
        { src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2
  );

  await Promise.all([
    writeFile(path.join(raiz, 'index.html'), index),
    writeFile(path.join(raiz, 'privacidade.html'), privacidade),
    writeFile(path.join(raiz, '404.html'), pagina404),
    writeFile(path.join(raiz, 'robots.txt'), robots),
    writeFile(path.join(raiz, 'sitemap.xml'), sitemap),
    writeFile(path.join(raiz, 'site.webmanifest'), manifest),
    writeFile(path.join(raiz, '.nojekyll'), ''),
  ]);

  return { modo, secoes: secoes.map((s) => s.id) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const modoForcado = process.argv.includes('--publico') ? 'publico' : process.argv.includes('--demo') ? 'demonstracao' : undefined;
  const r = await build({ modoForcado });
  console.log(`✔ Site gerado em modo "${r.modo}". Seções: ${r.secoes.join(', ')}`);
  if (r.modo === 'demonstracao') console.log('  (modo demonstração: páginas marcadas como noindex)');
}
