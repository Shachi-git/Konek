import React from 'react'
import Form from 'next/form'
import cn from 'classnames'
import { FaSearch } from 'react-icons/fa'
import SearchFormReset from './SearchFormReset'

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form
      action="/"
      scroll={false}
      className={cn(
        'search-form',
        'flex gap-4 mt-5 rounded-full',
        'focus-within:ring-2 focus-within:ring-gray-900 max-w-[100%]',
      )}
    >
      <FaSearch className="ml-2 h-5 w-5" />
      <input
        name="query"
        defaultValue={query}
        placeholder="Search..."
        className={cn(
          'p-3 flex-grow rounded-full text-base bg-blend-color focus:outline-none font-extralight',
          'w-full',
        )}
      />
      <div className="flex gap-2">{query && <SearchFormReset />}</div>
    </Form>
  )
}

export default SearchForm
