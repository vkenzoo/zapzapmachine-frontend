'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ObjetivoCardProps {
  icone: LucideIcon
  label: string
  descricao: string
  cor: string
  selecionado: boolean
  onClick: () => void
}

export const ObjetivoCard = ({
  icone: Icon,
  label,
  descricao,
  cor,
  selecionado,
  onClick,
}: ObjetivoCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative text-left p-4 rounded-xl border transition-all duration-200',
        selecionado
          ? 'border-primary bg-primary/[0.04] ring-1 ring-primary'
          : 'border-border/60 bg-card hover:border-primary/40 hover:bg-muted/30'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(to bottom, ${cor}20, ${cor}10)`,
          }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: cor }} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] mb-0.5">{label}</h3>
          <p className="text-[12px] text-muted-foreground leading-relaxed">{descricao}</p>
        </div>
        {selecionado && (
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  )
}
