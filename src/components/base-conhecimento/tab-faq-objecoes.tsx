'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { FaqItem } from '@/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Trash2 } from 'lucide-react'

interface TabFaqObjecoesProps {
  dados: FaqItem[]
  onSave: (dados: FaqItem[]) => Promise<void>
}

export const TabFaqObjecoes = ({ dados, onSave }: TabFaqObjecoesProps) => {
  const [items, setItems] = useState<FaqItem[]>(dados)
  const [saving, setSaving] = useState(false)

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), pergunta: '', resposta: '' },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length <= 3) {
      toast.error('Mínimo de 3 perguntas')
      return
    }
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: 'pergunta' | 'resposta', value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(items)
      toast.success('FAQ salvo!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const filled = items.filter((i) => i.pergunta && i.resposta).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {filled} de 10+ recomendadas
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-8 rounded-lg text-[12px]"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl bg-muted/30 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-muted-foreground">
                Pergunta {index + 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(item.id)}
                aria-label="Remover pergunta"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium">Pergunta</Label>
              <Input
                value={item.pergunta}
                onChange={(e) => updateItem(item.id, 'pergunta', e.target.value)}
                placeholder="Ex: Funciona para iniciantes?"
                className="h-10 rounded-xl text-[14px] bg-background border-border/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium">Resposta</Label>
              <Textarea
                value={item.resposta}
                onChange={(e) => updateItem(item.id, 'resposta', e.target.value)}
                placeholder="Como o agente deve responder..."
                className="min-h-[80px] rounded-xl text-[14px] bg-background border-border/50 resize-none"
              />
            </div>
          </div>
        ))}
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
