import apiClient from "./index";

export async function fetchSubscriptionDetails(orgId) {
  return apiClient.get(`/stripe/fetchSubscriptionDetails?orgId=${orgId}`).then((response) => {
    return response?.data;
  });
}

export async function getAllPlans() {
  return apiClient.get(`/stripe/subscriptions`).then((response) => {
    return response?.data;
  });
}

export async function addCustomerCard(data) {
  return apiClient.post(`/stripe/addCustomerCard`, data).then((response) => {
    return response?.data;
  });
}