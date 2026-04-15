'use client'

import { useRouter } from 'next/navigation'
import type { BaseConhecimento } from '@/types'
import { calcularCompletudeBase } from '@/lib/base-conhecimento-utils'
import { ProgressoSecoes } from './progresso-secoes'
import { Badge } from '@/components/ui/badge'
import { Database, ChevronRight } from 'lucide-react'

interface BaseCardProps {
  base: BaseConhecimento
}

export const BaseCard = ({ base }: BaseCardProps) => {
  const router = useRouter()
  const completude = calcularCompletudeBase(base)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  return (
    <button
      onClick={() => router.push(`/base-conhecimento/${base.id}`)}
      className="w-full text-left rounded-2xl bg-card apple-shadow hover:apple-shadow-hover transition-all duration-300 p-5 group"
    >
      <div className="flex items-start gap-3.5 mb-4">
        <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
          <Database className="h-5 w-5 text-violet-600" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-medium text-[14px] tracking-[-0.01em] truncate">
              {base.nome}
            </h3>
            <Badge
              variant="secondary"
              className={`text-[11px] font-medium rounded-md px-1.5 py-0 h-5 shrink-0 ${
                completude === 100
                  ? 'bg-emerald-500/10 text-emerald-700'
                  : 'bg-amber-500/10 text-amber-700'
              }`}
            >
              {completude}%
            </Badge>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Criado em {formatDate(base.criadoEm)}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-1" />
      </div>
      <ProgressoSecoes base={base} compact />
    </button>
  )
}
