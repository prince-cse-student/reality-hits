// Constants for the application

export const COMPLAINT_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
}

export const PRIORITY_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
}

export const CATEGORIES = [
  'Electricity',
  'Water',
  'Roads',
  'Garbage',
  'Sanitation',
  'Transport',
  'Noise',
  'Safety',
  'Telecom',
  'Consumer',
  'Government',
  'Banking',
  'Housing',
  'Travel'
]

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' }
]

export const DEPARTMENTS = {
  'Electricity': 'Municipal Electrical Department',
  'Water': 'Water Supply Department',
  'Roads': 'Public Works Department',
  'Garbage': 'Waste Management Department',
  'Sanitation': 'Sanitation & Waste Management',
  'Transport': 'Transport Authority',
  'Noise': 'Pollution Control Board',
  'Safety': 'Public Safety Division',
  'Telecom': 'Telecom Regulatory Authority',
  'Consumer': 'Consumer Disputes Forum',
  'Government': 'General Administration Department',
  'Banking': 'Banking Ombudsman Office',
  'Housing': 'Housing & Urban Development',
  'Travel': 'Tourism & Travel Authority'
}

export const API_ENDPOINTS = {
  HEALTH: '/health',
  COMPLAINTS: '/complaints',
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_CATEGORIES: '/dashboard/categories',
  DASHBOARD_PRIORITIES: '/dashboard/priorities'
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size must be less than 5MB.',
  INVALID_FILE_TYPE: 'Only image files are allowed.'
}

export const SUCCESS_MESSAGES = {
  COMPLAINT_SUBMITTED: 'Complaint submitted successfully!',
  COMPLAINT_UPDATED: 'Complaint updated successfully!',
  DATA_LOADED: 'Data loaded successfully!'
}
