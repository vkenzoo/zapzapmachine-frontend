import { Hero } from '@/components/landing/hero'
import { Integracoes } from '@/components/landing/integracoes'
import { DemosTelas } from '@/components/landing/demos-telas'
import { ComoFunciona } from '@/components/landing/como-funciona'
import { ParaQuem } from '@/components/landing/para-quem'
import { Faq } from '@/components/landing/faq'
import { CtaFinal, Footer } from '@/components/landing/cta-final'

export const metadata = {
  title: 'GA Sales Machine — Venda no WhatsApp no automático com IA',
  description:
    'Agentes de IA treinados com seu produto atendem, qualificam e fecham vendas 24h no WhatsApp. Integrado com Hotmart, Kiwify e Ticto.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Integracoes />
      <DemosTelas />
      <ComoFunciona />
      <ParaQuem />
      <Faq />
      <CtaFinal />
      <Footer />
    </>
  )
}
