import apiClient from './index';   

export async function setRecoveryQuestions(data) {
  return apiClient
    .post('/questions/setquestions', data)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return Promise.reject();
    });
}

export async function searchUserQuestions(email) {
  return apiClient
    .get(`/questions/getuserquestions?email=${email}`)
    .then(response => {
      if (response && response.data) {
        return response.data;
      }
      return Promise.reject();
    });
}