import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MoreVertical } from 'lucide-react'
import { complaintService } from '../services/api'
import PriorityBadge from '../components/PriorityBadge'
import SkeletonLoader from '../components/SkeletonLoader'

export default function ComplaintsList() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    try {
      const data = await complaintService.getComplaints({ limit: 50 })
      setComplaints(data.data || [])
    } catch (error) {
      console.error('Failed to load complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 focus:outline-none"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-accent focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-accent focus:outline-none"
        >
          <option value="all">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint._id}
              onClick={() => navigate(`/complaints/${complaint._id}`)}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-accent hover:shadow-medium transition-smooth cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {complaint.category}
                    </span>
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{complaint.text}</p>
                  <p className="text-xs text-gray-500 mt-2">{complaint.location}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
