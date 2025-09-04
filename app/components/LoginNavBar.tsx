import Link from 'next/link'
import React from 'react'

const LoginNavBar = async () => {
  return (
    <header className="w-full top-0 left-0 z-50">
      <nav className="bg-gradient-to-t from-gray-900 to-gray-950 min-h-[80px] shadow-xl shadow-gray-950 items-center flex">
        <div className="container mx-7 flex justify-between items-center h-full">
          <Link
            href="/"
            className="text-white font-extralight text-2xl font-serif italic "
          >
            Konek
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default LoginNavBar
