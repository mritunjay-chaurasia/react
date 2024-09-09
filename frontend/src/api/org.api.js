import apiClient from "./index";

export async function getOrgDetails() {
  return apiClient.get(`/org/getOrgDetails`).then((response) => {
    return response?.data;
  });
}

export async function addOrganization(data) {
  return apiClient.post(`/org/addOrganization`, data).then((response) => {
    return response?.data;
  });
}

export async function updateOrganization(data) {
  return apiClient.put(`/org/updateOrganization`, data).then((response) => {
    return response?.data;
  });
}

export async function deleteOrganization(orgId) {
  return apiClient.delete(`/org/deleteOrganization?orgId=${orgId}`).then((response) => {
    return response?.data;
  });
}

export async function getAllOrgDetails(data) {
  return apiClient.get(`/org/getAllOrgDetails?page=${data.page}&limit=${data.limit}&searchText=${data.searchText}`).then((response) => {
    return response?.data;
  });
}

export async function getAllOrgDetailsOwner(data) {
  console.log("getAllOrgDetailsOwner :: ::",data)
  return apiClient.get(`/org/getAllOrgDetailsOwner?page=${data.page}&limit=${data.limit}&searchText=${data.searchText}`).then((response) => {
    return response?.data;
  });
}


export async function getOrgDetailsById(data) {
  console.log('getOrgDetailsById ::::::',data);
  return apiClient.get(`/org/getAllOrgDetailsById?id=${data.id}&page=${data.page}&limit=${data.limit}`).then((response) => {
    return response?.data;
  });
}