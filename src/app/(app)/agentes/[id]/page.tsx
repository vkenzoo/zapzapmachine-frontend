'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { Agente } from '@/types'
import { TABS_AGENTE, OBJETIVOS_AGENTE } from '@/lib/constants'
import { PageHeader } from '@/components/common/page-header'
import { TabGeral } from '@/components/agentes/tab-geral'
import { TabConfiguracoes } from '@/components/agentes/tab-configuracoes'
import { TabBases } from '@/components/agentes/tab-bases'
import { TabTeste } from '@/components/agentes/tab-teste'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AgenteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [agente, setAgente] = useState<Agente | null>(null)
  const [loading, setLoading] = useState(true)
  const [alternando, setAlternando] = useState(false)

  const carregar = useCallback(async () => {
    const data = await api.agentes.obter(id)
    if (!data) {
      router.push('/agentes')
      return
    }
    setAgente(data)
    setLoading(false)
  }, [id, router])

  useEffect(() => {
    carregar()
  }, [carregar])

  const handleSave = async (dados: Partial<Agente>) => {
    await api.agentes.atualizar(id, dados)
    await carregar()
  }

  const handleAlternarStatus = async () => {
    setAlternando(true)
    try {
      await api.agentes.alternarStatus(id)
      await carregar()
      toast.success(
        agente?.status === 'ATIVO' ? 'Agente desativado' : 'Agente ativado'
      )
    } catch {
      toast.error('Erro ao alterar status')
    } finally {
      setAlternando(false)
    }
  }

  if (loading || !agente) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-48 rounded-full" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="rounded-2xl bg-card apple-shadow p-6 space-y-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  const objetivo = OBJETIVOS_AGENTE.find((o) => o.value === agente.objetivo)!
  const isAtivo = agente.status === 'ATIVO'

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/agentes')}
        className="mb-4 -ml-2 h-8 rounded-lg text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Voltar para agentes
      </Button>

      <PageHeader
        titulo={agente.nome}
        descricao={objetivo.label}
        breadcrumb={[
          { label: 'Agentes', href: '/agentes' },
          { label: agente.nome },
        ]}
        acao={
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className={cn(
                'text-[12px] font-medium rounded-lg px-2.5 py-1',
                isAtivo
                  ? 'bg-emerald-500/10 text-emerald-700'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {isAtivo ? 'Ativo' : 'Inativo'}
            </Badge>
            <div className="flex items-center gap-2 pl-3 border-l border-border/50">
              <span className="text-[13px] text-muted-foreground">
                {alternando ? (
                  <Loader2 className="h-3 w-3 animate-spin inline" />
                ) : isAtivo ? (
                  'Ativado'
                ) : (
                  'Desativado'
                )}
              </span>
              <Switch
                checked={isAtivo}
                onCheckedChange={handleAlternarStatus}
                disabled={alternando}
              />
            </div>
          </div>
        }
      />

      <div className="rounded-2xl bg-card apple-shadow overflow-hidden">
        <Tabs defaultValue="geral" className="w-full">
          <div className="border-b border-border/50 px-4 overflow-x-auto">
            <TabsList className="bg-transparent h-auto gap-0 p-0">
              {TABS_AGENTE.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-[13px] font-medium text-muted-foreground data-[state=active]:text-primary gap-1.5 shrink-0"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="geral" className="mt-0">
              <TabGeral agente={agente} onSave={handleSave} />
            </TabsContent>

            <TabsContent value="configuracoes" className="mt-0">
              <TabConfiguracoes
                config={agente.config}
                onSave={async (config) => handleSave({ config })}
              />
            </TabsContent>

            <TabsContent value="bases" className="mt-0">
              <TabBases
                basesIds={agente.basesConhecimentoIds}
                onSave={async (basesConhecimentoIds) => handleSave({ basesConhecimentoIds })}
              />
            </TabsContent>

            <TabsContent value="teste" className="mt-0">
              <TabTeste agente={agente} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  )
}
