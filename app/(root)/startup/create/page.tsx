import StartupForm from '@/app/components/StartupForm'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const session = await auth()
  if (!session) redirect('/')

  return (
    <div className="min-h-full flex justify-center">
      <section className="w-full max-w-4xl startup-card rounded-2xl shadow-lg overflow-hidden">
        <StartupForm />
      </section>
    </div>
  )
}

export default page
