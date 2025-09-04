'use client'
import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

const PostFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter') || 'all'

  const handleFilterChange = (value: 'all' | 'trends' | 'latest') => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', value)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="inline-flex rounded-md shadow-sm overflow-hidden">
      {(['all', 'trends', 'latest'] as const).map((value, i) => (
        <Button
          key={value}
          variant="ghost"
          disabled={filter === value}
          onClick={() => handleFilterChange(value)}
          className={cn(
            'px-7 rounded-none border border-blue-500',
            i === 0 && 'rounded-l-md',
            i === 2 && 'rounded-r-md -ml-px',
            filter === value
              ? 'bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white',
            'disabled:bg-blue-800 disabled:text-gray-200 disabled:cursor-not-allowed',
          )}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Button>
      ))}
    </div>
  )
}

export default PostFilter
