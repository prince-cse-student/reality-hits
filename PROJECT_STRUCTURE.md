# Reality Hits Project Structure

## Directory Tree

```
Reality Hits Project/
│
├── frontend/                          # React + Vite frontend
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusTimeline.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── ComplaintsList.jsx
│   │   │   └── ComplaintFilter.jsx
│   │   ├── pages/                     # Page components
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── SubmitComplaint.jsx    # Complaint submission form
│   │   │   ├── Dashboard.jsx          # Admin dashboard
│   │   │   └── ComplaintDetails.jsx   # Complaint details page
│   │   ├── services/                  # API integration
│   │   │   └── api.js
│   │   ├── hooks/                     # Custom React hooks
│   │   │   └── useToast.js
│   │   ├── utils/                     # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   ├── App.jsx                    # Root App component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── index.html                     # HTML template
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── postcss.config.js              # PostCSS config
│   ├── package.json                   # Frontend dependencies
│   ├── Dockerfile                     # Docker image for frontend
│   ├── .env.example                   # Example environment variables
│   └── .gitignore
│
├── backend/                           # FastAPI backend
│   ├── main.py                        # Application entry point
│   ├── config.py                      # Configuration settings
│   ├── utils.py                       # Utility functions
│   ├── routes/                        # API route handlers
│   │   ├── __init__.py
│   │   ├── complaints.py              # Complaint endpoints
│   │   └── dashboard.py               # Dashboard endpoints
│   ├── services/                      # Business logic
│   │   ├── __init__.py
│   │   ├── complaint_service.py       # Complaint operations
│   │   └── ai_service.py              # AI analysis service
│   ├── models/                        # Data schemas
│   │   ├── __init__.py
│   │   └── schemas.py                 # Pydantic schemas
│   ├── database/                      # Database setup
│   │   ├── __init__.py
│   │   └── mongo.py                   # MongoDB connection
│   ├── requirements.txt                # Python dependencies
│   ├── Dockerfile                     # Docker image for backend
│   ├── .env.example                   # Example environment variables
│   ├── __init__.py
│   └── .gitignore
│
├── docker-compose.yml                 # Docker Compose configuration
├── QUICKSTART.md                      # Quick start guide
├── README.md                          # Main documentation
├── API_DOCS.md                        # API documentation
├── DEPLOYMENT.md                      # Deployment guide
├── CONTRIBUTING.md                    # Contributing guidelines
├── package.json                       # Project metadata
├── setup.sh                           # Linux/Mac setup script
└── setup.bat                          # Windows setup script
```

## File Descriptions

### Frontend Files

#### Components
- **Navbar.jsx** - Navigation bar with logo and menu
- **Toast.jsx** - Toast notification component
- **PriorityBadge.jsx** - Badge showing priority level
- **StatCard.jsx** - Dashboard statistics card
- **StatusTimeline.jsx** - Visual timeline of complaint status
- **LoadingSpinner.jsx** - Loading animation
- **SkeletonLoader.jsx** - Skeleton loading state
- **ComplaintsList.jsx** - List of complaints with filtering
- **ComplaintFilter.jsx** - Filter controls for complaints

#### Pages
- **Home.jsx** - Landing page with hero section
- **SubmitComplaint.jsx** - Form to submit new complaint
- **Dashboard.jsx** - Admin dashboard with analytics
- **ComplaintDetails.jsx** - Detailed view of a complaint

#### Services & Hooks
- **api.js** - Axios configuration and API endpoints
- **useToast.js** - Custom hook for toast notifications
- **helpers.js** - Utility functions (formatting, validation)
- **constants.js** - App constants and configuration

### Backend Files

#### Main Files
- **main.py** - FastAPI app initialization and routes
- **config.py** - Configuration from environment variables
- **utils.py** - Helper functions and decorators

#### Routes
- **complaints.py** - Complaint submission, retrieval, update endpoints
- **dashboard.py** - Dashboard statistics endpoints

#### Services
- **complaint_service.py** - Database operations for complaints
- **ai_service.py** - AI analysis using LM Studio API

#### Database
- **mongo.py** - MongoDB connection and lifecycle management
- **schemas.py** - Pydantic models for validation

### Configuration Files

- **docker-compose.yml** - Orchestrates MongoDB, backend, and frontend
- **package.json** - Project metadata and dependencies
- **tailwind.config.js** - Tailwind CSS color and style configuration
- **vite.config.js** - Vite build tool configuration

### Documentation Files

- **README.md** - Complete project documentation
- **QUICKSTART.md** - 5-minute setup guide
- **API_DOCS.md** - Detailed API endpoint documentation
- **DEPLOYMENT.md** - Production deployment guide
- **CONTRIBUTING.md** - Guidelines for contributors

### Setup Scripts

- **setup.sh** - Automated setup for Linux/Mac
- **setup.bat** - Automated setup for Windows

## Data Flow

```
User Interface (React)
        ↓
API Client (Axios)
        ↓
FastAPI Backend
        ├→ Request Validation (Pydantic)
        ├→ Route Handler
        ├→ Business Logic (Services)
        └→ Database (MongoDB)
                ↓
        AI Analysis (LM Studio)
```

## Component Hierarchy

```
App
├── Navbar
├── Routes
│   ├── Home
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   └── CTA Section
│   ├── SubmitComplaint
│   │   └── Form
│   │       ├── Text Input
│   │       ├── Location Input
│   │       ├── Language Select
│   │       └── Image Upload
│   ├── Dashboard
│   │   ├── Stats Cards
│   │   ├── Charts
│   │   └── Complaints Table
│   └── ComplaintDetails
│       ├── Complaint Info
│       ├── AI Analysis
│       ├── Timeline
│       └── Image (if present)
└── Toast (global notification)
```

## Database Schema

```
MongoDB Database: reality_hits

Collections:
├── complaints
│   ├── _id (ObjectId)
│   ├── text (String)
│   ├── location (String)
│   ├── language (String)
│   ├── category (String)
│   ├── priority (String)
│   ├── department (String)
│   ├── ai_reasoning (String)
│   ├── status (String)
│   ├── image_url (String, optional)
│   ├── created_at (DateTime)
│   └── updated_at (DateTime)
```

## API Routes

```
/api/
├── health                              GET - Health check
├── complaints
│   ├── POST - Submit new complaint
│   ├── GET - Get all complaints
│   ├── /{id}
│   │   ├── GET - Get complaint details
│   │   └── PATCH - Update complaint
│   └── /search - Search complaints
└── dashboard/
    ├── stats - GET - Dashboard statistics
    ├── categories - GET - Category breakdown
    └── priorities - GET - Priority breakdown
```

## Technology Stack

### Frontend
- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- Axios
- Recharts
- Lucide React Icons

### Backend
- FastAPI
- Python 3.10+
- MongoDB
- Motor (async MongoDB)
- Pydantic
- Uvicorn

### Infrastructure
- Docker & Docker Compose
- LM Studio (Local AI)

## Environment Setup

### Required Services
1. Node.js 18+ (Frontend)
2. Python 3.10+ (Backend)
3. MongoDB (Database)
4. LM Studio (AI API)

### Ports
- Frontend: 5173 (Vite dev server)
- Backend: 8000 (FastAPI)
- MongoDB: 27017
- LM Studio: 1234

## Performance Metrics

Target metrics for hackathon:
- Page load time: < 2 seconds
- API response time: < 500ms (excluding AI)
- AI analysis time: 2-5 seconds
- Database query time: < 100ms
- Lighthouse score: > 85

