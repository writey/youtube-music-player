import React from 'react'
import { HeartOutlined, PlusSquareOutlined, SyncOutlined, FullscreenOutlined,
  FastBackwardFilled, FastForwardFilled, PlayCircleFilled, HeartFilled,
  PauseCircleFilled, SoundOutlined } from '@ant-design/icons'
import { Slider } from 'antd'
import { useEffect, useState, useRef } from 'react'
import PubSub from '@/common/pubsub'
import { convertoTime } from '@/utils'
import * as store from '@/utils/localStore'
import { useDispatch, useSelector } from 'react-redux'
import { onFavoriteWithSave } from '@/redux/userData'
import { setCurrent } from '@/redux/current'
import SavePopover from '@/components/SavePopover'

const defaultThumbnailPath = `${window.isDev ? '': '.'}/assets/thumbnail.jpg`
const Player = () => {
  const audioRef = useRef()
  const [volume, setVolume] = useState(store.get('volume') || 100)
  const [isPause, setIsPause] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const dispatch = useDispatch()
  const favorite = useSelector((state) => state.userData.favorite)
  const current = useSelector((state) => state.current)
  
  const onTimeUpdate = ({ target: { currentTime } }) => setCurrentTime(Math.floor(currentTime) * 1000)
  const onPlayStateChange = ({ target: { paused } }) => setIsPause(paused)
  const onPlayEnded = () => {
    PubSub.emit('playDone', current.videoId)
  }
  const startPlayMusic = (data) => {
    dispatch(setCurrent({ state: 'play' }))
    const blob = new Blob([data], { type: 'audio/*' })
    const blobUrl = URL.createObjectURL(blob);
    audioRef.current.src = blobUrl
    audioRef.current.play()
  }
  const changePlayState = () => {
    if (audioRef.current.paused) audioRef.current.play()
    else audioRef.current.pause()
  }
  const onPlay = (data) => {
    console.log(data)
    dispatch(setCurrent({ ...data, state: 'loading' }))
    window.API.send("play", data.videoId)
    audioRef.current.currentTime = 0
    audioRef.current.pause()
  }
  const onGetFile = (_, args) => {
    if (args.id !== current?.videoId) return
    setTimeout(() => {
      startPlayMusic(args.file)
    }, 1)
  }
  const onSetVolume = val => {
    audioRef.current.volume = parseFloat((val / 100))
    setVolume(val)
    store.set('volume', val)
  }
  useEffect(() => {
    window.API.on("file", onGetFile)
    PubSub.on('onPlay', onPlay)
    setVolume(store.get('volume') || 100)
    audioRef.current.addEventListener('timeupdate', onTimeUpdate)
    audioRef.current.addEventListener('play', onPlayStateChange)
    audioRef.current.addEventListener('pause', onPlayStateChange)
    audioRef.current.addEventListener('ended', onPlayEnded)
    return () => {
      PubSub.off('onPlay', onPlay)
      window.API.remove("file", onGetFile)
      audioRef.current.removeEventListener('timeupdate', onTimeUpdate)
      audioRef.current.removeEventListener('play', onPlayStateChange)
      audioRef.current.removeEventListener('pause', onPlayStateChange)
      audioRef.current.removeEventListener('ended', onPlayEnded)
    }
  }, [current])
  return (
    <div className={`flex justify-between px-3 py-3 mx-10 bg-white rounded-xl transition-all duration-500 ${current.videoId ? 'min-h-[100px]': ' translate-y-[200%] h-[0]'}`}>
      <div className='flex items-center justify-start mr-2'>
        <img
          className={`mr-2 transition-all h-14 rounded-xl ${current?.thumbnails? 'w-14': 'w-0'}`}
          onError={e => e.target.src = defaultThumbnailPath}
          src={`${(current?.thumbnails?.length && current?.thumbnails[0]?.url) || defaultThumbnailPath}`} />
        {/* <div>
          <div className='w-24 overflow-hidden whitespace-nowrap overflow-ellipsis'>
            { current?.name || '' }
          </div>
          <div className='w-24 overflow-hidden whitespace-nowrap overflow-ellipsis'>
            { current?.artist?.name || '' }
          </div>
        </div> */}
      </div>
      <div className='justify-between basis-full'>
        
      <div className='flex justify-between'>
        <div className='flex items-center flex-1 '>
          {
            favorite.find(i => i.videoId === current?.videoId) ? 
            <HeartFilled onClick={() => dispatch(onFavoriteWithSave({...current}))} className='p-1 ml-3 rounded-md cursor-pointer text-md bg-main' /> :
            <HeartOutlined onClick={() => dispatch(onFavoriteWithSave({...current}))} className='p-1 ml-3 rounded-md cursor-pointer text-md bg-main' />
          }
          <SavePopover song={current}>
            <PlusSquareOutlined className='p-1 ml-3 rounded-md cursor-pointer text-md bg-main'/>
          </SavePopover>
          
          {/* <FullscreenOutlined className='p-1 ml-3 rounded-md cursor-pointer text-md bg-main'/> */}
          {/* <SyncOutlined className='p-1 ml-3 rounded-md cursor-pointer text-md bg-main'/> */}
        </div>
        <div className='flex items-center justify-center flex-1'>
          <FastBackwardFilled className='mx-2 text-2xl cursor-pointer' />
          {
            isPause ? 
            <PlayCircleFilled onClick={() => changePlayState()} className='mx-2 text-4xl cursor-pointer'/> :
            <PauseCircleFilled onClick={() => changePlayState()} className='mx-2 text-4xl cursor-pointer'/>
          }
          <FastForwardFilled onClick={() => onPlayEnded()} className='mx-2 text-2xl cursor-pointer'/>
        </div>
        <div className='flex items-center justify-end flex-1'>
          <SoundOutlined />
          <Slider min={0} max={100} value={volume} defaultValue={100} onChange={onSetVolume} className='w-20 ml-4 custom-slider' />
        </div>
      </div>
      <div className="flex items-center mx-2 mt-2 ">
        <span>{convertoTime(currentTime)}</span>
        <Slider min={0} value={currentTime} max={current?.duration} step={100}
          tooltip={{ formatter: val => convertoTime(val) }}
          className='flex-1 w-20 mx-4 ml-4 custom-slider'
          onChange={val => audioRef.current.currentTime = (val / 1000)}
        />
        <span>{ current?.duration ? convertoTime(current?.duration): '00:00'}</span>
        <audio ref={audioRef} id="audioPlayer">
          <source type="audio/mp3" />
        </audio>
      </div>
      </div>
    </div>
  )
}
export default Player