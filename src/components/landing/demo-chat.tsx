'use client'

import { useEffect, useState } from 'react'

interface Msg {
  id: number
  tipo: 'cliente' | 'ia' | 'typing'
  texto: string
  hora: string
}

const ROTEIRO: Omit<Msg, 'id'>[] = [
  {
    tipo: 'cliente',
    texto: 'Oi, vi seu anúncio. Quanto custa o curso?',
    hora: '14:23',
  },
  { tipo: 'typing', texto: '', hora: '' },
  {
    tipo: 'ia',
    texto: 'Oi! 😊 Que bom que você viu. O Fórmula Digital 3.0 é R$ 997 à vista ou 12x de R$ 99,70.',
    hora: '14:23',
  },
  {
    tipo: 'ia',
    texto: 'Tem 7 dias de garantia incondicional. Me conta, você já tem alguma ideia do que quer vender online?',
    hora: '14:23',
  },
  { tipo: 'cliente', texto: 'Queria vender produto digital mesmo', hora: '14:24' },
  { tipo: 'typing', texto: '', hora: '' },
  {
    tipo: 'ia',
    texto: 'Perfeito! É exatamente pra isso que o curso foi feito 🔥',
    hora: '14:24',
  },
  {
    tipo: 'ia',
    texto: 'Quer que eu te envie o link pra começar agora com os 7 dias de garantia?',
    hora: '14:24',
  },
  { tipo: 'cliente', texto: 'Pode mandar sim!', hora: '14:25' },
]

export const DemoChat = () => {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (idx >= ROTEIRO.length) {
      // reset apos 3s pra loopar
      const t = setTimeout(() => {
        setMsgs([])
        setIdx(0)
      }, 3500)
      return () => clearTimeout(t)
    }

    const current = ROTEIRO[idx]
    const delay = current.tipo === 'typing' ? 1100 : current.tipo === 'cliente' ? 1700 : 1400

    const t = setTimeout(() => {
      if (current.tipo === 'typing') {
        // Adiciona typing temporariamente
        setMsgs((prev) => [...prev, { ...current, id: Date.now() }])
      } else {
        // Remove typing se houver + adiciona msg
        setMsgs((prev) => [
          ...prev.filter((m) => m.tipo !== 'typing'),
          { ...current, id: Date.now() },
        ])
      }
      setIdx((i) => i + 1)
    }, delay)

    return () => clearTimeout(t)
  }, [idx])

  return (
    <div className="relative w-full max-w-[360px] mx-auto">
      {/* Notch de celular */}
      <div className="relative rounded-[36px] bg-gradient-to-b from-zinc-900 to-black p-2 shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <div className="rounded-[28px] overflow-hidden bg-[#0b141a]">
          {/* Header do chat */}
          <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[14px] font-bold">
              B
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-medium leading-tight">Bia · Vendedora</p>
              <p className="text-emerald-300/80 text-[10px] leading-tight mt-0.5">
                online agora
              </p>
            </div>
            <div className="flex gap-3 text-white/60">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
              </svg>
            </div>
          </div>

          {/* Mensagens */}
          <div
            className="h-[420px] px-3 py-3 space-y-2 overflow-y-auto"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(29, 50, 62, 0.4) 0%, rgba(15, 27, 35, 0.9) 70%)',
            }}
          >
            {msgs.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-white/40 text-[11px]">
                  Esperando mensagem...
                </div>
              </div>
            )}
            {msgs.map((m) => {
              if (m.tipo === 'typing') {
                return (
                  <div key={m.id} className="flex justify-end animate-fade-in">
                    <div className="rounded-2xl bg-emerald-500/90 px-3.5 py-2.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )
              }
              const isIA = m.tipo === 'ia'
              return (
                <div
                  key={m.id}
                  className={`flex ${isIA ? 'justify-end' : 'justify-start'} animate-fade-up`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 shadow-sm ${
                      isIA
                        ? 'bg-emerald-500/95 text-white'
                        : 'bg-white/95 text-zinc-900'
                    }`}
                  >
                    <p className="text-[13px] leading-snug whitespace-pre-line">
                      {m.texto}
                    </p>
                    <p
                      className={`text-[9px] mt-0.5 text-right ${
                        isIA ? 'text-emerald-50/80' : 'text-zinc-500'
                      }`}
                    >
                      {m.hora}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input fake (desabilitado) */}
          <div className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2">
            <div className="flex-1 rounded-full bg-[#2a3942] h-9 flex items-center px-4">
              <span className="text-white/30 text-[12px]">Modo IA ativo</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3zm7 11c0 3.53-2.61 6.43-6 6.92V22h-2v-3.08c-3.39-.49-6-3.39-6-6.92h2a5 5 0 0010 0h2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Badge flutuante "IA atendendo" */}
      <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[11px] px-3 py-1.5 rounded-full shadow-lg shadow-blue-600/40 font-medium flex items-center gap-1.5 animate-pulse-slow">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        IA atendendo
      </div>
    </div>
  )
}
