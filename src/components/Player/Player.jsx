import React from 'react'
import { HeartOutlined, PlusSquareOutlined, SyncOutlined, FullscreenOutlined, SwitcherOutlined,
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
  const [isShowMiniWindow, setIsShowMiniWindow] = useState(false)
  const dispatch = useDispatch()
  const favorite = useSelector((state) => state.userData.favorite)
  const current = useSelector((state) => state.current)
  const coverImg = (current?.thumbnails?.length && current?.thumbnails.slice(-1)[0]?.url) || defaultThumbnailPath
  
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
  const onMiniWindowTigger = (isShow) => {
    setIsShowMiniWindow(isShow)
    window.API.send('tigger-mini-window', isShow)
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
    <>
      <audio ref={audioRef} id="audioPlayer">
        <source type="audio/mp3" />
      </audio>
    {
      isShowMiniWindow ?
      <div style={{ WebkitAppRegion: 'drag', width: 'calc(100% - 8px)', height: 'calc(100% - 8px)', backgroundImage: `url(${coverImg})` }}
        className='fixed -translate-x-1/2 -translate-y-1/2 top-1/2 bg-main left-1/2 rounded-[10px] bg-no-repeat group bg-cover overflow-hidden'>
          
        <div className='flex items-center justify-center h-full text-2xl text-center group-hover:hidden group'>{ current.name }</div>
        <div style={{ WebkitAppRegion: 'drag', background: 'rgba(0, 0, 0, .5)' }} className='flex flex-col justify-between w-full h-full py-4 opacity-0 hover:opacity-100 group-hover:opacity-100'>
          <div style={{ WebkitAppRegion: 'drag' }} className='text-2xl text-center'>{ current.name }</div>
          <div className='flex flex-row items-center justify-center basis-full'>
            <FastBackwardFilled className='mx-2 text-4xl cursor-pointer' />
              {
                isPause ? 
                <PlayCircleFilled onClick={() => changePlayState()} className='mx-2 text-5xl cursor-pointer'/> :
                <PauseCircleFilled onClick={() => changePlayState()} className='mx-2 text-5xl cursor-pointer'/>
              }
            <FastForwardFilled onClick={() => onPlayEnded()} className='mx-2 text-4xl cursor-pointer'/>
          </div>
          <div className="flex items-center px-2 ">
            <FullscreenOutlined onClick={() => onMiniWindowTigger(false)} className='mr-1 cursor-pointer' />
            <span>{convertoTime(currentTime)}</span>
            <Slider min={0} value={currentTime} max={current?.duration} step={100}
              tooltip={{ formatter: val => convertoTime(val) }}
              className='flex-1 w-20 mx-4 ml-4 custom-slider'
              onChange={val => {setCurrentTime(val), audioRef.current.currentTime = (val / 1000)}}
            />
            <span>{ current?.duration ? convertoTime(current?.duration): '00:00'}</span>
          </div>
        </div>
      </div>
    :
      <div className={`flex justify-between px-3 py-3 mx-10 bg-white rounded-xl transition-all duration-500 ${current.videoId ? 'min-h-[100px]': ' translate-y-[200%] h-[0]'}`}>
        <div className='flex items-center justify-start mr-2'>
          <img
            className={`mr-2 transition-all h-14 rounded-xl ${current?.thumbnails? 'w-14': 'w-0'}`}
            onError={e => e.target.src = defaultThumbnailPath}
            src={`${(current?.thumbnails?.length && current?.thumbnails[0]?.url) || defaultThumbnailPath}`} />
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
            <SwitcherOutlined onClick={() => onMiniWindowTigger(true)} className='p-1 ml-3 rounded-md cursor-pointer text-md bg-main' />
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
            onChange={val => {setCurrentTime(val), audioRef.current.currentTime = (val / 1000)}}
          />
          <span>{ current?.duration ? convertoTime(current?.duration): '00:00'}</span>
        </div>
        </div>
      </div>
    }
    </>
  )
}
export default Player