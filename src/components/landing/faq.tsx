'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const PERGUNTAS = [
  {
    q: 'A IA realmente parece um humano?',
    r: 'Sim. Ela é treinada com regras rígidas de ortografia e tom natural, usa girías brasileiras quando faz sentido, demonstra emoção, pergunta de volta, e não solta respostas robotizadas tipo "como posso te ajudar hoje?". Na prática, 9 em 10 clientes não percebem que é IA.',
  },
  {
    q: 'Posso assumir a conversa quando quiser?',
    r: 'Claro. Basta clicar num botão e você vira o atendente humano naquela conversa. A IA para de responder automaticamente. Quando terminar, volta a IA com 1 clique.',
  },
  {
    q: 'E se a IA não souber responder alguma coisa?',
    r: 'Ela tem uma opção de escalar pra humano automaticamente quando não tem informação na base. Você configura isso. Em vez de inventar, ela diz "vou confirmar isso e já te respondo" e te chama.',
  },
  {
    q: 'Funciona com qual WhatsApp?',
    r: 'WhatsApp Business ou pessoal. A conexão é por QR Code oficial. Se você tem WhatsApp Business API já, também funciona.',
  },
  {
    q: 'E se eu perder meu WhatsApp ou trocar de celular?',
    r: 'Nenhum problema. Você reconecta com um novo QR Code em segundos. As conversas antigas ficam salvas no histórico.',
  },
  {
    q: 'Quais checkouts são suportados?',
    r: 'Hotmart, Kiwify e Ticto — os 3 maiores do Brasil. Capturamos 17 tipos de evento: compra aprovada, boleto gerado, PIX expirado, reembolso, chargeback, assinatura atrasada, trial iniciado, e por aí vai.',
  },
  {
    q: 'Tem período grátis? Posso cancelar?',
    r: 'Você cria sua conta sem cartão de crédito e testa tudo. Pode cancelar quando quiser, sem multa, sem pergunta.',
  },
  {
    q: 'Meus dados estão seguros?',
    r: 'Conexão WhatsApp é via protocolo oficial (mesma coisa que "aparelhos conectados"). Suas conversas ficam num banco criptografado. Você é dono dos seus dados e pode exportar/deletar a qualquer momento.',
  },
]

export const Faq = () => {
  const [aberto, setAberto] = useState<number | null>(0)

  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block text-[12px] font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Perguntas frequentes
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] text-zinc-900 leading-[1.1]">
            Ainda com dúvida?
          </h2>
        </div>

        <div className="space-y-3 animate-fade-up">
          {PERGUNTAS.map((item, i) => {
            const isOpen = aberto === i
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-200 hover:border-zinc-300"
              >
                <button
                  type="button"
                  onClick={() => setAberto(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[15px] font-semibold text-zinc-900 flex-1">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 animate-fade-in">
                    <p className="text-[14px] text-zinc-600 leading-relaxed">{item.r}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
