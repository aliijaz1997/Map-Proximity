import { localStorageService } from "../../utils/localStorageService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Async thunk for registration or login
export const registerOrLoginUser = createAsyncThunk(
  "auth/registerOrLoginUser",
  async ({ email, password }) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return response.user;
    } catch (error) {
      // If user is not registered, register the user
      if (error.code === "auth/user-not-found") {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log({ responseRegister: response.user });
        return response.user;
      } else {
        throw error;
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorageService.getToken(),
    loading: false,
    error: "",
  },
  reducers: {
    loginRedux: (state, { payload }) => {
      state.token = payload;
      localStorageService.setToken(payload);
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerOrLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerOrLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        window.location.href = "/";
      })
      .addCase(registerOrLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;

export const { loginRedux, updateToken, logoutRedux } = authSlice.actions;
