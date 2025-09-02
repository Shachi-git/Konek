import SearchForm from '../components/SearchForm'
import StartupCard, { StartupTypeCard } from '../components/StartupCard'
import { STARTUPS_QUERY } from '@/sanity/lib/queries'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { auth } from '@/auth'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const query = (await searchParams).query
  const params = { search: query || null }
  const session = await auth()

  console.log('Session:', session?.id)

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params })

  return (
    <div className="m-5 mx-2">
      <section
        className="bg-linear-to-tr from-blue-500 to-gray-500 rounded-xl p-11 shadow-inner shadow-gray-950 flex flex-col items-center 
      opacity-90 justify-center"
      >
        <h1 className="heading text-center text-shadow-xl">
          Pitch your startup, connect with entrepreneurs
        </h1>
        <p className="semiheading text-center text-lg">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="m-2 resultheading">
        <p className="resultheading text-2xl">
          {query ? `Search results for "${query}"` : 'All Startups'}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard post={post} key={post?._id} />
            ))
          ) : (
            <p className="no-results">No Startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </div>
  )
}
