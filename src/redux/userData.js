import { createSlice  } from '@reduxjs/toolkit'

export const onFavoriteWithSave = (item) => {
  return async (dispatch, getState) => {
    try {
      delete item.state
      const state = getState()?.userData
      let favorite
      if (state.favorite.find(i => i.videoId === item.videoId)) {
        favorite = state.favorite.filter(i => i.videoId !== item.videoId)
      } else {
        favorite = [...state.favorite, item]
      }
      window.API.send('write-json', { fileName: 'setting.json', data: { ...state, favorite } })
      dispatch(onFavorite(favorite))
    } catch (error) {
      console.error('error:', error)
    }
  }
}

export const onSetSettingWithSave = (setting) => {
  return async (dispatch, getState) => {
    const state = getState()?.userData
    let newSetting = { ...state.setting, ...setting }
    window.API.send('write-json', { fileName: 'setting.json', data: { ...state, setting: newSetting } })
    dispatch(setSetting(newSetting))
  }
}

export const onCreatePlayList = (name) => {
  return async (dispatch, getState) => {
    const id = Date.now() + ''
    const state = getState()?.userData
    let created = [ ...state.playList.created, { name, id, songs: [] } ]
    let playList = { ...state.playList, created }
    window.API.send('write-json', { fileName: 'setting.json', data: { ...state, playList } })
    dispatch(setPlayList(playList))
  }
}

export const onSaveToPlayList = (id, song) => {
  return async (dispatch, getState) => {
    delete song.state
    const state = getState()?.userData
    let target = { ...state.playList.created.find(i => i.id === id) }
    target.songs = [...target.songs, song]
    let created = state.playList.created.map(i => (i.id === id ? target : i))
    let playList = { ...state.playList, created }
    window.API.send('write-json', { fileName: 'setting.json', data: { ...state, playList } })
    dispatch(setPlayList(playList))
  }
}

export const onDeleteSavedSong = (id, videoId) => {
  return async (dispatch, getState) => {
    const state = getState()?.userData
    const songs = state.playList.created.find(i => i.id === id).songs.filter(i => i.videoId !== videoId)
    let target = { ...state.playList.created.find(i => i.id === id) }
    target.songs = [...songs]
    let created = state.playList.created.map(i => (i.id === id ? target : i))
    let playList = { ...state.playList, created }
    window.API.send('write-json', { fileName: 'setting.json', data: { ...state, playList } })
    dispatch(setPlayList(playList))
  }
}

export const onDeleteCreatePlayList = (id) => {
  return async (dispatch, getState) => {
    const state = getState()?.userData
    let created = state.playList.created.filter(i => i.id !== id)
    let playList = { ...state.playList, created }
    window.API.send('write-json', { fileName: 'setting.json', data: { ...state, playList } })
    dispatch(setPlayList(playList))
  }
}


export const userData = createSlice({
  name: 'userData',
  initialState: {
    setting: {},
    favorite: [],
    playList: {
      created: [],
      saved: []
    }
  },
  reducers: {
    initData: (state, action) => {
      return { ...state, ...action.payload }
    },
    onFavorite: (state, action) => {
      return { ...state, favorite: action.payload }
    },
    setSetting: (state, action) => {
      return { ...state, setting: action.payload }
    },
    setPlayList: (state, action) => {
      return { ...state, playList: action.payload }
    }
  }
})
export const { initData, onFavorite, setSetting, setPlayList } = userData.actions
export default userData.reducer