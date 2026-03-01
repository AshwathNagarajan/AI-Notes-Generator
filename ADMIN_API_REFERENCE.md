# Admin API Reference Documentation

## Base URL
```
http://localhost:8000/api/admin
```

## Authentication
All endpoints (except login) require an `admin_token` query parameter.

Example:
```
GET /api/admin/dashboard/stats?admin_token=abc123def456
```

---

## 🔐 Authentication Endpoints

### Admin Login
**Endpoint**: `POST /api/admin/login`

**Description**: Authenticate admin user and receive access token.

**Request Body**:
```json
{
  "username": "admin",
  "password": "thinkink3137"
}
```

**Success Response** (200):
```json
{
  "message": "Admin login successful",
  "admin_token": "abc123def456...",
  "admin_username": "admin"
}
```

**Error Response** (401):
```json
{
  "detail": "Invalid credentials"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"thinkink3137"}'
```

**JavaScript Example**:
```javascript
const response = await fetch('http://localhost:8000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'thinkink3137'
  })
});
const data = await response.json();
const token = data.admin_token;
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Statistics
**Endpoint**: `GET /api/admin/dashboard/stats`

**Query Parameters**:
```
admin_token (required): Admin access token from login
```

**URL Example**:
```
GET /api/admin/dashboard/stats?admin_token=abc123def456
```

**Response** (200):
```json
{
  "total_users": 150,
  "active_users": 45,
  "inactive_users": 105,
  "created_today": 3,
  "last_7_days": 25
}
```

**Field Descriptions**:
- `total_users`: Total count of all registered users
- `active_users`: Users who logged in within last 7 days
- `inactive_users`: Users with no login in last 7+ days
- `created_today`: New user registrations today
- `last_7_days`: New registrations in the last 7 days

**cURL Example**:
```bash
curl "http://localhost:8000/api/admin/dashboard/stats?admin_token=abc123def456"
```

---

## 👥 User Management Endpoints

### Get All Users
**Endpoint**: `GET /api/admin/users`

**Query Parameters**:
```
admin_token (required): Admin access token
skip (optional): Number of records to skip for pagination (default: 0)
limit (optional): Max records to return per page (default: 50)
```

**URL Example**:
```
GET /api/admin/users?admin_token=abc123def456&skip=0&limit=50
```

**Response** (200):
```json
{
  "users": [
    {
      "_id": "user_id_1",
      "email": "user@example.com",
      "display_name": "John Doe",
      "photo_url": "https://...",
      "firebase_uid": "firebase_uid_1",
      "created_at": "2024-01-15T10:30:00",
      "updated_at": "2024-02-28T15:45:00",
      "is_active": true,
      "last_login": "2024-02-28T09:20:00"
    },
    ...
  ],
  "total_users": 150,
  "skip": 0,
  "limit": 50
}
```

**Field Descriptions**:
- `users`: Array of user objects
- `total_users`: Total count of all users in system
- `skip`: Number of records skipped
- `limit`: Records returned per request

**Pagination Example**:
```bash
# Get first 50 users
curl "http://localhost:8000/api/admin/users?admin_token=token&skip=0&limit=50"

# Get next 50 users
curl "http://localhost:8000/api/admin/users?admin_token=token&skip=50&limit=50"

# Get users 100-150
curl "http://localhost:8000/api/admin/users?admin_token=token&skip=100&limit=50"
```

---

## 📈 Activity Endpoints

### Get Recent Activities
**Endpoint**: `GET /api/admin/activities`

**Query Parameters**:
```
admin_token (required): Admin access token
limit (optional): Max activities to return (default: 100, max: 1000)
```

**URL Example**:
```
GET /api/admin/activities?admin_token=abc123def456&limit=100
```

**Response** (200):
```json
{
  "activities": [
    {
      "_id": "activity_id_1",
      "user_id": "user_123",
      "feature_type": "notes",
      "input_data": {...},
      "output_data": {...},
      "processing_time": 2.45,
      "status": "completed",
      "created_at": "2024-02-28T15:30:00"
    },
    {
      "_id": "activity_id_2",
      "user_id": "user_456",
      "feature_type": "voice",
      "status": "failed",
      "created_at": "2024-02-28T14:25:00"
    },
    ...
  ],
  "total": 100
}
```

**Field Descriptions**:
- `activities`: Array of activity objects
- `total`: Total activities in response
- `feature_type`: Type of feature used (notes, voice, pdf, quiz, etc.)
- `status`: Activity status (completed, failed, pending)
- `processing_time`: Time taken to process (in seconds)

**Feature Types**:
```
- notes
- voice
- pdf
- quiz
- mindmap
- eli5
- image
- research
- knowledge_gap
- chatbot
- history
```

---

### Get User Activity History
**Endpoint**: `GET /api/admin/user/{user_id}/activities`

**URL Parameters**:
```
user_id: The unique ID of the user
```

**Query Parameters**:
```
admin_token (required): Admin access token
limit (optional): Max activities to return (default: 50)
```

**URL Example**:
```
GET /api/admin/user/user_123/activities?admin_token=abc123def456&limit=50
```

**Response** (200):
```json
{
  "user_id": "user_123",
  "activities": [
    {
      "_id": "activity_id_1",
      "user_id": "user_123",
      "feature_type": "notes",
      "status": "completed",
      "created_at": "2024-02-28T15:30:00"
    },
    ...
  ],
  "total": 25,
  "feature_breakdown": {
    "notes": 10,
    "voice": 8,
    "pdf": 4,
    "quiz": 3
  }
}
```

**Field Descriptions**:
- `user_id`: User identifier
- `activities`: User's activity history
- `total`: Total activities for this user
- `feature_breakdown`: Count by feature type

**cURL Example**:
```bash
curl "http://localhost:8000/api/admin/user/user_123/activities?admin_token=token&limit=50"
```

---

## 📉 Analytics Endpoints

### Get System Analytics
**Endpoint**: `GET /api/admin/analytics`

**Query Parameters**:
```
admin_token (required): Admin access token
```

**URL Example**:
```
GET /api/admin/analytics?admin_token=abc123def456
```

**Response** (200):
```json
{
  "feature_usage": {
    "notes": 234,
    "voice": 156,
    "pdf": 89,
    "quiz": 45,
    "mindmap": 67,
    "eli5": 123,
    "image": 34,
    "research": 56,
    "knowledge_gap": 12,
    "chatbot": 89
  },
  "status_breakdown": {
    "completed": 450,
    "failed": 12,
    "pending": 3
  },
  "total_activities": 465
}
```

**Field Descriptions**:
- `feature_usage`: Count of activities by feature type
- `status_breakdown`: Count of activities by status
- `total_activities`: Total activities across system

**Use Cases**:
```
1. Identify Popular Features:
   - Which feature_usage entry has highest count
   - Allocate development resources accordingly

2. System Health:
   - Compare completed vs failed counts
   - Calculate success rate = completed / (completed + failed)

3. Feature Adoption:
   - Track changes in feature_usage over time
   - Identify trends and patterns
```

**cURL Example**:
```bash
curl "http://localhost:8000/api/admin/analytics?admin_token=abc123def456"
```

---

## ❌ Error Responses

### Unauthorized (401)
```json
{
  "detail": "Invalid admin token"
}
```

### Not Found (404)
```json
{
  "detail": "User not found"
}
```

### Server Error (500)
```json
{
  "detail": "Failed to get statistics"
}
```

### Validation Error (400)
```json
{
  "detail": "Topic cannot be empty"
}
```

---

## 🔄 Common Workflows

### Workflow 1: Initial Login
```javascript
// Step 1: Login
const loginRes = await fetch('http://localhost:8000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'thinkink3137'
  })
});
const loginData = await loginRes.json();
const token = loginData.admin_token;

// Step 2: Get Dashboard Stats
const statsRes = await fetch(
  `http://localhost:8000/api/admin/dashboard/stats?admin_token=${token}`
);
const stats = await statsRes.json();

console.log('Total Users:', stats.total_users);
console.log('Active Users:', stats.active_users);
```

### Workflow 2: Find and Monitor User
```javascript
// Step 1: Get all users
const usersRes = await fetch(
  `http://localhost:8000/api/admin/users?admin_token=${token}&skip=0&limit=100`
);
const usersData = await usersRes.json();

// Step 2: Find specific user
const targetUser = usersData.users.find(u => u.email === 'user@example.com');

// Step 3: Get user's activities
const activitiesRes = await fetch(
  `http://localhost:8000/api/admin/user/${targetUser._id}/activities?admin_token=${token}`
);
const userActivities = await activitiesRes.json();

console.log('User Activities:', userActivities.activities);
console.log('Feature Breakdown:', userActivities.feature_breakdown);
```

### Workflow 3: Analyze System Health
```javascript
// Get analytics
const analyticsRes = await fetch(
  `http://localhost:8000/api/admin/analytics?admin_token=${token}`
);
const analytics = await analyticsRes.json();

// Calculate success rate
const total = analytics.status_breakdown.completed + 
              analytics.status_breakdown.failed;
const successRate = (analytics.status_breakdown.completed / total * 100).toFixed(2);

console.log(`Success Rate: ${successRate}%`);
console.log('Most Used Feature:', 
  Object.entries(analytics.feature_usage)
    .sort((a, b) => b[1] - a[1])[0][0]
);
```

---

## 📋 Rate Limiting

Currently, there is no rate limiting. In production, consider implementing:
- Max 100 requests per minute per IP
- Max 1000 requests per hour per token
- Adaptive throttling for large queries

---

## 🔒 Security Notes

1. **Token Security**:
   - Don't expose token in URLs in production
   - Use HTTPS to prevent token interception
   - Consider JWT with expiration

2. **Data Privacy**:
   - Admin can see all user activities
   - Consider GDPR/privacy implications
   - Implement audit logging for admin actions

3. **SQL Injection**:
   - Not applicable (MongoDB, not SQL)
   - But validate all input parameters

4. **CORS**:
   - Currently configured for localhost:3000
   - Update for production domains

---

## 📚 Related Resources

- Admin Guide: `/ADMIN_GUIDE.md`
- Quick Start: `/ADMIN_QUICK_START.md`
- Implementation Details: `/ADMIN_IMPLEMENTATION.md`
- Complete Overview: `/ADMIN_SYSTEM_COMPLETE.md`

---

## 🔧 Testing Tools

### Using cURL
```bash
# Test login
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"thinkink3137"}'

# Test stats (replace TOKEN)
curl "http://localhost:8000/api/admin/dashboard/stats?admin_token=TOKEN"
```

### Using JavaScript
```javascript
const token = 'your_admin_token';

// GET request
fetch(`http://localhost:8000/api/admin/stats?admin_token=${token}`)
  .then(r => r.json())
  .then(data => console.log(data));

// POST request
fetch('http://localhost:8000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'thinkink3137' })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

### Using Python
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/admin/login', 
  json={'username': 'admin', 'password': 'thinkink3137'}
)
token = response.json()['admin_token']

# Get stats
stats = requests.get(
  f'http://localhost:8000/api/admin/dashboard/stats',
  params={'admin_token': token}
).json()

print(stats)
```

---

## 🎯 Summary

This API provides complete access to:
- ✅ Admin authentication
- ✅ User management
- ✅ Activity monitoring
- ✅ System analytics

All endpoints are RESTful and return JSON responses.

**Status**: Production Ready 🚀

---

**Last Updated**: March 1, 2026
**Version**: 1.0.0
