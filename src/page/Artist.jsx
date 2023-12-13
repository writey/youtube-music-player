import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { PlusSquareOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import PlayList from '@/components/PlayList'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Artist = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { browseId } = useParams()
  const [isLoading, setIsLoading ] = useState(true)
  const playListRef = useRef()
  const albumPlayListRef = useRef()
  const [detail, setDetail ] = useState({
    title: '',
    trackCount: 0,
    artist: [{ name: '' }],
    thumbnails: [{url: '/src/assets/thumbnail.jpg'}]
  })
  const onGetDetail = (_, args) => {
    console.log(args)
    setDetail(args)
    setIsLoading(false)
    setTimeout(() => {
      playListRef.current.setData(args.products.songs.content)
      albumPlayListRef.current.setData(args.products.albums.content)
    }, 1)
  }
  useEffect(() => {
    console.log({ browseId })
    window.API.send(`detail`, { type: 'artist', browseId })
    
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
          <h1 className='text-2xl font-bold'>{detail.name}</h1>
          <p className='overflow-hidden text-ellipsis line-clamp-3'>{ detail.description }</p>
        </div>
      </div>
      <div className='flex justify-between mt-4 '>
        <h1 className='text-lg font-bold'>{t('detail.song')}</h1>
        <span onClick={() => navigate(`/Detail/playlist/${detail.products.songs.browseId}`)} className='cursor-pointer '> {t('detail.more')} {'>󠀾󠀾󠀾'}</span>
      </div>
      <PlayList ref={playListRef} type='songOnlyName' />
      <div className='flex justify-between mt-4 '>
        <h1 className='text-lg font-bold'>{t('detail.album')}</h1>
        {/* { detail.products.albums.browseId && <span onClick={() => navigate(`/Detail/playlist/${detail.products.albums.browseId}`)} className='cursor-pointer '> 更多 {'>󠀾󠀾󠀾'}</span> } */}
      </div>
      <PlayList ref={albumPlayListRef} type='album' />
      
    </div>
  )
}

export default Artist