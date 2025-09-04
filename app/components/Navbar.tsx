import { auth } from '@/auth'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import NavbarClient from './NavbarClient'

const Navbar = async () => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <NavbarClient />
    </SessionProvider>
  )
}

export default Navbar
