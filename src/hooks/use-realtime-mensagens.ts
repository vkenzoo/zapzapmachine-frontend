'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mensagemFromRow } from '@/lib/supabase/mappers'
import type { Mensagem } from '@/types'

/**
 * Inscreve-se em mudancas da tabela `mensagens` para uma conversa.
 * Chama `onInsert` quando uma nova mensagem eh inserida.
 *
 * Reinscreve quando `conversaId` muda. Cleanup automatico no unmount.
 */
export const useRealtimeMensagens = (
  conversaId: string | undefined,
  onInsert: (mensagem: Mensagem) => void
) => {
  const onInsertRef = useRef(onInsert)

  // Mantem o callback atualizado sem reassinar
  useEffect(() => {
    onInsertRef.current = onInsert
  }, [onInsert])

  useEffect(() => {
    if (!conversaId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`mensagens:${conversaId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens',
          filter: `conversa_id=eq.${conversaId}`,
        },
        (payload) => {
          const row = payload.new as Parameters<typeof mensagemFromRow>[0]
          onInsertRef.current(mensagemFromRow(row))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversaId])
}
