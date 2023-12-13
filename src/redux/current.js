import { createSlice  } from '@reduxjs/toolkit'

export const current = createSlice({
  name: 'current',
  initialState: {
    state: ''
  },
  reducers: {
    setCurrent: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})
export const { setCurrent } = current.actions
export default current.reducer