import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'RoboVendas',
  description: 'Agentes de IA que vendem no WhatsApp automaticamente',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </AuthProvider>
          <Toaster
            richColors
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '14px',
                fontSize: '13px',
                padding: '12px 16px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
