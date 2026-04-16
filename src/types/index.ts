export type Plano = 'STARTER' | 'PRO' | 'BUSINESS'
export type StatusCliente = 'TRIAL' | 'ATIVO' | 'CANCELADO'

export type ProvedorCheckout =
  | 'HOTMART'
  | 'KIWIFY'
  | 'TICTO'

export type StatusIntegracao = 'ATIVO' | 'INATIVO' | 'ERRO'
export type StatusWhatsapp = 'DESCONECTADO' | 'CONECTANDO' | 'CONECTADO' | 'ERRO'

export type RoleUsuario = 'USER' | 'ADMIN'

export interface Usuario {
  id: string
  email: string
  nome: string
  fotoUrl?: string | null
  agentesDesligados?: boolean
  role?: RoleUsuario
  ultimoLogin?: string | null
  plano: Plano
  status: StatusCliente
  criadoEm: string
}

export type EventoAutomacao =
  | 'COMPRA_APROVADA'
  | 'COMPRA_RECUSADA'
  | 'REEMBOLSO'
  | 'ASSINATURA_CANCELADA'
  | 'CARRINHO_ABANDONADO'

export interface Automacao {
  id: string
  nome: string
  ativo: boolean
  evento: EventoAutomacao
  provedor: ProvedorCheckout | null
  produtoId: string | null
  agenteId: string | null
  mensagemInicial: string | null
  delayMinutos: number
  executarSeExiste: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface ProvedorInfo {
  id: ProvedorCheckout
  nome: string
  descricao: string
  corPrimaria: string
  inicial: string
}

export interface IntegracaoCheckout {
  id: string
  provedor: ProvedorCheckout
  nomeConta: string
  status: StatusIntegracao
  webhookUrl: string
  ultimoRecebimento?: string
  produtos: ProdutoCheckout[]
  criadoEm: string
}

export interface ProdutoCheckout {
  id: string
  idExternoProduto: string
  nomeProduto: string
  agenteVinculadoId?: string | null
  templatePrimeiraMensagem?: string | null
}

export interface InstanciaWhatsapp {
  id: string
  nomeInstancia: string
  numeroConectado?: string
  status: StatusWhatsapp
  qrCode?: string
  criadoEm: string
}

export interface DashboardKPIs {
  leadsNoMes: number
  leadsVariacao: number
  conversasAtivas: number
  conversasVariacao: number
  taxaConversao: number
  conversaoVariacao: number
}

// === Base de Conhecimento ===

export type TipoProduto = 'curso' | 'mentoria' | 'ebook' | 'software' | 'servico' | 'outro'
export type NivelConsciencia = 'inconsciente' | 'consciente_problema' | 'consciente_solucao' | 'consciente_produto' | 'mais_consciente'
export type TomVoz = 'formal' | 'informal' | 'amigavel' | 'profissional' | 'descontraido'
export type IdiomaAgente = 'portugues' | 'ingles' | 'espanhol'
export type TipoEntrega = 'acesso_imediato' | 'envio_email' | 'link_download' | 'area_membros'
export type SecaoBaseConhecimento = 'informacoes' | 'persona' | 'faq' | 'personalidade' | 'limitacoes' | 'entregaveis'

export interface InformacoesProduto {
  nomeProduto: string
  descricaoCurta: string
  preco: number | null
  urlVenda: string
  tipo: TipoProduto | ''
  garantia: string
}

export interface Persona {
  nomePersona: string
  idadeFaixa: string
  profissao: string
  principaisDores: string
  desejosObjetivos: string
  nivelConsciencia: NivelConsciencia | ''
}

export interface FaqItem {
  id: string
  pergunta: string
  resposta: string
}

export interface PersonalidadeAgente {
  tomVoz: TomVoz | ''
  nomeAgente: string
  instrucoesEspeciais: string
  usarEmojis: boolean
  usarAudios: boolean
  idiomaPrincipal: IdiomaAgente | ''
}

export interface LimitacoesConfig {
  topicosProibidos: string
  nuncaMencionarConcorrentes: boolean
  naoPrometerResultados: boolean
  limiteDescontoMaximo: number | null
  instrucoesTransferirHumano: string
}

export interface Entregaveis {
  tipoEntrega: TipoEntrega | ''
  instrucoesAcesso: string
  linkAcesso: string
  suportePosVenda: string
}

export interface BaseConhecimento {
  id: string
  nome: string
  criadoEm: string
  atualizadoEm: string
  informacoesProduto: InformacoesProduto
  persona: Persona
  faqObjecoes: FaqItem[]
  personalidadeAgente: PersonalidadeAgente
  limitacoes: LimitacoesConfig
  entregaveis: Entregaveis
}

// === Agentes ===

export type ObjetivoAgente = 'VENDAS' | 'SUPORTE' | 'RECUPERACAO' | 'ONBOARDING' | 'USO_PESSOAL'
export type StatusAgente = 'ATIVO' | 'INATIVO'
export type SecaoAgente = 'geral' | 'configuracoes' | 'bases' | 'teste'

export interface ConfigAgente {
  solicitarAjudaHumana: boolean
  usarEmojis: boolean
  restringirTemas: boolean
  dividirRespostaEmPartes: boolean
}

export interface Agente {
  id: string
  nome: string
  objetivo: ObjetivoAgente
  descricao: string
  avatarCor: string
  status: StatusAgente
  config: ConfigAgente
  basesConhecimentoIds: string[]
  criadoEm: string
  atualizadoEm: string
}

// === Conversas ===

export type StatusConversa = 'AGUARDANDO' | 'EM_ATENDIMENTO' | 'FINALIZADA'
export type ModoConversa = 'IA' | 'HUMANO'
export type TipoMensagem = 'INCOMING' | 'OUTGOING_IA' | 'OUTGOING_HUMANO'
export type StatusMensagem = 'ENVIADA' | 'ENTREGUE' | 'LIDA'
export type TipoMidia =
  | 'TEXTO'
  | 'IMAGEM'
  | 'AUDIO'
  | 'VIDEO'
  | 'DOCUMENTO'
  | 'STICKER'
  | 'LOCALIZACAO'
  | 'CONTATO'

export interface Conversa {
  id: string
  nomeContato: string
  telefone: string
  fotoUrl?: string
  ultimaMensagem: string
  ultimaMensagemEm: string
  naoLidas: number
  modo: ModoConversa
  status: StatusConversa
  avatarCor: string
  agenteId?: string | null
  criadoEm: string
}

export interface Mensagem {
  id: string
  conversaId: string
  tipo: TipoMensagem
  conteudo: string
  enviadaEm: string
  status: StatusMensagem
  tipoMidia?: TipoMidia
  midiaUrl?: string
}
