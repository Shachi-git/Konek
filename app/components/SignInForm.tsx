'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const SignInForm = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      username: usernameOrEmail,
      password,
    })

    if (result?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/')
      console.log('SignIn result:', result)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="username" className="font-semibold">
        Username or Email
      </label>
      <input
        id="username"
        type="text"
        placeholder="Enter your username or email"
        value={usernameOrEmail}
        onChange={(e) => setUsernameOrEmail(e.target.value)}
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <label htmlFor="password" className="font-semibold">
        Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded font-semibold mt-2"
      >
        Login
      </button>
    </form>
  )
}

export default SignInForm
