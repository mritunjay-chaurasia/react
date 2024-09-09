import { createAsyncThunk } from "@reduxjs/toolkit";
import * as AuthApi from '../../api/auth.api';

/**
* This is an action to change a redux state of user, it will check if token doesn't exists or expired it'll be logged out else stays logged in
* @params : none
* @response : Change Redux state(user)
* @author : Milan Rawat
*/
export const getCurrentUser = createAsyncThunk('user/getCurrentUser', async (data, { rejectWithValue }) => {
  try {
    const response = await AuthApi.getCurrentUser();
    if(!response) return rejectWithValue("Unauthorized");
    return response
  } catch (error) {
    if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
    return rejectWithValue(error.message);
  }
})

/**
* This is an action to Login a User
* @params : none
* @response : Change Redux state(user) Login User
* @author : Milan Rawat
*/
export const login = createAsyncThunk('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await AuthApi.login(data)
    return response
  } catch (error) {
    if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
    return rejectWithValue(error.message);
  }
})

/**
* This is an action to Register a User
* @params : none
* @response : Change Redux state(user) Register User
* @author : Milan Rawat
*/
export const register = createAsyncThunk('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await AuthApi.register(data);
    return response
  } catch (error) {
    if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
    return rejectWithValue(error.message);
  }
})
