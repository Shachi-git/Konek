'use client'
import Link from 'next/link'
import React from 'react'
import { FaRegTimesCircle } from 'react-icons/fa'

const SearchFormReset = () => {
  const reset = () => {
    const form = document.querySelector('.search-form') as HTMLFormElement

    if (form) form.reset()
  }
  return (
    <button
      type="reset"
      onClick={reset}
      className="flex items-center p-0 bg-transparent border-0"
    >
      <Link href={'/'}>
        <FaRegTimesCircle className="h-6 w-12" />
      </Link>
    </button>
  )
}

export default SearchFormReset
