const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require('electron')
const path = require('path')
const YoutubeMusicApi = require('youtube-music-api-writey')
const fs = require('fs')
const ytdl = require('ytdl-core')

const api = new YoutubeMusicApi()
const isDev = process.env.NODE_ENV === 'development'
const dirName =  process.cwd()
const appPath = app.getAppPath()

const ndxPath = isDev ? `http://localhost:${process.env.port || 3000}` : `file://${path.resolve(appPath, './dist/index.html')}`

const cacheDir = path.resolve(dirName, './cache/')
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir)

let win
const createWindow = () => {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(appPath, 'preload.js')
    },
    transparent: true,
    titleBarStyle: 'hidden'
  })
  win.loadURL(ndxPath)
  if (isDev) win.webContents.openDevTools()
  win.webContents.on('dom-ready', () => {
    win.webContents.executeJavaScript(`window.isDev = ${isDev};`);
  })
}

const addOnActiveListen = () => app.on('activate', () => {
  BrowserWindow.getAllWindows().length === 0 && createWindow()
})

const readJsonFile = (fileName) => {
  try {
    const data = fs.readFileSync(path.join(dirName, fileName), 'utf-8');
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading JSON file:', error.message)
    
    const downloadDir = path.resolve(dirName, './download/')
    const defaultData = { setting: { path: downloadDir }, favorite: [], playList: { created: [], saved: [] } }
    writeJsonFile('setting.json', defaultData)
    return defaultData
  }
}

const writeJsonFile = (fileName, data) => {
  try {
    fs.writeFileSync(path.join(dirName, fileName), JSON.stringify(data, null, 2), 'utf-8')
    console.log('JSON file written successfully.')
    return true 
  } catch (error) {
    console.error('Error writing JSON file:', error.message)
    return false
  }
}

const getCacheFile = (id) => {
  const filePath = `${cacheDir}/${id}.m4a`
  return fs.readFileSync(filePath)
}

const clearFolder = (folderPath) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err)
      return false
    }
    files.forEach((file) => {
      const filePath = path.join(folderPath, file)
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err)
          return false
        } else {
          console.log('File deleted:', filePath)
        }
      })
    })
  })
  return true
}

app.whenReady().then(() => createWindow(), addOnActiveListen())
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

ipcMain.on('ondragstart', (event, filePath) => {
  const iconName = path.join(dirName, 'icon.png')
  event.sender.startDrag({
    file: path.join(dirName, filePath),
    icon: iconName
  })
})

ipcMain.on('toMain', (event, msg) => {
    api.search(msg).then(result => {
      event.reply("fromMain", result)
    })
})

ipcMain.on('maximize', (event, msg) => {
  win.maximize()
})

ipcMain.on('minimize', (event, msg) => {
  win.minimize()
})

ipcMain.on('unmaximize', (event, msg) => {
  win.unmaximize()
})

ipcMain.on('close', (event, msg) => {
  win.close()
})

ipcMain.on('read-json', (event, fileName) => {
  const data = readJsonFile(fileName)
  event.reply("read-json", data)
})

ipcMain.on('write-json', (event, { fileName, data }) => {
  event.reply("write-json", writeJsonFile(fileName, data))
})

ipcMain.on('download', (event, { name, id }) => {
  const downloadDir = readJsonFile('setting.json').setting.path
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir)
  const filePath = `${path.join(downloadDir, name)}.m4a`
  if ((fs.existsSync(`${cacheDir}/${id}.m4a`))) {
    let file = getCacheFile(id)
    fs.writeFile(filePath, file, () => event.reply("download", { name, success: true }))
  } else {
    ytdl(`https://music.youtube.com/watch?v=${id}`, { filter: 'audioonly' })
    .pipe(fs.createWriteStream(filePath)).on('close', () => event.reply("download", { name, success: true }))
  }
})
ipcMain.on('clear-cache', (event, ) => {
  event.reply("clear-cache", clearFolder(cacheDir))
})

ipcMain.on('select-folder', (event, title) => {
  dialog.showOpenDialog(win, {
    title,
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      event.reply("get-folder", result.filePaths[0])
    }
  }).catch(err => {
    console.error(err);
  })
})

api.initalize().then(info => {
  ipcMain.on('search', (event, { keyword, type = '', key }) => {
    if (!keyword) return
    if (!type) {
      return api.getSearchSuggestions(keyword).then(res => event.reply('search', res))
    }
    api.search(keyword, type.toLowerCase()).then(result => {
      if (key) return event.reply(`search/${key}`, result)
      event.reply('search', result)
    })
  })
  ipcMain.on('detail', (event, { type, browseId }) => {
    if (!type || !browseId) return
    const typeApi = {
      'album': 'getAlbum',
      'artist': 'getArtist',
      'playlist': 'getPlaylist',
      'single': 'getAlbum',
      'ep': 'getAlbum',
    }
    api[typeApi[type.toLowerCase()]](browseId).then(result => {
      event.reply('detail', result)
    })
  })
  ipcMain.on('play', async(event, msg) => {
    if (!msg) return
    const res = () => {
      fileContent = fs.readFileSync(filePath)
      event.reply('file', { id: msg, file: fileContent })
    }
    const filePath = `${cacheDir}/${msg}.m4a`
    if (fs.existsSync(filePath)) return res()
    ytdl(
      `https://music.youtube.com/watch?v=${msg}`,
      { filter: 'audioonly' }
    ).pipe(fs.createWriteStream(filePath)).on('close', res)
  })
})


