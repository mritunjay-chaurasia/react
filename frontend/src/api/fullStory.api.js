import apiClient from "./index";

export async function getEvents(data) {
  return apiClient.get(`/fullStory/getEvents?limit=${data.limit}&page=${data.page}`).then((response) => {
    return response?.data;
  });
}