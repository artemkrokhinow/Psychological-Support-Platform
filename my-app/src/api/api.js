const API_URL = '/api';

const jsonHeaders = { 'Content-Type': 'application/json' };

export const authAPI = {
    login: (creds) => fetch(`${API_URL}/auth/login`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(creds) }).then(res => res.json()),
    register: (data) => fetch(`${API_URL}/auth/register`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) }).then(res => res.json()),
    logout: () => fetch(`${API_URL}/auth/logout`).then(res => res.json())
};

export const contentAPI = {
    getMaterials: () => fetch(`${API_URL}/materials`).then(res => res.json()),
    createMaterial: (data) => fetch(`${API_URL}/materials`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) }).then(res => res.json())
};

export const scenarioAPI = {
    getScenario: (id) => fetch(`${API_URL}/scenarios/${id}`).then(res => res.json()),
    createScenario: (data) => fetch(`${API_URL}/scenarios`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) }).then(res => res.json())
};

export const userAPI = {
    getProfile: () => fetch(`${API_URL}/user/current`).then(res => res.json())
};