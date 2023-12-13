import React from 'react'
import Aside from './Aside'
import Main from './Main'
import { ConfigProvider } from 'antd'
import '@/i18n';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import PubSub from '@/common/pubsub'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initData } from '@/redux/userData'

const antdConfig = {
  colorPrimary: '#000',
  colorBgContainer: '#f4f5fe',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}


const App = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const setting = useSelector(state => state.userData.setting)
  const changeLanguage = (val) => i18n.changeLanguage(val)
  useEffect(() => {
    PubSub.on('getLanguage', changeLanguage)
    window.API.send('read-json', 'setting.json')
    window.API.on('read-json', (_, args) => {
      dispatch(initData(args))
      changeLanguage(args?.setting?.language || '')
      window.API.remove('read-json')
    })
    return () => {
      PubSub.off('getLanguage', changeLanguage)
      window.API.remove('read-json')
    }
  }, [])
  return (
      <ConfigProvider theme={{ token: antdConfig }}>
        
        <div className='flex h-full font-mono'>
            <Router>
              <Aside />
              <Main />
            </Router>
          </div>
      </ConfigProvider>
  )
}

export default App