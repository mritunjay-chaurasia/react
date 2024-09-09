import { createAsyncThunk } from "@reduxjs/toolkit";
import * as StripeApi from '../../api/stripe.api';


/**
* This is an action to get all Subscription details
* @params : projectid(project id) (Type: Integer)
* @response : Subscription Details
* @author : Milan Rawat
*/
export const fetchSubscriptionDetails = createAsyncThunk('subscription/fetchSubscriptionDetails', async (projectid, { rejectWithValue }) => {
  try {
    const response = await StripeApi.fetchSubscriptionDetails(projectid);
    return response;
  } catch (error) {
    if (error?.response?.data?.message) return rejectWithValue(error.response.data.message);
    return rejectWithValue(error.message);
  }
})
