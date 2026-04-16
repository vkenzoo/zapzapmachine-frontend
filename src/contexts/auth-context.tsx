'use client'

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import type { Usuario } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { apiFetch } from '@/lib/backend'

const pingLogin = async (): Promise<void> => {
  try {
    await apiFetch('/whatsapp/ping-login', { method: 'POST' })
  } catch {
    // fire-and-forget
  }
}

interface AuthContextType {
  usuario: Usuario | null
  isLoading: boolean
  isAdmin: boolean
  login: (email: string, senha: string) => Promise<void>
  signup: (email: string, senha: string, nome: string) => Promise<void>
  logout: () => Promise<void>
  atualizarPerfil: (dados: Partial<Pick<Usuario, 'nome' | 'fotoUrl' | 'agentesDesligados'>>) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

const supabase = createClient()

const carregarPerfil = async (userId: string, email: string): Promise<Usuario | null> => {
  const { data } = await supabase
    .from('usuarios')
    .select('id, nome, foto_url, agentes_desligados, role, ultimo_login, plano, status, criado_em')
    .eq('id', userId)
    .single()

  if (!data) return null

  return {
    id: data.id,
    email,
    nome: data.nome,
    fotoUrl: data.foto_url ?? null,
    agentesDesligados: data.agentes_desligados ?? false,
    role: (data.role as Usuario['role']) ?? 'USER',
    ultimoLogin: data.ultimo_login ?? null,
    plano: data.plano as Usuario['plano'],
    status: data.status as Usuario['status'],
    criadoEm: data.criado_em,
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Carrega sessao inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const perfil = await carregarPerfil(session.user.id, session.user.email ?? '')
        setUsuario(perfil)
        pingLogin()
      }
      setIsLoading(false)
    })

    // Subscribe em mudancas de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const perfil = await carregarPerfil(session.user.id, session.user.email ?? '')
          setUsuario(perfil)
          pingLogin()
        } else if (event === 'SIGNED_OUT') {
          setUsuario(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(
    async (email: string, senha: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    },
    [router]
  )

  const signup = useCallback(
    async (email: string, senha: string, nome: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome } },
      })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    },
    [router]
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUsuario(null)
    router.push('/login')
    router.refresh()
  }, [router])

  const atualizarPerfil = useCallback(
    (dados: Partial<Pick<Usuario, 'nome' | 'fotoUrl' | 'agentesDesligados'>>) => {
      setUsuario((prev) => (prev ? { ...prev, ...dados } : prev))
    },
    []
  )

  const isAdmin = useMemo(() => usuario?.role === 'ADMIN', [usuario])

  return (
    <AuthContext.Provider value={{ usuario, isLoading, isAdmin, login, signup, logout, atualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}
