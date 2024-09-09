import apiClient from "./index";

export async function createWikiPageData(data) {
    return apiClient.post(`/wikiPage/createWikiPage`, data).then((response) => {
        return response?.data;
    });
}

export async function getWikiPageData(data) {
    return apiClient.post(`/wikiPage/getWikiPage`, data).then((response) => {
        return response?.data;
    });
}

export async function updateWikiDetails(data) {
    return apiClient.post(`/wikiPage/updateWikiDetails`, data).then((response) => {
        return response?.data;
    });
}

export async function deleteWikiDetails(data) {
    console.log("data deleted",data)
    return apiClient.delete(`/wikiPage/deleteWikiDetails?id=${data}`).then((response) => {
        return response?.data;
    });
}