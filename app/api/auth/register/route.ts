import { createUser } from '@/lib/actions'
import { signIn } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await createUser({}, formData)
    
    if (result.status === 'SUCCESS') {
      // Attempt to sign in the user automatically
      const username = formData.get('username')
      const password = formData.get('password')
      
      const signInResult = await signIn('credentials', {
        username,
        password,
        redirect: false
      })

      if (signInResult?.ok) {
        return NextResponse.json({ 
          success: true, 
          data: result,
          signedIn: true 
        })
      }

      return NextResponse.json({ 
        success: true, 
        data: result,
        signedIn: false
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}
