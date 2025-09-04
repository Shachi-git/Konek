import { auth, signOut } from '@/auth'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const Navbar = async () => {
  const session = await auth()
  const id = session?.user?.id as string

  const user = id ? await client.fetch(AUTHOR_BY_ID_QUERY, { id }) : null

  console.log(session)
  console.log('this is username: ' + user?.username)
  const imageUrl =
    user?.image && user.image.asset?._ref
      ? urlFor(user.image).width(120).height(120).url()
      : typeof session?.user?.image === 'string'
        ? session.user.image
        : 'https://placehold.co/120x120'
  return (
    <header>
      <nav className="bg-gradient-to-t from-gray-900 to-gray-950 min-h-[28px] shadow-xl shadow-gray-950">
        <div className="container mx-auto flex justify-between items-center min-h-[80px]">
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
                  href={`/user/${user?._id}`}
                  className="text-white defaultfont p-1 flex flex-row space-x-2 justify-center items-center rounded-md hover:bg-gray-600"
                >
                  <Image
                    src={imageUrl}
                    alt="placeholder"
                    width={34}
                    height={34}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-white">{session.user?.name}</span>
                    <span className="text-gray-300 text-xs font-extralight">
                      @{user?.username}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <Link
                href={`/login`}
                className="text-white cursor-pointer text-lg font-semibold"
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

export default Navbar
