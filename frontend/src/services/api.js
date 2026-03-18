import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000",
});

export const getWorkflows = () => API.get("/workflows");

export const createWorkflow = (data) =>
    API.post("/workflows", data);

export const getSteps = (workflowId) =>
    API.get(`/steps/${workflowId}`);

export const createStep = (workflowId, data) =>
    API.post(`/steps/${workflowId}`, data);

export const getRules = (stepId) =>
    API.get(`/rules/${stepId}`);

export const createRule = (stepId, data) =>
    API.post(`/rules/${stepId}`, data);

export const executeWorkflow = (workflowId, data) =>
    API.post(`/executions/workflows/${workflowId}/execute`, data);

export const getExecution = (executionId) =>
    API.get(`/executions/${executionId}`);