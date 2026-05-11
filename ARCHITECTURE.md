# Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│  - Pages: Home, Submit, Dashboard, Details                  │
│  - Components: Reusable UI elements                         │
│  - Services: API integration layer                          │
│  - Hooks: Custom React hooks                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI + Python)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Routes: /complaints, /dashboard, /health              │ │
│  │ Services: ComplaintService, AIService                 │ │
│  │ Database: MongoDB async driver (Motor)                │ │
│  │ AI: LM Studio integration                             │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ MongoDB  │  │LM Studio │  │ Uploads  │
    │          │  │  (Local  │  │ (Images) │
    │Database  │  │   AI)    │  │          │
    └──────────┘  └──────────┘  └──────────┘
```

## Data Flow

### Complaint Submission Flow

```
User Input
    ↓
Frontend Form Validation
    ↓
POST /api/complaints (with image)
    ↓
Backend: Save to MongoDB
    ↓
Backend: Send to LM Studio for analysis
    ↓
LM Studio: Analyze and return
  - Category
  - Priority
  - Department
  - Reasoning
    ↓
Backend: Update complaint with AI results
    ↓
Response: Complaint created with AI analysis
    ↓
Frontend: Navigate to detail page
    ↓
User sees results
```

## Component Hierarchy

```
App
├── Navbar
├── Routes
│   ├── Home
│   │   ├── HeroSection
│   │   ├── FeaturesSection
│   │   └── CTASection
│   │
│   ├── SubmitComplaint
│   │   ├── Form
│   │   │   ├── TextInput
│   │   │   ├── LocationInput
│   │   │   ├── LanguageSelect
│   │   │   └── ImageUpload
│   │   └── LoadingSpinner
│   │
│   ├── Dashboard
│   │   ├── StatCard (x4)
│   │   ├── PieChart (Categories)
│   │   ├── BarChart (Priorities)
│   │   ├── FilterButtons
│   │   └── ComplaintTable
│   │
│   └── ComplaintDetails
│       ├── ComplaintCard
│       ├── AnalysisCard
│       ├── StatusTimeline
│       └── ImageDisplay
│
└── Toast (Notifications)
```

## Database Schema

### Complaints Collection

```javascript
{
  _id: ObjectId("..."),
  
  // User Input
  text: String,              // Complaint description (required)
  location: String,          // Location (required)
  language: String,          // "English" or "Hindi"
  image_url: String,         // Optional image path
  
  // AI Analysis Results
  category: String,          // Detected category
  priority: String,          // High/Medium/Low
  department: String,        // Assigned department
  ai_reasoning: String,      // Why AI made this decision
  
  // Status Tracking
  status: String,            // Submitted/In Progress/Escalated/Resolved
  
  // Metadata
  created_at: ISODate,       // Creation timestamp
  updated_at: ISODate,       // Last update timestamp
  
  // Optional
  ip_address: String,        // Submitter IP
  device_info: String,       // Device info
}
```

## API Design Patterns

### Request/Response Pattern

**Standard Request:**
```json
{
  "key": "value"
}
```

**Standard Response (Success):**
```json
{
  "status": "success",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Standard Response (Error):**
```json
{
  "detail": "Error message"
}
```

## Authentication (Future Implementation)

```
Frontend
   ↓
POST /auth/login
   ↓
Backend: Verify credentials
   ↓
Return JWT token
   ↓
Frontend: Store token in localStorage
   ↓
All future requests include token in Authorization header
   ↓
Backend: Verify token before processing
```

## Scaling Strategy

### Horizontal Scaling

```
Load Balancer (Nginx/HAProxy)
    ↓
┌───────────┬───────────┬───────────┐
│ Backend 1 │ Backend 2 │ Backend 3 │
└───────────┴───────────┴───────────┘
         ↓
   MongoDB (with replica set)
```

### Caching Strategy

```
Request
  ↓
Check Redis Cache
  ├─ Hit: Return cached response
  └─ Miss: Query MongoDB
       ↓
     Cache result in Redis
       ↓
     Return to client
```

## Performance Optimization

### Frontend
- Code splitting by route
- Image optimization
- Lazy loading
- Component memoization
- Bundle analysis

### Backend
- Database indexing on frequently queried fields
- Async operations for I/O
- Connection pooling
- Response compression
- Request validation before processing

### Database
- Index on `created_at` for sorting
- Index on `status` and `priority` for filtering
- Index on `category` for grouping
- TTL index for data retention

## Security Layers

```
                    HTTPS
                      ↓
        Request Validation & Sanitization
                      ↓
        Rate Limiting & DDoS Protection
                      ↓
        Authentication (Future)
                      ↓
        Authorization Checks
                      ↓
        Input Validation
                      ↓
        Parameterized Database Queries
                      ↓
        Output Encoding
```

## Error Handling Strategy

```
Application Error
    ↓
┌─────────────────────────────────────┐
│ Type of Error?                      │
└────────┬────────────────────────────┘
         │
    ┌────┴────┬────────────┬─────────┐
    ↓         ↓            ↓         ↓
  Input    Network     Database  Server
  Error    Error       Error     Error
  ↓        ↓            ↓         ↓
  400      503          500       500
  
  Log Error
    ↓
  Send to Error Tracking (Sentry)
    ↓
  Return appropriate HTTP status + message to client
```

## Monitoring & Observability

### Metrics to Track
- Request latency
- Error rates
- Database query performance
- AI analysis time
- File upload size
- Cache hit rate

### Logging Levels
- DEBUG: Detailed information
- INFO: General information
- WARNING: Warning messages
- ERROR: Error conditions
- CRITICAL: Critical issues

## Technology Choices Rationale

| Component | Technology | Why |
|-----------|-----------|-----|
| Frontend | React | Popular, component-based, large ecosystem |
| Build Tool | Vite | Fast, modern, optimized bundles |
| Styling | Tailwind | Utility-first, rapid development |
| Charts | Recharts | React-friendly, responsive |
| Backend | FastAPI | Modern, fast, built-in validation |
| Database | MongoDB | Flexible schema, good for MVP |
| AI | LM Studio | Local, private, no API costs |
| Async Driver | Motor | Efficient async MongoDB driver |

## Future Enhancements

1. **Authentication & Authorization**
   - JWT-based auth
   - Role-based access control
   - User profiles

2. **Advanced Features**
   - Real-time updates (WebSockets)
   - Duplicate detection
   - ML-based routing
   - Predictive analytics

3. **Scalability**
   - Redis caching
   - Database read replicas
   - Microservices architecture
   - Event streaming (Kafka)

4. **Analytics**
   - Advanced reporting
   - Heatmaps
   - Predictive insights
   - Trend analysis

5. **Integration**
   - Third-party services
   - SMS/Email notifications
   - Payment processing
   - SSO integration

