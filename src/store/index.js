import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../reducers/auth";
import cartReducer from "../reducers/cart";
import adminReducer from "../reducers/admin"
import filterReducer from "../reducers/filter";
export default configureStore({
  reducer: {
      auth:authReducer,
      cart:cartReducer,
      admin:adminReducer,
      filter:filterReducer,
  },
})