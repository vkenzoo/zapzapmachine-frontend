'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

const INCLUSO = [
  'Agentes IA ilimitados (Claude Sonnet 4.5)',
  'Conexão com WhatsApp via QR Code oficial',
  'Bases de conhecimento ilimitadas',
  'Automações por evento (17 gatilhos)',
  'Integração Hotmart, Kiwify e Ticto',
  'Transcrição automática de áudio (Whisper)',
  'Atendimento humano com 1 clique',
  'Dashboard com analytics em tempo real',
  'Realtime: zero F5 pra ver msg nova',
  'Suporte direto comigo',
]

export const Pricing = () => {
  return (
    <section id="pricing" className="relative bg-white py-24 lg:py-32 scroll-mt-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block text-[12px] font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Investimento
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] text-zinc-900 leading-[1.1] mb-3">
            Plano único, sem pegadinha
          </h2>
          <p className="text-[16px] text-zinc-600 max-w-xl mx-auto">
            Tudo incluso. Sem limite de mensagens, sem custo extra por agente,
            sem mensalidade surpresa.
          </p>
        </div>

        <div className="relative animate-fade-up">
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 opacity-15 blur-3xl rounded-3xl" />

          <div className="relative rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 p-1 shadow-2xl">
            <div className="rounded-[22px] bg-zinc-950 p-8 sm:p-10 lg:p-12">
              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
                {/* Lado esquerdo: features */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 mb-5 backdrop-blur">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-white/80 font-medium">
                      Acesso completo
                    </span>
                  </div>

                  <h3 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.02em] text-white leading-tight mb-5">
                    GA Sales Machine — Plano Anual
                  </h3>

                  <ul className="space-y-2.5">
                    {INCLUSO.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <div className="h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
                        </div>
                        <span className="text-[13px] text-white/80 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lado direito: preço + CTA */}
                <div className="lg:border-l lg:border-white/10 lg:pl-10">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[14px] text-white/50 font-medium">
                        R$
                      </span>
                      <span className="text-[56px] sm:text-[68px] font-bold tracking-[-0.04em] text-white leading-none">
                        3.500
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[14px] text-white/60">
                        à vista — 1 ano de acesso
                      </span>
                    </div>
                    <div className="text-[12px] text-white/40">
                      Equivale a{' '}
                      <span className="text-white/70 font-semibold">
                        R$ 291,67/mês
                      </span>{' '}
                      sem juros
                    </div>
                  </div>

                  <a
                    href="mailto:vinnykenzo@gmail.com?subject=Quero%20acesso%20ao%20GA%20Sales%20Machine&body=Ol%C3%A1!%20Quero%20contratar%20o%20plano%20anual%20do%20GA%20Sales%20Machine.%20Como%20procedo%3F"
                    className="group flex items-center justify-center gap-2 w-full rounded-full bg-white text-zinc-950 px-6 py-4 text-[15px] font-semibold hover:bg-blue-50 transition-all shadow-lg shadow-white/10 mb-4"
                  >
                    Quero meu acesso
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-white/50">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      Acesso liberado na hora do pagamento
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-white/50">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      Pagamento via Pix, boleto ou cartão
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-white/50">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      7 dias de garantia incondicional
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance abaixo */}
        <p className="text-center text-[12px] text-zinc-500 mt-8 max-w-lg mx-auto leading-relaxed">
          Sem mensalidade extra. Sem limite de mensagens ou conversas. Sem cobrança
          surpresa pelo uso. Renove ou cancele no fim de cada ano.
        </p>
      </div>
    </section>
  )
}
