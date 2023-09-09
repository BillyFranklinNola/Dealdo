import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { toast } from "react-toastify";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  musician: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  errors: {},
};

export const register = createAsyncThunk("auth/register", async (user) => {
  try {
    const response = await authService.register(user);
    toast.success("Registration Successful");
    return response;
  } catch (error) {
    const errorResponse = error.response.data.err.errors;
    console.log(error.response);
    return errorResponse;
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const response = await authService.login(user);
    toast.success("Login Successful");
    return response;
  } catch (error) {
    const errorResponse = error.response && error.response.data.message;
    console.log(error.response);
    console.log(error.response.data.message);
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
