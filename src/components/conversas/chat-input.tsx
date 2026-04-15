'use client'

import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Sparkles, Paperclip, Mic, StopCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EnviarMidiaParams {
  tipoMidia: 'IMAGEM' | 'AUDIO' | 'VIDEO' | 'DOCUMENTO'
  base64: string
  mimetype: string
  fileName?: string
  legenda?: string
}

interface ChatInputProps {
  bloqueado: boolean
  onEnviar: (conteudo: string) => void
  onEnviarMidia?: (params: EnviarMidiaParams) => Promise<void>
}

const fileParaBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // remove prefixo "data:...;base64,"
      const base64 = result.split(',')[1] ?? ''
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const detectarTipoMidia = (
  mimetype: string
): EnviarMidiaParams['tipoMidia'] => {
  if (mimetype.startsWith('image/')) return 'IMAGEM'
  if (mimetype.startsWith('audio/')) return 'AUDIO'
  if (mimetype.startsWith('video/')) return 'VIDEO'
  return 'DOCUMENTO'
}

export const ChatInput = ({
  bloqueado,
  onEnviar,
  onEnviarMidia,
}: ChatInputProps) => {
  const [texto, setTexto] = useState('')
  const [enviandoMidia, setEnviandoMidia] = useState(false)
  const [preview, setPreview] = useState<{
    file: File
    previewUrl: string
    tipoMidia: EnviarMidiaParams['tipoMidia']
  } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gravacao de audio
  const [gravando, setGravando] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [texto])

  const handleEnviar = () => {
    if (!texto.trim() || bloqueado) return
    onEnviar(texto.trim())
    setTexto('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // reset pra permitir reselecionar mesmo arquivo
    if (!file) return

    // Limite 16MB (WhatsApp)
    if (file.size > 16 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Maximo: 16MB')
      return
    }

    const tipoMidia = detectarTipoMidia(file.type)
    const previewUrl = URL.createObjectURL(file)
    setPreview({ file, previewUrl, tipoMidia })
  }

  const handleCancelarPreview = () => {
    if (preview) URL.revokeObjectURL(preview.previewUrl)
    setPreview(null)
    setTexto('')
  }

  const handleConfirmarEnvioMidia = async () => {
    if (!preview || !onEnviarMidia) return
    setEnviandoMidia(true)
    try {
      const base64 = await fileParaBase64(preview.file)
      await onEnviarMidia({
        tipoMidia: preview.tipoMidia,
        base64,
        mimetype: preview.file.type,
        fileName: preview.file.name,
        legenda: texto.trim() || undefined,
      })
      URL.revokeObjectURL(preview.previewUrl)
      setPreview(null)
      setTexto('')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao enviar arquivo'
      )
    } finally {
      setEnviandoMidia(false)
    }
  }

  const iniciarGravacao = async () => {
    if (!onEnviarMidia) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        stream.getTracks().forEach((t) => t.stop())
        // Converte blob em base64 e envia
        try {
          setEnviandoMidia(true)
          const base64 = await fileParaBase64(
            new File([blob], 'audio.webm', { type: mimeType })
          )
          await onEnviarMidia({
            tipoMidia: 'AUDIO',
            base64,
            mimetype: mimeType,
            fileName: 'audio.webm',
          })
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : 'Erro ao enviar audio'
          )
        } finally {
          setEnviandoMidia(false)
        }
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setGravando(true)
    } catch (err) {
      toast.error(
        err instanceof Error
          ? `Microfone bloqueado: ${err.message}`
          : 'Nao foi possivel acessar o microfone'
      )
    }
  }

  const pararGravacao = () => {
    mediaRecorderRef.current?.stop()
    setGravando(false)
  }

  if (bloqueado) {
    return (
      <div className="border-t border-border/50 bg-card/80 frosted-glass p-4 shrink-0">
        <div className="flex items-center gap-2.5 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
          <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
          <p className="text-[13px] text-blue-700 dark:text-blue-400">
            O Agente IA está respondendo automaticamente. Alterne para <strong>Humano</strong> para assumir a conversa.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-border/50 bg-card/80 frosted-glass p-3 shrink-0">
      {/* Preview da midia antes de enviar */}
      {preview && (
        <div className="mb-3 relative inline-block">
          {preview.tipoMidia === 'IMAGEM' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.previewUrl}
              alt="Preview"
              className="max-h-[180px] rounded-lg"
            />
          )}
          {preview.tipoMidia === 'VIDEO' && (
            <video
              src={preview.previewUrl}
              className="max-h-[180px] rounded-lg"
              controls
            />
          )}
          {(preview.tipoMidia === 'AUDIO' ||
            preview.tipoMidia === 'DOCUMENTO') && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Paperclip className="h-4 w-4 shrink-0" />
              <span className="text-[13px] truncate max-w-[220px]">
                {preview.file.name}
              </span>
              <span className="text-[11px] text-muted-foreground shrink-0">
                ({Math.round(preview.file.size / 1024)}KB)
              </span>
            </div>
          )}
          <button
            onClick={handleCancelarPreview}
            disabled={enviandoMidia}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow flex items-center justify-center hover:bg-muted disabled:opacity-50"
            aria-label="Cancelar"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Indicador de gravacao */}
      {gravando && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-[13px] text-red-600 font-medium">
            Gravando audio...
          </span>
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleFileSelect}
        />

        {/* Botao anexo */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={enviandoMidia || gravando || !!preview}
          size="icon"
          variant="ghost"
          className="h-11 w-11 rounded-full shrink-0 hover:bg-muted"
          aria-label="Anexar arquivo"
        >
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (preview) {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleConfirmarEnvioMidia()
              }
            } else {
              handleKeyDown(e)
            }
          }}
          placeholder={
            preview
              ? 'Legenda (opcional)...'
              : gravando
                ? 'Gravando...'
                : 'Digite uma mensagem...'
          }
          rows={1}
          disabled={gravando}
          className="flex-1 min-h-[44px] max-h-[120px] rounded-2xl text-[14px] bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background resize-none py-3 px-4"
        />

        {/* Botao gravar/parar audio — so aparece quando nao tem preview */}
        {!preview && (
          <Button
            onClick={gravando ? pararGravacao : iniciarGravacao}
            disabled={enviandoMidia}
            size="icon"
            variant="ghost"
            className={cn(
              'h-11 w-11 rounded-full shrink-0',
              gravando
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'hover:bg-muted'
            )}
            aria-label={gravando ? 'Parar gravacao' : 'Gravar audio'}
          >
            {gravando ? (
              <StopCircle className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        )}

        {/* Botao enviar */}
        <Button
          onClick={preview ? handleConfirmarEnvioMidia : handleEnviar}
          disabled={
            enviandoMidia ||
            gravando ||
            (!preview && !texto.trim())
          }
          size="icon"
          className="h-11 w-11 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm shadow-emerald-500/20 shrink-0 disabled:opacity-50"
          aria-label="Enviar"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
        {preview
          ? 'Adicione uma legenda (opcional) e clique em enviar'
          : gravando
            ? 'Clique no botao vermelho para parar e enviar'
            : 'Enter para enviar · Shift+Enter para quebrar linha'}
      </p>
    </div>
  )
}
