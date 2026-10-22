# CrossFit RBW — site institucional

Site estático, mobile-first, sem dependências de runtime. Node.js é usado só no desenvolvimento (gerar páginas, servidor local, lista de pendências). O site publicado não precisa de servidor.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor local em http://localhost:5173 com rebuild ao salvar |
| `npm run dev:publico` | Mesmo servidor, pré-visualizando o modo público |
| `npm run build` | Gera `index.html`, `privacidade.html`, `404.html`, `sitemap.xml`, `robots.txt` na raiz, no modo do config |
| `npm run build:publico` | Gera forçando o modo público (oculta tudo que não está confirmado) |
| `npm run build:demo` | Gera forçando o modo demonstração (selos “A confirmar”) |
| `npm run pendencias` | Lista tudo que ainda falta confirmar ou enviar |
| `npm run imagens` | Converte fotos de `assets/img/originais/` em WebP (requer `npm i -D sharp`) |

Requer Node 18 ou superior. Não há `npm install` obrigatório.

## Onde editar

Tudo fica em **`site.config.mjs`**: dados do negócio, canal de ação, endereço, horários, textos, treinos, equipe, galeria, avaliações, FAQ, cores e SEO. Cada item tem `confirmado: true/false`.

- `modo: 'demonstracao'` → itens pendentes aparecem com selo discreto e fotos ausentes viram quadros neutros. Páginas ficam `noindex`.
- `modo: 'publico'` → itens pendentes e seções vazias somem; o menu se ajusta sozinho.

**Apresentação limpa:** com `exibirSelos: false` (padrão atual), o modo demonstração mostra textos e ilustrações fictícios sem nenhum selo. Esses itens estão marcados com `ficticio: true` no config e aparecem como `[FICTÍCIO]` em `npm run pendencias`. As ilustrações ficam em `assets/img/fotos/` e devem ser trocadas por fotos reais antes da versão pública.

Dados estruturados (schema.org `ExerciseGym` e `FAQPage`) usam **somente** itens confirmados, em qualquer modo.

### Trocar o canal de ação
Hoje os botões abrem o Direct do Instagram (provisório). Para WhatsApp: preencha `contato.whatsapp.numero` (ex.: `5511999999999`), mude `acao.canal` para `'whatsapp'` e marque `acao.confirmado: true`.

### Fotos
1. Coloque as originais em `assets/img/originais/` (essa pasta não vai para o Git).
2. `npm i -D sharp && npm run imagens` → gera WebP em `assets/img/fotos/` e imprime as linhas para colar em `galeria.fotos`.
3. Para hero, sobre, aula e equipe, preencha o campo `arquivo`/`foto` correspondente.

### Logotipo e cores
Envie o logotipo em SVG/PNG para `assets/img/` e preencha `marca.logo.arquivo`. As cores ficam em `marca.cores` e viram variáveis CSS automaticamente. Atualize também `assets/img/favicon.svg` e `og-image.png` com a marca oficial.

## Publicar no GitHub Pages

1. Ajuste `urlSite` no config (ex.: `https://usuario.github.io/crossfit-rbw/`) e rode `npm run build:publico` (ou mude `modo` para `'publico'` e rode `npm run build`).
2. Faça commit de todos os arquivos (os HTML gerados ficam na raiz) na branch `main`.
3. No repositório: **Settings → Pages → Source: Deploy from a branch → Branch `main` / pasta `/ (root)`**.

Todos os caminhos são relativos, então funciona em `usuario.github.io/repositorio/` ou em domínio próprio. `.nojekyll` já está incluído. A página 404 tem estilos embutidos para funcionar em qualquer URL.

## Estrutura

```
site.config.mjs        configuração central (único arquivo a editar no dia a dia)
src/lib.mjs            utilitários (selos, links de ação, fotos)
src/pagina.mjs         <head>, SEO, Open Graph, schema.org
src/components/*.mjs   seções: hero, sobre, treinos, aula, equipe, galeria, avaliações, faq, contato, layout
scripts/               build, dev, pendencias, imagens
assets/css/styles.css  estilos (variáveis em :root)
assets/js/main.js      menu, cabeçalho, revelação, CTA flutuante, accordion, mapa sob demanda, galeria
assets/fonts/          Big Shoulders Display e Archivo (OFL), subconjunto latino, hospedadas localmente
```

## Privacidade
Sem cookies, sem rastreamento, sem formulários. Fontes locais. O mapa do Google só carrega após clique, por isso não há banner de cookies.
