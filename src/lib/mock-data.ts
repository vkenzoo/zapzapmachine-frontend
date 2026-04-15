import type {
  Usuario,
  IntegracaoCheckout,
  InstanciaWhatsapp,
  DashboardKPIs,
  BaseConhecimento,
  Conversa,
  Mensagem,
  Agente,
} from '@/types'

export const MOCK_USUARIO: Usuario = {
  id: 'usr_001',
  email: 'nath@teste.com',
  nome: 'Nathalia',
  plano: 'PRO',
  status: 'ATIVO',
  criadoEm: '2025-11-15T10:00:00Z',
}

export const MOCK_SENHA = '123456'

export const MOCK_INTEGRACOES: IntegracaoCheckout[] = [
  {
    id: 'intg_001',
    provedor: 'TICTO',
    nomeConta: 'Conta Ticto - 66d4699c-a1b2-4c3d',
    status: 'ATIVO',
    webhookUrl: 'https://api.robovendas.com/webhooks/ticto/66d4699c-a1b2-4c3d',
    ultimoRecebimento: '2026-01-27T18:56:00Z',
    produtos: [
      {
        id: 'prod_001',
        idExternoProduto: 'TICTO-PRD-7821',
        nomeProduto: 'Curso Completo de Tráfego Pago',
        agenteVinculadoId: undefined,
      },
      {
        id: 'prod_002',
        idExternoProduto: 'TICTO-PRD-7822',
        nomeProduto: 'Mentoria Individual 1:1',
        agenteVinculadoId: undefined,
      },
      {
        id: 'prod_003',
        idExternoProduto: 'TICTO-PRD-7823',
        nomeProduto: 'E-book Funil de Vendas',
        agenteVinculadoId: undefined,
      },
    ],
    criadoEm: '2025-12-10T14:30:00Z',
  },
]

export const MOCK_INSTANCIAS_WHATSAPP: InstanciaWhatsapp[] = [
  {
    id: 'wpp_001',
    nomeInstancia: 'WhatsApp Principal',
    numeroConectado: '+55 11 99887-6543',
    status: 'CONECTADO',
    criadoEm: '2025-12-12T09:00:00Z',
  },
  {
    id: 'wpp_002',
    nomeInstancia: 'WhatsApp Suporte',
    numeroConectado: undefined,
    status: 'DESCONECTADO',
    criadoEm: '2026-01-05T16:20:00Z',
  },
]

export const MOCK_BASES_CONHECIMENTO: BaseConhecimento[] = [
  {
    id: 'base_001',
    nome: 'Curso Tráfego Pago',
    criadoEm: '2025-12-20T10:00:00Z',
    atualizadoEm: '2026-01-15T14:30:00Z',
    informacoesProduto: {
      nomeProduto: 'Curso Completo de Tráfego Pago',
      descricaoCurta: 'Aprenda a criar campanhas lucrativas no Facebook, Instagram e Google Ads do zero ao avançado.',
      preco: 99700,
      urlVenda: 'https://exemplo.com/trafego-pago',
      tipo: 'curso',
      garantia: '7 dias',
    },
    persona: {
      nomePersona: 'Carlos Empreendedor',
      idadeFaixa: '25-40 anos',
      profissao: 'Empreendedor digital iniciante',
      principaisDores: 'Não consegue vender online, gasta dinheiro com anúncios sem retorno, não sabe segmentar público.',
      desejosObjetivos: 'Ter um negócio online lucrativo, escalar vendas com tráfego pago, ter liberdade financeira.',
      nivelConsciencia: 'consciente_solucao',
    },
    faqObjecoes: [
      { id: 'faq_001', pergunta: 'Funciona para iniciantes?', resposta: 'Sim, o curso começa do zero absoluto. Não é necessário nenhum conhecimento prévio.' },
      { id: 'faq_002', pergunta: 'Preciso investir muito em anúncios?', resposta: 'Não. Ensinamos a começar com R$10/dia e escalar conforme os resultados aparecem.' },
      { id: 'faq_003', pergunta: 'Tem suporte?', resposta: 'Sim, suporte via grupo exclusivo no WhatsApp e lives semanais de tira-dúvidas.' },
      { id: 'faq_004', pergunta: 'Quanto tempo leva para ter resultados?', resposta: 'Alunos dedicados costumam ver os primeiros resultados entre 2 a 4 semanas.' },
    ],
    personalidadeAgente: {
      tomVoz: 'amigavel',
      nomeAgente: 'Luna',
      instrucoesEspeciais: 'Seja empática e use exemplos práticos. Sempre pergunte o nicho do lead.',
      usarEmojis: true,
      usarAudios: false,
      idiomaPrincipal: 'portugues',
    },
    limitacoes: {
      topicosProibidos: 'Não falar sobre criptomoedas, apostas ou esquemas de pirâmide.',
      nuncaMencionarConcorrentes: true,
      naoPrometerResultados: true,
      limiteDescontoMaximo: 10,
      instrucoesTransferirHumano: 'Transferir quando o lead pedir reembolso ou tiver problemas técnicos de acesso.',
    },
    entregaveis: {
      tipoEntrega: 'area_membros',
      instrucoesAcesso: 'Após a compra, o aluno recebe um e-mail com login e senha para acessar a área de membros.',
      linkAcesso: 'https://membros.exemplo.com',
      suportePosVenda: 'Suporte via WhatsApp no grupo exclusivo. Resposta em até 24h úteis.',
    },
  },
  {
    id: 'base_002',
    nome: 'Mentoria Business',
    criadoEm: '2026-01-10T08:00:00Z',
    atualizadoEm: '2026-01-10T08:00:00Z',
    informacoesProduto: {
      nomeProduto: 'Mentoria Individual Business',
      descricaoCurta: 'Mentoria 1:1 para escalar seu negócio digital.',
      preco: 297000,
      urlVenda: '',
      tipo: 'mentoria',
      garantia: '',
    },
    persona: {
      nomePersona: '',
      idadeFaixa: '',
      profissao: '',
      principaisDores: '',
      desejosObjetivos: '',
      nivelConsciencia: '',
    },
    faqObjecoes: [
      { id: 'faq_010', pergunta: '', resposta: '' },
      { id: 'faq_011', pergunta: '', resposta: '' },
      { id: 'faq_012', pergunta: '', resposta: '' },
    ],
    personalidadeAgente: {
      tomVoz: '',
      nomeAgente: '',
      instrucoesEspeciais: '',
      usarEmojis: false,
      usarAudios: false,
      idiomaPrincipal: '',
    },
    limitacoes: {
      topicosProibidos: '',
      nuncaMencionarConcorrentes: false,
      naoPrometerResultados: false,
      limiteDescontoMaximo: null,
      instrucoesTransferirHumano: '',
    },
    entregaveis: {
      tipoEntrega: '',
      instrucoesAcesso: '',
      linkAcesso: '',
      suportePosVenda: '',
    },
  },
]

// === Agentes ===

export const MOCK_AGENTES: Agente[] = [
  {
    id: 'agt_001',
    nome: 'Luna',
    objetivo: 'VENDAS',
    descricao: 'Agente vendedora principal. Qualifica leads de tráfego pago, apresenta o curso e fecha vendas com abordagem consultiva e empática.',
    avatarCor: '#3b82f6',
    status: 'ATIVO',
    config: {
      solicitarAjudaHumana: true,
      usarEmojis: true,
      restringirTemas: true,
      dividirRespostaEmPartes: true,
    },
    basesConhecimentoIds: ['base_001'],
    criadoEm: '2025-12-15T10:00:00Z',
    atualizadoEm: '2026-01-20T14:30:00Z',
  },
  {
    id: 'agt_002',
    nome: 'Rafa',
    objetivo: 'RECUPERACAO',
    descricao: 'Recupera carrinho abandonado e PIX expirado. Aborda com urgência, escassez e oferece desconto progressivo.',
    avatarCor: '#f59e0b',
    status: 'ATIVO',
    config: {
      solicitarAjudaHumana: false,
      usarEmojis: true,
      restringirTemas: true,
      dividirRespostaEmPartes: false,
    },
    basesConhecimentoIds: ['base_001'],
    criadoEm: '2025-12-20T09:00:00Z',
    atualizadoEm: '2026-01-15T11:00:00Z',
  },
  {
    id: 'agt_003',
    nome: 'Ana',
    objetivo: 'SUPORTE',
    descricao: 'Atende dúvidas de alunos já compradores. Ajuda com acesso, problemas técnicos e encaminha casos complexos.',
    avatarCor: '#10b981',
    status: 'INATIVO',
    config: {
      solicitarAjudaHumana: true,
      usarEmojis: false,
      restringirTemas: true,
      dividirRespostaEmPartes: false,
    },
    basesConhecimentoIds: [],
    criadoEm: '2026-01-05T08:00:00Z',
    atualizadoEm: '2026-01-05T08:00:00Z',
  },
  {
    id: 'agt_004',
    nome: 'Jubi',
    objetivo: 'ONBOARDING',
    descricao: 'Agente de boas-vindas para novos alunos. Apresenta a plataforma, dá dicas de primeiros passos e gera entusiasmo.',
    avatarCor: '#8b5cf6',
    status: 'ATIVO',
    config: {
      solicitarAjudaHumana: false,
      usarEmojis: true,
      restringirTemas: false,
      dividirRespostaEmPartes: true,
    },
    basesConhecimentoIds: ['base_002'],
    criadoEm: '2026-01-10T16:00:00Z',
    atualizadoEm: '2026-01-18T09:45:00Z',
  },
]

// === Conversas ===

const now = Date.now()
const minutes = (n: number) => new Date(now - n * 60000).toISOString()
const hours = (n: number) => new Date(now - n * 3600000).toISOString()
const days = (n: number) => new Date(now - n * 86400000).toISOString()

export const MOCK_CONVERSAS: Conversa[] = [
  {
    id: 'conv_001',
    nomeContato: 'João Silva',
    telefone: '+55 11 98765-4321',
    ultimaMensagem: 'Poderia me explicar melhor sobre a garantia?',
    ultimaMensagemEm: minutes(3),
    naoLidas: 2,
    modo: 'IA',
    status: 'EM_ATENDIMENTO',
    avatarCor: '#3b82f6',
    criadoEm: hours(2),
  },
  {
    id: 'conv_002',
    nomeContato: 'Maria Santos',
    telefone: '+55 21 99123-4567',
    ultimaMensagem: 'Perfeito! Vou realizar a compra agora mesmo 🙌',
    ultimaMensagemEm: minutes(15),
    naoLidas: 0,
    modo: 'IA',
    status: 'EM_ATENDIMENTO',
    avatarCor: '#10b981',
    criadoEm: hours(4),
  },
  {
    id: 'conv_003',
    nomeContato: 'Carlos Oliveira',
    telefone: '+55 31 98888-7777',
    ultimaMensagem: 'Obrigado pela atenção, vou pensar e retorno',
    ultimaMensagemEm: hours(1),
    naoLidas: 1,
    modo: 'HUMANO',
    status: 'EM_ATENDIMENTO',
    avatarCor: '#8b5cf6',
    criadoEm: hours(6),
  },
  {
    id: 'conv_004',
    nomeContato: 'Fernanda Costa',
    telefone: '+55 47 97777-8888',
    ultimaMensagem: 'Oi! Vi o anúncio e queria saber mais',
    ultimaMensagemEm: hours(3),
    naoLidas: 3,
    modo: 'IA',
    status: 'AGUARDANDO',
    avatarCor: '#f59e0b',
    criadoEm: hours(3),
  },
  {
    id: 'conv_005',
    nomeContato: 'Rafael Mendes',
    telefone: '+55 85 96666-5555',
    ultimaMensagem: 'Show! Aguardo o link de acesso então',
    ultimaMensagemEm: hours(8),
    naoLidas: 0,
    modo: 'HUMANO',
    status: 'EM_ATENDIMENTO',
    avatarCor: '#ec4899',
    criadoEm: days(1),
  },
  {
    id: 'conv_006',
    nomeContato: 'Juliana Pereira',
    telefone: '+55 62 95555-4444',
    ultimaMensagem: 'Compra finalizada com sucesso! Obrigada 🎉',
    ultimaMensagemEm: days(2),
    naoLidas: 0,
    modo: 'IA',
    status: 'FINALIZADA',
    avatarCor: '#14b8a6',
    criadoEm: days(3),
  },
]

export const MOCK_MENSAGENS: Mensagem[] = [
  // Conversa 001 - João Silva (EM_ATENDIMENTO, IA)
  { id: 'msg_001', conversaId: 'conv_001', tipo: 'INCOMING', conteudo: 'Oi, vi o anúncio do Curso de Tráfego Pago', enviadaEm: hours(2), status: 'LIDA' },
  { id: 'msg_002', conversaId: 'conv_001', tipo: 'OUTGOING_IA', conteudo: 'Olá João! Tudo bem? Que ótimo saber do seu interesse no curso! 😊 Posso te ajudar com alguma dúvida específica?', enviadaEm: hours(2), status: 'LIDA' },
  { id: 'msg_003', conversaId: 'conv_001', tipo: 'INCOMING', conteudo: 'Quanto custa?', enviadaEm: hours(2), status: 'LIDA' },
  { id: 'msg_004', conversaId: 'conv_001', tipo: 'OUTGOING_IA', conteudo: 'O investimento é de R$ 997,00 à vista ou em até 12x no cartão. E o melhor: você tem 7 dias de garantia incondicional!', enviadaEm: hours(2), status: 'LIDA' },
  { id: 'msg_005', conversaId: 'conv_001', tipo: 'INCOMING', conteudo: 'Funciona para iniciantes mesmo?', enviadaEm: minutes(30), status: 'LIDA' },
  { id: 'msg_006', conversaId: 'conv_001', tipo: 'OUTGOING_IA', conteudo: 'Com certeza! O curso começa do absoluto zero. Você não precisa de nenhum conhecimento prévio. Em 2-4 semanas alunos dedicados já veem os primeiros resultados.', enviadaEm: minutes(30), status: 'LIDA' },
  { id: 'msg_007', conversaId: 'conv_001', tipo: 'INCOMING', conteudo: 'Tem suporte?', enviadaEm: minutes(5), status: 'LIDA' },
  { id: 'msg_008', conversaId: 'conv_001', tipo: 'INCOMING', conteudo: 'Poderia me explicar melhor sobre a garantia?', enviadaEm: minutes(3), status: 'ENTREGUE' },

  // Conversa 002 - Maria Santos (EM_ATENDIMENTO, IA, preparada pra comprar)
  { id: 'msg_101', conversaId: 'conv_002', tipo: 'INCOMING', conteudo: 'Oi, tenho interesse no curso', enviadaEm: hours(4), status: 'LIDA' },
  { id: 'msg_102', conversaId: 'conv_002', tipo: 'OUTGOING_IA', conteudo: 'Olá Maria! Que bom te ver aqui! 💙 Me conta um pouco sobre você: já trabalha com vendas online?', enviadaEm: hours(4), status: 'LIDA' },
  { id: 'msg_103', conversaId: 'conv_002', tipo: 'INCOMING', conteudo: 'Trabalho com afiliados há 6 meses, mas não tô conseguindo escalar', enviadaEm: hours(3), status: 'LIDA' },
  { id: 'msg_104', conversaId: 'conv_002', tipo: 'OUTGOING_IA', conteudo: 'Entendo perfeitamente! Esse é exatamente o problema que o curso resolve. Ensinamos a estruturar campanhas que escalam de R$ 10/dia para R$ 1000/dia de forma segura.', enviadaEm: hours(3), status: 'LIDA' },
  { id: 'msg_105', conversaId: 'conv_002', tipo: 'INCOMING', conteudo: 'Quanto é?', enviadaEm: hours(1), status: 'LIDA' },
  { id: 'msg_106', conversaId: 'conv_002', tipo: 'OUTGOING_IA', conteudo: 'R$ 997 à vista ou 12x. Tem garantia de 7 dias. Posso te enviar o link?', enviadaEm: hours(1), status: 'LIDA' },
  { id: 'msg_107', conversaId: 'conv_002', tipo: 'INCOMING', conteudo: 'Pode mandar sim', enviadaEm: minutes(20), status: 'LIDA' },
  { id: 'msg_108', conversaId: 'conv_002', tipo: 'OUTGOING_IA', conteudo: 'Aqui está: https://exemplo.com/trafego-pago 🚀 Qualquer dúvida me chama!', enviadaEm: minutes(18), status: 'LIDA' },
  { id: 'msg_109', conversaId: 'conv_002', tipo: 'INCOMING', conteudo: 'Perfeito! Vou realizar a compra agora mesmo 🙌', enviadaEm: minutes(15), status: 'LIDA' },

  // Conversa 003 - Carlos Oliveira (HUMANO assumiu)
  { id: 'msg_201', conversaId: 'conv_003', tipo: 'INCOMING', conteudo: 'Queria saber se o método funciona para meu nicho', enviadaEm: hours(6), status: 'LIDA' },
  { id: 'msg_202', conversaId: 'conv_003', tipo: 'OUTGOING_IA', conteudo: 'Oi Carlos! Qual é o seu nicho?', enviadaEm: hours(6), status: 'LIDA' },
  { id: 'msg_203', conversaId: 'conv_003', tipo: 'INCOMING', conteudo: 'Trabalho com produtos físicos de moda masculina', enviadaEm: hours(5), status: 'LIDA' },
  { id: 'msg_204', conversaId: 'conv_003', tipo: 'OUTGOING_IA', conteudo: 'Entendi! Vou transferir para um especialista que entende melhor de e-commerce.', enviadaEm: hours(5), status: 'LIDA' },
  { id: 'msg_205', conversaId: 'conv_003', tipo: 'OUTGOING_HUMANO', conteudo: 'Oi Carlos! Aqui é a Nathalia. Vi que você trabalha com moda masculina. O curso tem um módulo específico de e-commerce que vai te ajudar muito.', enviadaEm: hours(4), status: 'LIDA' },
  { id: 'msg_206', conversaId: 'conv_003', tipo: 'INCOMING', conteudo: 'Legal! Tem algum caso de sucesso desse nicho?', enviadaEm: hours(3), status: 'LIDA' },
  { id: 'msg_207', conversaId: 'conv_003', tipo: 'OUTGOING_HUMANO', conteudo: 'Sim! Temos vários. Posso te enviar depoimentos em vídeo de alunos que vendem roupas e escalaram para mais de 100k/mês.', enviadaEm: hours(3), status: 'LIDA' },
  { id: 'msg_208', conversaId: 'conv_003', tipo: 'INCOMING', conteudo: 'Obrigado pela atenção, vou pensar e retorno', enviadaEm: hours(1), status: 'ENTREGUE' },

  // Conversa 004 - Fernanda Costa (AGUARDANDO, 3 nao lidas)
  { id: 'msg_301', conversaId: 'conv_004', tipo: 'INCOMING', conteudo: 'Oi! Vi o anúncio e queria saber mais', enviadaEm: hours(3), status: 'ENTREGUE' },
  { id: 'msg_302', conversaId: 'conv_004', tipo: 'INCOMING', conteudo: 'Pode me explicar?', enviadaEm: hours(3), status: 'ENTREGUE' },
  { id: 'msg_303', conversaId: 'conv_004', tipo: 'INCOMING', conteudo: 'Alô?', enviadaEm: hours(3), status: 'ENTREGUE' },

  // Conversa 005 - Rafael Mendes (HUMANO, fechou compra)
  { id: 'msg_401', conversaId: 'conv_005', tipo: 'INCOMING', conteudo: 'Bom dia! Gostaria da mentoria individual', enviadaEm: days(1), status: 'LIDA' },
  { id: 'msg_402', conversaId: 'conv_005', tipo: 'OUTGOING_HUMANO', conteudo: 'Bom dia Rafael! Que bom seu interesse. A mentoria é individual e custa R$ 2.970. Você tem alguma experiência com tráfego?', enviadaEm: days(1), status: 'LIDA' },
  { id: 'msg_403', conversaId: 'conv_005', tipo: 'INCOMING', conteudo: 'Já rodei alguns anúncios mas quero um acompanhamento pessoal', enviadaEm: hours(22), status: 'LIDA' },
  { id: 'msg_404', conversaId: 'conv_005', tipo: 'OUTGOING_HUMANO', conteudo: 'Perfeito! A mentoria tem 8 encontros 1:1 comigo, análise de campanhas em tempo real e grupo VIP. Posso te enviar o link?', enviadaEm: hours(22), status: 'LIDA' },
  { id: 'msg_405', conversaId: 'conv_005', tipo: 'INCOMING', conteudo: 'Manda', enviadaEm: hours(10), status: 'LIDA' },
  { id: 'msg_406', conversaId: 'conv_005', tipo: 'OUTGOING_HUMANO', conteudo: 'Aqui: https://exemplo.com/mentoria-business', enviadaEm: hours(10), status: 'LIDA' },
  { id: 'msg_407', conversaId: 'conv_005', tipo: 'INCOMING', conteudo: 'Show! Aguardo o link de acesso então', enviadaEm: hours(8), status: 'LIDA' },

  // Conversa 006 - Juliana Pereira (FINALIZADA)
  { id: 'msg_501', conversaId: 'conv_006', tipo: 'INCOMING', conteudo: 'Acabei de comprar! Como faço pra acessar?', enviadaEm: days(2), status: 'LIDA' },
  { id: 'msg_502', conversaId: 'conv_006', tipo: 'OUTGOING_IA', conteudo: 'Parabéns pela decisão Juliana! 🎉 Seu acesso já foi liberado no e-mail cadastrado. Qualquer dúvida, estou aqui!', enviadaEm: days(2), status: 'LIDA' },
  { id: 'msg_503', conversaId: 'conv_006', tipo: 'INCOMING', conteudo: 'Compra finalizada com sucesso! Obrigada 🎉', enviadaEm: days(2), status: 'LIDA' },
]

export const MOCK_DASHBOARD_KPIS: DashboardKPIs = {
  leadsNoMes: 1247,
  leadsVariacao: 12.5,
  conversasAtivas: 89,
  conversasVariacao: -3.2,
  taxaConversao: 8.7,
  conversaoVariacao: 1.4,
}
