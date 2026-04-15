'use client'

import { useState, useRef, useEffect } from 'react'
import type { Agente } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabTesteProps {
  agente: Agente
}

interface MensagemTeste {
  id: string
  tipo: 'USUARIO' | 'AGENTE'
  conteudo: string
}

// Respostas mockadas que variam conforme config
const gerarRespostaMock = (agente: Agente): string => {
  const comEmojis = agente.config.usarEmojis
  const divide = agente.config.dividirRespostaEmPartes

  const basePorObjetivo: Record<string, string> = {
    VENDAS: 'Entendi! Esse é exatamente o problema que nosso produto resolve. Posso te enviar mais detalhes?',
    SUPORTE: 'Claro, vou te ajudar a resolver isso. Pode me contar mais detalhes do que está acontecendo?',
    RECUPERACAO: 'Vi que você iniciou uma compra e não finalizou. Posso te ajudar a concluir com um desconto especial?',
    ONBOARDING: 'Que bom ter você aqui! Vou te apresentar os primeiros passos pra você aproveitar o máximo.',
    USO_PESSOAL: 'Claro, estou aqui pra ajudar. O que você precisa?',
  }

  let resposta = basePorObjetivo[agente.objetivo] ?? 'Como posso te ajudar?'
  if (comEmojis) resposta = resposta + ' 😊'
  if (divide) resposta = resposta + '\n\nAliás, posso te enviar alguns exemplos práticos também.'
  return resposta
}

export const TabTeste = ({ agente }: TabTesteProps) => {
  const [mensagens, setMensagens] = useState<MensagemTeste[]>([
    {
      id: 'init',
      tipo: 'AGENTE',
      conteudo: agente.config.usarEmojis
        ? `Olá! Eu sou ${agente.nome} 👋 Como posso te ajudar?`
        : `Olá! Eu sou ${agente.nome}. Como posso te ajudar?`,
    },
  ])
  const [input, setInput] = useState('')
  const [respondendo, setRespondendo] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensagens])

  const handleEnviar = () => {
    if (!input.trim() || respondendo) return
    const novaMsgUsuario: MensagemTeste = {
      id: `msg_${Date.now()}`,
      tipo: 'USUARIO',
      conteudo: input.trim(),
    }
    setMensagens((prev) => [...prev, novaMsgUsuario])
    setInput('')
    setRespondendo(true)

    setTimeout(() => {
      const resposta: MensagemTeste = {
        id: `msg_${Date.now() + 1}`,
        tipo: 'AGENTE',
        conteudo: gerarRespostaMock(agente),
      }
      setMensagens((prev) => [...prev, resposta])
      setRespondendo(false)
    }, 1500)
  }

  const handleLimpar = () => {
    setMensagens([
      {
        id: 'init',
        tipo: 'AGENTE',
        conteudo: agente.config.usarEmojis
          ? `Olá! Eu sou ${agente.nome} 👋 Como posso te ajudar?`
          : `Olá! Eu sou ${agente.nome}. Como posso te ajudar?`,
      },
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
        <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
        <p className="text-[12px] text-blue-700 dark:text-blue-400">
          Este é um ambiente de teste. As respostas são simuladas para você validar o comportamento do agente.
        </p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="h-14 border-b border-border/50 bg-muted/30 flex items-center gap-3 px-4">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold text-[13px] shadow-sm"
            style={{
              background: `linear-gradient(to bottom, ${agente.avatarCor}, ${agente.avatarCor}dd)`,
            }}
          >
            {agente.nome.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-[13px] font-semibold">{agente.nome}</h3>
            <p className="text-[11px] text-muted-foreground">Modo teste</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLimpar}
            className="h-8 rounded-lg text-[12px]"
          >
            Limpar
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto p-4 space-y-2.5"
          style={{
            backgroundImage: 'radial-gradient(circle, oklch(0.92 0.004 264 / 40%) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.tipo === 'USUARIO' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[75%] px-4 py-2.5 rounded-[18px] shadow-sm',
                  msg.tipo === 'USUARIO'
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-[4px]'
                    : 'bg-card text-foreground border border-border/40 rounded-bl-[4px]'
                )}
                style={
                  msg.tipo === 'AGENTE'
                    ? {}
                    : undefined
                }
              >
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.conteudo}</p>
              </div>
            </div>
          ))}
          {respondendo && (
            <div className="flex justify-start">
              <div className="bg-card border border-border/40 rounded-[18px] rounded-bl-[4px] px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border/50 p-3 flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleEnviar()
              }
            }}
            placeholder="Digite uma mensagem para testar..."
            rows={1}
            className="flex-1 min-h-[40px] max-h-[100px] rounded-xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none py-2.5 px-4"
          />
          <Button
            onClick={handleEnviar}
            disabled={!input.trim() || respondendo}
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shrink-0"
            aria-label="Enviar"
          >
            {respondendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
