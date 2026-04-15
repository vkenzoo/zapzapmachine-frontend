export default function ConversasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="-mx-6 -my-8 h-[calc(100vh-3rem)] max-w-none">
      {children}
    </div>
  )
}
