'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { Agente } from '@/types'
import { OBJETIVOS_AGENTE } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Power, Trash2, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgenteCardProps {
  agente: Agente
  onUpdate: () => void
}

export const AgenteCard = ({ agente, onUpdate }: AgenteCardProps) => {
  const router = useRouter()
  const [alternando, setAlternando] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const objetivo = OBJETIVOS_AGENTE.find((o) => o.value === agente.objetivo)!

  const handleAlternarStatus = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setAlternando(true)
    try {
      await api.agentes.alternarStatus(agente.id)
      toast.success(
        agente.status === 'ATIVO' ? 'Agente desativado' : 'Agente ativado'
      )
      onUpdate()
    } catch {
      toast.error('Erro ao alterar status')
    } finally {
      setAlternando(false)
    }
  }

  const handleExcluir = async () => {
    try {
      await api.agentes.excluir(agente.id)
      toast.success('Agente excluído')
      onUpdate()
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  const isAtivo = agente.status === 'ATIVO'

  return (
    <div
      onClick={() => router.push(`/agentes/${agente.id}`)}
      className="rounded-2xl bg-card apple-shadow hover:apple-shadow-hover transition-all duration-300 p-5 cursor-pointer"
    >
      <div className="flex items-start gap-3.5 mb-4">
        <div
          className="h-11 w-11 rounded-[14px] flex items-center justify-center shrink-0 text-white font-semibold text-[15px] shadow-sm"
          style={{
            background: `linear-gradient(to bottom, ${agente.avatarCor}, ${agente.avatarCor}dd)`,
          }}
        >
          {agente.nome.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] font-semibold tracking-[-0.01em] truncate">
              {agente.nome}
            </h3>
            <Badge
              variant="secondary"
              className={cn(
                'text-[11px] font-medium rounded-md px-1.5 py-0 h-5 shrink-0',
                isAtivo
                  ? 'bg-emerald-500/10 text-emerald-700'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {isAtivo ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <objetivo.icon
              className="h-3 w-3"
              style={{ color: objetivo.cor }}
              strokeWidth={2}
            />
            <span className="text-[12px] text-muted-foreground">{objetivo.label}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg shrink-0"
                aria-label="Ações"
                onClick={(e) => e.stopPropagation()}
              />
            }
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem
              className="text-[13px] rounded-lg"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/agentes/${agente.id}`)
              }}
            >
              <Settings2 className="mr-2 h-3.5 w-3.5 opacity-60" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[13px] rounded-lg"
              onClick={handleAlternarStatus}
              disabled={alternando}
            >
              <Power className="mr-2 h-3.5 w-3.5 opacity-60" />
              {isAtivo ? 'Desativar' : 'Ativar'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[13px] text-destructive focus:text-destructive rounded-lg"
              onClick={(e) => {
                e.stopPropagation()
                setConfirmOpen(true)
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5 opacity-60" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent className="rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[17px] tracking-[-0.01em]">
                Excluir agente
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] leading-relaxed">
                Tem certeza que deseja excluir <strong>{agente.nome}</strong>?
                Essa ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleExcluir}
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
        {agente.descricao || 'Sem descrição'}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
        <span className="text-[11px] text-muted-foreground">
          {agente.basesConhecimentoIds.length} base{agente.basesConhecimentoIds.length !== 1 ? 's' : ''} vinculada{agente.basesConhecimentoIds.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
