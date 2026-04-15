'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { LimitacoesConfig } from '@/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

interface TabLimitacoesProps {
  dados: LimitacoesConfig
  onSave: (dados: LimitacoesConfig) => Promise<void>
}

export const TabLimitacoes = ({ dados, onSave }: TabLimitacoesProps) => {
  const [form, setForm] = useState<LimitacoesConfig>(dados)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
      toast.success('Limitações salvas!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Tópicos proibidos</Label>
        <Textarea value={form.topicosProibidos} onChange={(e) => setForm((p) => ({ ...p, topicosProibidos: e.target.value }))} placeholder="Temas que o agente nunca deve abordar..." className="min-h-[100px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none" />
      </div>

      <div className="space-y-4 rounded-xl bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-[13px] font-medium">Nunca mencionar concorrentes</Label>
            <p className="text-[12px] text-muted-foreground">O agente não citará produtos concorrentes</p>
          </div>
          <Switch checked={form.nuncaMencionarConcorrentes} onCheckedChange={(v) => setForm((p) => ({ ...p, nuncaMencionarConcorrentes: v }))} />
        </div>
        <div className="h-px bg-border/50" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-[13px] font-medium">Não prometer resultados</Label>
            <p className="text-[12px] text-muted-foreground">Evita garantias de resultado específico</p>
          </div>
          <Switch checked={form.naoPrometerResultados} onCheckedChange={(v) => setForm((p) => ({ ...p, naoPrometerResultados: v }))} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Limite de desconto máximo (%)</Label>
        <Input type="number" value={form.limiteDescontoMaximo ?? ''} onChange={(e) => setForm((p) => ({ ...p, limiteDescontoMaximo: e.target.value ? parseInt(e.target.value) : null }))} placeholder="Ex: 10" className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background max-w-[200px]" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Quando transferir para humano</Label>
        <Textarea value={form.instrucoesTransferirHumano} onChange={(e) => setForm((p) => ({ ...p, instrucoesTransferirHumano: e.target.value }))} placeholder="Em quais situações o agente deve transferir o lead para um atendente humano?" className="min-h-[100px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none" />
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
