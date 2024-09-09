import apiClient from './index';

/**
 * This Function Save Git token and return it
 * @params =  None
 * @response : None
 * @author : Mandeep Singh
 */
export async function saveGitTokenToDb(data) {
  return apiClient.post(`/git/saveGitTokenToDb`, data).then((response) => {
    return response?.data;
  });
}

/**
 * This Function commit changes to git repo
 * @params =  None
 * @response : None
 * @author : Mandeep Singh
 */
export async function updateGitHubFile(data) {
  return apiClient.post(`/git/updateGitHubFile`, data).then((response) => {
    return response?.data;
  });
}