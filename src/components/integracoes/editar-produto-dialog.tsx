'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { ProdutoCheckout } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, Zap } from 'lucide-react'

interface EditarProdutoDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  produto: ProdutoCheckout | null
  onSaved: () => void
}

export const EditarProdutoDialog = ({
  open,
  onOpenChange,
  produto,
  onSaved,
}: EditarProdutoDialogProps) => {
  const [saving, setSaving] = useState(false)
  const [nome, setNome] = useState('')

  useEffect(() => {
    if (produto) setNome(produto.nomeProduto)
  }, [produto])

  const handleSalvar = async () => {
    if (!produto) return
    setSaving(true)
    try {
      await api.integracoes.atualizarProduto(produto.id, {
        nomeProduto: nome.trim(),
      })
      toast.success('Produto atualizado')
      onSaved()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  if (!produto) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-[17px] tracking-[-0.01em]">
            Configurar produto
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            ID externo: <code className="text-[11px]">{produto.idExternoProduto}</code>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[13px]">Nome do produto</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-xl text-[13px]"
            />
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-[13px] font-medium">
                  Configure agente e mensagens em Automações
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  A partir de agora, quem atende esse produto e o que é enviado ao cliente é definido pelas automações. Você pode criar múltiplas automações para o mesmo produto (ex: boas-vindas imediata + follow-up 24h depois).
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-lg text-[12px] h-7"
              >
                <Link href="/automacoes">Abrir Automações</Link>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={saving || !nome.trim()}
            className="rounded-xl bg-gradient-to-b from-blue-500 to-blue-600"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
