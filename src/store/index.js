import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../reducers/auth";
import cartReducer from "../reducers/cart";
import adminReducer from "../reducers/admin"
export default configureStore({
  reducer: {
      auth:authReducer,
      cart:cartReducer,
      admin:adminReducer,
  },
})