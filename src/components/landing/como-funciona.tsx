'use client'

import { QrCode, Brain, TrendingUp } from 'lucide-react'

const PASSOS = [
  {
    num: '01',
    icon: QrCode,
    titulo: 'Conecte seu WhatsApp',
    desc: 'Escaneie um QR Code e seu número já está conectado. Funciona com WhatsApp Business ou pessoal.',
    tempo: '30 segundos',
    cor: 'from-blue-500 to-indigo-600',
  },
  {
    num: '02',
    icon: Brain,
    titulo: 'Treine a IA',
    desc: 'Conte sobre seu produto, preços, FAQ e tom de voz. A IA vira especialista no seu negócio em minutos.',
    tempo: '5 minutos',
    cor: 'from-purple-500 to-pink-600',
  },
  {
    num: '03',
    icon: TrendingUp,
    titulo: 'Veja as vendas rolando',
    desc: 'Cada mensagem que chega é respondida em segundos. 24/7. Você acompanha tudo e assume quando quiser.',
    tempo: 'Agora',
    cor: 'from-emerald-500 to-teal-600',
  },
]

export const ComoFunciona = () => {
  return (
    <section id="como-funciona" className="relative bg-white py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block text-[12px] font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Como funciona
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] text-zinc-900 leading-[1.1] mb-4">
            Do zero às vendas automáticas<br className="hidden sm:block" />{' '}
            em menos de 10 minutos
          </h2>
          <p className="text-[16px] text-zinc-600 max-w-2xl mx-auto">
            Sem instalar nada, sem configurar servidor, sem contratar dev.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PASSOS.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={p.num}
                className="relative group animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Card */}
                <div className="relative h-full rounded-3xl bg-white border border-zinc-200 p-6 lg:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Número gigante de fundo */}
                  <span className="absolute top-4 right-5 text-[80px] font-black text-zinc-100 leading-none select-none">
                    {p.num}
                  </span>

                  {/* Ícone */}
                  <div
                    className={`relative inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br ${p.cor} items-center justify-center shadow-lg mb-5`}
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>

                  <h3 className="relative text-[20px] font-bold tracking-[-0.01em] text-zinc-900 mb-2">
                    {p.titulo}
                  </h3>
                  <p className="relative text-[14px] text-zinc-600 leading-relaxed mb-5">
                    {p.desc}
                  </p>

                  <div className="relative inline-flex items-center gap-1.5 rounded-full bg-zinc-900 text-white text-[11px] font-medium px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {p.tempo}
                  </div>
                </div>

                {/* Seta entre os cards (só md+) */}
                {i < PASSOS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-zinc-300" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
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
