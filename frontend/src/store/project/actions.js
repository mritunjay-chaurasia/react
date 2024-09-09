import { createAsyncThunk } from "@reduxjs/toolkit";
import * as ProjectApi from "../../api/userProject.api";

/**
 * This is an action to get all projects of a specific orgid
 * @params : orgid(organistoin id) (Type: Integer)
 * @response : all project of the specific organisation
 * @author : Milan Rawat
 */
export const getAllProjects = createAsyncThunk(
  "project/getAllProjects",
  async (orgid, { rejectWithValue }) => {
    try {
      const response = await ProjectApi.getAllProjects(orgid);
      return response;
    } catch (error) {
      if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * This is an action to update settings(theme and prechat setting) of a specific project
 * @params : project settings data(Type: Object)
 * @response : none
 * @author : Milan Rawat
 */
export const updateProjectSettings = createAsyncThunk(
  "project/updateProjectSettings",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ProjectApi.updateProjectSettings(data);
      return response;
    } catch (error) {
      if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * This is an action to add project in a specific organization
 * @params : project details data(Type: Object)
 * @response : none
 * @author : Milan Rawat
 */
export const addProject = createAsyncThunk(
  "project/addProject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ProjectApi.addProject(data);
      return response;
    } catch (error) {
      if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);
