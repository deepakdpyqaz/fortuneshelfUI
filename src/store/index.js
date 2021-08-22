import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../reducers/auth";
import cartReducer from "../reducers/cart";
export default configureStore({
  reducer: {
      auth:authReducer,
      cart:cartReducer,
  },
})