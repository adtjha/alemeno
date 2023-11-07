import { combineReducers, configureStore } from '@reduxjs/toolkit';
import tokenReducer from './loginSlice'
import userReducer from './userSlice'

export const store = configureStore({
    reducer: combineReducers({
        token: tokenReducer,
        user: userReducer
    })
})
