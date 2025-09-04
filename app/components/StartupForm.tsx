'use client'
import React, { useActionState, useState } from 'react'
import { Input } from '@/components/ui/input'
import MDEditor from '@uiw/react-md-editor'
import { Button } from './ui/button'
import { formSchema } from '@/lib/validation'
import { z } from 'zod'
import router from 'next/router'
import { createPitch } from '@/lib/actions'

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pitch, setPitch] = useState('')

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        link: formData.get('link') as string,
        pitch,
      }

      await formSchema.parseAsync(formValues)

      const result = await createPitch(prevState, formData, pitch)

      if (result.status == 'SUCCESS') {
        router.push('/')
      }

      setPitch('')
      console.log(formValues)
      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        setErrors(fieldErrors as unknown as Record<string, string>)
        return { ...prevState, error: 'Validation failed', status: 'ERROR' }
      }
      return {
        ...prevState,
        error: 'An unexpected error has occured',
        status: 'ERROR',
      }
    }
  }
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL',
  })

  return (
    <form action={formAction} className="max-w-xl w-full mx-auto p-8 space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-white mb-2 text-sm md:text-base font-medium"
        >
          Title{' '}
          <span
            className="text-red-500 text-sm font-bold"
            aria-label="required"
          >
            *
          </span>
        </label>
        <Input
          id="title"
          name="title"
          className="w-full text-sm md:text-base rounded-md px-4 py-3 bg-white text-black placeholder-gray-500"
          required
          placeholder="Start-up title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-white mb-2 text-sm md:text-base font-medium"
        >
          Description{' '}
          <span
            className="text-red-500 text-sm font-bold"
            aria-label="required"
          >
            *
          </span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="w-full text-sm md:text-base rounded-md px-4 py-2 bg-white text-black placeholder-gray-500 resize-vertical"
          placeholder="Describe your startup..."
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-white mb-2 text-sm md:text-base font-medium"
        >
          Category{' '}
          <span
            className="text-red-500 text-sm font-bold"
            aria-label="required"
          >
            *
          </span>
        </label>
        <Input
          id="category"
          name="category"
          className="w-full text-sm md:text-base rounded-md px-4 bg-white text-black placeholder-gray-500 resize-vertical"
          placeholder="Enter category"
          required
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-400">{errors.category}</p>
        )}
      </div>

      {/* Image */}
      <div>
        <label
          htmlFor="link"
          className="block text-white mb-2 text-sm md:text-base font-medium"
        >
          Image link{' '}
          <span
            className="text-red-500 text-sm font-bold"
            aria-label="required"
          >
            *
          </span>
        </label>
        <input
          id="link"
          name="link"
          className="w-full text-sm md:text-base rounded-md px-4 py-2 bg-white text-black"
          required
          placeholder="Enter image link"
        />
        {errors.link && (
          <p className="mt-1 text-sm text-red-400">{errors.link}</p>
        )}
      </div>
      <div data-color-mode="light">
        <label
          htmlFor="pitch"
          className="block text-white mb-2 text-sm md:text-base font-medium"
        >
          Pitch{' '}
          <span
            className="text-red-500 text-sm font-bold"
            aria-label="required"
          >
            *
          </span>
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          preview="edit"
          height={300}
          style={{ borderRadius: 10, overflow: 'hidden' }}
          textareaProps={{
            id: 'pitch',
            placeholder:
              'Briefly describe your idea and what problem it solves.',
          }}
          previewOptions={{
            disallowedElements: ['style'],
          }}
        />
        {errors.pitch && (
          <p className="mt-1 text-sm text-red-400">{errors.pitch}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full py-3 rounded-full 
           bg-gradient-to-r bg-blue-900 hover:bg-blue-950 text-white shadow-md
           transition-all duration-300"
        disabled={isPending}
      >
        {isPending ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}

export default StartupForm
