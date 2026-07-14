'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})

type FormData = z.infer<typeof schema>

export default function RecuperarSenhaPage() {
  const [submitting, setSubmitting] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const supabase = createClient()

      // URL absoluta pra Supabase mandar o usuário depois de clicar no email
      const redirectTo = `${window.location.origin}/redefinir-senha`

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo,
      })

      // Nao vaza se o email existe ou nao (evita user enumeration)
      if (error && !error.message.toLowerCase().includes('rate')) {
        console.error('[recuperar-senha]', error)
      }

      setEmailEnviado(data.email)
      setEnviado(true)
    } catch (e) {
      console.error(e)
      toast.error('Erro ao enviar. Tente novamente em alguns segundos.')
    } finally {
      setSubmitting(false)
    }
  }

  if (enviado) {
    return (
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={2} />
          </div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground mb-2">
            Confira seu e-mail
          </h1>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Se existe uma conta pra{' '}
            <span className="font-medium text-foreground">{emailEnviado}</span>,
            enviamos um link pra você redefinir a senha.
          </p>
        </div>

        <div className="apple-shadow rounded-2xl bg-card p-6 space-y-4">
          <div className="rounded-xl bg-muted/40 p-4 text-[12px] text-muted-foreground leading-relaxed">
            <p className="mb-2">
              📬 <strong>O e-mail pode levar 1-2 minutos pra chegar.</strong>
            </p>
            <p>Se não achar na caixa de entrada, confira também <strong>spam</strong> ou <strong>promoções</strong>.</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setEnviado(false)
                setEmailEnviado('')
              }}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Tentar outro e-mail
            </button>
            <Link
              href="/login"
              className="text-[13px] text-primary font-medium hover:underline text-center"
            >
              Voltar pro login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[380px]">
      <div className="text-center mb-8">
        <div className="mb-2">
          <span className="font-bold text-[56px] tracking-[-0.05em] leading-none text-foreground">
            GA
          </span>
        </div>
        <h1 className="text-[18px] font-medium tracking-[-0.01em] text-foreground">
          Recuperar senha
        </h1>
        <p className="text-[14px] text-muted-foreground mt-2">
          Digite seu e-mail e enviamos um link pra criar uma nova senha.
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
              autoComplete="email"
              autoFocus
              className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background transition-all duration-200"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-[12px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl text-[14px] font-medium"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar link de recuperação
          </Button>
        </form>
      </div>

      <p className="text-center text-[13px] text-muted-foreground mt-5">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar pro login
        </Link>
      </p>
    </div>
  )
}
