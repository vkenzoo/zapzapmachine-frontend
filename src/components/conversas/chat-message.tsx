'use client'

import type { Mensagem } from '@/types'
import { cn } from '@/lib/utils'
import { Check, CheckCheck, FileText, MapPin } from 'lucide-react'

interface ChatMessageProps {
  mensagem: Mensagem
}

const formatHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

interface MediaContentProps {
  mensagem: Mensagem
  isIncoming: boolean
}

const MediaContent = ({ mensagem, isIncoming }: MediaContentProps) => {
  const { tipoMidia, midiaUrl, conteudo } = mensagem

  // IMAGEM — mostra a imagem, com caption embaixo se tiver
  if (tipoMidia === 'IMAGEM' && midiaUrl) {
    const caption = conteudo.startsWith('📷 ') && conteudo !== '📷 Imagem'
      ? conteudo.slice(2).trim()
      : null
    return (
      <div className="space-y-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={midiaUrl}
          alt="Imagem"
          className="rounded-lg max-w-full max-h-[320px] object-cover cursor-pointer"
          onClick={() => window.open(midiaUrl, '_blank')}
        />
        {caption && (
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
            {caption}
          </p>
        )}
      </div>
    )
  }

  // AUDIO — player nativo
  if (tipoMidia === 'AUDIO' && midiaUrl) {
    return (
      <audio
        controls
        src={midiaUrl}
        className="max-w-[280px]"
        style={{ height: 40 }}
      >
        Seu navegador nao suporta audio.
      </audio>
    )
  }

  // VIDEO — player nativo
  if (tipoMidia === 'VIDEO' && midiaUrl) {
    const caption = conteudo.startsWith('🎥 ') && conteudo !== '🎥 Video'
      ? conteudo.slice(2).trim()
      : null
    return (
      <div className="space-y-1.5">
        <video
          controls
          src={midiaUrl}
          className="rounded-lg max-w-full max-h-[320px]"
        />
        {caption && (
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
            {caption}
          </p>
        )}
      </div>
    )
  }

  // DOCUMENTO — link com icone
  if (tipoMidia === 'DOCUMENTO' && midiaUrl) {
    const nome = conteudo.startsWith('📎 ') ? conteudo.slice(2).trim() : 'Documento'
    return (
      <a
        href={midiaUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg',
          isIncoming ? 'bg-muted/50 hover:bg-muted' : 'bg-white/10 hover:bg-white/20'
        )}
      >
        <FileText className="h-5 w-5 shrink-0" />
        <span className="text-[13px] underline-offset-2 hover:underline truncate">
          {nome}
        </span>
      </a>
    )
  }

  // LOCALIZACAO — icone + texto (sem link por enquanto)
  if (tipoMidia === 'LOCALIZACAO') {
    return (
      <div className="flex items-center gap-1.5">
        <MapPin className="h-4 w-4" />
        <span className="text-[14px]">Localizacao</span>
      </div>
    )
  }

  // Fallback: texto (ou midia sem URL = placeholder)
  return (
    <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
      {conteudo}
    </p>
  )
}

export const ChatMessage = ({ mensagem }: ChatMessageProps) => {
  const isIncoming = mensagem.tipo === 'INCOMING'
  const isIA = mensagem.tipo === 'OUTGOING_IA'
  const isHumano = mensagem.tipo === 'OUTGOING_HUMANO'

  return (
    <div className={cn('flex', isIncoming ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[75%] px-4 py-2.5 shadow-sm',
          isIncoming && 'bg-card text-foreground rounded-[18px] rounded-bl-[4px] border border-border/40',
          isIA && 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[18px] rounded-br-[4px]',
          isHumano && 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-[18px] rounded-br-[4px]'
        )}
      >
        {!isIncoming && (
          <div className="text-[10px] font-medium opacity-80 mb-0.5 tracking-wider">
            {isIA ? 'AGENTE IA' : 'VOCÊ'}
          </div>
        )}
        <MediaContent mensagem={mensagem} isIncoming={isIncoming} />
        <div
          className={cn(
            'flex items-center gap-1 mt-1 text-[10px]',
            isIncoming ? 'text-muted-foreground justify-start' : 'text-white/80 justify-end'
          )}
        >
          <span>{formatHora(mensagem.enviadaEm)}</span>
          {!isIncoming && (
            mensagem.status === 'LIDA' ? (
              <CheckCheck className="h-3 w-3" />
            ) : mensagem.status === 'ENTREGUE' ? (
              <CheckCheck className="h-3 w-3 opacity-60" />
            ) : (
              <Check className="h-3 w-3 opacity-60" />
            )
          )}
        </div>
      </div>
    </div>
  )
}

interface DateSeparatorProps {
  data: string
}

export const DateSeparator = ({ data }: DateSeparatorProps) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-3 py-1 bg-muted/80 backdrop-blur rounded-full">
        <span className="text-[11px] font-medium text-muted-foreground">{data}</span>
      </div>
    </div>
  )
}
