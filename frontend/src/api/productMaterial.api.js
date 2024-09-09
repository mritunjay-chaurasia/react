import apiClient from "./index";

export async function addProductDocs(data) {
  return apiClient
    .post(`/productMaterial/addProductDocs`, data)
    .then((response) => {
      return response?.data;
    });
}

export async function fetchProductDocs(data) {
    return apiClient
      .get(`/productMaterial/getProductDocs?projectId=${data.projectId}&page=${data.page}&limit=${data.limit}`)
      .then((response) => {
        return response?.data;
      });
  }
