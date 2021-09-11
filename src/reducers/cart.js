import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems:{},
    changes:true,
  },
  reducers: {
    clearCartItems: (state) => {
      state.cartItems = {}
    },
    setCartItems: (state, action) => {
      state.cartItems = {...action.payload}
    },
    makeChange:(state)=>{
      state.changes = !(state.changes);
    }
  },
})

export const { clearCartItems, setCartItems, makeChange} = cartSlice.actions

export default cartSlice.reducer