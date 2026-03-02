# ThinkInk AI - Intelligent Educational Assistant

A comprehensive full-stack application that empowers students with AI-driven learning tools. ThinkInk AI helps you automatically summarize notes, transcribe voice recordings, extract text from PDFs, generate quizzes, create mind maps, and simplify complex topics.

## Features

- 🔐 **Authentication**: Firebase Authentication with Google sign-in and email/password
- 📝 **Notes Summarization**: AI-powered summarization of long text notes
- 🎤 **ChatBot**: Integrated chatbot for hands-on doubt clarification
- 😊 **Knowledge Gap**: Analysis of the topic and misunderstanding of the user and provide learning tips
- 📄 **PDF Processing**: Extract and process text from PDF documents
- 📸 **Image Processing**: Extract text from images using OCR
- ❓ **Quiz Generation**: Automatically generate quizzes from study materials
- 🧠 **Mind Map Creation**: Generate visual mind maps for complex topics
- 🔍 **Research Paper Search**: Search and summarize academic research papers
- 📥 **Export**: Export notes and content as PDF documents
- 📊 **User History**: Store and retrieve all user interactions and AI outputs
- 🎨 **Modern UI**: Beautiful React interface with Tailwind CSS
- 🌙 **Dark Mode**: Full dark mode support throughout the application

## Tech Stack

### Frontend
- **React 18** with JavaScript (JSX)
- **Tailwind CSS** for styling with dark mode support
- **Firebase Authentication** for user management
- **Axios** for API communication
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Recharts** for data visualization
- **Date-fns** for date utilities

### Backend
- **FastAPI** (Python) for REST API
- **Mistrel 7B** for AI integration 
- **SpeechRecognition** for voice processing
- **PyTesseract** for OCR (Optical Character Recognition)
- **PyPDF2 & pdfplumber** for PDF processing
- **MongoDB** for data storage
- **Motor** for async MongoDB operations
- **Pydantic** for data validation
- **Uvicorn** for ASGI server
- **Scholarly** for research paper search
- **WeasyPrint** for PDF export functionality
- **Transformers** for advanced NLP tasks
- **FFMPEG** for voice transcription

## Project Structure

```
AI-Notes-Generator-Hackelite/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── VoiceEmotionAnalysis.jsx
│   │   │   └── DownloadPdfButton.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── Voice.jsx
│   │   │   ├── PDF.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── MindMap.jsx
│   │   │   ├── ELI5.jsx
│   │   │   ├── Research.jsx
│   │   │   ├── Image.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/       # API and Firebase services
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   └── index.jsx       # Entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── notes.py
│   │   │   ├── voice.py
│   │   │   ├── voice_emotion.py
│   │   │   ├── pdf.py
│   │   │   ├── image.py
│   │   │   ├── quiz.py
│   │   │   ├── mindmap.py
│   │   │   ├── eli5.py
│   │   │   ├── research.py
│   │   │   ├── history.py
│   │   │   └── export.py
│   │   ├── core/           # Core configuration
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Utility functions
│   ├── uploads/            # User uploaded files (audio, temp)
│   ├── requirements.txt    # Python dependencies
│   └── main.py            # FastAPI application entry point
└── README.md              # Project documentation
```

## Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.9+**
- **MongoDB** (local or cloud instance)
- **Google Cloud Project** with Gemini API enabled
- **Firebase Project** for authentication
- **Tesseract OCR** (for image text extraction)
- **FFmpeg** (for audio/video processing)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-notes-generator.git
cd ai-notes-generator
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:3000`

#### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend API will start on `http://localhost:8000`

### Environment Configuration

#### Frontend `.env` file
Create `frontend/.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### Backend `.env` file
Create `backend/.env`:
```env
SECRET_KEY=your_secret_key_here
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=ai_notes_generator
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
HUGGING_FACE_API=your_huggingface_api_key
ENVIRONMENT=development
DEBUG=true
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Notes
- `POST /api/notes/summarize` - Summarize text notes
- `GET /api/notes` - Get all user notes
- `DELETE /api/notes/{id}` - Delete a note

### Voice
- `POST /api/voice/transcribe` - Convert voice to text
- `POST /api/voice/analyze-emotion` - Analyze emotional tone from voice recording

### PDF
- `POST /api/pdf/extract` - Extract text from PDF
- `POST /api/pdf/process` - Process and summarize PDF content

### Image
- `POST /api/image/extract-text` - Extract text from image using OCR
- `POST /api/image/upload` - Upload and process image

### Quiz
- `POST /api/quiz/generate` - Generate quizzes from study materials
- `GET /api/quiz/{id}` - Get quiz details

### Mind Map
- `POST /api/mindmap/create` - Create mind maps from topics

### ELI5
- `POST /api/eli5/simplify` - Simplify complex topics

### Research
- `POST /api/research/search` - Search academic research papers
- `GET /api/research/papers` - Get research papers with summaries

### History
- `GET /api/history` - Get user interaction history
- `DELETE /api/history/{id}` - Delete history entry
- `GET /api/history/stats` - Get user statistics

### Export
- `POST /api/export/pdf` - Export content as PDF

## Dark Mode Support

The application includes comprehensive dark mode support:
- Automatic system preference detection
- Manual toggle button in the navigation
- Theme persistence across sessions
- Smooth transitions between light and dark themes
- Consistent dark styling across all components

## Key Features Explained

### Notes Summarization
Upload or paste long notes, and the AI summarizes them into concise, comprehensive summaries. Perfect for studying large texts efficiently.

### Voice Transcription & Emotion Analysis
Record your thoughts or lectures. The app transcribes them to text and analyzes the emotional tone, providing insights about your stress levels or engagement.

### Quiz Generation
Automatically generate practice quizzes from any study material to test your knowledge and identify weak areas.

### Mind Maps
Visualize complex topics as interactive mind maps, making it easier to understand relationships between concepts.

### Research Paper Search
Search through academic databases to find relevant research papers and get AI-generated summaries.

### PDF & Image Processing
Extract text from PDFs or images (OCR) for further processing, summarization, or analysis.


## Development Guide

### Code Structure

**Frontend:**
- Components are organized by functionality in `/components`
- Pages represent full-screen views in `/pages`
- Services handle API communication in `/services`
- Contexts manage global state (Auth, Theme) in `/contexts`

**Backend:**
- API routes are organized by feature in `/app/api`
- Business logic is in `/app/services`
- Data models are defined in `/app/models`
- Database operations are in `/app/core/database.py`

### Running Tests

Backend tests:
```bash
cd backend
python -m pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
Build a Docker image or deploy directly to a hosting platform.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URL in `.env`
- Verify network connectivity to MongoDB server

### Audio Processing Issues
- Install FFmpeg: 
  - **Windows**: `choco install ffmpeg`
  - **macOS**: `brew install ffmpeg`
  - **Linux**: `sudo apt-get install ffmpeg`

### PDF/Image Processing Errors
- Ensure Tesseract OCR is installed:
  - **Windows**: Download from [UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
  - **macOS**: `brew install tesseract`
  - **Linux**: `sudo apt-get install tesseract-ocr`

### API Key Issues
- Verify all API keys are correctly set in `.env` files
- Check API key permissions in respective services (Google Cloud, Firebase)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Quality Standards
- Follow PEP 8 for Python code
- Follow ESLint configuration for JavaScript/React code
- Write meaningful commit messages
- Add tests for new features

## License

MIT License - See LICENSE file for details

## Support & Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact: [your-email@example.com](mailto:your-email@example.com)
- Documentation: See individual markdown files in the project root

## Acknowledgments

- Built with FastAPI, React, and MongoDB
- AI powered by Meta Mistral 7B
- UI components from Lucide React and Tailwind CSS
- Voice processing with Python SpeechRecognition
- PDF processing with PyPDF2 and pdfplumber