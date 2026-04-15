'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Inscreve-se em mudancas da tabela `conversas` para o usuario.
 * Chama `onChange` quando qualquer conversa (INSERT, UPDATE, DELETE) eh alterada.
 *
 * O callback simplesmente avisa que algo mudou — o chamador deve recarregar
 * a lista de conversas chamando `api.conversas.listar()`.
 */
export const useRealtimeConversas = (
  userId: string | undefined,
  onChange: () => void
) => {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`conversas:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT | UPDATE | DELETE
          schema: 'public',
          table: 'conversas',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          onChangeRef.current()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])
}
