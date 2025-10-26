import { cn, formatDate } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { FaEye } from 'react-icons/fa'
import Image from 'next/image'
import { Button } from './ui/button'
import { Startup, Author } from '@/sanity/types'
import { Skeleton } from '@/components/ui/skeleton'
import { urlFor } from '@/sanity/lib/image'

export type StartupTypeCard = Omit<Startup, 'author'> & { author?: Author }
const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description = '',
  } = post || {}

  const imageUrl = author?.image
    ? urlFor(author.image).width(120).height(120).url()
    : 'https://placehold.co/120x120'

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'
    }
    return text
  }
  return (
    <li className="startup-card">
      {/* Author info and title */}
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-gray-400">
            <p className="startup-card_date">{formatDate(_createdAt)}</p>
            <div className="flex items-center gap-1.5">
              <FaEye className="h-3.5 w-3.5" />
              <span className="text-sm">{views}</span>
            </div>
          </div>
          <div className="flex-row flex justify-between">
            <div className="space-y-2 flex-col">
              <Link href={`/user/${author?._id}`}>
                <p className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  {author?.name}
                </p>
              </Link>
              <Link href={`/posts/${_id}`}>
                <h3 className="text-xl font-bold text-white hover:text-gray-200 transition-colors leading-tight">
                  {title}
                </h3>
              </Link>
            </div>
            <div className="flex">
              <Link href={`/user/${author?._id}`} className="flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={author?.name || "Author's avatar"}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-blue-500/20"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <Link href={`/posts/${_id}`} className="group block">
        {image && (
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={title || 'Post image'}
              width={600}
              height={300}
              className="startup-card_img group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <p className="startup-card_desc mt-3 line-clamp-2">
          {truncateText(description, 120)}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <Link href={`/?category=${category?.toLowerCase()}`}>
          <span className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
            #{category}
          </span>
        </Link>
        <Button className="startup-card_btn text-white" asChild>
          <Link href={`/startup/${_id}`}>Read More</Link>
        </Button>
      </div>
    </li>
  )
}

export default StartupCard

export const StartupCardSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i: number) => (
        <li key={cn('skeleton', i)}>
          <Skeleton className="startup-card opacity-70 animate-pulse flex-col mb-5 shadow-inner shadow-gray-950" />
        </li>
      ))}
    </>
  )
}
