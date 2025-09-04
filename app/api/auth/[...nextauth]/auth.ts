import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { client } from "@/sanity/lib/client"
import { AUTHOR_BY_IDENTIFIER_QUERY } from "@/sanity/lib/queries"

export const { auth, handlers } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const identifier = credentials.username

        // Fetch user from Sanity by username or email
        const user = await client.fetch(AUTHOR_BY_IDENTIFIER_QUERY, { identifier })

        if (!user) return null

        // Return minimal user info for token
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image?.asset?.url || null,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
      }
      return session
    },
  }
})
