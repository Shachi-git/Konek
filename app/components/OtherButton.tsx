'use client'

import { signIn } from 'next-auth/react'
import React from 'react'
import { AiFillGithub, AiFillGoogleCircle } from 'react-icons/ai'

const OtherButton = () => {
  return (
    <div className="flex justify-center gap-4">
      <button
        type="button"
        onClick={() => signIn('google')}
        className="p-2 rounded-full"
      >
        <AiFillGoogleCircle className="text-5xl transition-transform duration-200 hover:scale-110 hover:shadow-white hover:shadow rounded-full" />
      </button>

      <button
        onClick={() => signIn('github', { callbackUrl: '/' })}
        type="button"
        className="p-2 rounded-full"
      >
        <AiFillGithub className="text-5xl transition-transform duration-200 hover:scale-110 hover:shadow-white hover:shadow rounded-full" />
      </button>
    </div>
  )
}

export default OtherButton
