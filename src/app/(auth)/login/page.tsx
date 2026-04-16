'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { APP_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true)
    try {
      await login(data.email, data.senha)
      toast.success('Login realizado com sucesso!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao fazer login'
      if (msg.toLowerCase().includes('invalid')) {
        toast.error('E-mail ou senha incorretos')
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        toast.error('Confirme seu e-mail antes de entrar')
      } else {
        toast.error(msg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[380px]">
      <div className="text-center mb-8">
        <div className="mb-2">
          <span className="font-bold text-[56px] tracking-[-0.05em] leading-none text-foreground">GA</span>
        </div>
        <h1 className="text-[18px] font-medium tracking-[-0.01em] text-foreground">
          Sales Machine
        </h1>
        <p className="text-[14px] text-muted-foreground mt-2">
          Entre na sua conta para continuar
        </p>
      </div>

      <div className="apple-shadow rounded-2xl bg-card p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background transition-all duration-200"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-[12px] text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="senha" className="text-[13px] font-medium">
              Senha
            </Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background transition-all duration-200"
              {...register('senha')}
              aria-invalid={!!errors.senha}
            />
            {errors.senha && (
              <p className="text-[12px] text-destructive mt-1">{errors.senha.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl text-[14px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/20 transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-[13px] text-muted-foreground mt-5">
        Nao tem conta?{' '}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Criar conta
        </Link>
      </p>
      <p className="text-center text-[12px] text-muted-foreground mt-2">
        <button
          type="button"
          className="hover:text-foreground transition-colors duration-200"
          onClick={() => toast.info('Funcionalidade em breve')}
        >
          Esqueci minha senha
        </button>
      </p>
    </div>
  )
}
