import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: {},
  totalProducts: 0,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getAllProducts(state, action) {
      state.products = action.payload;
      state.totalProducts = state.products?.length;
      localStorage.setItem("products", JSON.stringify(state.products));
    },

    getOneProduct(state, action) {
      state.product = action.payload;
    },
  },
});

export const { getAllProducts, getOneProduct } = productSlice.actions;
export default productSlice.reducer;
