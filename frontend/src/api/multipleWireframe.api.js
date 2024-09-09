import apiClient from './index';

export async function addWireframeScreen(data) {
    return apiClient
      .post(`/wireframeScreen/addWireframScreen`, data)
      .then(response => {
        return response?.data
      })
  }

  export async function getAllWireFramesData(data) {
    return apiClient
    .post(`/wireframeScreen/fetchAllWireFramesData`,data)
      .then(response => {
        return response?.data
      })
  }


  export async function removeWireframeById(data) {
    return apiClient
    .post(`/wireframeScreen/deleteWireframeScreen`, data)
      .then(response => {
        return response?.data
      })
  }

  export async function removeAllWireframe(data) {
    return apiClient
    .delete(`/wireframeScreen/deleteAllWireframeScreen`, data)
      .then(response => {
        return response?.data
      })
  }