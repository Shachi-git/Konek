import { auth, signIn, signOut } from '@/auth'
import Link from 'next/link'
import React from 'react'

const Navbar = async () => {
  const session = await auth()
  return (
    <header>
      <nav className="bg-gradient-to-b from-gray-900 to-gray-950 p-7 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href={'/'}
            className="text-white font-extralight text-2xl font-serif italic"
          >
            Konek
          </Link>
          <div className="flex items-center gap-5">
            {session && session?.user ? (
              <>
                <Link href={'/startup/create'}>
                  <span className="text-white defaultfont cursor-pointer text-lg font-semibold">
                    Create
                  </span>
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await signOut()
                  }}
                >
                  <button className="text-white defaultfont cursor-pointer text-lg font-semibold">
                    Logout
                  </button>
                </form>
                <Link
                  href={'/user/${session?.id}'}
                  className="text-white defaultfont"
                >
                  <span className="text-white">{session.user?.name}</span>
                </Link>
              </>
            ) : (
              <form
                action={async () => {
                  'use server'
                  await signIn('github')
                }}
              >
                <button
                  type="submit"
                  className="text-white cursor-pointer text-lg font-semibold"
                >
                  Login
                </button>
              </form>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
