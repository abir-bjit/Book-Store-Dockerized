import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import cartReducer from "./cart/cartSlice";
import productReducer from "./slices/product/productSlice";

const store = configureStore({
  // reducer: authSlice ,
  reducer: { auth: authSlice, cart: cartReducer, product: productReducer},
});

export default store;
