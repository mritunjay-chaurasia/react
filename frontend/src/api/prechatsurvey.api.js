import apiClient from './index';   

export async function getPreChatSurveyData(id) {
    
    return apiClient
      .get(`surveyData/getUserData/${id}`)
      .then(response => {
        if (response && response.data) {
          return response.data;
        }
        return false
      });
}