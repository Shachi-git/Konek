'use client'

import Image from 'next/image'
import React, { useState, useRef, useActionState } from 'react'
import { signUpSchema } from '@/lib/validation'
import { createUser } from '@/lib/actions'
import { useRouter } from 'next/navigation'

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    password: '',
    repeatPassword: '',
    image: null as File | null,
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (prevState: any, formDataRaw: FormData) => {
    try {
      const formValues = {
        name: formDataRaw.get('name') as string,
        username: formDataRaw.get('username') as string,
        email: formDataRaw.get('email') as string,
        bio: formDataRaw.get('bio') as string,
        password: formDataRaw.get('password') as string,
        image:
          formDataRaw.get('image') instanceof File
            ? (formDataRaw.get('image') as File)
            : null,
      }
      await signUpSchema.parseAsync(formValues)

      const result = await createUser(prevState, formDataRaw)

      if (formData.password !== formData.repeatPassword) {
        return {
          status: 'ERROR',
          error: 'Passwords do not match',
        }
      }

      if (result.status === 'SUCCESS') {
        // Sign in the user after successful registration
        const response = await fetch('/api/auth/callback/credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formValues.username,
            password: formValues.password,
          }),
        })

        if (response.ok) {
          router.push('/') // Redirect to home page after successful sign in
        } else {
          router.push('/login') // Redirect to login if auto-sign-in fails
        }
      }

      return { status: 'SUCCESS', error: '' }
    } catch (err: any) {
      console.error(err)
      return { status: 'ERROR', error: err.message || 'Validation failed' }
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    error: '',
    status: 'INITIAL',
  })

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 max-w-md px-1  pb-5"
    >
      <div
        className="mx-auto mb-4 w-28 h-28 rounded-full overflow-hidden border-4 border-blue-600 cursor-pointer bg-gray-700 flex items-center justify-center"
        onClick={handleImageClick}
        aria-label="Upload profile image"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleImageClick()
          }
        }}
      >
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Profile preview"
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400 select-none text-center">
            Click to upload
          </span>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        name="image"
        onChange={handleImageChange}
        className="hidden"
      />

      <label htmlFor="name" className="font-semibold text-white">
        Full Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        required
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="username" className="font-semibold text-white">
        Username
      </label>
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Choose a username"
        value={formData.username}
        onChange={handleChange}
        required
        minLength={3}
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="email" className="font-semibold text-white">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="bio" className="font-semibold text-white">
        Bio
      </label>
      <textarea
        id="bio"
        name="bio"
        placeholder="Tell us about yourself"
        value={formData.bio}
        onChange={handleChange}
        rows={4}
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label htmlFor="password" className="font-semibold text-white">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Enter a secure password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={6}
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label htmlFor="repeatPassword" className="font-semibold text-white">
        Repeat Password
      </label>
      <input
        id="repeatPassword"
        name="repeatPassword"
        type="password"
        placeholder="Re-enter your password"
        value={formData.repeatPassword}
        onChange={handleChange}
        required
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {formData.repeatPassword &&
        formData.password !== formData.repeatPassword && (
          <p className="text-sm text-red-400 mt-1">Passwords do not match</p>
        )}

      <button
        type="submit"
        className="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded font-semibold text-white"
        disabled={isPending}
      >
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}

export default SignUpForm
