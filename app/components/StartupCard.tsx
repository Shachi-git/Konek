import { cn, formatDate } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { FaEye } from 'react-icons/fa'
import Image from 'next/image'
import { Button } from './ui/button'
import { Startup, Author } from '@/sanity/types'
import { Skeleton } from '@/components/ui/skeleton'

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'
    }
    return text
  }
  return (
    <li className="startup-card flex-col mb-5  shadow-inner shadow-gray-950">
      <div className="flex items-center justify-between">
        <p className="startup-card_date mr-4">{formatDate(post._createdAt)}</p>
        <div className="flex items-center gap-1">
          <FaEye className="h-4 w-4 text-white" />
          <span className="text-base font-medium">{post.views}</span>
        </div>
      </div>
      <div className="flex mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-base font-medium">{author?.name}</p>
          </Link>
          <Link href={`/user/${_id}`}>
            <h3 className="text-2xl font-bold">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <Image
            src={author?.image || 'https://placehold.co/48x48'}
            alt="placeholder"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>
      <Link href={`/user/${_id}`}>
        <div className="">
          <p className="startup-card_desc line-clamp-3">
            {truncateText(description, 145)}
          </p>
        </div>
        <div className="flex-shrink-0 h-40 mt-4">
          {image && (
            <Image
              src={image}
              alt={title || 'Startup image'}
              width={600}
              height={160}
              className="startup-card_img"
            />
          )}
        </div>
      </Link>
      <div className="flex gap-3 mt-5 justify-between items-center">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-base font-semibold">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
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
