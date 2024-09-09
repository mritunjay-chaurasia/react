import apiClient from './index';


/**
* Function will fetch Previous Chat Session's Chats
* @params = projectId(type:int), sessionid(type:String)
* @response : api response
* @author : Mandeep Singh
*/
export async function getAllUsers(data) {
  return apiClient
    .get(`/superAdmin/getAllUsers?page=${data.page}&limit=${data.limit}&searchText=${data.searchText}`)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}


/**
* Function will fetch Previous Chat Session's Chats
* @params = projectId(type:int), sessionid(type:String)
* @response : api response
* @author : Mandeep Singh
*/
export async function getUserOrgDetailsById(userId) {
  return apiClient.get(`/org/getOrgDetailsById?id=${userId}`).then((response) => {
    return response?.data;
  });
}

/**
* Function will fetch Previous Chat Session's Chats
* @params = data = object (it contains users all project ids)
* @response : api response
* @author : Mandeep Singh
*/
export async function getAllRepos(data) {
  return apiClient
    .post(`/superAdmin/getAllRepos`, data)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}

export async function getAllDocs(data) {
  return apiClient
    .get(`/superAdmin/getAllDocs?page=${data.page}&limit=${data.limit}&searchText=${data.searchText}`)
    .then(response => {
      return response?.data;
    });
}

// ==========================================================================================================================================
// Work Order API

export async function getWorkOrderHistory(data) {
  return apiClient
    .get(`/workorder/getWorkOrderHistory?page=${data.page}&limit=${data.limit}&searchText=${data.searchText}`)
    .then(response => {
      return response?.data;
    });
}



