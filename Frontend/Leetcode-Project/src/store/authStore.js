import { configureStore } from "@reduxjs/toolkit";
import authSliceReducers from "../utils/authSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducers,
  },
});

export default store;
