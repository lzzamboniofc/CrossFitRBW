#!/usr/bin/env node
/** Lista tudo que ainda precisa ser confirmado ou enviado.  Uso: npm run pendencias */
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = (await import(pathToFileURL(path.join(raiz, 'site.config.mjs')).href)).default;

const pendentes = [];

function rotulo(obj) {
  const v = obj.nome || obj.titulo || obj.pergunta || obj.dia || obj.valor || obj.alt || obj.texto || '';
  return typeof v === 'string' && v.startsWith('#') ? '' : v;
}

function varrer(no, caminho) {
  if (Array.isArray(no)) {
    no.forEach((v, i) => varrer(v, `${caminho}[${i}]`));
    return;
  }
  if (no && typeof no === 'object') {
    if (no.confirmado === false) {
      const nome = String(rotulo(no)).slice(0, 70);
      pendentes.push({ caminho, nome: (no.ficticio ? '[FICTÍCIO] ' : '') + nome, nota: [no.observacao, no.fonte && `fonte: ${no.fonte}`].filter(Boolean).join(' | ') });
    }
    for (const [k, v] of Object.entries(no)) varrer(v, caminho ? `${caminho}.${k}` : k);
  }
}
varrer(cfg, '');

const faltando = [];
if (!cfg.urlSite.valor) faltando.push('urlSite — endereço final do site (para sitemap, canonical e Open Graph)');
if (!cfg.marca.logo.arquivo) faltando.push('marca.logo.arquivo — logotipo oficial (hoje: assinatura tipográfica neutra)');
if (!cfg.hero.imagem.arquivo || cfg.hero.imagem.ficticio) faltando.push('hero.imagem — foto real principal do box (hoje: ilustração)');
if (!cfg.galeria.fotos.filter((f) => !f.ficticio).length) faltando.push('galeria.fotos — fotos reais do box (hoje: ilustrações fictícias, ocultas no modo público)');
if (!cfg.avaliacoes.itens.length) faltando.push('avaliacoes.itens — avaliações reais do Google (seção oculta)');
cfg.equipe.membros.forEach((m, i) => {
  if (!m.foto) faltando.push(`equipe.membros[${i}].foto — foto de ${m.nome}`);
  if (m.apresentacaoFicticia) faltando.push(`equipe.membros[${i}].apresentacao — [FICTÍCIO] texto de ${m.nome} a validar`);
  if (!m.apresentacao) faltando.push(`equipe.membros[${i}].apresentacao — breve apresentação de ${m.nome}`);
});
if (!cfg.contato.whatsapp.numero) faltando.push('contato.whatsapp.numero — WhatsApp oficial');
if (!cfg.contato.email.valor) faltando.push('contato.email — e-mail de contato público');
if (cfg.contato.mapa.latitude == null) faltando.push('contato.mapa.latitude/longitude — coordenadas exatas (opcional)');
if (!cfg.creditos.nome) faltando.push('creditos — nome de quem desenvolveu o site (opcional)');

const linha = '─'.repeat(64);
console.log(`\n${cfg.negocio.nome} — pendências (modo atual: ${cfg.modo})\n${linha}`);
console.log(`\nA CONFIRMAR (${pendentes.length})  → aparecem com selo na demonstração e somem no modo público\n`);
pendentes.forEach((p) => {
  console.log(`  • ${p.caminho}${p.nome ? `  —  ${p.nome}` : ''}`);
  if (p.nota) console.log(`      ${p.nota}`);
});
console.log(`\nA ENVIAR / PREENCHER (${faltando.length})\n`);
faltando.forEach((f) => console.log(`  • ${f}`));
console.log(`\n${linha}\nDepois de atualizar site.config.mjs, rode: npm run build\n`);
