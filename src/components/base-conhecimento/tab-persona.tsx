'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { Persona } from '@/types'
import { NIVEIS_CONSCIENCIA } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface TabPersonaProps {
  dados: Persona
  onSave: (dados: Persona) => Promise<void>
}

export const TabPersona = ({ dados, onSave }: TabPersonaProps) => {
  const [form, setForm] = useState<Persona>(dados)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof Persona, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
      toast.success('Persona salva!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">Nome da persona</Label>
          <Input value={form.nomePersona} onChange={(e) => update('nomePersona', e.target.value)} placeholder="Ex: Carlos Empreendedor" className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">Idade / Faixa etária</Label>
          <Input value={form.idadeFaixa} onChange={(e) => update('idadeFaixa', e.target.value)} placeholder="Ex: 25-40 anos" className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">Profissão</Label>
          <Input value={form.profissao} onChange={(e) => update('profissao', e.target.value)} placeholder="Ex: Empreendedor digital" className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Principais dores</Label>
        <Textarea value={form.principaisDores} onChange={(e) => update('principaisDores', e.target.value)} placeholder="Quais problemas a persona enfrenta?" className="min-h-[100px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Desejos e objetivos</Label>
        <Textarea value={form.desejosObjetivos} onChange={(e) => update('desejosObjetivos', e.target.value)} placeholder="O que a persona quer alcançar?" className="min-h-[100px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Nível de consciência</Label>
        <select value={form.nivelConsciencia} onChange={(e) => update('nivelConsciencia', e.target.value)} className="w-full h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background px-3 outline-none">
          <option value="">Selecione...</option>
          {NIVEIS_CONSCIENCIA.map((n) => (
            <option key={n.value} value={n.value}>{n.label}</option>
          ))}
        </select>
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
