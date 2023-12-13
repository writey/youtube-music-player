import { configureStore } from '@reduxjs/toolkit'
import userData from './userData'
import current from './current'

const store = configureStore({
  reducer: { userData, current }
})

export default store