import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: JSON.parse(localStorage.getItem("auth")) ?? null,
  log: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const data = {
        token: action.payload.token,
        authId: action.payload.userObj._id,
        user: {
          name: action.payload.userObj.user.name,
          role: action.payload.userObj.role,
          email: action.payload.userObj.email,
          userId: action.payload.userObj.user._id,
        },
      };
      state.auth = data;
      localStorage.setItem("auth", JSON.stringify(data));
    },
    logout: (state) => {
      state.null;
      localStorage.removeItem("auth");
    },
    getUser: (state) => {
      state.user = localStorage.getItem("user");
    },
    loadAuth: (state) => {
      const data = JSON.parse(localStorage.getItem("auth"));
      state.auth = data;
    },
  },
});

export const { login, getUser, loadAuth } = authSlice.actions;
export default authSlice.reducer;
