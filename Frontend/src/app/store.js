import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import { api } from "./service/api";
import authSlice from "./slices/authSlice";
import presenceChannelSlice from "./slices/presenceChannelSlice";

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  [api.reducerPath]: api.reducer,
  auth: authSlice,
  presenceChannel: presenceChannelSlice,
};

export default configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
