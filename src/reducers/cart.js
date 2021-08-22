import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems:{}
  },
  reducers: {
    clearCartItems: (state) => {
      state.cartItems = {}
    },
    setCartItems: (state, action) => {
      state.cartItems = {...action.payload}
    },
  },
})

export const { clearCartItems, setCartItems} = cartSlice.actions

export default cartSlice.reducer