'use client'

import { useEffect, useRef, useState } from 'react'
import type { Conversa, Mensagem } from '@/types'
import { ChatHeader } from './chat-header'
import { ChatMessage, DateSeparator } from './chat-message'
import { ChatInput } from './chat-input'
import { Loader2, FlaskConical } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import { toast } from 'sonner'

interface EnviarMidiaParams {
  tipoMidia: 'IMAGEM' | 'AUDIO' | 'VIDEO' | 'DOCUMENTO'
  base64: string
  mimetype: string
  fileName?: string
  legenda?: string
}

interface ChatViewProps {
  conversa: Conversa
  mensagens: Mensagem[]
  carregandoMensagens: boolean
  onEnviar: (conteudo: string) => void
  onEnviarMidia?: (params: EnviarMidiaParams) => Promise<void>
  onAlternarModo: () => void
  onVincularAgente: (agenteId: string | null) => Promise<void>
  onVoltar?: () => void
}

const getGrupoData = (iso: string): string => {
  const date = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
      86400000
  )

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return date.toLocaleDateString('pt-BR', { weekday: 'long' })
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const ChatView = ({
  conversa,
  mensagens,
  carregandoMensagens,
  onEnviar,
  onEnviarMidia,
  onAlternarModo,
  onVincularAgente,
  onVoltar,
}: ChatViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [textoSimulacao, setTextoSimulacao] = useState('')
  const [simulando, setSimulando] = useState(false)

  // Conversa "de teste" eh identificada pelo nome comecar com 🧪
  const ehConversaTeste = conversa.nomeContato.startsWith('🧪')

  const handleSimular = async () => {
    if (!textoSimulacao.trim() || simulando) return
    setSimulando(true)
    try {
      await api.conversas.simularIncoming(conversa.id, textoSimulacao.trim())
      setTextoSimulacao('')
      toast.success('Msg simulada — IA vai responder em ~4s')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao simular')
    } finally {
      setSimulando(false)
    }
  }

  // Smart scroll: so auto-scroll se ja estava perto do fundo (< 150px)
  const wasAtBottomRef = useRef(true)

  // Rastreia posicao do scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      wasAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 150
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll quando mensagens mudam (so se estava no fundo)
  useEffect(() => {
    if (scrollRef.current && wasAtBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensagens])

  // Agrupar mensagens por data
  const renderMensagens = () => {
    const elements: React.ReactNode[] = []
    let grupoAtual = ''

    mensagens.forEach((msg) => {
      const grupo = getGrupoData(msg.enviadaEm)
      if (grupo !== grupoAtual) {
        elements.push(<DateSeparator key={`date-${msg.id}`} data={grupo} />)
        grupoAtual = grupo
      }
      elements.push(<ChatMessage key={msg.id} mensagem={msg} />)
    })

    return elements
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        conversa={conversa}
        onAlternarModo={onAlternarModo}
        onVincularAgente={onVincularAgente}
        onVoltar={onVoltar}
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5"
        style={{
          backgroundImage: 'radial-gradient(circle, oklch(0.92 0.004 264 / 40%) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {carregandoMensagens ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : mensagens.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[13px] text-muted-foreground">
              Nenhuma mensagem ainda. Comece a conversa!
            </p>
          </div>
        ) : (
          renderMensagens()
        )}
      </div>

      {ehConversaTeste && (
        <div className="border-t border-border/50 bg-purple-500/5 px-3 py-2 flex items-center gap-2 shrink-0">
          <FlaskConical className="h-4 w-4 text-purple-600 shrink-0" />
          <Input
            value={textoSimulacao}
            onChange={(e) => setTextoSimulacao(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSimular()
              }
            }}
            placeholder="Simular mensagem do cliente (testa IA sem WhatsApp)..."
            disabled={simulando}
            className="h-8 text-[13px] rounded-full bg-white/80 border-purple-200"
          />
          <Button
            size="sm"
            onClick={handleSimular}
            disabled={simulando || !textoSimulacao.trim()}
            className="h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {simulando ? 'Enviando...' : 'Simular'}
          </Button>
        </div>
      )}

      <ChatInput
        bloqueado={conversa.modo === 'IA'}
        onEnviar={onEnviar}
        onEnviarMidia={onEnviarMidia}
      />
    </div>
  )
}
