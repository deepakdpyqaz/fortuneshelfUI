import { createSlice } from '@reduxjs/toolkit'

export const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    adminDetails:{}
  },
  reducers: {
    logout: (state) => {
      state.adminDetails = {}
    },
    login: (state, action) => {
      state.adminDetails = action.payload
    },
  },
})

export const { login, logout} = adminSlice.actions

export default adminSlice.reducer