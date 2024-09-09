import apiClient from './index';

export async function addTool(data) {
  return apiClient
    .post('/tools/addUserTool', data)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return Promise.reject();
    });
}

export async function getProjectTools(projectid) {
  return apiClient
    .get(`/tools/getProjectTools?projectid=${projectid}`)
    .then(response => {
      return response?.data
    })
}

export async function updateTool(data) {
  return apiClient
    .put(`/tools/updateFields`, data)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}

export async function deleteTool(toolId, projectId) {
  return apiClient
    .delete(`/tools/deleteTool/${projectId}/${toolId}`)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}

export async function getGitAcessCode(code, client_id, redirect_uri, client_secret) {
  return apiClient
    .post(`/tools/getGitAcessCode`,
      {
        code,
        client_id,
        redirect_uri,
        client_secret
      })
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}

export async function cloneGithub(data) {
  return apiClient
    .post(`/tools/cloneGithub`, data)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}

export async function getClonedRepo(data) {
  return apiClient
    .post(`/tools/getClonedRepo`, data)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}

export async function saveClonedRepoFile(data) {
  return apiClient
    .post(`/tools/saveClonedRepoFile`, data)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}