import axios from 'axios';
import {BACKEND_URL, USER_TOKEN} from '../constants';
// import { useHistory } from 'react-router-dom';


const apiClient = axios.create({
    baseURL: `${BACKEND_URL}/api`
})

apiClient.interceptors.request.use((request) => {
    const accessToken = localStorage.getItem(USER_TOKEN);

    if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if the response status is 401 (Unauthorized)
        if (error.response && error.response.status === 401 && error.response.data?.message === 'Unauthorised') {
            localStorage.removeItem('userChatSessionId');
            localStorage.removeItem(USER_TOKEN);
            localStorage.removeItem('loginNotificationDone');
            window.location = "/login"
            return
        }
        return Promise.reject(error);
    }
);

export default apiClient;
