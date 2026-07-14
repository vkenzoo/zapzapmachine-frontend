import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: chamar getUser() para refresh do token (nao remover)
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Landing page publica (/)
  const isLandingRoute = pathname === '/'

  // Rotas publicas (auth) — redirecionam logado pra /dashboard
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/recuperar-senha') ||
    pathname.startsWith('/callback')

  // Recovery: publica MAS NAO redireciona logado
  // (Supabase seta sessao PASSWORD_RECOVERY quando user clica no link do email)
  const isRecoveryRoute = pathname.startsWith('/redefinir-senha')

  // Rotas totalmente publicas (nao requer auth)
  const isPublicRoute = isLandingRoute || isAuthRoute || isRecoveryRoute

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logado com must_change_password=true → força tela de trocar senha.
  // Hub provisiona com essa flag quando cria o user.
  const mustChangePwd = user?.user_metadata?.must_change_password === true
  const changePwdExempt =
    pathname.startsWith('/change-password') ||
    pathname.startsWith('/api') ||
    isLandingRoute ||
    isRecoveryRoute
  if (user && mustChangePwd && !changePwdExempt) {
    return NextResponse.redirect(new URL('/change-password', request.url))
  }

  // Usuario logado acessando /login, /signup etc — manda pro dashboard
  // Landing (/) sempre acessivel (mesmo logado)
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}
