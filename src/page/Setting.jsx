import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, notification, Form, Input, Radio, Popover, Popconfirm } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { onSetSettingWithSave } from '@/redux/userData'
import { useEffect } from 'react'

const Setting = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const setting = useSelector((state) => state.userData.setting)
  const [api, contextHolder] = notification.useNotification()

  const onLanguageChange = ({ target: { value } }) => {
    i18n.changeLanguage(value)
    dispatch(onSetSettingWithSave({ language: value }))
  }
  useEffect(() => {}, [setting])
  
  const onPathSubmit = () => {
    window.API.send('select-folder', t('setting.selectDownloadFolder'))
    window.API.on('get-folder', (_, path) => {
      console.log(path);
      dispatch(onSetSettingWithSave({ path }))
      window.API.remove('get-folder')
    })
  }

  const onClearCache = () => {
    window.API.send('clear-cache')
    window.API.on('clear-cache', (_, res) => {
      const description = res ? t('setting.clearCacheSuccess') : t('setting.clearCacheFail')
      api.open({ message: t('setting.clearCache'), description })
      window.API.remove('clear-cache')
    })
  }
  return (
    <div>
      <Form labelCol={{ span: 4 }} size='small'>
      {contextHolder}
        <Form.Item label={t('setting.language')}>
          <Radio.Group defaultValue={setting.language} onChange={onLanguageChange}>
            <Radio value='zh'>中文</Radio>
            <Radio value='en'>English</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('setting.downloadPath')}>
          <Radio.Group onChange={onLanguageChange}>
            <div className='flex'>
              <Input value={setting.path} disabled /> <Button onClick={onPathSubmit} className='ml-2'>{t('setting.select')}</Button>
            </div>
          </Radio.Group>
        </Form.Item>
        <Form.Item >
          <Radio.Group onChange={onLanguageChange}>
          <Popconfirm
          onConfirm={onClearCache}
          placement="topLeft"
          title={t('setting.clearCacheConfirm')}
          okText={t('setting.yes')}
          cancelText={t('setting.no')}
        >
          <Popover size='small' placement="right" content={t('setting.clearCacheTip')}>
              <Button danger className='ml-4'> {t('setting.clearCache')} </Button>
            </Popover>
        </Popconfirm>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Setting