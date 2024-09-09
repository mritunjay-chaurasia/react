import apiClient from './index';

export async function getAllProjects(orgid) {
  return apiClient
    .get(`/userProject/getAllProjects?orgid=${orgid}`)
    .then(response => {
      return response?.data
    })
}

export async function updateProjectSettings(data) {
  return apiClient
    .patch(`/userProject/updateProjectSettings`, data)
    .then(response => {
      return response?.data;
    })
}

export async function addProject(data) {
  return apiClient
    .post(`/userProject/addProject`, data)
    .then(response => {
      return response?.data;
    })
}

export async function updateProject(data) {
  return apiClient
    .put(`/userProject/updateProject`, data)
    .then(response => {
      return response?.data;
    })
}

export async function deleteProject(projectId) {
  return apiClient
    .delete(`/userProject/deleteProject?projectId=${projectId}`)
    .then(response => {
      return response?.data;
    })
}


export async function loadProject(projectId) {
  return apiClient
    .get(`/userProject/loadProject?projectId=${projectId}`)
    .then(response => {
      return response?.data;
    })
}

export async function updateUserProject(data) {
  return apiClient
    .put(`/userProject/updateUserProject`, data)
    .then(response => {
      return response?.data;
    })
}

export async function getFunctionList(projectId) {
  return apiClient
    .get(`/userProject/getFunctionList?projectId=${projectId}`)
    .then(response => {
      return response?.data;
    })
}

export async function addFunctionList(data) {
  return apiClient
    .post(`/userProject/addFunctionList`, data)
    .then(response => {
      return response?.data;
    })
}

export async function updateFunctionList(data) {
  return apiClient
    .put(`/userProject/updateFunctionList`, data)
    .then(response => {
      return response?.data;
    })
}

export async function deleteFunctionList(projectId) {
  return apiClient
    .delete(`/userProject/deleteFunctionList?projectId=${projectId}`)
    .then(response => {
      return response?.data;
    })
}

export async function generateAPIList(data) {
  return apiClient
    .post(`/userProject/generateAPIList`, data)
    .then(response => {
      return response?.data;
    })
}