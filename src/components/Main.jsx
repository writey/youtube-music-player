import React from 'react'
import TopBar from './TopBar'
import Home from "@/page/Home"
import Player from './Player/Player'
import CurrentPlayList from './CurrentPlayList'
import SearchResult from '@/page/SearchResult'
import Detail from '@/page/Detail'
import Artist from '@/page/Artist'
import Setting from '@/page/Setting'
import Favorite from '@/page/Favorite'
import MyPlayList from '@/page/MyPlayList'
import CreatedPlayList from '@/page/CreatedPlayList'
import { Route, Routes } from 'react-router-dom'

const Main = () => {
  return (
    <main style={{ WebkitAppRegion: 'drag' }} className='flex flex-col justify-between flex-1 p-4 py-6 transition-all w-80' >
      <TopBar />
        <div className='pr-4 mt-5 overflow-auto transition-all basis-full'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/SearchResult/:keyword" element={<SearchResult />} />
            <Route path="/Detail/:type/:browseId" element={<Detail />} />
            <Route path="/Artist/:browseId" element={<Artist />} />
            <Route path="/Favorite" element={<Favorite />} />
            <Route path="/playList" element={<MyPlayList />} />
            <Route path="/createdPlayList/:id" element={<CreatedPlayList />} />
            <Route path="/Setting" element={<Setting />} />
          </Routes>
        </div>
      <Player />
      <CurrentPlayList />
    </main>
  )
}

export default Main