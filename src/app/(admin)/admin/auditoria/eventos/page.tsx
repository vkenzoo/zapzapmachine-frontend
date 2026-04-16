'use client'

import { Fragment, useEffect, useState } from 'react'
import { apiAdmin, type LogEvento, type EventosStats } from '@/services/api-admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ListChecks, X } from 'lucide-react'

const LIMIT = 50
const NULL_FILTER = '__all__'

const CATEGORIAS = [
  { value: 'AUTH', label: 'Login / Auth' },
  { value: 'PERFIL', label: 'Perfil' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'CONVERSA', label: 'Conversa' },
  { value: 'MENSAGEM', label: 'Mensagem' },
  { value: 'AUTOMACAO', label: 'Automação' },
  { value: 'CHECKOUT', label: 'Checkout' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SISTEMA', label: 'Sistema' },
]

const CATEGORIA_COLOR: Record<string, string> = {
  AUTH: 'bg-blue-500/10 text-blue-700',
  PERFIL: 'bg-purple-500/10 text-purple-700',
  WHATSAPP: 'bg-emerald-500/10 text-emerald-700',
  CONVERSA: 'bg-cyan-500/10 text-cyan-700',
  MENSAGEM: 'bg-sky-500/10 text-sky-700',
  AUTOMACAO: 'bg-orange-500/10 text-orange-700',
  CHECKOUT: 'bg-yellow-500/10 text-yellow-700',
  ADMIN: 'bg-red-500/10 text-red-700',
  SISTEMA: 'bg-gray-500/10 text-gray-700',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

export default function AuditoriaEventosPage() {
  const [items, setItems] = useState<LogEvento[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState<string>(NULL_FILTER)
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<EventosStats | null>(null)
  const [expandido, setExpandido] = useState<string | null>(null)

  useEffect(() => {
    apiAdmin.eventos.stats().then(setStats).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    apiAdmin.eventos
      .logs({
        page,
        limit: LIMIT,
        categoria: categoria !== NULL_FILTER ? categoria : undefined,
        search: searchTerm || undefined,
      })
      .then((res) => {
        setItems(res.items)
        setTotal(res.total)
      })
      .finally(() => setLoading(false))
  }, [page, categoria, searchTerm])

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  const handleBuscar = () => {
    setPage(1)
    setSearchTerm(search.trim())
  }

  const limparFiltros = () => {
    setCategoria(NULL_FILTER)
    setSearch('')
    setSearchTerm('')
    setPage(1)
  }

  const hasFilter = categoria !== NULL_FILTER || searchTerm

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <ListChecks className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
            Auditoria de Eventos
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Todas as ações do sistema — {total.toLocaleString('pt-BR')} registros
          </p>
        </div>
      </div>

      {/* Stats 7d */}
      {stats && stats.porCategoria.length > 0 && (
        <div className="rounded-2xl bg-card apple-shadow p-5">
          <h2 className="text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Atividade últimos 7 dias — {stats.total.toLocaleString('pt-BR')} eventos
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.porCategoria.map((c) => (
              <button
                key={c.categoria}
                onClick={() => {
                  setCategoria(c.categoria)
                  setPage(1)
                }}
                className={`text-[11px] rounded-md px-2.5 py-1 font-medium hover:opacity-80 transition ${
                  CATEGORIA_COLOR[c.categoria] ?? 'bg-gray-500/10 text-gray-700'
                }`}
              >
                {c.categoria}: {c.count}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="rounded-2xl bg-card apple-shadow p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            placeholder="Buscar na descrição..."
            className="rounded-xl text-[13px] flex-1"
          />
          <Button
            onClick={handleBuscar}
            size="sm"
            variant="outline"
            className="rounded-xl shrink-0"
          >
            Buscar
          </Button>
        </div>

        <Select
          value={categoria}
          onValueChange={(v) => {
            if (v) {
              setCategoria(v)
              setPage(1)
            }
          }}
        >
          <SelectTrigger className="rounded-xl text-[13px] w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NULL_FILTER}>Todas as categorias</SelectItem>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilter && (
          <Button
            onClick={limparFiltros}
            size="sm"
            variant="ghost"
            className="rounded-xl shrink-0"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Tabela */}
      <div className="rounded-2xl bg-card apple-shadow overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-[13px] text-muted-foreground text-center py-10">
            Nenhum evento encontrado
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-[12px] font-medium">Data</TableHead>
                <TableHead className="text-[12px] font-medium">Usuário</TableHead>
                <TableHead className="text-[12px] font-medium">Categoria</TableHead>
                <TableHead className="text-[12px] font-medium">Ação</TableHead>
                <TableHead className="text-[12px] font-medium">Descrição</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((log) => (
                <Fragment key={log.id}>
                  <TableRow className="border-border/30">
                    <TableCell className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {formatDate(log.criado_em)}
                    </TableCell>
                    <TableCell className="text-[12px] font-medium">
                      {log.user_nome ?? <span className="text-muted-foreground">sistema</span>}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] rounded-md ${CATEGORIA_COLOR[log.categoria] ?? ''}`}
                      >
                        {log.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] font-mono">{log.acao}</TableCell>
                    <TableCell className="text-[12px] max-w-[320px] truncate">
                      {log.descricao ?? '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.detalhes ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] rounded-lg h-7"
                          onClick={() =>
                            setExpandido(expandido === log.id ? null : log.id)
                          }
                        >
                          {expandido === log.id ? 'Ocultar' : 'Ver'}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandido === log.id && log.detalhes && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={6} className="p-4">
                        <pre className="text-[10px] font-mono whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
                          {JSON.stringify(log.detalhes, null, 2)}
                        </pre>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Paginacao */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
