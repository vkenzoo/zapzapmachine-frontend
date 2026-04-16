'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, ExternalLink, type LucideIcon } from 'lucide-react'

export interface PassoConfig {
  titulo: string
  descricao: string
  link?: { label: string; href: string }
}

export interface EventoMarcar {
  label: string
  obrigatorio?: boolean
}

interface Props {
  webhookUrl: string
  provedorNome: string
  corPrimaria: string
  passos: PassoConfig[]
  eventosMarcar: EventoMarcar[]
  linkPainel: { label: string; href: string }
  observacao?: string
  Icon?: LucideIcon
}

export const GuiaProvedor = ({
  webhookUrl,
  provedorNome,
  corPrimaria,
  passos,
  eventosMarcar,
  linkPainel,
  observacao,
}: Props) => {
  const [copied, setCopied] = useState(false)

  const copiar = async () => {
    await navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    toast.success('URL copiada!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* URL do webhook */}
      <div className="space-y-2">
        <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
          URL do webhook
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted/50 px-3.5 py-2.5 rounded-xl text-[11px] break-all font-mono">
            {webhookUrl}
          </code>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl shrink-0"
            onClick={copiar}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Passo a passo */}
      <div className="space-y-2.5">
        <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
          Como configurar no {provedorNome}
        </label>
        <div className="space-y-2">
          {passos.map((passo, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-border/60 p-3"
            >
              <div
                className="h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-white text-[11px] font-semibold"
                style={{ backgroundColor: corPrimaria }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium leading-tight">
                  {passo.titulo}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                  {passo.descricao}
                </p>
                {passo.link && (
                  <a
                    href={passo.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-1.5"
                  >
                    {passo.link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <a
          href={linkPainel.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] text-blue-600 hover:underline pt-1"
        >
          {linkPainel.label}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Eventos a marcar */}
      <div className="space-y-2">
        <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
          Eventos que você deve marcar
        </label>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          No painel do {provedorNome}, selecione esses eventos para que o sistema
          receba. Os marcados com <strong>★</strong> são os mais importantes.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {eventosMarcar.map((e) => (
            <Badge
              key={e.label}
              variant="secondary"
              className={`text-[11px] rounded-md font-normal ${
                e.obrigatorio
                  ? 'bg-blue-500/10 text-blue-700 border border-blue-200'
                  : 'bg-muted/60'
              }`}
            >
              {e.obrigatorio && '★ '}
              {e.label}
            </Badge>
          ))}
        </div>
      </div>

      {observacao && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
          <p className="text-[12px] text-amber-900 leading-relaxed">
            💡 <strong>Dica:</strong> {observacao}
          </p>
        </div>
      )}
    </div>
  )
}
