import React from 'react'
import { HomeOutlined, MailOutlined, SettingOutlined, HeartOutlined, MenuOutlined } from '@ant-design/icons'
import { Menu, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const MyMenu = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const pathName = location?.pathname
  const menuConfig = {
    colorPrimary: '#000',
    colorBgContainer: '#fff',
    itemSelectedBg: '#000',
    itemSelectedColor: '#fff',
    itemActiveBg: '#000'
  }
  const onItemClick = (path) => {
    navigate(path)
  }
  const items = [
    { label: t('menu.home'), key: '/', icon: <HomeOutlined />, onClick: () => onItemClick('/') },
    { label: t('menu.favorite'), key: '/favorite', icon: <HeartOutlined />, onClick: () => onItemClick('/favorite') },
    { label: t('menu.playList'), key: '/playList', icon: <MenuOutlined />, onClick: () => onItemClick('/playList') },
    { label: t('menu.setting'), key: '/setting', icon: <SettingOutlined />, onClick: () => onItemClick('/setting') },
  ]
  useEffect(() => {}, [location])
  return (
    <ConfigProvider theme={{ components: { Menu: menuConfig }}}>
      <Menu
        style={{ width: '100%' }}
        defaultSelectedKeys={[pathName]}
        mode="inline"
        items={items}
      />
    </ConfigProvider>
  )
}

export default MyMenu