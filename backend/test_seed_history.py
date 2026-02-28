"""
Test script to seed sample history data for testing the history feature.
Run with: python test_seed_history.py
This helps test the history endpoints and UI without actually running the feature APIs.
"""

import asyncio
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def seed_history_data():
    """Seed sample history data for testing."""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    history_collection = db['history']
    
    try:
        # Clear existing test data
        delete_result = await history_collection.delete_many(
            {"user_id": "test-user-firebase-uid"}
        )
        print(f"Cleared {delete_result.deleted_count} existing test records.")
        
        # Create test data for different features
        test_data = [
            # Notes - Summarization
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "notes",
                "status": "completed",
                "input_data": {
                    "text": "Machine learning is a subset of artificial intelligence that focuses on training algorithms...",
                    "max_length": 200
                },
                "output_data": {
                    "summary": "ML is a subset of AI that trains algorithms to learn patterns from data.",
                    "key_points": ["Machine learning trains algorithms", "Uses pattern recognition", "Data-driven approach"],
                    "word_count": 45
                },
                "processing_time": 1.23,
                "created_at": datetime.utcnow() - timedelta(hours=2)
            },
            # Notes - Key Points Extraction
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "notes",
                "status": "completed",
                "input_data": {
                    "text": "Photosynthesis is the process by which plants convert light energy into chemical energy..."
                },
                "output_data": {
                    "key_points": ["Light energy conversion", "Chlorophyll role", "Glucose production"],
                    "important_facts": ["Occurs in plant leaves", "Uses carbon dioxide and water"],
                    "main_ideas": ["Energy transformation", "Plant nutrition"],
                    "vocabulary": ["Photosynthesis", "Chlorophyll", "Glucose"]
                },
                "processing_time": 0.89,
                "created_at": datetime.utcnow() - timedelta(hours=4)
            },
            # Voice - Transcription
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "voice",
                "status": "completed",
                "input_data": {
                    "filename": "lecture_001.mp3",
                    "file_size": 2048000
                },
                "output_data": {
                    "transcription": "Today we will discuss the principles of quantum mechanics and wave-particle duality...",
                    "word_count": 156,
                    "confidence": 0.94
                },
                "processing_time": 3.45,
                "created_at": datetime.utcnow() - timedelta(hours=1)
            },
            # Voice - Emotion Analysis
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "voice_emotion",
                "status": "completed",
                "input_data": {
                    "filename": "audio_emotion.wav"
                },
                "output_data": {
                    "primary_emotion": "happy",
                    "confidence": 0.87,
                    "emotions": {
                        "happy": 0.87,
                        "neutral": 0.09,
                        "sad": 0.02,
                        "angry": 0.01,
                        "fearful": 0.01
                    }
                },
                "processing_time": 2.15,
                "created_at": datetime.utcnow() - timedelta(hours=5)
            },
            # PDF Processing
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "pdf",
                "status": "completed",
                "input_data": {
                    "filename": "research_paper.pdf",
                    "file_size": 5242880,
                    "total_pages": 12
                },
                "output_data": {
                    "word_count": 4500,
                    "extraction_method": "pdfplumber",
                    "pages_processed": 12
                },
                "processing_time": 4.56,
                "created_at": datetime.utcnow() - timedelta(hours=3)
            },
            # Quiz Generation
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "quiz",
                "status": "completed",
                "input_data": {
                    "text": "The water cycle involves evaporation, condensation, and precipitation...",
                    "num_questions": 5
                },
                "output_data": {
                    "total_questions": 5,
                    "questions": [
                        {"question": "What are the main stages of the water cycle?", "difficulty": "easy"},
                        {"question": "Explain the role of evaporation in the water cycle.", "difficulty": "medium"}
                    ]
                },
                "processing_time": 2.78,
                "created_at": datetime.utcnow() - timedelta(hours=6)
            },
            # Mind Map Generation
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "mindmap",
                "status": "completed",
                "input_data": {
                    "topic": "Photosynthesis",
                    "complexity": "intermediate"
                },
                "output_data": {
                    "central_topic": "Photosynthesis",
                    "branches_count": 4,
                    "subtopics_count": 12,
                    "branches": ["Light Reactions", "Dark Reactions", "Chlorophyll", "Factors"]
                },
                "processing_time": 3.12,
                "created_at": datetime.utcnow() - timedelta(hours=7)
            },
            # ELI5 (Explain Like I'm 5)
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "eli5",
                "status": "completed",
                "input_data": {
                    "topic": "Black Holes",
                    "complexity_level": "easy"
                },
                "output_data": {
                    "simple_explanation": "A black hole is like a super strong vacuum in space that sucks in everything...",
                    "key_concepts_count": 3,
                    "examples_count": 2,
                    "analogies_count": 1
                },
                "processing_time": 2.34,
                "created_at": datetime.utcnow() - timedelta(hours=8)
            },
            # Image Processing
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "image",
                "status": "completed",
                "input_data": {
                    "filename": "diagram.png",
                    "file_size": 1048576
                },
                "output_data": {
                    "extracted_text": "This diagram shows the structure of a cell including nucleus, mitochondria...",
                    "summary": "Cell structure diagram",
                    "word_count": 28,
                    "character_count": 78
                },
                "processing_time": 1.67,
                "created_at": datetime.utcnow() - timedelta(hours=9)
            },
            # Research
            {
                "user_id": "test-user-firebase-uid",
                "feature_type": "research",
                "status": "completed",
                "input_data": {
                    "topic": "Machine Learning in Healthcare",
                    "num_papers": 5,
                    "summarization_type": "abstractive",
                    "summary_mode": "technical"
                },
                "output_data": {
                    "papers_count": 5,
                    "papers": [
                        {
                            "title": "Deep Learning for Medical Imaging",
                            "authors": ["Smith, J.", "Johnson, K."],
                            "year": "2023",
                            "citations": 156
                        }
                    ],
                    "has_comparative_analysis": True
                },
                "processing_time": 5.89,
                "created_at": datetime.utcnow() - timedelta(hours=10)
            }
        ]
        
        # Insert all test data
        result = await history_collection.insert_many(test_data)
        
        print(f"\n{'='*80}")
        print(f"✅ Successfully seeded {len(result.inserted_ids)} test history records!")
        print(f"{'='*80}")
        
        # Display summary
        print(f"\nYou can now:")
        print(f"  1. Run: python test_history_comprehensive.py")
        print(f"     To see all seeded history records organized by feature type")
        print(f"\n  2. Test the API endpoints:")
        print(f"     - GET /api/history/")
        print(f"     - GET /api/history/summary?days=30")
        print(f"     - GET /api/history/feature/notes")
        print(f"     - GET /api/history/feature/voice")
        print(f"     etc.")
        print(f"\n  3. Check the History page in the frontend UI")
        print(f"\nNote: Use user_id = 'test-user-firebase-uid' for testing")
        print(f"\n{'='*80}\n")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close connection
        client.close()
        print("Database connection closed.")

if __name__ == "__main__":
    print("Starting history data seeding...\n")
    asyncio.run(seed_history_data())
