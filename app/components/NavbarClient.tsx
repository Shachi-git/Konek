'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const NavbarClient = () => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.id) {
        const result = await client.fetch(AUTHOR_BY_ID_QUERY, {
          id: session.user.id,
        })
        setUser(result)
      }
    }
    fetchUser()
  }, [session?.user?.id])

  const imageUrl = user?.image?.asset?._ref
    ? urlFor(user.image).width(120).height(120).url()
    : typeof session?.user?.image === 'string'
      ? session.user.image
      : 'https://placehold.co/120x120'

  return (
    <header>
      <nav className="bg-gradient-to-t from-gray-900 to-gray-950 min-h-[28px] shadow-xl shadow-gray-950">
        <div className="container px-10 flex justify-between items-center min-h-[80px]">
          <Link
            href="/"
            className="text-white font-extralight text-2xl font-serif italic"
          >
            Konek
          </Link>
          <div className="flex items-center gap-5">
            {status === 'authenticated' && session?.user ? (
              <>
                <Link
                  href="/startup/create"
                  className="text-white hover:text-gray-300 defaultfont cursor-pointer text-lg font-semibold"
                >
                  Create
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-white hover:text-gray-300 defaultfont cursor-pointer text-lg font-semibold"
                >
                  Logout
                </button>
                <Link
                  href={`/user/${session.user.id}`}
                  className="text-white defaultfont p-1 flex flex-row space-x-2 justify-center items-center rounded-md hover:bg-gray-600"
                >
                  <Image
                    src={imageUrl}
                    alt="profile"
                    width={34}
                    height={34}
                    className="rounded-full"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-white">{session.user?.name}</span>
                    <span className="text-gray-300 text-xs font-extralight">
                      @{user?.username}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-white hover:text-gray-300 cursor-pointer text-lg font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavbarClient
