'use client'

import { useEffect, useState } from 'react'
import { apiAdmin, type LogIA } from '@/services/api-admin'
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
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'

const LIMIT = 50

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

export default function LogsIAPage() {
  const [items, setItems] = useState<LogIA[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiAdmin.ia
      .logs(page, LIMIT)
      .then((res) => {
        setItems(res.items)
        setTotal(res.total)
      })
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Auditoria de IA</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Histórico completo de chamadas LLM e Whisper — {total.toLocaleString('pt-BR')} registros
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-card apple-shadow overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-[13px] text-muted-foreground text-center py-10">
            Nenhum log ainda
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-[12px] font-medium">Data</TableHead>
                <TableHead className="text-[12px] font-medium">Provider</TableHead>
                <TableHead className="text-[12px] font-medium">Modelo</TableHead>
                <TableHead className="text-[12px] font-medium">Tipo</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Input</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Output</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Cache read</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Custo</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Duração</TableHead>
                <TableHead className="text-[12px] font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((log) => (
                <TableRow key={log.id} className="border-border/30">
                  <TableCell className="text-[11px] font-mono text-muted-foreground">
                    {formatDate(log.criado_em)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] rounded-md uppercase">
                      {log.provider}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[11px] font-mono text-muted-foreground">
                    {log.model}
                  </TableCell>
                  <TableCell className="text-[11px]">{log.tipo}</TableCell>
                  <TableCell className="text-[11px] text-right font-mono">
                    {log.input_tokens.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-[11px] text-right font-mono">
                    {log.output_tokens.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-[11px] text-right font-mono text-muted-foreground">
                    {log.cache_read_tokens.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-[11px] text-right font-mono font-medium">
                    ${log.custo_usd.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-[11px] text-right font-mono text-muted-foreground">
                    {log.duracao_ms ? `${log.duracao_ms}ms` : '—'}
                  </TableCell>
                  <TableCell>
                    {log.erro ? (
                      <Badge variant="secondary" className="bg-red-500/10 text-red-700 text-[10px] rounded-md">
                        Erro
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 text-[10px] rounded-md">
                        OK
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
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
