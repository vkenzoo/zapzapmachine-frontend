'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { InstanciaWhatsapp } from '@/types'
import { PageHeader } from '@/components/common/page-header'
import { WhatsappInstanceCard } from '@/components/integracoes/whatsapp-instance-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Loader2, CheckCircle2 } from 'lucide-react'

export default function WhatsappPage() {
  const [instancias, setInstancias] = useState<InstanciaWhatsapp[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nomeInstancia, setNomeInstancia] = useState('')
  const [step, setStep] = useState<'nome' | 'qrcode' | 'conectado'>('nome')
  const [criando, setCriando] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const carregarInstancias = useCallback(async () => {
    const data = await api.whatsapp.listarInstancias()
    setInstancias(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    carregarInstancias()
  }, [carregarInstancias])

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const handleCriarInstancia = async () => {
    if (nomeInstancia.trim().length < 3) {
      toast.error('Nome deve ter pelo menos 3 caracteres')
      return
    }

    setCriando(true)
    try {
      const instancia = await api.whatsapp.criarInstancia(nomeInstancia.trim())
      const qr = await api.whatsapp.obterQrCode(instancia.id)
      setQrCode(qr)
      setStep('qrcode')

      pollingRef.current = setInterval(async () => {
        const updated = await api.whatsapp.verificarConexao(instancia.id)
        if (updated.status === 'CONECTADO') {
          if (pollingRef.current) clearInterval(pollingRef.current)
          pollingRef.current = null
          setStep('conectado')
          toast.success('WhatsApp conectado com sucesso!')
          await carregarInstancias()
        }
      }, 2000)
    } catch {
      toast.error('Erro ao criar instância')
    } finally {
      setCriando(false)
    }
  }

  const handleCloseDialog = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    setDialogOpen(false)
    setNomeInstancia('')
    setStep('nome')
    setQrCode('')
    carregarInstancias()
  }

  return (
    <>
      <PageHeader
        titulo="WhatsApp"
        descricao="Gerencie suas conexões WhatsApp"
        breadcrumb={[
          { label: 'Integrações', href: '/integracoes/whatsapp' },
          { label: 'WhatsApp' },
        ]}
        acao={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Conectar novo número
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          : instancias.map((instancia) => (
              <WhatsappInstanceCard
                key={instancia.id}
                instancia={instancia}
                onUpdate={carregarInstancias}
              />
            ))}
      </div>

      {!loading && instancias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Nenhuma instância WhatsApp configurada
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Conectar primeiro número
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
            <DialogDescription>
              {step === 'nome' && 'Dê um nome para identificar essa conexão'}
              {step === 'qrcode' && 'Escaneie o QR Code com seu WhatsApp'}
              {step === 'conectado' && 'WhatsApp conectado com sucesso!'}
            </DialogDescription>
          </DialogHeader>

          {step === 'nome' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome-instancia">Nome da instância</Label>
                <Input
                  id="nome-instancia"
                  placeholder="Ex: WhatsApp Principal"
                  value={nomeInstancia}
                  onChange={(e) => setNomeInstancia(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCriarInstancia}
                className="w-full"
                disabled={criando}
              >
                {criando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando QR Code...
                  </>
                ) : (
                  'Gerar QR Code'
                )}
              </Button>
            </div>
          )}

          {step === 'qrcode' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 flex items-center justify-center mx-auto w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCode}
                  alt="QR Code WhatsApp"
                  className="w-48 h-48"
                />
              </div>

              <div className="flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Aguardando leitura do QR Code...
                </span>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Como conectar:</h4>
                <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                  <li>Abra o WhatsApp no seu celular</li>
                  <li>Toque em Mais opções ou Configurações</li>
                  <li>Toque em Dispositivos conectados</li>
                  <li>Escaneie o código acima</li>
                </ol>
              </div>
            </div>
          )}

          {step === 'conectado' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Seu WhatsApp foi conectado com sucesso e está pronto para
                receber mensagens.
              </p>
              <Button onClick={handleCloseDialog} className="w-full">
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
