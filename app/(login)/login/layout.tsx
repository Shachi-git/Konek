import LoginNavBar from '@/app/components/LoginNavBar'
import { SessionProvider } from 'next-auth/react'

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen min-w-full main-bg bg-fixed flex flex-col">
      <LoginNavBar />
      <main className="flex flex-grow items-center justify-center p-4 relative z-10  inset-0 bg-black/45">
        <SessionProvider>{children}</SessionProvider>
      </main>
    </div>
  )
}
