# Reality Hits - AI-Powered Grievance Resolution System

A modern, full-stack application for intelligent complaint management and resolution tracking powered by AI.

## 🎯 Project Overview

**Reality Hits** is a hackathon-ready intelligent grievance resolution system that:
- 🤖 Analyzes complaints using AI (LM Studio)
- 🏷️ Detects category and urgency automatically
- 🚀 Routes complaints to appropriate departments
- 📊 Provides real-time analytics dashboard
- 📍 Tracks complaint lifecycle
- 💬 Supports multiple languages (English/Hindi)

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **MongoDB** - NoSQL database
- **LM Studio** - Local AI API
- **Motor** - Async MongoDB driver
- **Python 3.10+** - Runtime

## 📋 Features

### 1. Landing Page
- Modern hero section
- Project tagline: "From Complaint to Real-World Resolution"
- CTA buttons for navigation
- Feature highlights

### 2. Complaint Submission
- Text input for complaint
- Location field
- Image upload support
- Language selection (English/Hindi)
- Real-time validation

### 3. AI Processing
- Automatic analysis using LM Studio
- Category detection
- Priority classification
- Department routing
- AI reasoning explanation

### 4. Results Page
- Beautiful result cards
- AI analysis display
- Status tracking
- Department assignment
- Timeline visualization

### 5. Admin Dashboard
- Real-time statistics
- Total complaints count
- Pending/resolved count
- High-priority alerts
- Interactive charts (Pie/Bar)
- Complaint table with filters
- Search functionality

### 6. Complaint Tracking
- Status timeline visualization
- Progress tracking (Submitted → In Progress → Escalated → Resolved)
- Complaint history

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- MongoDB (running locally or remote)
- LM Studio (running on port 1234)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration
# MONGO_URL=mongodb://localhost:27017
# MONGO_DB_NAME=reality_hits
# LM_STUDIO_API_URL=http://localhost:1234/v1/chat/completions

# Run backend
python main.py
```

Backend will be available at: **http://localhost:8000**

API Documentation (Swagger): **http://localhost:8000/docs**

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install -y mongodb

# Start MongoDB
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
```
# Create a free cluster at: https://www.mongodb.com/cloud/atlas
# Get connection string
# Update MONGO_URL in backend/.env
```

### LM Studio Setup

1. Download LM Studio from: https://lmstudio.ai/
2. Launch LM Studio
3. Download a model (e.g., Mistral, Llama 2)
4. Start the local API server on **port 1234**
5. API will be available at: `http://localhost:1234/v1/chat/completions`

## 📁 Project Structure

```
Reality Hits Project/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusTimeline.jsx
│   │   │   └── ... more components
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── SubmitComplaint.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ComplaintDetails.jsx
│   │   ├── services/            # API integration
│   │   │   └── api.js
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useToast.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── routes/                  # API route handlers
│   │   ├── complaints.py
│   │   └── dashboard.py
│   ├── services/                # Business logic
│   │   ├── complaint_service.py
│   │   └── ai_service.py
│   ├── models/                  # Data schemas
│   │   └── schemas.py
│   ├── database/                # Database setup
│   │   └── mongo.py
│   ├── config.py                # Configuration
│   ├── main.py                  # Entry point
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

## 🔌 API Endpoints

### Complaints
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/{id}` - Get complaint details
- `PATCH /api/complaints/{id}` - Update complaint
- `GET /api/complaints/search?q=query` - Search complaints

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/categories` - Complaints by category
- `GET /api/dashboard/priorities` - Complaints by priority

### Health
- `GET /api/health` - Health check

## 🎨 UI/UX Design

### Color Scheme
- **Background**: `#F8F9FB` (Light soft white)
- **Purple Accent**: `#CDB4DB` (Lavender)
- **Dark Purple**: `#6D597A` (Deep purple)

### Design Principles
- Minimal and clean design
- Modern SaaS aesthetic
- Soft shadows and rounded corners
- Smooth transitions and animations
- Responsive on all devices

### Components
- Rounded cards with soft shadows
- Purple accent buttons
- Status badges with colors
- Interactive charts and tables
- Timeline visualizations
- Loading spinners
- Toast notifications

## 🤖 AI Integration

### LM Studio Configuration

The system uses LM Studio's local API for complaint analysis:

```
Prompt Template:
- Analyzes complaint text
- Detects category
- Determines priority (High/Medium/Low)
- Routes to department
- Provides reasoning
```

### Default Analysis (Fallback)
If LM Studio is unavailable, system returns default analysis:
- Category: "Other"
- Priority: "Medium"
- Department: "General Grievance Department"
- Status: "Complaint received and will be processed"

## 📊 Database Schema

### Complaints Collection
```javascript
{
  _id: ObjectId,
  text: String,
  location: String,
  language: String,
  category: String,
  priority: String,
  department: String,
  ai_reasoning: String,
  status: String,  // Submitted, In Progress, Escalated, Resolved
  image_url: String (optional),
  created_at: DateTime,
  updated_at: DateTime
}
```

## 🔒 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=reality_hits
LM_STUDIO_API_URL=http://localhost:1234/v1/chat/completions
DEBUG=True
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## 🧪 Testing the Application

### Manual Testing

1. **Submit a Complaint**
   - Go to http://localhost:5173
   - Click "Submit Complaint"
   - Fill form with sample complaint:
     - Text: "Road has large potholes causing accidents"
     - Location: "Main Street, Downtown"
     - Language: English
   - Click Submit
   - View AI analysis results

2. **Check Dashboard**
   - Go to http://localhost:5173/dashboard
   - View statistics and charts
   - See recent complaints

3. **View Complaint Details**
   - Click on any complaint in dashboard
   - View full details and timeline

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build
npm run build

# Deploy to Vercel
vercel
```

### Backend (Heroku/Railway)
```bash
# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main
```

## 📝 Notes for Hackathon

### Bonus Features Implemented
✅ Hindi language support
✅ AI explanation section
✅ Beautiful dashboard with charts
✅ Toast notifications
✅ Loading animations
✅ Skeleton loaders
✅ Responsive design
✅ Modern UI/UX

### Performance
- Fast API responses
- Optimized components
- Lazy loading
- Smooth animations

### Code Quality
- Clean architecture
- Modular components
- Reusable utilities
- Error handling
- Proper validation

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built for hackathon participation
- Uses LM Studio for local AI inference
- MongoDB for data storage
- FastAPI for backend
- React + Vite for frontend

---

**Made with ❤️ for grievance resolution excellence**
