'use client'

import { useEffect, useState } from 'react'
import {
  apiAdmin,
  type AdminGastos,
  type GastoPorUsuario,
} from '@/services/api-admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, TrendingUp, Users, Zap } from 'lucide-react'

const formatUSD = (v: number) => `$${v.toFixed(4)}`
const formatDate = (iso: string) => {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const TIPO_LABEL: Record<string, string> = {
  chat: 'Chat (LLM)',
  whisper: 'Transcrição (Whisper)',
  vision: 'Visão (Imagem)',
}

export default function GastosIAPage() {
  const [gastos, setGastos] = useState<AdminGastos | null>(null)
  const [porUsuario, setPorUsuario] = useState<GastoPorUsuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([apiAdmin.ia.gastos(), apiAdmin.ia.gastosPorUsuario()])
      .then(([g, u]) => {
        setGastos(g)
        setPorUsuario(u)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  const maxCustoDia = Math.max(0, ...(gastos?.porDia.map((d) => d.custoUSD) ?? []))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-yellow-700" />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Gastos com IA</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Últimos 30 dias — custo aproximado por modelo
          </p>
        </div>
      </div>

      {/* Totais */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-card apple-shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-muted-foreground font-medium">Custo 30d</span>
            <TrendingUp className="h-4 w-4 text-yellow-700" />
          </div>
          <div className="text-[24px] font-semibold tracking-[-0.02em]">
            {formatUSD(gastos?.custoTotalUSD ?? 0)}
          </div>
        </div>
        <div className="rounded-2xl bg-card apple-shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-muted-foreground font-medium">Chamadas</span>
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-[24px] font-semibold tracking-[-0.02em]">
            {gastos?.totalChamadas ?? 0}
          </div>
        </div>
        <div className="rounded-2xl bg-card apple-shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-muted-foreground font-medium">Usuários ativos</span>
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-[24px] font-semibold tracking-[-0.02em]">
            {porUsuario.length}
          </div>
        </div>
      </div>

      {/* Grafico simples de gasto por dia */}
      <div className="rounded-2xl bg-card apple-shadow p-5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] mb-4">
          Gasto por dia (30d)
        </h2>
        {(gastos?.porDia ?? []).length === 0 ? (
          <p className="text-[13px] text-muted-foreground text-center py-6">
            Sem dados ainda
          </p>
        ) : (
          <div className="space-y-1.5">
            {gastos?.porDia.map((d) => {
              const pct = maxCustoDia > 0 ? (d.custoUSD / maxCustoDia) * 100 : 0
              return (
                <div key={d.dia} className="flex items-center gap-3">
                  <div className="text-[11px] text-muted-foreground w-12 shrink-0 font-mono">
                    {formatDate(d.dia)}
                  </div>
                  <div className="flex-1 h-5 bg-muted/40 rounded-md overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono w-20 text-right shrink-0">
                    {formatUSD(d.custoUSD)}
                  </div>
                  <div className="text-[11px] text-muted-foreground w-14 text-right shrink-0">
                    {d.chamadas}×
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Por tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card apple-shadow p-5">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] mb-3">
            Por tipo de uso
          </h2>
          {(gastos?.porTipo ?? []).length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Sem dados</p>
          ) : (
            <div className="space-y-2">
              {gastos?.porTipo.map((t) => (
                <div key={t.tipo} className="flex items-center justify-between text-[13px]">
                  <span>{TIPO_LABEL[t.tipo] ?? t.tipo}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-[12px]">
                      {t.chamadas} chamadas
                    </span>
                    <span className="font-mono font-medium">{formatUSD(t.custoUSD)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-card apple-shadow p-5">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] mb-3">
            Por provider
          </h2>
          {(gastos?.porProvider ?? []).length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Sem dados</p>
          ) : (
            <div className="space-y-2">
              {gastos?.porProvider.map((p) => (
                <div key={p.provider} className="flex items-center justify-between text-[13px]">
                  <Badge variant="secondary" className="text-[11px] rounded-md uppercase">
                    {p.provider}
                  </Badge>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-[12px]">
                      {p.chamadas} chamadas
                    </span>
                    <span className="font-mono font-medium">{formatUSD(p.custoUSD)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Por usuario */}
      <div className="rounded-2xl bg-card apple-shadow overflow-hidden">
        <div className="p-5 pb-3">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
            Gastos por usuário
          </h2>
        </div>
        {porUsuario.length === 0 ? (
          <p className="text-[13px] text-muted-foreground text-center py-8">
            Sem dados ainda
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-[12px] font-medium">Usuário</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Chamadas</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Tokens</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Custo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {porUsuario.map((u) => (
                <TableRow key={u.userId} className="border-border/30">
                  <TableCell className="text-[13px] font-medium">{u.nome}</TableCell>
                  <TableCell className="text-[12px] text-right">{u.chamadas}</TableCell>
                  <TableCell className="text-[12px] text-right text-muted-foreground">
                    {u.tokens.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-[13px] text-right font-mono font-medium">
                    {formatUSD(u.custoUSD)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
