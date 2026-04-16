'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { ProdutoCheckout, Agente } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const NULL_AGENT = '__nenhum__'

const TEMPLATE_EXEMPLO = `Oi {nome}! 🎉

Sua compra do {produto} foi confirmada!

Me chamo [seu nome] e vou te acompanhar no acesso. Me conta: ja e sua primeira vez com esse tipo de produto?`

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
  const [agentes, setAgentes] = useState<Agente[]>([])
  const [loadingAgentes, setLoadingAgentes] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nome, setNome] = useState('')
  const [agenteId, setAgenteId] = useState<string>(NULL_AGENT)
  const [template, setTemplate] = useState('')

  useEffect(() => {
    if (!open) return
    setLoadingAgentes(true)
    api.agentes
      .listar()
      .then((list) => {
        setAgentes(list.filter((a) => a.status === 'ATIVO'))
        setLoadingAgentes(false)
      })
      .catch(() => setLoadingAgentes(false))
  }, [open])

  useEffect(() => {
    if (produto) {
      setNome(produto.nomeProduto)
      setAgenteId(produto.agenteVinculadoId ?? NULL_AGENT)
      setTemplate(produto.templatePrimeiraMensagem ?? '')
    }
  }, [produto])

  const handleSalvar = async () => {
    if (!produto) return
    setSaving(true)
    try {
      await api.integracoes.atualizarProduto(produto.id, {
        nomeProduto: nome.trim(),
        agenteVinculadoId: agenteId === NULL_AGENT ? null : agenteId,
        templatePrimeiraMensagem: template.trim() || null,
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

          <div className="space-y-1.5">
            <Label className="text-[13px]">Agente que vai atender</Label>
            <Select value={agenteId} onValueChange={(v) => { if (v !== null) setAgenteId(v) }}>
              <SelectTrigger className="rounded-xl text-[13px]">
                <SelectValue placeholder={loadingAgentes ? 'Carregando...' : 'Selecione'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NULL_AGENT}>
                  <span className="text-muted-foreground">Sem agente (atendimento humano)</span>
                </SelectItem>
                {agentes.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: a.avatarCor }}
                      />
                      {a.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Conversas criadas apos compra usam este agente em modo IA
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px]">Primeira mensagem apos a compra</Label>
            <Textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder={TEMPLATE_EXEMPLO}
              rows={6}
              className="rounded-xl text-[13px] font-mono"
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Placeholders disponiveis: <code>{'{nome}'}</code>, <code>{'{produto}'}</code>, <code>{'{email}'}</code>. Deixe em branco pra nao enviar msg automatica — a conversa ainda sera criada e a IA atende quando o cliente escrever.
            </p>
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
