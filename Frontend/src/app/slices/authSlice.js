import { localStorageService } from "../../utils/localStorageService";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorageService.getToken(),
    loading: false,
    error: "",
    user: null,
  },
  reducers: {
    loginRedux: (state, { payload }) => {
      state.token = payload;
      localStorageService.setToken(payload);
    },
    addUserRedux: (state, { payload }) => {
      state.user = payload;
    },
    updateToken: (state, { payload }) => {
      if (!payload) {
        localStorageService.removeToken();
        state.token = null;
      } else {
        state.token = payload;
        localStorageService.setToken(payload);
      }
    },
    logoutRedux: (state) => {
      localStorageService.removeToken();
      window.location.href = "/";
      state.token = null;
      state.user = null;
    },
  },
});

export default authSlice.reducer;

export const { loginRedux, updateToken, logoutRedux, addUserRedux } =
  authSlice.actions;
