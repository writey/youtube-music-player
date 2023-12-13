import React from 'react'
import PlayList from '@/components/PlayList'
import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'


const Favorite = () => {
  const playListRef = useRef()
  const favorite = useSelector((state) => state.userData.favorite)
  useEffect(() => {
    playListRef.current?.setData(favorite)
  }, [favorite])
  return (
    <div>
      <PlayList ref={playListRef} />
    </div>
  )
}

export default Favorite