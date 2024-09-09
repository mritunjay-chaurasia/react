import apiClient from "./index";

export async function createWorkOrder(data) {
  return apiClient.post(`/workorder/createWorkOrder`, data).then((response) => {
    return response?.data;
  });
}

export async function changeWorkOrderStatus(data) {
  return apiClient
    .post(`/workorder/changeWorkOrderStatus`, data)
    .then((response) => {
      return response?.data;
    });
}

export async function getOrgWorkOrderList(data) {
  const filterCreatedDateString = JSON.stringify(data.filterCreatedDate);
  return apiClient
    .get(
      `/workorder/getOrgWorkOrderList?orgId=${data.orgId}&projectId=${data.projectId}&page=${data.page}&limit=${data.limit}&searchText=${data.searchText}&filterReporterUser=${data.filterReporterUser}&filterMode=${data.filterMode}&filterStatusData=${data.filterStatusData}&filterAssignToData=${data.filterAssignToData}&filterCreatedDate=${filterCreatedDateString}`
    )
    .then((response) => {
      return response?.data;
    });
}


export async function getWorkOrderHistory(data) {
  console.log('getWorkOrderHistory :: in ',data)
  return apiClient
    .get(
      `/workorder/getWorkOrderHistory?workOrderId=${data}`
    )
    .then((response) => {
      return response?.data;
    });
}

export async function getOrgWorkOrder(data) {
  return apiClient
    .get(
      `/workorder/getOrgWorkOrder?orgId=${data.orgId}&workOrderId=${data.workOrderId}`
    )
    .then((response) => {
      return response?.data;
    });
}

export async function regenerateWorkOrder(data) {
  return apiClient
    .get(
      `/workorder/regenerateWorkOrder?orgId=${data.orgId}&workOrderId=${data.workOrderId}&newQuery=${data.newQuery}`
    )
    .then((response) => {
      return response?.data;
    });
}

export async function getAllOrgUsers(orgId) {
  return apiClient
    .get(`/workorder/getAllOrgUsers?orgId=${orgId}`)
    .then((response) => {
      return response?.data;
    });
}

export async function assignTicketToUser(data) {
  return apiClient
    .post(`/workorder/assignTicketToUser`, data)
    .then((response) => {
      return response?.data;
    });
}

export async function updateTicket(data) {
  return apiClient.post(`/workorder/updateTicket`, data).then((response) => {
    return response?.data;
  });
}


// Comment
export async function addComment(data) {
  return apiClient
    .post(`/workorder/comment/addComment`, data)
    .then((response) => {
      return response?.data;
    });
}


