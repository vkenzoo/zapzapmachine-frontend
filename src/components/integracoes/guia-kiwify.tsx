'use client'

import { GuiaProvedor } from './guia-provedor'

export const GuiaKiwify = ({ webhookUrl }: { webhookUrl: string }) => {
  return (
    <GuiaProvedor
      webhookUrl={webhookUrl}
      provedorNome="Kiwify"
      corPrimaria="#00C853"
      linkPainel={{
        label: 'Abrir painel da Kiwify',
        href: 'https://dashboard.kiwify.com.br',
      }}
      passos={[
        {
          titulo: 'Acesse o painel da Kiwify',
          descricao: 'Faça login em dashboard.kiwify.com.br',
        },
        {
          titulo: 'Abra o produto que quer integrar',
          descricao:
            'Menu lateral → "Meus Produtos" → clique no produto desejado.',
        },
        {
          titulo: 'Vá em "Apps" → "Webhooks"',
          descricao:
            'Nas abas do produto, clique em Apps, role e encontre Webhooks.',
        },
        {
          titulo: 'Clique em "Criar webhook"',
          descricao: 'Cole a URL acima no campo "URL do webhook".',
        },
        {
          titulo: 'Marque os eventos',
          descricao:
            'Selecione os eventos conforme a lista abaixo e clique em Salvar.',
        },
        {
          titulo: 'Teste (opcional mas recomendado)',
          descricao:
            'A Kiwify tem botão "Testar webhook" ao lado do cadastro — use pra validar antes de usar em produção.',
        },
      ]}
      eventosMarcar={[
        { label: 'Compra aprovada', obrigatorio: true },
        { label: 'Compra recusada' },
        { label: 'Compra reembolsada' },
        { label: 'Chargeback' },
        { label: 'Boleto gerado' },
        { label: 'Pix gerado' },
        { label: 'Carrinho abandonado' },
        { label: 'Assinatura cancelada' },
        { label: 'Assinatura atrasada' },
        { label: 'Assinatura renovada' },
      ]}
      observacao='Se tiver mais de um produto, você precisa configurar o webhook em cada produto separadamente. A Kiwify não tem webhook "global" por conta.'
    />
  )
}
