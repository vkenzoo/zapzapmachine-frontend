'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { Automacao } from '@/types'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Zap, Trash2, Pencil, Clock } from 'lucide-react'

const EVENTO_LABEL: Record<string, { label: string; cor: string }> = {
  COMPRA_APROVADA: { label: 'Compra aprovada', cor: 'bg-emerald-500/10 text-emerald-700' },
  COMPRA_RECUSADA: { label: 'Compra recusada', cor: 'bg-red-500/10 text-red-700' },
  REEMBOLSO: { label: 'Reembolso', cor: 'bg-orange-500/10 text-orange-700' },
  ASSINATURA_CANCELADA: { label: 'Assinatura cancelada', cor: 'bg-purple-500/10 text-purple-700' },
  CARRINHO_ABANDONADO: { label: 'Carrinho abandonado', cor: 'bg-yellow-500/10 text-yellow-700' },
}

const formatarDelay = (minutos: number): string => {
  if (minutos === 0) return 'Imediato'
  if (minutos < 60) return `${minutos}min`
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  if (resto === 0) return horas === 1 ? '1 hora' : `${horas} horas`
  return `${horas}h ${resto}min`
}

export default function AutomacoesPage() {
  const [automacoes, setAutomacoes] = useState<Automacao[]>([])
  const [loading, setLoading] = useState(true)

  const carregar = async () => {
    try {
      const data = await api.automacoes.listar()
      setAutomacoes(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    try {
      await api.automacoes.atualizar(id, { ativo })
      setAutomacoes((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ativo } : a))
      )
      toast.success(ativo ? 'Automação ativada' : 'Automação pausada')
    } catch {
      toast.error('Erro ao atualizar')
    }
  }

  const handleDeletar = async (id: string) => {
    try {
      await api.automacoes.deletar(id)
      setAutomacoes((prev) => prev.filter((a) => a.id !== id))
      toast.success('Automação removida')
    } catch {
      toast.error('Erro ao remover')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
              Automações
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Dispare ações automáticas quando eventos acontecerem
            </p>
          </div>
        </div>
        <Link
          href="/automacoes/criar"
          className={cn(buttonVariants(), 'rounded-xl')}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Nova automação
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : automacoes.length === 0 ? (
        <div className="rounded-2xl bg-card apple-shadow p-12 text-center">
          <div className="h-12 w-12 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-[15px] font-semibold mb-1">Nenhuma automação criada</h3>
          <p className="text-[13px] text-muted-foreground mb-5">
            Crie sua primeira automação para disparar mensagens automaticamente
            quando eventos acontecerem.
          </p>
          <Link
            href="/automacoes/criar"
            className={cn(buttonVariants(), 'rounded-xl')}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Criar primeira automação
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {automacoes.map((auto) => {
            const evento = EVENTO_LABEL[auto.evento] ?? {
              label: auto.evento,
              cor: 'bg-gray-500/10 text-gray-700',
            }
            return (
              <div
                key={auto.id}
                className="rounded-2xl bg-card apple-shadow p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="text-[14px] font-semibold tracking-[-0.01em] truncate">
                      {auto.nome}
                    </h3>
                    {!auto.ativo && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] rounded-md bg-gray-100 text-gray-600"
                      >
                        Pausada
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] rounded-md ${evento.cor}`}
                    >
                      {evento.label}
                    </Badge>
                    {auto.provedor && (
                      <Badge variant="secondary" className="text-[10px] rounded-md">
                        {auto.provedor}
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatarDelay(auto.delayMinutos)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={auto.ativo}
                    onCheckedChange={(v) => handleToggleAtivo(auto.id, v)}
                  />
                  <Link
                    href={`/automacoes/${auto.id}`}
                    aria-label={`Editar ${auto.nome}`}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'h-8 w-8 rounded-lg'
                    )}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label={`Remover ${auto.nome}`}
                        />
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[17px]">
                          Remover automação
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[13px]">
                          Tem certeza que deseja remover <strong>{auto.nome}</strong>?
                          Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletar(auto.id)}
                          className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
