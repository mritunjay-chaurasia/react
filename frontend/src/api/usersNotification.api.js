import apiClient from "./index";

export async function addUsersNotification(data) {
    return apiClient
      .post(`/userNotification/addUsersNotification`, data)
      .then((response) => {
        return response?.data;
      });
  }


export async function fetchUsersNotification(data) {
    return apiClient
      .post(
        `/userNotification/fetchUsersNotification`,data
      )
      .then((response) => {
        return response?.data;
      });
  }

  export async function updateNotification(data) {
    return apiClient
      .post(
        `/userNotification/updateNotification`,data)
      .then((response) => {
        return response?.data;
      });
  }