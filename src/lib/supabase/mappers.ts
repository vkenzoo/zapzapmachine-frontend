import type {
  BaseConhecimento,
  Agente,
  IntegracaoCheckout,
  InstanciaWhatsapp,
  Conversa,
  Mensagem,
} from '@/types'

// ============================================================================
// BASE CONHECIMENTO
// ============================================================================
type BaseConhecimentoRow = {
  id: string
  nome: string
  informacoes_produto: unknown
  persona: unknown
  faq_objecoes: unknown
  personalidade_agente: unknown
  limitacoes: unknown
  entregaveis: unknown
  criado_em: string
  atualizado_em: string
}

export const baseConhecimentoFromRow = (row: BaseConhecimentoRow): BaseConhecimento => ({
  id: row.id,
  nome: row.nome,
  informacoesProduto: row.informacoes_produto as BaseConhecimento['informacoesProduto'],
  persona: row.persona as BaseConhecimento['persona'],
  faqObjecoes: row.faq_objecoes as BaseConhecimento['faqObjecoes'],
  personalidadeAgente: row.personalidade_agente as BaseConhecimento['personalidadeAgente'],
  limitacoes: row.limitacoes as BaseConhecimento['limitacoes'],
  entregaveis: row.entregaveis as BaseConhecimento['entregaveis'],
  criadoEm: row.criado_em,
  atualizadoEm: row.atualizado_em,
})

// ============================================================================
// AGENTE
// ============================================================================
type AgenteRow = {
  id: string
  nome: string
  objetivo: string
  descricao: string | null
  avatar_cor: string
  status: string
  config: unknown
  criado_em: string
  atualizado_em: string
}

export const agenteFromRow = (
  row: AgenteRow,
  basesIds: string[] = []
): Agente => ({
  id: row.id,
  nome: row.nome,
  objetivo: row.objetivo as Agente['objetivo'],
  descricao: row.descricao ?? '',
  avatarCor: row.avatar_cor,
  status: row.status as Agente['status'],
  config: row.config as Agente['config'],
  basesConhecimentoIds: basesIds,
  criadoEm: row.criado_em,
  atualizadoEm: row.atualizado_em,
})

// ============================================================================
// INTEGRACAO CHECKOUT
// ============================================================================
type IntegracaoRow = {
  id: string
  provedor: string
  nome_conta: string
  status: string
  webhook_secret: string
  ultimo_recebimento: string | null
  criado_em: string
}

type ProdutoRow = {
  id: string
  id_externo_produto: string
  nome_produto: string
  agente_vinculado_id: string | null
  template_primeira_mensagem: string | null
}

const BACKEND_WEBHOOK_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://api.zapzapmachine.com'

export const integracaoFromRow = (
  row: IntegracaoRow,
  produtos: ProdutoRow[] = []
): IntegracaoCheckout => ({
  id: row.id,
  provedor: row.provedor as IntegracaoCheckout['provedor'],
  nomeConta: row.nome_conta,
  status: row.status as IntegracaoCheckout['status'],
  webhookUrl: `${BACKEND_WEBHOOK_BASE}/webhooks/checkout/${row.provedor.toLowerCase()}?secret=${row.webhook_secret}`,
  ultimoRecebimento: row.ultimo_recebimento ?? undefined,
  produtos: produtos.map((p) => ({
    id: p.id,
    idExternoProduto: p.id_externo_produto,
    nomeProduto: p.nome_produto,
    agenteVinculadoId: p.agente_vinculado_id ?? null,
    templatePrimeiraMensagem: p.template_primeira_mensagem ?? null,
  })),
  criadoEm: row.criado_em,
})

// ============================================================================
// INSTANCIA WHATSAPP
// ============================================================================
type InstanciaRow = {
  id: string
  nome_instancia: string
  numero_conectado: string | null
  status: string
  criado_em: string
}

export const instanciaFromRow = (row: InstanciaRow): InstanciaWhatsapp => ({
  id: row.id,
  nomeInstancia: row.nome_instancia,
  numeroConectado: row.numero_conectado ?? undefined,
  status: row.status as InstanciaWhatsapp['status'],
  criadoEm: row.criado_em,
})

// ============================================================================
// CONVERSA
// ============================================================================
type ConversaRow = {
  id: string
  nome_contato: string
  telefone: string
  foto_url: string | null
  ultima_mensagem: string | null
  ultima_mensagem_em: string
  nao_lidas: number
  modo: string
  status: string
  avatar_cor: string
  agente_id: string | null
  instancia_whatsapp_id: string | null
  criado_em: string
}

export const conversaFromRow = (row: ConversaRow): Conversa => ({
  id: row.id,
  nomeContato: row.nome_contato,
  telefone: row.telefone,
  fotoUrl: row.foto_url ?? undefined,
  ultimaMensagem: row.ultima_mensagem ?? '',
  ultimaMensagemEm: row.ultima_mensagem_em,
  naoLidas: row.nao_lidas,
  modo: row.modo as Conversa['modo'],
  status: row.status as Conversa['status'],
  avatarCor: row.avatar_cor,
  agenteId: row.agente_id ?? null,
  instanciaWhatsappId: row.instancia_whatsapp_id ?? null,
  criadoEm: row.criado_em,
})

// ============================================================================
// MENSAGEM
// ============================================================================
type MensagemRow = {
  id: string
  conversa_id: string
  tipo: string
  conteudo: string
  enviada_em: string
  status: string
  tipo_midia?: string | null
  midia_url?: string | null
}

export const mensagemFromRow = (row: MensagemRow): Mensagem => ({
  id: row.id,
  conversaId: row.conversa_id,
  tipo: row.tipo as Mensagem['tipo'],
  conteudo: row.conteudo,
  enviadaEm: row.enviada_em,
  status: row.status as Mensagem['status'],
  tipoMidia: (row.tipo_midia as Mensagem['tipoMidia']) ?? 'TEXTO',
  midiaUrl: row.midia_url ?? undefined,
})
