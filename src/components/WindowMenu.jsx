import React from 'react'
import { CloseOutlined, ExpandOutlined, LineOutlined, MenuFoldOutlined, MenuUnfoldOutlined, CompressOutlined } from '@ant-design/icons'
import * as store from '@/utils/localStore'
import { useEffect } from 'react'
import { useState } from 'react'
const WindowMenu = ({ reSetWidth }) => {
  const [isFold, setIsFold] = useState(store.get('isFold'))
  const [isMaximize, setIsMaximize] = useState(false)
  const onChangefold = () => {
    store.set('isFold', !isFold)
    setIsFold(!isFold)
    reSetWidth(!isFold)
  }
  useEffect(() => {
    reSetWidth(isFold)
  })
  return (
    <div className='flex items-center justify-between my-4' style={{ WebkitAppRegion: 'drag' }}>
      <div className='flex'>
        <div onClick={() => window.API.send('close')}
          className='cursor-pointer mr-1 group flex items-center justify-center p-[3px] bg-[#ee1702] rounded-full'>
          <CloseOutlined style={{ fontSize: '8px' }} className='text-white transition-opacity opacity-0 group-hover:opacity-100' />
        </div>
        {
          isMaximize ? 
          <div onClick={() => { window.API.send('unmaximize'), setIsMaximize(false) }}
            className='cursor-pointer mr-1 group flex items-center justify-center p-[3px] bg-[#ffb000] rounded-full'>
            <CompressOutlined style={{ fontSize: '8px' }} className='text-white transition-opacity opacity-0 group-hover:opacity-100' />
          </div>
          :
          <div onClick={() => { window.API.send('maximize'), setIsMaximize(true) }}
            className='cursor-pointer mr-1 group flex items-center justify-center p-[3px] bg-[#ffb000] rounded-full'>
            <ExpandOutlined style={{ fontSize: '8px' }} className='text-white transition-opacity opacity-0 group-hover:opacity-100' />
          </div>
        }
        <div onClick={() => window.API.send('minimize')}
          className='cursor-pointer mr-1 group flex items-center justify-center p-[3px] bg-[#009c00] rounded-full'>
          <LineOutlined style={{ fontSize: '8px' }} className='text-white transition-opacity opacity-0 group-hover:opacity-100' />
        </div>
      </div>
      {
        isFold ?
        <MenuUnfoldOutlined onClick={onChangefold} className='cursor-pointer ' /> :
        <MenuFoldOutlined onClick={onChangefold} className='cursor-pointer ' /> 
      }
    </div>
  )
}

export default WindowMenu