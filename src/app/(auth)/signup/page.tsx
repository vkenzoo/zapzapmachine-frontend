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

const signupSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const { signup } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true)
    try {
      await signup(data.email, data.senha, data.nome)
      toast.success('Conta criada com sucesso!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao criar conta'
      if (msg.toLowerCase().includes('already registered')) {
        toast.error('E-mail ja cadastrado')
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
          <span className="font-bold text-[44px] tracking-[-0.05em] leading-none text-foreground">GA</span>
          <span className="font-medium text-[14px] tracking-[-0.01em] text-muted-foreground ml-2">Sales Machine</span>
        </div>
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-foreground mt-4">
          Criar conta
        </h1>
        <p className="text-[14px] text-muted-foreground mt-1.5">
          Comece a automatizar suas vendas
        </p>
      </div>

      <div className="apple-shadow rounded-2xl bg-card p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="nome" className="text-[13px] font-medium">
              Nome
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome"
              className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
              {...register('nome')}
              aria-invalid={!!errors.nome}
            />
            {errors.nome && (
              <p className="text-[12px] text-destructive mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
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
              placeholder="Mínimo 6 caracteres"
              className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
              {...register('senha')}
              aria-invalid={!!errors.senha}
            />
            {errors.senha && (
              <p className="text-[12px] text-destructive mt-1">{errors.senha.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl text-[14px] font-medium bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-[13px] text-muted-foreground mt-5">
        Ja tem conta?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
