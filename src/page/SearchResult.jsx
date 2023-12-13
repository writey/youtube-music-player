import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import PlayList from '@/components/PlayList'
import { Tabs } from 'antd'
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'

const key = 'searchPage'
const SearchResult = () => {
  const { t } = useTranslation()
  const { keyword } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [activeKey, setActiveKey] = useState('song')
  const playListRef = useRef()
  const child = <PlayList type={activeKey} isLoading={isLoading} ref={playListRef} />
  const items = [
    {key: 'song', label: t('music.song'), children: child },
    {key: 'artist', label: t('music.artist'), children: child },
    {key: 'album', label: t('music.album'), children: child },
    {key: 'playList', label: t('music.playList'), children: child },
  ]
  const onChange = (item) => {
    playListRef?.current?.setData([])
    setActiveKey(item)
    setIsLoading(true)
    window.API.send('search', { keyword, type: item, key })
  }
  const onSearchRes = (_, { content }) => {
    playListRef.current.setData(content)
    console.log(content);
    setIsLoading(false)
  }
  
  useEffect(() => {
    window.API.send('search', { keyword, type: activeKey, key })
    setIsLoading(true)
    window.API.on(`search/${key}`, onSearchRes)
    return () => {
      window.API.remove(`search/${key}`)
    }
  }, [keyword, activeKey])
  return (
    <div className='flex flex-col '>
      <h1 className='text-lg '>{t('search')}: { keyword }</h1>
      <Tabs destroyInactiveTabPane={true} defaultActiveKey={activeKey} activeKey={activeKey} items={items} onChange={onChange} />
    </div>
  )
}

export default SearchResult