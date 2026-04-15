import type { ProvedorCheckout } from '@/types'
import { cn } from '@/lib/utils'

interface ProvedorLogoProps {
  provedor: ProvedorCheckout
  size?: number
  className?: string
}

const CONFIG: Record<
  ProvedorCheckout,
  { src: string; bg: string; padding: number }
> = {
  HOTMART: { src: '/logos/hotmart.png', bg: '#FFFFFF', padding: 4 },
  KIWIFY: { src: '/logos/kiwify.png', bg: '#FFFFFF', padding: 6 },
  TICTO: { src: '/logos/ticto.png', bg: '#000000', padding: 0 },
}

export const ProvedorLogo = ({ provedor, size = 40, className }: ProvedorLogoProps) => {
  const config = CONFIG[provedor]

  return (
    <div
      className={cn(
        'rounded-[12px] overflow-hidden shrink-0 shadow-sm flex items-center justify-center',
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: config.bg,
        padding: config.padding,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.src}
        alt={provedor}
        width={size - config.padding * 2}
        height={size - config.padding * 2}
        className="w-full h-full object-contain"
      />
    </div>
  )
}
