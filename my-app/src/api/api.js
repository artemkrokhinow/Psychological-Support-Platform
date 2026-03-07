const API_URL = "http://localhost:5000/api";

const getHeaders = () => ({
	"Content-Type": "application/json",
	"x-auth-token": localStorage.getItem("dr_token"),
});

export const api = {
	login: (data) =>
		fetch(`${API_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then((res) => res.json()),
	register: (data) =>
		fetch(`${API_URL}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then((res) => res.json()),
	getMaterials: () => fetch(`${API_URL}/materials`).then((res) => res.json()),
	createMaterial: (data) =>
		fetch(`${API_URL}/materials`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(data),
		}).then((res) => res.json()),
	updateMaterial: (id, data) =>
		fetch(`${API_URL}/materials/${id}`, {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(data),
		}).then((res) => res.json()),
	deleteMaterial: (id) =>
		fetch(`${API_URL}/materials/${id}`, {
			method: "DELETE",
			headers: getHeaders(),
		}).then((res) => res.json()),
	getScenarios: () => fetch(`${API_URL}/scenarios`).then((res) => res.json()),
	createScenario: (data) =>
		fetch(`${API_URL}/scenarios`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(data),
		}).then((res) => res.json()),
	updateScenario: (id, data) =>
		fetch(`${API_URL}/scenarios/${id}`, {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(data),
		}).then((res) => res.json()),
	deleteScenario: (id) =>
		fetch(`${API_URL}/scenarios/${id}`, {
			method: "DELETE",
			headers: getHeaders(),
		}).then((res) => res.json()),
	getScenarioById: (id) =>
		fetch(`${API_URL}/scenarios/${id}`).then((res) => res.json()),
};
