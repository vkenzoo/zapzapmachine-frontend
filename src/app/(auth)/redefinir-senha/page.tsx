'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    next: z.string().min(10, 'Mínimo 10 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, {
    message: 'As senhas não conferem',
    path: ['confirm'],
  })

type FormData = z.infer<typeof schema>

/**
 * Página que o usuário chega apos clicar no link do email de recuperacao.
 * O Supabase seta uma sessao PASSWORD_RECOVERY temporaria — usamos ela
 * pra atualizar a senha via supabase.auth.updateUser().
 */
export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [temSessao, setTemSessao] = useState<boolean | null>(null)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  // Ao montar: valida que existe sessao PASSWORD_RECOVERY (via callback do email)
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setTemSessao(!!session)
    })

    // Se chegar via magic link, evento PASSWORD_RECOVERY dispara sozinho
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setTemSessao(true)
      }
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: data.next })

      if (error) {
        toast.error(
          error.message.includes('same')
            ? 'Escolha uma senha diferente da anterior'
            : 'Não foi possível redefinir. O link pode ter expirado.'
        )
        return
      }

      setSucesso(true)
      toast.success('Senha redefinida com sucesso!')
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch (e) {
      console.error(e)
      toast.error('Erro ao redefinir. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state enquanto valida sessao
  if (temSessao === null) {
    return (
      <div className="w-full max-w-[380px] flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Sem sessao válida = link expirado ou acesso direto
  if (!temSessao) {
    return (
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground mb-2">
            Link inválido ou expirado
          </h1>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            O link de recuperação já foi usado ou passou de 1 hora. Solicite um novo.
          </p>
        </div>

        <div className="apple-shadow rounded-2xl bg-card p-6 space-y-3">
          <Link
            href="/recuperar-senha"
            className="block w-full text-center rounded-xl bg-primary text-primary-foreground py-3 text-[14px] font-medium hover:bg-primary/90 transition-colors"
          >
            Solicitar novo link
          </Link>
          <Link
            href="/login"
            className="block text-center text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Voltar pro login
          </Link>
        </div>
      </div>
    )
  }

  // Sucesso
  if (sucesso) {
    return (
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={2} />
          </div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground mb-2">
            Senha redefinida!
          </h1>
          <p className="text-[14px] text-muted-foreground">
            Redirecionando pro dashboard...
          </p>
        </div>
      </div>
    )
  }

  // Formulário principal
  return (
    <div className="w-full max-w-[380px]">
      <div className="text-center mb-8">
        <div className="mb-2">
          <span className="font-bold text-[56px] tracking-[-0.05em] leading-none text-foreground">
            GA
          </span>
        </div>
        <h1 className="text-[18px] font-medium tracking-[-0.01em] text-foreground">
          Nova senha
        </h1>
        <p className="text-[14px] text-muted-foreground mt-2">
          Crie uma senha forte pra proteger sua conta.
        </p>
      </div>

      <div className="apple-shadow rounded-2xl bg-card p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="next" className="text-[13px] font-medium">
              Nova senha
            </Label>
            <div className="relative">
              <Input
                id="next"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Mínimo 10 caracteres"
                autoComplete="new-password"
                autoFocus
                className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background pr-11"
                {...register('next')}
                aria-invalid={!!errors.next}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.next && (
              <p className="text-[12px] text-destructive">{errors.next.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-[13px] font-medium">
              Confirmar nova senha
            </Label>
            <Input
              id="confirm"
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Digite de novo"
              autoComplete="new-password"
              className="h-11 rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background"
              {...register('confirm')}
              aria-invalid={!!errors.confirm}
            />
            {errors.confirm && (
              <p className="text-[12px] text-destructive">{errors.confirm.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl text-[14px] font-medium"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar nova senha
          </Button>
        </form>
      </div>

      <p className="text-[11px] text-muted-foreground text-center mt-5 leading-relaxed">
        Após salvar, você entra automaticamente com a nova senha.
      </p>
    </div>
  )
}
