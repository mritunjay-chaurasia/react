import { createSlice } from "@reduxjs/toolkit";
import { showNotification } from "../../utils/notification";
import { fetchSubscriptionDetails } from "./subscription";

const initialState = {
  planDetails: null,
  isLoading: true,
  isSuccess: false,
  errorMessage: ''
}

const dateComparison = (endDate) => {
  let todayDate = new Date();
  todayDate.setHours(0);
  todayDate.setMinutes(0);
  todayDate.setSeconds(0);
  todayDate.setMilliseconds(0);

  let subsEndDate = new Date(endDate);
  subsEndDate.setHours(0);
  subsEndDate.setMinutes(0);
  subsEndDate.setSeconds(0);
  subsEndDate.setMilliseconds(0);

  return todayDate > subsEndDate
}

export const userToolsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    increaseChatCount: (state) => {
      state.planDetails = { ...state.planDetails, used: { ...state.planDetails.used, chat: state.planDetails.used.chat + 1 } }
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
    },
    increaseTaskCount: (state) => {
      state.planDetails = { ...state.planDetails, used: { ...state.planDetails.used, task: state.planDetails.used.task + 1 } }
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSubscriptionDetails.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(fetchSubscriptionDetails.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.planDetails = {...payload.data, isExpired: dateComparison(payload.data.date.to)};
      state.errorMessage = "";
      
    })
    builder.addCase(fetchSubscriptionDetails.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    })
  }
});

export const { increaseChatCount, increaseTaskCount } = userToolsSlice.actions;

export default userToolsSlice.reducer;
