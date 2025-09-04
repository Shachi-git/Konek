import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { client } from "./sanity/lib/client"
import { writeClient } from "./sanity/lib/write-client"
import { AUTHOR_BY_GITHUB_ID_QUERY, AUTHOR_BY_IDENTIFIER_QUERY } from "./sanity/lib/queries"
import type { Session } from 'next-auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const identifier = credentials.username
        const password = credentials.password

        // Fetch user from Sanity by username or email
        const user = await client.fetch(AUTHOR_BY_IDENTIFIER_QUERY, { identifier })

        if (!user || !user.password) return null
        if (typeof password !== "string" || typeof user.password !== "string") return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

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
  callbacks: {
    async signIn({ user, profile, account }) {
      // For GitHub OAuth
      if (account?.provider === "github" && profile) {
        const { id, login, bio } = profile as { id: string; login: string; bio?: string }

        // Check if user exists in Sanity
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id })

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id,
            name: user.name,
            username: login,
            email: user.email,
            image: user.image || null,
            bio: bio || "",
          })
        }
      }
      // For Credentials provider, user is already fetched in authorize(), so no need to create

      return true
    },

    async jwt({ token, user, account, profile }) {
      // On sign in (either provider), fetch Sanity user _id and assign to token.id

      // If user object is present (initial sign in)
      if (user) {
        // If GitHub OAuth, user.id is GitHub ID, so fetch Sanity _id
        if (account?.provider === "github" && profile) {
          const sanityUser = await client
            .withConfig({ useCdn: false })
            .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id })
          token.id = sanityUser?._id || null
        } else {
          // For Credentials login, user.id is already Sanity _id
          token.id = user.id
        }
      }

      return token
    },

async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: typeof token.id === 'string' ? token.id : undefined
        },
      }
    },
  },
})