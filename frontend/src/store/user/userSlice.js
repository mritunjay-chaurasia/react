import { createSlice } from "@reduxjs/toolkit";
import { USER_TOKEN } from "../../constants";
import { showNotification } from "../../utils/notification";
import { getCurrentUser, login, register } from "./actions";
import { socket } from "../../socket";

const initialState = {
  userInfo: {},
  userToken: localStorage.getItem(USER_TOKEN),
  isLoading: true,
  isSuccess: false,
  errorMessage: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(USER_TOKEN);
      localStorage.removeItem('loginNotificationDone');
      localStorage.removeItem("userChatSessionId");
      state.userInfo = {};
      state.userToken = null;
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
    },
    updateMe: (state, { payload }) => {
      state.userInfo = payload;
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getCurrentUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.userInfo = payload.user;
      state.userToken = payload.token;
      state.errorMessage = "";
      socket.emit('joinMyRoom', payload.user.id);
    })
    builder.addCase(getCurrentUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.userInfo = {};
      state.userToken = null;
      state.errorMessage = payload;
    })
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(login.fulfilled, (state, { payload }) => {
      localStorage.setItem(USER_TOKEN, payload.token);
      state.isLoading = false;
      state.isSuccess = true;
      state.userInfo = payload.user;
      state.userToken = payload.token;
      state.errorMessage = "";
    })
    builder.addCase(login.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
      state.userToken = null;
      showNotification('error', payload)
    })
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(register.fulfilled, (state, { payload }) => {
      localStorage.setItem(USER_TOKEN, payload.token);
      state.isLoading = false;
      state.isSuccess = true;
      state.userInfo = payload.user;
      state.userToken = payload.token;
      state.errorMessage = "";
    })
    builder.addCase(register.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
      showNotification('error', payload)
    })
  }
})

export const { logout, updateMe } = userSlice.actions;

export default userSlice.reducer;
