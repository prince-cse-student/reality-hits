// Utility functions for formatting and validation

export const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const truncateText = (text, maxLength = 100) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePhone = (phone) => {
  const regex = /^\+?[1-9]\d{1,14}$/
  return regex.test(phone.replace(/\s/g, ''))
}

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'red'
    case 'Medium':
      return 'yellow'
    case 'Low':
      return 'green'
    default:
      return 'gray'
  }
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'Submitted':
      return 'blue'
    case 'In Progress':
      return 'yellow'
    case 'Escalated':
      return 'red'
    case 'Resolved':
      return 'green'
    default:
      return 'gray'
  }
}

export const categoryIcons = {
  'Electricity': '⚡',
  'Water': '💧',
  'Roads': '🛣️',
  'Garbage': '🗑️',
  'Healthcare': '🏥',
  'Education': '📚',
  'Public Safety': '🚨',
  'Transportation': '🚌',
  'Other': '📋'
}

export const getCategoryIcon = (category) => {
  return categoryIcons[category] || '📋'
}
