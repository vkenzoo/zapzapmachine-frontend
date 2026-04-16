'use client'

import { useState } from 'react'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle, XCircle, RefreshCw } from 'lucide-react'

type Status = 'idle' | 'loading' | 'ok' | 'antigo' | 'nunca' | 'erro'

interface Props {
  integracaoId: string
  /** Se true, renderiza em formato card (detail page). False = compacto (dialog). */
  variant?: 'card' | 'compact'
}

const formatarTempo = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return 'há poucos segundos'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h}h`
  const d = Math.floor(h / 24)
  return `há ${d} dia${d > 1 ? 's' : ''}`
}

export const ValidadorWebhook = ({ integracaoId, variant = 'card' }: Props) => {
  const [status, setStatus] = useState<Status>('idle')
  const [dados, setDados] = useState<{
    ultimoRecebimento: string | null
    total24h: number
  } | null>(null)

  const testar = async () => {
    setStatus('loading')
    try {
      const res = await api.integracoes.statusWebhook(integracaoId)
      setDados({ ultimoRecebimento: res.ultimoRecebimento, total24h: res.total24h })
      if (!res.jaRecebeu) {
        setStatus('nunca')
        return
      }
      const diffMs = Date.now() - new Date(res.ultimoRecebimento!).getTime()
      // < 24h = OK, maior = antigo
      if (diffMs < 24 * 3600 * 1000) setStatus('ok')
      else setStatus('antigo')
    } catch {
      setStatus('erro')
    }
  }

  const cor =
    status === 'ok'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : status === 'antigo'
      ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
      : status === 'nunca' || status === 'erro'
      ? 'bg-red-50 border-red-200 text-red-900'
      : 'bg-muted/30 border-border/60 text-muted-foreground'

  const icone =
    status === 'ok' ? (
      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
    ) : status === 'antigo' ? (
      <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
    ) : status === 'nunca' || status === 'erro' ? (
      <XCircle className="h-5 w-5 text-red-600 shrink-0" />
    ) : null

  const mensagem = (() => {
    if (status === 'loading') return 'Checando...'
    if (status === 'ok' && dados?.ultimoRecebimento)
      return `Webhook funcionando! Último evento ${formatarTempo(
        dados.ultimoRecebimento
      )}. ${dados.total24h} evento${dados.total24h !== 1 ? 's' : ''} nas últimas 24h.`
    if (status === 'antigo' && dados?.ultimoRecebimento)
      return `Recebi eventos antes (${formatarTempo(
        dados.ultimoRecebimento
      )}), mas nada recente. Faça uma compra de teste pra confirmar.`
    if (status === 'nunca')
      return 'Ainda não recebi nenhum evento. Confira se colou a URL no painel do provedor, marcou os eventos corretos e salvou.'
    if (status === 'erro') return 'Erro ao checar status. Tente novamente.'
    return 'Clique em Testar depois de configurar no painel do provedor.'
  })()

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-8 text-[12px]"
          onClick={testar}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          )}
          Testar conexão
        </Button>
        {status !== 'idle' && status !== 'loading' && (
          <div className="flex items-center gap-1.5 text-[12px] flex-1 min-w-0">
            {icone}
            <span className="truncate">{mensagem}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${cor}`}>
      {status !== 'idle' && status !== 'loading' && icone}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="text-[13px] font-semibold">
            {status === 'idle' ? 'Testar conexão' : 'Status da conexão'}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg h-7 text-[11px] shrink-0"
            onClick={testar}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-1" />
                {status === 'idle' ? 'Testar' : 'Atualizar'}
              </>
            )}
          </Button>
        </div>
        <p className="text-[12px] leading-relaxed">{mensagem}</p>
      </div>
    </div>
  )
}
