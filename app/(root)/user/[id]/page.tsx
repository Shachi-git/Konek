import { StartupCardSkeleton } from '@/app/components/StartupCard'
import UserStartups from '@/app/components/UserStartups'
import { auth } from '@/auth'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

export const experimental_ppr = true

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const session = await auth()

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id })
  if (!user) notFound()
  const imageUrl =
    user?.image && user.image.asset?._ref
      ? urlFor(user.image).width(120).height(120).url()
      : typeof session?.user?.image === 'string'
        ? session.user.image
        : 'https://placehold.co/120x120'
  return (
    <div>
      <section
        className="bg-linear-to-tr from-blue-500 to-gray-500 rounded-xl p-11 shadow-inner shadow-gray-950 flex flex-col items-center 
      opacity-90 justify-center"
      >
        <div className="flex flex-col items-center">
          <Image
            src={imageUrl}
            alt="placeholder"
            width={120}
            height={120}
            className="rounded-full mb-4"
          />
          <h2 className="text-3xl font-bold mb-2 text-center text-white">
            {user?.name}
          </h2>
          <p className="text-base font-semibold text-white">
            @{user?.username}
          </p>
          <p className="text-lg text-white">{user?.bio}</p>
        </div>
      </section>
      <section className="m-2 resultheading">
        <p className="resultheading text-2xl mt-8">
          {session?.user?.id === user._id
            ? 'Your '
            : user?.name
              ? `${user.name}'s `
              : 'User'}
          Posts
        </p>
        <ul className="mt-7 card_grid">
          <Suspense fallback={<StartupCardSkeleton />}>
            <UserStartups id={id} />
          </Suspense>
        </ul>
      </section>
    </div>
  )
}

export default page
