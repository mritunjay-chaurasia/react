import axios from 'axios';
import { LANGCHAIN_URL,BACKEND_URL } from '../constants';
import apiClient from './index';

export const readFolder = () => {
    return apiClient
        .post("/read/readFolder", {})
        .then((response) => {
            if (response.status) {
                return response.data;
            }
        });
};

export const getFolderData = (projectId) => {
    return apiClient
        .get(`${BACKEND_URL}/api/read/getFolderData/${projectId}`)
        .then((response) => {
            if (response.status) {
                return response.data;
            }
        });
};

export const readFile = (filePath) => {
  return apiClient
      .post(`${BACKEND_URL}/api/read/readFile`,{
        filePath:filePath
      })
      .then((response) => {
          if (response.status) {
              return response.data;
          }
      });
};

export const createRouteStructure = (data) => {
  return apiClient
      .post(`${BACKEND_URL}/api/read/createRouteStructure`, data)
      .then((response) => {
          if (response.status) {
              return response.data;
          }
      });
};

// export const postToFlowChart = async (data) =>
// {
//   try {
//      const response =  await axios.post(`${LANGCHAIN_URL}/flowchart`,data);
//      if (response.data)
//      {
//         return response.data
//      }
//   } catch (error) {
//     console.log('error while posting to flow chart',error);
//     return false;
//   }
// }

export const getdocumentationPath = async (data) =>
{
  try {
     const response =  await axios.post(`${LANGCHAIN_URL}/documentation`,data);
     if (response.data)
     {
        return response.data
     }
  } catch (error) {
    console.log('error while posting to flow chart',error);
    return false;
  }
}

export const getSvgPath = async (data) =>
{
  try {
     const response =  await axios.post(`${LANGCHAIN_URL}/flowchart`,data);
     if (response.data)
     {
        return response.data
     }
  } catch (error) {
    console.log('error while posting to flow chart',error);
    return false;
  }
}



export const getSvg = async (svgPath) =>
{
  try {
     const response =  await axios.post(`${LANGCHAIN_URL}/getSvg`,{svgPath:svgPath});
     if (response.data)
     {
        return response.data
     }
  } catch (error) {
    console.log('error while getting flow chart',error);
    return false;
  }
}

export const getDoc = async (docPath) =>
{
  try {
     const response =  await axios.post(`${LANGCHAIN_URL}/getDoc`,{docPath:docPath});
     if (response.data)
     {
        return response.data
     }
  } catch (error) {
    console.log('error while getting documentation',error);
    return false;
  }
}

export const searchDocs = (data) => {
  return apiClient
      .get(`/read/searchDocs?searchText=${data.searchText}&projectId=${data.projectId}`)
      .then((response) => {
          if (response.status) {
              return response.data;
          }
      });
};

export const getCodeLogic = (data) => {
  return apiClient
      .post(`/read/getCodeLogic`, data)
      .then((response) => {
          if (response.status) {
              return response.data;
          }
      });
};

export const createNewPythonProjectStructure = (data) => {
  return apiClient
      .post(`/read/createNewPythonProjectStructure`, data)
      .then((response) => {
          if (response.status) {
              return response.data;
          }
      });
};

export const createNewNodeProjectStructure = (data) => {
  return apiClient
      .post(`/read/createNewNodeProjectStructure`, data)
      .then((response) => {
          if (response.status) {
              return response.data;
          }
      });
};

export const saveNewProjectStructure = (data) => {
  return apiClient
      .post(`/read/saveNewProjectStructure`, data)
      .then((response) => {
          if (response.status) {
              return response.data;
          }
      });
};