'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/services/api'
import { PROVEDORES } from '@/lib/constants'
import type { IntegracaoCheckout, ProdutoCheckout, ProvedorCheckout } from '@/types'
import { EditarProdutoDialog } from '@/components/integracoes/editar-produto-dialog'
import { PageHeader } from '@/components/common/page-header'
import { ProvedorLogo } from '@/components/integracoes/provedor-logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Copy, Check, MoreHorizontal, Loader2, BookOpen } from 'lucide-react'
import { ValidadorWebhook } from '@/components/integracoes/validador-webhook'
import { GuiaHotmart } from '@/components/integracoes/guia-hotmart'
import { GuiaKiwify } from '@/components/integracoes/guia-kiwify'
import { GuiaTicto } from '@/components/integracoes/guia-ticto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function CheckoutDetailPage() {
  const { provider } = useParams<{ provider: string }>()
  const router = useRouter()
  const [integracao, setIntegracao] = useState<IntegracaoCheckout | null>(null)
  const [loading, setLoading] = useState(true)
  const [desassociando, setDesassociando] = useState(false)
  const [copied, setCopied] = useState(false)
  const [produtoEdit, setProdutoEdit] = useState<ProdutoCheckout | null>(null)
  const [guiaAberto, setGuiaAberto] = useState(false)

  const provedorKey = provider.toUpperCase() as ProvedorCheckout
  const provedorInfo = PROVEDORES[provedorKey]

  const recarregar = useCallback(() => {
    api.integracoes.obterCheckoutPorProvedor(provider).then((data) => {
      setIntegracao(data)
      setLoading(false)
    })
  }, [provider])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  const handleCopiar = async () => {
    if (!integracao) return
    await navigator.clipboard.writeText(integracao.webhookUrl)
    setCopied(true)
    toast.success('URL copiada!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDesassociar = async () => {
    if (!integracao) return
    setDesassociando(true)
    try {
      await api.integracoes.desassociarCheckout(integracao.id)
      toast.success('Integração desassociada com sucesso')
      router.push('/integracoes/checkout')
    } catch {
      toast.error('Erro ao desassociar integração')
    } finally {
      setDesassociando(false)
    }
  }

  const handleAtualizar = () => {
    toast.success('Integração atualizada com sucesso')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-48 rounded-full" />
        <div className="rounded-2xl bg-card apple-shadow p-6 space-y-4">
          <Skeleton className="h-5 w-64 rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded-full" />
        </div>
      </div>
    )
  }

  if (!integracao || !provedorInfo) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px] text-muted-foreground mb-4">Integração não encontrada</p>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => router.push('/integracoes/checkout')}
        >
          Voltar para Checkouts
        </Button>
      </div>
    )
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <>
      <PageHeader
        titulo={provedorInfo.nome}
        breadcrumb={[
          { label: 'Integrações', href: '/integracoes/checkout' },
          { label: 'Checkouts', href: '/integracoes/checkout' },
          { label: provedorInfo.nome },
        ]}
      />

      <div className="space-y-5">
        <div className="rounded-2xl bg-card apple-shadow p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3.5">
              <ProvedorLogo provedor={provedorInfo.id} size={40} />
              <div>
                <h2 className="font-medium text-[15px] tracking-[-0.01em]">{integracao.nomeConta}</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Criado em {formatDate(integracao.criadoEm)}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium rounded-md"
            >
              {integracao.status}
            </Badge>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium">URL do Webhook</label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] rounded-lg"
                onClick={() => setGuiaAberto(true)}
              >
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Ver guia
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted/50 px-3.5 py-2.5 rounded-xl text-[12px] break-all font-mono">
                {integracao.webhookUrl}
              </code>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl shrink-0"
                onClick={handleCopiar}
                aria-label="Copiar URL do webhook"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <ValidadorWebhook integracaoId={integracao.id} variant="compact" />
          </div>
        </div>

        <div className="rounded-2xl bg-card apple-shadow overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-4">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em]">Produtos</h3>
              <Badge variant="secondary" className="text-[11px] rounded-md font-medium">
                Integração API
              </Badge>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium rounded-md"
            >
              Ativo
            </Badge>
          </div>
          <div className="px-1">
            {integracao.produtos.length === 0 ? (
              <p className="text-[13px] text-muted-foreground text-center py-10">
                Nenhum produto encontrado
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-[12px] font-medium">Nome</TableHead>
                    <TableHead className="text-[12px] font-medium">ID</TableHead>
                    <TableHead className="text-right text-[12px] font-medium">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integracao.produtos.map((produto) => (
                    <TableRow key={produto.id} className="border-border/30">
                      <TableCell className="font-medium text-[13px]">
                        {produto.nomeProduto}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-[11px]">
                        {produto.idExternoProduto}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                aria-label="Ações do produto"
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem
                              className="text-[13px] rounded-lg"
                              onClick={() => setProdutoEdit(produto)}
                            >
                              Configurar produto
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-[13px] rounded-lg text-destructive"
                              onClick={async () => {
                                if (!confirm(`Remover produto "${produto.nomeProduto}"?`)) return
                                try {
                                  await api.integracoes.excluirProduto(produto.id)
                                  toast.success('Produto removido')
                                  recarregar()
                                } catch {
                                  toast.error('Erro ao remover')
                                }
                              }}
                            >
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-card apple-shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em]">Webhooks</h3>
              <Badge variant="secondary" className="text-[11px] rounded-md font-medium">
                Integração de eventos
              </Badge>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium rounded-md"
            >
              Ativo
            </Badge>
          </div>
          <p className="text-[13px] text-muted-foreground">
            Data do último recebimento:{' '}
            <span className="text-foreground font-medium">
              {integracao.ultimoRecebimento
                ? formatDate(integracao.ultimoRecebimento)
                : 'Nenhum webhook recebido'}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="outline"
                  className="rounded-xl text-[13px] text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/5"
                  disabled={desassociando}
                />
              }
            >
              {desassociando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desassociando...
                </>
              ) : (
                'Desassociar conta'
              )}
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[17px] tracking-[-0.01em]">
                  Desassociar integração
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[13px] leading-relaxed">
                  Tem certeza que deseja desassociar a conta{' '}
                  <strong>{integracao.nomeConta}</strong>? Essa ação não pode
                  ser desfeita e você deixará de receber notificações de
                  transações.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDesassociar}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Desassociar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={handleAtualizar}
            className="rounded-xl text-[13px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/15"
          >
            Atualizar integração
          </Button>
        </div>
      </div>

      <EditarProdutoDialog
        open={!!produtoEdit}
        onOpenChange={(v) => !v && setProdutoEdit(null)}
        produto={produtoEdit}
        onSaved={recarregar}
      />

      <Dialog open={guiaAberto} onOpenChange={setGuiaAberto}>
        <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[17px] tracking-[-0.01em]">
              Guia de configuração — {provedorInfo.nome}
            </DialogTitle>
          </DialogHeader>
          {provedorInfo.id === 'HOTMART' && (
            <GuiaHotmart webhookUrl={integracao.webhookUrl} />
          )}
          {provedorInfo.id === 'KIWIFY' && (
            <GuiaKiwify webhookUrl={integracao.webhookUrl} />
          )}
          {provedorInfo.id === 'TICTO' && (
            <GuiaTicto webhookUrl={integracao.webhookUrl} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
