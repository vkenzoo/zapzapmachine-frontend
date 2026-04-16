'use client'

import { Fragment, useEffect, useState } from 'react'
import { apiAdmin, type LogCheckout } from '@/services/api-admin'
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
import { ChevronLeft, ChevronRight, CreditCard } from 'lucide-react'

const LIMIT = 50

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

const STATUS_COLOR: Record<string, string> = {
  SUCESSO: 'bg-emerald-500/10 text-emerald-700',
  ERRO: 'bg-red-500/10 text-red-700',
  IGNORADO: 'bg-gray-500/10 text-gray-600',
}

export default function LogsCheckoutPage() {
  const [items, setItems] = useState<LogCheckout[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [expandido, setExpandido] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    apiAdmin.checkout
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
        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
            Auditoria de Checkout
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Webhooks recebidos — {total.toLocaleString('pt-BR')} registros
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
            Nenhum webhook recebido ainda
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-[12px] font-medium">Data</TableHead>
                <TableHead className="text-[12px] font-medium">Provedor</TableHead>
                <TableHead className="text-[12px] font-medium">Evento</TableHead>
                <TableHead className="text-[12px] font-medium">Status</TableHead>
                <TableHead className="text-[12px] font-medium">Erro</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Payload</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((log) => (
                <Fragment key={log.id}>
                  <TableRow className="border-border/30">
                    <TableCell className="text-[11px] font-mono text-muted-foreground">
                      {formatDate(log.criado_em)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] rounded-md">
                        {log.provedor}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[12px] font-mono">{log.evento}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] rounded-md ${STATUS_COLOR[log.status_webhook] ?? ''}`}
                      >
                        {log.status_webhook}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] text-red-700 max-w-[240px] truncate">
                      {log.erro_mensagem ?? '—'}
                    </TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                  {expandido === log.id && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={6} className="p-4">
                        <pre className="text-[10px] font-mono whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
                          {JSON.stringify(log.payload, null, 2)}
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
