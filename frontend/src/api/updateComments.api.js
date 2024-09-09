import apiClient from "./index";

export async function addComment(data) {
  return apiClient
    .post(`/updateComment/addUpdatedComment`, data)
    .then((response) => {
      return response?.data;
    });
}


export async function getUpdatedComments(data) {
  return apiClient
    .get(
      `/updateComment/getUpdatedComments?projectId=${data.projectId}`
    )
    .then((response) => {
      return response?.data;
    });
}

