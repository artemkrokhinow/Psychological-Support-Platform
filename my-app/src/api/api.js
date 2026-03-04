const API_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('dr_token')
});

export const authAPI = {
    login: (credentials) => 
        fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(res => res.json()),

    register: (userData) => 
        fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        }).then(res => res.json()),

    guestLogin: () => 
        fetch(`${API_URL}/auth/guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
};

export const userAPI = {
    saveDiagnostic: (answers) => 
        fetch(`${API_URL}/user/save-diagnostic`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ answers })
        }).then(res => res.json()),

    getProfile: () => 
        fetch(`${API_URL}/user/current`, {
            headers: getHeaders()
        }).then(res => res.json())
};

export const contentAPI = {
    getMaterials: () => 
        fetch(`${API_URL}/materials`).then(res => res.json()),

    getScenario: (id) => 
        fetch(`${API_URL}/scenarios/${id}`).then(res => res.json())
};