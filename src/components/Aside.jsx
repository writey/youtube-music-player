import React from 'react'
import WindowMenu from './WindowMenu';
import { useState } from 'react';
import MyMenu from './MyMenu'

const styles = {
  WebkitAppRegion: 'drag'
}
const Aside = () => {
  const [isFold, setIsFold] = useState(false)
  const reSetWidth = (isFold) => setIsFold(isFold)
  return (
    <aside style={styles} className={`w-${isFold ? '24': '40'} px-3 bg-white transition-all`}>
      <WindowMenu reSetWidth={reSetWidth} />
      <MyMenu />
      </aside>
  )
}

export default Aside