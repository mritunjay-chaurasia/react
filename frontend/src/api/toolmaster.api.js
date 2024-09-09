import apiClient from './index';

export async function getAllToolTypes() {
  return apiClient
    .get('/tools/getalltooltypes')
    .then(response => {
      return response.data;
    });
}