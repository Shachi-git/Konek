'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from './button'
import { cn } from '@/lib/utils'

type SignInSignUpToggleProps = {
  mode: 'sign in' | 'sign up'
}

const SignInSignUpToggle: React.FC<SignInSignUpToggleProps> = ({ mode }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleToggle = (value: 'sign in' | 'sign up') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('mode', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col items-center mb-5 -mt-2">
      <div className="inline-flex border-b border-gray-600">
        {(['sign in', 'sign up'] as const).map((value, i) => (
          <Button
            key={value}
            variant="ghost"
            disabled={mode === value}
            onClick={() => handleToggle(value)}
            className={cn(
              'px-5 py-2 text-base font-semibold rounded-none bg-transparent hover:bg-transparent',
              mode === value
                ? 'border-b-2 border-white text-white cursor-default'
                : 'text-gray-400 hover:text-white cursor-pointer',
              'disabled:cursor-not-allowed',
              i !== 0 && 'ml-4',
            )}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SignInSignUpToggle
