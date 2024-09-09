import { createSlice } from "@reduxjs/toolkit";
import { showNotification } from "../../utils/notification";
import { getProjectTools } from "./actions";

const initialState = {
  allTools: [],
  isLoading: true,
  isSuccess: false,
  errorMessage: ''
}

export const userToolsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addTool: (state, { payload }) => {
      state.allTools = [payload, ...state.allTools];
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      showNotification("success", "Reverse Engineering of your code started, we will let you know once the system is ready.");
    },
    updateTool: (state, { payload }) => {
      state.allTools = state.allTools.map(item => {
        if (item.id === payload.id) return payload;
        return item
      });
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      showNotification("success", "Tool updated Successfully.");
    },
    deleteTool: (state, { payload }) => {
      state.allTools = state.allTools.filter(obj => obj.id !== payload);
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      showNotification("success", "Tool Deleted Successfully.");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectTools.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getProjectTools.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.allTools = payload.tools;
      state.errorMessage = "";
    })
    builder.addCase(getProjectTools.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    })
  }
});

export const { addTool, updateTool, deleteTool } = userToolsSlice.actions;

export default userToolsSlice.reducer;
