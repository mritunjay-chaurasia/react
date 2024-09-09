import { createSlice } from "@reduxjs/toolkit";
import { showNotification } from "../../utils/notification";
import { addProject, getAllProjects, updateProjectSettings } from "./actions";

const initialState = {
  allProjects: [],
  currentProject: {},
  isLoading: true,
  isSuccess: false,
  errorMessage: "",
};

export const projectSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProjects.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllProjects.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.allProjects = payload.data.allProjects;
      state.currentProject = payload.data.allProjects[0];
      state.errorMessage = "";
    });
    builder.addCase(getAllProjects.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
    });
    builder.addCase(updateProjectSettings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProjectSettings.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      state.currentProject = payload.project;
      showNotification("success", "Settings saved successfully!");
    });
    builder.addCase(updateProjectSettings.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
      showNotification("error", payload);
    });
    builder.addCase(addProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProject.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      state.currentProject = payload.project;
      showNotification("success", "Project added successfully!");
    });
    builder.addCase(addProject.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = payload;
      showNotification("error", payload);
    });
  },
});

export default projectSlice.reducer;
