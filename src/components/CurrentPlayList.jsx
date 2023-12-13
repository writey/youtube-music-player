import React from 'react'
import PubSub from '@/common/pubsub'
import { useSelector } from 'react-redux'
import PlayList from '@/components/PlayList'
import { useEffect } from 'react'
import { useState } from 'react'

const CurrentPlayList = () => {
  const [playList, setPlayList] = useState([])
  const onSetPlayList = list => setPlayList(list)
  const onPlayDone = id => {
    if (!playList.length) return
    const currentNdx = playList.findIndex(i => i.videoId === id)
    const nextNdx = (currentNdx + 1) % playList.length
    PubSub.emit('onPlay', playList[nextNdx])
  }
  useEffect(() => {
    PubSub.on('setPlayList', onSetPlayList)
    PubSub.on('playDone', onPlayDone)
    return () => {
      PubSub.off('setPlayList', onSetPlayList)
      PubSub.off('playDone', onPlayDone)
    }
  })
  return (
    <div>
    </div>
  )
}

export default CurrentPlayList