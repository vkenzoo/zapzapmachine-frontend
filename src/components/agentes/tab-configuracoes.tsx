'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { ConfigAgente } from '@/types'
import { Button } from '@/components/ui/button'
import { ConfigToggle } from './config-toggle'
import { Loader2, UserPlus, Sparkles, ShieldCheck, Split } from 'lucide-react'

interface TabConfiguracoesProps {
  config: ConfigAgente
  onSave: (config: ConfigAgente) => Promise<void>
}

export const TabConfiguracoes = ({ config, onSave }: TabConfiguracoesProps) => {
  const [form, setForm] = useState<ConfigAgente>(config)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
      toast.success('Configurações salvas!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <ConfigToggle
          id="cfg-humana"
          icone={UserPlus}
          label="Solicitar ajuda humana"
          descricao="Habilite para que o agente possa transferir o atendimento para equipe humana"
          checked={form.solicitarAjudaHumana}
          onChange={(v) => setForm((p) => ({ ...p, solicitarAjudaHumana: v }))}
        />
        <ConfigToggle
          id="cfg-emojis"
          icone={Sparkles}
          label="Usar emojis nas respostas"
          descricao="Define se o agente pode utilizar emojis em suas respostas"
          checked={form.usarEmojis}
          onChange={(v) => setForm((p) => ({ ...p, usarEmojis: v }))}
        />
        <ConfigToggle
          id="cfg-temas"
          icone={ShieldCheck}
          label="Restringir temas permitidos"
          descricao="Marque essa opção para que o agente não fale sobre outros assuntos fora da base"
          checked={form.restringirTemas}
          onChange={(v) => setForm((p) => ({ ...p, restringirTemas: v }))}
        />
        <ConfigToggle
          id="cfg-split"
          icone={Split}
          label="Dividir resposta em partes"
          descricao="Em caso da mensagem ficar grande, o agente pode separar em várias mensagens"
          checked={form.dividirRespostaEmPartes}
          onChange={(v) => setForm((p) => ({ ...p, dividirRespostaEmPartes: v }))}
        />
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
