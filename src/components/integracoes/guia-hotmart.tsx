'use client'

import { GuiaProvedor } from './guia-provedor'

export const GuiaHotmart = ({ webhookUrl }: { webhookUrl: string }) => {
  return (
    <GuiaProvedor
      webhookUrl={webhookUrl}
      provedorNome="Hotmart"
      corPrimaria="#F04E23"
      linkPainel={{
        label: 'Abrir painel da Hotmart',
        href: 'https://app.hotmart.com/tools/webhook',
      }}
      passos={[
        {
          titulo: 'Acesse o painel da Hotmart',
          descricao:
            'Faça login em app.hotmart.com com a conta do produtor.',
        },
        {
          titulo: 'Vá em Ferramentas → Webhook (Postback 2.0)',
          descricao:
            'No menu lateral, procure "Ferramentas" e clique em "Webhook". Se aparecer "Postback", escolha a versão 2.0.',
        },
        {
          titulo: 'Clique em "+ Novo cadastro"',
          descricao: 'Dê um nome tipo "GA Sales Machine" e cole a URL acima.',
        },
        {
          titulo: 'Marque os eventos',
          descricao:
            'Ative as caixas conforme a lista abaixo. Quanto mais eventos, mais automações você pode criar.',
        },
        {
          titulo: 'Salvar',
          descricao:
            'Clique em "Cadastrar". A Hotmart vai testar o webhook automaticamente — se aparecer verde, está tudo certo.',
        },
      ]}
      eventosMarcar={[
        { label: 'Compra aprovada', obrigatorio: true },
        { label: 'Compra completada', obrigatorio: true },
        { label: 'Compra cancelada' },
        { label: 'Compra reembolsada' },
        { label: 'Compra expirada' },
        { label: 'Compra atrasada' },
        { label: 'Chargeback' },
        { label: 'Protesto' },
        { label: 'Boleto impresso' },
        { label: 'Cancelamento de assinatura' },
        { label: 'Abandono de carrinho' },
      ]}
      observacao='A Hotmart usa "Webhook 2.0" (antigo "Postback"). Se seu painel só mostra versão 1.0, peça pra ativar a 2.0 com o suporte.'
    />
  )
}
