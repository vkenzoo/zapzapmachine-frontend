'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { InstanciaWhatsapp } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Smartphone, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WhatsappInstanceCardProps {
  instancia: InstanciaWhatsapp
  onUpdate: () => void
}

const statusConfig = {
  CONECTADO: {
    label: 'Conectado',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  DESCONECTADO: {
    label: 'Desconectado',
    badgeClass: 'bg-red-500/10 text-red-600',
    dot: 'bg-red-400',
  },
  CONECTANDO: {
    label: 'Conectando...',
    badgeClass: 'bg-amber-500/10 text-amber-700',
    dot: 'bg-amber-500 animate-pulse',
  },
  ERRO: {
    label: 'Erro',
    badgeClass: 'bg-red-500/10 text-red-600',
    dot: 'bg-red-500',
  },
}

export const WhatsappInstanceCard = ({
  instancia,
  onUpdate,
}: WhatsappInstanceCardProps) => {
  const [desconectando, setDesconectando] = useState(false)
  const config = statusConfig[instancia.status]

  const handleDesconectar = async () => {
    setDesconectando(true)
    try {
      await api.whatsapp.desconectar(instancia.id)
      toast.success('WhatsApp desconectado')
      onUpdate()
    } catch {
      toast.error('Erro ao desconectar')
    } finally {
      setDesconectando(false)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  return (
    <div className="rounded-2xl bg-card apple-shadow hover:apple-shadow-hover transition-all duration-300 p-5">
      <div className="flex items-start gap-3.5 mb-4">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <Smartphone className="h-5 w-5 text-emerald-600" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[14px] tracking-[-0.01em] truncate">
            {instancia.nomeInstancia}
          </h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {instancia.numeroConectado ?? 'Não conectado'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
          <Badge variant="secondary" className={cn('text-[11px] font-medium rounded-md px-1.5 py-0 h-5', config.badgeClass)}>
            {config.label}
          </Badge>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {formatDate(instancia.criadoEm)}
        </span>
      </div>

      {instancia.status === 'CONECTADO' ? (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 rounded-lg text-[12px] text-destructive hover:text-destructive"
                disabled={desconectando}
              />
            }
          >
            {desconectando ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : null}
            Desconectar
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[17px] tracking-[-0.01em]">
                Desconectar WhatsApp
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] leading-relaxed">
                Tem certeza que deseja desconectar{' '}
                <strong>{instancia.nomeInstancia}</strong>? Os agentes
                vinculados deixarão de funcionar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDesconectar}
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Desconectar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 rounded-lg text-[12px]"
          onClick={() => toast.info('Use o botão "Conectar novo número"')}
        >
          Ver QR Code
        </Button>
      )}
    </div>
  )
}
