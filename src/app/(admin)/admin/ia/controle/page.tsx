'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { apiAdmin, type ConfigPrompt } from '@/services/api-admin'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Save, Sparkles } from 'lucide-react'

interface EditorState {
  conteudo: string
  ativo: boolean
  saving: boolean
  dirty: boolean
}

export default function ControleIAPage() {
  const [prompts, setPrompts] = useState<ConfigPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<Record<string, EditorState>>({})

  const carregar = async () => {
    try {
      const data = await apiAdmin.prompts.listar()
      setPrompts(data)
      const s: Record<string, EditorState> = {}
      for (const p of data) {
        s[p.chave] = {
          conteudo: p.conteudo,
          ativo: p.ativo,
          saving: false,
          dirty: false,
        }
      }
      setState(s)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  const updateField = (chave: string, patch: Partial<EditorState>) => {
    setState((prev) => ({
      ...prev,
      [chave]: { ...prev[chave], ...patch, dirty: true },
    }))
  }

  const handleSalvar = async (p: ConfigPrompt) => {
    const s = state[p.chave]
    if (!s) return
    setState((prev) => ({ ...prev, [p.chave]: { ...s, saving: true } }))
    try {
      await apiAdmin.prompts.atualizar(p.chave, {
        conteudo: s.conteudo,
        ativo: s.ativo,
      })
      toast.success('Regra atualizada — aplica na proxima msg em 5 min (cache)')
      setState((prev) => ({
        ...prev,
        [p.chave]: { ...s, saving: false, dirty: false },
      }))
    } catch {
      toast.error('Erro ao salvar')
      setState((prev) => ({ ...prev, [p.chave]: { ...s, saving: false } }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Controle de IA</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Edite as regras globais que todos os agentes seguem
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="rounded-2xl bg-card apple-shadow p-8 text-center text-[13px] text-muted-foreground">
          Nenhuma regra cadastrada. Rode o SQL de seed.
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((p) => {
            const s = state[p.chave]
            if (!s) return null
            return (
              <div key={p.id} className="rounded-2xl bg-card apple-shadow p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
                      {p.titulo}
                    </h2>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {p.chave}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[12px] text-muted-foreground">Ativo</Label>
                    <Switch
                      checked={s.ativo}
                      onCheckedChange={(v) => updateField(p.chave, { ativo: v })}
                    />
                  </div>
                </div>

                <Textarea
                  value={s.conteudo}
                  onChange={(e) => updateField(p.chave, { conteudo: e.target.value })}
                  rows={10}
                  className="rounded-xl text-[12px] font-mono"
                />

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSalvar(p)}
                    disabled={s.saving || !s.dirty}
                    className="rounded-xl"
                    size="sm"
                  >
                    {s.saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1.5" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
