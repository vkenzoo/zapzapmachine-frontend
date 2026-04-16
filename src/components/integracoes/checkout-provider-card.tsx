'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { ProvedorInfo, IntegracaoCheckout } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ProvedorLogo } from './provedor-logo'
import { GuiaHotmart } from './guia-hotmart'
import { GuiaKiwify } from './guia-kiwify'
import { GuiaTicto } from './guia-ticto'
import { ValidadorWebhook } from './validador-webhook'

interface CheckoutProviderCardProps {
  provedor: ProvedorInfo
  integracao?: IntegracaoCheckout
  onIntegracaoCriada: () => void
}

const renderGuia = (
  provedorId: 'HOTMART' | 'KIWIFY' | 'TICTO',
  webhookUrl: string
) => {
  if (provedorId === 'HOTMART') return <GuiaHotmart webhookUrl={webhookUrl} />
  if (provedorId === 'KIWIFY') return <GuiaKiwify webhookUrl={webhookUrl} />
  return <GuiaTicto webhookUrl={webhookUrl} />
}

export const CheckoutProviderCard = ({
  provedor,
  integracao,
  onIntegracaoCriada,
}: CheckoutProviderCardProps) => {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [novaIntegracao, setNovaIntegracao] =
    useState<IntegracaoCheckout | null>(null)

  const isActive = !!integracao

  const handleComecar = async () => {
    setDialogOpen(true)
    setLoading(true)
    try {
      const result = await api.integracoes.criarCheckout(provedor.id)
      setNovaIntegracao(result)
    } catch {
      toast.error('Erro ao criar integração')
      setDialogOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleConcluir = () => {
    setDialogOpen(false)
    setNovaIntegracao(null)
    onIntegracaoCriada()
    toast.success('Integração configurada!')
  }

  return (
    <>
      <div className="group rounded-2xl bg-card apple-shadow hover:apple-shadow-hover transition-all duration-300 p-5">
        <div className="flex items-start gap-3.5">
          <ProvedorLogo provedor={provedor.id} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-medium text-[14px] tracking-[-0.01em]">
                {provedor.nome}
              </h3>
              {isActive && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium rounded-md px-1.5 py-0 h-5"
                >
                  Ativo
                </Badge>
              )}
            </div>
            <p className="text-[12px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {provedor.descricao}
            </p>
            {isActive ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-[12px] font-medium"
                onClick={() =>
                  router.push(
                    `/integracoes/checkout/${provedor.id.toLowerCase()}`
                  )
                }
              >
                Gerenciar
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-8 rounded-lg text-[12px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15"
                onClick={handleComecar}
              >
                Começar
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[17px] tracking-[-0.01em]">
              Conectar {provedor.nome}
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              Siga os passos abaixo para configurar o webhook no painel do{' '}
              {provedor.nome}.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : novaIntegracao ? (
            <div className="space-y-5">
              {renderGuia(provedor.id, novaIntegracao.webhookUrl)}

              <ValidadorWebhook integracaoId={novaIntegracao.id} />

              <Button
                onClick={handleConcluir}
                className="w-full h-11 rounded-xl text-[14px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Concluído
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
