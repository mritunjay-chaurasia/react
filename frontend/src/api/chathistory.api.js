import apiClient from './index';

export async function getChatHistory(data) {
  return apiClient
    .get(`/chatHistory/chatList?projectid=${data.projectId}&page=${data.page}&limit=${data.limit}&searchText=${data.searchText}`)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return false
    });
}

export async function aiChatfeedback(data) {
  return apiClient
    .post(`/chatHistory/aiChatfeedback`, data)
    .then(response => {
      return response?.data;
    });
}

/**
* Function will fetch Previous Chat Session's Chats
* @params = projectId(type:int), sessionid(type:String)
* @response : api response
* @author : Mandeep Singh
*/
export const loadPreviousChatSession = (projectId, sessionId) => {
  if (!projectId || !sessionId) {
    return;
  }
  return apiClient.get(`/chatHistory/loadPreviousChatSession?projectId=${projectId}&sessionId=${sessionId}`).then(response => {
    if (response.status) {
      return response.data;
    }
    return false;
  });
}
