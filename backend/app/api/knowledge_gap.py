from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List
import logging
import time
import json
from datetime import datetime

from app.api.auth import get_current_user
from app.models.user import UserResponse
from app.core.database import get_collection
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)
router = APIRouter()

class MissingPrerequisite(BaseModel):
    concept: str
    why_missing: str
    importance_level: int

class RecommendedLesson(BaseModel):
    title: str
    focus: str
    estimated_time_minutes: int

class KnowledgeGapResponse(BaseModel):
    studied_topic: str
    core_concepts_detected: List[str]
    missing_prerequisites: List[MissingPrerequisite]
    recommended_micro_lessons: List[RecommendedLesson]
    processing_time: float

class KnowledgeGapRequest(BaseModel):
    topic: str
    quiz_mistakes: Optional[List[str]] = None
    explanation_requests: Optional[List[str]] = None
    cognitive_profile: Optional[str] = None

@router.post("/detect", response_model=KnowledgeGapResponse)
async def detect_knowledge_gaps(
    request: KnowledgeGapRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Detect knowledge gaps and missing prerequisites for a topic."""
    try:
        start_time = time.time()
        
        # Validate input
        if not request.topic.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Topic cannot be empty"
            )
        
        if len(request.topic) > 2000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Topic description too long. Maximum 2,000 characters allowed."
            )
        
        # Build context for AI
        context = {
            "topic": request.topic,
            "quiz_mistakes": request.quiz_mistakes or [],
            "explanation_requests": request.explanation_requests or [],
            "cognitive_profile": request.cognitive_profile or "general learner"
        }
        
        # Process with AI
        result = await ai_service.detect_knowledge_gaps(context)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Knowledge gap detection failed: {result.get('error', 'Unknown error')}"
            )
        
        processing_time = time.time() - start_time
        
        # Parse the response
        try:
            gap_data = result.get("response", {})
            
            # Validate and parse the response
            response = KnowledgeGapResponse(
                studied_topic=gap_data.get("studied_topic", request.topic),
                core_concepts_detected=gap_data.get("core_concepts_detected", []),
                missing_prerequisites=[
                    MissingPrerequisite(**prereq) 
                    for prereq in gap_data.get("missing_prerequisites", [])
                ],
                recommended_micro_lessons=[
                    RecommendedLesson(**lesson)
                    for lesson in gap_data.get("recommended_micro_lessons", [])
                ],
                processing_time=processing_time
            )
        except Exception as parse_error:
            logger.error(f"Error parsing knowledge gap response: {parse_error}, raw response: {gap_data}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse knowledge gap analysis"
            )
        
        # Save to history
        try:
            history_collection = get_collection("history")
            
            history_doc = {
                "user_id": current_user.firebase_uid,
                "feature_type": "knowledge_gap",
                "input_data": {
                    "topic": request.topic,
                    "quiz_mistakes": request.quiz_mistakes or [],
                    "explanation_requests": request.explanation_requests or [],
                    "cognitive_profile": request.cognitive_profile or "general"
                },
                "output_data": {
                    "core_concepts_count": len(response.core_concepts_detected),
                    "gaps_found": len(response.missing_prerequisites),
                    "lessons_recommended": len(response.recommended_micro_lessons)
                },
                "processing_time": processing_time,
                "status": "completed",
                "created_at": datetime.utcnow()
            }
            
            await history_collection.insert_one(history_doc)
        except Exception as history_error:
            logger.warning(f"Failed to save knowledge gap to history: {history_error}")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error detecting knowledge gaps: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to detect knowledge gaps"
        )

@router.get("/hints/{topic}")
async def get_learning_hints(
    topic: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get quick learning hints for a specific topic."""
    try:
        if not topic.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Topic cannot be empty"
            )
        
        # Get custom hints based on topic
        result = await ai_service.generate_learning_hints(topic)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate learning hints"
            )
        
        return {
            "topic": topic,
            "hints": result.get("response", []),
            "generated_at": datetime.utcnow()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating learning hints: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate learning hints"
        )
