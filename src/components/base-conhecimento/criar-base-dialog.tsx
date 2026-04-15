'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

interface CriarBaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCriada: () => void
}

export const CriarBaseDialog = ({
  open,
  onOpenChange,
  onCriada,
}: CriarBaseDialogProps) => {
  const [nome, setNome] = useState('')
  const [criando, setCriando] = useState(false)

  const handleCriar = async () => {
    if (nome.trim().length < 3) {
      toast.error('Nome deve ter pelo menos 3 caracteres')
      return
    }
    setCriando(true)
    try {
      await api.baseConhecimento.criar(nome.trim())
      toast.success('Base de conhecimento criada!')
      setNome('')
      onOpenChange(false)
      onCriada()
    } catch {
      toast.error('Erro ao criar base')
    } finally {
      setCriando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[17px] tracking-[-0.01em]">
            Nova Base de Conhecimento
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            Dê um nome para identificar esta base. Depois você preencherá as informações do produto.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">Nome</Label>
            <Input
              placeholder="Ex: Curso de Tráfego Pago"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
              onKeyDown={(e) => e.key === 'Enter' && handleCriar()}
            />
          </div>
          <Button
            onClick={handleCriar}
            disabled={criando}
            className="w-full h-11 rounded-xl text-[14px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15"
          >
            {criando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar base'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
