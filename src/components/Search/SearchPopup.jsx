import React from 'react'
import { useEffect } from 'react'

const SearchPopup = ({data, popupVisible, innerRef, onClick}) => {
  useEffect(() => {}, [data])
  return (
    <ul ref={innerRef} className={`absolute z-50 w-full p-2 mt-2 list-none rounded-md bg-slate-200 top-full ${popupVisible ? '': 'hidden'}`} >
    {
      data.slice(0,5).map(i => 
        <li 
          onClick={() => {
            onClick(i.name+(Array.isArray(i.artist) ? i.artist.map(i => i.name).join(' ') : i.artist.name))
          }} 
          className='p-1 m-1 rounded-md cursor-pointer hover:bg-slate-100' 
          key={i.videoId}>
          {i.name} { Array.isArray(i.artist) ? i.artist.map(i => i.name).join(' ') : i.artist.name }
        </li>
      )
    }
    </ul>
  )
}

export default SearchPopup