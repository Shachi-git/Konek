import Navbar from '../components/Navbar'
import { SessionProvider } from 'next-auth/react'

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-full min-w-full main-bg bg-fixed">
      <Navbar />
      <div className="relative z-10 p-4 overflow-auto min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </div>
    </main>
  )
}
