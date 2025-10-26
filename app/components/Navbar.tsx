// components/Navbar.tsx
import NavbarClient from './NavbarClient'
import { auth } from '@/auth'
import { client } from '@/sanity/lib/client'
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries'

const Navbar = async () => {
  const session = await auth()

  let user = null
  if (session?.user?.id) {
    user = await client.fetch(AUTHOR_BY_ID_QUERY, { id: session.user.id })
  }

  return <NavbarClient session={session} user={user} />
}

export default Navbar
