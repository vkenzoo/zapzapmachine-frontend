'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/services/api'
import type { DashboardKPIs } from '@/types'
import { PageHeader } from '@/components/common/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Smartphone,
  Database,
  Bot,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const kpiConfig = [
  {
    key: 'leadsNoMes' as const,
    label: 'Leads no mês',
    icon: Users,
    variacaoKey: 'leadsVariacao' as const,
    gradient: 'from-blue-500/10 to-blue-600/5',
    iconColor: 'text-blue-600',
  },
  {
    key: 'conversasAtivas' as const,
    label: 'Conversas ativas',
    icon: MessageSquare,
    variacaoKey: 'conversasVariacao' as const,
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'taxaConversao' as const,
    label: 'Taxa de conversão',
    icon: TrendingUp,
    variacaoKey: 'conversaoVariacao' as const,
    gradient: 'from-violet-500/10 to-violet-600/5',
    iconColor: 'text-violet-600',
    suffix: '%',
  },
]

const proximosPassos = [
  {
    label: 'Integrar seu checkout',
    descricao: 'Conecte Kiwify, Hotmart ou outro provedor',
    href: '/integracoes/checkout',
    icon: CreditCard,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-500/10',
  },
  {
    label: 'Conectar seu WhatsApp',
    descricao: 'Escaneie o QR Code para vincular',
    href: '/integracoes/whatsapp',
    icon: Smartphone,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10',
  },
  {
    label: 'Criar Base de Conhecimento',
    descricao: 'Ensine o agente sobre seu produto',
    href: '/base-conhecimento',
    icon: Database,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-500/10',
  },
  {
    label: 'Ativar seu primeiro agente',
    descricao: 'Configure e publique um agente de vendas',
    href: '/agentes',
    icon: Bot,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/10',
  },
]

export default function DashboardPage() {
  const { usuario } = useAuth()
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.dashboard.obterKPIs().then((data) => {
      setKpis(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descricao={`Olá, ${usuario?.nome ?? 'Usuário'}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-card apple-shadow p-5">
                <Skeleton className="h-3 w-20 mb-4 rounded-full" />
                <Skeleton className="h-7 w-28 mb-2 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
            ))
          : kpiConfig.map((config) => {
              const valor = kpis?.[config.key] ?? 0
              const variacao = kpis?.[config.variacaoKey] ?? 0
              const isPositive = variacao >= 0

              const displayValue = config.suffix
                ? `${valor}${config.suffix}`
                : valor.toLocaleString('pt-BR')

              return (
                <div
                  key={config.key}
                  className="group rounded-2xl bg-card apple-shadow hover:apple-shadow-hover p-5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                      {config.label}
                    </span>
                    <div
                      className={cn(
                        'h-8 w-8 rounded-xl flex items-center justify-center bg-gradient-to-b',
                        config.gradient
                      )}
                    >
                      <config.icon
                        className={cn('h-4 w-4', config.iconColor)}
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>
                  <div className="text-[28px] font-semibold tracking-[-0.03em] leading-none mb-2">
                    {displayValue}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-0.5 text-[12px] font-medium px-1.5 py-0.5 rounded-md',
                        isPositive
                          ? 'text-emerald-700 bg-emerald-500/10'
                          : 'text-red-600 bg-red-500/10'
                      )}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(variacao)}%
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      vs. mês anterior
                    </span>
                  </div>
                </div>
              )
            })}
      </div>

      <div>
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] mb-4">
          Próximos passos
        </h2>
        <div className="space-y-2">
          {proximosPassos.map((passo) => (
            <Link
              key={passo.href}
              href={passo.href}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card apple-shadow hover:apple-shadow-hover transition-all duration-300 group"
            >
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', passo.iconBg)}>
                <passo.icon className={cn('h-5 w-5', passo.iconColor)} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-medium block">
                  {passo.label}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {passo.descricao}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
