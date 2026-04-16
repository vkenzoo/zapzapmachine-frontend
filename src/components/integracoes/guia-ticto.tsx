'use client'

import { GuiaProvedor } from './guia-provedor'

export const GuiaTicto = ({ webhookUrl }: { webhookUrl: string }) => {
  return (
    <GuiaProvedor
      webhookUrl={webhookUrl}
      provedorNome="Ticto"
      corPrimaria="#00B4D8"
      linkPainel={{
        label: 'Abrir painel da Ticto',
        href: 'https://app.ticto.com.br',
      }}
      passos={[
        {
          titulo: 'Acesse o painel da Ticto',
          descricao: 'Faça login em app.ticto.com.br como produtor.',
        },
        {
          titulo: 'Vá em "Ferramentas" → "Integrações" → "Webhooks"',
          descricao:
            'No menu principal, procure Ferramentas. Depois Integrações e então Webhooks.',
        },
        {
          titulo: 'Clique em "Novo Webhook"',
          descricao: 'Importante: use a versão 2.0 (recomendada pela Ticto).',
        },
        {
          titulo: 'Cole a URL e marque os eventos',
          descricao:
            'No campo URL, cole a URL acima. Depois marque os eventos conforme a lista abaixo. A Ticto tem muitos — marque os que fazem sentido pro seu fluxo.',
        },
        {
          titulo: 'Salvar',
          descricao:
            'Clique em "Salvar" e confira no console da Ticto se aparece "Webhook criado com sucesso".',
        },
      ]}
      eventosMarcar={[
        { label: 'Venda realizada', obrigatorio: true },
        { label: 'Venda recusada' },
        { label: 'Reembolso' },
        { label: 'Chargeback' },
        { label: 'Boleto impresso' },
        { label: 'Boleto atrasado' },
        { label: 'Pix gerado' },
        { label: 'Pix expirado' },
        { label: 'Abandono de carrinho' },
        { label: 'Assinatura cancelada' },
        { label: 'Assinatura atrasada' },
        { label: 'Assinatura extendida / retomada' },
        { label: 'Período de testes iniciado' },
        { label: 'Período de testes encerrado' },
      ]}
      observacao='A Ticto tem o webhook mais completo dos três (com dados de transação, afiliados, cupom, etc). Capturamos tudo que for útil automaticamente.'
    />
  )
}
