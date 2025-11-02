import { configureStore } from '@reduxjs/toolkit'
import authSliceReducers from "../utils/authSlice"

export default configureStore({
  reducer: {
    authSlice:authSliceReducers
  },
})