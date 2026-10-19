#!/usr/bin/env node
/**
 * Converte fotos de assets/img/originais/ em WebP otimizado (máx. 1800 px) em assets/img/fotos/
 * e imprime as linhas prontas para colar em galeria.fotos no site.config.mjs.
 *
 * Requer o pacote opcional "sharp":  npm install --save-dev sharp
 * Uso: npm run imagens
 */
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origem = path.join(raiz, 'assets/img/originais');
const destino = path.join(raiz, 'assets/img/fotos');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('O conversor usa o pacote "sharp". Instale com:  npm install --save-dev sharp');
  process.exit(1);
}

await mkdir(destino, { recursive: true });
const arquivos = (await readdir(origem).catch(() => [])).filter((f) => /\.(jpe?g|png|webp|heic|tiff?)$/i.test(f));
if (!arquivos.length) {
  console.log('Coloque as fotos originais em assets/img/originais/ e rode de novo.');
  process.exit(0);
}

const linhas = [];
for (const f of arquivos) {
  const nome = path.parse(f).name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const saida = path.join(destino, `${nome}.webp`);
  const info = await sharp(path.join(origem, f)).rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(saida);
  linhas.push(`{ arquivo: 'assets/img/fotos/${nome}.webp', largura: ${info.width}, altura: ${info.height}, alt: 'DESCREVA A FOTO', confirmado: true },`);
  console.log(`✔ ${f} → ${nome}.webp (${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
}
console.log('\nCole em galeria.fotos (site.config.mjs):\n');
console.log(linhas.join('\n'));
