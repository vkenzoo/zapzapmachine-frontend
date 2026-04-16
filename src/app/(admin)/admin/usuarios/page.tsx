'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { apiAdmin, type AdminUsuario } from '@/services/api-admin'
import type { RoleUsuario } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'

const formatDate = (iso: string | null) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function UsuariosAdminPage() {
  const { usuario } = useAuth()
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([])
  const [loading, setLoading] = useState(true)

  const carregar = async () => {
    try {
      const data = await apiAdmin.usuarios.listar()
      setUsuarios(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  const handleToggleAdmin = async (u: AdminUsuario, makeAdmin: boolean) => {
    const novaRole: RoleUsuario = makeAdmin ? 'ADMIN' : 'USER'
    try {
      await apiAdmin.usuarios.alterarRole(u.id, novaRole)
      setUsuarios((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, role: novaRole } : x))
      )
      toast.success(`${u.nome} agora é ${novaRole}`)
    } catch {
      toast.error('Erro ao alterar role')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Usuários</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Gerenciar usuários e permissões de admin
        </p>
      </div>

      <div className="rounded-2xl bg-card apple-shadow overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : usuarios.length === 0 ? (
          <p className="text-[13px] text-muted-foreground text-center py-10">
            Nenhum usuário encontrado
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-[12px] font-medium">Nome</TableHead>
                <TableHead className="text-[12px] font-medium">E-mail</TableHead>
                <TableHead className="text-[12px] font-medium">Plano</TableHead>
                <TableHead className="text-[12px] font-medium">Cadastro</TableHead>
                <TableHead className="text-[12px] font-medium">Último login</TableHead>
                <TableHead className="text-[12px] font-medium text-right">Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => {
                const isSelf = u.id === usuario?.id
                return (
                  <TableRow key={u.id} className="border-border/30">
                    <TableCell className="font-medium text-[13px]">{u.nome}</TableCell>
                    <TableCell className="text-[12px] text-muted-foreground">
                      {u.email ?? '—'}
                    </TableCell>
                    <TableCell className="text-[12px]">
                      <Badge variant="secondary" className="text-[10px] rounded-md">
                        {u.plano}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[12px] text-muted-foreground">
                      {formatDate(u.criado_em)}
                    </TableCell>
                    <TableCell className="text-[12px] text-muted-foreground">
                      {formatDate(u.ultimo_login)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={u.role === 'ADMIN'}
                        disabled={isSelf}
                        onCheckedChange={(v) => handleToggleAdmin(u, v)}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
