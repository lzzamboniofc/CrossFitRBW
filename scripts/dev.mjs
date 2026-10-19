#!/usr/bin/env node
/** Servidor local sem dependências, com rebuild ao salvar.
 *  Uso: npm run dev  (http://localhost:5173)   ·   npm run dev:publico  (pré-visualiza o modo público) */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const porta = Number(process.env.PORT) || 5173;
const tipos = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

const modoForcado = process.argv.includes('--publico') ? 'publico' : process.argv.includes('--demo') ? 'demonstracao' : undefined;
await build({ modoForcado });
console.log(`▶ http://localhost:${porta}`);

let aguardando;
const rebuild = (_, arquivo) => {
  if (arquivo && /(index|privacidade|404)\.html$/.test(arquivo)) return;
  clearTimeout(aguardando);
  aguardando = setTimeout(async () => {
    try {
      const r = await build({ modoForcado });
      console.log(`↻ rebuild (${r.modo})`);
    } catch (e) {
      console.error('✖ erro no build:', e.message);
    }
  }, 120);
};
watch(path.join(raiz, 'site.config.mjs'), rebuild);
watch(path.join(raiz, 'src'), { recursive: true }, rebuild);

http
  .createServer(async (req, res) => {
    try {
      let rota = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let arquivo = path.join(raiz, rota);
      if (!arquivo.startsWith(raiz)) throw new Error('fora da raiz');
      if ((await stat(arquivo).catch(() => null))?.isDirectory()) arquivo = path.join(arquivo, 'index.html');
      const dados = await readFile(arquivo);
      res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(dados);
    } catch {
      const nf = await readFile(path.join(raiz, '404.html')).catch(() => 'Não encontrado');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(nf);
    }
  })
  .listen(porta);
