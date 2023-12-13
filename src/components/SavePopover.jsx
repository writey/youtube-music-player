import React, { useState } from 'react'
import { Popover, Input, Button, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { onCreatePlayList, onSaveToPlayList } from '@/redux/userData'
import { useEffect } from 'react'

const SavePopover = ({ children, song }) => {
  const [open, setOpen] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const created = useSelector((state) => state.userData.playList?.created)
  const [messageApi, contextHolder] = message.useMessage()

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen) setIsCreate(false)
  }
  const createPlayList = () => {
    if (!name) return
    dispatch(onCreatePlayList(name))
    setIsCreate(false)
    setName('')
  }
  const onSaveToList = (e, id) => {
    e.stopPropagation()
    if (created.find(i => i.id === id).songs.find(n => n.videoId === song.videoId)) return messageApi.info(t('music.existed'))
    dispatch(onSaveToPlayList(id, { ...song }))
    setOpen(false)
    messageApi.info(t('music.saveSuccess'))
  }

  return (
    <Popover
      overlayClassName="min-w-[10rem]"
      content={
        <div>
          <ul>
            {created.map(i => (<li onClick={e => onSaveToList(e, i.id)} key={i.id} className='p-1 pl-[.75rem] rounded-md hover:bg-[#eff0f9] transition-all duration-200'>{i.name}</li>))}
          </ul>
          {
            isCreate ?
            <div className='flex items-center'>
              <Input value={name} onChange={({ target: { value } }) => setName(value)} size='small' className='w-[5rem]' />
              <Button className='ml-2' size='small' onClick={createPlayList}>{ t('music.save') }</Button>
            </div> :
            <div className='flex items-center'>
              <a className='pl-[.75rem]' onClick={() => setIsCreate(true)}>{ t('music.createNew') }</a>
              <Button className='ml-2' size='small' onClick={() => setOpen(false)}>{ t('music.close') }</Button>
            </div>
          }
        </div>
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
      {contextHolder}
    </Popover>
  )
}

export default SavePopover