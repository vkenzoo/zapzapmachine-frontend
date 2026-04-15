'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { Conversa, Mensagem } from '@/types'
import { ConversaList } from '@/components/conversas/conversa-list'
import { ChatView } from '@/components/conversas/chat-view'
import { EmptyChat } from '@/components/conversas/empty-chat'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useRealtimeConversas } from '@/hooks/use-realtime-conversas'
import { useRealtimeMensagens } from '@/hooks/use-realtime-mensagens'

export default function ConversasPage() {
  const { usuario } = useAuth()
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [conversaSelecionadaId, setConversaSelecionadaId] = useState<string | null>(null)
  const [loadingConversas, setLoadingConversas] = useState(true)
  const [loadingMensagens, setLoadingMensagens] = useState(false)

  const carregarConversas = useCallback(async () => {
    const data = await api.conversas.listar()
    setConversas(data)
    setLoadingConversas(false)
  }, [])

  useEffect(() => {
    carregarConversas()
  }, [carregarConversas])

  const conversaSelecionada = conversas.find((c) => c.id === conversaSelecionadaId) ?? null

  const handleSelecionar = useCallback(async (id: string) => {
    setConversaSelecionadaId(id)
    setLoadingMensagens(true)
    const [msgs] = await Promise.all([
      api.conversas.listarMensagens(id),
      api.conversas.marcarComoLida(id),
    ])
    setMensagens(msgs)
    setLoadingMensagens(false)
    // Atualiza lista (zera nao lidas)
    const updatedList = await api.conversas.listar()
    setConversas(updatedList)
  }, [])

  const handleEnviar = useCallback(async (conteudo: string) => {
    if (!conversaSelecionadaId) return
    const nova = await api.conversas.enviarMensagem(conversaSelecionadaId, conteudo, 'OUTGOING_HUMANO')
    setMensagens((prev) => [...prev, nova])

    // Atualiza lista para reordenar
    const updatedList = await api.conversas.listar()
    setConversas(updatedList)
  }, [conversaSelecionadaId])

  const handleEnviarMidia = useCallback(
    async (params: {
      tipoMidia: 'IMAGEM' | 'AUDIO' | 'VIDEO' | 'DOCUMENTO'
      base64: string
      mimetype: string
      fileName?: string
      legenda?: string
    }) => {
      if (!conversaSelecionadaId) return
      const nova = await api.conversas.enviarMidia(conversaSelecionadaId, params)
      setMensagens((prev) => [...prev, nova])
      const updatedList = await api.conversas.listar()
      setConversas(updatedList)
    },
    [conversaSelecionadaId]
  )

  const handleAlternarModo = useCallback(async () => {
    if (!conversaSelecionadaId) return
    await api.conversas.alternarModo(conversaSelecionadaId)
    const updatedList = await api.conversas.listar()
    setConversas(updatedList)
    const conversa = updatedList.find((c) => c.id === conversaSelecionadaId)
    if (conversa) {
      toast.success(
        conversa.modo === 'IA' ? 'Agente IA assumiu a conversa' : 'Você assumiu a conversa'
      )
    }
  }, [conversaSelecionadaId])

  const handleVincularAgente = useCallback(
    async (agenteId: string | null) => {
      if (!conversaSelecionadaId) return
      try {
        await api.conversas.vincularAgente(conversaSelecionadaId, agenteId)
        const updatedList = await api.conversas.listar()
        setConversas(updatedList)
        toast.success(agenteId ? 'Agente vinculado' : 'Agente removido')
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Erro ao vincular agente'
        )
      }
    },
    [conversaSelecionadaId]
  )

  const handleVoltar = useCallback(() => {
    setConversaSelecionadaId(null)
  }, [])

  // Realtime: lista de conversas atualiza automaticamente quando o backend
  // insere/atualiza (nova mensagem recebida, status muda, etc).
  useRealtimeConversas(usuario?.id, carregarConversas)

  // Realtime: mensagens da conversa aberta. Se a mensagem ja esta no state
  // (foi inserida por handleEnviar), ignoramos pra nao duplicar.
  useRealtimeMensagens(
    conversaSelecionadaId ?? undefined,
    useCallback((nova) => {
      setMensagens((prev) => {
        if (prev.some((m) => m.id === nova.id)) return prev
        return [...prev, nova]
      })
    }, [])
  )

  return (
    <div className="flex h-full">
      {/* Lista - esconde no mobile quando conversa selecionada */}
      <div
        className={cn(
          'w-full md:w-[340px] shrink-0',
          conversaSelecionadaId && 'hidden md:flex'
        )}
      >
        <ConversaList
          conversas={conversas}
          conversaSelecionadaId={conversaSelecionadaId}
          onSelecionar={handleSelecionar}
          loading={loadingConversas}
        />
      </div>

      {/* Chat - so aparece quando ha conversa selecionada no mobile */}
      <div
        className={cn(
          'flex-1 flex',
          !conversaSelecionadaId && 'hidden md:flex'
        )}
      >
        {conversaSelecionada ? (
          <ChatView
            conversa={conversaSelecionada}
            mensagens={mensagens}
            carregandoMensagens={loadingMensagens}
            onEnviar={handleEnviar}
            onEnviarMidia={handleEnviarMidia}
            onAlternarModo={handleAlternarModo}
            onVincularAgente={handleVincularAgente}
            onVoltar={handleVoltar}
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  )
}
