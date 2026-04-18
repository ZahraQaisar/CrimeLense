import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ── Axios instance with auth token injection ──────────────────────────────────
const api = axios.create({
  baseURL: API_BASE,
  timeout: 35000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cl_token');
      localStorage.removeItem('cl_user');
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }).then(r => r.data),

  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data),

  me: () =>
    api.get('/auth/me').then(r => r.data),

  logout: () =>
    api.post('/auth/logout').then(r => r.data),
};

// ── Predictions ───────────────────────────────────────────────────────────────
export const predictionService = {
  /**
   * Get full ML prediction: risk level + crime category + severity
   * @param {Object} inputs - { latitude, longitude, hour?, month?, weapon_used? }
   */
  predict: (inputs) =>
    api.post('/predictions', inputs).then(r => r.data),

  /**
   * Get prediction history (admin only)
   */
  history: (page = 1) =>
    api.get(`/predictions/history?page=${page}`).then(r => r.data),
};

// ── Hotspots & Static Data ────────────────────────────────────────────────────
export const dataService = {
  /**
   * Get all DBSCAN hotspot zones (36 clusters)
   * @param {string} tier - optional filter: LOW | MEDIUM | HIGH | CRITICAL
   */
  getHotspots: (tier = null) => {
    const url = tier ? `/hotspots?tier=${tier}` : '/hotspots';
    return api.get(url).then(r => r.data);
  },

  getAreaProfiles: () =>
    api.get('/hotspots/area-profiles').then(r => r.data),

  getHourlyTrends: () =>
    api.get('/hotspots/trends/hourly').then(r => r.data),

  getMonthlyTrends: () =>
    api.get('/hotspots/trends/monthly').then(r => r.data),

  getModelMetadata: () =>
    api.get('/hotspots/metadata').then(r => r.data),
};

// ── Users (admin) ─────────────────────────────────────────────────────────────
export const userService = {
  list: (page = 1) =>
    api.get(`/users?page=${page}`).then(r => r.data),

  changeRole: (id, role) =>
    api.patch(`/users/${id}/role`, { role }).then(r => r.data),

  deleteUser: (id) =>
    api.delete(`/users/${id}`).then(r => r.data),

  updateProfile: (updates) =>
    api.patch('/users/profile', updates).then(r => r.data),
};

export default api;
