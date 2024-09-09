import apiClient from './index';

export async function getOrgToken(projectId) {
  return apiClient
    .get(`/tokens/${projectId}`)
    .then(response => {
      return response?.data;
    });
}

export async function addOrUpdateAiKey(projectId, keyData) {
  return apiClient
    .put(`/tokens/updateToken?projectId=${projectId}`, keyData)
    .then(response => {
      return response?.data;
    });
}