import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import ParticleBackground from './components/ParticleBackground'
import Toast from './components/Toast'
import { useToast } from './hooks/useToast'

import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import SubmitComplaint from './pages/SubmitComplaint'
import Dashboard from './pages/Dashboard'
import ComplaintDetails from './pages/ComplaintDetails'
import AdminDashboard from './pages/AdminDashboard'
import TrackComplaint from './pages/TrackComplaint'
import Features from './pages/Features'

function AppContent() {
  const { toast, showToast, hideToast } = useToast()

  return (
    <div className="min-h-screen bg-bg-primary">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/submit" element={<SubmitComplaint showToast={showToast} />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
