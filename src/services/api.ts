import type {
  IntegracaoCheckout,
  InstanciaWhatsapp,
  DashboardKPIs,
  ProvedorCheckout,
  ProdutoCheckout,
  BaseConhecimento,
  SecaoBaseConhecimento,
  Conversa,
  Mensagem,
  Agente,
  ObjetivoAgente,
  ConfigAgente,
  Automacao,
  EventoAutomacao,
} from '@/types'
import { CORES_AVATAR_AGENTE, PROVEDORES } from '@/lib/constants'
import { criarBaseConhecimentoVazia } from '@/lib/base-conhecimento-utils'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { apiFetch } from '@/lib/backend'
import {
  baseConhecimentoFromRow,
  agenteFromRow,
  integracaoFromRow,
  instanciaFromRow,
  conversaFromRow,
  mensagemFromRow,
} from '@/lib/supabase/mappers'

const supabase = createSupabaseClient()

const getUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario nao autenticado')
  return user.id
}

export const api = {

  integracoes: {
    listarCheckouts: async (): Promise<IntegracaoCheckout[]> => {
      const userId = await getUserId()
      const { data, error } = await supabase
        .from('integracoes_checkout')
        .select('*, produtos_checkout(*)')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false })
      if (error) throw error
      return (data ?? []).map((row) => {
        const { produtos_checkout: produtos, ...integracaoRow } = row as typeof row & {
          produtos_checkout: Parameters<typeof integracaoFromRow>[1]
        }
        return integracaoFromRow(integracaoRow, produtos ?? [])
      })
    },

    criarCheckout: async (
      provedor: ProvedorCheckout
    ): Promise<IntegracaoCheckout> => {
      const userId = await getUserId()
      const provedorInfo = PROVEDORES[provedor]
      const { data, error } = await supabase
        .from('integracoes_checkout')
        .insert({
          user_id: userId,
          provedor,
          nome_conta: `Conta ${provedorInfo.nome} - ${crypto.randomUUID().slice(0, 8)}`,
          status: 'ATIVO',
        })
        .select()
        .single()
      if (error) throw error
      return integracaoFromRow(data, [])
    },

    obterCheckout: async (
      id: string
    ): Promise<IntegracaoCheckout | null> => {
      const userId = await getUserId()
      const { data, error } = await supabase
        .from('integracoes_checkout')
        .select('*, produtos_checkout(*)')
        .eq('id', id)
        .eq('user_id', userId) // defesa em profundidade: nao confia so na RLS
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      const { produtos_checkout: produtos, ...integracaoRow } = data as typeof data & {
        produtos_checkout: Parameters<typeof integracaoFromRow>[1]
      }
      return integracaoFromRow(integracaoRow, produtos ?? [])
    },

    obterCheckoutPorProvedor: async (
      provedor: string
    ): Promise<IntegracaoCheckout | null> => {
      const userId = await getUserId()
      const { data, error } = await supabase
        .from('integracoes_checkout')
        .select('*, produtos_checkout(*)')
        .eq('user_id', userId)
        .eq('provedor', provedor.toUpperCase())
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      const { produtos_checkout: produtos, ...integracaoRow } = data as typeof data & {
        produtos_checkout: Parameters<typeof integracaoFromRow>[1]
      }
      return integracaoFromRow(integracaoRow, produtos ?? [])
    },

    desassociarCheckout: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('integracoes_checkout')
        .delete()
        .eq('id', id)
      if (error) throw error
    },

    statusWebhook: async (
      integracaoId: string
    ): Promise<{
      integracaoId: string
      ultimoRecebimento: string | null
      criadoEm: string
      total24h: number
      jaRecebeu: boolean
    }> => {
      return apiFetch(`/whatsapp/integracoes/${integracaoId}/status-webhook`)
    },

    atualizarProduto: async (
      produtoId: string,
      dados: {
        agenteVinculadoId?: string | null
        templatePrimeiraMensagem?: string | null
        nomeProduto?: string
      }
    ): Promise<void> => {
      const update: Record<string, unknown> = {}
      if (dados.agenteVinculadoId !== undefined)
        update.agente_vinculado_id = dados.agenteVinculadoId
      if (dados.templatePrimeiraMensagem !== undefined)
        update.template_primeira_mensagem = dados.templatePrimeiraMensagem
      if (dados.nomeProduto !== undefined) update.nome_produto = dados.nomeProduto

      const { error } = await supabase
        .from('produtos_checkout')
        .update(update)
        .eq('id', produtoId)
      if (error) throw error
    },

    criarProduto: async (
      integracaoId: string,
      dados: {
        idExternoProduto: string
        nomeProduto: string
      }
    ): Promise<ProdutoCheckout> => {
      const { data, error } = await supabase
        .from('produtos_checkout')
        .insert({
          integracao_id: integracaoId,
          id_externo_produto: dados.idExternoProduto,
          nome_produto: dados.nomeProduto,
        })
        .select('*')
        .single()
      if (error) throw error
      return {
        id: data.id,
        idExternoProduto: data.id_externo_produto,
        nomeProduto: data.nome_produto,
        agenteVinculadoId: data.agente_vinculado_id ?? null,
        templatePrimeiraMensagem: data.template_primeira_mensagem ?? null,
      }
    },

    excluirProduto: async (produtoId: string): Promise<void> => {
      const { error } = await supabase
        .from('produtos_checkout')
        .delete()
        .eq('id', produtoId)
      if (error) throw error
    },
  },

  whatsapp: {
    listarInstancias: async (): Promise<InstanciaWhatsapp[]> => {
      const userId = await getUserId()
      const { data, error } = await supabase
        .from('instancias_whatsapp')
        .select('*')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false })
      if (error) throw error
      return (data ?? []).map(instanciaFromRow)
    },

    criarInstancia: async (nome: string): Promise<InstanciaWhatsapp> => {
      // Backend cria no Evolution + insere no banco
      const res = await apiFetch<{ id: string }>('/whatsapp/instancias', {
        method: 'POST',
        body: JSON.stringify({ nome }),
      })
      // Le o row completo do banco pra retornar InstanciaWhatsapp padrao
      const { data, error } = await supabase
        .from('instancias_whatsapp')
        .select('*')
        .eq('id', res.id)
        .single()
      if (error) throw error
      return instanciaFromRow(data)
    },

    verificarConexao: async (
      id: string
    ): Promise<InstanciaWhatsapp> => {
      // Backend consulta Evolution + atualiza status no banco
      await apiFetch(`/whatsapp/${id}/status`)
      // Le row atualizado
      const { data } = await supabase
        .from('instancias_whatsapp')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      return data
        ? instanciaFromRow(data)
        : {
            id,
            nomeInstancia: '',
            status: 'ERRO',
            criadoEm: new Date().toISOString(),
          }
    },

    desconectar: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('instancias_whatsapp')
        .update({ status: 'DESCONECTADO', numero_conectado: null })
        .eq('id', id)
      if (error) throw error
    },

    obterQrCode: async (id: string): Promise<string> => {
      const res = await apiFetch<{ qrCode: string }>(`/whatsapp/${id}/qr`)
      return res.qrCode
    },
  },

  dashboard: {
    obterKPIs: async (): Promise<DashboardKPIs> => {
      const userId = await getUserId()
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)

      const [
        { count: leadsMes },
        { count: conversasAtivas },
        { count: totalConversas },
        { count: conversasFinalizadas },
      ] = await Promise.all([
        supabase
          .from('conversas')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('criado_em', inicioMes.toISOString()),
        supabase
          .from('conversas')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'EM_ATENDIMENTO'),
        supabase
          .from('conversas')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('conversas')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'FINALIZADA'),
      ])

      const taxaConversao =
        totalConversas && totalConversas > 0
          ? Math.round(((conversasFinalizadas ?? 0) / totalConversas) * 1000) / 10
          : 0

      return {
        leadsNoMes: leadsMes ?? 0,
        leadsVariacao: 0,
        conversasAtivas: conversasAtivas ?? 0,
        conversasVariacao: 0,
        taxaConversao,
        conversaoVariacao: 0,
      }
    },
  },

  baseConhecimento: {
    listar: async (): Promise<BaseConhecimento[]> => {
      const userId = await getUserId()
      const { data, error } = await supabase
        .from('bases_conhecimento')
        .select('*')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false })
      if (error) throw error
      return (data ?? []).map(baseConhecimentoFromRow)
    },

    obter: async (id: string): Promise<BaseConhecimento | null> => {
      const { data, error } = await supabase
        .from('bases_conhecimento')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data ? baseConhecimentoFromRow(data) : null
    },

    criar: async (nome: string): Promise<BaseConhecimento> => {
      const userId = await getUserId()
      const vazia = criarBaseConhecimentoVazia(nome)
      const { data, error } = await supabase
        .from('bases_conhecimento')
        .insert({
          user_id: userId,
          nome: vazia.nome,
          informacoes_produto: vazia.informacoesProduto,
          persona: vazia.persona,
          faq_objecoes: vazia.faqObjecoes,
          personalidade_agente: vazia.personalidadeAgente,
          limitacoes: vazia.limitacoes,
          entregaveis: vazia.entregaveis,
        })
        .select()
        .single()
      if (error) throw error
      return baseConhecimentoFromRow(data)
    },

    atualizarSecao: async (
      id: string,
      secao: SecaoBaseConhecimento,
      dados: Partial<BaseConhecimento>
    ): Promise<BaseConhecimento> => {
      const update: Record<string, unknown> = {}
      switch (secao) {
        case 'informacoes':
          if (dados.informacoesProduto) update.informacoes_produto = dados.informacoesProduto
          break
        case 'persona':
          if (dados.persona) update.persona = dados.persona
          break
        case 'faq':
          if (dados.faqObjecoes) update.faq_objecoes = dados.faqObjecoes
          break
        case 'personalidade':
          if (dados.personalidadeAgente) update.personalidade_agente = dados.personalidadeAgente
          break
        case 'limitacoes':
          if (dados.limitacoes) update.limitacoes = dados.limitacoes
          break
        case 'entregaveis':
          if (dados.entregaveis) update.entregaveis = dados.entregaveis
          break
      }

      const { data, error } = await supabase
        .from('bases_conhecimento')
        .update(update)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return baseConhecimentoFromRow(data)
    },

    excluir: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('bases_conhecimento')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
  },

  conversas: {
    listar: async (): Promise<Conversa[]> => {
      const userId = await getUserId()
      const { data, error } = await supabase
        .from('conversas')
        .select('*')
        .eq('user_id', userId)
        .order('ultima_mensagem_em', { ascending: false })
      if (error) throw error
      return (data ?? []).map(conversaFromRow)
    },

    obter: async (id: string): Promise<Conversa | null> => {
      const { data, error } = await supabase
        .from('conversas')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data ? conversaFromRow(data) : null
    },

    listarMensagens: async (conversaId: string): Promise<Mensagem[]> => {
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('enviada_em', { ascending: true })
      if (error) throw error
      return (data ?? []).map(mensagemFromRow)
    },

    enviarMensagem: async (
      conversaId: string,
      conteudo: string,
      // tipo mantido para compat; backend sempre marca OUTGOING_HUMANO por enquanto
      _tipo: 'OUTGOING_IA' | 'OUTGOING_HUMANO' = 'OUTGOING_HUMANO'
    ): Promise<Mensagem> => {
      // Backend envia via Evolution (WhatsApp real) + salva no banco
      const msgRow = await apiFetch<Parameters<typeof mensagemFromRow>[0]>(
        `/whatsapp/conversas/${conversaId}/enviar`,
        {
          method: 'POST',
          body: JSON.stringify({ texto: conteudo }),
        }
      )
      return mensagemFromRow(msgRow)
    },

    enviarMidia: async (
      conversaId: string,
      params: {
        tipoMidia: 'IMAGEM' | 'AUDIO' | 'VIDEO' | 'DOCUMENTO'
        base64: string
        mimetype: string
        fileName?: string
        legenda?: string
      }
    ): Promise<Mensagem> => {
      const msgRow = await apiFetch<Parameters<typeof mensagemFromRow>[0]>(
        `/whatsapp/conversas/${conversaId}/enviar-midia`,
        {
          method: 'POST',
          body: JSON.stringify(params),
        }
      )
      return mensagemFromRow(msgRow)
    },

    simularRespostaIA: async (conversaId: string): Promise<Mensagem> => {
      // DESATIVADO — nao gera respostas mock. Mantido so pra nao quebrar callers antigos.
      // Retorna a ultima mensagem da conversa como no-op.
      const { data } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('enviada_em', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (data) return mensagemFromRow(data)
      throw new Error('simularRespostaIA desativado — nenhuma mensagem encontrada')
    },

    marcarComoLida: async (id: string): Promise<void> => {
      await supabase.from('conversas').update({ nao_lidas: 0 }).eq('id', id)
    },

    simularIncoming: async (
      conversaId: string,
      texto: string
    ): Promise<Mensagem> => {
      const row = await apiFetch<Parameters<typeof mensagemFromRow>[0]>(
        `/whatsapp/conversas/${conversaId}/simular-incoming`,
        {
          method: 'POST',
          body: JSON.stringify({ texto }),
        }
      )
      return mensagemFromRow(row)
    },

    vincularAgente: async (
      conversaId: string,
      agenteId: string | null
    ): Promise<Conversa> => {
      const row = await apiFetch<Parameters<typeof conversaFromRow>[0]>(
        `/whatsapp/conversas/${conversaId}/agente`,
        {
          method: 'PATCH',
          body: JSON.stringify({ agenteId }),
        }
      )
      return conversaFromRow(row)
    },

    alternarModo: async (id: string): Promise<Conversa> => {
      const { data: atual } = await supabase
        .from('conversas')
        .select('modo')
        .eq('id', id)
        .single()
      const novoModo = atual?.modo === 'IA' ? 'HUMANO' : 'IA'
      const { data, error } = await supabase
        .from('conversas')
        .update({ modo: novoModo })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return conversaFromRow(data)
    },
  },

  agentes: {
    listar: async (): Promise<Agente[]> => {
      const userId = await getUserId()
      const { data, error } = await supabase
        .from('agentes')
        .select('*, agentes_bases(base_id)')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false })
      if (error) throw error
      return (data ?? []).map((row) => {
        const { agentes_bases: bases, ...agenteRow } = row as typeof row & {
          agentes_bases: { base_id: string }[]
        }
        return agenteFromRow(agenteRow, bases?.map((b: { base_id: string }) => b.base_id) ?? [])
      })
    },

    obter: async (id: string): Promise<Agente | null> => {
      const { data, error } = await supabase
        .from('agentes')
        .select('*, agentes_bases(base_id)')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      const { agentes_bases: bases, ...agenteRow } = data as typeof data & {
        agentes_bases: { base_id: string }[]
      }
      return agenteFromRow(agenteRow, bases?.map((b: { base_id: string }) => b.base_id) ?? [])
    },

    criar: async (dados: {
      nome: string
      objetivo: ObjetivoAgente
      descricao: string
      config: ConfigAgente
      basesConhecimentoIds: string[]
    }): Promise<Agente> => {
      const userId = await getUserId()
      const avatarCor =
        CORES_AVATAR_AGENTE[Math.floor(Math.random() * CORES_AVATAR_AGENTE.length)]

      const { data: agenteRow, error } = await supabase
        .from('agentes')
        .insert({
          user_id: userId,
          nome: dados.nome,
          objetivo: dados.objetivo,
          descricao: dados.descricao,
          avatar_cor: avatarCor,
          status: 'ATIVO',
          config: dados.config,
        })
        .select()
        .single()
      if (error) throw error

      if (dados.basesConhecimentoIds.length > 0) {
        const rows = dados.basesConhecimentoIds.map((base_id) => ({
          agente_id: agenteRow.id,
          base_id,
        }))
        const { error: junctionError } = await supabase.from('agentes_bases').insert(rows)
        if (junctionError) throw junctionError
      }

      return agenteFromRow(agenteRow, dados.basesConhecimentoIds)
    },

    atualizar: async (id: string, dados: Partial<Agente>): Promise<Agente> => {
      const update: Record<string, unknown> = {}
      if (dados.nome !== undefined) update.nome = dados.nome
      if (dados.objetivo !== undefined) update.objetivo = dados.objetivo
      if (dados.descricao !== undefined) update.descricao = dados.descricao
      if (dados.avatarCor !== undefined) update.avatar_cor = dados.avatarCor
      if (dados.status !== undefined) update.status = dados.status
      if (dados.config !== undefined) update.config = dados.config

      if (Object.keys(update).length > 0) {
        const { error } = await supabase.from('agentes').update(update).eq('id', id)
        if (error) throw error
      }

      // Atualizar bases vinculadas (replace strategy)
      if (dados.basesConhecimentoIds !== undefined) {
        await supabase.from('agentes_bases').delete().eq('agente_id', id)
        if (dados.basesConhecimentoIds.length > 0) {
          const rows = dados.basesConhecimentoIds.map((base_id) => ({
            agente_id: id,
            base_id,
          }))
          const { error: insertError } = await supabase.from('agentes_bases').insert(rows)
          if (insertError) throw insertError
        }
      }

      // Re-fetch para retornar estado consistente
      const { data, error: fetchError } = await supabase
        .from('agentes')
        .select('*, agentes_bases(base_id)')
        .eq('id', id)
        .single()
      if (fetchError) throw fetchError
      const { agentes_bases: bases, ...agenteRow } = data as typeof data & {
        agentes_bases: { base_id: string }[]
      }
      return agenteFromRow(agenteRow, bases?.map((b: { base_id: string }) => b.base_id) ?? [])
    },

    alternarStatus: async (id: string): Promise<Agente> => {
      const { data: atual } = await supabase
        .from('agentes')
        .select('status')
        .eq('id', id)
        .single()
      const novoStatus = atual?.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'
      const { data, error } = await supabase
        .from('agentes')
        .update({ status: novoStatus })
        .eq('id', id)
        .select('*, agentes_bases(base_id)')
        .single()
      if (error) throw error
      const { agentes_bases: bases, ...agenteRow } = data as typeof data & {
        agentes_bases: { base_id: string }[]
      }
      return agenteFromRow(agenteRow, bases?.map((b: { base_id: string }) => b.base_id) ?? [])
    },

    excluir: async (id: string): Promise<void> => {
      const { error } = await supabase.from('agentes').delete().eq('id', id)
      if (error) throw error
    },
  },

  automacoes: {
    listar: async (): Promise<Automacao[]> => {
      const data = await apiFetch<Array<Record<string, unknown>>>(
        '/whatsapp/automacoes'
      )
      return data.map((row) => ({
        id: row.id as string,
        nome: row.nome as string,
        ativo: row.ativo as boolean,
        evento: row.evento as EventoAutomacao,
        provedor: row.provedor as ProvedorCheckout | null,
        produtoId: row.produto_id as string | null,
        agenteId: row.agente_id as string | null,
        mensagemInicial: row.mensagem_inicial as string | null,
        delayMinutos: (row.delay_minutos as number) ?? 0,
        executarSeExiste: (row.executar_se_existe as boolean) ?? false,
        criadoEm: row.criado_em as string,
        atualizadoEm: row.atualizado_em as string,
      }))
    },

    criar: async (dados: {
      nome: string
      evento: EventoAutomacao
      provedor?: ProvedorCheckout | null
      produtoId?: string | null
      agenteId?: string | null
      mensagemInicial?: string | null
      delayMinutos?: number
      executarSeExiste?: boolean
      ativo?: boolean
    }): Promise<void> => {
      await apiFetch('/whatsapp/automacoes', {
        method: 'POST',
        body: JSON.stringify(dados),
      })
    },

    atualizar: async (
      id: string,
      dados: Partial<{
        nome: string
        evento: EventoAutomacao
        provedor: ProvedorCheckout | null
        produtoId: string | null
        agenteId: string | null
        mensagemInicial: string | null
        delayMinutos: number
        executarSeExiste: boolean
        ativo: boolean
      }>
    ): Promise<void> => {
      await apiFetch(`/whatsapp/automacoes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dados),
      })
    },

    deletar: async (id: string): Promise<void> => {
      await apiFetch(`/whatsapp/automacoes/${id}`, { method: 'DELETE' })
    },
  },

  perfil: {
    atualizar: async (dados: { nome?: string }): Promise<void> => {
      await apiFetch('/whatsapp/perfil', {
        method: 'PATCH',
        body: JSON.stringify(dados),
      })
    },

    uploadFoto: async (base64: string, mimetype: string): Promise<string> => {
      const data = await apiFetch<{ fotoUrl: string }>(
        '/whatsapp/perfil/upload-foto',
        {
          method: 'POST',
          body: JSON.stringify({ base64, mimetype }),
        }
      )
      return data.fotoUrl
    },

    toggleAgentes: async (desligar: boolean): Promise<void> => {
      await apiFetch('/whatsapp/toggle-agentes', {
        method: 'POST',
        body: JSON.stringify({ desligar }),
      })
    },
  },
}
