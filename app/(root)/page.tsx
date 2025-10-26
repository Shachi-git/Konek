import SearchForm from '../components/SearchForm'
import StartupCard, {
  StartupCardSkeleton,
  StartupTypeCard,
} from '../components/StartupCard'
import { STARTUPS_QUERY } from '@/sanity/lib/queries'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { auth } from '@/auth'
import { Suspense } from 'react'
import PostFilter from '../components/ui/PostFilter'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string
    filter?: 'all' | 'trends' | 'latest'
  }>
}) {
  const { query, filter } = await searchParams
  const params = { search: query || null }
  const session = await auth()

  // Handle session state
  if (!session) {
    console.log('No active session')
  } else {
    console.log('User ID:', session.user?.id)
  }

  let posts
  try {
    const response = await sanityFetch({
      query: STARTUPS_QUERY,
      params,
      tags: ['post'], // Add cache tag
    })
    if (!response || !response.data) {
      throw new Error('No data received from Sanity')
    }
    posts = response.data
  } catch (error) {
    console.error('Error fetching posts:', error)
    posts = []
  }

  let filteredPosts = posts || []

  if (filter === 'trends') {
    filteredPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0))
  } else if (filter === 'latest') {
    filteredPosts = [...posts].sort(
      (a, b) =>
        new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime(),
    )
  }

  return (
    <div className="m-5 mx-2">
      <section
        className="bg-linear-to-tr from-blue-500 to-gray-500 rounded-xl p-11 shadow-inner shadow-gray-950 flex flex-col items-center 
      opacity-90 justify-center"
      >
        <h1 className="heading text-center text-shadow-xl">
          Connect with the latest trends
        </h1>
        <p className="semiheading text-center text-lg">
          see what people are posting, discover fresh perspectives, and share
          your own ideas with the community
        </p>
        <SearchForm query={query} />
      </section>

      <section className="m-2 resultheading">
        <div className="flex flex-col lg:flex-row md:flex-row justify-between items-center mt-6">
          <div>
            <p className="resultheading text-2xl">
              {query ? `Search results for "${query}"` : 'All Posts'}
            </p>
          </div>
          <PostFilter />
        </div>

        <ul className="mt-7 card_grid">
          {filteredPosts?.length > 0 ? (
            filteredPosts.map((post: StartupTypeCard) => (
              <Suspense fallback={<StartupCardSkeleton />} key={post?._id}>
                <StartupCard post={post} key={post?._id} />
              </Suspense>
            ))
          ) : (
            <p className="no-results">No Result Found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </div>
  )
}
