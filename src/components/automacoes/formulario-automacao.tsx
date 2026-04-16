'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type {
  Automacao,
  Agente,
  IntegracaoCheckout,
  EventoAutomacao,
  ProvedorCheckout,
} from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, Zap } from 'lucide-react'

interface EventoItem {
  value: EventoAutomacao
  label: string
  descricao: string
  provedores: string // Quais provedores suportam (pra badge)
}

interface EventoGrupo {
  titulo: string
  eventos: EventoItem[]
}

const EVENTOS_GRUPOS: EventoGrupo[] = [
  {
    titulo: 'Compra',
    eventos: [
      {
        value: 'COMPRA_APROVADA',
        label: 'Compra aprovada',
        descricao: 'Cliente completou o pagamento',
        provedores: 'Todos',
      },
      {
        value: 'COMPRA_RECUSADA',
        label: 'Compra recusada',
        descricao: 'Pagamento falhou ou foi recusado',
        provedores: 'Todos',
      },
      {
        value: 'REEMBOLSO',
        label: 'Reembolso',
        descricao: 'Cliente pediu devolução',
        provedores: 'Todos',
      },
      {
        value: 'CARRINHO_ABANDONADO',
        label: 'Carrinho abandonado',
        descricao: 'Iniciou checkout mas não finalizou',
        provedores: 'Todos',
      },
      {
        value: 'ASSINATURA_CANCELADA',
        label: 'Assinatura cancelada',
        descricao: 'Cliente cancelou a assinatura',
        provedores: 'Todos',
      },
    ],
  },
  {
    titulo: 'Pagamento pendente',
    eventos: [
      {
        value: 'BOLETO_GERADO',
        label: 'Boleto gerado',
        descricao: 'Cliente gerou boleto (ainda não pagou)',
        provedores: 'Todos',
      },
      {
        value: 'PIX_GERADO',
        label: 'Pix gerado',
        descricao: 'Cliente gerou código Pix (ainda não pagou)',
        provedores: 'Kiwify, Ticto',
      },
      {
        value: 'PIX_EXPIRADO',
        label: 'Pix expirado',
        descricao: 'Código Pix expirou sem pagamento',
        provedores: 'Ticto',
      },
      {
        value: 'BOLETO_ATRASADO',
        label: 'Boleto atrasado',
        descricao: 'Vencimento do boleto passou sem pagamento',
        provedores: 'Ticto',
      },
      {
        value: 'PAGAMENTO_EXPIRADO',
        label: 'Pagamento expirado',
        descricao: 'Prazo de pagamento encerrou',
        provedores: 'Hotmart',
      },
    ],
  },
  {
    titulo: 'Problemas',
    eventos: [
      {
        value: 'CHARGEBACK',
        label: 'Chargeback',
        descricao: 'Cliente contestou a compra no cartão',
        provedores: 'Todos',
      },
      {
        value: 'PROTESTO',
        label: 'Protesto',
        descricao: 'Compra foi protestada',
        provedores: 'Hotmart',
      },
      {
        value: 'PAGAMENTO_ATRASADO',
        label: 'Pagamento atrasado',
        descricao: 'Pagamento recorrente ficou em atraso',
        provedores: 'Hotmart',
      },
    ],
  },
  {
    titulo: 'Assinaturas',
    eventos: [
      {
        value: 'ASSINATURA_ATRASADA',
        label: 'Assinatura atrasada',
        descricao: 'Cobrança recorrente falhou',
        provedores: 'Kiwify, Ticto',
      },
      {
        value: 'ASSINATURA_RENOVADA',
        label: 'Assinatura renovada',
        descricao: 'Cobrança recorrente aprovada',
        provedores: 'Kiwify, Ticto',
      },
      {
        value: 'TRIAL_INICIADO',
        label: 'Trial iniciado',
        descricao: 'Cliente começou período de testes',
        provedores: 'Ticto',
      },
      {
        value: 'TRIAL_ENCERRADO',
        label: 'Trial encerrado',
        descricao: 'Período de testes terminou',
        provedores: 'Ticto',
      },
    ],
  },
]

/** Flat list pra lookup rápido */
const EVENTOS: EventoItem[] = EVENTOS_GRUPOS.flatMap((g) => g.eventos)

const PROVEDORES = [
  { value: 'HOTMART', label: 'Hotmart' },
  { value: 'KIWIFY', label: 'Kiwify' },
  { value: 'TICTO', label: 'Ticto' },
]

const NULL_VALUE = '__any__'

interface Produto {
  id: string
  nomeProduto: string
  provedor: ProvedorCheckout
}

interface Props {
  automacao?: Automacao // Se passar, modo editar
}

export const FormularioAutomacao = ({ automacao }: Props) => {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)
  const [agentes, setAgentes] = useState<Agente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)

  // Campos
  const [nome, setNome] = useState(automacao?.nome ?? '')
  const [evento, setEvento] = useState<EventoAutomacao>(
    automacao?.evento ?? 'COMPRA_APROVADA'
  )
  const [provedor, setProvedor] = useState<string>(automacao?.provedor ?? NULL_VALUE)
  const [produtoId, setProdutoId] = useState<string>(automacao?.produtoId ?? NULL_VALUE)
  const [agenteId, setAgenteId] = useState<string>(automacao?.agenteId ?? NULL_VALUE)
  const [mensagemInicial, setMensagemInicial] = useState(
    automacao?.mensagemInicial ?? ''
  )
  const [delayValor, setDelayValor] = useState<number>(
    automacao?.delayMinutos ? automacao.delayMinutos : 0
  )
  const [delayUnidade, setDelayUnidade] = useState<'minutos' | 'horas'>(() => {
    const m = automacao?.delayMinutos ?? 0
    return m >= 60 && m % 60 === 0 ? 'horas' : 'minutos'
  })
  const [executarSeExiste, setExecutarSeExiste] = useState(
    automacao?.executarSeExiste ?? false
  )
  const [ativo, setAtivo] = useState(automacao?.ativo ?? true)

  // Ajusta o display de delay se for em horas
  useEffect(() => {
    if (automacao?.delayMinutos && automacao.delayMinutos >= 60 && automacao.delayMinutos % 60 === 0) {
      setDelayValor(automacao.delayMinutos / 60)
      setDelayUnidade('horas')
    }
  }, [automacao])

  // Carrega agentes + produtos disponíveis
  useEffect(() => {
    const carregar = async () => {
      try {
        const [agentesList, checkouts] = await Promise.all([
          api.agentes.listar(),
          api.integracoes.listarCheckouts(),
        ])
        setAgentes(agentesList.filter((a) => a.status === 'ATIVO'))
        const prods: Produto[] = []
        checkouts.forEach((int: IntegracaoCheckout) => {
          int.produtos.forEach((p) => {
            prods.push({
              id: p.id,
              nomeProduto: p.nomeProduto,
              provedor: int.provedor,
            })
          })
        })
        setProdutos(prods)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  // Filtra produtos pelo provedor selecionado
  const produtosFiltrados =
    provedor === NULL_VALUE
      ? produtos
      : produtos.filter((p) => p.provedor === provedor)

  const handleSalvar = async () => {
    if (!nome.trim()) {
      toast.error('Digite um nome para a automação')
      return
    }

    const delayMinutos =
      delayUnidade === 'horas' ? delayValor * 60 : delayValor

    setSalvando(true)
    try {
      const dados = {
        nome: nome.trim(),
        evento,
        provedor: provedor === NULL_VALUE ? null : (provedor as ProvedorCheckout),
        produtoId: produtoId === NULL_VALUE ? null : produtoId,
        agenteId: agenteId === NULL_VALUE ? null : agenteId,
        mensagemInicial: mensagemInicial.trim() || null,
        delayMinutos,
        executarSeExiste,
        ativo,
      }

      if (automacao) {
        await api.automacoes.atualizar(automacao.id, dados)
        toast.success('Automação atualizada')
      } else {
        await api.automacoes.criar(dados)
        toast.success('Automação criada')
      }
      router.push('/automacoes')
    } catch {
      toast.error('Erro ao salvar automação')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
          <Zap className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
            {automacao ? 'Editar automação' : 'Nova automação'}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Dispare ações automáticas quando eventos acontecerem
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-card apple-shadow p-6 space-y-5">
        {/* Nome */}
        <div className="space-y-2">
          <Label className="text-[13px]">Nome da automação</Label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Boas-vindas curso X"
            className="rounded-xl text-[14px]"
          />
        </div>

        {/* Evento */}
        <div className="space-y-2">
          <Label className="text-[13px]">Quando acontecer</Label>
          <Select
            value={evento}
            onValueChange={(v) => {
              if (v) setEvento(v as EventoAutomacao)
            }}
          >
            <SelectTrigger className="rounded-xl text-[14px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EVENTOS_GRUPOS.map((grupo) => (
                <div key={grupo.titulo}>
                  <div className="px-2 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {grupo.titulo}
                  </div>
                  {grupo.eventos.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium">{e.label}</span>
                          <span className="text-[9px] text-muted-foreground bg-muted/60 rounded px-1 py-[1px] uppercase tracking-wide">
                            {e.provedores}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {e.descricao}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provedor */}
        <div className="space-y-2">
          <Label className="text-[13px]">De qual provedor</Label>
          <Select
            value={provedor}
            onValueChange={(v) => {
              if (v) setProvedor(v)
              setProdutoId(NULL_VALUE) // reset produto ao trocar provedor
            }}
          >
            <SelectTrigger className="rounded-xl text-[14px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NULL_VALUE}>Qualquer provedor</SelectItem>
              {PROVEDORES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Produto */}
        <div className="space-y-2">
          <Label className="text-[13px]">De qual produto</Label>
          <Select
            value={produtoId}
            onValueChange={(v) => {
              if (v) setProdutoId(v)
            }}
          >
            <SelectTrigger className="rounded-xl text-[14px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NULL_VALUE}>Qualquer produto</SelectItem>
              {produtosFiltrados.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nomeProduto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {produtosFiltrados.length === 0 && (
            <p className="text-[11px] text-muted-foreground">
              Nenhum produto cadastrado. Conecte uma integração de checkout primeiro.
            </p>
          )}
        </div>

        {/* Agente */}
        <div className="space-y-2">
          <Label className="text-[13px]">Ativar agente</Label>
          <Select
            value={agenteId}
            onValueChange={(v) => {
              if (v) setAgenteId(v)
            }}
          >
            <SelectTrigger className="rounded-xl text-[14px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NULL_VALUE}>
                <span className="text-muted-foreground">Sem agente (modo humano)</span>
              </SelectItem>
              {agentes.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: a.avatarCor }}
                    />
                    <span>{a.nome}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {agentes.length === 0 && (
            <p className="text-[11px] text-muted-foreground">
              Nenhum agente ativo. Crie um em /agentes.
            </p>
          )}
        </div>

        {/* Mensagem inicial */}
        <div className="space-y-2">
          <Label className="text-[13px]">Mensagem inicial</Label>
          <Textarea
            value={mensagemInicial}
            onChange={(e) => setMensagemInicial(e.target.value)}
            placeholder={`Oi {nome}! 🎉\n\nSua compra do {produto} foi confirmada.\nMe chamo Bia e vou te ajudar. Me conta: você já teve contato com esse tipo de produto?`}
            rows={5}
            className="rounded-xl text-[14px] font-mono"
          />
          <p className="text-[11px] text-muted-foreground">
            Placeholders disponíveis: <code className="text-[10px]">{'{nome}'}</code>,{' '}
            <code className="text-[10px]">{'{produto}'}</code>,{' '}
            <code className="text-[10px]">{'{email}'}</code>,{' '}
            <code className="text-[10px]">{'{valor}'}</code>,{' '}
            <code className="text-[10px]">{'{metodo_pagamento}'}</code>,{' '}
            <code className="text-[10px]">{'{parcelas}'}</code>,{' '}
            <code className="text-[10px]">{'{link_acesso}'}</code>,{' '}
            <code className="text-[10px]">{'{boleto_url}'}</code>,{' '}
            <code className="text-[10px]">{'{pix_codigo}'}</code>. Deixe em branco para
            não enviar mensagem (só criar a conversa).
          </p>
        </div>

        {/* Delay */}
        <div className="space-y-2">
          <Label className="text-[13px]">Enviar após</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              value={delayValor}
              onChange={(e) => setDelayValor(Math.max(0, Number(e.target.value)))}
              className="rounded-xl text-[14px] flex-1"
            />
            <Select
              value={delayUnidade}
              onValueChange={(v) => {
                if (v) setDelayUnidade(v as 'minutos' | 'horas')
              }}
            >
              <SelectTrigger className="rounded-xl text-[14px] w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutos">Minutos</SelectItem>
                <SelectItem value="horas">Horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-[11px] text-muted-foreground">
            0 = imediato. Ex: 30 minutos, 2 horas, 24 horas.
          </p>
        </div>

        {/* Executar se existe */}
        <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
          <div className="space-y-0.5 pr-4">
            <span className="text-[13px] font-medium">
              Executar em conversas existentes
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Quando ativado, dispara mesmo se o cliente já teve conversa antes. Útil
              para follow-ups e re-engajamento.
            </p>
          </div>
          <Switch checked={executarSeExiste} onCheckedChange={setExecutarSeExiste} />
        </div>

        {/* Ativo */}
        <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
          <div className="space-y-0.5 pr-4">
            <span className="text-[13px] font-medium">Automação ativa</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Desative para pausar temporariamente sem excluir.
            </p>
          </div>
          <Switch checked={ativo} onCheckedChange={setAtivo} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => router.push('/automacoes')}
          disabled={salvando}
        >
          Cancelar
        </Button>
        <Button onClick={handleSalvar} disabled={salvando} className="rounded-xl">
          {salvando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4 mr-1.5" />
              {automacao ? 'Salvar alterações' : 'Criar automação'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
