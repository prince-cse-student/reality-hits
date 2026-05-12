import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'reality-hits-backend.vercel.app'

const api = axios.create({ baseURL: API_BASE_URL })

// Inject admin token + ngrok header on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Required for ngrok free tier to skip interstitial page
  config.headers['ngrok-skip-browser-warning'] = 'true'
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cv_token')
      localStorage.removeItem('cv_admin')
      window.dispatchEvent(new Event('cv:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export const resolveUploadUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const base = API_BASE_URL || window.location.origin
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

// ─── Auth (admin only) ───
export const authService = {
  adminLogin: async (data) => (await api.post('/api/auth/admin/login', data)).data,
}

// ─── Complaints (public) ───
export const complaintService = {
  submitComplaint: async (formData) => (await api.post('/api/complaints', formData)).data,
  getComplaintById: async (id) => (await api.get(`/api/complaints/${id}`)).data,
  trackComplaint: async (params) => (await api.get('/api/complaints/track', { params })).data,
  getDashboardStats: async () => (await api.get('/api/dashboard/stats')).data,
  getCategoryStats: async () => (await api.get('/api/dashboard/categories')).data,
  getPriorityStats: async () => (await api.get('/api/dashboard/priorities')).data,
}

// ─── Admin (protected) ───
export const adminService = {
  getComplaints: async (params = {}) => (await api.get('/api/admin/complaints', { params })).data,
  getComplaintById: async (id) => (await api.get(`/api/admin/complaints/${id}`)).data,
  updateComplaint: async (id, data) => (await api.patch(`/api/admin/complaints/${id}`, null, { params: data })).data,
  getStats: async () => (await api.get('/api/admin/stats')).data,
}

export default api
