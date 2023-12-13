import React from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import Search from './Search/Search'
import { useNavigate } from 'react-router-dom'

const TopBar = () => {
  const navigate = useNavigate()
  return (
    <header className='flex items-center justify-between h-10 min-h-[2.5rem]'>
      <span className='flex justify-between w-16 mr-8 h-2/4'>
        <ArrowLeftIcon onClick={() => navigate(-1)} className='' />
        <ArrowRightIcon onClick={() => navigate(1)} className='' />
      </span>
      <Search />
    </header>
  )
}

export default TopBar