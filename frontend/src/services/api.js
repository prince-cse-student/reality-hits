import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: API_BASE_URL })

// Inject admin token + ngrok header on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Required for ngrok free tier to skip interstitial page
  config.headers['ngrok-skip-browser-warning'] = 'true'
  return config
})

// ─── Auth (admin only) ───
export const authService = {
  adminLogin: async (data) => (await api.post('/api/auth/admin/login', data)).data,
}

// ─── Complaints (public) ───
export const complaintService = {
  submitComplaint: async (formData) => (await api.post('/api/complaints', formData)).data,
  getComplaints: async (params = {}) => (await api.get('/api/complaints', { params })).data,
  getComplaintById: async (id) => (await api.get(`/api/complaints/${id}`)).data,
  trackComplaint: async (params) => (await api.get('/api/complaints/track', { params })).data,
  getDashboardStats: async () => (await api.get('/api/dashboard/stats')).data,
  getCategoryStats: async () => (await api.get('/api/dashboard/categories')).data,
  getPriorityStats: async () => (await api.get('/api/dashboard/priorities')).data,
}

// ─── Admin (protected) ───
export const adminService = {
  getComplaints: async (params = {}) => (await api.get('/api/admin/complaints', { params })).data,
  updateComplaint: async (id, data) => (await api.patch(`/api/admin/complaints/${id}`, null, { params: data })).data,
  getStats: async () => (await api.get('/api/admin/stats')).data,
}

export default api
