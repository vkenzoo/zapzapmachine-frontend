'use client'

import { useEffect, useState } from 'react'
import { apiAdmin, type AdminStats } from '@/services/api-admin'
import {
  Users,
  MessageSquare,
  Bot,
  Database,
  Zap,
  DollarSign,
  Calendar,
  type LucideIcon,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface CardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: string
}

const Card = ({ label, value, icon: Icon, accent = 'blue' }: CardProps) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-emerald-500/10 text-emerald-600',
    orange: 'bg-orange-500/10 text-orange-600',
    purple: 'bg-purple-500/10 text-purple-600',
    pink: 'bg-pink-500/10 text-pink-600',
    yellow: 'bg-yellow-500/10 text-yellow-700',
  }
  return (
    <div className="rounded-2xl bg-card apple-shadow p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-muted-foreground font-medium">{label}</span>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${colorMap[accent] ?? colorMap.blue}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-[24px] font-semibold tracking-[-0.02em]">{value}</div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiAdmin
      .stats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  const formatUSD = (v: number) => `$${v.toFixed(2)}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Painel Admin</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Visão geral da plataforma
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : !stats ? (
        <div className="text-[13px] text-muted-foreground">Erro ao carregar estatísticas.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Card label="Usuários" value={stats.totalUsuarios} icon={Users} accent="blue" />
            <Card label="WhatsApps" value={stats.totalWhatsapps} icon={MessageSquare} accent="green" />
            <Card label="Agentes IA" value={stats.totalAgentes} icon={Bot} accent="purple" />
            <Card label="Bases" value={stats.totalBases} icon={Database} accent="pink" />
            <Card label="Automações" value={stats.totalAutomacoes} icon={Zap} accent="orange" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card
              label="Gasto IA (30d)"
              value={formatUSD(stats.gastoIa30dUSD)}
              icon={Calendar}
              accent="yellow"
            />
            <Card
              label="Gasto IA Total"
              value={formatUSD(stats.gastoIaTotalUSD)}
              icon={DollarSign}
              accent="yellow"
            />
          </div>
        </>
      )}
    </div>
  )
}
