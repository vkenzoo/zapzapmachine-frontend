'use client'

import { useEffect, useState, useCallback } from 'react'
import { api } from '@/services/api'
import type { BaseConhecimento } from '@/types'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { BaseCard } from '@/components/base-conhecimento/base-card'
import { CriarBaseDialog } from '@/components/base-conhecimento/criar-base-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Database } from 'lucide-react'

export default function BaseConhecimentoPage() {
  const [bases, setBases] = useState<BaseConhecimento[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const carregar = useCallback(async () => {
    const data = await api.baseConhecimento.listar()
    setBases(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  return (
    <>
      <PageHeader
        titulo="Base de Conhecimento"
        descricao="Crie bases de conhecimento para seus agentes de IA"
        acao={
          <Button
            onClick={() => setDialogOpen(true)}
            className="h-9 rounded-xl text-[13px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Criar nova base
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card apple-shadow p-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      ) : bases.length === 0 ? (
        <EmptyState
          icone={Database}
          titulo="Nenhuma base criada"
          descricao="Crie sua primeira base de conhecimento para ensinar o agente sobre seu produto"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bases.map((base) => (
            <BaseCard key={base.id} base={base} />
          ))}
        </div>
      )}

      <CriarBaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCriada={carregar}
      />
    </>
  )
}
