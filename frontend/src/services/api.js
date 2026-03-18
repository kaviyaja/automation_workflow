import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// ── Workflows ──────────────────────────────────────────────
export const getWorkflows = () => API.get("/workflows");

export const createWorkflow = (data) => API.post("/workflows", data);

export const updateWorkflow = (id, data) => API.put(`/workflows/${id}`, data);

// ── Steps ──────────────────────────────────────────────────
export const getSteps = (workflowId) => API.get(`/steps/${workflowId}`);

export const createStep = (workflowId, data) =>
  API.post(`/steps/${workflowId}`, data);

export const updateStep = (stepId, data) =>
  API.put(`/steps/${stepId}`, data);

export const deleteStep = (stepId) => API.delete(`/steps/${stepId}`);

// ── Rules ──────────────────────────────────────────────────
export const getRules = (stepId) => API.get(`/rules/${stepId}`);

export const createRule = (stepId, data) =>
  API.post(`/rules/${stepId}`, data);

export const updateRule = (ruleId, data) =>
  API.put(`/rules/${ruleId}`, data);

export const deleteRule = (ruleId) => API.delete(`/rules/${ruleId}`);

// ── Executions ─────────────────────────────────────────────
export const executeWorkflow = (workflowId, data) =>
  API.post(`/executions/workflows/${workflowId}/execute`, data);

export const getExecution = (executionId) =>
  API.get(`/executions/${executionId}`);

export default API;