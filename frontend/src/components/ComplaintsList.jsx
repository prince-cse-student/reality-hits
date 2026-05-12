import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ExternalLink } from 'lucide-react'
import { adminService } from '../services/api'
import PriorityBadge from '../components/PriorityBadge'
import SkeletonLoader from '../components/SkeletonLoader'

export default function ComplaintsList() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  useEffect(() => { loadComplaints() }, [])

  const loadComplaints = async () => {
    try {
      const data = await adminService.getComplaints({ limit: 50 })
      setComplaints(data.data || [])
    } catch (error) { console.error('Failed to load complaints:', error) }
    finally { setLoading(false) }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) return <SkeletonLoader />

  const selectClass = "border border-border-primary bg-white text-[11px] font-bold px-3 py-2 uppercase outline-none focus:border-brand"

  return (
    <div className="space-y-5">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-2.5 text-text-tertiary" />
          <input type="text" placeholder="Search complaints..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-primary bg-white text-[13px] focus:border-brand focus:outline-none" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
          <option value="all">STATUS: ALL</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Under Review">Under Review</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className={selectClass}>
          <option value="all">PRIORITY: ALL</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Complaints Table */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-12 border border-border-primary bg-bg-secondary">
          <p className="text-[12px] text-text-tertiary uppercase tracking-widest">No complaints found</p>
        </div>
      ) : (
        <div className="border border-border-primary bg-white divide-y divide-border-primary">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} onClick={() => navigate(`/admin/complaint/${complaint._id}`)}
              className="p-4 hover:bg-bg-secondary transition-base cursor-pointer group flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-text-primary bg-bg-secondary px-2 py-0.5 uppercase">{complaint.category}</span>
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <p className="text-[13px] text-text-primary line-clamp-2 mb-1">{complaint.text}</p>
                <p className="text-[11px] text-text-tertiary">{complaint.location}</p>
              </div>
              <ExternalLink size={14} className="text-text-tertiary group-hover:text-brand transition-base flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
