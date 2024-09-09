import { createAsyncThunk } from "@reduxjs/toolkit";
import * as OrgApi from '../../api/org.api';

export const getOrgDetails = createAsyncThunk('organization/getOrgDetails', async (data, { rejectWithValue }) => {
  try {
    const response = await OrgApi.getOrgDetails();
    console.log('response :: ::: :::',response)
    if(!response) return rejectWithValue("Unauthorized");

    return response;
  } catch (error) {
    if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
    return rejectWithValue(error.message);
  }
})

export const addOrganization = createAsyncThunk('organization/addOrganization', async (data, { rejectWithValue }) => {
  try {
    const response = await OrgApi.addOrganization(data);
    return response;
  } catch (error) {
    if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
    return rejectWithValue(error.message);
  }
})