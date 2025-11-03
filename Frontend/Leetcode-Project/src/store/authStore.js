import { configureStore } from "@reduxjs/toolkit";
import authSliceReducers from "../utils/authSlice";

const store = configureStore({
  reducer: {
    authSlice: authSliceReducers,
  },
});

export default store;
