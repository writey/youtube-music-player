import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Popover, Input, Button, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { onDeleteCreatePlayList } from '@/redux/userData'

const MyPlayList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const created = useSelector((state) => state.userData.playList?.created)
  return (
    <div>
      <h1 className='text-xl fond-bold'> {t('home.myList')}</h1>
      <ul>
        {
          created.map(i =>
          <li className='flex items-center justify-between py-2 m-6 my-2 px-2 rounded-lg transition-all hover:bg-[#eff0f9] hover:scale-105'
            onClick={() => navigate(`/createdPlayList/${i.id}`)} key={i.id}>
            {i.name}  { i.songs.length } { t('detail.songs') }
            <DeleteOutlined size='small' onClick={e => { e.stopPropagation(), dispatch(onDeleteCreatePlayList(i.id)) }} className=' text-[red] cursor-pointer' />
          </li>
        )}
      </ul>
      
      {/* <h1 className='my-2 text-xl fond-bold'> {t('home.savedPlayList')}</h1> */}
    </div>
  )
}

export default MyPlayList