'use client'

import type { BaseConhecimento } from '@/types'
import { calcularCompletudeBase } from '@/lib/base-conhecimento-utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Database } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BasesMultiSelectProps {
  bases: BaseConhecimento[]
  selecionadas: string[]
  onChange: (ids: string[]) => void
}

export const BasesMultiSelect = ({ bases, selecionadas, onChange }: BasesMultiSelectProps) => {
  const toggle = (id: string) => {
    if (selecionadas.includes(id)) {
      onChange(selecionadas.filter((i) => i !== id))
    } else {
      onChange([...selecionadas, id])
    }
  }

  if (bases.length === 0) {
    return (
      <div className="text-center py-10 rounded-xl bg-muted/30 border border-dashed border-border">
        <Database className="h-6 w-6 text-muted-foreground/60 mx-auto mb-2" strokeWidth={1.5} />
        <p className="text-[13px] text-muted-foreground">
          Nenhuma base de conhecimento criada ainda
        </p>
        <p className="text-[12px] text-muted-foreground mt-1">
          Crie uma base em Base de Conhecimento para vincular ao agente
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {bases.map((base) => {
        const selecionada = selecionadas.includes(base.id)
        const completude = calcularCompletudeBase(base)
        return (
          <button
            key={base.id}
            type="button"
            onClick={() => toggle(base.id)}
            className={cn(
              'w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left',
              selecionada
                ? 'border-primary bg-primary/[0.04]'
                : 'border-border/60 bg-card hover:border-primary/40'
            )}
          >
            <Checkbox checked={selecionada} className="pointer-events-none" />
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <Database className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium truncate">{base.nome}</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-[11px] font-medium rounded-md px-1.5 py-0 h-5 shrink-0',
                    completude === 100
                      ? 'bg-emerald-500/10 text-emerald-700'
                      : 'bg-amber-500/10 text-amber-700'
                  )}
                >
                  {completude}%
                </Badge>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
