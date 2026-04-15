'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { Entregaveis } from '@/types'
import { TIPOS_ENTREGA } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface TabEntregaveisProps {
  dados: Entregaveis
  onSave: (dados: Entregaveis) => Promise<void>
}

export const TabEntregaveis = ({ dados, onSave }: TabEntregaveisProps) => {
  const [form, setForm] = useState<Entregaveis>(dados)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
      toast.success('Entregáveis salvos!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Tipo de entrega</Label>
        <select value={form.tipoEntrega} onChange={(e) => setForm((p) => ({ ...p, tipoEntrega: e.target.value as Entregaveis['tipoEntrega'] }))} className="w-full h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background px-3 outline-none">
          <option value="">Selecione...</option>
          {TIPOS_ENTREGA.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Instruções de acesso</Label>
        <Textarea value={form.instrucoesAcesso} onChange={(e) => setForm((p) => ({ ...p, instrucoesAcesso: e.target.value }))} placeholder="Como o cliente acessa o produto após a compra..." className="min-h-[100px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Link de acesso</Label>
        <Input value={form.linkAcesso} onChange={(e) => setForm((p) => ({ ...p, linkAcesso: e.target.value }))} placeholder="https://membros.exemplo.com" className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Suporte pós-venda</Label>
        <Textarea value={form.suportePosVenda} onChange={(e) => setForm((p) => ({ ...p, suportePosVenda: e.target.value }))} placeholder="Como funciona o suporte após a compra..." className="min-h-[100px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none" />
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} className="h-10 rounded-xl text-[13px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15 px-6">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Salvar
        </Button>
      </div>
    </div>
  )
}
