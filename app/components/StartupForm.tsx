'use client'
import React, { useActionState, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from './ui/button'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createPitch } from '@/lib/actions'

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  link: z.string().url('Must be a valid URL'),
})

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      setIsSubmitting(true)
      const formValues = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        link: formData.get('link') as string,
      }

      await formSchema.parseAsync(formValues)
      const result = await createPitch(
        prevState,
        formData,
        formValues.description,
      )

      if (result.status === 'SUCCESS') {
        router.push(`/startup/${result._id}`)
      }

      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        setErrors(fieldErrors as unknown as Record<string, string>)
        return { ...prevState, error: 'Validation failed', status: 'ERROR' }
      }
      return {
        ...prevState,
        error: 'An unexpected error has occurred',
        status: 'ERROR',
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL',
  })

  return (
    <form action={formAction} className="w-full max-w-2xl mx-auto px-4">
      <div className="space-y-8 bg-white/5 backdrop-blur-lg rounded-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create a Post</h1>
          <p className="text-gray-300">
            Share your thoughts with the community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="title" className="block text-white font-medium">
              Post Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="title"
              name="title"
              className="w-full bg-white/10 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Give your post a title"
              required
            />
            {errors.title && (
              <p className="text-sm text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-white font-medium">
              Category
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="category"
              name="category"
              className="w-full bg-white/10 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a category"
              required
            />
            {errors.category && (
              <p className="text-sm text-red-400 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Image Link */}
          <div className="space-y-2">
            <label htmlFor="link" className="block text-white font-medium">
              Cover Image URL
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="link"
              name="link"
              type="url"
              className="w-full bg-white/10 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/your-image.jpg"
              required
            />
            {errors.link && (
              <p className="text-sm text-red-400 mt-1">{errors.link}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="description"
              className="block text-white font-medium"
            >
              Content
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              className="w-full rounded-lg bg-white/10 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-3"
              placeholder="Write your post content here..."
              required
            />
            {errors.description && (
              <p className="text-sm text-red-400 mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-4 mt-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg font-semibold text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
          disabled={isPending || isSubmitting}
        >
          {isPending || isSubmitting ? 'Publishing...' : '✍️ Publish Post'}
        </Button>
      </div>
    </form>
  )
}

export default StartupForm
