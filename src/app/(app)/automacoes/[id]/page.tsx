'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { api } from '@/services/api'
import type { Automacao } from '@/types'
import { FormularioAutomacao } from '@/components/automacoes/formulario-automacao'

export default function EditarAutomacaoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [automacao, setAutomacao] = useState<Automacao | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.automacoes
      .listar()
      .then((list) => {
        const found = list.find((a) => a.id === id)
        if (!found) {
          router.push('/automacoes')
          return
        }
        setAutomacao(found)
      })
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!automacao) return null

  return <FormularioAutomacao automacao={automacao} />
}
