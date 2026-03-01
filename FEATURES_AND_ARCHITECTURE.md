# ThinkInk AI - Features & Architecture Guide

## 📋 Overview
ThinkInk AI is a comprehensive educational platform that provides AI-powered study tools including notes summarization, voice transcription, PDF processing, quiz generation, mind maps, research assistance, and intelligent chatbot support.

---

## 🎯 Available Features

### 1. **📝 Notes (Text Summarization)**
- **Purpose:** Summarize and analyze long text documents
- **How it works:** 
  - Users paste text content
  - AI extracts key points and generates concise summaries
  - Supports both abstractive and extractive summarization
- **Backend:** `POST /api/notes/summarize`
- **Processing:** Hugging Face BART model (facebook/bart-large-cnn)
- **Storage:** MongoDB (history collection)

### 2. **🎤 Voice (Speech-to-Text & Chatbot)**
- **Purpose:** Record audio and transcribe it to text with AI conversation
- **How it works:**
  - Click mic button → auto-start recording
  - Stop button → auto-transcribe audio
  - Transcribed text feeds into chatbot for intelligent responses
- **Backend:** 
  - Transcription: `POST /api/voice/transcribe`
  - Chatbot: `POST /api/chatbot/chat`
- **Processing:** Web Audio API (frontend), Hugging Face ASR (backend)
- **Storage:** MongoDB (history collection, uploads folder for audio)

### 3. **📄 PDF Processing**
- **Purpose:** Extract text and analyze PDF documents
- **How it works:**
  - Upload PDF file
  - Extract text content
  - Summarize and analyze document
- **Backend:** `POST /api/pdf/upload`, `POST /api/pdf/analyze`
- **Processing:** PyPDF2/pdfplumber for extraction, Hugging Face for analysis
- **Storage:** MongoDB (history), uploads folder (temporary PDF storage)

### 4. **🧠 ELI5 (Explain Like I'm 5)**
- **Purpose:** Break down complex topics into simple explanations
- **How it works:**
  - Enter a complex topic
  - AI generates easy-to-understand explanation
  - Includes key concepts, examples, and analogies
- **Backend:** `POST /api/eli5/explain`
- **Processing:** Hugging Face language model with custom prompts
- **Storage:** MongoDB (history collection)

### 5. **🗺️ Mind Map**
- **Purpose:** Create visual mind maps from text or topics
- **How it works:**
  - Input text or topic
  - AI generates structured hierarchy
  - Frontend renders interactive mind map visualization
- **Backend:** `POST /api/mindmap/generate`
- **Processing:** Custom tree structure generation + AI organization
- **Storage:** MongoDB (history collection)

### 6. **📸 Image Processing**
- **Purpose:** Analyze and extract information from images
- **How it works:**
  - Upload image file
  - Extract text (OCR) or analyze content
  - Generate descriptions or summaries
- **Backend:** `POST /api/image/upload`, `POST /api/image/analyze`
- **Processing:** Tesseract OCR, Hugging Face vision models
- **Storage:** MongoDB (history), uploads/images folder

### 7. **❓ Quiz Generation**
- **Purpose:** Auto-generate quizzes from study material
- **How it works:**
  - Input study text
  - AI generates multiple-choice questions
  - Users answer and get instant feedback
- **Backend:** `POST /api/quiz/generate`
- **Processing:** Hugging Face model with question generation
- **Storage:** MongoDB (history collection)

### 8. **🔍 Research**
- **Purpose:** Deep research assistance for topics
- **How it works:**
  - Enter research topic
  - AI provides comprehensive research overview
  - Organized by categories (definition, importance, applications, etc.)
- **Backend:** `POST /api/research/search`
- **Processing:** Multi-turn prompt engineering with Hugging Face
- **Storage:** MongoDB (history collection)

### 9. **💬 Chatbot**
- **Purpose:** Real-time conversational AI assistant
- **How it works:**
  - Type or voice input
  - Maintains conversation context
  - Provides intelligent responses with history awareness
- **Backend:** `POST /api/chatbot/chat`
- **Processing:** Hugging Face conversation model
- **Storage:** MongoDB (history collection with conversation context)

### 10. **📊 History**
- **Purpose:** Track all user processing activities
- **How it works:**
  - Automatic logging of all feature usage
  - Breakdown by feature type
  - Performance statistics and analytics
- **Backend:** `GET /api/history/`, `GET /api/history/summary`
- **Storage:** MongoDB (history collection)

### 11. **📥 Export**
- **Purpose:** Download results in various formats
- **How it works:**
  - Export summaries, mind maps, quizzes as PDF/JSON
  - Batch export of history
- **Backend:** `POST /api/export/pdf`, `POST /api/export/json`
- **Processing:** ReportLab/PyPDF2 for PDF generation
- **Storage:** Dynamic generation (no persistent storage)

### 12. **👤 Profile & Authentication**
- **Purpose:** User account management
- **How it works:**
  - Firebase authentication
  - User preferences and settings
  - Personal history tracking
- **Backend:** `POST /api/auth/login`, `GET /api/profile`
- **Processing:** Firebase Token validation
- **Storage:** MongoDB (users collection), Firebase Auth

---

## 🏗️ Architecture Overview

### Frontend Stack
- **Framework:** React 18+ with Hooks
- **Styling:** Tailwind CSS 3+
- **Icons:** Lucide React
- **HTTP Client:** Axios with interceptors
- **State Management:** React Hooks + Context API
- **Animation:** Custom CSS animations + Framer Motion

**Running on:** `http://localhost:3000`

### Backend Stack
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn ASGI
- **Authentication:** Firebase + JWT
- **Database:** MongoDB (with in-memory fallback)
- **AI/ML:** Hugging Face models (cloud-based Inference API)
- **File Processing:** 
  - Tesseract (OCR)
  - PyPDF2/pdfplumber (PDF extraction)
  - Web Audio API (audio capture)

**Running on:** `http://localhost:8000`

### Database Architecture
```
MongoDB Collections:
├── users (user profiles, preferences)
├── history (all processing records)
├── image_history (image processing logs)
└── [Dynamic collections per feature]
```

**Connection:** `mongodb://localhost:27017/notes_summarizer`

### File Storage
```
backend/
├── uploads/
│   ├── audio/ (voice recordings)
│   ├── images/ (uploaded images)
│   └── temp/ (temporary processing files)
└── [Dynamic file generation for exports]
```

---

## 🔄 Data Flow Example: Voice-to-Chat

```
User Interface (React)
    ↓
[Mic Button Click] → startRecording() → autoStart=true
    ↓
[Stop Button] → stopRecording() → auto-transcribe
    ↓
Transcription Service
    ↓
Backend: POST /api/voice/transcribe
    ↓
Hugging Face ASR Model (Cloud/Local)
    ↓
Transcribed Text + MongoDB Storage
    ↓
Automatic Feed to Chatbot
    ↓
Backend: POST /api/chatbot/chat (with context)
    ↓
Hugging Face Conversation Model
    ↓
AI Response + MongoDB History
    ↓
Display in Chat Interface
```

---

## 🔐 Authentication Flow

```
1. User Login (Firebase)
   ↓
2. Firebase Token Generation
   ↓
3. Token stored in localStorage
   ↓
4. Axios Interceptor adds: Authorization: Bearer {token}
   ↓
5. Backend validates with get_current_user()
   ↓
6. MongoDB query scoped to current user_id
   ↓
7. Response returned with user context
```

---

## 🚀 Deployment Architecture

### Development Environment
- Frontend: `npm start` → localhost:3000
- Backend: `python -m uvicorn main:app --reload` → localhost:8000
- Database: MongoDB running locally (or Atlas cloud)

### Process Flow
```
Browser (React App)
    ↓ HTTP/WebSocket
Uvicorn Server (FastAPI)
    ↓ API Calls
Hugging Face Inference API (Cloud)
    ↓ ML Processing
MongoDB
    ↓ Data Persistence
File System (uploads folder)
```

---

## 📦 Key Dependencies

### Frontend
- `react`: UI framework
- `axios`: HTTP client
- `tailwindcss`: Styling
- `lucide-react`: Icons
- `react-hot-toast`: Notifications

### Backend
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `motor`: Async MongoDB driver
- `pydantic`: Data validation
- `transformers`: Hugging Face models
- `tesseract`: OCR processing
- `firebase-admin`: Authentication

---

## ⚙️ Configuration & Environment

### Required Environment Variables
```bash
# Firebase
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project

# Hugging Face (for AI processing)
HF_API_KEY=your_huggingface_token
HF_MODEL_NAME=facebook/bart-large-cnn

# MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=notes_summarizer

# Backend
SECRET_KEY=your_secret_key
API_HOST=http://localhost:8000
API_PORT=8000
```

---

## 📊 Performance Characteristics

| Feature | Processing Time | Storage Type | Async |
|---------|-----------------|--------------|-------|
| Notes Summarization | 2-5s | MongoDB | Yes |
| Voice Transcription | 3-10s | MongoDB + Disk | Yes |
| PDF Analysis | 5-15s | MongoDB | Yes |
| Quiz Generation | 3-8s | MongoDB | Yes |
| Mind Map Generation | 2-4s | MongoDB | Yes |
| Image OCR | 2-8s | MongoDB + Disk | Yes |
| Chatbot Response | 1-3s | MongoDB | Yes |
| Research | 10-30s | MongoDB | Yes |

---

## 🔄 Real-time Features

- **Chatbot:** Streaming responses via WebSocket (optional)
- **History Sync:** Auto-sync across tabs via MongoDB
- **Notifications:** Toast notifications via react-hot-toast
- **Voice Recording:** Web Audio API with real-time waveform visualization

---

## 🛡️ Security Features

- Firebase token-based authentication
- JWT validation on all protected endpoints
- User ID scoping for all database queries
- CORS configured for localhost (adjustable for production)
- Input validation with Pydantic
- File upload size limits (10MB max)
- Secure password handling (Firebase managed)

---

## 📈 Scalability Considerations

1. **Database:** Switch from local MongoDB to MongoDB Atlas (cloud)
2. **AI Processing:** Hugging Face Inference API scales automatically
3. **File Storage:** Move uploads folder to cloud (AWS S3, GCP, etc.)
4. **Frontend Deployment:** Vercel, Netlify, or similar
5. **Backend Deployment:** Docker containers + Kubernetes/AWS

---

## 🐛 Debugging & Monitoring

- **Frontend:** Browser DevTools, console.log, React DevTools
- **Backend:** FastAPI automatic docs at `/docs`
- **Logs:** Check uvicorn terminal output and MongoDB logs
- **Errors:** Error messages automatically logged and saved to MongoDB

---

## 📞 API Endpoints Summary

```
Authentication:
POST /api/auth/login
GET /api/auth/me

Processing:
POST /api/notes/summarize
POST /api/voice/transcribe
POST /api/pdf/upload
POST /api/chatbot/chat
POST /api/eli5/explain
POST /api/quiz/generate
POST /api/mindmap/generate
POST /api/research/search
POST /api/image/upload

Utilities:
GET /api/history/
GET /api/history/summary
POST /api/export/pdf
GET /api/profile

Health:
GET / (root health check)
GET /docs (API documentation)
```

---

## 🎓 Learning Resources

- **Hugging Face Models:** https://huggingface.co/models
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **React Hooks:** https://react.dev/reference/react
- **MongoDB:** https://www.mongodb.com/docs/

---

**Last Updated:** March 1, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
