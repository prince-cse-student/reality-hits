import { useState, useEffect } from 'react'
import { Calendar, MapPin, Tag } from 'lucide-react'

export default function ComplaintFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    dateRange: 'all'
  })

  useEffect(() => {
    onFilter(filters)
  }, [filters])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-accent focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-accent focus:outline-none"
        >
          <option value="all">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-accent focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Roads">Roads</option>
          <option value="Garbage">Garbage</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Public Safety">Public Safety</option>
          <option value="Transportation">Transportation</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-accent focus:outline-none"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>
  )
}
