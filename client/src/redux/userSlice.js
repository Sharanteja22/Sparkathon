import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.success = true;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout
} = userSlice.actions;

export default userSlice.reducer;
