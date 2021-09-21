import { createSlice } from '@reduxjs/toolkit'

export const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    languages:null,
    categories:null
  },
  reducers: {
    setLanguages: (state,action) => {
      
      state.languages = action.payload
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
  },
})

export const { setLanguages, setCategories} = filterSlice.actions

export default filterSlice.reducer