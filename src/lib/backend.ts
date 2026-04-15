import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const getBackendUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!url) throw new Error('NEXT_PUBLIC_BACKEND_URL nao configurada')
  return url.replace(/\/$/, '')
}

export const apiFetch = async <T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Usuario nao autenticado')

  const res = await fetch(`${getBackendUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Backend ${res.status}: ${body}`)
  }

  return res.json() as Promise<T>
}
