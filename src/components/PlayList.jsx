import React from 'react'
import { Table } from 'antd'
import { convertoTime } from '@/utils'
import { useEffect, forwardRef, useImperativeHandle } from 'react'
import PubSub from '@/common/pubsub'
import { useState } from 'react'
import { LoadingOutlined, SoundOutlined, HeartOutlined, PlusSquareOutlined, HeartFilled, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { onFavoriteWithSave } from '@/redux/userData'
import { setCurrent } from '@/redux/current'
import SavePopover from '@/components/SavePopover'

const defaultThumbnailPath = `${window.isDev ? '': '.'}/assets/thumbnail.jpg`
const PlayList = forwardRef(({ isLoading = false, type = 'song', onDelete = null }, ref) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState([])
  const dispatch = useDispatch()
  const favorite = useSelector((state) => state.userData.favorite)
  const current = useSelector((state) => state.current)

  useImperativeHandle(ref, () => ({
    setData: data => {
      setDataSource(data)
    },
    startPlay: () => {
      if (!dataSource.length) return
      onSongRowClick(dataSource[0])
    }
  }))
  const onSongRowClick = (row) => {
    if (current.videoId === row.videoId && current.state === 'loading') return
    PubSub.emit('onPlay', row)
    PubSub.emit('setPlayList', dataSource)
    dispatch(setCurrent(row))
  }
  const toDetailPage = ({ type, browseId }) => {
    navigate(`/Detail/${type}/${browseId}`)
  }
  const toArtistPage = ({browseId}) => {
    navigate(`/Artist/${browseId}`)
  }
  const onFavoriteClick = (e, row) => {
    e.stopPropagation()
    dispatch(onFavoriteWithSave(row))
  }
  const onDownloadClick = (e, row) => {
    e.stopPropagation()
    window.API.send('download', { name: `${row.name} - ${Array.isArray(row.artist) ? row.artist.map(i => i.name).join(' ') : row.artist.name}`, id: row.videoId })
  }
  const optionCol = {
    title: '',
    dataIndex: 'videoId',
    key: 'videoId',
    width: onDelete ? 120 : 90,
    onCell: () => ({className: 'rounded-tr-xl rounded-br-xl'}),
    render: (_, row) => {
      return (<span>
        {
          favorite.find(i => i.videoId === row.videoId) ? 
          <HeartFilled onClick={(e) => onFavoriteClick(e, row)} className='p-1 mr-1 rounded-md cursor-pointer text-md bg-main' /> : 
          <HeartOutlined onClick={(e) => onFavoriteClick(e, row)} className='p-1 mr-1 rounded-md cursor-pointer text-md bg-main' />
        }
        <span onClick={e => e.stopPropagation()}>
          <SavePopover song={row}>
            <PlusSquareOutlined  className='p-1 mr-1 rounded-md cursor-pointer text-md bg-main'/>
          </SavePopover>
        </span>
        <DownloadOutlined onClick={ e => onDownloadClick(e, row) } className='p-1 rounded-md cursor-pointer text-md bg-main' />
        {
          onDelete ? <DeleteOutlined onClick={e => { e.stopPropagation(), onDelete(row) }} className='p-1 rounded-md cursor-pointer text-md bg-main text-[red]' /> : <></>
        }
      </span>)
    }
  }
  const list = [
    {
      type: 'song',
      rowKey: 'videoId',
      onRowClick: onSongRowClick,
      size: 'small',
      showHeader: true,
      columns: [
      {
        title: '',
        dataIndex: '',
        key: 'isPlay',
        width: 40,
        onCell: () => ({className: 'rounded-tl-xl rounded-bl-xl'}),
        render: (text, row, ndx) => row.videoId === current.videoId ? current.state === 'loading' ? <LoadingOutlined /> : <SoundOutlined /> : ndx+1
      },
      {
        title: t('music.name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('music.artist'),
        dataIndex: ['artist', 'name'],
        key: 'artist',
        render: (text, row, ndx) => {
          if (Array.isArray(row.artist)) return row.artist.map(i => i.name).join(' ')
          return row.artist.name
        }
      },
      {
        title: t('music.time'),
        dataIndex: 'duration',
        key: 'duration',
        render: (text) => (convertoTime(text))
      },
      {
        title: t('music.album'),
        dataIndex: ['album', 'name'],
        key: 'album',
      },
      optionCol
      ]
    },
    { 
      type: 'artist',
      rowKey: 'browseId',
      size: 'large',
      showHeader: false,
      onRowClick: toArtistPage,
      columns: [
        {
          title: '',
          dataIndex: '',
          key: 'img',
          width: 80,
          onCell: () => ({className: 'rounded-tl-xl rounded-bl-xl'}),
          render: (text, row) => <img className='rounded-lg ' src={row?.thumbnails[0]?.url || defaultThumbnailPath} />
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          onCell: () => ({className: 'rounded-tr-xl rounded-br-xl'})
        },
      ] 
    },
    { 
      type: 'album',
      rowKey: 'browseId',
      size: 'large',
      showHeader: false,
      onRowClick: toDetailPage,
      columns: [
        {
          title: '',
          dataIndex: '',
          key: 'img',
          width: 80,
          onCell: () => ({className: 'rounded-tl-xl rounded-bl-xl'}),
          render: (text, row) => <img className='rounded-lg ' src={row?.thumbnails[0]?.url || defaultThumbnailPath} />
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '',
          dataIndex: 'artist',
          key: 'artist',
          onCell: () => ({className: 'rounded-tr-xl rounded-br-xl'}),
          render: (_, row) => `${row.type} · ${row.artist || ''} · ${row.year}`
        },
      ] 
    },
    { 
      type: 'playList',
      rowKey: 'browseId',
      size: 'large',
      showHeader: false,
      onRowClick: toDetailPage,
      columns: [
        {
          title: '',
          dataIndex: '',
          key: 'img',
          width: 80,
          onCell: () => ({className: 'rounded-tl-xl rounded-bl-xl'}),
          render: (text, row) => <img className='rounded-lg ' src={row?.thumbnails[0]?.url || defaultThumbnailPath} />
        },
        {
          title: '名称',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '',
          dataIndex: 'title',
          key: 'title',
          onCell: () => ({className: 'rounded-tr-xl rounded-br-xl'}),
          render: (_, row) => `${row.trackCount || ''} · ${row.author || ''}`
        },
      ] 
    },
    { 
      type: 'songOnlyName',
      rowKey: 'videoId',
      size: 'small',
      showHeader: false,
      onRowClick: onSongRowClick,
      columns: [
        {
          title: '',
          dataIndex: '',
          key: 'isPlay',
          width: 40,
          onCell: () => ({className: 'rounded-tl-xl rounded-bl-xl'}),
          render: (text, row, ndx) => row.videoId === current.videoId ? current.state === 'loading' ? <LoadingOutlined /> : <SoundOutlined /> : ndx+1
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        optionCol
      ] 
    },
  ]
  const tableSetting = list.find(i => i.type === type)
  useEffect(() => {
  }, [dataSource, favorite, current])
  return (
    <Table
    rowKey={tableSetting.rowKey}
    dataSource={dataSource}
    className='p-6 overflow-hidden custom-table'
    onRow={(record)=> ({
      className: 'hover:scale-105 transition-transform rounded-xl overflow-hidden duration-300',
      onClick: () => tableSetting?.onRowClick(record)
    })}
    loading={isLoading}
    pagination={false}
    size={tableSetting.size}
    showHeader={tableSetting.showHeader}
    columns={tableSetting.columns} />
  )
})

export default PlayList