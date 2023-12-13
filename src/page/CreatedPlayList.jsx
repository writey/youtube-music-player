import React from 'react'
import PlayList from '@/components/PlayList'
import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { onDeleteSavedSong } from '@/redux/userData'


const SavedPlayList = () => {
  const playListRef = useRef()
  const { id } = useParams()
  const dispatch = useDispatch()
  const playList = useSelector((state) => state.userData?.playList)
  const currentList = playList.created.find(i => i.id == id)
  const songs = currentList?.songs || []
  const onDelete = (row) => {
    if (!currentList.songs.find(i => i.videoId === row.videoId)) return
    dispatch(onDeleteSavedSong(id, row.videoId))
  }
  useEffect(() => {
    playListRef.current?.setData(songs)
  }, [playList])
  return (
    <div>
      <PlayList ref={playListRef} onDelete={onDelete} />
    </div>
  )
}

export default SavedPlayList