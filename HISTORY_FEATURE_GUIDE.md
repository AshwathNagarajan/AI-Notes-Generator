# History Feature Documentation

## Overview
The History feature tracks all user activities across the platform, storing input parameters and output results for each feature used. This allows users to:
- Review past work
- Understand processing statistics
- Delete specific records or clear all history
- Filter by feature type

## Database Structure

### History Collection
All history records are stored in the `history` collection with the following structure:

```json
{
    "_id": ObjectId,
    "user_id": "firebase-uid",
    "feature_type": "notes|voice|pdf|quiz|mindmap|eli5|image|research|voice_emotion",
    "input_data": {
        // Feature-specific input parameters
    },
    "output_data": {
        // Feature-specific results
    },
    "processing_time": 1.23,
    "status": "completed|failed|processing",
    "created_at": ISODate("2024-02-27T10:00:00Z"),
    "updated_at": ISODate("2024-02-27T10:00:00Z")
}
```

## Supported Features

### 1. Notes (`feature_type: "notes"`)
- **Input**: Text to summarize, max length, summarization type, summary mode
- **Output**: Summary, key points, word count, character count
- **Processing**: ~1-2 seconds

### 2. Voice (`feature_type: "voice"`)
- **Input**: Audio file (MP3, WAV) with filename and size
- **Output**: Transcription, word count, confidence score
- **Processing**: ~2-4 seconds

### 3. Voice Emotion (`feature_type: "voice_emotion"`)
- **Input**: Audio file for emotion analysis
- **Output**: Primary emotion, confidence, emotion breakdown
- **Processing**: ~2-3 seconds

### 4. PDF (`feature_type: "pdf"`)
- **Input**: PDF file with total pages
- **Output**: Extracted text, word count, pages processed
- **Processing**: ~3-5 seconds

### 5. Quiz (`feature_type: "quiz"`)
- **Input**: Text content, number of questions requested
- **Output**: Generated quiz questions with difficulty levels
- **Processing**: ~2-3 seconds

### 6. Mind Map (`feature_type: "mindmap"`)
- **Input**: Topic, complexity level (easy/intermediate/advanced)
- **Output**: Central topic, branch count, subtopics, branch names
- **Processing**: ~3-4 seconds

### 7. ELI5 (`feature_type: "eli5"`)
- **Input**: Topic, complexity level
- **Output**: Simple explanation, key concepts, examples, analogies
- **Processing**: ~2-3 seconds

### 8. Image (`feature_type: "image"`)
- **Input**: Image file (JPG, PNG) with filename and size
- **Output**: Extracted text, summary, word count, character count
- **Processing**: ~1-2 seconds

### 9. Research (`feature_type: "research"`)
- **Input**: Search topic, number of papers, summarization type, summary mode
- **Output**: Papers count, papers list, comparative analysis
- **Processing**: ~5-6 seconds

## API Endpoints

### GET /api/history/
Get user's processing history with optional filtering.

**Parameters:**
- `feature_type` (optional): Filter by feature type
- `limit` (default: 50, max: 100): Number of items to return
- `offset` (default: 0): Number of items to skip

**Example:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/history/?feature_type=notes&limit=20"
```

**Response:**
```json
[
    {
        "id": "ObjectId",
        "user_id": "firebase-uid",
        "feature_type": "notes",
        "input_data": {...},
        "output_data": {...},
        "processing_time": 1.23,
        "status": "completed",
        "created_at": "2024-02-27T10:00:00Z"
    }
]
```

### GET /api/history/summary
Get summary statistics of user's history.

**Parameters:**
- `days` (default: 30, range: 1-365): Number of days to include

**Example:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/history/summary?days=30"
```

**Response:**
```json
{
    "total_items": 45,
    "feature_breakdown": {
        "notes": 15,
        "voice": 10,
        "pdf": 8,
        "quiz": 5,
        "mindmap": 4,
        "eli5": 3
    },
    "recent_activity": [...],
    "processing_stats": {
        "average_processing_time": 2.45,
        "success_rate": 98.5,
        "total_processing_time": 110.25
    }
}
```

### GET /api/history/feature/{feature_type}
Get history for a specific feature.

**Parameters:**
- `feature_type`: The feature type to filter by
- `limit` (default: 20, max: 50): Number of items to return

**Example:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/history/feature/notes?limit=10"
```

### DELETE /api/history/{history_id}
Delete a specific history item.

**Example:**
```bash
curl -X DELETE -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/history/ObjectId123"
```

### DELETE /api/history/
Clear all history or by feature type.

**Parameters:**
- `feature_type` (optional): Clear only specific feature type

**Example:**
```bash
# Clear all history
curl -X DELETE -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/history/"

# Clear only notes history
curl -X DELETE -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/history/?feature_type=notes"
```

## Testing the History Feature

### 1. Seed Test Data
This generates sample history records without actually running the features:

```bash
python test_seed_history.py
```

### 2. View All History
Display all history records organized by feature type:

```bash
python test_history_comprehensive.py
```

### 3. Test APIendpoints
Use the History page in the frontend or test with cURL:

```bash
# View all history
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  "http://localhost:8000/api/history/"

# View notes history only
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  "http://localhost:8000/api/history/feature/notes"

# View summary statistics
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  "http://localhost:8000/api/history/summary"
```

## Frontend Implementation

The frontend History page (`src/pages/History.jsx`) provides:

1. **History List**: Display all history items with filtering
2. **Summary Stats**: Show processing statistics by feature type
3. **View Details**: Click to see full input/output for any record
4. **Delete Actions**: Remove individual records or clear all
5. **Feature Filtering**: Filter by feature type
6. **Time Range Filtering**: View history from last 7, 30, 90 days

### Services Used
- `historyService.js`: API communication
- `AuthContext.jsx`: User authentication
- `ThemeContext.jsx`: Dark mode support

## Fixed Issues (Latest Update)

✅ **Image Processing History**
- Now saves to main `history` collection instead of separate `image_history`
- Consistent with all other features

✅ **Research History**
- Now saves to main `history` collection instead of separate `research_history`
- Includes comparable data structure with other features

✅ **Data Consistency**
- All features now use the `HistoryCreate` model
- Unified data structure across all feature types
- Better query capabilities with centralized collection

## Future Enhancements

1. **Export History**: Download history as CSV/PDF
2. **History Search**: Full-text search across history records
3. **Bulk Operations**: Delete multiple items at once
4. **Archive**: Move old records to archive collection
5. **Analytics**: More detailed statistical breakdowns
6. **History Sharing**: Share specific results with others

## Troubleshooting

**Q: History records not appearing in frontend?**
A: Ensure the user_id matches the Firebase UID. Check browser console for API errors.

**Q: Empty history for a feature?**
A: 
1. Seed test data: `python test_seed_history.py`
2. Or use the actual feature to generate history

**Q: Processing time showing as null?**
A: Some features don't capture processing time. This is expected.

**Q: Want to clear all test data?**
A: Connect to MongoDB and run:
```javascript
db.history.deleteMany({user_id: "test-user-firebase-uid"})
```

## Notes
- History records are stored with user_id (Firebase UID) for privacy
- All timestamps are in UTC
- Processing time is measured in seconds
- Status field indicates if operation completed successfully
- Input data is truncated for large text fields to save space
