const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
  send: (channel, msg) => {
    ipcRenderer.send(channel, msg)
  },
  on: (channel, cb) => {
    ipcRenderer.on(channel, cb)
  },
  remove: (channel, cb) => {
    ipcRenderer.removeAllListeners(channel)
  }
})


contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)