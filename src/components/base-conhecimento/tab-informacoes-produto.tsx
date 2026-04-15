'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { InformacoesProduto } from '@/types'
import { TIPOS_PRODUTO } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface TabInformacoesProdutoProps {
  dados: InformacoesProduto
  onSave: (dados: InformacoesProduto) => Promise<void>
}

export const TabInformacoesProduto = ({ dados, onSave }: TabInformacoesProdutoProps) => {
  const [form, setForm] = useState<InformacoesProduto>(dados)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof InformacoesProduto, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
      toast.success('Informações do produto salvas!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">Nome do produto</Label>
          <Input
            value={form.nomeProduto}
            onChange={(e) => update('nomeProduto', e.target.value)}
            placeholder="Ex: Curso de Tráfego Pago"
            className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">Tipo</Label>
          <select
            value={form.tipo}
            onChange={(e) => update('tipo', e.target.value)}
            className="w-full h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background px-3 outline-none"
          >
            <option value="">Selecione...</option>
            {TIPOS_PRODUTO.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Descrição curta</Label>
        <Textarea
          value={form.descricaoCurta}
          onChange={(e) => update('descricaoCurta', e.target.value)}
          placeholder="Descreva seu produto em poucas linhas..."
          className="min-h-[100px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">Preço (R$)</Label>
          <Input
            type="number"
            value={form.preco ? (form.preco / 100).toString() : ''}
            onChange={(e) => update('preco', e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null)}
            placeholder="997,00"
            className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">Garantia</Label>
          <Input
            value={form.garantia}
            onChange={(e) => update('garantia', e.target.value)}
            placeholder="Ex: 7 dias"
            className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">URL de venda</Label>
          <Input
            value={form.urlVenda}
            onChange={(e) => update('urlVenda', e.target.value)}
            placeholder="https://..."
            className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 rounded-xl text-[13px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15 px-6"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Salvar
        </Button>
      </div>
    </div>
  )
}
