import React from 'react'
import { Carousel } from 'antd'
import { useTranslation } from 'react-i18next'
import Favorite from './Favorite'
import { useNavigate } from 'react-router-dom'

const data = [
  { name: '吹灭小山河', img: `${window.isDev ? '': '.'}/assets/1.jpg`, artist: '司南', album: '' },
  { name: '春山空', img: `${window.isDev ? '': '.'}/assets/2.jpg`, artist: '任然', album: '' },
  { name: '马步摇', img: `${window.isDev ? '': '.'}/assets/3.jpg`, artist: '尼莫问', album: '' },
]

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className='flex flex-col '>
      <header className='flex items-center justify-between'>
        <span className='text-xl '>🔥{t('home.trending')}</span>
        <span className='cursor-pointer '> {t('home.more')} {'>󠀾󠀾󠀾'}</span>
      </header>
      <main className='w-full mt-4'>
        <Carousel fade autoplay dots={false}>
          {
            data.map(i => (
              <div className='' key={i.name} >
                <div className='relative bg-cover rounded-md ' style={{backgroundImage: `url('${i.img}')`}}>
                  <div className='flex flex-col justify-end p-8 bg-gradient-to-r img-filter'>
                    <span>{i.artist}</span>
                    <h1 className='mt-2 text-2xl font-bold '>{i.name}</h1>
                    <button className='w-20 px-4 py-1 mt-4 font-bold text-white bg-black rounded-3xl'>Play</button>
                  </div>
                </div>
              </div>
            ))
          }
        </Carousel>
      </main>
      <footer className='mt-6 '>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl fond-bold'>🎵 {t('home.myList')}</h1>
          <span className='cursor-pointer ' onClick={() => navigate('/favorite')}> {t('home.showAll')}</span>
        </div>
        <Favorite  />
      </footer>
    </div>
  )
}

export default Home