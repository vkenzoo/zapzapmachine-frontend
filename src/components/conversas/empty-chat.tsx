import { MessageSquare } from 'lucide-react'

export const EmptyChat = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-muted/20">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-b from-blue-500/10 to-blue-500/5 flex items-center justify-center mb-5">
        <MessageSquare className="h-7 w-7 text-blue-600" strokeWidth={1.5} />
      </div>
      <h2 className="text-[17px] font-semibold tracking-[-0.01em] mb-1">
        Selecione uma conversa
      </h2>
      <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
        Escolha uma conversa da lista para ver as mensagens e responder
      </p>
    </div>
  )
}
