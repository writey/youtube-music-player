import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { PlusSquareOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import PlayList from '@/components/PlayList'
import { useTranslation } from 'react-i18next'

const Detail = () => {
  const { t } = useTranslation()
  const { type, browseId } = useParams()
  const [isLoading, setIsLoading ] = useState(true)
  const playListRef = useRef()
  const [detail, setDetail ] = useState({
    title: '',
    trackCount: 0,
    artist: [{ name: '' }],
    thumbnails: [{url: '/src/assets/thumbnail.jpg'}]
  })
  const settingMap = {
    'album': {
      list: 'tracks'
    },
    'single': {
      list: 'tracks'
    },
    'ep': {
      list: 'tracks'
    },
    'playlist': {
      list: 'content'
    }
  }
  const setting = settingMap[type.toLowerCase()]
  const onGetDetail = (_, args) => {
    setDetail(args)
    setIsLoading(false)
    setTimeout(() => {
      playListRef?.current.setData(args[setting.list])
    }, 1)
  }
  useEffect(() => {
    window.API.send(`detail`, { type, browseId })
    window.API.on('detail', onGetDetail)
    return () => window.API.remove('detail', onGetDetail)
  }, [])
  return (
    isLoading
    ? 
    <div className='flex items-center justify-center h-full '>
      <Spin />
    </div>
    :
    <div className='p-4'>
      <div className='flex'>
        <img src={detail.thumbnails.slice(-1)[0].url} className='w-40 mr-14 rounded-xl'/>
        <div className='flex flex-col justify-around'>
          <h1 className='text-2xl font-bold'>{detail.title}</h1>
          <p className=''>{ (detail?.artist?.length > 0 && detail?.artist[0].name) || detail.owner}</p>
          <p className=''>{detail.trackCount} {t('detail.songs')}</p>
          <div className='flex'>
            <button onClick={() => playListRef.current.startPlay()} className='px-6 py-2 mr-4 text-white transition-colors duration-300 bg-slate-800 hover:bg-gray-900 rounded-3xl'>
              <PlayCircleOutlined /> {t('detail.play')}
            </button>
            <button className='px-6 text-white transition-colors duration-300 bg-slate-800 hover:bg-gray-900 rounded-3xl'><PlusSquareOutlined /> {t('detail.saveToList')}</button>
          </div>
        </div>
      </div>
      <PlayList ref={playListRef} type='songOnlyName' />
    </div>
  
  )
}

export default Detail