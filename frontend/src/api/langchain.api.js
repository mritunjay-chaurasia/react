import axios from 'axios';
import { LANGCHAIN_URL, USER_TOKEN } from '../constants';

const apiClient = axios.create({
    baseURL: `${LANGCHAIN_URL}/`
})

apiClient.interceptors.request.use((request) => {
    const accessToken = localStorage.getItem(USER_TOKEN);

    if (accessToken) {
        request.headers.authentication = `Bearer ${accessToken}`;
    }

    return request;
});

export async function aiApi(data) {
    return apiClient
        .post('/ai_api', data)
        .then(response => {
            return response?.data;
        });
}

export async function codeUpdate(data) {
    return apiClient
        .post('/code_updation', data)
        .then(response => {
            return response?.data;
        });
}

export async function createcollection(data ) {
    return apiClient
        .post('/create_collection', data)
        .then(response => {
            return response?.data;
        });
}

export async function usermanual(data ) {
    return apiClient
        .post('/generate_work_order', data)
        .then(response => {
            return response?.data;
        });
}

export async function queryVectorCll(data ) {
    return apiClient
        .post('/query_vector_cll', data)
        .then(response => {
            return response?.data;
        });
}

export async function getPreviewData(data ) {
    return apiClient
        .post('/get_preview_data', data)
        .then(response => {
            return response?.data;
        });
}

export async function assistantTask(data ) {
    return apiClient
        .post('/generate_task_with_assistant', data)
        .then(response => {
            return response?.data;
        });
}

export async function generateSuggestion(data ) {
    return apiClient
        .post('/suggested_implimentation_generator', data)
        .then(response => {
            return response?.data;
        });
}

export async function generateSuggestionv2(data ) {
    return apiClient
        .post('/suggested_implementation_v2', data)
        .then(response => {
            return response?.data;
        });
}

export async function solutionSummaryFlowchart(data ) {
    return apiClient
        .post('/solution_summary_flowchart', data)
        .then(response => {
            return response?.data;
        });
}

export async function productAgentBot(data ) {
    return apiClient
        .post('/product_agent_bot', data)
        .then(response => {
            return response?.data;
        });
}

export async function architectureBot(data ) {
    return apiClient
        .post('/architecture_bot', data)
        .then(response => {
            return response?.data;
        });
}

export async function developerBot(data ) {
    return apiClient
        .post('/developer_bot', data)
        .then(response => {
            return response?.data;
        });
}

// Repo Flow APIs
export async function getRepoFlow(projectId ) {
    return apiClient
        .get(`/get_repo_flow?projectId=${projectId}`)
        .then(response => {
            return response?.data;
        });
}

export async function restartRepoFlow(projectId ) {
    return apiClient
        .get(`/restart_flow?projectId=${projectId}`)
        .then(response => {
            return response?.data;
        });
}

export async function userSoution(data ) {
    return apiClient
        .post('/new_user_solution', data)
        .then(response => {
            return response?.data;
        });
}

export async function generateCode(data ) {
    return apiClient
        .post('/new_user_repository_creator', data)
        .then(response => {
            return response?.data;
        });
}

export async function downloadCode(projectId ) {
    return apiClient
        .get(`/download-zip?projectId=${projectId}`)
        .then(response => {
            return response?.data;
        });
}

export async function fetchReactToolRoutes(data ) {
    return apiClient
        .post('/fetch_routes', data)
        .then(response => {
            return response?.data;
        });
}

export async function getRoutesDocumentation(data ) {
    return apiClient
        .post('/routes_documentation', data)
        .then(response => {
            return response?.data;
        });
}

export async function createSingleDoc(data) {
    return apiClient
        .post('/create_single_doc', data)
        .then(response => {
            return response?.data;
        });
}

export async function createFormattedDoc(data) {
    return apiClient
        .post('/create_formatted_doc', data)
        .then(response => {
            return response?.data;
        });
}

export async function createUserflowDoc(data) {
    return apiClient
        .post('/create_userflow_doc', data)
        .then(response => {
            return response?.data;
        });
}

export async function createFormattedControlDoc(data) {
    return apiClient
        .post('/create_formatted_control_doc', data)
        .then(response => {
            return response?.data;
        });
}

export async function makeCodeChanges(data) {
    return apiClient
        .post('/make_code_changes', data)
        .then(response => {
            return response?.data;
        });
}

export async function makeCodeChangesTwo(data) {
    return apiClient
        .post('/make_code_changes_two', data)
        .then(response => {
            return response?.data;
        });
}

export async function getBusinessFlow(projectId) {
    return apiClient
        .get(`/get_business_flow?projectId=${projectId}`)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApi(data) {
    return apiClient
        .post(`/test_node_api`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiTwo(data) {
    return apiClient
        .post(`/test_node_api_two`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiThree(data) {
    return apiClient
        .post(`/test_node_api_three`, data)
        .then(response => {
            return response?.data;
        });
}

// export async function testNodeApiFour(data) {
//     return apiClient
//         .post(`/test_node_api_four`, data)
//         .then(response => {
//             return response?.data;
//         });
// }

export async function testNodeApiFive(data) {
    return apiClient
        .post(`/test_node_api_five`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiSix(data) {
    return apiClient
        .post(`/test_node_api_six`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiCurrentApiChange(data) {
    return apiClient
        .post(`/test_node_api_current_api_change`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiCompleteCode(data) {
    return apiClient
        .post(`/test_node_api_complete_code`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiCompleteCodeUpdate(data) {
    return apiClient
        .post(`/test_node_api_complete_code_update`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiTestCode(data) {
    return apiClient
        .post(`/test_node_api_test_code`, data)
        .then(response => {
            return response?.data;
        });
}


export async function testNodeApiTestPythonCode(data) {
    return apiClient
        .post(`/test_node_api_test_python_code`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiTestNodeCode(data) {
    return apiClient
        .post(`/test_node_api_test_node_code`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiTestPythonCodeStructure(data) {
    return apiClient
        .post(`/test_node_api_test_python_code_structure`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiTestNodeCodeStructure(data) {
    return apiClient
        .post(`/test_node_api_test_node_code_structure`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiTestGenerateStepCode(data) {
    return apiClient
        .post(`/test_node_api_generate_step_code`, data)
        .then(response => {
            return response?.data;
        });
}

export async function testNodeApiCompleteApiSteps(data) {
    return apiClient
        .post(`/test_node_api_complete_api_steps`, data)
        .then(response => {
            return response?.data;
        });
}

export async function createStepsForFunction(data) {
    return apiClient
        .post(`/create_steps_for_function`, data)
        .then(response => {
            return response?.data;
        });
}