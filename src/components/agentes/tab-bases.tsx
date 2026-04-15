'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { api } from '@/services/api'
import type { BaseConhecimento } from '@/types'
import { Button } from '@/components/ui/button'
import { BasesMultiSelect } from './bases-multi-select'
import { Loader2, Plus } from 'lucide-react'

interface TabBasesProps {
  basesIds: string[]
  onSave: (basesIds: string[]) => Promise<void>
}

export const TabBases = ({ basesIds, onSave }: TabBasesProps) => {
  const [bases, setBases] = useState<BaseConhecimento[]>([])
  const [form, setForm] = useState<string[]>(basesIds)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.baseConhecimento.listar().then((data) => {
      setBases(data)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
      toast.success('Bases vinculadas salvas!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-muted-foreground">
            Selecione as bases de conhecimento que o agente vai consultar
          </p>
        </div>
        <Link href="/base-conhecimento">
          <Button variant="outline" size="sm" className="h-8 rounded-lg text-[12px]">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nova base
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <BasesMultiSelect bases={bases} selecionadas={form} onChange={setForm} />
      )}

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={saving || loading}
          className="h-10 rounded-xl text-[13px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15 px-6"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Salvar
        </Button>
      </div>
    </div>
  )
}
