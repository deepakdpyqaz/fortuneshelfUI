import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userDetails:{}
  },
  reducers: {
    logout: (state) => {
      state.userDetails = {}
    },
    login: (state, action) => {
      state.userDetails = action.data
    },
  },
})

export const { login, logout} = authSlice.actions

export default authSlice.reducer