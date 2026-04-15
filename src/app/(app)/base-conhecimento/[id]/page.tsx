'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/services/api'
import type { BaseConhecimento, SecaoBaseConhecimento } from '@/types'
import { TABS_BASE_CONHECIMENTO } from '@/lib/constants'
import { calcularCompletudeBase } from '@/lib/base-conhecimento-utils'
import { PageHeader } from '@/components/common/page-header'
import { ProgressoSecoes } from '@/components/base-conhecimento/progresso-secoes'
import { TabInformacoesProduto } from '@/components/base-conhecimento/tab-informacoes-produto'
import { TabPersona } from '@/components/base-conhecimento/tab-persona'
import { TabFaqObjecoes } from '@/components/base-conhecimento/tab-faq-objecoes'
import { TabPersonalidadeAgente } from '@/components/base-conhecimento/tab-personalidade-agente'
import { TabLimitacoes } from '@/components/base-conhecimento/tab-limitacoes'
import { TabEntregaveis } from '@/components/base-conhecimento/tab-entregaveis'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BaseConhecimentoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [base, setBase] = useState<BaseConhecimento | null>(null)
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async () => {
    const data = await api.baseConhecimento.obter(id)
    if (!data) {
      router.push('/base-conhecimento')
      return
    }
    setBase(data)
    setLoading(false)
  }, [id, router])

  useEffect(() => {
    carregar()
  }, [carregar])

  const handleSaveSecao = async (secao: SecaoBaseConhecimento, dados: Partial<BaseConhecimento>) => {
    await api.baseConhecimento.atualizarSecao(id, secao, dados)
    await carregar()
  }

  if (loading || !base) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-48 rounded-full" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="rounded-2xl bg-card apple-shadow p-6 space-y-4">
          <Skeleton className="h-5 w-64 rounded-full" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  const completude = calcularCompletudeBase(base)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/base-conhecimento')}
        className="mb-4 -ml-2 h-8 rounded-lg text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Voltar para bases
      </Button>

      <PageHeader
        titulo={base.nome}
        breadcrumb={[
          { label: 'Base de Conhecimento', href: '/base-conhecimento' },
          { label: base.nome },
        ]}
        acao={
          <Badge
            variant="secondary"
            className={cn(
              'text-[12px] font-medium rounded-lg px-2.5 py-1',
              completude === 100
                ? 'bg-emerald-500/10 text-emerald-700'
                : 'bg-amber-500/10 text-amber-700'
            )}
          >
            {completude}% completo
          </Badge>
        }
      />

      <div className="mb-6">
        <ProgressoSecoes base={base} />
      </div>

      <div className="rounded-2xl bg-card apple-shadow overflow-hidden">
        <Tabs defaultValue="informacoes" className="w-full">
          <div className="border-b border-border/50 px-4 overflow-x-auto">
            <TabsList className="bg-transparent h-auto gap-0 p-0">
              {TABS_BASE_CONHECIMENTO.map((tab) => (
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
            <TabsContent value="informacoes" className="mt-0">
              <TabInformacoesProduto
                dados={base.informacoesProduto}
                onSave={async (d) => handleSaveSecao('informacoes', { informacoesProduto: d })}
              />
            </TabsContent>

            <TabsContent value="persona" className="mt-0">
              <TabPersona
                dados={base.persona}
                onSave={async (d) => handleSaveSecao('persona', { persona: d })}
              />
            </TabsContent>

            <TabsContent value="faq" className="mt-0">
              <TabFaqObjecoes
                dados={base.faqObjecoes}
                onSave={async (d) => handleSaveSecao('faq', { faqObjecoes: d })}
              />
            </TabsContent>

            <TabsContent value="personalidade" className="mt-0">
              <TabPersonalidadeAgente
                dados={base.personalidadeAgente}
                onSave={async (d) => handleSaveSecao('personalidade', { personalidadeAgente: d })}
              />
            </TabsContent>

            <TabsContent value="limitacoes" className="mt-0">
              <TabLimitacoes
                dados={base.limitacoes}
                onSave={async (d) => handleSaveSecao('limitacoes', { limitacoes: d })}
              />
            </TabsContent>

            <TabsContent value="entregaveis" className="mt-0">
              <TabEntregaveis
                dados={base.entregaveis}
                onSave={async (d) => handleSaveSecao('entregaveis', { entregaveis: d })}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  )
}
