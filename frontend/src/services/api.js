import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://chute-ruckus-reproduce.ngrok-free.dev'

const api = axios.create({ baseURL: API_BASE_URL })

// Inject admin token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Auth (admin only) ───
export const authService = {
  adminLogin: async (data) => (await api.post('/auth/admin/login', data)).data,
}

// ─── Complaints (public) ───
export const complaintService = {
  submitComplaint: async (formData) => (await api.post('/api/complaints', formData)).data,
  getComplaints: async (params = {}) => (await api.get('/api/complaints', { params })).data,
  getComplaintById: async (id) => (await api.get(`/api/complaints/${id}`)).data,
  trackComplaint: async (params) => (await api.get('/api/complaints/track', { params })).data,
  getDashboardStats: async () => (await api.get('/dashboard/stats')).data,
  getCategoryStats: async () => (await api.get('/dashboard/categories')).data,
  getPriorityStats: async () => (await api.get('/dashboard/priorities')).data,
}

// ─── Admin (protected) ───
export const adminService = {
  getComplaints: async (params = {}) => (await api.get('/admin/complaints', { params })).data,
  updateComplaint: async (id, data) => (await api.patch(`/admin/complaints/${id}`, null, { params: data })).data,
  getStats: async () => (await api.get('/admin/stats')).data,
}

export default api
