import apiClient from "./index";

export async function createSupportUserAccount(data) {
  return apiClient
    .post(`/supportUser/supportUserAccount`, data)
    .then((response) => {
      return response?.data;
    });
}
