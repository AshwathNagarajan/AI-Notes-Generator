# ThinkInk AI - Intelligent Educational Assistant

A comprehensive full-stack application that empowers students with AI-driven learning tools. ThinkInk AI helps you automatically summarize notes, transcribe voice recordings, extract text from PDFs, generate quizzes, create mind maps, simplify complex topics, and analyze your learning patterns with an integrated admin dashboard.

## 🎯 Key Features

### User Features
- 🔐 **Firebase Authentication**: Secure user login with Google OAuth and email/password
- 📝 **Notes Summarization**: AI-powered abstractive summarization using Hugging Face BART model
- 🎤 **Voice Transcription & Emotion Analysis**: Convert voice to text and analyze emotional sentiment
- 💬 **AI Chatbot**: Integrated conversation agent for intelligent doubt clarification
- 📊 **Knowledge Gap Radar**: Topic-aware analysis identifying learning gaps and misconceptions
- 📄 **PDF Processing**: Extract, analyze, and summarize PDF documents
- 📸 **Image Text Extraction**: OCR-based text extraction from images and automatic summarization
- ❓ **Quiz Generation**: Automatically create practice quizzes with multiple difficulty levels
- 🧠 **Mind Map Creation**: Generate interactive visual mind maps for conceptual understanding
- 🔍 **Research Paper Search**: Search and retrieve summaries from academic databases
- 📥 **PDF Export**: Export notes, summaries, and analyses as professional PDF documents
- 📊 **User History**: Complete activity tracking with statistics and performance metrics
- 🎨 **Professional UI**: Industrial-grade React interface with premium design
- 🌙 **Complete Dark Mode**: Full dark theme with automatic system preference detection

### Admin Features
- 👨‍💼 **Admin Dashboard**: Comprehensive monitoring and analytics platform
- 📈 **User Statistics**: Real-time tracking of user counts, engagement metrics, and activity trends
- 👥 **User Management**: View all users, search, filter, and manage user profiles
- 📋 **Activity Monitoring**: Track feature usage, processing statistics, and system health
- 🔍 **User Profile Cards**: Detailed user information with beautiful modal cards
- 📊 **Feature Analytics**: Detailed breakdown of which features are most used
- 🎯 **Performance Metrics**: Monitor system performance and processing statistics

## 🚀 Tech Stack

### Frontend
- **React 18** with modern JavaScript (JSX)
- **Tailwind CSS** with custom industrial design theme
- **Firebase Authentication** for secure user management
- **Axios** for API communication with interceptors
- **React Router v6** for client-side routing
- **React Hot Toast** for user notifications
- **Lucide React** for professional icon library
- **Recharts** for interactive data visualization
- **Date-fns** for date/time utilities
- **Vite** for optimized build process (modern setup)

### Backend
- **FastAPI** (Python 3.9+) for high-performance REST API
- **Hugging Face Transformers** for multiple AI models:
  - **BART** (facebook/bart-large-cnn) for text summarization
  - **Automatic Speech Recognition (ASR)** for voice transcription
  - **Zero-shot Classification** for knowledge gap analysis
- **Hugging Face Inference API** with local model fallback support
- **SpeechRecognition** for voice processing pipeline
- **PyTesseract & Pillow** for OCR (Optical Character Recognition)
- **PyPDF2 & pdfplumber** for PDF document processing
- **MongoDB** for scalable document storage
- **Motor** for async MongoDB operations
- **Pydantic V2** for data validation and serialization
- **Uvicorn** for ASGI web server
- **Scholarly** for academic paper search and retrieval
- **WeasyPrint** for PDF generation and export
- **Python-dotenv** for environment configuration

## 📁 Project Structure

```
AI-Notes-Generator-Hackelite/
├── frontend/                      # React SPA frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Layout.jsx              # Main app layout
│   │   │   ├── ChatbotModal.jsx        # Chatbot interface
│   │   │   ├── VoiceRecorder.jsx       # Voice recording
│   │   │   ├── UserProfileCard.jsx     # User profile display
│   │   │   ├── UserListSection.jsx     # User list component
│   │   │   ├── UserInfoModal.jsx       # Admin user info modal
│   │   │   ├── DownloadPdfButton.jsx   # PDF export
│   │   │   └── ...
│   │   ├── pages/                # Full-screen page components
│   │   │   ├── Dashboard.jsx           # Main user dashboard
│   │   │   ├── Notes.jsx               # Notes summarization
│   │   │   ├── Voice.jsx               # Voice transcription
│   │   │   ├── PDF.jsx                 # PDF processing
│   │   │   ├── Image.jsx               # Image OCR
│   │   │   ├── Quiz.jsx                # Quiz generation
│   │   │   ├── MindMap.jsx             # Mind map creation
│   │   │   ├── ELI5.jsx                # Topic simplification
│   │   │   ├── Research.jsx            # Research paper search
│   │   │   ├── History.jsx             # Activity history
│   │   │   ├── KnowledgeGapRadar.jsx   # Learning gap analysis
│   │   │   ├── Profile.jsx             # User profile
│   │   │   ├── Login.jsx               # User login
│   │   │   ├── AdminLogin.jsx          # Admin authentication
│   │   │   ├── AdminDashboard.jsx      # Admin monitoring
│   │   │   └── UserManagement.jsx      # Admin user management
│   │   ├── services/             # API and external services
│   │   │   ├── authService.js
│   │   │   ├── historyService.js
│   │   │   ├── knowledgeGapService.js
│   │   │   └── ...
│   │   ├── contexts/             # React context providers
│   │   │   ├── AuthContext.jsx         # Authentication state
│   │   │   └── ThemeContext.jsx        # Dark/Light theme
│   │   ├── App.jsx               # Main app component
│   │   └── index.jsx             # Vite entry point
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind CSS config
│   ├── postcss.config.js          # PostCSS configuration
│   └── vite.config.js             # Vite build config
│
├── backend/                       # FastAPI backend application
│   ├── app/
│   │   ├── api/                  # API endpoints by feature
│   │   │   ├── admin.py               # Admin authentication & endpoints
│   │   │   ├── auth.py                # User authentication
│   │   │   ├── notes.py               # Notes summarization
│   │   │   ├── voice.py               # Voice transcription
│   │   │   ├── voice_emotion.py       # Emotion analysis
│   │   │   ├── pdf.py                 # PDF processing
│   │   │   ├── image.py               # Image OCR
│   │   │   ├── quiz.py                # Quiz generation
│   │   │   ├── mindmap.py             # Mind map creation
│   │   │   ├── eli5.py                # Topic simplification
│   │   │   ├── research.py            # Research paper search
│   │   │   ├── chatbot.py             # Chatbot endpoints
│   │   │   ├── knowledge_gap.py       # Knowledge gap analysis
│   │   │   ├── history.py             # History tracking
│   │   │   └── export.py              # PDF export
│   │   ├── services/             # Business logic services
│   │   │   ├── ai_service.py          # Hugging Face AI integration
│   │   │   ├── voice_service.py       # Voice processing
│   │   │   ├── image_service.py       # Image OCR
│   │   │   ├── pdf_service.py         # PDF extraction
│   │   │   ├── emotion_analysis_service.py
│   │   │   ├── research_service.py
│   │   │   └── ...
│   │   ├── models/               # Pydantic data models
│   │   │   ├── user.py
│   │   │   ├── history.py
│   │   │   ├── image.py
│   │   │   └── voice.py
│   │   ├── core/                 # Core configuration
│   │   │   ├── config.py              # Environment & settings
│   │   │   └── database.py            # MongoDB setup
│   │   └── __init__.py
│   ├── uploads/                  # File storage
│   │   ├── audio/                # Recorded audio files
│   │   └── temp/                 # Temporary files
│   ├── requirements.txt          # Python dependencies
│   ├── main.py                   # FastAPI application entry
│   ├── env.example               # Environment variables template
│   └── __pycache__/              # Python cache
│
├── Documentation/                 # Project documentation
│   ├── ADMIN_*.md                 # Admin system guides
│   ├── UI_REDESIGN_*.md           # UI transformation docs
│   ├── HUGGINGFACE_*.md           # AI integration docs
│   ├── FEATURES_AND_ARCHITECTURE.md
│   ├── HISTORY_FEATURE_GUIDE.md
│   └── ...
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
└── SETUP.md                       # Detailed setup guide
```

## ⚡ Quick Start

### Prerequisites
- **Node.js 16+** (18+ recommended) with npm
- **Python 3.9+** with pip
- **MongoDB** (local or cloud instance via MongoDB Atlas)
- **Tesseract OCR** (for image text extraction)
- **API Keys Required:**
  - Firebase API credentials
  - Hugging Face API key (for Inference API, optional if using local models)

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/AI-Notes-Generator-Hackelite.git
cd AI-Notes-Generator-Hackelite
```

#### 2. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp env.example .env

# Edit .env with your Firebase credentials
nano .env

# Start dev server
npm run dev
```
Frontend runs on `http://localhost:5173` (Vite)

#### 3. Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Create .env file
cp env.example .env

# Edit .env with your API keys and MongoDB URL
nano .env

# Start FastAPI server
uvicorn main:app --reload
```
Backend API runs on `http://localhost:8000`

### Environment Configuration

#### Frontend `.env` Example
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend `.env` Example
```env
# Server Configuration
DEBUG=true
ENVIRONMENT=development

# MongoDB
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/ai_notes_generator
DATABASE_NAME=ai_notes_generator

# Firebase
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id

# Hugging Face (optional - uses local models by default)
HF_API_KEY=your_huggingface_api_key
HF_MODEL_NAME=facebook/bart-large-cnn

# Security
SECRET_KEY=your_secret_key_here_change_in_production

# CORS
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### Admin Panel Setup
1. Access admin panel: `http://localhost:5173/admin/login`
2. Default credentials: 
   - Username: `admin`
   - Password: `thinkink3137`
3. Dashboard available at: `/admin/dashboard`

## 📡 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
POST   /api/auth/logout             - User logout
GET    /api/auth/me                 - Get current user profile
```

### Admin Endpoints
```
POST   /api/admin/login             - Admin authentication
GET    /api/admin/dashboard/stats   - User statistics
GET    /api/admin/users             - List all users (paginated)
GET    /api/admin/activities        - Recent platform activities
GET    /api/admin/user/{id}/activities - User-specific activities
GET    /api/admin/analytics         - Feature usage analytics
```

### Notes Summarization
```
POST   /api/notes/summarize         - Summarize text using BART model
GET    /api/notes/history           - Get user's note summaries
DELETE /api/notes/history/{id}      - Delete specific note
```

### Voice Processing
```
POST   /api/voice/transcribe        - Convert voice to text (ASR)
POST   /api/voice/analyze-emotion   - Analyze emotional tone
GET    /api/voice/history           - Get transcription history
```

### PDF Processing
```
POST   /api/pdf/extract             - Extract text from PDF
POST   /api/pdf/summarize           - Extract and summarize PDF
GET    /api/pdf/history             - Get PDF processing history
```

### Image Processing (OCR)
```
POST   /api/image/extract-text      - Extract text from image
POST   /api/image/summarize         - Extract and summarize image text
GET    /api/image/history           - Get image processing history
```

### Quiz Generation
```
POST   /api/quiz/generate           - Create quiz from content
GET    /api/quiz/{id}               - Get quiz details
POST   /api/quiz/{id}/submit        - Submit quiz answers
```

### Mind Map Creation
```
POST   /api/mindmap/create          - Generate mind map
GET    /api/mindmap/{id}            - Get mind map data
```

### Knowledge Gap Analysis
```
POST   /api/knowledge-gap/analyze   - Analyze learning gaps
GET    /api/knowledge-gap/report    - Get gap analysis report
```

### ELI5 (Explain Like I'm 5)
```
POST   /api/eli5/simplify           - Simplify complex topics
```

### Research Paper Search
```
POST   /api/research/search         - Search academic papers
GET    /api/research/{id}           - Get paper summary
```

### Chatbot
```
POST   /api/chatbot/chat            - Send message to chatbot
GET    /api/chatbot/history         - Get conversation history
```

### History & Analytics
```
GET    /api/history                 - Get user activity history
GET    /api/history/stats           - Get performance statistics
DELETE /api/history/{id}            - Delete history entry
DELETE /api/history                 - Clear all history
```

### Export
```
POST   /api/export/pdf              - Export content as PDF
```

## 🎨 UI/UX Design

### Industrial Design System
The application features a professional industrial design with:
- **Premium Color Palette**: Sophisticated slate blue (#4a7ba7) as primary, with carefully chosen secondaries
- **Advanced Animations**: Smooth 200-400ms transitions on interactive elements
- **Glassmorphism Effects**: Modern frosted glass design with backdrop blur
- **Responsive Layout**: Optimized for mobile, tablet, and desktop screens
- **Proper Spacing**: 16px, 20px, 24px grid system for visual hierarchy
- **Dark Mode**: Complete dark theme with system preference detection
- **Interactive Elements**: Hover effects with lift, glow, and scale animations
- **Professional Typography**: Clean, readable font hierarchy with proper sizing

### Dark Mode Support
The application includes comprehensive dark mode:
- Automatic system theme detection
- Manual toggle in navigation
- Persistent theme preferences across sessions
- Smooth transitions between light and dark modes
- Consistent dark styling across all 17+ components
- Optimized contrast for readability and accessibility

## 🎓 Core Features Explained

### Notes Summarization
Transform lengthy texts into concise, comprehensive summaries using advanced BART language model. Perfect for:
- Summarizing textbooks and lecture notes
- Quick content overview generation
- Key point extraction
- Study material preparation

### Voice Transcription & Emotion Analysis
Record thoughts, lectures, or explanations with simultaneous features:
- **Transcription**: Hugging Face ASR converts speech to text with high accuracy
- **Emotion Analysis**: Detects emotional sentiment from your voice
- **Stress Detection**: Identifies tension or excitement levels
- **Engagement Metrics**: Measures speaking pace and clarity
Perfect for capturing ideas while multitasking or analyzing your communication style.

### AI Chatbot
Integrated conversational agent for:
- Answering domain-specific questions
- Clarifying study doubts in real-time
- Learning support and tutoring
- Context-aware responses based on your content

### Knowledge Gap Radar
Advanced analysis system that identifies:
- Specific learning gaps in your knowledge
- Topics you struggle with
- Misconceptions and incorrect understandings
- Personalized learning recommendations
- Cognitive profile analysis
Helps you focus study efforts where they matter most.

### Quiz Generation
Automatically create practice quizzes with:
- Multiple choice questions
- Customizable difficulty levels
- Instant feedback and explanations
- Performance tracking
- Knowledge verification

### Mind Maps
Visualize complex topics as interactive mind maps:
- Hierarchical concept relationships
- Color-coded categories
- Expandable/collapsible branches
- Print-friendly export
Ideal for visual learners and complex topic comprehension.

### PDF & Image Processing
Extract and process documents:
- **PDF**: Full text extraction and summarization
- **Images**: OCR-based text extraction
- **Automatic Summarization**: Get insights from documents instantly
- **Batch Processing**: Handle multiple files efficiently

### Research Paper Search
Find and summarize academic papers:
- Search scholarly databases
- Automatic summarization of papers
- Citation extraction
- Learn from latest research
Perfect for thesis research and staying updated.

### Activity History
Complete tracking system with:
- All past interactions and outputs
- Timeline view of your learning journey
- Usage statistics and metrics
- Export capabilities
- Performance analytics

### Admin Dashboard (New)
Comprehensive monitoring platform with:
- **Real-time Statistics**: User counts, engagement metrics, feature usage
- **User Management**: View all users, search, filter, manage profiles
- **Activity Monitoring**: Track platform activities and trends
- **Beautiful User Cards**: Modal view of detailed user information
- **Analytics**: Feature usage breakdown and performance metrics
- **Activity Timeline**: Recent activities across platform


## 🛠️ Development Guide

### Project Architecture

**Frontend Architecture:**
- **Component-Based**: Modular React components with clear responsibilities
- **Context API**: Global state management for Auth and Theme
- **Service Layer**: Separated API communication logic
- **Page-Based Routing**: Clean URL structure with React Router v6
- **Responsive Design**: Mobile-first approach with Tailwind CSS

**Backend Architecture:**
- **FastAPI**: Modern, high-performance Python framework
- **RESTful API**: Clean, consistent endpoint design
- **Service Layer**: Business logic separated from API handlers
- **Database Abstraction**: MongoDB via Motor for async operations
- **Error Handling**: Comprehensive exception management

### Code Structure Deep Dive

**Frontend Components**
```
UserProfileCard.jsx       - Elegant profile display component
UserListSection.jsx       - Clickable user list with integration
UserInfoModal.jsx         - Admin modal for user details
ChatbotModal.jsx          - Conversation interface
VoiceRecorder.jsx         - Audio capture and processing
DownloadPdfButton.jsx     - PDF export functionality
Layout.jsx                - Main app wrapper with navigation
```

**Backend Services**
```
ai_service.py             - Hugging Face integration (BART, ASR, etc.)
voice_service.py          - Audio processing pipeline
image_service.py          - OCR and image text extraction
pdf_service.py            - PDF text extraction
emotion_analysis_service.py - Voice sentiment analysis
research_service.py       - Academic paper search
```

**Admin System**
```
Backend (admin.py):       - Admin API endpoints, authentication
Frontend (AdminLogin.jsx) - Login interface
AdminDashboard.jsx        - Main monitoring dashboard
UserManagement.jsx        - User list and management
UserInfoModal.jsx         - User detail modal
```

### Running Tests

**Backend Tests**
```bash
cd backend
python -m pytest tests/
```

**Frontend Tests**
```bash
cd frontend
npm test
```

### Building for Production

**Frontend Build**
```bash
cd frontend
npm run build
```
Output goes to `dist/` folder. Deploy to Vercel, Netlify, or any static host.

**Backend Deployment**
```bash
# Build Docker image (optional)
docker build -t thinkink-api .

# Or deploy directly
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Environment Variables Checklist

**Development Checklist:**
- [ ] MongoDB URI configured
- [ ] Firebase credentials set
- [ ] Hugging Face API key (optional)
- [ ] Secret key generated
- [ ] CORS origins configured
- [ ] Debug mode enabled

**Production Checklist:**
- [ ] All API keys from secure vault
- [ ] DEBUG=false
- [ ] ENVIRONMENT=production
- [ ] SECRET_KEY is strong (32+ chars)
- [ ] CORS_ORIGINS limited to your domain
- [ ] Database backups configured
- [ ] Error logging enabled

## 🔧 Troubleshooting

### MongoDB Connection Issues
**Problem**: Cannot connect to MongoDB
```
Error: couldn't connect to server 127.0.0.1:27017
```

**Solutions**:
- Ensure MongoDB is running: `mongod` (local) or check MongoDB Atlas status
- Verify MONGODB_URL in `.env` is correct
- Check network connectivity and firewall rules
- For MongoDB Atlas: whitelist your IP address

### Hugging Face Integration Issues
**Problem**: API rate limit exceeded or model not found
```
Error: 429 Too Many Requests or Model not found
```

**Solutions**:
- Get free Hugging Face API key: https://huggingface.co/settings/tokens
- Add to `.env`: `HF_API_KEY=hf_xxxxxxxxxxxx`
- Application automatically falls back to local models if API fails
- Local models require ~4GB RAM (BART) and ~2GB (ASR)

### Voice Processing Issues
**Problem**: Voice transcription fails or produces garbled text
```
Error: Speech recognition failed or No audio detected
```

**Solutions**:
- Check microphone permissions in browser
- Ensure clear audio with minimal background noise
- Try shorter audio clips first
- Clear browser cache and try again
- Check that ASR model is properly loaded

### Image OCR Issues
**Problem**: Text not extracted from images or very inaccurate
```
Error: Tesseract not found or Invalid image format
```

**Solutions**:
- Install Tesseract OCR:
  - **Windows**: [Download installer](https://github.com/UB-Mannheim/tesseract/wiki)
  - **macOS**: `brew install tesseract`
  - **Linux**: `sudo apt-get install tesseract-ocr`
- Check image quality and resolution
- Ensure text is horizontal and not rotated
- Try PNG or JPG formats (avoid TIFF on Windows)

### PDF Processing Errors
**Problem**: PDF extraction fails or returns empty text
```
Error: No text found in PDF or Corrupted file
```

**Solutions**:
- Check PDF is not image-based (scanned document)
- Try another PDF to confirm format support
- Check file permissions (read access)
- Ensure PDF is not password-protected
- For scanned PDFs, use Image OCR instead

### Frontend Port Already in Use
**Problem**: `Port 5173 is already in use`

**Solutions**:
```bash
# Find and kill process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5173
kill -9 <PID>
```

### CORS Errors
**Problem**: `Access to XMLHttpRequest blocked by CORS`

**Solutions**:
- Verify backend CORS_ORIGINS in `.env`:
```env
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```
- For production, use actual domain:
```env
CORS_ORIGINS=["https://yourdomain.com", "https://app.yourdomain.com"]
```

### Firebase Authentication Issues
**Problem**: Cannot login or auth key invalid
```
Error: API key not valid or Permission denied
```

**Solutions**:
- Verify Firebase credentials in `.env`
- Check Firebase project is enabled
- Ensure Google Sign-in provider is enabled in Firebase Console
- Check web app is registered in Firebase project settings
- Verify domain is whitelisted in Firebase console

### Admin Panel Access Issues
**Problem**: Cannot access admin dashboard

**Solutions**:
- Verify you're using correct credentials (admin/thinkink3137)
- Check admin token is saved in localStorage
- Clear browser cache and login again
- Ensure backend admin.py is properly loaded
- Check admin endpoint: `http://localhost:8000/api/admin/login`

### Memory Issues
**Problem**: "OutOfMemory" error or app crashes

**Solutions**:
- For local Hugging Face models, ensure 4GB+ RAM available
- Reduce batch processing size
- Use Hugging Face Inference API instead (no local memory needed)
- Monitor system resources while processing
- Clear temporary files in `backend/uploads/temp/`

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Make your changes
4. Commit with clear message: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/AmazingFeature`
6. Open a Pull Request

### Code Quality Standards
**Python (Backend)**:
- Follow PEP 8 style guide
- Use type hints for function parameters
- Write docstrings for classes and functions
- Run: `black` and `isort` for formatting
- Minimum Python 3.9 compatibility

**JavaScript/React (Frontend)**:
- Follow ESLint configuration
- Use functional components with hooks
- Write meaningful variable and function names
- Test components with reasonable coverage
- Use Prettier for formatting

### Commit Message Convention
```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Code style changes (formatting, semicolons, etc.)
refactor: Code refactoring without feature change
test: Add or update tests
chore: Build, dependencies, or tooling changes
```

### Pull Request Process
1. Update README.md with any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Request review from maintainers
5. Address feedback promptly
6. Rebase on main before merging

## 📄 License

MIT License - See [LICENSE](LICENSE) file for full details

## 💬 Support & Contact

### Get Help
- 📧 **Email**: support@thinkink.ai (example)
- 💬 **Issues**: Open an issue on GitHub for bug reports
- 💡 **Discussions**: GitHub Discussions for feature requests
- 📚 **Documentation**: Check specific guides:
  - [ADMIN_GETTING_STARTED.md](ADMIN_GETTING_STARTED.md) - Admin system setup
  - [SETUP.md](SETUP.md) - Detailed installation guide
  - [FEATURES_AND_ARCHITECTURE.md](FEATURES_AND_ARCHITECTURE.md) - Features overview
  - [HUGGINGFACE_MIGRATION.md](HUGGINGFACE_MIGRATION.md) - AI integration details

### Community
- GitHub Discussions for feature ideas
- GitHub Issues for bug reports
- Pull Requests welcome!

## 🙏 Acknowledgments

### Core Technologies
- **FastAPI** - Modern Python web framework
- **React 18** - UI library
- **MongoDB** - NoSQL database
- **Tailwind CSS** - Utility-first CSS framework

### AI & ML
- **Hugging Face** - Open-source AI models and Inference API
- **Transformers** - State-of-the-art NLP models
- **PyTorch** - Deep learning framework

### Services & APIs
- **Firebase** - Authentication and cloud services
- **Scholarly** - Academic paper search
- **PyTesseract** - OCR engine binding

### UI/UX Components
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library
- **React Router** - Client-side routing

### Community & Contributors
Thanks to all contributors, issue reporters, and users who help improve ThinkInk AI!

---

**Happy Learning! 🚀**

*ThinkInk AI - Empowering Students with Intelligent Learning Tools*