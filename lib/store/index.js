import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import weatherReducer from './weather-slice'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
})

export const useAppDispatch = useDispatch
export const useAppSelector = useSelector
