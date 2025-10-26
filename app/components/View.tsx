import React from 'react'
import Ping from './Ping'
import { STARTUP_VIEWS_QUERY } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id })

  await writeClient
    .patch(id)
    .set({ views: totalViews + 1 })
    .commit()

  return (
    <div className="bg-red-400 p-2 px-5 rounded-xl text-right relative  shadow-inner shadow-gray-950">
      <div className="absolute -top-1 -right-2">
        <Ping />
      </div>
      <p>
        <span className="text-white">
          {totalViews} {totalViews > 1 ? 'Views' : 'View'}
        </span>
      </p>
    </div>
  )
}

export default View
