const API_BASE = '/api';

export const api = {
  // Roles
  getRoles: () => fetch(`${API_BASE}/roles`).then(r => r.json()),
  createRole: (data) => fetch(`${API_BASE}/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateRole: (id, data) => fetch(`${API_BASE}/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteRole: (id) => fetch(`${API_BASE}/roles/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),

  // Resources
  getResources: () => fetch(`${API_BASE}/resources`).then(r => r.json()),
  createResource: (data) => fetch(`${API_BASE}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateResource: (id, data) => fetch(`${API_BASE}/resources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteResource: (id) => fetch(`${API_BASE}/resources/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),

  // Templates
  getTemplates: () => fetch(`${API_BASE}/templates`).then(r => r.json()),
  getTemplate: (id) => fetch(`${API_BASE}/templates/${id}`).then(r => r.json()),
  createTemplate: (data) => fetch(`${API_BASE}/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateTemplate: (id, data) => fetch(`${API_BASE}/templates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteTemplate: (id) => fetch(`${API_BASE}/templates/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),

  // Projects
  getProjects: () => fetch(`${API_BASE}/projects`).then(r => r.json()),
  getProject: (id) => fetch(`${API_BASE}/projects/${id}`).then(r => r.json()),
  createProject: (data) => fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateProject: (id, data) => fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteProject: (id) => fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),
};
