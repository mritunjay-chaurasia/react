import axios from 'axios';
import { LANGCHAIN_URL, USER_TOKEN } from '../constants';

const apiClient = axios.create({
    baseURL: `${LANGCHAIN_URL}/`
})

apiClient.interceptors.request.use((request) => {
    const accessToken = localStorage.getItem(USER_TOKEN);

    if (accessToken) {
        request.headers.authentication = `Bearer ${accessToken}`;
    }

    return request;
});

export async function wireframeData(data) {
  return apiClient
    .post(`/wireframe-data`, data)
    .then(response => {
      return response?.data
    })
}

export async function editWireframeData(data) {
  return apiClient
    .post(`/edit-wireframe-data`, data)
    .then(response => {
      return response?.data
    })
}
export async function html_to_image(data) {
  console.log("html>>>>>>>>>>>> api",data)
  return apiClient
    .post(`/html_to_image`, data)
    .then(response => {
      return response?.data
    })
}


