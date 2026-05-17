'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    current: z.string().min(1, 'Senha atual obrigatória'),
    next: z.string().min(10, 'Mínimo 10 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, {
    message: 'As senhas não conferem',
    path: ['confirm'],
  })
  .refine((d) => d.next !== d.current, {
    message: 'Use uma senha diferente da atual',
    path: ['next'],
  })

type FormData = z.infer<typeof schema>

export default function ChangePasswordPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) {
        toast.error('Sessão expirada. Faça login novamente.')
        return
      }

      // Valida senha atual
      const reAuth = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.current,
      })
      if (reAuth.error) {
        toast.error('Senha atual incorreta')
        return
      }

      // Atualiza senha + limpa flag
      const { error } = await supabase.auth.updateUser({
        password: data.next,
        data: {
          ...user.user_metadata,
          must_change_password: false,
          password_changed_at: new Date().toISOString(),
        },
      })
      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Senha alterada com sucesso')
      router.push('/dashboard')
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold">Crie sua nova senha</h1>
        <p className="text-sm text-muted-foreground mt-2">
          No primeiro acesso, troque a senha temporária por uma sua.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current">Senha atual</Label>
          <Input
            id="current"
            type="password"
            autoComplete="current-password"
            placeholder="A senha que veio por email"
            {...register('current')}
          />
          {errors.current && (
            <p className="text-xs text-destructive">{errors.current.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="next">Nova senha</Label>
          <Input
            id="next"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 10 caracteres"
            {...register('next')}
          />
          {errors.next && (
            <p className="text-xs text-destructive">{errors.next.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmar nova senha</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            {...register('confirm')}
          />
          {errors.confirm && (
            <p className="text-xs text-destructive">{errors.confirm.message}</p>
          )}
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Trocar senha
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-6">
        Sua senha é privada. Ninguém da equipe consegue ver.
      </p>
    </div>
  )
}
