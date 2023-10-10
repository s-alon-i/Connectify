import postReducer from './postReducer';
import authReducer from './authReducer';
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {postReducer,authReducer}
  })