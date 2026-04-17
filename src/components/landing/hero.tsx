'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { DemoChat } from './demo-chat'

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      {/* Background: gradient + glow blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.25),transparent)]" />
      <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl" />

      {/* Grid sutil de fundo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-24 lg:pt-20 lg:pb-32">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-12 lg:mb-20">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[20px] font-bold tracking-[-0.03em]">GA</span>
            <span className="text-[13px] font-medium text-white/60 tracking-[-0.01em]">
              Sales Machine
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] text-white/80 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white text-zinc-950 px-4 py-2 text-[13px] font-medium hover:bg-white/90 transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </nav>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Lado esquerdo: headline + CTA */}
          <div className="animate-fade-up">
            {/* Badge de topo */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 mb-6 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-[12px] text-white/80">
                Agentes IA treinados com seu produto
              </span>
            </div>

            <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-bold tracking-[-0.03em] leading-[1.02] mb-6">
              Venda no WhatsApp{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                enquanto você dorme
              </span>
            </h1>

            <p className="text-[16px] sm:text-[18px] text-white/70 leading-relaxed mb-8 max-w-xl">
              Conecte seu WhatsApp, treine a IA com seu produto e deixe ela atender,
              qualificar e fechar vendas 24h — sem script engessado, cada resposta
              parece escrita por você.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-zinc-950 px-6 py-3.5 text-[15px] font-semibold hover:bg-blue-50 transition-all shadow-lg shadow-white/10"
              >
                Criar minha conta grátis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-[15px] font-medium hover:bg-white/10 transition-colors"
              >
                Ver como funciona
              </Link>
            </div>

            {/* Social proof / reassurance */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Sem cartão de crédito
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Conecta em 2 minutos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Cancele quando quiser
              </span>
            </div>
          </div>

          {/* Lado direito: demo de chat animado */}
          <div className="animate-fade-up [animation-delay:150ms] flex justify-center lg:justify-end">
            <DemoChat />
          </div>
        </div>
      </div>

      {/* Divisor de gradient no fundo da section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-zinc-950" />
    </section>
  )
}
