'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { Agente, ObjetivoAgente } from '@/types'
import { OBJETIVOS_AGENTE, CORES_AVATAR_AGENTE } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ObjetivoCard } from './objetivo-card'
import { Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabGeralProps {
  agente: Agente
  onSave: (dados: Partial<Agente>) => Promise<void>
}

export const TabGeral = ({ agente, onSave }: TabGeralProps) => {
  const [form, setForm] = useState({
    nome: agente.nome,
    objetivo: agente.objetivo,
    descricao: agente.descricao,
    avatarCor: agente.avatarCor,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (form.nome.trim().length < 2) {
      toast.error('Nome muito curto')
      return
    }
    setSaving(true)
    try {
      await onSave({
        nome: form.nome.trim(),
        objetivo: form.objetivo,
        descricao: form.descricao.trim(),
        avatarCor: form.avatarCor,
      })
      toast.success('Informações salvas!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-5 border-b border-border/40">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-bold text-[24px] shadow-sm shrink-0"
          style={{
            background: `linear-gradient(to bottom, ${form.avatarCor}, ${form.avatarCor}dd)`,
          }}
        >
          {form.nome.charAt(0) || 'A'}
        </div>
        <div className="flex-1">
          <Label className="text-[13px] font-medium mb-2 block">Cor do avatar</Label>
          <div className="flex flex-wrap gap-2">
            {CORES_AVATAR_AGENTE.map((cor) => (
              <button
                key={cor}
                type="button"
                onClick={() => setForm((p) => ({ ...p, avatarCor: cor }))}
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center transition-all',
                  form.avatarCor === cor ? 'ring-2 ring-offset-2 ring-foreground' : ''
                )}
                style={{ backgroundColor: cor }}
                aria-label={`Cor ${cor}`}
              >
                {form.avatarCor === cor && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Nome do agente</Label>
        <Input
          value={form.nome}
          onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
          placeholder="Ex: Luna"
          className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[13px] font-medium">Objetivo</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {OBJETIVOS_AGENTE.map((o) => (
            <ObjetivoCard
              key={o.value}
              icone={o.icon}
              label={o.label}
              descricao={o.descricao}
              cor={o.cor}
              selecionado={form.objetivo === o.value}
              onClick={() => setForm((p) => ({ ...p, objetivo: o.value as ObjetivoAgente }))}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[13px] font-medium">Descrição</Label>
        <Textarea
          value={form.descricao}
          onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value.slice(0, 500) }))}
          placeholder="Descreva o propósito e abordagem do agente..."
          className="min-h-[120px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none"
        />
        <div className="flex justify-end">
          <span className="text-[11px] text-muted-foreground">{form.descricao.length}/500</span>
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
