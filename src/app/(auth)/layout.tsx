export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/[0.04] blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[60%] h-[60%] rounded-full bg-purple-500/[0.03] blur-3xl" />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
