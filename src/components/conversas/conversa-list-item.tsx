'use client'

import type { Conversa } from '@/types'
import { cn } from '@/lib/utils'

interface ConversaListItemProps {
  conversa: Conversa
  ativa: boolean
  onClick: () => void
}

const formatHora = (iso: string) => {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export const ConversaListItem = ({ conversa, ativa, onClick }: ConversaListItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left',
        ativa ? 'bg-primary/[0.06]' : 'hover:bg-muted/50'
      )}
    >
      {conversa.fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={conversa.fotoUrl}
          alt={conversa.nomeContato}
          className="h-11 w-11 rounded-full shrink-0 object-cover shadow-sm"
          onError={(e) => {
            // Se a URL expirar, cai pro fallback de inicial
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <div
          className="h-11 w-11 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-[14px] shadow-sm"
          style={{
            background: `linear-gradient(to bottom, ${conversa.avatarCor}, ${conversa.avatarCor}dd)`,
          }}
        >
          {conversa.nomeContato.charAt(0)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn(
            'text-[14px] tracking-[-0.01em] truncate',
            conversa.naoLidas > 0 ? 'font-semibold' : 'font-medium'
          )}>
            {conversa.nomeContato}
          </span>
          <span className={cn(
            'text-[11px] shrink-0',
            conversa.naoLidas > 0 ? 'text-primary font-medium' : 'text-muted-foreground'
          )}>
            {formatHora(conversa.ultimaMensagemEm)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            'text-[12px] line-clamp-1',
            conversa.naoLidas > 0 ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {conversa.ultimaMensagem}
          </p>
          {conversa.naoLidas > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-medium flex items-center justify-center shrink-0">
              {conversa.naoLidas}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
