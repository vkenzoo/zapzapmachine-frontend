'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { api } from '@/services/api'
import type { Agente } from '@/types'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { AgenteCard } from '@/components/agentes/agente-card'
import { CriarAgenteWizard } from '@/components/agentes/criar-agente-wizard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Bot } from 'lucide-react'

type FiltroAgente = 'todos' | 'ativos' | 'inativos'

export default function AgentesPage() {
  const [agentes, setAgentes] = useState<Agente[]>([])
  const [loading, setLoading] = useState(true)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [filtro, setFiltro] = useState<FiltroAgente>('todos')

  const carregar = useCallback(async () => {
    const data = await api.agentes.listar()
    setAgentes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const agentesFiltrados = useMemo(() => {
    if (filtro === 'ativos') return agentes.filter((a) => a.status === 'ATIVO')
    if (filtro === 'inativos') return agentes.filter((a) => a.status === 'INATIVO')
    return agentes
  }, [agentes, filtro])

  const countAtivos = agentes.filter((a) => a.status === 'ATIVO').length
  const countInativos = agentes.filter((a) => a.status === 'INATIVO').length

  return (
    <>
      <PageHeader
        titulo="Agentes"
        descricao="Crie, treine e gerencie seus agentes de IA"
        acao={
          <Button
            onClick={() => setWizardOpen(true)}
            className="h-9 rounded-xl text-[13px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Criar agente
          </Button>
        }
      />

      <Tabs value={filtro} onValueChange={(v) => setFiltro(v as FiltroAgente)} className="mb-6">
        <TabsList className="bg-muted/50 h-9 p-0.5">
          <TabsTrigger value="todos" className="text-[13px] h-8 px-4 rounded-lg data-[state=active]:bg-background">
            Todos {agentes.length > 0 && <span className="ml-1.5 text-muted-foreground">({agentes.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="ativos" className="text-[13px] h-8 px-4 rounded-lg data-[state=active]:bg-background">
            Ativos {countAtivos > 0 && <span className="ml-1.5 text-emerald-600">({countAtivos})</span>}
          </TabsTrigger>
          <TabsTrigger value="inativos" className="text-[13px] h-8 px-4 rounded-lg data-[state=active]:bg-background">
            Inativos {countInativos > 0 && <span className="ml-1.5 text-muted-foreground">({countInativos})</span>}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card apple-shadow p-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <Skeleton className="h-11 w-11 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-3 w-2/3 rounded-full" />
            </div>
          ))}
        </div>
      ) : agentesFiltrados.length === 0 ? (
        <EmptyState
          icone={Bot}
          titulo={filtro === 'todos' ? 'Nenhum agente criado' : `Nenhum agente ${filtro === 'ativos' ? 'ativo' : 'inativo'}`}
          descricao={
            filtro === 'todos'
              ? 'Crie seu primeiro agente de IA para começar a automatizar conversas'
              : `Você não tem agentes ${filtro === 'ativos' ? 'ativos' : 'inativos'} no momento`
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentesFiltrados.map((agente) => (
            <AgenteCard key={agente.id} agente={agente} onUpdate={carregar} />
          ))}
        </div>
      )}

      <CriarAgenteWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onCriado={carregar}
      />
    </>
  )
}
