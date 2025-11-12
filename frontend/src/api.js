// SSSN — API helper
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchSurveys() {
  const r = await fetch(`${API_BASE}/api/surveys`);
  return r.json();
}

export async function createSurvey(data) {
  const r = await fetch(`${API_BASE}/api/surveys`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  });
  return r.json();
}

export async function updateSurvey(id, data) {
  const r = await fetch(`${API_BASE}/api/surveys/${id}`, {
    method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  });
  return r.json();
}

export async function deleteSurvey(id) {
  const r = await fetch(`${API_BASE}/api/surveys/${id}`, { method: 'DELETE' });
  return r.json();
}
