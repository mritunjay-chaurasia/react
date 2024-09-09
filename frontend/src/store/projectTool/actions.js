import { createAsyncThunk } from "@reduxjs/toolkit";
import * as UserToolApi from '../../api/tool.api';


/**
* This is an action to get all UserTools of a specific projectid
* @params : projectid(project id) (Type: Integer)
* @response : all Tools of the specific project
* @author : Milan Rawat
*/
export const getProjectTools = createAsyncThunk('userTool/getProjectTools', async (projectid, { rejectWithValue }) => {
  try {
    const response = await UserToolApi.getProjectTools(projectid);
    return response;
  } catch (error) {
    if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
    return rejectWithValue(error.message);
  }
})

/**
* This is an action to add a tool in the specific project
* @params : data(tool data) (Type: Object)
* @response : add a Tool
* @author : Milan Rawat
*/
// export const addTool = createAsyncThunk('userTool/addTool', async (data, { rejectWithValue }) => {
//   try {
//     const response = await UserToolApi.addTool(data);
//     return response;
//   } catch (error) {
//     if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
//     return rejectWithValue(error.message);
//   }
// })
