import Navbar from '../components/Navbar'

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-full min-w-full main-bg bg-fixed">
      <Navbar />
      <div className="relative z-10 p-4 overflow-auto min-h-screen">
        {children}
      </div>
    </main>
  )
}
