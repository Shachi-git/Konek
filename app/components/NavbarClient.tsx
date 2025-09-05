'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { urlFor } from '@/sanity/lib/image'

interface Props {
  session: any
  user: {
    _id: string
    username?: string
    image?: {
      asset?: {
        _ref: string
      }
    }
  } | null
}

const NavbarClient = ({ session, user }: Props) => {
  const imageUrl = user?.image?.asset?._ref
    ? urlFor(user.image).width(120).height(120).url()
    : typeof session?.user?.image === 'string'
      ? session.user.image
      : 'https://placehold.co/120x120'

  return (
    <header>
      <nav className="bg-gradient-to-t from-gray-900 to-gray-950 min-h-[28px] shadow-xl shadow-gray-950">
        <div className="px-6 flex justify-between items-center min-h-[80px]">
          <Link
            href="/"
            className="text-white font-extralight text-2xl font-serif italic"
          >
            Konek
          </Link>
          <div className="flex items-center gap-5">
            {session?.user ? (
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
                  href={`/user/${session.user.id || user?._id}`}
                  className="text-white defaultfont p-1 flex flex-row space-x-2 justify-center items-center rounded-md hover:bg-gray-600"
                >
                  <Image
                    src={imageUrl}
                    alt="profile"
                    width={34}
                    height={34}
                    className="rounded-full"
                    priority
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-white">{session.user.name}</span>
                    <span className="text-gray-300 text-xs font-extralight">
                      @{user?.username || 'unknown'}
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
