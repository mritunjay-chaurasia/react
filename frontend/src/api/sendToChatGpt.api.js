import apiClient from "./index";

export const sendToChatGpt = async (msgToSend, apiKey, caller) => {
    try {
        let response = await apiClient.post("/chatGpt/sendToChatGpt", {
            msgToSend: msgToSend,
            apiKey: apiKey,
            caller: caller,
        });
        if (response.data) {
            return response;
        }
    } catch (error) {
        console.log(error);
    }
};
