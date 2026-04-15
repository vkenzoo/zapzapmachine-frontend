'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { PersonalidadeAgente } from '@/types'
import { TONS_VOZ, IDIOMAS_AGENTE } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

interface TabPersonalidadeAgenteProps {
  dados: PersonalidadeAgente
  onSave: (dados: PersonalidadeAgente) => Promise<void>
}

export const TabPersonalidadeAgente = ({ dados, onSave }: TabPersonalidadeAgenteProps) => {
  const [form, setForm] = useState<PersonalidadeAgente>(dados)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof PersonalidadeAgente, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
      toast.success('Personalidade salva!')
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
          <Label className="text-[13px] font-medium">Nome do agente</Label>
          <Input value={form.nomeAgente} onChange={(e) => update('nomeAgente', e.target.value)} placeholder="Ex: Luna" className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px] font-medium">Tom de voz</Label>
          <select value={form.tomVoz} onChange={(e) => update('tomVoz', e.target.value)} className="w-full h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background px-3 outline-none">
            <option value="">Selecione...</option>
            {TONS_VOZ.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Idioma principal</Label>
        <select value={form.idiomaPrincipal} onChange={(e) => update('idiomaPrincipal', e.target.value)} className="w-full h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background px-3 outline-none">
          <option value="">Selecione...</option>
          {IDIOMAS_AGENTE.map((i) => (<option key={i.value} value={i.value}>{i.label}</option>))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Instruções especiais</Label>
        <Textarea value={form.instrucoesEspeciais} onChange={(e) => update('instrucoesEspeciais', e.target.value)} placeholder="Instruções livres de como o agente deve se comportar..." className="min-h-[120px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none" />
      </div>

      <div className="space-y-4 rounded-xl bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-[13px] font-medium">Usar emojis</Label>
            <p className="text-[12px] text-muted-foreground">O agente usará emojis nas mensagens</p>
          </div>
          <Switch checked={form.usarEmojis} onCheckedChange={(v) => update('usarEmojis', v)} />
        </div>
        <div className="h-px bg-border/50" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-[13px] font-medium">Usar áudios</Label>
            <p className="text-[12px] text-muted-foreground">O agente poderá enviar mensagens de áudio</p>
          </div>
          <Switch checked={form.usarAudios} onCheckedChange={(v) => update('usarAudios', v)} />
        </div>
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
