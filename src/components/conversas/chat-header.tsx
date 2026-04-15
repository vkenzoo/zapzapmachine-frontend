'use client'

import type { Conversa } from '@/types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SeletorAgente } from './seletor-agente'

interface ChatHeaderProps {
  conversa: Conversa
  onAlternarModo: () => void
  onVincularAgente: (agenteId: string | null) => Promise<void>
  onVoltar?: () => void
}

export const ChatHeader = ({
  conversa,
  onAlternarModo,
  onVincularAgente,
  onVoltar,
}: ChatHeaderProps) => {
  const isIA = conversa.modo === 'IA'
  const temAgente = !!conversa.agenteId
  const toggleDesabilitado = !temAgente && !isIA // precisa de agente pra ativar IA

  return (
    <header className="h-16 border-b border-border/50 bg-card/80 frosted-glass flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {onVoltar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onVoltar}
            className="h-8 w-8 rounded-lg md:hidden shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {conversa.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={conversa.fotoUrl}
            alt={conversa.nomeContato}
            className="h-10 w-10 rounded-full shrink-0 object-cover shadow-sm"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-[13px] shadow-sm"
            style={{
              background: `linear-gradient(to bottom, ${conversa.avatarCor}, ${conversa.avatarCor}dd)`,
            }}
          >
            {conversa.nomeContato.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold tracking-[-0.01em] truncate">
            {conversa.nomeContato}
          </h2>
          <p className="text-[11px] text-muted-foreground truncate">
            {conversa.telefone}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <SeletorAgente
          agenteId={conversa.agenteId}
          onChange={onVincularAgente}
        />
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors',
            toggleDesabilitado
              ? 'bg-muted/50 opacity-60'
              : isIA
                ? 'bg-blue-500/10'
                : 'bg-emerald-500/10'
          )}
          title={toggleDesabilitado ? 'Selecione um agente primeiro' : undefined}
        >
          {isIA ? (
            <Bot className="h-3.5 w-3.5 text-blue-600" />
          ) : (
            <User className="h-3.5 w-3.5 text-emerald-600" />
          )}
          <Label
            htmlFor="modo-toggle"
            className={cn(
              'text-[12px] font-medium cursor-pointer',
              toggleDesabilitado
                ? 'text-muted-foreground'
                : isIA
                  ? 'text-blue-700'
                  : 'text-emerald-700'
            )}
          >
            {isIA ? 'Agente IA' : 'Humano'}
          </Label>
          <Switch
            id="modo-toggle"
            checked={!isIA}
            disabled={toggleDesabilitado}
            onCheckedChange={onAlternarModo}
            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-blue-500"
          />
        </div>
      </div>
    </header>
  )
}
