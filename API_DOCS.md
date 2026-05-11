# API Documentation - Reality Hits

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently, the API uses no authentication. For production, implement JWT tokens.

---

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "Reality Hits API"
}
```

---

### 2. Submit Complaint
**POST** `/complaints`

Submit a new complaint with optional image upload.

**Request (Form Data):**
- `text` (string, required) - Complaint details
- `location` (string, required) - Location of complaint
- `language` (string, optional) - "English" or "Hindi" (default: English)
- `image` (file, optional) - Image file (max 5MB)

**Example:**
```bash
curl -X POST http://localhost:8000/api/complaints \
  -F "text=Road has potholes" \
  -F "location=Sector 5" \
  -F "language=English" \
  -F "image=@photo.jpg"
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "text": "Road has potholes",
  "location": "Sector 5",
  "category": "Roads",
  "priority": "High",
  "department": "Public Works Department",
  "ai_reasoning": "Public safety issue detected due to road hazard",
  "status": "Submitted",
  "created_at": "2024-01-15T10:30:00"
}
```

---

### 3. Get All Complaints
**GET** `/complaints`

Retrieve all complaints with pagination.

**Query Parameters:**
- `skip` (integer, optional) - Number of records to skip (default: 0)
- `limit` (integer, optional) - Number of records to return (default: 10)

**Example:**
```bash
curl http://localhost:8000/api/complaints?skip=0&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "text": "Road has potholes",
      "location": "Sector 5",
      "category": "Roads",
      "priority": "High",
      "department": "Public Works Department",
      "status": "Submitted",
      "created_at": "2024-01-15T10:30:00",
      "updated_at": "2024-01-15T10:30:00"
    }
  ],
  "total": 42,
  "skip": 0,
  "limit": 20
}
```

---

### 4. Get Complaint by ID
**GET** `/complaints/{complaint_id}`

Retrieve a specific complaint by ID.

**Path Parameters:**
- `complaint_id` (string, required) - MongoDB ObjectId

**Example:**
```bash
curl http://localhost:8000/api/complaints/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "text": "Road has potholes",
  "location": "Sector 5",
  "language": "English",
  "category": "Roads",
  "priority": "High",
  "department": "Public Works Department",
  "ai_reasoning": "Public safety issue detected",
  "status": "Submitted",
  "image_url": "/uploads/1234567890_photo.jpg",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

### 5. Update Complaint
**PATCH** `/complaints/{complaint_id}`

Update complaint status or other details.

**Path Parameters:**
- `complaint_id` (string, required) - MongoDB ObjectId

**Request Body (JSON):**
```json
{
  "status": "In Progress"
}
```

**Allowed Status Values:**
- `Submitted`
- `In Progress`
- `Escalated`
- `Resolved`

**Example:**
```bash
curl -X PATCH http://localhost:8000/api/complaints/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "text": "Road has potholes",
  "location": "Sector 5",
  "category": "Roads",
  "priority": "High",
  "department": "Public Works Department",
  "status": "In Progress",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:35:00"
}
```

---

### 6. Search Complaints
**GET** `/complaints/search`

Search complaints by text.

**Query Parameters:**
- `q` (string, required) - Search query

**Example:**
```bash
curl http://localhost:8000/api/complaints/search?q=pothole
```

**Response:**
```json
{
  "results": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "text": "Road has potholes",
      "location": "Sector 5",
      ...
    }
  ]
}
```

---

### 7. Dashboard Statistics
**GET** `/dashboard/stats`

Get overall dashboard statistics.

**Example:**
```bash
curl http://localhost:8000/api/dashboard/stats
```

**Response:**
```json
{
  "total_complaints": 150,
  "pending_complaints": 42,
  "resolved_complaints": 98,
  "high_priority_complaints": 15
}
```

---

### 8. Category Statistics
**GET** `/dashboard/categories`

Get complaints grouped by category.

**Example:**
```bash
curl http://localhost:8000/api/dashboard/categories
```

**Response:**
```json
[
  {
    "category": "Roads",
    "value": 45
  },
  {
    "category": "Water",
    "value": 38
  },
  {
    "category": "Electricity",
    "value": 32
  }
]
```

---

### 9. Priority Statistics
**GET** `/dashboard/priorities`

Get complaints grouped by priority.

**Example:**
```bash
curl http://localhost:8000/api/dashboard/priorities
```

**Response:**
```json
[
  {
    "priority": "High",
    "count": 45
  },
  {
    "priority": "Medium",
    "count": 68
  },
  {
    "priority": "Low",
    "count": 37
  }
]
```

---

## Error Handling

All errors return appropriate HTTP status codes with error details.

**Error Response Format:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

Not implemented in development version. For production, implement rate limiting.

---

## CORS

CORS is enabled for all origins in development. For production, restrict to specific domains.

---

## Testing

### Using cURL

```bash
# Submit complaint
curl -X POST http://localhost:8000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Street lights are broken",
    "location": "Main Street"
  }'

# Get all complaints
curl http://localhost:8000/api/complaints

# Get dashboard stats
curl http://localhost:8000/api/dashboard/stats
```

### Using Swagger UI

Open: http://localhost:8000/docs

Interactive API documentation and testing interface.

---

## Response Times

- `POST /complaints` - ~2-5 seconds (includes AI analysis)
- `GET /complaints` - ~500ms
- `GET /dashboard/stats` - ~300ms

---

## Data Types

### Complaint Object
```typescript
{
  _id: ObjectId,
  text: string,                    // Complaint description
  location: string,                // Location of complaint
  language: string,                // "English" or "Hindi"
  category: string,                // Auto-detected category
  priority: string,                // "High", "Medium", "Low"
  department: string,              // Assigned department
  ai_reasoning: string,            // Why AI made this decision
  status: string,                  // Current status
  image_url?: string,              // Optional image URL
  created_at: ISO8601DateTime,     // Creation timestamp
  updated_at: ISO8601DateTime      // Last update timestamp
}
```

---

## Pagination

Use `skip` and `limit` for pagination:
- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records per page (default: 10, max: 100)

Example: Get records 20-30
```bash
curl http://localhost:8000/api/complaints?skip=20&limit=10
```

---

## Version

Current API Version: **1.0.0**
