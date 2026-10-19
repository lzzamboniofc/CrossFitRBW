/**
 * CONFIGURAÇÃO CENTRAL — CrossFit RBW
 * -------------------------------------------------------------
 * Todas as informações editáveis do site ficam aqui.
 * Depois de editar, rode:  npm run build
 *
 * Regra: cada item que depende de confirmação tem `confirmado`.
 *   - modo "demonstracao": itens não confirmados aparecem com o selo "A confirmar".
 *   - modo "publico": itens não confirmados e seções vazias são ocultados.
 *
 * `fonte` registra de onde a informação foi verificada (não aparece no site).
 * Liste as pendências com:  npm run pendencias
 */

export default {
  /** "demonstracao" | "publico"  (também pode ser forçado: npm run build:publico) */
  modo: 'demonstracao',

  /** URL final do site, com barra no fim. Necessária para sitemap, canonical e Open Graph.
   *  Ex.: https://usuario.github.io/crossfit-rbw/  ou  https://www.crossfitrbw.com.br/ */
  urlSite: { valor: 'https://lzzamboniofc.github.io/CrossFitRBW/', confirmado: true, observacao: 'GitHub Pages (main / root). Trocar se usar domínio próprio.' },

  negocio: {
    nome: 'CrossFit RBW',
    nomeCurto: 'RBW',
    segmento: 'Box de CrossFit',
    cidade: 'Itu',
    uf: 'SP',
    regiao: 'Itu Novo Centro',
    afiliadoCrossFit: {
      valor: true,
      confirmado: true,
      fonte: 'crossfit.com/gym/33802/crossfit-rbw (página oficial de afiliados)',
    },
    cnpj: {
      valor: '21.985.088/0001-18',
      razaoSocial: 'DCU Centro de Treinamento Serviços e Comércio Ltda.',
      confirmado: true,
      fonte: 'Cadastro público do CNPJ',
    },
    descricaoCurta:
      'Box afiliado CrossFit no Itu Novo Centro, em Itu (SP). Aulas em grupo guiadas por coach, com o treino ajustado ao nível de cada aluno.',
  },

  /** Identidade visual PROVISÓRIA — o Instagram não pôde ser analisado diretamente.
   *  Troque pelas cores e logotipo oficiais assim que recebê-los. */
  marca: {
    logo: {
      // Caminho para o logotipo oficial (SVG ou PNG transparente). Vazio = assinatura tipográfica neutra.
      arquivo: '',
      arquivoClaro: '', // versão para fundos claros (opcional)
      confirmado: false,
      observacao: 'Enviar o logotipo oficial em SVG ou PNG transparente.',
    },
    cores: {
      confirmado: false,
      observacao: 'Paleta provisória (preto ferro, branco giz e laranja). Trocar pelas cores oficiais.',
      fundo: '#0E0E0D', // preto ferro
      superficie: '#181816',
      texto: '#F2EFE8', // branco giz
      textoSuave: '#A9A69E',
      destaque: '#FF5A1F', // acento provisório — substituir pela cor oficial
      destaqueTexto: '#0E0E0D',
      claro: '#ECE8DF', // fundo das seções claras (quadro)
    },
  },

  /** Canal de conversão. O canal oficial (WhatsApp, agenda, etc.) ainda não foi confirmado,
   *  então o Direct do Instagram é usado como canal provisório. */
  acao: {
    rotulo: 'Quero treinar na RBW',
    rotuloCurto: 'Quero treinar',
    canal: 'instagram', // "instagram" | "whatsapp" | "link"
    link: 'https://ig.me/m/crossfit_rbw',
    mensagemWhatsApp: 'Olá! Vim pelo site e quero saber mais sobre as aulas na CrossFit RBW.',
    confirmado: false,
    observacao: 'Canal provisório. Confirmar se o box atende por WhatsApp, Direct ou app de agendamento.',
  },

  contato: {
    endereco: {
      logradouro: 'Rua Francisco José Ferreira Sampaio',
      numero: '106',
      bairro: 'Itu Novo Centro',
      cidade: 'Itu',
      uf: 'SP',
      referencia: 'A cerca de 500 m do Parque Taboão',
      confirmado: true,
      fonte: 'crossfit.com, TotalPass, Wellhub e cadastro do CNPJ (fontes coincidem)',
    },
    cep: {
      valor: '13304-080',
      confirmado: false,
      observacao: 'Fontes divergem: 13304-080 (Google/Wellhub) e 13303-536 (CNPJ/crossfit.com).',
    },
    telefone: {
      valor: '(11) 97627-3683',
      link: 'tel:+5511976273683',
      confirmado: false,
      observacao: 'Wellhub e TotalPass citam (11) 97627-3683; outra listagem cita (11) 99581-5160.',
    },
    whatsapp: {
      numero: '', // somente dígitos com DDI, ex.: 5511999999999
      confirmado: false,
    },
    email: { valor: '', confirmado: false },
    mapa: {
      // Busca usada no mapa e no botão "Como chegar"
      consulta: 'CrossFit RBW, Rua Francisco José Ferreira Sampaio, 106, Itu Novo Centro, Itu - SP',
      latitude: null,
      longitude: null,
      confirmado: true,
    },
  },

  redes: [
    {
      nome: 'Instagram',
      usuario: '@crossfit_rbw',
      url: 'https://www.instagram.com/crossfit_rbw/',
      confirmado: true,
    },
  ],

  /** Horários de funcionamento. Valores abaixo vêm do Wellhub e divergem de outra listagem.
   *  Confirmar com o box antes de publicar. */
  horarios: {
    confirmado: false,
    fonte: 'Wellhub (outubro/2026). Listagem antiga cita abertura da tarde às 17h30.',
    observacao: 'Horários podem mudar em feriados.',
    dias: [
      { dia: 'Segunda a quinta', diasSchema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], faixas: [['06:00', '12:00'], ['15:30', '21:30']] },
      { dia: 'Sexta', diasSchema: ['Friday'], faixas: [['06:00', '12:00'], ['15:30', '20:30']] },
      { dia: 'Sábado', diasSchema: ['Saturday'], faixas: [['10:00', '12:00']] },
      { dia: 'Domingo', diasSchema: [], faixas: [] },
    ],
  },

  /* ---------------------------------------------------------- CONTEÚDO */

  hero: {
    sobretitulo: 'Box afiliado CrossFit · Itu, SP',
    titulo: ['Treine forte.', 'Treine junto.'],
    texto:
      'Aulas de CrossFit em grupo no Itu Novo Centro, com coach do começo ao fim e o treino ajustado ao seu nível.',
    rotuloSecundario: 'Ver como é a aula',
    imagem: {
      arquivo: '', // ex.: assets/img/fotos/hero.webp (foto real do box)
      alt: 'Alunos treinando na CrossFit RBW',
      confirmado: false,
    },
  },

  sobre: {
    visivel: true,
    titulo: 'Um box de CrossFit no centro novo de Itu',
    paragrafos: [
      {
        texto:
          'A CrossFit RBW é um box afiliado à CrossFit, com aulas em grupo baseadas na metodologia: movimentos funcionais, combinados e variados, com intensidade ajustada a quem está treinando.',
        confirmado: true,
        fonte: 'crossfit.com (página do afiliado)',
      },
      {
        texto:
          'Cada aula é conduzida por um coach, que orienta a técnica e adapta o treino do dia para que iniciantes e alunos experientes treinem lado a lado.',
        confirmado: true,
        fonte: 'crossfit.com (página do afiliado)',
      },
      {
        texto:
          '[Espaço para a história do box, proposta e jeito de atender — enviar texto do responsável.]',
        confirmado: false,
      },
    ],
    estrutura: {
      titulo: 'Estrutura',
      itens: ['Ar-condicionado', 'Vestiário', 'Armários', 'Wi-Fi'],
      confirmado: true,
      fonte: 'Wellhub',
    },
    imagens: [
      { arquivo: '', alt: 'Área de treino da CrossFit RBW', confirmado: false },
      { arquivo: '', alt: 'Aula em grupo na CrossFit RBW', confirmado: false },
    ],
  },

  /** Modalidades / formas de treinar */
  servicos: {
    titulo: 'Como treinar na RBW',
    intro: 'Escolha o caminho e fale com o box para começar.',
    itens: [
      {
        nome: 'Aulas de CrossFit',
        descricao:
          'Treino do dia em grupo, com aquecimento, técnica e o WOD, sempre com coach e escala de cargas e movimentos para o seu nível.',
        preco: '',
        duracao: '',
        imagem: { arquivo: '', alt: 'Aula de CrossFit na RBW' },
        confirmado: true,
        fonte: 'crossfit.com, Wellhub, TotalPass',
      },
      {
        nome: 'Wellhub e TotalPass',
        descricao:
          'O box é parceiro das duas plataformas. Pelo Wellhub, as aulas precisam ser agendadas no aplicativo. Confira no app qual plano dá acesso.',
        preco: '',
        duracao: '',
        imagem: { arquivo: '', alt: '' },
        confirmado: true,
        fonte: 'wellhub.com e totalpass.com (páginas do parceiro)',
      },
      {
        nome: 'Planos mensais',
        descricao: '[Planos, frequência semanal e valores — a confirmar com o box.]',
        preco: '',
        duracao: '',
        imagem: { arquivo: '', alt: '' },
        confirmado: false,
      },
      {
        nome: 'Aula experimental',
        descricao: '[Confirmar se o box oferece aula experimental e como agendar.]',
        preco: '',
        duracao: '',
        imagem: { arquivo: '', alt: '' },
        confirmado: false,
      },
    ],
  },

  /** Como é uma aula — só características verificadas */
  experiencia: {
    visivel: true,
    titulo: 'Como é uma aula',
    intro:
      'Todo mundo faz o mesmo treino. O que muda é a carga, o movimento e o ritmo de cada um.',
    momentos: [
      {
        titulo: 'Coach do começo ao fim',
        texto: 'Quem conduz a aula explica o treino do dia, corrige a técnica e acompanha cada aluno.',
        confirmado: true,
        fonte: 'crossfit.com (página do afiliado)',
      },
      {
        titulo: 'O treino se ajusta a você',
        texto: 'Movimentos e cargas são adaptados, para que quem está começando e quem já treina há anos dividam a mesma aula.',
        confirmado: true,
        fonte: 'crossfit.com (página do afiliado)',
      },
      {
        titulo: 'Cerca de uma hora',
        texto: '[Confirmar a duração e a estrutura das aulas do box.]',
        confirmado: false,
      },
      {
        titulo: 'Comunidade que compete junto',
        texto: 'Alunos da RBW se inscrevem no CrossFit Open representando o box, e há atletas da casa que avançaram às Quarterfinals em 2026.',
        confirmado: true,
        fonte: 'games.crossfit.com/affiliate/33802 (2026 Athlete Roster)',
      },
    ],
    imagem: { arquivo: '', alt: 'Coach orientando alunos na CrossFit RBW', confirmado: false },
  },

  equipe: {
    titulo: 'Quem está no box',
    membros: [
      {
        nome: 'Danilo Fonseca',
        funcao: 'Proprietário',
        apresentacao: '',
        foto: '',
        instagram: '',
        confirmado: true,
        fonte: 'crossfit.com (Coaches & Staff — Owner)',
      },
      {
        nome: 'Dayanne Rizzi',
        funcao: 'Coach',
        apresentacao: '',
        foto: '',
        instagram: '',
        confirmado: true,
        fonte: 'crossfit.com (Coaches & Staff — Coach)',
      },
    ],
    observacao: 'Fotos, apresentações e demais coaches a confirmar.',
  },

  /** Galeria: adicione fotos reais em assets/img/fotos/ e liste aqui.
   *  Rode `npm run imagens` para gerar versões WebP otimizadas. */
  galeria: {
    titulo: 'O box por dentro',
    fotos: [
      // { arquivo: 'assets/img/fotos/treino-01.webp', largura: 1600, altura: 1067, alt: 'Descrição da foto', confirmado: true },
    ],
    espacosDemonstracao: 6, // quadros neutros exibidos só no modo demonstração quando não há fotos
  },

  /** Antes e depois — não se aplica sem fotos reais. */
  antesDepois: { itens: [] },

  /** Avaliações reais (preferencialmente do Google). Sem avaliações, a seção fica oculta. */
  avaliacoes: {
    titulo: 'Quem treina, conta',
    linkPerfil: '', // link do perfil no Google
    itens: [
      // { nome: 'Nome como aparece no Google', texto: '...', nota: 5, origem: 'Google', data: '2026-01', confirmado: true },
    ],
  },

  faq: {
    titulo: 'Dúvidas frequentes',
    itens: [
      {
        pergunta: 'Nunca fiz CrossFit. Posso começar?',
        resposta:
          'As aulas seguem a metodologia CrossFit, em que o coach adapta movimentos e cargas ao nível de cada aluno. Fale com o box para combinar o seu início.',
        confirmado: true,
      },
      {
        pergunta: 'A RBW aceita Wellhub ou TotalPass?',
        resposta:
          'Sim, o box aparece como parceiro nas duas plataformas. Pelo Wellhub é preciso agendar a aula no aplicativo. O plano necessário pode mudar, então confira no app.',
        confirmado: true,
      },
      {
        pergunta: 'Onde fica o box?',
        resposta:
          'Na Rua Francisco José Ferreira Sampaio, 106, no Itu Novo Centro, em Itu (SP), a cerca de 500 m do Parque Taboão.',
        confirmado: true,
      },
      {
        pergunta: 'Que estrutura o box oferece?',
        resposta: 'Ar-condicionado, vestiário, armários e Wi-Fi.',
        confirmado: true,
      },
      {
        pergunta: 'Quais são os horários das aulas?',
        resposta: '[Grade de horários das aulas — a confirmar com o box.]',
        confirmado: false,
      },
      {
        pergunta: 'Quais são os planos e valores?',
        resposta: '[Planos, formas de pagamento e valores — a confirmar com o box.]',
        confirmado: false,
      },
    ],
  },

  seo: {
    titulo: 'CrossFit RBW | Box de CrossFit em Itu - SP',
    descricao:
      'CrossFit RBW: box afiliado CrossFit no Itu Novo Centro, em Itu (SP). Aulas em grupo com coach, treino adaptado ao seu nível. Parceiro Wellhub e TotalPass.',
    imagemCompartilhamento: 'assets/img/og-image.png',
    idioma: 'pt-BR',
  },

  creditos: { texto: 'Site desenvolvido por', nome: '', url: '' },
};
