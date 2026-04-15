'use client'

import type { BaseConhecimento } from '@/types'
import { isSecaoCompleta } from '@/lib/base-conhecimento-utils'
import { TABS_BASE_CONHECIMENTO } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ProgressoSecoesProps {
  base: BaseConhecimento
  compact?: boolean
}

export const ProgressoSecoes = ({ base, compact }: ProgressoSecoesProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {TABS_BASE_CONHECIMENTO.map((tab) => (
          <div
            key={tab.value}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              isSecaoCompleta(base, tab.value)
                ? 'bg-emerald-500'
                : 'bg-muted'
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {TABS_BASE_CONHECIMENTO.map((tab, i) => {
        const completa = isSecaoCompleta(base, tab.value)
        return (
          <div key={tab.value} className="flex items-center gap-2">
            <div
              className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all',
                completa
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {completa ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            {i < TABS_BASE_CONHECIMENTO.length - 1 && (
              <div className={cn('h-px w-4', completa ? 'bg-emerald-500' : 'bg-muted')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
