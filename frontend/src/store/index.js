import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import projectReducer from './project/projectSlice';
import orgReducer from './organization/organizationSlice';
import userToolsReducer from './projectTool/userToolSlice';
import subscriptionReducer from './subscription/subscriptionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    orgDetails: orgReducer,
    userTools: userToolsReducer,
    subscription: subscriptionReducer,
  }
})