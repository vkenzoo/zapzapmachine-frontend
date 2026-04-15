'use client'

import { useEffect, useState, useCallback } from 'react'
import { api } from '@/services/api'
import { PROVEDORES_LISTA } from '@/lib/constants'
import type { IntegracaoCheckout } from '@/types'
import { PageHeader } from '@/components/common/page-header'
import { CheckoutProviderCard } from '@/components/integracoes/checkout-provider-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function CheckoutPage() {
  const [integracoes, setIntegracoes] = useState<IntegracaoCheckout[]>([])
  const [loading, setLoading] = useState(true)

  const carregarIntegracoes = useCallback(async () => {
    const data = await api.integracoes.listarCheckouts()
    setIntegracoes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    carregarIntegracoes()
  }, [carregarIntegracoes])

  return (
    <>
      <PageHeader
        titulo="Checkout"
        descricao="Integre seus provedores de checkout para receber transações automaticamente"
        breadcrumb={[
          { label: 'Integrações', href: '/integracoes/checkout' },
          { label: 'Checkout' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-8 w-20 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : PROVEDORES_LISTA.map((provedor) => {
              const integracao = integracoes.find(
                (i) => i.provedor === provedor.id
              )
              return (
                <CheckoutProviderCard
                  key={provedor.id}
                  provedor={provedor}
                  integracao={integracao}
                  onIntegracaoCriada={carregarIntegracoes}
                />
              )
            })}
      </div>
    </>
  )
}
