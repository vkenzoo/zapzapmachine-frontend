'use client'

import { useState, useMemo } from 'react'
import type { Conversa } from '@/types'
import { ConversaListItem } from './conversa-list-item'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, MessageSquare } from 'lucide-react'

interface ConversaListProps {
  conversas: Conversa[]
  conversaSelecionadaId: string | null
  onSelecionar: (id: string) => void
  loading: boolean
}

export const ConversaList = ({
  conversas,
  conversaSelecionadaId,
  onSelecionar,
  loading,
}: ConversaListProps) => {
  const [busca, setBusca] = useState('')
  const [tab, setTab] = useState<'todas' | 'nao-lidas'>('todas')

  const totalNaoLidas = useMemo(
    () => conversas.filter((c) => c.naoLidas > 0).length,
    [conversas]
  )

  const conversasFiltradas = useMemo(() => {
    let result = conversas
    if (tab === 'nao-lidas') {
      result = result.filter((c) => c.naoLidas > 0)
    }
    if (busca.trim()) {
      const q = busca.trim().toLowerCase()
      result = result.filter(
        (c) =>
          c.nomeContato.toLowerCase().includes(q) ||
          c.telefone.includes(q)
      )
    }
    return result
  }, [conversas, tab, busca])

  return (
    <div className="flex flex-col h-full bg-card border-r border-border/50">
      <div className="p-4 border-b border-border/50 space-y-3">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">Conversas</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-9 pl-9 rounded-xl text-[13px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
          />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'todas' | 'nao-lidas')}>
          <TabsList className="bg-muted/50 h-8 p-0.5 w-full">
            <TabsTrigger value="todas" className="text-[12px] h-7 rounded-lg data-[state=active]:bg-background">
              Todas
            </TabsTrigger>
            <TabsTrigger value="nao-lidas" className="text-[12px] h-7 rounded-lg data-[state=active]:bg-background">
              Não lidas
              {totalNaoLidas > 0 && (
                <span className="ml-1.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                  {totalNaoLidas}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
              <div className="h-11 w-11 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-muted rounded-full" />
                <div className="h-2.5 w-48 bg-muted rounded-full" />
              </div>
            </div>
          ))
        ) : conversasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] text-muted-foreground">
              {busca ? 'Nenhum resultado encontrado' : tab === 'nao-lidas' ? 'Nenhuma conversa não lida' : 'Nenhuma conversa ainda'}
            </p>
          </div>
        ) : (
          conversasFiltradas.map((conversa) => (
            <ConversaListItem
              key={conversa.id}
              conversa={conversa}
              ativa={conversaSelecionadaId === conversa.id}
              onClick={() => onSelecionar(conversa.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
