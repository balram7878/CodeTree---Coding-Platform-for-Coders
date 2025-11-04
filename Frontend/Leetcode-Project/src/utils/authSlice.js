import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./axiosClient";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("auth/user/register", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const authUser = createAsyncThunk(
  "auth/authUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/auth/authUser");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("auth/logout");
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const auth = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: null,
    loading: false,
    isAuthenticated: false,
  },
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action?.payload;
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        action.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action?.payload;
        state.loading = false;
        state.user = null;
        state.isAuthenticated = !!action?.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = !!action.payload;
        state.user = action?.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action?.payload;
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(authUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action?.payload;
        state.error = null;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.error = action?.payload;
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default auth.reducer;
