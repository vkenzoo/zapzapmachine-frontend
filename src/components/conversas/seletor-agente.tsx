'use client'

import { useEffect, useState } from 'react'
import { Bot, Sparkles } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/services/api'
import type { Agente } from '@/types'

const AGENTE_NULL_VALUE = '__nenhum__'

interface SeletorAgenteProps {
  agenteId: string | null | undefined
  onChange: (agenteId: string | null) => Promise<void>
  disabled?: boolean
}

export const SeletorAgente = ({
  agenteId,
  onChange,
  disabled,
}: SeletorAgenteProps) => {
  const [agentes, setAgentes] = useState<Agente[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancel = false
    api.agentes
      .listar()
      .then((list) => {
        if (!cancel) {
          setAgentes(list.filter((a) => a.status === 'ATIVO'))
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancel) setLoading(false)
      })
    return () => {
      cancel = true
    }
  }, [])

  const handleChange = async (value: string) => {
    const id = value === AGENTE_NULL_VALUE ? null : value
    setSaving(true)
    try {
      await onChange(id)
    } finally {
      setSaving(false)
    }
  }

  const valueAtual = agenteId ?? AGENTE_NULL_VALUE

  return (
    <Select
      value={valueAtual}
      onValueChange={handleChange}
      disabled={disabled || saving || loading}
    >
      <SelectTrigger
        className="h-8 w-auto min-w-[160px] max-w-[220px] text-[12px] rounded-full border-dashed"
        aria-label="Selecionar agente"
      >
        <Bot className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <SelectValue
          placeholder={loading ? 'Carregando...' : 'Sem agente'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={AGENTE_NULL_VALUE}>
          <span className="text-muted-foreground">Sem agente</span>
        </SelectItem>
        {agentes.length === 0 && !loading && (
          <div className="px-2 py-1.5 text-[12px] text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Crie um agente em /agentes
          </div>
        )}
        {agentes.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full shrink-0"
                style={{ backgroundColor: a.avatarCor }}
              />
              <span className="text-[13px]">{a.nome}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
