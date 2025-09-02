import { STARTUPS_BY_ID_QUERY } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import markdownit from 'markdown-it'
import View from '@/app/components/View'

export const experimental_ppr = true

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const md = markdownit()
  const post = await client.fetch(STARTUPS_BY_ID_QUERY, { id })

  if (!post) return notFound()

  const parsedContent = md.render(post?.pitch || '')

  return (
    <div>
      <section
        className="bg-linear-to-tr from-blue-500 to-gray-500 rounded-xl p-11 shadow-inner shadow-gray-950 flex flex-col items-center 
      opacity-90 justify-center"
      >
        <p className="semiheading">{formatDate(post._createdAt)}</p>
        <h1 className="heading mb-2">{post.title}</h1>
        <p className="semiheading text-center text-lg">
          {post.description || 'No description available for this startup.'}
        </p>
      </section>
      <section className="flex flex-col my-3 justify-center w-full startup-card shadow-inner shadow-gray-950 rounded-xl p-2">
        <div className="flex flex-col items-center">
          <div className="flex flex-col">
            <div className="flex items-center">
              <Image
                src={post.image}
                alt="thumbnail"
                width={500}
                height={500}
                className="rounded-lg drop-shadow-lg w-96 h-96 "
              />
            </div>
            <div className="space-y-2 mt-5 max-w-4xl flex flex-row items-center justify-between">
              <div className="flex flex-row justify-between items-center">
                <div>
                  <Link href={`/user/${post.author?._id}`}>
                    <Image
                      src={post.author.image}
                      alt="avatar"
                      width={64}
                      height={64}
                      className="rounded-full drop-shadow-lg"
                    />
                  </Link>
                </div>
                <div className="flex flex-col ml-2">
                  <p className="text-base font-medium text-white">
                    {post.author.name}
                  </p>

                  <p className="text-sm font-light text-white opacity-80">
                    @{post.author.username}
                  </p>
                </div>
              </div>
              <div className="flex items-end">
                <p className="startup-card_btn">{post.category}</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="resultheading mt-5 text-left">Pitch Details</h3>
        {parsedContent ? (
          <article
            className="mt-2 no-result"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        ) : (
          <p className="no-result">No details Provided</p>
        )}
      </section>
      <hr className="my-5" />
      <div
        className="flex justify-end my-6 mr-4 fixed"
        style={{ bottom: '0', right: '0', zIndex: 10 }}
      >
        <Suspense fallback={<p className="loading">Loading...</p>}>
          <View id={id} />
        </Suspense>
      </div>
    </div>
  )
}

export default page
