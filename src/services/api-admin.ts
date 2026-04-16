import { apiFetch } from '@/lib/backend'
import type { RoleUsuario } from '@/types'

export interface AdminStats {
  totalUsuarios: number
  totalWhatsapps: number
  totalAgentes: number
  totalBases: number
  totalAutomacoes: number
  gastoIaTotalUSD: number
  gastoIa30dUSD: number
}

export interface AdminUsuario {
  id: string
  nome: string
  email: string | null
  role: RoleUsuario
  plano: string
  status: string
  criado_em: string
  ultimo_login: string | null
  foto_url: string | null
  agentes_desligados: boolean
}

export interface GastoPorDia {
  dia: string
  custoUSD: number
  chamadas: number
  tokens: number
}
export interface GastoPorTipo {
  tipo: string
  custoUSD: number
  chamadas: number
}
export interface GastoPorProvider {
  provider: string
  custoUSD: number
  chamadas: number
}
export interface AdminGastos {
  periodo: string
  custoTotalUSD: number
  totalChamadas: number
  porDia: GastoPorDia[]
  porTipo: GastoPorTipo[]
  porProvider: GastoPorProvider[]
}

export interface GastoPorUsuario {
  userId: string
  nome: string
  custoUSD: number
  chamadas: number
  tokens: number
}

export interface LogIA {
  id: string
  user_id: string
  conversa_id: string | null
  agente_id: string | null
  provider: string
  model: string
  tipo: string
  input_tokens: number
  output_tokens: number
  cache_read_tokens: number
  cache_creation_tokens: number
  custo_usd: number
  duracao_ms: number | null
  system_prompt_preview: string | null
  erro: boolean
  erro_mensagem: string | null
  criado_em: string
}

export interface LogCheckout {
  id: string
  integracao_id: string | null
  user_id: string
  provedor: string
  evento: string
  status_webhook: 'SUCESSO' | 'ERRO' | 'IGNORADO'
  payload: unknown
  erro_mensagem: string | null
  conversa_id: string | null
  criado_em: string
}

export interface ConfigPrompt {
  id: string
  chave: string
  titulo: string
  conteudo: string
  ativo: boolean
  atualizado_em: string
  criado_em: string
}

interface Paginado<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export const apiAdmin = {
  stats: async (): Promise<AdminStats> => {
    const res = await apiFetch('/admin/stats')
    return res.json()
  },

  usuarios: {
    listar: async (): Promise<AdminUsuario[]> => {
      const res = await apiFetch('/admin/usuarios')
      return res.json()
    },
    alterarRole: async (id: string, role: RoleUsuario): Promise<void> => {
      await apiFetch(`/admin/usuarios/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      })
    },
  },

  ia: {
    gastos: async (): Promise<AdminGastos> => {
      const res = await apiFetch('/admin/ia/gastos')
      return res.json()
    },
    gastosPorUsuario: async (): Promise<GastoPorUsuario[]> => {
      const res = await apiFetch('/admin/ia/gastos-por-usuario')
      return res.json()
    },
    logs: async (page = 1, limit = 50): Promise<Paginado<LogIA>> => {
      const res = await apiFetch(`/admin/ia/logs?page=${page}&limit=${limit}`)
      return res.json()
    },
  },

  checkout: {
    logs: async (page = 1, limit = 50): Promise<Paginado<LogCheckout>> => {
      const res = await apiFetch(`/admin/checkout/logs?page=${page}&limit=${limit}`)
      return res.json()
    },
  },

  prompts: {
    listar: async (): Promise<ConfigPrompt[]> => {
      const res = await apiFetch('/admin/prompts')
      return res.json()
    },
    atualizar: async (
      chave: string,
      dados: { titulo?: string; conteudo: string; ativo?: boolean }
    ): Promise<void> => {
      await apiFetch(`/admin/prompts/${chave}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
      })
    },
  },
}
